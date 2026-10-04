// ============================================================
// ELDEN RING CHALLENGE
// MACHINE A SOUS
// FR / EN
// ============================================================


// ============================================================
// BACKEND
// ============================================================
//
// Le mode normal reste 100 % local.
//
// Seul le mode TEST utilise le backend Spring Boot.
//
// Si ton endpoint Spring Boot est différent,
// modifie uniquement BACKEND_TEST_ENDPOINT.
// ============================================================

const BACKEND_URL =
    "http://localhost:8080";

const BACKEND_TEST_ENDPOINT =
    "/api/challenge/test";


// ============================================================
// LANGUE
// ============================================================

let currentLanguage =
    localStorage.getItem("eldenRingLanguage") ||
    "fr";


// ============================================================
// TRADUCTIONS
// ============================================================

const translations = {

    fr: {

        title:
            "CHALLENGE RANDOM",

        subtitle:
            "Que la Grâce décide de votre destin...",

        challenge:
            "⚔ CHALLENGE ⚔",

        talisman:
            "◆ TALISMAN ◆",

        arme:
            "◆ ARME ◆",

        objectif:
            "◆ OBJECTIF ◆",

        test:
            "🌐 TEST",

        spinAll:
            "⚔ TOURNER LES ROUES ⚔",

        fate:
            "⚔ DESTIN EN COURS... ⚔",

        spin:
            "◆ TOURNER ◆",

        destiny:
            "DESTIN...",

        testSpin:
            "🌐 TESTER LE BACKEND",

        testLoading:
            "🌐 CONNEXION AU SERVEUR...",

        testError:
            "ERREUR SERVEUR",

        testSuccess:
            "✓ BACKEND OK",

        backendUnavailable:
            "Impossible de contacter le serveur.",

        backendInvalidResponse:
            "Réponse invalide du serveur."

    },


    en: {

        title:
            "RANDOM CHALLENGE",

        subtitle:
            "May Grace decide your fate...",

        challenge:
            "⚔ CHALLENGE ⚔",

        talisman:
            "◆ TALISMAN ◆",

        arme:
            "◆ WEAPON ◆",

        objectif:
            "◆ OBJECTIVE ◆",

        test:
            "🌐 TEST",

        spinAll:
            "⚔ SPIN THE WHEELS ⚔",

        fate:
            "⚔ FATE IN PROGRESS... ⚔",

        spin:
            "◆ SPIN ◆",

        destiny:
            "FATE...",

        testSpin:
            "🌐 TEST BACKEND",

        testLoading:
            "🌐 CONNECTING TO SERVER...",

        testError:
            "SERVER ERROR",

        testSuccess:
            "✓ BACKEND OK",

        backendUnavailable:
            "Unable to contact the server.",

        backendInvalidResponse:
            "Invalid server response."

    }

};


// ============================================================
// NOM D'UN ITEM SELON LA LANGUE
// ============================================================

function getItemName(item) {

    if (!item) {

        return "";

    }


    if (
        currentLanguage === "en"
    ) {

        return (
            item.nameEN ||
            item.nameFR ||
            ""
        );

    }


    return (
        item.nameFR ||
        item.nameEN ||
        ""
    );

}


// ============================================================
// NORMALISATION D'UN ITEM BACKEND
// ============================================================
//
// Permet au frontend de comprendre plusieurs formes de réponse
// Spring Boot.
//
// Exemples acceptés :
//
// {
//     nameFR: "...",
//     nameEN: "...",
//     image: "..."
// }
//
// ou :
//
// {
//     name: "..."
// }
//
// ou simplement une chaîne.
//
// ============================================================

