// ============================================================
// ELDEN RING CHALLENGE - SCRIPT COMPLET
// ============================================================

// ============================================================
// LANGUE
// ============================================================

let currentLanguage = localStorage.getItem("language") || "fr";

const translations = {
    fr: {
        title: "ELDEN RING CHALLENGE",
        subtitle: "LE DESTIN CHOISIRA POUR VOUS !",
        tabTalisman: "TALISMANS",
        tabArme: "ARMES",
        tabObjectif: "OBJECTIFS",

        wheelTalisman: "TALISMAN",
        wheelArme: "ARME",
        wheelObjectif: "OBJECTIF",

        spinAll: "🎰 TIRER LES 3 ROUEs !",

        singleTalisman: "TIRER UN TALISMAN",
        singleArme: "TIRER UNE ARME",
        singleObjectif: "TIRER UN OBJECTIF",

        resultTalisman: "TALISMAN",
        resultArme: "ARME",
        resultObjectif: "OBJECTIF",

        footer: "ELDEN RING CHALLENGE"
    },

    en: {
        title: "ELDEN RING CHALLENGE",
        subtitle: "FATE WILL CHOOSE FOR YOU!",
        tabTalisman: "TALISMANS",
        tabArme: "WEAPONS",
        tabObjectif: "OBJECTIVES",

        wheelTalisman: "TALISMAN",
        wheelArme: "WEAPON",
        wheelObjectif: "OBJECTIVE",

        spinAll: "🎰 SPIN ALL 3 WHEELS!",

        singleTalisman: "SPIN A TALISMAN",
        singleArme: "SPIN A WEAPON",
        singleObjectif: "SPIN AN OBJECTIVE",

        resultTalisman: "TALISMAN",
        resultArme: "WEAPON",
        resultObjectif: "OBJECTIVE",

        footer: "ELDEN RING CHALLENGE"
    }
};


// ============================================================
// OUTILS LANGUE
// ============================================================

function getItemName(item) {
    if (!item) return "";

    return currentLanguage === "en"
        ? item.nameEN
        : item.nameFR;
}


// ============================================================
// CHANGEMENT DE LANGUE
// ============================================================

function setLanguage(language) {
    currentLanguage = language;

    localStorage.setItem("language", language);

    updateInterface();
    redrawAllWheels();
}


// ============================================================
// MISE À JOUR DE L'INTERFACE
// ============================================================

function updateInterface() {
    const t = translations[currentLanguage];

    const title = document.getElementById("main-title");
    const subtitle = document.getElementById("subtitle");

    if (title) {
        title.textContent = t.title;
    }

    if (subtitle) {
        subtitle.textContent = t.subtitle;
    }


    // Onglets
    const tabTalisman = document.getElementById("tab-talisman");
    const tabArme = document.getElementById("tab-arme");
    const tabObjectif = document.getElementById("tab-objectif");

    if (tabTalisman) {
        tabTalisman.textContent = t.tabTalisman;
    }

    if (tabArme) {
        tabArme.textContent = t.tabArme;
    }

    if (tabObjectif) {
        tabObjectif.textContent = t.tabObjectif;
    }


    // Titres des roues
    const wheelTalisman = document.getElementById("wheel-title-talisman");
    const wheelArme = document.getElementById("wheel-title-arme");
    const wheelObjectif = document.getElementById("wheel-title-objectif");

    if (wheelTalisman) {
        wheelTalisman.textContent = t.wheelTalisman;
    }

    if (wheelArme) {
        wheelArme.textContent = t.wheelArme;
    }

    if (wheelObjectif) {
        wheelObjectif.textContent = t.wheelObjectif;
    }


    // Bouton principal
    const spinAllButton = document.getElementById("spin-all");

    if (spinAllButton) {
        spinAllButton.textContent = t.spinAll;
    }


    // Boutons individuels
    const singleTalisman = document.querySelector(
        '.single-spin[data-type="talisman"]'
    );

    const singleArme = document.querySelector(
        '.single-spin[data-type="arme"]'
    );

    const singleObjectif = document.querySelector(
        '.single-spin[data-type="objectif"]'
    );


    if (singleTalisman) {
        singleTalisman.textContent = t.singleTalisman;
    }

    if (singleArme) {
        singleArme.textContent = t.singleArme;
    }

    if (singleObjectif) {
        singleObjectif.textContent = t.singleObjectif;
    }


    // Footer
    const footer = document.getElementById("footer-text");

    if (footer) {
        footer.textContent = t.footer;
    }
}


