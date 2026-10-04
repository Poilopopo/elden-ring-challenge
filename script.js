// ============================================================
// ELDEN RING CHALLENGE
// ============================================================


// ============================================================
// CHARGEMENT DES FICHIERS TXT
// ============================================================

async function loadItems(filename) {

    try {

        const response =
            await fetch(filename);

        if (!response.ok) {

            throw new Error(
                "Impossible de charger " + filename
            );

        }

        const text =
            await response.text();

        return text
            .split(/\r?\n/)
            .map(function(line) {
                return line.trim();
            })
            .filter(function(line) {
                return line.length > 0;
            })
            .filter(function(line) {
                return !line.startsWith("#");
            })
            .map(function(line) {

                const parts =
                    line.split("|");

                const name =
                    parts[0].trim();

                let weight = 100;

                if (
                    parts.length > 1 &&
                    parts[1].trim() !== ""
                ) {

                    const parsedWeight =
                        Number(
                            parts[1].trim()
                        );

                    if (
                        Number.isFinite(parsedWeight) &&
                        parsedWeight > 0
                    ) {

                        weight =
                            parsedWeight;

                    }

                }

                return {
                    name: name,
                    weight: weight
                };

            });

    }

    catch (error) {

        console.error(
            "Erreur avec " + filename + ":",
            error
        );

        return [];

    }

}


// ============================================================
// DONNÉES
// ============================================================

let talismans = [];
let armes = [];
let objectifs = [];


// ============================================================
// COULEURS DES BANDITS
// ============================================================

const slotColors = [

    "#302c22",
    "#3b3527",
    "#292720",
    "#443b2b",
    "#332f25",
    "#403827"

];


// ============================================================
// ROUES PRINCIPALES
// ============================================================

const wheels = {

    talisman: {

        canvas:
            document.getElementById(
                "wheel-talisman"
            ),

        items: talismans,

        rotation: 0,

        spinning: false

    },


    arme: {

        canvas:
            document.getElementById(
                "wheel-arme"
            ),

        items: armes,

        rotation: 0,

        spinning: false

    },


    objectif: {

        canvas:
            document.getElementById(
                "wheel-objectif"
            ),

        items: objectifs,

        rotation: 0,

        spinning: false

    }

};


// ============================================================
// ROUES INDIVIDUELLES
// ============================================================

const singleWheels = {

    talisman: {

        canvas:
            document.getElementById(
                "single-wheel-talisman"
            ),

        items: talismans,

        rotation: 0,

        spinning: false

    },


    arme: {

        canvas:
            document.getElementById(
                "single-wheel-arme"
            ),

        items: armes,

        rotation: 0,

        spinning: false

    },


    objectif: {

        canvas:
            document.getElementById(
                "single-wheel-objectif"
            ),

        items: objectifs,

        rotation: 0,

        spinning: false

    }

};


// ============================================================
// TIRAGE PONDÉRÉ
// ============================================================

function chooseWeightedItem(items) {

    const totalWeight =
        items.reduce(
            function(total, item) {

                return total + item.weight;

            },
            0
        );


    let random =
        Math.random() *
        totalWeight;


    for (
        const item of items
    ) {

        random -=
            item.weight;


        if (
            random <= 0
        ) {

            return item;

        }

    }


    return items[
        items.length - 1
    ];

}


// ============================================================
// HAUTEUR D'UNE CASE
// ============================================================

function getRowHeight(canvas) {

    if (
        canvas.width <= 450
    ) {

        return 72;

    }

    return 82;

}


// ============================================================
// TAILLE DU TEXTE
// ============================================================

function getFontSize(canvas) {

    if (
        canvas.width <= 450
    ) {

        return 18;

    }

    return 22;

}


// ============================================================
// TEXTE TROP LONG
// ============================================================

function truncateText(
    ctx,
    text,
    maxWidth
) {

    if (
        ctx.measureText(text).width <=
        maxWidth
    ) {

        return text;

    }


    let result =
        text;


    while (
        result.length > 1 &&
        ctx.measureText(
            result + "…"
        ).width > maxWidth
    ) {

        result =
            result.substring(
                0,
                result.length - 1
            );

    }


    return result + "…";

}


