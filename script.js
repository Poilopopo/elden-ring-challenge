// ============================================================
// ELDEN RING CHALLENGE
// MACHINE A SOUS
// ============================================================


// ============================================================
// CHARGEMENT DES FICHIERS TXT
// ============================================================

async function loadItems(filename) {

    try {

        const response = await fetch(filename);

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

            // Ignore les lignes vides
            .filter(function(line) {
                return line.length > 0;
            })

            // Ignore les commentaires
            .filter(function(line) {
                return !line.startsWith("#");
            })

            .map(function(line) {

                const parts =
                    line.split("|");


                const name =
                    parts[0].trim();


                // ------------------------------------------------
                // POIDS PAR DEFAUT
                // ------------------------------------------------

                let weight = 50;


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
// DONNEES
// ============================================================

let talismans = [];

let armes = [];

let objectifs = [];


// ============================================================
// MACHINES PRINCIPALES
// ============================================================

const wheels = {

    talisman: {

        canvas:
            document.getElementById(
                "wheel-talisman"
            ),

        items: talismans,

        spinning: false,

        selectedItem: null,

        animationId: null

    },


    arme: {

        canvas:
            document.getElementById(
                "wheel-arme"
            ),

        items: armes,

        spinning: false,

        selectedItem: null,

        animationId: null

    },


    objectif: {

        canvas:
            document.getElementById(
                "wheel-objectif"
            ),

        items: objectifs,

        spinning: false,

        selectedItem: null,

        animationId: null

    }

};


// ============================================================
// MACHINES INDIVIDUELLES
// ============================================================

const singleWheels = {

    talisman: {

        canvas:
            document.getElementById(
                "single-wheel-talisman"
            ),

        items: talismans,

        spinning: false,

        selectedItem: null,

        animationId: null

    },


    arme: {

        canvas:
            document.getElementById(
                "single-wheel-arme"
            ),

        items: armes,

        spinning: false,

        selectedItem: null,

        animationId: null

    },


    objectif: {

        canvas:
            document.getElementById(
                "single-wheel-objectif"
            ),

        items: objectifs,

        spinning: false,

        selectedItem: null,

        animationId: null

    }

};


// ============================================================
// COULEURS
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
// TIRAGE PONDERE
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
// OUTILS
// ============================================================

function getFontSize(canvas) {

    if (canvas.width >= 600) {
        return 25;
    }

    return 21;

}


function getVisibleRows(canvas) {

    if (canvas.width >= 600) {
        return 5;
    }

    return 5;

}


function getRowHeight(canvas) {

    return canvas.height / 5;

}


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
// DESSIN DE LA MACHINE A SOUS
// ============================================================

function drawSlotMachine(
    wheel,
    visibleItems,
    offset,
    finished
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
    // CADRE EXTERIEUR
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


    // --------------------------------------------------------
    // ZONE DES ITEMS
    // --------------------------------------------------------

    const rowHeight =
        getRowHeight(canvas);


    const centerY =
        height / 2;


    const fontSize =
        getFontSize(canvas);


    ctx.save();


    // Zone centrale légèrement plus sombre
    ctx.fillStyle =
        "#1a1710";


    ctx.fillRect(
        24,
        24,
        width - 48,
        height - 48
    );


    // --------------------------------------------------------
    // CLIP
    // --------------------------------------------------------

    ctx.beginPath();


    ctx.rect(
        24,
        24,
        width - 48,
        height - 48
    );


    ctx.clip();


    // --------------------------------------------------------
    // ITEMS
    // --------------------------------------------------------

    for (
        let i = 0;
        i < visibleItems.length;
        i++
    ) {

        const item =
            visibleItems[i];


        const y =
            centerY +
            (
                i - 2
            ) *
            rowHeight -
            offset;


        // ----------------------------------------------------
        // LIGNE
        // ----------------------------------------------------

        ctx.fillStyle =
            slotColors[
                i %
                slotColors.length
            ];


        ctx.fillRect(
            28,
            y - rowHeight / 2 + 2,
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


        // Ligne centrale plus lumineuse
        const distanceFromCenter =
            Math.abs(
                y - centerY
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
        // SEPARATION
        // ----------------------------------------------------

        ctx.strokeStyle =
            "#806c3e";


        ctx.lineWidth = 1;


        ctx.beginPath();


        ctx.moveTo(
            35,
            y + rowHeight / 2
        );


        ctx.lineTo(
            width - 35,
            y + rowHeight / 2
        );


        ctx.stroke();

    }


    ctx.restore();


    // --------------------------------------------------------
    // BANDEAU CENTRAL
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
    // FLECHES LATERALES
    // --------------------------------------------------------

    ctx.fillStyle =
        "#c8a95c";


    ctx.beginPath();


    ctx.moveTo(
        10,
        centerY
    );


    ctx.lineTo(
        28,
        centerY - 12
    );


    ctx.lineTo(
        28,
        centerY + 12
    );


    ctx.closePath();


    ctx.fill();


    ctx.beginPath();


    ctx.moveTo(
        width - 10,
        centerY
    );


    ctx.lineTo(
        width - 28,
        centerY - 12
    );


    ctx.lineTo(
        width - 28,
        centerY + 12
    );


    ctx.closePath();


    ctx.fill();


    // --------------------------------------------------------
    // TITRE
    // --------------------------------------------------------

    ctx.font =
        "700 " +
        (
            canvas.width >= 600
                ? 18
                : 15
        ) +
        "px Cinzel, Georgia, serif";


    ctx.fillStyle =
        "#c8a95c";


    ctx.textAlign =
        "center";


    ctx.textBaseline =
        "top";


    // --------------------------------------------------------
    // EFFET JACKPOT
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


        ctx.font =
            "700 " +
            (
                canvas.width >= 600
                    ? 18
                    : 15
            ) +
            "px Cinzel, Georgia, serif";


        ctx.fillStyle =
            "#f0d98f";


        ctx.textAlign =
            "center";


        ctx.textBaseline =
            "bottom";

    }

}


// ============================================================
// CREATION DE LA LISTE DE DEFILÉ
// ============================================================

function createSpinSequence(
    items,
    selectedItem
) {
    const sequence = [];

    if (!items.length) {
        return sequence;
    }

    // Nombre de cases parcourues pendant l'animation
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

    // --------------------------------------------------------
    // ANIMATION : on fait défiler des éléments aléatoires
    // --------------------------------------------------------

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
    // FIN DE L'ANIMATION
    //
    // On construit les 5 cases finales directement
    // depuis l'ordre du fichier TXT.
    // --------------------------------------------------------

    const selectedIndex =
        items.indexOf(
            selectedItem
        );

    // Deux éléments AVANT
    const previous2 =
        items[
            (
                selectedIndex - 2 +
                items.length
            ) %
            items.length
        ];

    const previous1 =
        items[
            (
                selectedIndex - 1 +
                items.length
            ) %
            items.length
        ];

    // Deux éléments APRÈS
    const next1 =
        items[
            (
                selectedIndex + 1
            ) %
            items.length
        ];

    const next2 =
        items[
            (
                selectedIndex + 2
            ) %
            items.length
        ];

    // --------------------------------------------------------
    // On ajoute la séquence finale
    // --------------------------------------------------------

    sequence.push(
        previous2
    );

    sequence.push(
        previous1
    );

    sequence.push(
        selectedItem
    );

    sequence.push(
        next1
    );

    sequence.push(
        next2
    );

    return sequence;
}


// ============================================================
// ANIMATION MACHINE A SOUS
// ============================================================

function spinSlotMachine(
    type,
    wheelCollection
) {

    const wheel =
        wheelCollection[type];


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


    wheel.selectedItem =
        selectedItem;


    const sequence =
        createSpinSequence(
            wheel.items,
            selectedItem
        );


    const canvas =
        wheel.canvas;


    const rowHeight =
        getRowHeight(canvas);


    const duration =
        4300;


    const startTime =
        performance.now();


    let lastStep =
        -1;


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


        // ----------------------------------------------------
        // EASING
        // ----------------------------------------------------

        const eased =
            1 -
            Math.pow(
                1 - progress,
                4
            );


        const selectedIndex =
            sequence.length - 3;
        
        const totalDistance =
            selectedIndex *
            rowHeight;


        const distance =
            eased *
            totalDistance;


        const currentStep =
            Math.floor(
                distance /
                rowHeight
            );


        const offset =
            distance %
            rowHeight;


        // ----------------------------------------------------
        // PETIT EFFET SONORE VISUEL
        // changement de ligne
        // ----------------------------------------------------

        if (
            currentStep !== lastStep
        ) {

            lastStep =
                currentStep;

        }


        // ----------------------------------------------------
        // Fenêtre visible
        // ----------------------------------------------------

        const visibleItems = [];


        const baseIndex =
            Math.min(
                currentStep,
                sequence.length - 1
            );


        for (
            let i = -2;
            i <= 2;
            i++
        ) {

            let index =
                baseIndex + i;


            if (
                index < 0
            ) {

                index = 0;

            }


            if (
                index >= sequence.length
            ) {

                index =
                    sequence.length - 1;

            }


            visibleItems.push(
                sequence[index]
            );

        }


        drawSlotMachine(
            wheel,
            visibleItems,
            offset,
            false
        );


        if (
            progress < 1
        ) {

            wheel.animationId =
                requestAnimationFrame(
                    animate
                );


            return;

        }


        // ----------------------------------------------------
        // FIN
        // ----------------------------------------------------

        const finalItems = [];
        
        for (
            let i = selectedIndex - 2;
            i <= selectedIndex + 2;
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
            true
        );


        wheel.spinning =
            false;


        wheel.animationId =
            null;


        showResult(
            type,
            selectedItem,
            wheelCollection ===
                singleWheels
        );


        // ----------------------------------------------------
        // FIN DES 3 MACHINES
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


    wheel.animationId =
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


    // --------------------------------------------------------
    // Mise à jour des machines
    // --------------------------------------------------------

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
    // Affichage initial
    // --------------------------------------------------------

    Object
        .values(wheels)
        .forEach(
            function(wheel) {

                drawSlotMachine(
                    wheel,
                    getInitialItems(
                        wheel.items
                    ),
                    0,
                    false
                );

            }
        );


    Object
        .values(singleWheels)
        .forEach(
            function(wheel) {

                drawSlotMachine(
                    wheel,
                    getInitialItems(
                        wheel.items
                    ),
                    0,
                    false
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
// ITEMS INITIAUX
// ============================================================

function getInitialItems(items) {

    if (
        !items ||
        !items.length
    ) {

        return [];

    }


    const result = [];


    for (
        let i = 0;
        i < 5;
        i++
    ) {

        result.push(
            items[
                i %
                items.length
            ]
        );

    }


    return result;

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
                            "tab-" + target
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
// BOUTON : TOURNER LES 3 MACHINES
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


    // --------------------------------------------------------
    // Vérification des listes
    // --------------------------------------------------------

    if (
        !talismans.length ||
        !armes.length ||
        !objectifs.length
    ) {

        console.error(
            "Une des listes est vide."
        );


        return;

    }


    button.disabled =
        true;


    button.textContent =
        "⚔ DESTIN EN COURS... ⚔";


    // --------------------------------------------------------
    // Lancement simultané
    // --------------------------------------------------------

    spinSlotMachine(
        "talisman",
        wheels
    );


    spinSlotMachine(
        "arme",
        wheels
    );


    spinSlotMachine(
        "objectif",
        wheels
    );

}


// ============================================================
// ROUE INDIVIDUELLE
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
