// ============================================================
// ELDEN RING CHALLENGE
// ============================================================


// ============================================================
// RÉGLAGES DES RARETÉS
// ============================================================

const rarityWeights = {
    "basique": 60,
    "moyen": 25,
    "rare": 10,
    "ultra-rare": 5
};


// ============================================================
// LISTES
// ============================================================

// Pour l'instant ce sont des exemples.
// Tu remplaceras simplement ces lignes par tes vrais objets.

const talismans = [
    { name: "Talisman 1", rarity: "basique" },
    { name: "Talisman 2", rarity: "basique" },
    { name: "Talisman 3", rarity: "moyen" },
    { name: "Talisman 4", rarity: "rare" },
    { name: "Talisman 5", rarity: "ultra-rare" }
];


const armes = [
    { name: "Arme 1", rarity: "basique" },
    { name: "Arme 2", rarity: "basique" },
    { name: "Arme 3", rarity: "moyen" },
    { name: "Arme 4", rarity: "rare" },
    { name: "Arme 5", rarity: "ultra-rare" }
];


const objectifs = [
    { name: "Objectif 1", rarity: "basique" },
    { name: "Objectif 2", rarity: "basique" },
    { name: "Objectif 3", rarity: "moyen" },
    { name: "Objectif 4", rarity: "rare" },
    { name: "Objectif 5", rarity: "ultra-rare" }
];


// ============================================================
// CONFIGURATION DES ROUES
// ============================================================

const wheels = {

    talisman: {
        canvas: document.getElementById("wheel-talisman"),
        items: talismans,
        rotation: 0,
        spinning: false
    },

    arme: {
        canvas: document.getElementById("wheel-arme"),
        items: armes,
        rotation: 0,
        spinning: false
    },

    objectif: {
        canvas: document.getElementById("wheel-objectif"),
        items: objectifs,
        rotation: 0,
        spinning: false
    }

};


// ============================================================
// COULEURS DES SEGMENTS
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
// RARETÉ
// ============================================================

function chooseWeightedRarity() {

    const totalWeight =
        Object.values(rarityWeights)
            .reduce((sum, weight) => sum + weight, 0);

    let random =
        Math.random() * totalWeight;

    for (const rarity in rarityWeights) {

        random -= rarityWeights[rarity];

        if (random <= 0) {
            return rarity;
        }

    }

    return "basique";
}


// ============================================================
// CHOISIR UN OBJET SELON SA RARETÉ
// ============================================================

function chooseWeightedItem(items) {

    // On choisit d'abord la rareté
    const rarity = chooseWeightedRarity();

    // On cherche les objets correspondant
    let possibleItems =
        items.filter(item => item.rarity === rarity);


    // Si aucune entrée n'existe pour cette rareté,
    // on utilise tous les objets disponibles.
    if (possibleItems.length === 0) {
        possibleItems = items;
    }


    const index =
        Math.floor(
            Math.random() * possibleItems.length
        );


    return possibleItems[index];
}


// ============================================================
// DESSIN DE LA ROUE
// ============================================================