// ============================================================
// CHARGEMENT DES FICHIERS TXT
// ============================================================

async function loadItems(filename) {

    try {

        const response = await fetch(filename);

        if (!response.ok) {
            throw new Error(
                `Impossible de charger ${filename}`
            );
        }

        const text = await response.text();

        const lines = text.split(/\r?\n/);

        const items = [];

        for (const line of lines) {

            const trimmed = line.trim();

            // Ignore lignes vides
            if (!trimmed) {
                continue;
            }

            // Ignore commentaires
            if (trimmed.startsWith("#")) {
                continue;
            }

            const parts = trimmed.split("|");

            const nameFR = parts[0]?.trim() || "";
            const nameEN = parts[1]?.trim() || "";
            const weight = parseFloat(parts[2]) || 1;
            const image = parts[3]?.trim() || "";

            if (!nameFR && !nameEN) {
                continue;
            }

            items.push({
                nameFR,
                nameEN,
                weight,
                image
            });
        }

        return items;

    } catch (error) {

        console.error(
            "Erreur chargement fichier :",
            filename,
            error
        );

        return [];
    }
}


// ============================================================
// CACHE DES IMAGES
// ============================================================

const wheelImageCache = {};


// ============================================================
// CHARGER UNE IMAGE
// ============================================================

function getWheelImage(wheel, item) {

    if (!wheel || !item) {
        return null;
    }

    if (!wheel.imageFolder) {
        return null;
    }

    if (!item.image) {
        return null;
    }


    const imageName = item.image.trim();

    if (!imageName) {
        return null;
    }


    // Retire éventuellement un "/" au début
    const cleanImageName = imageName.replace(/^\/+/, "");


    // Encode chaque morceau du chemin
    const encodedImageName = cleanImageName
        .split("/")
        .map(part => encodeURIComponent(part))
        .join("/");


    const imagePath =
        wheel.imageFolder + "/" + encodedImageName;


    // Déjà dans le cache
    if (wheelImageCache[imagePath]) {
        return wheelImageCache[imagePath];
    }


    const img = new Image();

    img.onload = function () {

        console.log(
            "IMAGE CHARGÉE :",
            imagePath
        );

        redrawAllWheels();
    };


    img.onerror = function () {

        console.warn(
            "IMAGE INTROUVABLE :",
            imagePath
        );
    };


    img.src = imagePath;


    wheelImageCache[imagePath] = img;

    return img;
}


// ============================================================
// PRÉCHARGEMENT DES IMAGES
// ============================================================

function preloadWheelImages(wheel, items) {

    if (!wheel || !items) {
        return;
    }

    for (const item of items) {
        getWheelImage(wheel, item);
    }
}


// ============================================================
// OBJETS DES ROUES
// ============================================================

const wheels = {

    talisman: {
        canvas: document.getElementById("wheel-talisman"),
        items: [],
        spinning: false,
        selectedItem: null,
        animationId: null,

        currentItems: [],
        currentOffset: 0,
        currentStartSequenceIndex: 0,

        imageFolder: "talisman_img",
        showImage: false
    },

    arme: {
        canvas: document.getElementById("wheel-arme"),
        items: [],
        spinning: false,
        selectedItem: null,
        animationId: null,

        currentItems: [],
        currentOffset: 0,
        currentStartSequenceIndex: 0,

        imageFolder: "arme_img",
        showImage: false
    },

    objectif: {
        canvas: document.getElementById("wheel-objectif"),
        items: [],
        spinning: false,
        selectedItem: null,
        animationId: null,

        currentItems: [],
        currentOffset: 0,
        currentStartSequenceIndex: 0,

        imageFolder: "objectif_img",
        showImage: false
    }
};


// ============================================================
// ROUES INDIVIDUELLES
// ============================================================

const singleWheels = {

    talisman: {
        canvas: document.getElementById("single-wheel-talisman"),
        items: [],
        spinning: false,
        selectedItem: null,
        animationId: null,

        currentItems: [],
        currentOffset: 0,
        currentStartSequenceIndex: 0,

        imageFolder: "talisman_img",
        showImage: false
    },

    arme: {
        canvas: document.getElementById("single-wheel-arme"),
        items: [],
        spinning: false,
        selectedItem: null,
        animationId: null,

        currentItems: [],
        currentOffset: 0,
        currentStartSequenceIndex: 0,

        imageFolder: "arme_img",
        showImage: false
    },

    objectif: {
        canvas: document.getElementById("single-wheel-objectif"),
        items: [],
        spinning: false,
        selectedItem: null,
        animationId: null,

        currentItems: [],
        currentOffset: 0,
        currentStartSequenceIndex: 0,

        imageFolder: "objectif_img",
        showImage: false
    }
};


