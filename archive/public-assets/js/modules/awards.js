
export function initAwards() {
    const awardsFestivalsData = [
        {
            id: "dynasty-2023",
            title: "VIII Международный фестиваль искусств «Династия»",
            city: "Санкт-Петербург",
            country: "Россия",
            level: "международный",
            years: [2023],
            directions: ["theatre", "film"],
            headline:
                "Два Гран-при за фильмы «Твори Добро» и «Особняк потерянных шагов» плюс лауреат III степени за спектакль «Город Чудаков».",
            entries: [
                {
                    work: "«Твори Добро»",
                    type: "film",
                    status: "Гран-при",
                    category: "Короткометражный фильм / «Дорогою добра»",
                    year: 2023,
                    isTop: true,
                    note: ""
                },
                {
                    work: "«Особняк потерянных шагов»",
                    type: "film",
                    status: "Гран-при",
                    category: "Короткометражный фильм / «Петербургские тайны»",
                    year: 2023,
                    isTop: true,
                    note: ""
                },
                {
                    work: "«Город Чудаков»",
                    type: "theatre",
                    status: "Лауреат III степени",
                    category: "Драматический театр",
                    year: 2023,
                    isTop: false,
                    note: ""
                }
            ]
        },
        {
            id: "na-beregah-nevy-2018-2023",
            title: "Международный фестиваль искусств «На берегах Невы»",
            city: "Санкт-Петербург",
            country: "Россия",
            level: "международный",
            years: [2018, 2019, 2023],
            directions: ["theatre"],
            headline:
                "Гран-при за спектакль «Город Чудаков» и лауреаты I степени за «Кошкин дом» и другие постановки студии.",
            entries: [
                {
                    work: "«Город Чудаков»",
                    type: "theatre",
                    status: "Гран-при",
                    category: "Драматический театр",
                    year: 2023,
                    isTop: true,
                    note: ""
                },
                {
                    work: "«Кошкин дом»",
                    type: "theatre",
                    status: "Лауреат I степени",
                    category: "Драматический театр",
                    year: 2019,
                    isTop: false,
                    note: ""
                },
                {
                    work: "Другие спектакли студии",
                    type: "theatre",
                    status: "Лауреаты I степени",
                    category: "",
                    year: 2018,
                    isTop: false,
                    note: ""
                }
            ]
        },
        {
            id: "sokrovischa-vostoka-2022",
            title: "Международный фестиваль «Сокровища Востока»",
            city: "Казань",
            country: "Россия",
            level: "международный",
            years: [2022],
            directions: ["theatre", "speech"],
            headline:
                "Лауреат I степени за спектакль «Кошкин дом» и три лауреата I степени в номинации «Художественное слово».",
            entries: [
                {
                    work: "«Кошкин дом»",
                    type: "theatre",
                    status: "Лауреат I степени",
                    category: "Драматический театр",
                    year: 2022,
                    isTop: true,
                    note: ""
                },
                {
                    work: "Художественное слово — участник 1",
                    type: "speech",
                    status: "Лауреат I степени",
                    category: "Художественное слово (младшая группа)",
                    year: 2022,
                    isTop: false,
                    note: ""
                },
                {
                    work: "Художественное слово — участник 2",
                    type: "speech",
                    status: "Лауреат I степени",
                    category: "Художественное слово (средняя группа)",
                    year: 2022,
                    isTop: false,
                    note: ""
                },
                {
                    work: "Художественное слово — участник 3",
                    type: "speech",
                    status: "Лауреат I степени",
                    category: "Художественное слово (старшая группа)",
                    year: 2022,
                    isTop: false,
                    note: ""
                }
            ]
        },
        {
            id: "nesebar-2019",
            title:
                "Фестивали «Солнце – Радость – Красота» и «Звёзды Несебра»",
            city: "Несебр",
            country: "Болгария",
            level: "международный",
            years: [2019],
            directions: ["theatre"],
            headline:
                "Первое место на фестивале «Солнце – Радость – Красота» и лауреаты II степени на фестивале «Звёзды Несебра».",
            entries: [
                {
                    work: "Постановка студии (театр)",
                    type: "theatre",
                    status: "1 место",
                    category:
                        "Театральное искусство — нестандартные формы",
                    year: 2019,
                    isTop: true,
                    note: "Фестиваль «Солнце – Радость – Красота»"
                },
                {
                    work: "Постановка студии (театр)",
                    type: "theatre",
                    status: "Лауреаты II степени",
                    category: "",
                    year: 2019,
                    isTop: false,
                    note: "Фестиваль «Звёзды Несебра»"
                }
            ]
        },
        {
            id: "nevskoe-siyanie-2023-2024",
            title: "Международный фестиваль «Невское сияние»",
            city: "Санкт-Петербург",
            country: "Россия",
            level: "международный",
            years: [2023, 2024],
            directions: ["theatre", "speech"],
            headline:
                "«Кошкин дом» — лауреат II степени, чтецы студии берут весь диапазон наград от I до III степени.",
            entries: [
                {
                    work: "«Кошкин дом»",
                    type: "theatre",
                    status: "Лауреат II степени",
                    category: "Драматический театр",
                    year: 2023,
                    isTop: true,
                    note: ""
                },
                {
                    work: "Художественное слово — участники студии",
                    type: "speech",
                    status: "Лауреаты I–III степеней",
                    category: "Художественное слово",
                    year: 2023,
                    isTop: false,
                    note: ""
                },
                {
                    work: "Новые участники художественного слова",
                    type: "speech",
                    status: "Лауреаты и дипломанты",
                    category: "Художественное слово",
                    year: 2024,
                    isTop: false,
                    note: ""
                }
            ]
        },
        {
            id: "starkids-2024",
            title: "Фестиваль STARKIDS!",
            city: "Санкт-Петербург",
            country: "Россия",
            level: "фестиваль-конкурс",
            years: [2024],
            directions: ["theatre"],
            headline:
                "Спектакль «Кошкин дом» занимает 1 место в своей возрастной категории.",
            entries: [
                {
                    work: "«Кошкин дом»",
                    type: "theatre",
                    status: "1 место",
                    category: "Драматический театр (возрастная категория студии)",
                    year: 2024,
                    isTop: true,
                    note: ""
                }
            ]
        },
        {
            id: "ltfest-zimniy-les-2025",
            title: "LT FEST «Зимний лес»",
            city: "Санкт-Петербург",
            country: "Россия",
            level: "фестиваль",
            years: [2025],
            directions: ["theatre"],
            headline:
                "«Кошкин дом» — лауреат I степени и обладатель спецприза жюри за актёрское мастерство, «Лесная царевна» — лауреат III степени.",
            entries: [
                {
                    work: "«Кошкин дом»",
                    type: "theatre",
                    status: "Лауреат I степени",
                    category: "Драматический театр",
                    year: 2025,
                    isTop: true,
                    note: "Спецприз жюри за актёрское мастерство"
                },
                {
                    work: "«Лесная царевна»",
                    type: "theatre",
                    status: "Лауреат III степени",
                    category: "Драматический театр",
                    year: 2025,
                    isTop: false,
                    note: ""
                }
            ]
        }
    ];

    function buildTopAwardsFromFestivals(festivals) {
        const topAwards = [];

        festivals.forEach(function (festival) {
            if (!festival.entries) return;

            festival.entries.forEach(function (entry) {
                if (!entry.isTop) return;

                topAwards.push({
                    festivalId: festival.id,
                    label: entry.status + " — " + festival.title,
                    sublabel: entry.work,
                    level: festival.level,
                    city: festival.city,
                    year: entry.year
                });
            });
        });

        // Можно отсортировать: сначала Гран-при и 1 места, потом остальные
        topAwards.sort(function (a, b) {
            const score = function (status) {
                if (!status) return 0;
                if (status.indexOf("Гран-при") !== -1) return 3;
                if (status.indexOf("1 место") !== -1) return 2;
                if (status.indexOf("Лауреат I") !== -1) return 1;
                return 0;
            };

            const diff = score(b.label) - score(a.label);
            if (diff !== 0) return diff;

            return (b.year || 0) - (a.year || 0);
        });

        return topAwards;
    }

    function buildDirectionsTagsHtml(directions) {
        if (!directions || !directions.length) return "";

        return directions
            .map(function (dir) {
                if (dir === "theatre") {
                    return '<span class="festival-tag festival-tag--theatre">Театр</span>';
                }
                if (dir === "film") {
                    return '<span class="festival-tag festival-tag--film">Кино</span>';
                }
                if (dir === "speech") {
                    return '<span class="festival-tag festival-tag--speech">Художественное слово</span>';
                }
                return "";
            })
            .join("");
    }

    function renderTopAwardsStrip(container, topAwards) {
        if (!container) return;

        const isDesktop = window.innerWidth >= 1024;

        // Фабрика HTML для одного бейджа
        function getBadgeHtml(award) {
            var isGrandPrix = award.label.indexOf("Гран-при") !== -1;

            return (
                '<article class="award-badge' +
                (isGrandPrix ? " award-badge--grandprix" : "") +
                '" data-festival-id="' +
                award.festivalId +
                '">' +
                '<h3 class="award-badge-title">' +
                award.label +
                "</h3>" +
                (award.sublabel
                    ? '<p class="award-badge-text">' + award.sublabel + "</p>"
                    : "") +
                "</article>"
            );
        }

        // Базовый набор бейджей
        var badgesHtml = topAwards.map(getBadgeHtml).join("");

        // Если автолента — размножаем набор бейджей, чтобы создать бесшовный цикл.
        var autoStripParent = container.closest(".awards-strip--auto");
        var repeatCount = 1;

        if (autoStripParent) {
            repeatCount = isDesktop ? 5 : 3; // на мобильных оставляем дубль для нормального скролла

            if (isDesktop) {
                var shiftPercent = -(100 / repeatCount);
                container.style.setProperty("--awards-shift", shiftPercent + "%");
            } else {
                container.style.removeProperty("--awards-shift");
            }
        }

        container.innerHTML = "";
        for (var r = 0; r < repeatCount; r++) {
            container.innerHTML += badgesHtml;
        }

        // Подстраиваем размер круга под самый «толстый» бейдж первой партии
        var maxSize = 0;
        var badges = container.querySelectorAll(".award-badge");
        badges.forEach(function (badge, index) {
            if (repeatCount > 1 && index >= topAwards.length) return; // считаем только оригинал
            var rect = badge.getBoundingClientRect();
            maxSize = Math.max(maxSize, rect.width, rect.height);
        });
        if (maxSize > 0) {
            var targetSize = Math.ceil(maxSize + 20);
            container.style.setProperty("--award-badge-size", targetSize + "px");
        }

        // Запоминаем базовую ширину одного цикла и ставим скролл в центр,
        // чтобы было пространство для прокрутки в обе стороны.
        if (repeatCount > 1) {
            var baseWidth = container.scrollWidth / repeatCount;
            var viewport = container.parentElement;
            if (viewport) {
                viewport.scrollLeft = baseWidth * Math.floor(repeatCount / 2);
            }
            container.dataset.awardsBaseWidth = String(baseWidth);
            container.dataset.awardsRepeat = String(repeatCount);
        }

        // Один обработчик на весь контейнер (делегирование кликов)
        if (!container.__awardsClickBound) {
            container.addEventListener("click", function (event) {
                var badge = event.target.closest(".award-badge");
                if (!badge) return;

                var festivalId = badge.getAttribute("data-festival-id");
                if (!festivalId) return;

                var target = document.querySelector(
                    '[data-festival-id="' + festivalId + '"]'
                );
                if (target) {
                    target.scrollIntoView({ behavior: "smooth", block: "start" });
                }
            });

            container.__awardsClickBound = true;
        }
    }

    function initAwardsStripControls(stripEl) {
        if (!stripEl) return;

        const viewport = stripEl.querySelector(".awards-strip-viewport");
        const inner = stripEl.querySelector(".awards-strip-inner");
        if (!viewport || !inner) return;

        // Бесконечная лента: если содержимое дублировано (auto-лента),
        // то при прокрутке переставляем scrollLeft, чтобы сразу после конца шёл старт.
        const repeatCount = inner.dataset.awardsRepeat
            ? parseInt(inner.dataset.awardsRepeat, 10)
            : 1;
        const baseWidth = inner.dataset.awardsBaseWidth
            ? parseFloat(inner.dataset.awardsBaseWidth)
            : 0;
        if (repeatCount > 1 && baseWidth > 0) {
            const minEdge = baseWidth * 0.5;
            const maxEdge = baseWidth * (repeatCount - 1.5);

            viewport.addEventListener("scroll", function () {
                if (viewport.scrollLeft > maxEdge) {
                    viewport.scrollLeft -= baseWidth * (repeatCount - 2);
                } else if (viewport.scrollLeft < minEdge) {
                    viewport.scrollLeft += baseWidth * (repeatCount - 2);
                }
            });
        }

        // Drag/Swipe прокрутка
        let isDragging = false;
        let dragStartX = 0;
        let startScroll = 0;

        viewport.addEventListener("pointerdown", function (event) {
            isDragging = true;
            dragStartX = event.clientX;
            startScroll = viewport.scrollLeft;
            viewport.classList.add("is-dragging");
            viewport.setPointerCapture(event.pointerId);
        });

        viewport.addEventListener("pointermove", function (event) {
            if (!isDragging) return;
            const deltaX = event.clientX - dragStartX;
            viewport.scrollLeft = startScroll - deltaX;
        });

        function endDrag() {
            isDragging = false;
            viewport.classList.remove("is-dragging");
        }

        viewport.addEventListener("pointerup", endDrag);
        viewport.addEventListener("pointercancel", endDrag);
        viewport.addEventListener("pointerleave", endDrag);

        // Горизонтальный скролл мышью
        viewport.addEventListener(
            "wheel",
            function (event) {
                const delta =
                    Math.abs(event.deltaX) > Math.abs(event.deltaY)
                        ? event.deltaX
                        : event.deltaY;
                viewport.scrollLeft += delta;
                event.preventDefault();
            },
            { passive: false }
        );
    }

    function renderFestivalCards(container, festivals, maxVisible) {
        if (!container) return;
        container.innerHTML = "";

        // сортируем по максимальному году: свежие фестивали выше
        const sorted = festivals.slice().sort(function (a, b) {
            const maxYearA = a.years && a.years.length
                ? Math.max.apply(null, a.years)
                : 0;
            const maxYearB = b.years && b.years.length
                ? Math.max.apply(null, b.years)
                : 0;
            return maxYearB - maxYearA;
        });

        const displayCount =
            typeof maxVisible === "number" ? maxVisible : sorted.length;

        sorted.slice(0, displayCount).forEach(function (festival) {
            const card = document.createElement("article");
            card.className = "festival-card";
            card.setAttribute("data-festival-id", festival.id);

            const yearsText = festival.years && festival.years.length
                ? festival.years.join(" / ")
                : "";
            const metaParts = [];
            if (yearsText) metaParts.push(yearsText);
            if (festival.city) metaParts.push(festival.city);
            if (festival.level) metaParts.push(festival.level);
            const metaText = metaParts.join(" · ");

            const headerEl = document.createElement("header");

            const titleEl = document.createElement("h3");
            titleEl.className = "festival-card-title";
            titleEl.textContent = festival.title;

            const metaEl = document.createElement("p");
            metaEl.className = "festival-card-meta";
            metaEl.textContent = metaText;

            headerEl.appendChild(titleEl);
            headerEl.appendChild(metaEl);

            const headlineEl = document.createElement("p");
            headlineEl.className = "festival-card-headline";
            headlineEl.textContent = festival.headline;

            const listEl = document.createElement("ul");
            listEl.className = "festival-card-list";

            (festival.entries || [])
                .slice(0, 4) // на карточке максимум 3–4 пункта
                .forEach(function (entry) {
                    const parts = [];
                    if (entry.status) parts.push(entry.status);
                    if (entry.work) parts.push(entry.work);
                    if (entry.category) parts.push(entry.category);
                    if (entry.note) parts.push(entry.note);

                    const li = document.createElement("li");
                    li.textContent = parts.join(" — ");
                    listEl.appendChild(li);
                });

            const tagsWrapper = document.createElement("div");
            tagsWrapper.className = "festival-tags";
            tagsWrapper.innerHTML = buildDirectionsTagsHtml(festival.directions);

            card.appendChild(headerEl);
            card.appendChild(headlineEl);
            card.appendChild(listEl);
            card.appendChild(tagsWrapper);

            container.appendChild(card);
        });
    }

    const awardsSection = document.querySelector("#awards");
    if (!awardsSection) return;

    const stripRoot = awardsSection.querySelector("[data-top-awards-root]");
    const festivalsRoot = awardsSection.querySelector("[data-festivals-root]");
    if (!stripRoot || !festivalsRoot) return;

    const topAwards = buildTopAwardsFromFestivals(awardsFestivalsData);

    renderTopAwardsStrip(stripRoot, topAwards);
    initAwardsStripControls(awardsSection.querySelector("[data-awards-strip]"));

    let festivalsExpanded = false;

    function renderFestivalsList() {
        const isMobile = window.innerWidth <= 768;
        const maxVisible = isMobile ? 2 : awardsFestivalsData.length;
        const limit = festivalsExpanded ? awardsFestivalsData.length : maxVisible;

        renderFestivalCards(festivalsRoot, awardsFestivalsData, limit);

        if (isMobile && awardsFestivalsData.length > maxVisible) {
            const toggleBtn = document.createElement("button");
            toggleBtn.type = "button";
            toggleBtn.className = "people-toggle awards-toggle";
            toggleBtn.textContent = festivalsExpanded
                ? "Свернуть фестивали"
                : "Показать ещё фестивали";

            toggleBtn.addEventListener("click", function () {
                festivalsExpanded = !festivalsExpanded;
                renderFestivalsList();
            });

            festivalsRoot.appendChild(toggleBtn);
        }
    }

    renderFestivalsList();

    let wasMobile = window.innerWidth <= 768;
    window.addEventListener("resize", function () {
        const isMobile = window.innerWidth <= 768;
        if (isMobile !== wasMobile) {
            festivalsExpanded = false;
            renderFestivalsList();
            wasMobile = isMobile;
        }
    });
}
