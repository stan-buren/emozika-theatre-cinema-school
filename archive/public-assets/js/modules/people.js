
export function initPeople() {
    function initPeopleBlock(data) {
        const section = document.querySelector("#people");
        if (!section || !data) return;

        const filtersRoot = section.querySelector("[data-people-filters]");
        const peopleRoot = section.querySelector("[data-people-root]");
        if (!filtersRoot || !peopleRoot) return;

        const groups = Array.isArray(data.groups) ? data.groups : [];
        if (!groups.length) return;

        let activeGroupId = groups[0].id;
        let expanded = false;

        function getMaxVisible() {
            return window.innerWidth <= 768 ? 3 : 6;
        }

        function getActiveGroup() {
            return groups.find(function (group) {
                return group.id === activeGroupId;
            });
        }

        function renderFilters() {
            filtersRoot.innerHTML = "";

            groups.forEach(function (group) {
                const btn = document.createElement("button");
                btn.type = "button";
                btn.className =
                    "people-filter" + (group.id === activeGroupId ? " is-active" : "");
                btn.textContent = group.title || "";
                btn.setAttribute("data-group-id", group.id);
                btn.setAttribute("role", "tab");
                btn.setAttribute(
                    "aria-selected",
                    group.id === activeGroupId ? "true" : "false"
                );

                filtersRoot.appendChild(btn);
            });
        }

        function renderGroup() {
            peopleRoot.innerHTML = "";

            const group = getActiveGroup();
            if (!group) return;

            const grid = document.createElement("div");
            grid.className = "people-grid";

            const people = Array.isArray(group.people) ? group.people.slice() : [];

            people.sort(function (a, b) {
                const orderA = typeof a.order === "number" ? a.order : 0;
                const orderB = typeof b.order === "number" ? b.order : 0;
                return orderA - orderB;
            });

            const maxVisible = getMaxVisible();
            // const limit = expanded ? people.length : maxVisible; // unused for now?

            people.forEach(function (person, index) {
                const card = document.createElement("article");
                card.className = "person-card card-luxe";

                const figure = document.createElement("figure");
                figure.className = "person-photo";

                if (person.photoUrl) {
                    const photoWrapper = document.createElement("div");
                    photoWrapper.className = "people-card-photo";

                    const img = document.createElement("img");
                    img.src = person.photoUrl;
                    img.alt = person.name || "";

                    photoWrapper.appendChild(img);
                    figure.appendChild(photoWrapper);
                }

                const content = document.createElement("div");
                content.className = "person-content";

                const nameEl = document.createElement("h4");
                nameEl.className = "person-name";
                nameEl.textContent = person.name || "";
                content.appendChild(nameEl);

                if (person.role) {
                    const roleEl = document.createElement("p");
                    roleEl.className = "person-role";
                    roleEl.textContent = person.role;
                    content.appendChild(roleEl);
                }

                if (Array.isArray(person.tags) && person.tags.length) {
                    const tagsWrapper = document.createElement("div");
                    tagsWrapper.className = "person-tags";

                    person.tags.forEach(function (tag) {
                        const tagEl = document.createElement("span");
                        tagEl.className = "person-tag";
                        tagEl.textContent = tag;
                        tagsWrapper.appendChild(tagEl);
                    });

                    content.appendChild(tagsWrapper);
                }

                if (person.bio) {
                    const bioEl = document.createElement("p");
                    bioEl.className = "person-bio";
                    bioEl.textContent = person.bio;
                    content.appendChild(bioEl);
                }

                card.appendChild(figure);
                card.appendChild(content);

                if (!expanded && index >= maxVisible) {
                    card.classList.add("person-card--collapsed");
                }

                grid.appendChild(card);
            });

            peopleRoot.appendChild(grid);

            if (group.note) {
                const noteEl = document.createElement("p");
                noteEl.className = "people-note text-muted";
                noteEl.textContent = group.note;
                peopleRoot.appendChild(noteEl);
            }

            if (people.length > maxVisible) {
                const toggleBtn = document.createElement("button");
                toggleBtn.type = "button";
                toggleBtn.className = "people-toggle";
                toggleBtn.textContent = expanded
                    ? "Свернуть раздел"
                    : "Показать ещё людей";

                toggleBtn.addEventListener("click", function () {
                    expanded = !expanded;
                    renderGroup();
                });

                peopleRoot.appendChild(toggleBtn);
            }
        }

        filtersRoot.addEventListener("click", function (event) {
            const btn = event.target.closest(".people-filter");
            if (!btn) return;

            const groupId = btn.getAttribute("data-group-id");
            if (!groupId || groupId === activeGroupId) return;

            activeGroupId = groupId;
            expanded = false;
            renderFilters();
            renderGroup();
        });

        renderFilters();
        renderGroup();

        let isMobile = window.innerWidth <= 768;
        window.addEventListener("resize", function () {
            const nowMobile = window.innerWidth <= 768;
            if (nowMobile !== isMobile && !expanded) {
                isMobile = nowMobile;
                renderGroup();
            }
        });
    }

    // Люди театра — загрузка JSON и рендер
    fetch("assets/data/people.json")
        .then(function (response) {
            if (!response.ok) {
                throw new Error("HTTP " + response.status);
            }
            return response.json();
        })
        .then(function (data) {
            initPeopleBlock(data);
        })
        .catch(function (error) {
            console.error("Не удалось загрузить данные людей театра:", error);
        });
}