// ============================================================
// COULEURS DES CASES
// ============================================================

const slotColors = [
    "#3d1c1c",
    "#1c2f3d",
    "#263d1f",
    "#3a2c1a",
    "#2d203d"
];


// ============================================================
// SÉLECTION PONDÉRÉE
// ============================================================

function chooseWeightedItem(items) {

    if (!items || items.length === 0) {
        return null;
    }

    const totalWeight = items.reduce(
        (sum, item) => sum + item.weight,
        0
    );

    let random = Math.random() * totalWeight;

    for (const item of items) {

        random -= item.weight;

        if (random <= 0) {
            return item;
        }
    }

    return items[items.length - 1];
}


// ============================================================
// CRÉATION DE LA SÉQUENCE DE SPIN
// ============================================================

function createSpinSequence(wheel) {

    const items = wheel.items;

    if (!items || items.length === 0) {
        return [];
    }


    // Item final choisi selon les probabilités
    const selectedItem = chooseWeightedItem(items);

    wheel.selectedItem = selectedItem;


    // On crée une longue séquence aléatoire
    // afin d'avoir suffisamment de matière pour l'animation.

    const sequenceLength = 35;

    const sequence = [];

    for (let i = 0; i < sequenceLength; i++) {

        sequence.push(
            items[
                Math.floor(Math.random() * items.length)
            ]
        );
    }


    // On place le résultat final vers la fin
    const finalIndex = sequenceLength - 4;

    sequence[finalIndex] = selectedItem;


    return {
        sequence,
        finalIndex,
        selectedItem
    };
}


// ============================================================
// DESSIN DE LA MACHINE À SOUS
// ============================================================

