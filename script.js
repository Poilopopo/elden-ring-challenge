// ============================================
// ELDEN RING CHALLENGE - SCRIPT
// VERSION FR / EN
// ============================================

// ============================================
// LANGUE
// ============================================

let currentLanguage = localStorage.getItem("eldenRingLanguage") || "fr";

const translations = {
    fr: {
        htmlLang: "fr",

        challengeRandom: "CHALLENGE RANDOM",
        subtitle: "Que la Grâce décide de votre destin...",

        challenge: "⚔ CHALLENGE",
        talisman: "✦ TALISMAN ✦",
        weapon: "✦ ARME ✦",
        objective: "✦ OBJECTIF ✦",

        spinAll: "⚔ TOURNER LES ROUES ⚔",
        destinyAll: "⚔ DESTIN EN COURS... ⚔",

        spin: "✦ TOURNER ✦",
        destiny: "DESTIN...",

        footer: "— ELDEN RING CHALLENGE —"
    },

    en: {
        htmlLang: "en",

        challengeRandom: "RANDOM CHALLENGE",
        subtitle: "May Grace decide your fate...",

        challenge: "⚔ CHALLENGE",
        talisman: "✦ TALISMAN ✦",
        weapon: "✦ WEAPON ✦",
        objective: "✦ OBJECTIVE ✦",

        spinAll: "⚔ SPIN THE WHEELS ⚔",
        destinyAll: "⚔ FATE IN PROGRESS... ⚔",

        spin: "✦ SPIN ✦",
        destiny: "FATE...",

        footer: "— ELDEN RING CHALLENGE —"
    }
};


// ============================================
// OUTIL TRADUCTION
// ============================================

function t(key) {
    return translations[currentLanguage][key] || key;
}


// ============================================
// CHANGEMENT DE LANGUE
// ============================================

function setLanguage(language) {

    if (!translations[language]) return;

    currentLanguage = language;

    localStorage.setItem("eldenRingLanguage", language);

    document.documentElement.lang = language;

    updateInterfaceLanguage();
    redrawAllWheels();
}


// ============================================
// BOUTON FR / EN
// ============================================

function toggleLanguage() {

    const newLanguage = currentLanguage === "fr" ? "en" : "fr";

    setLanguage(newLanguage);
}


// ============================================
// PARSING DES FICHIERS TXT
// ============================================
//
// Formats acceptés:
//
// anglais|français
// anglais|français|chance
// anglais|français|image.png
// anglais|français|chance|image.png
// anglais|français|image.png|chance
//
// La chance est détectée automatiquement.
// ============================================

function loadItems(filename) {

    return fetch(filename)
        .then(response => {

            if (!response.ok) {
                throw new Error(`Impossible de charger ${filename}`);
            }

            return response.text();
        })
        .then(text => {

            return text
                .split("\n")
                .map(line => line.trim())
                .filter(line => line && !line.startsWith("#"))
                .map(line => {

                    const parts = line.split("|").map(part => part.trim());

                    const englishName = parts[0] || "";
                    const frenchName = parts[1] || englishName;

                    let weight = 50;
                    let image = "";

                    // Recherche automatique du poids
                    for (let i = 2; i < parts.length; i++) {

                        const value = parts[i];

                        if (value !== "" && !isNaN(value)) {
                            weight = parseFloat(value);
                        }
                        else if (value !== "") {
                            image = value;
                        }
                    }

                    return {
                        name: frenchName,
                        fr: frenchName,
                        en: englishName,
                        weight: weight,
                        image: image
                    };
                });
        });
}


// ============================================
// NOM SELON LA LANGUE
// ============================================

function getItemName(item) {

    if (!item) return "";

    return currentLanguage === "en"
        ? item.en
        : item.fr;
}


// ============================================
// DONNÉES
// ============================================

let talismans = [];
let armes = [];
let objectifs = [];


// ============================================
// ROUES PRINCIPALES
// ============================================

