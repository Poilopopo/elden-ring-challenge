// ============================================================
// ELDEN RING CHALLENGE
// ============================================================


// ============================================================
// DONNÉES
// ============================================================

const talismans = [

    { name: "Talisman 1", weight: 100 },

    { name: "Talisman 2", weight: 100 },

    { name: "Talisman 3", weight: 100 },

    { name: "Talisman 4", weight: 100 },

    // Le petit démon
    { name: "Daedicar's Woe", weight: 5 }

];


const armes = [

    { name: "Arme 1", weight: 100 },

    { name: "Arme 2", weight: 100 },

    { name: "Arme 3", weight: 100 },

    { name: "Arme 4", weight: 100 },

    { name: "Arme 5", weight: 100 }

];


const objectifs = [

    { name: "Objectif 1", weight: 100 },

    { name: "Objectif 2", weight: 100 },

    { name: "Objectif 3", weight: 100 },

    { name: "Objectif 4", weight: 100 },

    { name: "Objectif 5", weight: 100 }

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
// COULEURS
// ============================================================

const segmentColors = [

    "#302c22",
    "#3b3527",
    "#292720",
    "#443b2b",
    "#332f25",
    "#403827"

];


// ============================================================
// TIRAGE PONDÉRÉ
// ============================================================

function chooseWeightedItem(items) {

    const totalWeight =
        items.reduce(
            (total, item) =>
                total + item.weight,
            0
        );


    let random =
        Math.random() * totalWeight;


    for (const item of items) {

        random -= item.weight;


        if (random <= 0) {

            return item;

        }

    }


    return items[
        items.length - 1
    ];

}


// ============================================================
// DESSIN
// ============================================================

function drawWheel(wheel) {

    const canvas = wheel.canvas;


    if (!canvas) {

        return;

    }


    const ctx =
        canvas.getContext("2d");


    const size =
        canvas.width;


    const center =
        size / 2;


    const radius =
        size / 2 - 8;


    const items =
        wheel.items;


    if (!items.length) {

        return;

    }


    ctx.clearRect(
        0,
        0,
        size,
        size
    );


    const slice =
        (Math.PI * 2) /
        items.length;


    ctx.save();


    ctx.translate(
        center,
        center
    );


    ctx.rotate(
        wheel.rotation
    );


    // --------------------------------------------------------
    // SEGMENTS
    // --------------------------------------------------------

    items.forEach(
        (item, index) => {

            const startAngle =
                index * slice -
                Math.PI / 2;


            const endAngle =
                startAngle + slice;


            ctx.beginPath();


            ctx.moveTo(
                0,
                0
            );


            ctx.arc(
                0,
                0,
                radius,
                startAngle,
                endAngle
            );


            ctx.closePath();


            ctx.fillStyle =
                segmentColors[
                    index %
                    segmentColors.length
                ];


            ctx.fill();


            ctx.strokeStyle =
                "#806c3e";


            ctx.lineWidth = 2;


            ctx.stroke();


            // ------------------------------------------------
            // TEXTE
            // ------------------------------------------------

            ctx.save();


            const textAngle =
                startAngle +
                slice / 2;


            ctx.rotate(
                textAngle
            );


            ctx.translate(
                radius * 0.62,
                0
            );


            ctx.rotate(
                Math.PI / 2
            );


            let fontSize = 15;


            if (items.length > 15) {

                fontSize = 11;

            }


            if (items.length > 25) {

                fontSize = 8;

            }


            ctx.font =
                `600 ${fontSize}px Cinzel, Georgia, serif`;


            ctx.fillStyle =
                "#d8c28a";


            ctx.textAlign =
                "center";


            ctx.textBaseline =
                "middle";


            let text =
                item.name;


            const maxCharacters =
                items.length > 15
                    ? 16
                    : 22;


            if (
                text.length >
                maxCharacters
            ) {

                text =
                    text.substring(
                        0,
                        maxCharacters - 1
                    ) + "…";

            }


            ctx.fillText(
                text,
                0,
                0
            );


            ctx.restore();

        }
    );


    // --------------------------------------------------------
    // CENTRE
    // --------------------------------------------------------

    ctx.beginPath();


    ctx.arc(
        0,
        0,
        42,
        0,
        Math.PI * 2
    );


    ctx.fillStyle =
        "#15130e";


    ctx.fill();


    ctx.strokeStyle =
        "#b99a52";


    ctx.lineWidth = 4;


    ctx.stroke();


    ctx.font =
        "28px Georgia";


    ctx.fillStyle =
        "#c8a95c";


    ctx.textAlign =
        "center";


    ctx.textBaseline =
        "middle";


    ctx.fillText(
        "✦",
        0,
        1
    );


    ctx.restore();


    // --------------------------------------------------------
    // BORDURE
    // --------------------------------------------------------

    ctx.beginPath();


    ctx.arc(
        center,
        center,
        radius,
        0,
        Math.PI * 2
    );


    ctx.strokeStyle =
        "#b99a52";


    ctx.lineWidth = 5;


    ctx.stroke();

}


// ============================================================
// INITIALISATION
// ============================================================

Object.values(wheels)
    .forEach(
        wheel =>
            drawWheel(wheel)
    );


Object.values(singleWheels)
    .forEach(
        wheel =>
            drawWheel(wheel)
    );


// ============================================================
// ONGLET
// ============================================================

document
    .querySelectorAll(".tab")
    .forEach(
        tab => {

            tab.addEventListener(
                "click",
                () => {

                    const target =
                        tab.dataset.tab;


                    // Désactiver tous les boutons

                    document
                        .querySelectorAll(".tab")
                        .forEach(
                            button =>
                                button.classList
                                    .remove("active")
                        );


                    // Activer celui choisi

                    tab.classList.add(
                        "active"
                    );


                    // Masquer tous les contenus

                    document
                        .querySelectorAll(".tab-content")
                        .forEach(
                            content =>
                                content.classList
                                    .remove("active")
                        );


                    // Afficher le bon

                    const content =
                        document.getElementById(
                            `tab-${target}`
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
// BOUTON : TOURNER LES 3 ROUES
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
        Object.values(wheels)
            .some(
                wheel =>
                    wheel.spinning
            )
    ) {

        return;

    }


    button.disabled = true;


    button.textContent =
        "⚔ DESTIN EN COURS... ⚔";


    // Même durée pour les trois.
    // Elles finiront donc ensemble.

    spinWheel(
        "talisman",
        wheels
    );


    spinWheel(
        "arme",
        wheels
    );


    spinWheel(
        "objectif",
        wheels
    );

}


// ============================================================
// ROTATION D'UNE ROUE
// ============================================================

function spinWheel(
    type,
    wheelCollection
) {

    const wheel =
        wheelCollection[type];


    if (
        !wheel ||
        wheel.spinning
    ) {

        return;

    }


    wheel.spinning = true;


    // --------------------------------------------------------
    // RESULTAT
    // --------------------------------------------------------

    const selectedItem =
        chooseWeightedItem(
            wheel.items
        );


    const selectedIndex =
        wheel.items.indexOf(
            selectedItem
        );


    const slice =
        (Math.PI * 2) /
        wheel.items.length;


    // --------------------------------------------------------
    // POSITION CIBLE
    // --------------------------------------------------------

    const targetAngle =
        -(
            selectedIndex * slice +
            slice / 2
        );


    const fullTurn =
        Math.PI * 2;


    const current =
        wheel.rotation;


    const currentNormalized =
        (
            current % fullTurn +
            fullTurn
        ) % fullTurn;


    let difference =
        targetAngle -
        currentNormalized;


    while (
        difference < 0
    ) {

        difference +=
            fullTurn;

    }


    const extraTurns =
        7;


    const finalRotation =
        current +
        difference +
        extraTurns *
        fullTurn;


    // IMPORTANT :
    // exactement la même durée
    // pour les trois roues.

    const duration =
        4300;


    const startTime =
        performance.now();


    // --------------------------------------------------------
    // ANIMATION
    // --------------------------------------------------------

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


        const eased =
            1 -
            Math.pow(
                1 - progress,
                5
            );


        wheel.rotation =
            current +
            (
                finalRotation -
                current
            ) *
            eased;


        drawWheel(
            wheel
        );


        if (
            progress < 1
        ) {

            requestAnimationFrame(
                animate
            );

            return;

        }


        wheel.rotation =
            finalRotation;


        drawWheel(
            wheel
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
        // CHALLENGE : réactiver quand tout est fini
        // ----------------------------------------------------

        if (
            wheelCollection ===
            wheels
        ) {

            const stillSpinning =
                Object.values(
                    wheels
                ).some(
                    wheel =>
                        wheel.spinning
                );


            if (
                !stillSpinning
            ) {

                const button =
                    document.getElementById(
                        "spin-all"
                    );


                button.disabled =
                    false;


                button.textContent =
                    "⚔ TOURNER LES ROUES ⚔";

            }

        }

    }


    requestAnimationFrame(
        animate
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
            `#tab-${type} .single-spin`
        );


    if (button) {

        button.disabled = true;

        button.textContent =
            "DESTIN...";

    }


    spinWheel(
        type,
        singleWheels
    );


    // Surveillance de la fin

    const check =
        setInterval(
            () => {

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
// RESULTAT
// ============================================================

function showResult(
    type,
    item,
    single
) {

    const id =
        single
            ? `single-result-${type}`
            : `result-${type}`;


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


    name.textContent =
        item.name;


    result.animate(

        [
            {
                transform:
                    "scale(0.85)",

                opacity: 0.3

            },

            {
                transform:
                    "scale(1.08)",

                opacity: 1

            },

            {
                transform:
                    "scale(1)",

                opacity: 1

            }

        ],

        {

            duration: 500,

            easing:
                "ease-out"

        }

    );

}