function drawSlotMachine(
    wheel,
    items,
    offset = 0,
    finished = false
) {

    const canvas = wheel.canvas;

    if (!canvas) {
        return;
    }


    // Conserve l'état d'affichage de l'image
    wheel.showImage = finished;


    const ctx = canvas.getContext("2d");

    const width = canvas.width;
    const height = canvas.height;


    // ========================================================
    // FOND
    // ========================================================

    ctx.clearRect(
        0,
        0,
        width,
        height
    );


    ctx.fillStyle = "#111";

    ctx.fillRect(
        0,
        0,
        width,
        height
    );


    // ========================================================
    // CADRE DORÉ
    // ========================================================

    ctx.strokeStyle = "#d4af37";
    ctx.lineWidth = 4;

    ctx.strokeRect(
        2,
        2,
        width - 4,
        height - 4
    );


    // ========================================================
    // PARAMÈTRES DES CASES
    // ========================================================

    const visibleRows = 5;

    const rowHeight =
        height / visibleRows;


    const fontSize =
        width >= 600 ? 25 : 21;


    ctx.font =
        `bold ${fontSize}px Arial`;


    ctx.textAlign = "center";
    ctx.textBaseline = "middle";


    // ========================================================
    // ZONE DE DÉFILEMENT
    // ========================================================

    ctx.save();

    ctx.beginPath();

    ctx.rect(
        0,
        0,
        width,
        height
    );

    ctx.clip();


    // ========================================================
    // DESSIN DES CASES
    // ========================================================

    for (let i = 0; i < items.length; i++) {

        const item = items[i];

        if (!item) {
            continue;
        }


        const y =
            (i * rowHeight)
            - offset
            + rowHeight / 2;


        // Si complètement hors écran
        if (
            y < -rowHeight ||
            y > height + rowHeight
        ) {
            continue;
        }


        // Distance avec le centre
        const centerY =
            height / 2;

        const distanceFromCenter =
            Math.abs(y - centerY);


        // ====================================================
        // COULEUR
        // ====================================================

        const color =
            slotColors[
                i % slotColors.length
            ];


        ctx.fillStyle = color;

        ctx.fillRect(
            0,
            y - rowHeight / 2,
            width,
            rowHeight
        );


        // ====================================================
        // TEXTE
        // ====================================================

        const text =
            getItemName(item);


        ctx.fillStyle =
            "#ffffff";


        ctx.font =
            `bold ${fontSize}px Arial`;


        ctx.textAlign =
            "center";

        ctx.textBaseline =
            "middle";


        ctx.fillText(
            text,
            width / 2,
            y
        );


        // ====================================================
        // IMAGE DU RÉSULTAT FINAL
        // ====================================================

        if (
            finished &&
            distanceFromCenter < rowHeight * 0.35 &&
            item.image &&
            wheel.imageFolder
        ) {

            const image =
                getWheelImage(
                    wheel,
                    item
                );


            if (
                image &&
                image.complete &&
                image.naturalWidth > 0
            ) {

                // Taille maximale de l'image
                const maxImageHeight =
                    rowHeight * 0.58;

                const maxImageWidth =
                    Math.min(
                        width * 0.16,
                        rowHeight * 0.58
                    );


                // Ratio de l'image
                const ratio =
                    image.naturalWidth /
                    image.naturalHeight;


                let imageWidth =
                    maxImageWidth;

                let imageHeight =
                    imageWidth / ratio;


                // Si trop haute
                if (
                    imageHeight >
                    maxImageHeight
                ) {

                    imageHeight =
                        maxImageHeight;

                    imageWidth =
                        imageHeight * ratio;
                }


                // ====================================================
                // POSITION À DROITE DU TEXTE
                // ====================================================

                const textWidth =
                    ctx.measureText(text).width;


                const spacing = 18;


                let imageX =
                    width / 2
                    + textWidth / 2
                    + spacing;


                const imageY =
                    y
                    - imageHeight / 2;


                // Empêche l'image de sortir de la roue
                if (
                    imageX + imageWidth >
                    width - 35
                ) {

                    imageX =
                        width
                        - 35
                        - imageWidth;
                }


                // ====================================================
                // DESSIN DE L'IMAGE
                // ====================================================

                ctx.drawImage(
                    image,
                    imageX,
                    imageY,
                    imageWidth,
                    imageHeight
                );
            }
        }


        // ====================================================
        // SÉPARATION ENTRE LES CASES
        // ====================================================

        ctx.strokeStyle =
            "rgba(212, 175, 55, 0.35)";

        ctx.lineWidth = 1;

        ctx.beginPath();

        ctx.moveTo(
            0,
            y + rowHeight / 2
        );

        ctx.lineTo(
            width,
            y + rowHeight / 2
        );

        ctx.stroke();
    }


    ctx.restore();


    // ========================================================
    // CASE CENTRALE
    // ========================================================

    const centerY =
        height / 2;


    ctx.strokeStyle =
        "#d4af37";

    ctx.lineWidth = 4;


    ctx.strokeRect(
        3,
        centerY - rowHeight / 2,
        width - 6,
        rowHeight
    );
}


// ============================================================
// REDESSIN DE TOUTES LES ROUES
// ============================================================

function redrawAllWheels() {

    // Roues principales

    for (const key in wheels) {

        const wheel =
            wheels[key];

        if (
            wheel.currentItems &&
            wheel.currentItems.length
        ) {

            drawSlotMachine(
                wheel,
                wheel.currentItems,
                wheel.currentOffset || 0,
                wheel.showImage || false
            );
        }
    }


    // Roues individuelles

    for (const key in singleWheels) {

        const wheel =
            singleWheels[key];

        if (
            wheel.currentItems &&
            wheel.currentItems.length
        ) {

            drawSlotMachine(
                wheel,
                wheel.currentItems,
                wheel.currentOffset || 0,
                wheel.showImage || false
            );
        }
    }
}


// ============================================================
// ANIMATION D'UNE ROUE
// ============================================================