// ============================================================
// CRÉATION DU PREMIER AFFICHAGE
// ============================================================

function getInitialItems(items) {

    if (
        !items ||
        !items.length
    ) {

        return [];

    }


    const result = [];


    // Départ aléatoire dans le fichier
    const startIndex =
        Math.floor(
            Math.random() *
            items.length
        );


    for (
        let i = 0;
        i < 5;
        i++
    ) {

        const index =
            (
                startIndex +
                i
            ) %
            items.length;


        result.push(
            items[index]
        );

    }


    return result;

}


// ============================================================
// CRÉATION DE LA SÉQUENCE DE SPIN
// ============================================================

function createSpinSequence(
    items,
    selectedItem
) {

    const sequence = [];


    if (
        !items ||
        !items.length
    ) {

        return sequence;

    }


    // --------------------------------------------------------
    // PHASE DE DÉFILEMENT
    // --------------------------------------------------------

    const spinCount =
        Math.max(
            35,
            Math.min(
                70,
                Math.floor(
                    items.length * 0.4
                )
            )
        );


    for (
        let i = 0;
        i < spinCount;
        i++
    ) {

        const randomIndex =
            Math.floor(
                Math.random() *
                items.length
            );


        sequence.push(
            items[randomIndex]
        );

    }


    // --------------------------------------------------------
    // FIN DU SPIN
    //
    // On respecte l'ordre du fichier TXT.
    //
    // -3
    // -2
    // -1
    // RESULTAT
    // +1
    // +2
    // +3
    // --------------------------------------------------------

    const selectedIndex =
        items.indexOf(
            selectedItem
        );


    const before3 =
        items[
            (
                selectedIndex -
                3 +
                items.length
            ) %
            items.length
        ];


    const before2 =
        items[
            (
                selectedIndex -
                2 +
                items.length
            ) %
            items.length
        ];


    const before1 =
        items[
            (
                selectedIndex -
                1 +
                items.length
            ) %
            items.length
        ];


    const after1 =
        items[
            (
                selectedIndex +
                1
            ) %
            items.length
        ];


    const after2 =
        items[
            (
                selectedIndex +
                2
            ) %
            items.length
        ];


    const after3 =
        items[
            (
                selectedIndex +
                3
            ) %
            items.length
        ];


    sequence.push(
        before3
    );

    sequence.push(
        before2
    );

    sequence.push(
        before1
    );

    sequence.push(
        selectedItem
    );

    sequence.push(
        after1
    );

    sequence.push(
        after2
    );

    sequence.push(
        after3
    );


    return sequence;

}


// ============================================================
// DESSIN DU BANDIT MANCHOT
// ============================================================