function drawWheel(wheel) {

    const canvas = wheel.canvas;

    const ctx = canvas.getContext("2d");

    const size = canvas.width;

    const center = size / 2;

    const radius = size / 2 - 8;

    const items = wheel.items;

    ctx.clearRect(0, 0, size, size);


    if (items.length === 0) {
        return;
    }


    const slice =
        (Math.PI * 2) / items.length;


    // Rotation de la roue
    ctx.save();

    ctx.translate(center, center);

    ctx.rotate(wheel.rotation);


    // Cercle extérieur

    ctx.beginPath();

    ctx.arc(
        0,
        0,
        radius,
        0,
        Math.PI * 2
    );

    ctx.fillStyle = "#17150f";

    ctx.fill();


    // Segments

    items.forEach((item, index) => {

        const startAngle =
            index * slice - Math.PI / 2;

        const endAngle =
            startAngle + slice;


        ctx.beginPath();

        ctx.moveTo(0, 0);

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
                index % segmentColors.length
            ];

        ctx.fill();


        ctx.strokeStyle = "#806c3e";

        ctx.lineWidth = 2;

        ctx.stroke();


        // Texte

        ctx.save();

        const textAngle =
            startAngle + slice / 2;

        ctx.rotate(textAngle);

        ctx.translate(
            radius * 0.62,
            0
        );


        ctx.rotate(Math.PI / 2);


        let fontSize = 15;

        if (items.length > 15) {
            fontSize = 11;
        }

        if (items.length > 25) {
            fontSize = 8;
        }


        ctx.font =
            `600 ${fontSize}px Cinzel, Georgia, serif`;

        ctx.fillStyle = "#d8c28a";

        ctx.textAlign = "center";

        ctx.textBaseline = "middle";


        let text =
            item.name;


        // Coupe les noms trop longs
        const maxCharacters =
            items.length > 15 ? 16 : 22;


        if (text.length > maxCharacters) {
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

    });


    // Cercle central

    ctx.beginPath();

    ctx.arc(
        0,
        0,
        42,
        0,
        Math.PI * 2
    );

    ctx.fillStyle = "#15130e";

    ctx.fill();

    ctx.strokeStyle = "#b99a52";

    ctx.lineWidth = 4;

    ctx.stroke();


    // Symbole central

    ctx.font =
        "28px Georgia";

    ctx.fillStyle = "#c8a95c";

    ctx.textAlign = "center";

    ctx.textBaseline = "middle";

    ctx.fillText(
        "✦",
        0,
        1
    );


    ctx.restore();


    // Bordure extérieure

    ctx.beginPath();

    ctx.arc(
        center,
        center,
        radius,
        0,
        Math.PI * 2
    );

    ctx.strokeStyle = "#b99a52";

    ctx.lineWidth = 5;

    ctx.stroke();

}


// ============================================================
// INITIALISATION
// ============================================================

Object.values(wheels).forEach(wheel => {
    drawWheel(wheel);
});


// ============================================================
// ANIMATION DE LA ROUE
// ============================================================

function spinWheel(type) {

    const wheel =
        wheels[type];


    if (wheel.spinning) {
        return;
    }


    wheel.spinning = true;


    const button =
        document.querySelector(
            `.wheel-card:nth-child(${
                type === "talisman"
                    ? 1
                    : type === "arme"
                    ? 2
                    : 3
            }) button`
        );


    if (button) {
        button.disabled = true;
        button.textContent = "DESTIN...";
    }


    const selectedItem =
        chooseWeightedItem(wheel.items);


    const selectedIndex =
        wheel.items.indexOf(selectedItem);


    const slice =
        (Math.PI * 2) / wheel.items.length;


    // Position du segment choisi
    const targetAngle =
        -(
            selectedIndex * slice +
            slice / 2
        );


    // Plusieurs tours avant de s'arrêter
    const extraSpins =
        7 + Math.floor(Math.random() * 4);


    const startRotation =
        wheel.rotation;


    const currentNormalized =
        ((startRotation % (Math.PI * 2)) +
        Math.PI * 2) %
        (Math.PI * 2);


    let difference =
        targetAngle -
        currentNormalized;


    while (difference < 0) {
        difference += Math.PI * 2;
    }


    const finalRotation =
        startRotation +
        difference +
        extraSpins * Math.PI * 2;


    const duration = 4500;

    const startTime =
        performance.now();


    function animate(currentTime) {

        const elapsed =
            currentTime - startTime;


        const progress =
            Math.min(
                elapsed / duration,
                1
            );


        // Ease-out quintique
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


        drawWheel(wheel);


        if (progress < 1) {

            requestAnimationFrame(
                animate
            );

        } else {

            wheel.rotation =
                finalRotation;

            drawWheel(wheel);

            wheel.spinning = false;


            if (button) {
                button.disabled = false;
                button.textContent = "TOURNER";
            }


            showResult(
                type,
                selectedItem
            );

        }

    }


    requestAnimationFrame(
        animate
    );

}


// ============================================================
// AFFICHER LE RÉSULTAT
// ============================================================

function showResult(type, item) {

    const result =
        document.getElementById(
            `result-${type}`
        );


    const name =
        result.querySelector(
            ".result-name"
        );


    const rarity =
        result.querySelector(
            ".result-rarity"
        );


    name.textContent =
        item.name;


    rarity.textContent =
        item.rarity.replace(
            "-",
            " "
        );


    rarity.className =
        "result-rarity " +
        item.rarity;


    // Petite animation
    result.animate(
        [
            {
                transform: "scale(0.9)",
                opacity: 0.3
            },

            {
                transform: "scale(1.08)",
                opacity: 1
            },

            {
                transform: "scale(1)",
                opacity: 1
            }
        ],
        {
            duration: 500,
            easing: "ease-out"
        }
    );

}
