
export function initFilms() {
    const filmsSection = document.querySelector("#films");

    if (filmsSection) {
        const carouselEl = filmsSection.querySelector("[data-films-carousel]");
        const detailEl = filmsSection.querySelector("[data-film-detail]");

        if (carouselEl && detailEl) {
            let filmsData = [];
            let activeFilmId = null;

            function renderCarousel() {
                carouselEl.innerHTML = "";

                filmsData.forEach((film) => {
                    const card = document.createElement("button");
                    card.type = "button";
                    card.className =
                        "films-card" + (film.id === activeFilmId ? " films-card--active" : "");
                    card.setAttribute("data-film-id", film.id);

                    const yearLabel = film.year || "Добавить данные";
                    const cityLabel = film.city || "Добавить данные";

                    const awards = film.awards || [];
                    const visibleAwards = awards.slice(0, 2);
                    const extraCount = awards.length > 2 ? awards.length - 2 : 0;

                    const awardsHtml = visibleAwards
                        .map((a) => {
                            let pillClass = "films-card-award-pill badge badge--soft";

                            if (a.status && /гран[- ]?при/i.test(a.status)) {
                                pillClass = "films-card-award-pill badge badge--gold";
                            }

                            const text = [a.status, a.festival].filter(Boolean).join(" ");
                            return `<span class="${pillClass}">${text}</span>`;
                        })
                        .join("");

                    const extraHtml =
                        extraCount > 0
                            ? `<span class="films-card-award-pill films-card-award-pill--more badge badge--outline">+${extraCount} фестиваля</span>`
                            : "";

                    card.innerHTML = `
            <div class="films-card-poster">
              <div class="films-card-poster-inner">
                ${film.title.charAt(0) || "Ф"}
              </div>
            </div>
            <div class="films-card-main">
              <h4 class="films-card-title">${film.title}</h4>
              <p class="films-card-meta">${yearLabel} · ${cityLabel}</p>
              <p class="films-card-logline">${film.logline || ""}</p>
              <div class="films-card-awards">
                ${awardsHtml}${extraHtml}
              </div>
            </div>
          `;

                    card.addEventListener("click", () => {
                        if (activeFilmId === film.id) return;
                        activeFilmId = film.id;
                        renderCarousel();
                        renderDetail(film);
                    });

                    carouselEl.appendChild(card);
                });
            }

            function renderDetail(film) {
                const titleEl = detailEl.querySelector("[data-film-title]");
                const metaEl = detailEl.querySelector("[data-film-meta]");
                const authorsEl = detailEl.querySelector("[data-film-authors]");
                const synopsisEl = detailEl.querySelector("[data-film-synopsis]");
                const awardsEl = detailEl.querySelector("[data-film-awards]");
                const embedEl = detailEl.querySelector("[data-film-embed]");
                const vkLinkEl = detailEl.querySelector("[data-film-vk-link]");

                if (titleEl) {
                    titleEl.textContent = film.title;
                }

                if (metaEl) {
                    const yearLabel = film.year || "Добавить данные";
                    const cityLabel = film.city || "Добавить данные";
                    metaEl.textContent = `${yearLabel} · ${cityLabel}`;
                }

                if (authorsEl) {
                    const pieces = [
                        `Сценарий: ${film.writer || "Добавить данные"}`,
                        `Режиссура: ${film.directors && film.directors.length
                            ? film.directors.join(", ")
                            : "Добавить данные"
                        }`,
                        `Оператор: ${film.dop || "Добавить данные"}`,
                    ];

                    if (film.editor) {
                        pieces.push(`Редактор: ${film.editor}`);
                    }

                    authorsEl.innerHTML = pieces
                        .map((text) => `<span class="films-detail-author">${text}</span>`)
                        .join("");
                }

                if (synopsisEl) {
                    synopsisEl.textContent = film.synopsis || "";
                }

                if (awardsEl) {
                    awardsEl.innerHTML = "";

                    const awards = film.awards || [];

                    if (!awards.length) {
                        const li = document.createElement("li");
                        li.className = "films-detail-award films-detail-award--empty";
                        li.textContent = "Награды будут добавлены позже.";
                        awardsEl.appendChild(li);
                    } else {
                        awards.forEach((award) => {
                            const li = document.createElement("li");
                            li.className = "films-detail-award";
                            const parts = [
                                award.status,
                                award.festival,
                                award.city && `(${award.city})`,
                                award.year,
                            ].filter(Boolean);
                            li.textContent = parts.join(", ");
                            awardsEl.appendChild(li);
                        });
                    }
                }

                if (embedEl) {
                    if (film.vkEmbedUrl) {
                        embedEl.innerHTML = `
              <iframe
                src="${film.vkEmbedUrl}"
                frameborder="0"
                allowfullscreen
                loading="lazy"
              ></iframe>
            `;
                    } else {
                        embedEl.innerHTML =
                            '<div class="films-video-placeholder">Видео появится позже</div>';
                    }
                }

                if (vkLinkEl) {
                    const url = film.vkPageUrl || film.vkEmbedUrl;
                    if (url) {
                        vkLinkEl.href = url;
                        vkLinkEl.style.display = "";
                    } else {
                        vkLinkEl.style.display = "none";
                    }
                }
            }

            function initFilmsData(data) {
                filmsData = Array.isArray(data) ? data : [];
                if (!filmsData.length) return;

                activeFilmId = filmsData[0].id;
                renderCarousel();
                renderDetail(filmsData[0]);
            }

            fetch("assets/data/films.json")
                .then(function (response) {
                    if (!response.ok) {
                        throw new Error("HTTP " + response.status);
                    }
                    return response.json();
                })
                .then(function (data) {
                    initFilmsData(data);
                })
                .catch(function (error) {
                    console.error("Не удалось загрузить данные фильмов:", error);
                });
        }
    }
}