function drawSlotMachine(
    wheel,
    visibleItems,
    offset,
    finished,
    startSequenceIndex
) {

    const canvas =
        wheel.canvas;


    if (!canvas) {
        return;
    }


    const ctx =
        canvas.getContext("2d");


    const width =
        canvas.width;


    const height =
        canvas.height;


    ctx.clearRect(
        0,
        0,
        width,
        height
    );


    // --------------------------------------------------------
    // FOND
    // --------------------------------------------------------

    ctx.fillStyle =
        "#110f0b";

    ctx.fillRect(
        0,
        0,
        width,
        height
    );


    // --------------------------------------------------------
    // CADRE EXTÉRIEUR
    // --------------------------------------------------------

    ctx.strokeStyle =
        "#b99a52";

    ctx.lineWidth = 8;

    ctx.strokeRect(
        8,
        8,
        width - 16,
        height - 16
    );


    ctx.strokeStyle =
        "#5d4d2e";

    ctx.lineWidth = 3;

    ctx.strokeRect(
        20,
        20,
        width - 40,
        height - 40
    );


    const rowHeight =
        getRowHeight(canvas);


    const centerY =
        height / 2;


    const fontSize =
        getFontSize(canvas);


    // --------------------------------------------------------
    // ZONE DE DÉFILEMENT
    // --------------------------------------------------------

    ctx.save();


    ctx.fillStyle =
        "#1a1710";

    ctx.fillRect(
        24,
        24,
        width - 48,
        height - 48
    );


    ctx.beginPath();

    ctx.rect(
        24,
        24,
        width - 48,
        height - 48
    );

    ctx.clip();


    // --------------------------------------------------------
    // AFFICHAGE DES ITEMS
    // --------------------------------------------------------

    for (
        let i = 0;
        i < visibleItems.length;
        i++
    ) {

        const item =
            visibleItems[i];


        const sequenceIndex =
            startSequenceIndex +
            i;


        const y =
            centerY +
            (
                i - 2
            ) *
            rowHeight -
            offset;


        // ----------------------------------------------------
        // COULEUR
        //
        // La couleur dépend de la position réelle dans la
        // séquence, et ne change donc pas artificiellement
        // lors du résultat final.
        // ----------------------------------------------------

        const colorIndex =
            (
                sequenceIndex %
                slotColors.length +
                slotColors.length
            ) %
            slotColors.length;


        ctx.fillStyle =
            slotColors[
                colorIndex
            ];


        ctx.fillRect(
            28,
            y -
                rowHeight / 2 +
                2,
            width - 56,
            rowHeight - 4
        );


        // ----------------------------------------------------
        // TEXTE
        // ----------------------------------------------------

        ctx.font =
            "600 " +
            fontSize +
            "px Cinzel, Georgia, serif";


        ctx.textAlign =
            "center";


        ctx.textBaseline =
            "middle";


        const text =
            truncateText(
                ctx,
                item.name,
                width - 90
            );


        const distanceFromCenter =
            Math.abs(
                y -
                centerY
            );


        if (
            distanceFromCenter <
            rowHeight * 0.35
        ) {

            ctx.fillStyle =
                "#f0d98f";

        }

        else {

            ctx.fillStyle =
                "#9b895c";

        }


        ctx.fillText(
            text,
            width / 2,
            y
        );


        // ----------------------------------------------------
        // SÉPARATION
        // ----------------------------------------------------

        ctx.strokeStyle =
            "#806c3e";

        ctx.lineWidth = 1;


        ctx.beginPath();


        ctx.moveTo(
            35,
            y +
                rowHeight / 2
        );


        ctx.lineTo(
            width - 35,
            y +
                rowHeight / 2
        );


        ctx.stroke();

    }


    ctx.restore();


    // --------------------------------------------------------
    // CADRE DE LA CASE CENTRALE
    // --------------------------------------------------------

    const centralTop =
        centerY -
        rowHeight / 2;


    ctx.fillStyle =
        "rgba(185,154,82,0.10)";


    ctx.fillRect(
        22,
        centralTop,
        width - 44,
        rowHeight
    );


    ctx.strokeStyle =
        "#c8a95c";


    ctx.lineWidth = 4;


    ctx.strokeRect(
        22,
        centralTop,
        width - 44,
        rowHeight
    );


    // --------------------------------------------------------
    // FIN DU SPIN
    // --------------------------------------------------------

    if (finished) {

        ctx.strokeStyle =
            "#e0bd62";


        ctx.lineWidth = 5;


        ctx.strokeRect(
            15,
            15,
            width - 30,
            height - 30
        );

    }

}


// ============================================================
// SPIN D'UN BANDIT
// ============================================================