const wheels = {

    talisman: {
        canvas: document.getElementById("wheel-talisman"),
        items: [],
        spinning: false,
        selectedItem: null,
        animationId: null,

        lastVisibleItems: null,
        lastOffset: 0,
        lastStartSequenceIndex: 0
    },

    arme: {
        canvas: document.getElementById("wheel-arme"),
        items: [],
        spinning: false,
        selectedItem: null,
        animationId: null,

        lastVisibleItems: null,
        lastOffset: 0,
        lastStartSequenceIndex: 0
    },

    objectif: {
        canvas: document.getElementById("wheel-objectif"),
        items: [],
        spinning: false,
        selectedItem: null,
        animationId: null,

        lastVisibleItems: null,
        lastOffset: 0,
        lastStartSequenceIndex: 0
    }
};


// ============================================
// ROUES INDIVIDUELLES
// ============================================

const singleWheels = {

    talisman: {
        canvas: document.getElementById("single-wheel-talisman"),
        items: [],
        spinning: false,
        selectedItem: null,
        animationId: null,

        lastVisibleItems: null,
        lastOffset: 0,
        lastStartSequenceIndex: 0
    },

    arme: {
        canvas: document.getElementById("single-wheel-arme"),
        items: [],
        spinning: false,
        selectedItem: null,
        animationId: null,

        lastVisibleItems: null,
        lastOffset: 0,
        lastStartSequenceIndex: 0
    },

    objectif: {
        canvas: document.getElementById("single-wheel-objectif"),
        items: [],
        spinning: false,
        selectedItem: null,
        animationId: null,

        lastVisibleItems: null,
        lastOffset: 0,
        lastStartSequenceIndex: 0
    }
};


// ============================================
// COULEURS
// ============================================

const slotColors = [
    "#241c0d",
    "#302511",
    "#3b2d14",
    "#2b2110",
    "#342711",
    "#211a0c"
];


// ============================================
// CHOIX PONDÉRÉ
// ============================================