function normalizeBackendItem(
    backendItem,
    type
) {

    if (
        !backendItem
    ) {

        return null;

    }


    // --------------------------------------------------------
    // Le backend renvoie directement une chaîne
    // --------------------------------------------------------

    if (
        typeof backendItem === "string"
    ) {

        const name =
            backendItem.trim();


        const localItem =
            findLocalItem(
                type,
                name
            );


        if (localItem) {

            return localItem;

        }


        return {

            nameFR:
                name,

            nameEN:
                name,

            weight:
                1,

            image:
                ""

        };

    }


    // --------------------------------------------------------
    // Le backend renvoie un objet
    // --------------------------------------------------------

    const nameFR =
        (
            backendItem.nameFR ||
            backendItem.nameFr ||
            backendItem.name ||
            backendItem.nomFR ||
            backendItem.nom ||
            ""
        ).toString().trim();


    const nameEN =
        (
            backendItem.nameEN ||
            backendItem.nameEn ||
            backendItem.nomEN ||
            nameFR
        ).toString().trim();


    const image =
        (
            backendItem.image ||
            backendItem.imageUrl ||
            ""
        ).toString().trim();


    // --------------------------------------------------------
    // Essaye d'abord de retrouver l'item local
    // --------------------------------------------------------

    const localItem =
        findLocalItem(
            type,
            nameFR
        ) ||
        findLocalItem(
            type,
            nameEN
        );


    if (localItem) {

        return localItem;

    }


    // --------------------------------------------------------
    // Sinon on construit un item compatible
    // --------------------------------------------------------

    return {

        nameFR:
            nameFR || nameEN,

        nameEN:
            nameEN || nameFR,

        weight:
            1,

        image:
            image

    };

}


// ============================================================
// RECHERCHE D'UN ITEM LOCAL
// ============================================================

function findLocalItem(
    type,
    name
) {

    if (!name) {

        return null;

    }


    let items = [];


    if (
        type === "talisman"
    ) {

        items =
            talismans;

    }

    else if (
        type === "arme"
    ) {

        items =
            armes;

    }

    else if (
        type === "objectif"
    ) {

        items =
            objectifs;

    }


    const normalizedName =
        name
            .toString()
            .trim()
            .toLowerCase();


    return (
        items.find(
            function(item) {

                return (
                    (
                        item.nameFR ||
                        ""
                    )
                        .trim()
                        .toLowerCase() ===
                    normalizedName
                ) ||
                (
                    item.nameEN ||
                    ""
                )
                    .trim()
                    .toLowerCase() ===
                    normalizedName;

            }
        ) ||
        null
    );

}


// ============================================================
// CHANGEMENT DE LANGUE
// ============================================================

function setLanguage(
    language
) {

    if (
        language !== "fr" &&
        language !== "en"
    ) {

        return;

    }


    currentLanguage =
        language;


    localStorage.setItem(
        "eldenRingLanguage",
        currentLanguage
    );


    updateInterface();


    updateLanguageButtons();


    redrawAllWheels();

}


// ============================================================
// MISE A JOUR DES RESULTATS
// ============================================================

function updateDisplayedResults() {

    const resultTypes = [

        "talisman",

        "arme",

        "objectif"

    ];


    const resultCollections = [

        "result-",

        "single-result-",

        "test-result-"

    ];


    resultTypes.forEach(
        function(type) {

            resultCollections.forEach(
                function(prefix) {

                    const result =
                        document.getElementById(
                            prefix + type
                        );


                    if (
                        !result ||
                        !result._selectedItem
                    ) {

                        return;

                    }


                    const name =
                        result.querySelector(
                            ".result-name"
                        );


                    if (name) {

                        name.textContent =
                            getItemName(
                                result._selectedItem
                            );

                    }


                    const image =
                        result.querySelector(
                            ".winner-image"
                        );


                    if (image) {

                        image.alt =
                            getItemName(
                                result._selectedItem
                            );

                    }

                }
            );

        }
    );

}


// ============================================================
// MISE A JOUR DE L'INTERFACE
// ============================================================