function spinSlotMachine(
    wheel,
    onComplete
) {

    if (
        !wheel ||
        wheel.spinning
    ) {
        return;
    }


    if (
        !wheel.items ||
        wheel.items.length === 0
    ) {
        return;
    }


    wheel.spinning = true;

    wheel.showImage = false;


    const spinData =
        createSpinSequence(wheel);


    const sequence =
        spinData.sequence;

    const finalIndex =
        spinData.finalIndex;


    wheel.currentItems =
        sequence;


    // ========================================================
    // PARAMÈTRES
    // ========================================================

    const duration = 4300;

    const startTime =
        performance.now();


    const rowHeight =
        wheel.canvas.height / 5;


    const startOffset =
        Math.random() * rowHeight;


    const finalOffset =
        finalIndex * rowHeight;


    wheel.currentOffset =
        startOffset;


    // ========================================================
    // EASING
    // ========================================================

    function easeOutQuint(t) {

        return 1 -
            Math.pow(
                1 - t,
                5
            );
    }


    // ========================================================
    // ANIMATION
    // ========================================================

    function animate(now) {

        const elapsed =
            now - startTime;


        let progress =
            elapsed / duration;


        if (progress > 1) {
            progress = 1;
        }


        const eased =
            easeOutQuint(progress);


        const offset =
            startOffset +
            (
                finalOffset -
                startOffset
            ) * eased;


        wheel.currentOffset =
            offset;


        // Pendant le spin :
        // finished = false
        drawSlotMachine(
            wheel,
            sequence,
            offset,
            false
        );


        if (progress < 1) {

            wheel.animationId =
                requestAnimationFrame(
                    animate
                );

        } else {

            // =================================================
            // FIN DU SPIN
            // =================================================

            wheel.currentOffset =
                finalOffset;


            wheel.selectedItem =
                spinData.selectedItem;


            // =================================================
            // DERNIER DESSIN
            // finished = true
            // => l'image peut apparaître
            // =================================================

            drawSlotMachine(
                wheel,
                sequence,
                finalOffset,
                true
            );


            wheel.spinning = false;

            wheel.showImage = true;


            showResult(
                wheel,
                spinData.selectedItem
            );


            if (onComplete) {
                onComplete(
                    spinData.selectedItem
                );
            }
        }
    }


    wheel.animationId =
        requestAnimationFrame(
            animate
        );
}


// ============================================================
// AFFICHAGE DU RÉSULTAT
// ============================================================

function showResult(
    wheel,
    item
) {

    if (!wheel || !item) {
        return;
    }


    let resultElement = null;


    // Déterminer quel élément résultat utiliser

    if (
        wheel === wheels.talisman
    ) {

        resultElement =
            document.getElementById(
                "result-talisman"
            );

    } else if (
        wheel === wheels.arme
    ) {

        resultElement =
            document.getElementById(
                "result-arme"
            );

    } else if (
        wheel === wheels.objectif
    ) {

        resultElement =
            document.getElementById(
                "result-objectif"
            );

    } else if (
        wheel === singleWheels.talisman
    ) {

        resultElement =
            document.getElementById(
                "single-result-talisman"
            );

    } else if (
        wheel === singleWheels.arme
    ) {

        resultElement =
            document.getElementById(
                "single-result-arme"
            );

    } else if (
        wheel === singleWheels.objectif
    ) {

        resultElement =
            document.getElementById(
                "single-result-objectif"
            );
    }


    if (resultElement) {

        resultElement.textContent =
            getItemName(item);
    }
}


// ============================================================
// TIRAGE DES 3 ROUES
// ============================================================

function spinAll() {

    if (
        wheels.talisman.spinning ||
        wheels.arme.spinning ||
        wheels.objectif.spinning
    ) {
        return;
    }


    // Efface les anciens résultats

    const resultTalisman =
        document.getElementById(
            "result-talisman"
        );

    const resultArme =
        document.getElementById(
            "result-arme"
        );

    const resultObjectif =
        document.getElementById(
            "result-objectif"
        );


    if (resultTalisman) {
        resultTalisman.textContent = "";
    }

    if (resultArme) {
        resultArme.textContent = "";
    }

    if (resultObjectif) {
        resultObjectif.textContent = "";
    }


    // Lance les trois roues

    spinSlotMachine(
        wheels.talisman
    );

    spinSlotMachine(
        wheels.arme
    );

    spinSlotMachine(
        wheels.objectif
    );
}


// ============================================================
// TIRAGE INDIVIDUEL
// ============================================================

function spinSingle(type) {

    const wheel =
        singleWheels[type];


    if (!wheel) {
        return;
    }


    if (wheel.spinning) {
        return;
    }


    let resultElement =
        null;


    if (type === "talisman") {

        resultElement =
            document.getElementById(
                "single-result-talisman"
            );

    } else if (type === "arme") {

        resultElement =
            document.getElementById(
                "single-result-arme"
            );

    } else if (type === "objectif") {

        resultElement =
            document.getElementById(
                "single-result-objectif"
            );
    }


    if (resultElement) {
        resultElement.textContent = "";
    }


    spinSlotMachine(
        wheel
    );
}


