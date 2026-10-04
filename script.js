// ============================================================
// ELDEN RING CHALLENGE
// MACHINE A SOUS
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
                "Impossible de charger " +
                filename
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
                        Number.isFinite(
                            parsedWeight
                        ) &&
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
            "Erreur avec " +
            filename +
            ":",
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

    if (
        !items ||
        !items.length
    ) {

        return null;

    }


    const totalWeight =
        items.reduce(
            function(total, item) {

                return total +
                    item.weight;

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

    if (
        canvas.width >= 600
    ) {

        return 25;

    }


    return 21;

}


function getVisibleRows(canvas) {

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
        ctx.measureText(
            text
        ).width <= maxWidth
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
//
// IMPORTANT :
// On dessine TOUJOURS 7 éléments.
//
//      -3
//      -2
//      -1
//       0  <- résultat
//      +1
//      +2
//      +3
//
// Les 5 du milieu sont visibles.
// Les deux autres sont cachés naturellement par le cadre.
//
// Ainsi, pendant l'animation, les éléments entrent et sortent
// réellement de la fenêtre au lieu d'apparaître brutalement.
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
    // CADRE EXTERIEUR
    // --------------------------------------------------------

    ctx.strokeStyle =
        "#b99a52";


    ctx.lineWidth =
        8;


    ctx.strokeRect(
        8,
        8,
        width - 16,
        height - 16
    );


    ctx.strokeStyle =
        "#5d4d2e";


    ctx.lineWidth =
        3;


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
    // ZONE DE DEFILEMENT
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
    // DESSIN DES 7 ELEMENTS
    // --------------------------------------------------------

    for (
        let i = 0;
        i < visibleItems.length;
        i++
    ) {

        const item =
            visibleItems[i];


        if (!item) {

            continue;

        }


        const sequenceIndex =
            startSequenceIndex +
            i;


        const y =
            centerY +
            (
                i - 3
            ) *
            rowHeight -
            offset;


        // ----------------------------------------------------
        // COULEUR LIEE A L'ITEM
        //
        // On utilise sa position réelle dans le fichier TXT.
        //
        // Donc :
        //
        // item 1 = couleur 1
        // item 2 = couleur 2
        // item 3 = couleur 3
        //
        // et ainsi de suite.
        //
        // Les couleurs ne dépendent PAS de leur position
        // temporaire dans la fenêtre.
        // ----------------------------------------------------

        let itemIndex =
            wheel.items.indexOf(
                item
            );


        if (
            itemIndex < 0
        ) {

            itemIndex =
                sequenceIndex;

        }


        const colorIndex =
            (
                itemIndex %
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
        // SEPARATION ENTRE LES CASES
        // ----------------------------------------------------

        ctx.strokeStyle =
            "#806c3e";


        ctx.lineWidth =
            1;


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


    ctx.lineWidth =
        4;


    ctx.strokeRect(
        22,
        centralTop,
        width - 44,
        rowHeight
    );


    // --------------------------------------------------------
    // PAS DE CADRE SUPPLEMENTAIRE A LA FIN
    // --------------------------------------------------------
    //
    // volontairement rien ici.
    //
    // Cela évite les bandes dorées qui apparaissaient
    // brutalement autour de la machine lors de la révélation.
    // --------------------------------------------------------

}


// ============================================================
// CREATION DE LA LISTE DE DEFILEMENT
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
    // PETIT DEPART ALEATOIRE
    // --------------------------------------------------------

    for (
        let i = 0;
        i < 3;
        i++
    ) {

        const randomIndex =
            Math.floor(
                Math.random() *
                items.length
            );


        sequence.push(
            items[
                randomIndex
            ]
        );

    }


    // --------------------------------------------------------
    // PHASE DE SPIN
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
            items[
                randomIndex
            ]
        );

    }


    // --------------------------------------------------------
    // RESULTAT
    //
    // On ajoute exactement :
    //
    // -3
    // -2
    // -1
    // RESULTAT
    // +1
    // +2
    // +3
    //
    // en respectant STRICTEMENT l'ordre du fichier TXT.
    // --------------------------------------------------------

    const selectedIndex =
        items.indexOf(
            selectedItem
        );


    if (
        selectedIndex < 0
    ) {

        return sequence;

    }


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


    // --------------------------------------------------------
    // CHOIX DU RESULTAT
    // --------------------------------------------------------

    const selectedItem =
        chooseWeightedItem(
            wheel.items
        );


    wheel.selectedItem =
        selectedItem;


    // --------------------------------------------------------
    // CREATION DE LA SEQUENCE
    // --------------------------------------------------------

    const sequence =
        createSpinSequence(
            wheel.items,
            selectedItem
        );


    if (
        !sequence.length
    ) {

        wheel.spinning =
            false;

        return;

    }


    const canvas =
        wheel.canvas;


    const rowHeight =
        getRowHeight(
            canvas
        );


    // --------------------------------------------------------
    // POSITION DU RESULTAT
    //
    // Le résultat est le 4e élément de la partie finale :
    //
    // -3
    // -2
    // -1
    // RESULTAT
    // +1
    // +2
    // +3
    //
    // Donc : longueur - 4
    // --------------------------------------------------------

    const selectedSequenceIndex =
        sequence.length -
        4;


    const totalDistance =
        selectedSequenceIndex *
        rowHeight;


    // --------------------------------------------------------
    // DUREE
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


        // ----------------------------------------------------
        // EASING
        // ----------------------------------------------------

        const eased =
            1 -
            Math.pow(
                1 - progress,
                5
            );


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
        // FENETRE DE 7 ELEMENTS
        //
        // Les 5 du milieu sont visibles.
        //
        // Les 2 supplémentaires sont réellement dessinés
        // mais sont hors de la zone visible.
        // ----------------------------------------------------

        const visibleStartIndex =
            Math.max(
                0,
                currentStep - 3
            );


        const visibleItems = [];


        for (
            let i = 0;
            i < 7;
            i++
        ) {

            let index =
                visibleStartIndex +
                i;


            if (
                index < 0
            ) {

                index = 0;

            }


            if (
                index >=
                sequence.length
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
            false,
            visibleStartIndex
        );


        // ----------------------------------------------------
        // CONTINUER
        // ----------------------------------------------------

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
        // POSITION FINALE
        //
        // On garde 7 éléments autour du résultat :
        //
        // -3
        // -2
        // -1
        // RESULTAT
        // +1
        // +2
        // +3
        //
        // IMPORTANT :
        // on ne redessine PAS seulement 5 éléments.
        // Cela évite le fameux "5 qui apparaît à la fin".
        // --------------------------------------------------------

        const finalStartIndex =
            selectedSequenceIndex -
            3;


        const finalItems = [];


        for (
            let i = 0;
            i < 7;
            i++
        ) {

            finalItems.push(
                sequence[
                    finalStartIndex +
                    i
                ]
            );

        }


        drawSlotMachine(
            wheel,
            finalItems,
            0,
            true,
            finalStartIndex
        );


        wheel.spinning =
            false;


        wheel.animationId =
            null;


        // ----------------------------------------------------
        // RESULTAT TEXTE
        // ----------------------------------------------------

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
                    .values(
                        wheels
                    )
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
    // MISE A JOUR DES MACHINES
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
    // AFFICHAGE INITIAL ALEATOIRE
    // --------------------------------------------------------

    Object
        .values(
            wheels
        )
        .forEach(
            function(wheel) {

                const initialItems =
                    getInitialItems(
                        wheel.items
                    );


                if (
                    !initialItems.length
                ) {

                    return;

                }


                drawSlotMachine(
                    wheel,
                    initialItems,
                    0,
                    false,
                    wheel.items.indexOf(
                        initialItems[0]
                    )
                );

            }
        );


    Object
        .values(
            singleWheels
        )
        .forEach(
            function(wheel) {

                const initialItems =
                    getInitialItems(
                        wheel.items
                    );


                if (
                    !initialItems.length
                ) {

                    return;

                }


                drawSlotMachine(
                    wheel,
                    initialItems,
                    0,
                    false,
                    wheel.items.indexOf(
                        initialItems[0]
                    )
                );

            }
        );


    // --------------------------------------------------------
    // LOG
    // --------------------------------------------------------

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
//
// Au chargement de la page, on choisit un point de départ
// totalement aléatoire dans le fichier.
//
// Exemple :
//
// fichier :
// 1
// 2
// 3
// 4
// 5
//
// départ sur 4 :
//
// 4
// 5
// 1
// 2
// 3
//
// départ sur 1 :
//
// 1
// 2
// 3
// 4
// 5
//
// etc.
// ============================================================

function getInitialItems(items) {

    if (
        !items ||
        !items.length
    ) {

        return [];

    }


    const result = [];


    const startIndex =
        Math.floor(
            Math.random() *
            items.length
        );


    // --------------------------------------------------------
    // IMPORTANT :
    //
    // La machine dessine TOUJOURS 7 éléments :
    //
    // -3
    // -2
    // -1
    //  0  <- centre
    // +1
    // +2
    // +3
    //
    // On fournit donc 7 éléments dès le chargement.
    // --------------------------------------------------------

    for (
        let i = 0;
        i < 7;
        i++
    ) {

        result.push(
            items[
                (
                    startIndex +
                    i
                ) %
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
    .querySelectorAll(
        ".tab"
    )
    .forEach(
        function(tab) {

            tab.addEventListener(
                "click",
                function() {

                    const target =
                        tab.dataset.tab;


                    // ------------------------------------------------
                    // Boutons
                    // ------------------------------------------------

                    document
                        .querySelectorAll(
                            ".tab"
                        )
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


                    // ------------------------------------------------
                    // Contenus
                    // ------------------------------------------------

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


    // --------------------------------------------------------
    // Empêche de relancer pendant un spin
    // --------------------------------------------------------

    if (
        Object
            .values(
                wheels
            )
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
            ? "single-result-" +
              type
            : "result-" +
              type;


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