function spinSlotMachine(
    wheel,
    type,
    wheelCollection
) {

    if (
        !wheel ||
        wheel.spinning ||
        !wheel.items ||
        !wheel.items.length
    ) {

        return;

    }


    wheel.spinning =
        true;


    const selectedItem =
        chooseWeightedItem(
            wheel.items
        );


    const sequence =
        createSpinSequence(
            wheel.items,
            selectedItem
        );


    // --------------------------------------------------------
    // Le résultat est à cet endroit dans la séquence
    // --------------------------------------------------------

    const selectedSequenceIndex =
        sequence.length - 4;


    const rowHeight =
        getRowHeight(
            wheel.canvas
        );


    // --------------------------------------------------------
    // Distance totale
    // --------------------------------------------------------

    const totalDistance =
        selectedSequenceIndex *
        rowHeight;


    // --------------------------------------------------------
    // ANIMATION
    // --------------------------------------------------------

    const duration =
        4300;


    const startTime =
        performance.now();


    function animate(now) {

        const elapsed =
            now -
            startTime;


        let progress =
            elapsed /
            duration;


        if (
            progress > 1
        ) {

            progress = 1;

        }


        // Ease-out très progressif
        const eased =
            1 -
            Math.pow(
                1 -
                progress,
                5
            );


        const distance =
            totalDistance *
            eased;


        // ----------------------------------------------------
        // Position flottante dans la séquence
        // ----------------------------------------------------

        const currentPosition =
            distance /
            rowHeight;


        const currentIndex =
            Math.floor(
                currentPosition
            );


        const offset =
            (
                currentPosition -
                currentIndex
            ) *
            rowHeight;


        // ----------------------------------------------------
        // Toujours 5 éléments visibles
        // ----------------------------------------------------

        const visibleItems = [];


        const visibleStartIndex =
            Math.max(
                0,
                currentIndex - 2
            );


        for (
            let i = 0;
            i < 5;
            i++
        ) {

            const index =
                Math.min(
                    visibleStartIndex +
                    i,
                    sequence.length - 1
                );


            visibleItems.push(
                sequence[index]
            );

        }


        drawSlotMachine(
            wheel,
            visibleItems,
            offset,
            false,
            visibleStartIndex
        );


        if (
            progress < 1
        ) {

            requestAnimationFrame(
                animate
            );


            return;

        }


        // ----------------------------------------------------
        // POSITION FINALE
        // ----------------------------------------------------

        const finalItems = [];


        for (
            let i =
                selectedSequenceIndex - 2;

            i <=
                selectedSequenceIndex + 2;

            i++
        ) {

            finalItems.push(
                sequence[i]
            );

        }


        drawSlotMachine(
            wheel,
            finalItems,
            0,
            true,
            selectedSequenceIndex - 2
        );


        wheel.spinning =
            false;


        showResult(
            type,
            selectedItem,
            wheelCollection ===
                singleWheels
        );


        // ----------------------------------------------------
        // FIN DES 3 BANDITS
        // ----------------------------------------------------

        if (
            wheelCollection ===
            wheels
        ) {

            const stillSpinning =
                Object
                    .values(wheels)
                    .some(
                        function(w) {

                            return w.spinning;

                        }
                    );


            if (
                !stillSpinning
            ) {

                const button =
                    document.getElementById(
                        "spin-all"
                    );


                if (button) {

                    button.disabled =
                        false;


                    button.textContent =
                        "⚔ TOURNER LES ROUES ⚔";

                }

            }

        }

    }


    requestAnimationFrame(
        animate
    );

}


// ============================================================
// INITIALISATION
// ============================================================

async function initialize() {

    console.log(
        "Chargement des listes Elden Ring..."
    );


    const results =
        await Promise.all([

            loadItems(
                "talismans.txt"
            ),

            loadItems(
                "armes.txt"
            ),

            loadItems(
                "objectifs.txt"
            )

        ]);


    talismans =
        results[0];


    armes =
        results[1];


    objectifs =
        results[2];


    wheels.talisman.items =
        talismans;


    wheels.arme.items =
        armes;


    wheels.objectif.items =
        objectifs;


    singleWheels.talisman.items =
        talismans;


    singleWheels.arme.items =
        armes;


    singleWheels.objectif.items =
        objectifs;


    // --------------------------------------------------------
    // Affichage initial aléatoire
    // --------------------------------------------------------

    Object
        .entries(wheels)
        .forEach(
            function(entry) {

                const wheel =
                    entry[1];


                const initialItems =
                    getInitialItems(
                        wheel.items
                    );


                drawSlotMachine(
                    wheel,
                    initialItems,
                    0,
                    false,
                    0
                );

            }
        );


    Object
        .entries(singleWheels)
        .forEach(
            function(entry) {

                const wheel =
                    entry[1];


                const initialItems =
                    getInitialItems(
                        wheel.items
                    );


                drawSlotMachine(
                    wheel,
                    initialItems,
                    0,
                    false,
                    0
                );

            }
        );


    console.log(
        "Talismans chargés : " +
        talismans.length
    );


    console.log(
        "Armes chargées : " +
        armes.length
    );


    console.log(
        "Objectifs chargés : " +
        objectifs.length
    );

}