// ============================================================
// INITIALISATION
// ============================================================

async function initialize() {

    console.log(
        "Initialisation Elden Ring Challenge..."
    );


    // ========================================================
    // CHARGEMENT DES LISTES
    // ========================================================

    const [
        talismans,
        armes,
        objectifs
    ] = await Promise.all([

        loadItems("talismans.txt"),

        loadItems("armes.txt"),

        loadItems("objectifs.txt")
    ]);


    // ========================================================
    // ROUES PRINCIPALES
    // ========================================================

    wheels.talisman.items =
        talismans;

    wheels.arme.items =
        armes;

    wheels.objectif.items =
        objectifs;


    // ========================================================
    // ROUES INDIVIDUELLES
    // ========================================================

    singleWheels.talisman.items =
        talismans;

    singleWheels.arme.items =
        armes;

    singleWheels.objectif.items =
        objectifs;


    // ========================================================
    // PRÉCHARGEMENT DES IMAGES
    // ========================================================

    preloadWheelImages(
        wheels.talisman,
        talismans
    );

    preloadWheelImages(
        wheels.arme,
        armes
    );

    preloadWheelImages(
        wheels.objectif,
        objectifs
    );


    preloadWheelImages(
        singleWheels.talisman,
        talismans
    );

    preloadWheelImages(
        singleWheels.arme,
        armes
    );

    preloadWheelImages(
        singleWheels.objectif,
        objectifs
    );


    // ========================================================
    // PRÉPARATION INITIALE DES ROUES
    // ========================================================

    for (const key in wheels) {

        const wheel =
            wheels[key];

        if (
            wheel.items &&
            wheel.items.length > 0
        ) {

            wheel.currentItems =
                wheel.items.slice(0, 7);

            wheel.currentOffset = 0;

            wheel.showImage = false;

            drawSlotMachine(
                wheel,
                wheel.currentItems,
                0,
                false
            );
        }
    }


    for (const key in singleWheels) {

        const wheel =
            singleWheels[key];

        if (
            wheel.items &&
            wheel.items.length > 0
        ) {

            wheel.currentItems =
                wheel.items.slice(0, 7);

            wheel.currentOffset = 0;

            wheel.showImage = false;

            drawSlotMachine(
                wheel,
                wheel.currentItems,
                0,
                false
            );
        }
    }


    // ========================================================
    // INTERFACE
    // ========================================================

    updateInterface();


    console.log(
        "Elden Ring Challenge prêt !"
    );
}


// ============================================================
// BOUTON PRINCIPAL
// ============================================================

const spinAllButton =
    document.getElementById(
        "spin-all"
    );


if (spinAllButton) {

    spinAllButton.addEventListener(
        "click",
        spinAll
    );
}


// ============================================================
// BOUTONS INDIVIDUELS
// ============================================================

document
    .querySelectorAll(".single-spin")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const type =
                    button.dataset.type;

                spinSingle(type);
            }
        );
    });


// ============================================================
// BOUTONS DE LANGUE
// ============================================================

const frenchButton =
    document.getElementById(
        "lang-fr"
    );

const englishButton =
    document.getElementById(
        "lang-en"
    );


if (frenchButton) {

    frenchButton.addEventListener(
        "click",
        () => setLanguage("fr")
    );
}


if (englishButton) {

    englishButton.addEventListener(
        "click",
        () => setLanguage("en")
    );
}


// ============================================================
// ONGLETS
// ============================================================

const tabs =
    document.querySelectorAll(
        ".tab"
    );


tabs.forEach(tab => {

    tab.addEventListener(
        "click",
        () => {

            const target =
                tab.dataset.target;


            // Retire la classe active
            tabs.forEach(t => {
                t.classList.remove(
                    "active"
                );
            });


            tab.classList.add(
                "active"
            );


            // Affiche/cache les sections
            document
                .querySelectorAll(
                    ".tab-content"
                )
                .forEach(section => {

                    section.classList.remove(
                        "active"
                    );
                });


            const targetSection =
                document.getElementById(
                    target
                );


            if (targetSection) {

                targetSection.classList.add(
                    "active"
                );
            }
        }
    );
});


// ============================================================
// LANCEMENT
// ============================================================

initialize();
