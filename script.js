// ============================================================
// ELDEN RING CHALLENGE
// ============================================================


// ============================================================
// POIDS DES OBJETS
// ============================================================
//
// Plus le poids est élevé, plus l'objet a de chances de sortir.
//
// Pour l'instant :
// Tous les objets = 100
// Daedicar's Woe = 5
//
// Les poids ne sont PAS affichés sur le site.
// ============================================================


const talismans = [
    { name: "Talisman 1", weight: 100 },
    { name: "Talisman 2", weight: 100 },
    { name: "Talisman 3", weight: 100 },
    { name: "Talisman 4", weight: 100 },

    // Daedicar's Woe est volontairement beaucoup plus rare
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
// CONFIGURATION
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


    return items[items.length - 1];
}


// ============================================================
// DESSIN DE LA ROUE
// ============================================================

function drawWheel(wheel) {

    const canvas = wheel.canvas;

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


    ctx.clearRect(
        0,
        0,
        size,
        size
    );


    if (items.length === 0) {
        return;
    }


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


    // Cercle intérieur

    ctx.beginPath();

    ctx.arc(
        0,
        0,
        radius,
        0,
        Math.PI * 2
    );

    ctx.fillStyle =
        "#17150f";

    ctx.fill();


    // Segments

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


            // Texte

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


    // Centre de la roue

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


    // Symbole

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


    // Bord extérieur

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
        wheel => drawWheel(wheel)
    );


// ============================================================
// TOURNER LES 3 ROUES
// ============================================================

function spinAll() {

    const button =
        document.getElementById(
            "spin-all"
        );


    // Empêche de relancer pendant le tirage

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


    // Lancer chaque roue

    Object.keys(wheels)
        .forEach(
            type =>
                spinWheel(type)
        );

}


// ============================================================
// ANIMATION D'UNE ROUE
// ============================================================

function spinWheel(type) {

    const wheel =
        wheels[type];


    wheel.spinning = true;


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


    // Position du segment choisi

    const targetAngle =
        -(
            selectedIndex * slice +
            slice / 2
        );


    // Nombre de tours complets

    const extraSpins =
        7 +
        Math.floor(
            Math.random() * 4
        );


    const startRotation =
        wheel.rotation;


    const currentNormalized =
        (
            startRotation %
            (Math.PI * 2) +
            Math.PI * 2
        ) %
        (Math.PI * 2);


    let difference =
        targetAngle -
        currentNormalized;


    while (
        difference < 0
    ) {

        difference +=
            Math.PI * 2;
    }


    const finalRotation =
        startRotation +
        difference +
        extraSpins *
        Math.PI * 2;


    // Petite variation de durée
    // pour que les trois roues
    // ne s'arrêtent pas exactement
    // en même temps.

    const duration =
        4000 +
        Math.random() * 1000;


    const startTime =
        performance.now();


    function animate(
        currentTime
    ) {

        const elapsed =
            currentTime -
            startTime;


        const progress =
            Math.min(
                elapsed /
                duration,
                1
            );


        // Accélération puis gros ralentissement

        const eased =
            1 -
            Math.pow(
                1 - progress,
                5
            );


        wheel.rotation =
            startRotation +
            (
                finalRotation -
                startRotation
            ) * eased;


        drawWheel(
            wheel
        );


        if (
            progress < 1
        ) {

            requestAnimationFrame(
                animate
            );

        } else {

            wheel.rotation =
                finalRotation;


            drawWheel(
                wheel
            );


            wheel.spinning =
                false;


            showResult(
                type,
                selectedItem
            );


            // Si toutes les roues
            // sont terminées,
            // on réactive le bouton.

            if (
                !Object.values(wheels)
                    .some(
                        wheel =>
                            wheel.spinning
                    )
            ) {

                const button =
                    document.getElementById(
                        "spin-all"
                    );


                button.disabled =
                    false;


                button.textContent =
                    "⚔ TOURNER LES TROIS ROUES ⚔";
            }

        }

    }


    requestAnimationFrame(
        animate
    );

}


// ============================================================
// AFFICHER LE RÉSULTAT
// ============================================================

function showResult(
    type,
    item
) {

    const result =
        document.getElementById(
            `result-${type}`
        );


    const name =
        result.querySelector(
            ".result-name"
        );


    name.textContent =
        item.name;


    // Animation du résultat

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