function chooseWeightedItem(items) {

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


// ============================================
// TAILLE TEXTE
// ============================================

function getFontSize(canvas) {

    return canvas.width >= 600 ? 25 : 21;
}


// ============================================
// LIGNES VISIBLES
// ============================================

function getVisibleRows() {

    return 5;
}


// ============================================
// HAUTEUR D'UNE LIGNE
// ============================================

function getRowHeight(canvas) {

    return canvas.height / 5;
}


// ============================================
// TRONQUER LE TEXTE
// ============================================

function truncateText(ctx, text, maxWidth) {

    if (ctx.measureText(text).width <= maxWidth) {
        return text;
    }

    let result = text;

    while (
        result.length > 0 &&
        ctx.measureText(result + "...").width > maxWidth
    ) {
        result = result.slice(0, -1);
    }

    return result + "...";
}


// ============================================
// DESSIN DE LA ROULETTE
// ============================================

function drawSlotMachine(
    wheel,
    visibleItems,
    offset,
    finished,
    startSequenceIndex
) {

    const canvas = wheel.canvas;

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    const width = canvas.width;
    const height = canvas.height;

    const rowHeight = getRowHeight(canvas);
    const centerY = height / 2;

    // Sauvegarde pour pouvoir redessiner
    // immédiatement lors du changement de langue
    wheel.lastVisibleItems = visibleItems.slice();
    wheel.lastOffset = offset;
    wheel.lastStartSequenceIndex = startSequenceIndex;

    // ----------------------------------------
    // FOND
    // ----------------------------------------

    ctx.clearRect(0, 0, width, height);

    ctx.fillStyle = "#0b0905";
    ctx.fillRect(0, 0, width, height);

    // ----------------------------------------
    // CADRE EXTÉRIEUR
    // ----------------------------------------

    ctx.strokeStyle = "#c7a85a";
    ctx.lineWidth = 3;

    ctx.strokeRect(
        2,
        2,
        width - 4,
        height - 4
    );

    // ----------------------------------------
    // CADRE INTÉRIEUR
    // ----------------------------------------

    ctx.strokeStyle = "#8e7337";
    ctx.lineWidth = 1;

    ctx.strokeRect(
        8,
        8,
        width - 16,
        height - 16
    );

    // ----------------------------------------
    // ZONE DE CLIPPING
    // ----------------------------------------

    ctx.save();

    ctx.beginPath();

    ctx.rect(
        10,
        10,
        width - 20,
        height - 20
    );

    ctx.clip();

    // ----------------------------------------
    // ÉLÉMENTS
    // ----------------------------------------

    const fontSize = getFontSize(canvas);

    ctx.font =
        `bold ${fontSize}px Cinzel, Georgia, serif`;

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    for (let i = -3; i <= 3; i++) {

        const sequenceIndex =
            startSequenceIndex + i;

        if (
            sequenceIndex < 0 ||
            sequenceIndex >= visibleItems.length
        ) {
            continue;
        }

        const item = visibleItems[sequenceIndex];

        const y =
            centerY +
            i * rowHeight -
            offset;

        const itemIndex =
            wheel.items.indexOf(item);

        const colorIndex =
            itemIndex >= 0
                ? itemIndex % slotColors.length
                : 0;

        // Fond de la ligne
        ctx.fillStyle =
            slotColors[colorIndex];

        ctx.fillRect(
            10,
            y - rowHeight / 2,
            width - 20,
            rowHeight
        );

        // ------------------------------------
        // CENTRE PLUS LUMINEUX
        // ------------------------------------

        if (i === 0) {

            ctx.fillStyle = "rgba(190, 150, 60, 0.20)";

            ctx.fillRect(
                10,
                y - rowHeight / 2,
                width - 20,
                rowHeight
            );
        }

        // ------------------------------------
        // TEXTE
        // ------------------------------------

        const name =
            getItemName(item);

        const maxTextWidth =
            width - 70;

        const displayText =
            truncateText(
                ctx,
                name,
                maxTextWidth
            );

        ctx.fillStyle =
            i === 0
                ? "#f3d27a"
                : "#d8c28a";

        ctx.fillText(
            displayText,
            width / 2,
            y
        );

        // ------------------------------------
        // SÉPARATEURS
        // ------------------------------------

        ctx.strokeStyle =
            "rgba(199, 168, 90, 0.35)";

        ctx.lineWidth = 1;

        ctx.beginPath();

        ctx.moveTo(
            10,
            y - rowHeight / 2
        );

        ctx.lineTo(
            width - 10,
            y - rowHeight / 2
        );

        ctx.stroke();
    }

    ctx.restore();

    // ----------------------------------------
    // CADRE DU RÉSULTAT CENTRAL
    // ----------------------------------------

    ctx.strokeStyle = "#d8b75a";
    ctx.lineWidth = 2;

    ctx.strokeRect(
        10,
        centerY - rowHeight / 2,
        width - 20,
        rowHeight
    );
}


// ============================================
// CRÉATION DE LA SÉQUENCE
// ============================================

function createSpinSequence(items, selectedItem) {

    const sequence = [];

    // ----------------------------------------
    // 3 éléments aléatoires au début
    // ----------------------------------------

    for (let i = 0; i < 3; i++) {

        sequence.push(
            items[
                Math.floor(
                    Math.random() * items.length
                )
            ]
        );
    }

    // ----------------------------------------
    // NOMBRE DE TOURS
    // ----------------------------------------

    const spinCount =
        35 + Math.floor(Math.random() * 36);

    // ----------------------------------------
    // ANIMATION
    // ----------------------------------------

    for (let i = 0; i < spinCount; i++) {

        sequence.push(
            items[
                Math.floor(
                    Math.random() * items.length
                )
            ]
        );
    }

    // ----------------------------------------
    // ON S'ASSURE QUE LE RÉSULTAT EST
    // EXACTEMENT AU CENTRE
    // ----------------------------------------

    const selectedIndex =
        sequence.length;

    sequence.push(selectedItem);

    // ----------------------------------------
    // 3 ÉLÉMENTS APRÈS
    // ----------------------------------------

    const selectedItemIndex =
        items.indexOf(selectedItem);

    for (let i = 1; i <= 3; i++) {

        sequence.push(
            items[
                (
                    selectedItemIndex + i
                ) % items.length
            ]
        );
    }

    return {
        sequence,
        selectedIndex
    };
}


// ============================================
// ANIMATION D'UNE ROUE
// ============================================

function spinSlotMachine(type, wheelCollection) {

    const wheel =
        wheelCollection[type];

    if (!wheel || wheel.spinning) {
        return;
    }

    if (!wheel.items.length) {
        return;
    }

    wheel.spinning = true;

    // ----------------------------------------
    // CHOIX PONDÉRÉ
    // ----------------------------------------

    const selectedItem =
        chooseWeightedItem(wheel.items);

    wheel.selectedItem =
        selectedItem;

    // ----------------------------------------
    // SÉQUENCE
    // ----------------------------------------

    const {
        sequence,
        selectedIndex
    } =
        createSpinSequence(
            wheel.items,
            selectedItem
        );

    // ----------------------------------------
    // INDEX DU CENTRE
    // ----------------------------------------

    const selectedSequenceIndex =
        selectedIndex;

    // ----------------------------------------
    // DISTANCE
    // ----------------------------------------

    const rowHeight =
        getRowHeight(wheel.canvas);

    const totalDistance =
        selectedSequenceIndex *
        rowHeight;

    // ----------------------------------------
    // DURÉE
    // ----------------------------------------

    const duration = 4300;

    const startTime =
        performance.now();

    // ----------------------------------------
    // ANIMATION
    // ----------------------------------------

    function animate(currentTime) {

        const elapsed =
            currentTime - startTime;

        let progress =
            Math.min(
                elapsed / duration,
                1
            );

        // Ease-out très prononcé
        const easedProgress =
            1 -
            Math.pow(
                1 - progress,
                5
            );

        const currentDistance =
            totalDistance *
            easedProgress;

        // ------------------------------------
        // INDEX COURANT
        // ------------------------------------

        const currentIndex =
            Math.floor(
                currentDistance /
                rowHeight
            );

        const offset =
            currentDistance %
            rowHeight;

        // ------------------------------------
        // 7 ÉLÉMENTS VISIBLES
        // ------------------------------------

        const visibleItems = [];

        for (let i = -3; i <= 3; i++) {

            const index =
                currentIndex + i;

            if (
                index >= 0 &&
                index < sequence.length
            ) {
                visibleItems.push(
                    sequence[index]
                );
            }
        }

        // ------------------------------------
        // DESSIN
        // ------------------------------------

        drawSlotMachine(
            wheel,
            sequence,
            offset,
            false,
            currentIndex
        );

        // ------------------------------------
        // FIN
        // ------------------------------------

        if (progress >= 1) {

            // Dessin final parfaitement fixe
            drawSlotMachine(
                wheel,
                sequence,
                0,
                true,
                selectedSequenceIndex
            );

            wheel.spinning = false;

            showResult(
                type,
                selectedItem,
                wheelCollection === singleWheels
            );

            // --------------------------------
            // SI LES 3 ROUES PRINCIPALES
            // SONT TERMINÉES
            // --------------------------------

            if (
                wheelCollection === wheels &&
                !wheels.talisman.spinning &&
                !wheels.arme.spinning &&
                !wheels.objectif.spinning
            ) {

                const button =
                    document.getElementById(
                        "spin-all"
                    );

                if (button) {

                    button.disabled = false;

                    button.textContent =
                        t("spinAll");
                }
            }

            return;
        }

        wheel.animationId =
            requestAnimationFrame(
                animate
            );
    }

    wheel.animationId =
        requestAnimationFrame(
            animate
        );
}


// ============================================
// RÉSULTAT
// ============================================

function showResult(
    type,
    item,
    single
) {

    const resultId =
        single
            ? `single-result-${type}`
            : `result-${type}`;

    const result =
        document.getElementById(resultId);

    if (!result) return;

    result.textContent =
        getItemName(item);

    result.classList.remove("show");

    // Force le navigateur à rejouer l'animation
    void result.offsetWidth;

    result.classList.add("show");
}


// ============================================
// REDESSIN DE TOUTES LES ROUES
// ============================================

function redrawAllWheels() {

    const collections = [
        wheels,
        singleWheels
    ];

    for (const collection of collections) {

        for (const type in collection) {

            const wheel =
                collection[type];

            if (
                wheel &&
                wheel.canvas &&
                wheel.lastVisibleItems
            ) {

                drawSlotMachine(
                    wheel,
                    wheel.lastVisibleItems,
                    wheel.lastOffset,
                    false,
                    wheel.lastStartSequenceIndex
                );
            }

            // Mise à jour du résultat
            if (wheel.selectedItem) {

                const single =
                    collection === singleWheels;

                const resultId =
                    single
                        ? `single-result-${type}`
                        : `result-${type}`;

                const result =
                    document.getElementById(
                        resultId
                    );

                if (result) {

                    result.textContent =
                        getItemName(
                            wheel.selectedItem
                        );
                }
            }
        }
    }
}


// ============================================
// TRADUCTION DE L'INTERFACE
// ============================================

function updateInterfaceLanguage() {

    // ----------------------------------------
    // HTML LANG
    // ----------------------------------------

    document.documentElement.lang =
        translations[currentLanguage].htmlLang;


    // ----------------------------------------
    // HEADER
    // ----------------------------------------

    const h2 =
        document.querySelector("header h2");

    if (h2) {
        h2.textContent =
            t("challengeRandom");
    }

    const subtitle =
        document.querySelector("header p");

    if (subtitle) {
        subtitle.textContent =
            t("subtitle");
    }


    // ----------------------------------------
    // ON RÉCUPÈRE LES ONGLETS
    // ----------------------------------------

    const tabs =
        document.querySelectorAll(".tab");

    tabs.forEach(tab => {

        const tabName =
            tab.dataset.tab;

        if (tabName === "challenge") {
            tab.textContent = t("challenge");
        }

        if (tabName === "talisman") {
            tab.textContent = t("talisman");
        }

        if (tabName === "arme") {
            tab.textContent = t("weapon");
        }

        if (tabName === "objectif") {
            tab.textContent = t("objective");
        }
    });


    // ----------------------------------------
    // TITRES DES CARTES
    // ----------------------------------------

    document
        .querySelectorAll("[data-wheel-title]")
        .forEach(title => {

            const type =
                title.dataset.wheelTitle;

            if (type === "talisman") {
                title.textContent =
                    t("talisman");
            }

            if (type === "arme") {
                title.textContent =
                    t("weapon");
            }

            if (type === "objectif") {
                title.textContent =
                    t("objective");
            }
        });


    // ----------------------------------------
    // FALLBACK POUR LES H3 EXISTANTS
    // ----------------------------------------

    const challengeContent =
        document.getElementById(
            "tab-challenge"
        );

    if (challengeContent) {

        const titles =
            challengeContent.querySelectorAll("h3");

        if (titles[0]) {
            titles[0].textContent =
                t("talisman");
        }

        if (titles[1]) {
            titles[1].textContent =
                t("weapon");
        }

        if (titles[2]) {
            titles[2].textContent =
                t("objective");
        }
    }


    // ----------------------------------------
    // BOUTON PRINCIPAL
    // ----------------------------------------

    const spinAllButton =
        document.getElementById("spin-all");

    if (spinAllButton) {

        spinAllButton.textContent =
            spinAllButton.disabled
                ? t("destinyAll")
                : t("spinAll");
    }


    // ----------------------------------------
    // BOUTONS INDIVIDUELS
    // ----------------------------------------

    document
        .querySelectorAll("[data-spin]")
        .forEach(button => {

            button.textContent =
                button.disabled
                    ? t("destiny")
                    : t("spin");
        });


    // ----------------------------------------
    // FOOTER
    // ----------------------------------------

    const footer =
        document.querySelector("footer");

    if (footer) {
        footer.textContent =
            t("footer");
    }


    // ----------------------------------------
    // BOUTON LANGUE
    // ----------------------------------------

    const languageButton =
        document.getElementById(
            "language-toggle"
        );

    if (languageButton) {

        languageButton.textContent =
            currentLanguage === "fr"
                ? "EN"
                : "FR";

        languageButton.title =
            currentLanguage === "fr"
                ? "Switch to English"
                : "Passer en français";
    }
}


// ============================================
// INITIALISATION
// ============================================

async function initialize() {

    try {

        const [
            loadedTalismans,
            loadedArmes,
            loadedObjectifs
        ] = await Promise.all([

            loadItems("talismans.txt"),
            loadItems("armes.txt"),
            loadItems("objectifs.txt")
        ]);

        talismans =
            loadedTalismans;

        armes =
            loadedArmes;

        objectifs =
            loadedObjectifs;


        // ------------------------------------
        // ASSIGNATION ROUES PRINCIPALES
        // ------------------------------------

        wheels.talisman.items =
            talismans;

        wheels.arme.items =
            armes;

        wheels.objectif.items =
            objectifs;


        // ------------------------------------
        // ASSIGNATION ROUES INDIVIDUELLES
        // ------------------------------------

        singleWheels.talisman.items =
            talismans;

        singleWheels.arme.items =
            armes;

        singleWheels.objectif.items =
            objectifs;


        // ------------------------------------
        // DESSIN INITIAL
        // ------------------------------------

        for (const type in wheels) {

            const wheel =
                wheels[type];

            if (!wheel.canvas) continue;

            const initialItems =
                getInitialItems(
                    wheel.items
                );

            wheel.lastVisibleItems =
                initialItems;

            drawSlotMachine(
                wheel,
                initialItems,
                0,
                false,
                3
            );
        }


        // ------------------------------------
        // ROUES INDIVIDUELLES
        // ------------------------------------

        for (const type in singleWheels) {

            const wheel =
                singleWheels[type];

            if (!wheel.canvas) continue;

            const initialItems =
                getInitialItems(
                    wheel.items
                );

            wheel.lastVisibleItems =
                initialItems;

            drawSlotMachine(
                wheel,
                initialItems,
                0,
                false,
                3
            );
        }


        // ------------------------------------
        // INTERFACE
        // ------------------------------------

        updateInterfaceLanguage();


        // ------------------------------------
        // LOG
        // ------------------------------------

        console.log(
            "Elden Ring Challenge chargé !"
        );

        console.log(
            `Talismans : ${talismans.length}`
        );

        console.log(
            `Armes : ${armes.length}`
        );

        console.log(
            `Objectifs : ${objectifs.length}`
        );

        console.log(
            `Langue : ${currentLanguage}`
        );

    }
    catch (error) {

        console.error(
            "Erreur lors du chargement :",
            error
        );
    }
}


// ============================================
// ITEMS INITIAUX
// ============================================

function getInitialItems(items) {

    if (!items.length) {
        return [];
    }

    const startIndex =
        Math.floor(
            Math.random() * items.length
        );

    const result = [];

    for (let i = -3; i <= 3; i++) {

        const index =
            (
                startIndex + i
            ) % items.length;

        result.push(
            items[
                (index + items.length) %
                items.length
            ]
        );
    }

    return result;
}


// ============================================
// ONGLETS
// ============================================

document
    .querySelectorAll(".tab")
    .forEach(tab => {

        tab.addEventListener(
            "click",
            () => {

                const target =
                    tab.dataset.tab;

                // Désactivation des onglets
                document
                    .querySelectorAll(".tab")
                    .forEach(t => {
                        t.classList.remove("active");
                    });

                tab.classList.add("active");

                // Désactivation des contenus
                document
                    .querySelectorAll(".tab-content")
                    .forEach(content => {
                        content.classList.remove("active");
                    });

                const targetContent =
                    document.getElementById(
                        `tab-${target}`
                    );

                if (targetContent) {
                    targetContent.classList.add(
                        "active"
                    );
                }
            }
        );
    });


// ============================================
// TOURNER LES 3 ROUES
// ============================================

function spinAll() {

    if (
        wheels.talisman.spinning ||
        wheels.arme.spinning ||
        wheels.objectif.spinning
    ) {
        return;
    }

    if (
        !talismans.length ||
        !armes.length ||
        !objectifs.length
    ) {
        console.warn(
            "Les listes ne sont pas encore chargées."
        );

        return;
    }

    const button =
        document.getElementById(
            "spin-all"
        );

    if (button) {

        button.disabled = true;

        button.textContent =
            t("destinyAll");
    }

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


// ============================================
// TOURNER UNE SEULE ROUE
// ============================================

function spinSingle(type) {

    const wheel =
        singleWheels[type];

    if (!wheel || wheel.spinning) {
        return;
    }

    const button =
        document.querySelector(
            `[data-spin="${type}"]`
        );

    if (button) {

        button.disabled = true;

        button.textContent =
            t("destiny");
    }

    spinSlotMachine(
        type,
        singleWheels
    );

    // ----------------------------------------
    // ATTENTE DE FIN
    // ----------------------------------------

    const checkFinished =
        setInterval(() => {

            if (!wheel.spinning) {

                clearInterval(
                    checkFinished
                );

                if (button) {

                    button.disabled =
                        false;

                    button.textContent =
                        t("spin");
                }
            }

        }, 50);
}


// ============================================
// BOUTON DE LANGUE
// ============================================

const languageButton =
    document.getElementById(
        "language-toggle"
    );

if (languageButton) {

    languageButton.addEventListener(
        "click",
        toggleLanguage
    );
}


// ============================================
// LANCEMENT
// ============================================

initialize();
