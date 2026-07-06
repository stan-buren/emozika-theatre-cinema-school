
export function initAfisha() {
    const afishaSection = document.querySelector("#afisha");

    if (afishaSection) {
        const stripEl = afishaSection.querySelector("[data-afisha-strip]");
        const prevBtn = afishaSection.querySelector(".afisha-strip-arrow--prev");
        const nextBtn = afishaSection.querySelector(".afisha-strip-arrow--next");

        const modalEl = document.querySelector("[data-play-modal]");
        const modalCloseEls = modalEl
            ? modalEl.querySelectorAll("[data-play-modal-close]")
            : [];
        const badgeEl = modalEl ? modalEl.querySelector("[data-play-badge]") : null;
        const titleEl = modalEl ? modalEl.querySelector("[data-play-title]") : null;
        const metaEl = modalEl ? modalEl.querySelector("[data-play-meta]") : null;
        const taglineEl = modalEl
            ? modalEl.querySelector("[data-play-tagline]")
            : null;
        const descEl = modalEl
            ? modalEl.querySelector("[data-play-description]")
            : null;
        const whyListEl = modalEl ? modalEl.querySelector("[data-play-why]") : null;
        const whyBlockEl = modalEl
            ? modalEl.querySelector("[data-play-why-container]")
            : null;
        const authorEl = modalEl
            ? modalEl.querySelector("[data-play-author]")
            : null;
        const directorEl = modalEl
            ? modalEl.querySelector("[data-play-director]")
            : null;
        const castTitleEl = modalEl
            ? modalEl.querySelector("[data-play-cast-title]")
            : null;
        const castListEl = modalEl
            ? modalEl.querySelector("[data-play-cast]")
            : null;
        const castBlockEl = modalEl
            ? modalEl.querySelector("[data-play-cast-container]")
            : null;
        const mediaPhotosEl = modalEl
            ? modalEl.querySelector("[data-play-photos]")
            : null;
        const mediaVideoEl = modalEl
            ? modalEl.querySelector("[data-play-video]")
            : null;
        const ticketEl = modalEl
            ? modalEl.querySelector("[data-play-ticket]")
            : null;

        let playsData = [];

        function getAfishaPlays() {
            return playsData
                .filter(function (play) {
                    return play.showInAfisha;
                })
                .sort(function (a, b) {
                    const orderA =
                        typeof a.afishaOrder === "number" ? a.afishaOrder : 999;
                    const orderB =
                        typeof b.afishaOrder === "number" ? b.afishaOrder : 999;
                    return orderA - orderB;
                });
        }

        function buildMetaLine(play) {
            const parts = [];
            if (play.age) parts.push(play.age);
            if (play.genre) parts.push(play.genre);
            if (play.duration) parts.push(play.duration);
            if (play.hall) parts.push(play.hall);
            if (play.city) parts.push(play.city);
            return parts.join(" • ");
        }

        function buildAfishaSubline(play) {
            const parts = [];
            if (play.genre) parts.push(play.genre);
            if (play.age) parts.push(play.age);
            return parts.join(" • ");
        }

        function renderAfishaFallback(message) {
            if (!stripEl) return;

            const text =
                message ||
                "Афиша обновляется. Напишите администратору, если нужна консультация или бронирование.";

            stripEl.innerHTML =
                '<article class="afisha-card afisha-card--empty card-luxe">' +
                '<div class="afisha-card-empty-body">' +
                '<p class="afisha-empty-title">Афиша скоро обновится</p>' +
                '<p class="afisha-empty-text">' +
                text +
                "</p>" +
                '<div class="afisha-empty-actions">' +
                '<button type="button" class="btn btn-outline btn-lg" data-scroll-to="contacts">Спросить администратора</button>' +
                '<a class="btn btn-primary btn-lg" href="https://clck.ru/3QWtC2" target="_blank" rel="noopener">Купить билет</a>' +
                "</div>" +
                "</div>" +
                "</article>";
        }

        function renderAfishaStrip() {
            if (!stripEl) return;

            const afishaPlays = getAfishaPlays();
            if (!afishaPlays.length) {
                renderAfishaFallback(
                    "Скоро здесь появятся спектакли театра «Эмоцика». Напишите нам, если хотите забронировать заранее."
                );
                return;
            }

            const html = afishaPlays
                .map(function (play) {
                    const posterDesktop =
                        (play.poster && play.poster.desktop) ||
                        (play.poster && play.poster.mobile) ||
                        "";
                    const subline = buildAfishaSubline(play);
                    const note = play.afishaNote
                        ? '<p class="afisha-card-note">' + play.afishaNote + "</p>"
                        : "";
                    const posterHtml = posterDesktop
                        ? '<img class="afisha-card-poster-image" src="' +
                        posterDesktop +
                        '" alt="Постер спектакля ' +
                        play.title +
                        '">'
                        : '<div class="afisha-card-poster-placeholder">Фото появится позже</div>';

                    let badgeHtml = "";
                    if (play.badge) {
                        let badgeClass = "afisha-card-badge badge badge--glass";
                        if (play.badgeType) {
                            badgeClass += " afisha-card-badge--" + play.badgeType;
                        }
                        badgeHtml =
                            '<span class="' + badgeClass + '">' + play.badge + "</span>";
                    }

                    return (
                        '<article class="afisha-card afisha-card--strip card-luxe" data-play-id="' +
                        play.id +
                        '" data-play-trigger>' +
                        '<div class="afisha-card-poster-wrapper">' +
                        posterHtml +
                        (badgeHtml
                            ? '<div class="afisha-card-badge-wrap">' + badgeHtml + "</div>"
                            : "") +
                        "</div>" +
                        '<div class="afisha-card-footer">' +
                        (subline
                            ? '<p class="afisha-card-subline">' + subline + "</p>"
                            : "") +
                        '<h3 class="afisha-title">' +
                        play.title +
                        "</h3>" +
                        '<div class="afisha-buttons afisha-buttons--strip">' +
                        (play.ticketUrl
                            ? '<a class="btn btn-primary btn-sm" href="' +
                            play.ticketUrl +
                            '" target="_blank" rel="noopener">Билеты</a>'
                            : '<span class="afisha-no-tickets">Скоро в продаже</span>') +
                        "</div>" +
                        "</div>" +
                        "</article>"
                    );
                })
                .join("");

            stripEl.innerHTML = html;
        }

        function openPlayModal(playId) {
            if (!modalEl || !playsData.length) return;

            const play = playsData.find(function (item) {
                return item.id === playId;
            });
            if (!play) return;

            const metaLine = buildMetaLine(play);

            if (badgeEl) {
                if (play.badge) {
                    badgeEl.textContent = play.badge;
                    badgeEl.classList.remove("is-hidden");
                } else {
                    badgeEl.textContent = "";
                    badgeEl.classList.add("is-hidden");
                }
            }

            if (titleEl) {
                titleEl.textContent = play.title || "";
            }

            if (metaEl) {
                metaEl.textContent = metaLine || "";
                metaEl.classList.toggle("is-hidden", !metaLine);
            }

            if (taglineEl) {
                taglineEl.textContent = play.tagline || "";
                taglineEl.classList.toggle("is-hidden", !play.tagline);
            }

            if (descEl) {
                descEl.innerHTML = "";
                if (Array.isArray(play.description) && play.description.length) {
                    play.description.forEach(function (paragraph) {
                        const p = document.createElement("p");
                        p.textContent = paragraph;
                        descEl.appendChild(p);
                    });
                }
            }

            if (whyListEl && whyBlockEl) {
                whyListEl.innerHTML = "";
                if (Array.isArray(play.whyToWatch) && play.whyToWatch.length) {
                    play.whyToWatch.forEach(function (item) {
                        const li = document.createElement("li");
                        li.textContent = item;
                        whyListEl.appendChild(li);
                    });
                    whyBlockEl.classList.remove("is-hidden");
                } else {
                    whyBlockEl.classList.add("is-hidden");
                }
            }

            if (authorEl) {
                const hasAuthor = play.credits && play.credits.author;
                authorEl.textContent = hasAuthor ? "Автор: " + play.credits.author : "";
                authorEl.classList.toggle("is-hidden", !hasAuthor);
            }

            if (directorEl) {
                const hasDirector = play.credits && play.credits.director;
                directorEl.textContent = hasDirector
                    ? "Режиссёр: " + play.credits.director
                    : "";
                directorEl.classList.toggle("is-hidden", !hasDirector);
            }

            if (castListEl && castTitleEl && castBlockEl) {
                castListEl.innerHTML = "";
                const cast =
                    play.credits && Array.isArray(play.credits.cast)
                        ? play.credits.cast
                        : [];
                if (cast.length) {
                    const castTitle = play.credits.castTitle || "В ролях";
                    castTitleEl.textContent = castTitle;
                    cast.forEach(function (name) {
                        const li = document.createElement("li");
                        li.textContent = name;
                        castListEl.appendChild(li);
                    });
                    castBlockEl.classList.remove("is-hidden");
                } else {
                    castBlockEl.classList.add("is-hidden");
                }
            }

            if (mediaPhotosEl) {
                mediaPhotosEl.innerHTML = "";

                const photos =
                    play.media &&
                        Array.isArray(play.media.photos) &&
                        play.media.photos.filter(Boolean).length
                        ? play.media.photos.filter(Boolean)
                        : [];

                if (!photos.length && play.poster && play.poster.desktop) {
                    photos.push(play.poster.desktop);
                }

                if (photos.length) {
                    photos.forEach(function (src) {
                        const img = document.createElement("img");
                        img.src = src;
                        img.alt = "Фотография спектакля " + play.title;
                        img.className = "play-modal-photo";
                        mediaPhotosEl.appendChild(img);
                    });
                } else {
                    const placeholder = document.createElement("div");
                    placeholder.className = "play-modal-photo-placeholder";
                    placeholder.textContent = "Фотографии спектакля появятся здесь после ближайшего показа.";
                    mediaPhotosEl.appendChild(placeholder);
                }
            }

            if (mediaVideoEl) {
                mediaVideoEl.innerHTML = "";
                if (play.media && play.media.video) {
                    const videoPlaceholder = document.createElement("div");
                    videoPlaceholder.className = "play-modal-video-placeholder";
                    videoPlaceholder.textContent =
                        "Видео спектакля скоро появится на сайте.";
                    mediaVideoEl.appendChild(videoPlaceholder);
                }
            }

            if (ticketEl) {
                if (play.ticketUrl) {
                    ticketEl.href = play.ticketUrl;
                    ticketEl.classList.remove("is-hidden");
                } else {
                    ticketEl.removeAttribute("href");
                    ticketEl.classList.add("is-hidden");
                }
            }

            modalEl.removeAttribute("hidden");
            document.body.classList.add("has-modal-open");
        }

        function closePlayModal() {
            if (!modalEl) return;
            modalEl.setAttribute("hidden", "true");
            document.body.classList.remove("has-modal-open");
        }

        function bindAfishaEvents() {
            if (!stripEl) return;

            // Клик по карточке (открытие модалки)
            stripEl.addEventListener("click", function (event) {
                // Если кликнули по кнопке/ссылке внутри (например, купить билет) — не открываем модалку
                if (event.target.closest("a") || event.target.closest("button")) {
                    return;
                }

                const card = event.target.closest("[data-play-trigger]");
                if (!card) {
                    return;
                }
                const playId = card.getAttribute("data-play-id");
                if (playId) {
                    openPlayModal(playId);
                }
            });

            // Стрелки киноряда
            function scrollStrip(direction) {
                if (!stripEl) return;
                const firstCard = stripEl.querySelector(".afisha-card--strip");
                const cardWidth = firstCard
                    ? firstCard.getBoundingClientRect().width
                    : 320;
                const gap = 20;
                const delta =
                    direction === "next" ? cardWidth + gap : -(cardWidth + gap);

                stripEl.scrollBy({
                    left: delta,
                    behavior: "smooth"
                });
            }

            if (prevBtn) {
                prevBtn.addEventListener("click", function () {
                    scrollStrip("prev");
                });
            }

            if (nextBtn) {
                nextBtn.addEventListener("click", function () {
                    scrollStrip("next");
                });
            }

            // Закрытие модалки
            if (modalEl) {
                modalCloseEls.forEach(function (btn) {
                    btn.addEventListener("click", closePlayModal);
                });

                modalEl.addEventListener("click", function (event) {
                    if (event.target === modalEl) {
                        closePlayModal();
                    }
                });

                document.addEventListener("keydown", function (event) {
                    if (
                        event.key === "Escape" &&
                        modalEl &&
                        !modalEl.hasAttribute("hidden")
                    ) {
                        closePlayModal();
                    }
                });
            }
        }

        // Загружаем данные спектаклей из JSON
        fetch("assets/data/plays.json")
            .then(function (response) {
                if (!response.ok) {
                    throw new Error("HTTP " + response.status);
                }
                return response.json();
            })
            .then(function (data) {
                if (!data || !Array.isArray(data.plays)) {
                    renderAfishaFallback("Не удалось загрузить афишу. Напишите администратору, мы подскажем расписание.");
                    return;
                }
                playsData = data.plays.slice();
                renderAfishaStrip();
                bindAfishaEvents();
            })
            .catch(function (error) {
                console.error("Не удалось загрузить данные спектаклей:", error);
                renderAfishaFallback("Не удалось загрузить спектакли. Свяжитесь с нами, мы подскажем ближайшие даты.");
            });
    }
}