function updateInterface() {

    const t =
        translations[
            currentLanguage
        ];


    // --------------------------------------------------------
    // HEADER
    // --------------------------------------------------------

    const h2 =
        document.querySelector(
            "header h2"
        );


    if (h2) {

        h2.textContent =
            t.title;

    }


    const subtitle =
        document.querySelector(
            "header .subtitle"
        );


    if (subtitle) {

        subtitle.textContent =
            t.subtitle;

    }


    // --------------------------------------------------------
    // ONGLET
    // --------------------------------------------------------

    const tabs =
        document.querySelectorAll(
            ".tab"
        );


    tabs.forEach(
        function(tab) {

            const target =
                tab.dataset.tab;


            if (
                translations[
                    currentLanguage
                ][target]
            ) {

                tab.textContent =
                    translations[
                        currentLanguage
                    ][target];

            }

        }
    );


    // --------------------------------------------------------
    // TITRES DES MACHINES
    // --------------------------------------------------------

    document
        .querySelectorAll(
            ".wheel-card h3, .single-wheel-card h3, .test-wheel-card h3"
        )
        .forEach(
            function(title) {

                const text =
                    title.textContent
                        .replace(
                            /◆/g,
                            ""
                        )
                        .replace(
                            /✦/g,
                            ""
                        )
                        .trim()
                        .toLowerCase();


                if (
                    text.includes("talisman")
                ) {

                    title.textContent =
                        t.talisman;

                }

                else if (
                    text.includes("arme") ||
                    text.includes("weapon")
                ) {

                    title.textContent =
                        t.arme;

                }

                else if (
                    text.includes("objectif") ||
                    text.includes("objective")
                ) {

                    title.textContent =
                        t.objectif;

                }

            }
        );


    // --------------------------------------------------------
    // BOUTON PRINCIPAL
    // --------------------------------------------------------

    const spinAllButton =
        document.getElementById(
            "spin-all"
        );


    if (
        spinAllButton &&
        !spinAllButton.disabled
    ) {

        spinAllButton.textContent =
            t.spinAll;

    }


    // --------------------------------------------------------
    // BOUTONS SOLO
    // --------------------------------------------------------

    document
        .querySelectorAll(
            ".single-spin"
        )
        .forEach(
            function(button) {

                if (
                    !button.disabled
                ) {

                    button.textContent =
                        t.spin;

                }

            }
        );


    // --------------------------------------------------------
    // BOUTON TEST
    // --------------------------------------------------------

    const testButton =
        document.getElementById(
            "test-spin"
        );


    if (
        testButton &&
        !testButton.disabled
    ) {

        testButton.textContent =
            t.testSpin;

    }


    // --------------------------------------------------------
    // FOOTER
    // --------------------------------------------------------

    const footer =
        document.querySelector(
            "footer"
        );


    if (footer) {

        footer.textContent = "";


        const left =
            document.createElement(
                "span"
            );


        left.textContent =
            "—";


        const text =
            document.createTextNode(
                " ELDEN RING CHALLENGE "
            );


        const right =
            document.createElement(
                "span"
            );


        right.textContent =
            "—";


        footer.appendChild(
            left
        );


        footer.appendChild(
            text
        );


        footer.appendChild(
            right
        );

    }


    // --------------------------------------------------------
    // RESULTATS
    // --------------------------------------------------------

    updateDisplayedResults();

}


// ============================================================
// BOUTONS DE LANGUE
// ============================================================

function updateLanguageButtons() {

    const frButton =
        document.getElementById(
            "lang-fr"
        );


    const enButton =
        document.getElementById(
            "lang-en"
        );


    if (frButton) {

        frButton.classList.toggle(
            "active",
            currentLanguage === "fr"
        );

    }


    if (enButton) {

        enButton.classList.toggle(
            "active",
            currentLanguage === "en"
        );

    }

}


// ============================================================
// REDESSIN DES ROUES
// ============================================================

function redrawAllWheels() {

    [
        wheels,
        singleWheels,
        testWheels
    ].forEach(
        function(collection) {

            Object
                .values(
                    collection
                )
                .forEach(
                    function(wheel) {

                        if (
                            wheel.currentItems &&
                            wheel.currentItems.length
                        ) {

                            drawSlotMachine(
                                wheel,
                                wheel.currentItems,
                                wheel.currentOffset || 0,
                                false,
                                wheel.currentStartSequenceIndex || 0
                            );

                        }

                    }
                );

        }
    );

}


// ============================================================
// CHARGEMENT DES FICHIERS TXT
// ============================================================
//
// FORMAT :
//
// nom_fr|nom_en|chance|image.png
//
// Exemple :
//
// Talisman tortue|Green Turtle Talisman|50|tortue.png
//
// ============================================================