// ============================================================
// ONGLET
// ============================================================

document
    .querySelectorAll(".tab")
    .forEach(
        function(tab) {

            tab.addEventListener(
                "click",
                function() {

                    const target =
                        tab.dataset.tab;


                    document
                        .querySelectorAll(".tab")
                        .forEach(
                            function(button) {

                                button.classList.remove(
                                    "active"
                                );

                            }
                        );


                    tab.classList.add(
                        "active"
                    );


                    document
                        .querySelectorAll(
                            ".tab-content"
                        )
                        .forEach(
                            function(content) {

                                content.classList.remove(
                                    "active"
                                );

                            }
                        );


                    const content =
                        document.getElementById(
                            "tab-" +
                            target
                        );


                    if (content) {

                        content.classList.add(
                            "active"
                        );

                    }

                }
            );

        }
    );


// ============================================================
// TOURNER LES 3 BANDITS
// ============================================================

function spinAll() {

    const button =
        document.getElementById(
            "spin-all"
        );


    if (!button) {
        return;
    }


    if (
        Object
            .values(wheels)
            .some(
                function(wheel) {

                    return wheel.spinning;

                }
            )
    ) {

        return;

    }


    button.disabled =
        true;


    button.textContent =
        "⚔ DESTIN EN COURS... ⚔";


    spinSlotMachine(
        wheels.talisman,
        "talisman",
        wheels
    );


    spinSlotMachine(
        wheels.arme,
        "arme",
        wheels
    );


    spinSlotMachine(
        wheels.objectif,
        "objectif",
        wheels
    );

}


// ============================================================
// TOURNER UNE SEULE MACHINE
// ============================================================

function spinSingle(type) {

    const wheel =
        singleWheels[type];


    if (
        !wheel ||
        wheel.spinning
    ) {

        return;

    }


    const button =
        document.querySelector(
            "#tab-" +
            type +
            " .single-spin"
        );


    if (button) {

        button.disabled =
            true;


        button.textContent =
            "DESTIN...";

    }


    spinSlotMachine(
        wheel,
        type,
        singleWheels
    );


    const check =
        setInterval(
            function() {

                if (
                    !wheel.spinning
                ) {

                    clearInterval(
                        check
                    );


                    if (button) {

                        button.disabled =
                            false;


                        button.textContent =
                            "✦ TOURNER ✦";

                    }

                }

            },
            50
        );

}


// ============================================================
// AFFICHAGE DU RESULTAT
// ============================================================

function showResult(
    type,
    item,
    single
) {

    const id =
        single
            ? "single-result-" + type
            : "result-" + type;


    const result =
        document.getElementById(
            id
        );


    if (!result) {
        return;
    }


    const name =
        result.querySelector(
            ".result-name"
        );


    if (!name) {
        return;
    }


    name.textContent =
        item.name;


    result.animate(
        [

            {
                transform:
                    "scale(0.85)",

                opacity:
                    0.3

            },

            {

                transform:
                    "scale(1.08)",

                opacity:
                    1

            },

            {

                transform:
                    "scale(1)",

                opacity:
                    1

            }

        ],

        {

            duration:
                500,

            easing:
                "ease-out"

        }

    );

}


// ============================================================
// LANCEMENT
// ============================================================

initialize();
