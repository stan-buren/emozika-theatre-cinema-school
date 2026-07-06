
export function initBranches() {
    function sortBranches(branches) {
        if (!Array.isArray(branches)) return [];

        return branches
            .slice()
            .sort(function (a, b) {
                // 1. Сначала площадки с группами 18+
                if (a.isAdults && !b.isAdults) return -1;
                if (!a.isAdults && b.isAdults) return 1;

                // 2. Потом по станции метро (по алфавиту)
                var metroA = (a.metro || "").toLowerCase();
                var metroB = (b.metro || "").toLowerCase();
                if (metroA < metroB) return -1;
                if (metroA > metroB) return 1;

                // 3. Город (на всякий случай)
                var cityA = (a.city || "").toLowerCase();
                var cityB = (b.city || "").toLowerCase();
                if (cityA < cityB) return -1;
                if (cityA > cityB) return 1;

                // 4. Название площадки
                var placeA = (a.place || "").toLowerCase();
                var placeB = (b.place || "").toLowerCase();
                if (placeA < placeB) return -1;
                if (placeA > placeB) return 1;

                return 0;
            });
    }

    function renderBranchesList(rootEl, branches, filter, highlightMetro) {
        if (!rootEl) return;

        rootEl.innerHTML = "";

        var filtered = Array.isArray(branches) ? branches.slice() : [];
        var highlight = (highlightMetro || "").toLowerCase();

        if (filter === "adults") {
            filtered = filtered.filter(function (branch) {
                return branch.isAdults;
            });
        }

        if (!filtered.length) {
            var empty = document.createElement("p");
            empty.className = "branches-empty";
            empty.textContent =
                filter === "adults"
                    ? "Сейчас группы для взрослых проходят только на части площадок. Уточните расписание у администратора студии."
                    : "Филиалы временно недоступны.";
            rootEl.appendChild(empty);
            return;
        }

        filtered.forEach(function (branch) {
            var card = document.createElement("article");
            card.className =
                "branch-card card-hover" +
                (branch.isAdults ? " branch-card--adults" : "");

            // Подсветка «моей» станции метро
            if (
                highlight &&
                (branch.metro || "").toLowerCase() === highlight
            ) {
                card.classList.add("branch-card--highlight");
            }

            // Верхняя строка: метро + название площадки
            var topRow = document.createElement("div");
            topRow.className = "branch-card-top";

            var metroBadge = document.createElement("span");
            metroBadge.className = "branch-metro";
            metroBadge.textContent = branch.metro || "";

            var placeTitle = document.createElement("h3");
            placeTitle.className = "branch-place";
            placeTitle.textContent = branch.place || "";

            topRow.appendChild(metroBadge);
            topRow.appendChild(placeTitle);

            // Адрес
            var address = document.createElement("p");
            address.className = "branch-address";
            address.textContent = branch.address || "";

            // Город / район
            var metaRow = document.createElement("div");
            metaRow.className = "branch-meta";

            if (branch.city) {
                var citySpan = document.createElement("span");
                citySpan.className = "branch-city";
                citySpan.textContent = branch.city;
                metaRow.appendChild(citySpan);
            }

            if (branch.area) {
                var areaSpan = document.createElement("span");
                areaSpan.className = "branch-area";
                areaSpan.textContent = branch.area;
                metaRow.appendChild(areaSpan);
            }

            // Комментарий (если есть)
            if (branch.comment) {
                var comment = document.createElement("p");
                comment.className = "branch-comment";
                comment.textContent = branch.comment;
                card.appendChild(comment);
            }

            // Телефоны
            if (branch.phones && branch.phones.length) {
                var phonesList = document.createElement("div");
                phonesList.className = "branch-phones";

                var phonesLabel = document.createElement("span");
                phonesLabel.className = "branch-phones-label";
                phonesLabel.textContent =
                    branch.phones.length > 1
                        ? "Телефоны администратора:"
                        : "Телефон администратора:";
                phonesList.appendChild(phonesLabel);

                branch.phones.forEach(function (phone) {
                    var link = document.createElement("a");
                    link.className = "branch-phone-link";
                    link.href = "tel:" + phone.replace(/\s+/g, "");
                    link.textContent = phone;
                    phonesList.appendChild(link);
                });

                card.appendChild(phonesList);
            }

            // Бейдж 18+
            if (branch.isAdults) {
                var badge = document.createElement("span");
                badge.className = "branch-adults-badge";
                badge.textContent = "Группы 18+";
                card.appendChild(badge);
            }

            card.appendChild(topRow);
            card.appendChild(address);

            if (metaRow.childNodes.length) {
                card.appendChild(metaRow);
            }

            rootEl.appendChild(card);
        });
    }

    function getUniqueMetros(branches) {
        var seen = {};
        var metros = [];

        if (!Array.isArray(branches)) return metros;

        branches.forEach(function (branch) {
            var metro = branch.metro || "";
            if (!metro) return;
            if (seen[metro]) return;
            seen[metro] = true;
            metros.push(metro);
        });

        metros.sort(function (a, b) {
            return a.localeCompare(b, "ru");
        });

        return metros;
    }

    function getUniqueAreas(branches) {
        var seen = {};
        var areas = [];

        if (!Array.isArray(branches)) return areas;

        branches.forEach(function (branch) {
            var area = branch.area || "";
            if (!area) return;
            if (seen[area]) return;
            seen[area] = true;
            areas.push(area);
        });

        areas.sort(function (a, b) {
            return a.localeCompare(b, "ru");
        });

        return areas;
    }

    function renderBranchesAreas(rootEl, areas) {
        if (!rootEl) return;

        rootEl.innerHTML = "";

        if (!Array.isArray(areas) || !areas.length) {
            var fallback = document.createElement("li");
            fallback.className = "branches-area-item";
            fallback.textContent = "Санкт-Петербург и Кудрово";
            rootEl.appendChild(fallback);
            return;
        }

        areas.forEach(function (area) {
            var li = document.createElement("li");
            li.className = "branches-area-item";
            li.textContent = area;
            rootEl.appendChild(li);
        });
    }

    function getMetroFromQuery() {
        if (!window.location || !window.location.search) return "";

        try {
            var params = new URLSearchParams(window.location.search);
            var value = params.get("metro");
            return value ? value.trim() : "";
        } catch (e) {
            return "";
        }
    }

    function initBranchesSection(branches) {
        var section = document.querySelector("#branches");
        if (!section) return;

        var listRoot = section.querySelector("[data-branches-list]");
        var filterButtons = section.querySelectorAll("[data-branch-filter]");
        var myMetroSelect = section.querySelector("[data-branch-my-metro]");
        var areasRoot = section.querySelector("[data-branches-areas]");

        if (!listRoot) return;

        var sorted = sortBranches(branches);
        var activeFilter = "all";
        var highlightMetro = "";

        // Пробуем взять метро из параметра URL (?metro=...)
        var metroFromUrl = getMetroFromQuery();
        if (metroFromUrl) {
            highlightMetro = metroFromUrl;
        }

        function updateView() {
            renderBranchesList(listRoot, sorted, activeFilter, highlightMetro);
        }

        function setActiveFilter(value) {
            activeFilter = value;

            if (filterButtons && filterButtons.length) {
                filterButtons.forEach(function (btn) {
                    var btnFilter = btn.getAttribute("data-branch-filter") || "all";
                    btn.classList.toggle("is-active", btnFilter === activeFilter);
                });
            }

            updateView();
        }

        function setHighlightMetro(value) {
            highlightMetro = value || "";

            if (myMetroSelect) {
                var currentValue = myMetroSelect.value || "";
                if (currentValue !== highlightMetro) {
                    myMetroSelect.value = highlightMetro;
                }
            }

            updateView();
        }

        // Наполняем селект «Моя станция метро» вариантами
        if (myMetroSelect) {
            myMetroSelect.innerHTML = "";
            var placeholder = document.createElement("option");
            placeholder.value = "";
            placeholder.textContent = "Не выбрано";
            myMetroSelect.appendChild(placeholder);

            var metros = getUniqueMetros(sorted);
            metros.forEach(function (metro) {
                var option = document.createElement("option");
                option.value = metro;
                option.textContent = metro;
                myMetroSelect.appendChild(option);
            });

            if (highlightMetro) {
                myMetroSelect.value = highlightMetro;
            }

            myMetroSelect.addEventListener("change", function () {
                var value = myMetroSelect.value || "";
                setHighlightMetro(value);
            });
        }

        // Наполняем легенду районов у карты
        if (areasRoot) {
            var areas = getUniqueAreas(sorted);
            renderBranchesAreas(areasRoot, areas);
        }

        if (filterButtons && filterButtons.length) {
            filterButtons.forEach(function (btn) {
                btn.addEventListener("click", function () {
                    var value = btn.getAttribute("data-branch-filter") || "all";
                    setActiveFilter(value);
                });
            });
        }

        // Стартовое отображение
        updateView();
    }

    // Загрузка филиалов из JSON и инициализация секции
    fetch("assets/data/branches.json")
        .then(function (response) {
            if (!response.ok) {
                throw new Error("HTTP " + response.status);
            }
            return response.json();
        })
        .then(function (json) {
            var branches = Array.isArray(json) ? json : json.branches || [];
            if (branches.length) {
                initBranchesSection(branches);
            }
        })
        .catch(function (error) {
            console.error("Не удалось загрузить филиалы:", error);
        });
}