async function loadItems(
    filename
) {

    try {

        const response =
            await fetch(
                filename
            );


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

            .map(
                function(line) {

                    return line.trim();

                }
            )

            .filter(
                function(line) {

                    return line.length > 0;

                }
            )

            .filter(
                function(line) {

                    return !line.startsWith("#");

                }
            )

            .map(
                function(line) {

                    const parts =
                        line.split("|");


                    const nameFR =
                        (
                            parts[0] ||
                            ""
                        ).trim();


                    const nameEN =
                        (
                            parts[1] ||
                            nameFR
                        ).trim();


                    let weight =
                        50;


                    if (
                        parts.length > 2 &&
                        parts[2].trim() !== ""
                    ) {

                        const parsedWeight =
                            Number(
                                parts[2].trim()
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


                    let image =
                        "";


                    if (
                        parts.length > 3
                    ) {

                        image =
                            parts[3].trim();

                    }


                    return {

                        nameFR:
                            nameFR,

                        nameEN:
                            nameEN,

                        weight:
                            weight,

                        image:
                            image

                    };

                }
            );

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
// CACHE DES IMAGES
// ============================================================

const wheelImageCache = {};


// ============================================================
// DOSSIERS DES IMAGES
// ============================================================

const imageFolders = {

    talisman:
        "talisman_img",

    arme:
        "arme_img",

    objectif:
        "objectif_img"

};


// ============================================================
// CHARGEMENT / CACHE D'UNE IMAGE
// ============================================================

function getItemImage(
    type,
    item
) {

    if (
        !item ||
        !item.image
    ) {

        return null;

    }


    const folder =
        imageFolders[type];


    if (!folder) {

        return null;

    }


    const imageName =
        item.image
            .trim()
            .replace(
                /^\/+/,
                ""
            );


    if (!imageName) {

        return null;

    }


    const encodedImageName =
        imageName
            .split("/")
            .map(
                function(part) {

                    return encodeURIComponent(
                        part
                    );

                }
            )
            .join("/");


    const imagePath =
        folder +
        "/" +
        encodedImageName;


    if (
        wheelImageCache[imagePath]
    ) {

        return wheelImageCache[
            imagePath
        ];

    }


    const image =
        new Image();


    image.onload =
        function() {

            console.log(
                "Image chargée :",
                imagePath
            );

        };


    image.onerror =
        function() {

            console.warn(
                "Image introuvable :",
                imagePath
            );

        };


    image.src =
        imagePath;


    wheelImageCache[
        imagePath
    ] =
        image;


    return image;

}


// ============================================================
// PRECHARGEMENT DES IMAGES
// ============================================================

function preloadItemImages(
    type,
    items
) {

    if (
        !items ||
        !items.length
    ) {

        return;

    }


    items.forEach(
        function(item) {

            getItemImage(
                type,
                item
            );

        }
    );

}


// ============================================================
// DONNEES
// ============================================================

let talismans = [];

let armes = [];

let objectifs = [];


// ============================================================
// CREATION D'UNE MACHINE
// ============================================================

function createWheel(
    canvasId,
    items
) {

    return {

        canvas:
            document.getElementById(
                canvasId
            ),

        items:
            items,

        spinning:
            false,

        selectedItem:
            null,

        animationId:
            null,

        currentItems:
            null,

        currentOffset:
            0,

        currentStartSequenceIndex:
            0

    };

}


// ============================================================
// MACHINES PRINCIPALES
// ============================================================

const wheels = {

    talisman:
        createWheel(
            "wheel-talisman",
            talismans
        ),

    arme:
        createWheel(
            "wheel-arme",
            armes
        ),

    objectif:
        createWheel(
            "wheel-objectif",
            objectifs
        )

};


// ============================================================
// MACHINES TEST BACKEND
// ============================================================

const testWheels = {

    talisman:
        createWheel(
            "test-wheel-talisman",
            talismans
        ),

    arme:
        createWheel(
            "test-wheel-arme",
            armes
        ),

    objectif:
        createWheel(
            "test-wheel-objectif",
            objectifs
        )

};


// ============================================================
// MACHINES INDIVIDUELLES
// ============================================================

const singleWheels = {

    talisman:
        createWheel(
            "single-wheel-talisman",
            talismans
        ),

    arme:
        createWheel(
            "single-wheel-arme",
            armes
        ),

    objectif:
        createWheel(
            "single-wheel-objectif",
            objectifs
        )

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

function chooseWeightedItem(
    items
) {

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

function getFontSize(
    canvas
) {

    if (
        canvas.width >= 600
    ) {

        return 25;

    }


    return 21;

}


function getVisibleRows(
    canvas
) {

    return 5;

}


function getRowHeight(
    canvas
) {

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


    if (
        !visibleItems ||
        !visibleItems.length
    ) {

        return;

    }


    wheel.currentItems =
        visibleItems.slice();


    wheel.currentOffset =
        offset;


    wheel.currentStartSequenceIndex =
        startSequenceIndex;


    const ctx =
        canvas.getContext(
            "2d"
        );


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
        getRowHeight(
            canvas
        );


    const centerY =
        height / 2;


    const fontSize =
        getFontSize(
            canvas
        );


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
    // DESSIN DES ELEMENTS
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
                getItemName(item),
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
        // SEPARATION
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
    // CASE CENTRALE
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
    wheelCollection,
    forcedItem = null,
    resultPrefix = null
) {

    // --------------------------------------------------------
    // DETERMINE LE RESULTAT
    // --------------------------------------------------------

    if (!resultPrefix) {

        if (
            wheelCollection ===
            singleWheels
        ) {

            resultPrefix =
                "single-result-";

        }

        else if (
            wheelCollection ===
            testWheels
        ) {

            resultPrefix =
                "test-result-";

        }

        else {

            resultPrefix =
                "result-";

        }

    }


    const resultId =
        resultPrefix +
        type;


    const result =
        document.getElementById(
            resultId
        );


    if (result) {

        const name =
            result.querySelector(
                ".result-name"
            );


        if (name) {

            name.textContent =
                "";

        }


        const image =
            result.querySelector(
                ".winner-image"
            );


        if (image) {

            image.remove();

        }


        result._selectedItem =
            null;

    }


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

    let selectedItem =
        forcedItem;


    if (!selectedItem) {

        selectedItem =
            chooseWeightedItem(
                wheel.items
            );

    }


    wheel.selectedItem =
        selectedItem;


    // --------------------------------------------------------
    // SEQUENCE
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


    if (!canvas) {

        wheel.spinning =
            false;

        return;

    }


    const rowHeight =
        getRowHeight(
            canvas
        );


    // --------------------------------------------------------
    // POSITION DU RESULTAT
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
        // ----------------------------------------------------

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
        // RESULTAT
        // ----------------------------------------------------

        showResult(
            type,
            selectedItem,
            resultPrefix
        );


        // ----------------------------------------------------
        // FIN DU MODE NORMAL
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
                        translations[
                            currentLanguage
                        ].spinAll;

                }

            }

        }


        // ----------------------------------------------------
        // FIN DU MODE TEST
        // ----------------------------------------------------

        if (
            wheelCollection ===
            testWheels
        ) {

            const stillSpinning =
                Object
                    .values(
                        testWheels
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
                        "test-spin"
                    );


                if (button) {

                    button.disabled =
                        false;


                    button.textContent =
                        translations[
                            currentLanguage
                        ].testSuccess;

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
// TEST BACKEND
// ============================================================
//
// Le bouton TEST demande au backend les trois résultats.
//
// POST :
//
// http://localhost:8080/api/challenge/test
//
// Le backend peut renvoyer par exemple :
//
// {
//     "talisman": {...},
//     "arme": {...},
//     "objectif": {...}
// }
//
// ou :
//
// {
//     "talisman": "Nom du talisman",
//     "arme": "Nom de l'arme",
//     "objectif": "Nom de l'objectif"
// }
//
// ============================================================

async function requestBackendTest() {

    const response =
        await fetch(
            BACKEND_URL +
            BACKEND_TEST_ENDPOINT,
            {

                method:
                    "POST",

                headers: {

                    "Content-Type":
                        "application/json"

                },

                body:
                    JSON.stringify({

                        language:
                            currentLanguage

                    })

            }
        );


    if (
        !response.ok
    ) {

        throw new Error(
            "HTTP " +
            response.status
        );

    }


    const data =
        await response.json();


    if (
        !data ||
        typeof data !== "object"
    ) {

        throw new Error(
            "Réponse backend invalide"
        );

    }


    return data;

}


// ============================================================
// RECUPERATION FLEXIBLE D'UN RESULTAT BACKEND
// ============================================================

function getBackendResult(
    data,
    type
) {

    // --------------------------------------------------------
    // Format direct
    //
    // {
    //   talisman: ...,
    //   arme: ...,
    //   objectif: ...
    // }
    // --------------------------------------------------------

    if (
        data[type] !== undefined
    ) {

        return data[type];

    }


    // --------------------------------------------------------
    // Format "result"
    // --------------------------------------------------------

    if (
        data.result &&
        typeof data.result === "object" &&
        data.result[type] !== undefined
    ) {

        return data.result[type];

    }


    // --------------------------------------------------------
    // Format "results"
    // --------------------------------------------------------

    if (
        data.results &&
        typeof data.results === "object" &&
        data.results[type] !== undefined
    ) {

        return data.results[type];

    }


    return null;

}


// ============================================================
// BOUTON TEST BACKEND
// ============================================================

async function testBackend() {

    const button =
        document.getElementById(
            "test-spin"
        );


    if (!button) {

        console.warn(
            "Bouton #test-spin introuvable."
        );

        return;

    }


    // --------------------------------------------------------
    // Empêche un deuxième test
    // --------------------------------------------------------

    if (
        Object
            .values(
                testWheels
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
    // Vérification des données
    // --------------------------------------------------------

    if (
        !talismans.length ||
        !armes.length ||
        !objectifs.length
    ) {

        console.error(
            "Impossible de lancer le test : listes vides."
        );

        return;

    }


    button.disabled =
        true;


    button.textContent =
        translations[
            currentLanguage
        ].testLoading;


    // --------------------------------------------------------
    // Nettoyage des anciens résultats
    // --------------------------------------------------------

    [
        "talisman",
        "arme",
        "objectif"
    ].forEach(
        function(type) {

            const result =
                document.getElementById(
                    "test-result-" +
                    type
                );


            if (!result) {

                return;

            }


            result._selectedItem =
                null;


            const name =
                result.querySelector(
                    ".result-name"
                );


            if (name) {

                name.textContent =
                    "";

            }


            const image =
                result.querySelector(
                    ".winner-image"
                );


            if (image) {

                image.remove();

            }

        }
    );


    try {

        // ----------------------------------------------------
        // APPEL SPRING BOOT
        // ----------------------------------------------------

        const data =
            await requestBackendTest();


        console.log(
            "Réponse backend TEST :",
            data
        );


        // ----------------------------------------------------
        // RESULTATS
        // ----------------------------------------------------

        const backendTalisman =
            getBackendResult(
                data,
                "talisman"
            );


        const backendArme =
            getBackendResult(
                data,
                "arme"
            );


        const backendObjectif =
            getBackendResult(
                data,
                "objectif"
            );


        if (
            backendTalisman == null ||
            backendArme == null ||
            backendObjectif == null
        ) {

            throw new Error(
                "La réponse backend ne contient pas les trois résultats."
            );

        }


        // ----------------------------------------------------
        // NORMALISATION
        // ----------------------------------------------------

        const selectedTalisman =
            normalizeBackendItem(
                backendTalisman,
                "talisman"
            );


        const selectedArme =
            normalizeBackendItem(
                backendArme,
                "arme"
            );


        const selectedObjectif =
            normalizeBackendItem(
                backendObjectif,
                "objectif"
            );


        if (
            !selectedTalisman ||
            !selectedArme ||
            !selectedObjectif
        ) {

            throw new Error(
                "Impossible de convertir les résultats backend."
            );

        }


        // ----------------------------------------------------
        // LANCEMENT DES 3 ROUES
        //
        // Le résultat est imposé par Spring Boot.
        // Le navigateur ne fait donc PAS le tirage.
        // ----------------------------------------------------

        spinSlotMachine(
            "talisman",
            testWheels,
            selectedTalisman,
            "test-result-"
        );


        spinSlotMachine(
            "arme",
            testWheels,
            selectedArme,
            "test-result-"
        );


        spinSlotMachine(
            "objectif",
            testWheels,
            selectedObjectif,
            "test-result-"
        );

    }

    catch (error) {

        console.error(
            "Erreur TEST backend :",
            error
        );


        button.disabled =
            false;


        button.textContent =
            translations[
                currentLanguage
            ].testError;


        // ----------------------------------------------------
        // Retour automatique au texte normal
        // ----------------------------------------------------

        setTimeout(
            function() {

                if (
                    !button.disabled
                ) {

                    button.textContent =
                        translations[
                            currentLanguage
                        ].testSpin;

                }

            },
            2500
        );

    }

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
    // MACHINES PRINCIPALES
    // --------------------------------------------------------

    wheels.talisman.items =
        talismans;


    wheels.arme.items =
        armes;


    wheels.objectif.items =
        objectifs;


    // --------------------------------------------------------
    // MACHINES TEST
    // --------------------------------------------------------

    testWheels.talisman.items =
        talismans;


    testWheels.arme.items =
        armes;


    testWheels.objectif.items =
        objectifs;


    // --------------------------------------------------------
    // MACHINES INDIVIDUELLES
    // --------------------------------------------------------

    singleWheels.talisman.items =
        talismans;


    singleWheels.arme.items =
        armes;


    singleWheels.objectif.items =
        objectifs;


    // --------------------------------------------------------
    // PRECHARGEMENT IMAGES
    // --------------------------------------------------------

    preloadItemImages(
        "talisman",
        talismans
    );


    preloadItemImages(
        "arme",
        armes
    );


    preloadItemImages(
        "objectif",
        objectifs
    );


    // --------------------------------------------------------
    // AFFICHAGE INITIAL
    // --------------------------------------------------------

    [
        wheels,
        testWheels,
        singleWheels
    ].forEach(
        function(collection) {

            Object
                .values(
                    collection
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

        }
    );


    // --------------------------------------------------------
    // INTERFACE
    // --------------------------------------------------------

    updateInterface();


    updateLanguageButtons();


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


    console.log(
        "Backend TEST : " +
        BACKEND_URL +
        BACKEND_TEST_ENDPOINT
    );

}


// ============================================================
// ITEMS INITIAUX
// ============================================================

function getInitialItems(
    items
) {

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

                        // --------------------------------------------
                        // Si on ouvre TEST, on s'assure que les roues
                        // sont correctement dessinées.
                        // --------------------------------------------

                        if (
                            target === "test"
                        ) {

                            Object
                                .values(
                                    testWheels
                                )
                                .forEach(
                                    function(wheel) {

                                        if (
                                            wheel.currentItems &&
                                            wheel.currentItems.length
                                        ) {

                                            drawSlotMachine(
                                                wheel,
                                                wheel.currentItems,
                                                wheel.currentOffset || 0,
                                                false,
                                                wheel.currentStartSequenceIndex || 0
                                            );

                                        }

                                    }
                                );

                        }

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
        translations[
            currentLanguage
        ].fate;


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

function spinSingle(
    type
) {

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
            translations[
                currentLanguage
            ].destiny;

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
                            translations[
                                currentLanguage
                            ].spin;

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
    resultPrefix
) {

    const id =
        resultPrefix +
        type;


    const result =
        document.getElementById(
            id
        );


    if (!result) {

        console.warn(
            "Result container introuvable :",
            id
        );

        return;

    }


    const name =
        result.querySelector(
            ".result-name"
        );


    if (!name) {

        return;

    }


    // --------------------------------------------------------
    // MEMORISE LE WINNER
    // --------------------------------------------------------

    result._selectedItem =
        item;


    // --------------------------------------------------------
    // NOM
    // --------------------------------------------------------

    name.textContent =
        getItemName(item);


    // --------------------------------------------------------
    // ANCIENNE IMAGE
    // --------------------------------------------------------

    const oldImage =
        result.querySelector(
            ".winner-image"
        );


    if (oldImage) {

        oldImage.remove();

    }


    // --------------------------------------------------------
    // IMAGE
    // --------------------------------------------------------

    const image =
        getItemImage(
            type,
            item
        );


    if (image) {

        const winnerImage =
            document.createElement(
                "img"
            );


        winnerImage.className =
            "winner-image";


        winnerImage.alt =
            getItemName(item);


        winnerImage.style.display =
            "inline-block";


        winnerImage.style.width =
            "auto";


        winnerImage.style.height =
            "55px";


        winnerImage.style.maxWidth =
            "90px";


        winnerImage.style.objectFit =
            "contain";


        winnerImage.style.verticalAlign =
            "middle";


        winnerImage.style.marginLeft =
            "18px";


        winnerImage.style.marginRight =
            "5px";


        winnerImage.style.marginBottom =
            "0";


        winnerImage.src =
            image.src;


        result.appendChild(
            winnerImage
        );

    }


    // --------------------------------------------------------
    // ANIMATION
    // --------------------------------------------------------

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
