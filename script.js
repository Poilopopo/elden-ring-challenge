// ============================================================
// ELDEN RING CHALLENGE
// MACHINE A SOUS
// FR / EN
// ============================================================


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

        spinAll:
            "⚔ TOURNER LES ROUES ⚔",

        fate:
            "⚔ DESTIN EN COURS... ⚔",

        spin:
            "◆ TOURNER ◆",

        destiny:
            "DESTIN..."

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

        spinAll:
            "⚔ SPIN THE WHEELS ⚔",

        fate:
            "⚔ FATE IN PROGRESS... ⚔",

        spin:
            "◆ SPIN ◆",

        destiny:
            "FATE..."

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

        return item.nameEN;

    }


    return item.nameFR;

}


// ============================================================
// CHANGEMENT DE LANGUE
// ============================================================

function setLanguage(language) {

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
//
// Retraduit les résultats déjà affichés lorsqu'on change
// de langue.
// ============================================================

function updateDisplayedResults() {

    const resultTypes = [

        "talisman",

        "arme",

        "objectif"

    ];


    resultTypes.forEach(
        function(type) {

            // ------------------------------------------------
            // RESULTAT ROUE PRINCIPALE
            // ------------------------------------------------

            const result =
                document.getElementById(
                    "result-" + type
                );


            if (
                result &&
                result._selectedItem
            ) {

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


            // ------------------------------------------------
            // RESULTAT ROUE INDIVIDUELLE
            // ------------------------------------------------

            const singleResult =
                document.getElementById(
                    "single-result-" + type
                );


            if (
                singleResult &&
                singleResult._selectedItem
            ) {

                const name =
                    singleResult.querySelector(
                        ".result-name"
                    );


                if (name) {

                    name.textContent =
                        getItemName(
                            singleResult._selectedItem
                        );

                }


                const image =
                    singleResult.querySelector(
                        ".winner-image"
                    );


                if (image) {

                    image.alt =
                        getItemName(
                            singleResult._selectedItem
                        );

                }

            }

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
            ".wheel-card h3, .single-wheel-card h3"
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
    // FOOTER
    // --------------------------------------------------------

    const footer =
        document.querySelector(
            "footer"
        );


    if (footer) {

        const spans =
            footer.querySelectorAll(
                "span"
            );


        footer.textContent = "";


        const left =
            document.createElement(
                "span"
            );


        left.textContent =
            "—";


        const text =
            document.createTextNode(
                " ELDEN RING " +
                (
                    currentLanguage === "fr"
                        ? "CHALLENGE"
                        : "CHALLENGE"
                ) +
                " "
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
    // RESULTATS DEJA AFFICHES
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
//
// Important :
// On ne relance PAS les roues.
//
// On redessine simplement les mêmes éléments
// avec la langue sélectionnée.
// ============================================================

function redrawAllWheels() {

    Object
        .values(
            wheels
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


    Object
        .values(
            singleWheels
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
// Chance facultative.
// Image facultative.
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


                    // ------------------------------------------------
                    // IMAGE
                    // ------------------------------------------------

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


    // --------------------------------------------------------
    // Encode proprement le nom du fichier
    // --------------------------------------------------------

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


    // --------------------------------------------------------
    // Image déjà chargée / en cours de chargement
    // --------------------------------------------------------

    if (
        wheelImageCache[imagePath]
    ) {

        return wheelImageCache[
            imagePath
        ];

    }


    // --------------------------------------------------------
    // Création de l'image
    // --------------------------------------------------------

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
// MACHINES PRINCIPALES
// ============================================================

const wheels = {

    talisman: {

        canvas:
            document.getElementById(
                "wheel-talisman"
            ),

        items:
            talismans,

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

    },


    arme: {

        canvas:
            document.getElementById(
                "wheel-arme"
            ),

        items:
            armes,

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

    },


    objectif: {

        canvas:
            document.getElementById(
                "wheel-objectif"
            ),

        items:
            objectifs,

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

        items:
            talismans,

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

    },


    arme: {

        canvas:
            document.getElementById(
                "single-wheel-arme"
            ),

        items:
            armes,

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

    },


    objectif: {

        canvas:
            document.getElementById(
                "single-wheel-objectif"
            ),

        items:
            objectifs,

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


    wheel.currentItems =
        visibleItems.slice();


    wheel.currentOffset =
        offset;


    wheel.currentStartSequenceIndex =
        startSequenceIndex;


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
    wheelCollection
) {

    // --------------------------------------------------------
    // EFFACE LE RESULTAT PRECEDENT
    // --------------------------------------------------------

    const resultId =
        wheelCollection === singleWheels
            ? "single-result-" + type
            : "result-" + type;


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


        // Oublie également l'ancien résultat
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
        // RESULTAT TEXTE + IMAGE
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
                        translations[
                            currentLanguage
                        ].spinAll;

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
    // PRECHARGEMENT DES IMAGES
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
//
// L'IMAGE EST AFFICHÉE UNIQUEMENT ICI.
//
// Elle n'est PAS dessinée dans le canvas.
// Elle apparaît dans l'encadré du winner,
// à droite du nom.
//
// Le résultat est mémorisé dans _selectedItem afin
// de pouvoir être retraduit lors d'un changement de langue.
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


    // --------------------------------------------------------
    // MEMORISE LE WINNER
    // --------------------------------------------------------
    //
    // Très important pour pouvoir le retraduire plus tard.
    // --------------------------------------------------------

    result._selectedItem =
        item;


    // --------------------------------------------------------
    // NOM DU WINNER
    // --------------------------------------------------------

    name.textContent =
        getItemName(item);


    // --------------------------------------------------------
    // SUPPRIME UNE EVENTUELLE ANCIENNE IMAGE
    // --------------------------------------------------------

    const oldImage =
        result.querySelector(
            ".winner-image"
        );


    if (oldImage) {

        oldImage.remove();

    }


    // --------------------------------------------------------
    // CHERCHE L'IMAGE
    // --------------------------------------------------------

    const image =
        getItemImage(
            type,
            item
        );


    if (
        image
    ) {

        // ----------------------------------------------------
        // On utilise une nouvelle balise image dans
        // l'encadré du résultat.
        // ----------------------------------------------------

        const winnerImage =
            document.createElement(
                "img"
            );


        winnerImage.className =
            "winner-image";


        winnerImage.alt =
            getItemName(item);


        // ----------------------------------------------------
        // STYLE UNIQUEMENT SUR L'IMAGE
        //
        // Aucun changement du CSS de la page.
        // ----------------------------------------------------

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


        // ----------------------------------------------------
        // Image
        // ----------------------------------------------------

        winnerImage.src =
            image.src;


        // ----------------------------------------------------
        // L'image est placée APRES le libellé du winner
        // ----------------------------------------------------

        result.appendChild(
            winnerImage
        );

    }


    // --------------------------------------------------------
    // ANIMATION EXISTANTE DU RESULTAT
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
