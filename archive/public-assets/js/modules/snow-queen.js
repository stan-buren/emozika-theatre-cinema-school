
export function initSnowQueen() {
    const snowSection = document.querySelector("#snow-queen");

    if (snowSection) {
        const snowGrid = snowSection.querySelector(".snow-queen-grid");

        // Если IntersectionObserver поддерживается — показываем карточки,
        // когда пользователь докрутил до секции.
        if ("IntersectionObserver" in window && snowGrid) {
            const observer = new IntersectionObserver(
                (entries, obs) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            snowGrid.classList.add("snow-queen-grid--visible");
                            obs.unobserve(entry.target);
                        }
                    });
                },
                { threshold: 0.2 }
            );

            observer.observe(snowSection);
        } else if (snowGrid) {
            // Фоллбек для старых браузеров — показываем сразу
            snowGrid.classList.add("snow-queen-grid--visible");
        }

        // Переключатель формата в блоке Snow Queen
        const switchRoot = snowSection.querySelector("[data-snow-switch]");
        const modeButtons = switchRoot
            ? switchRoot.querySelectorAll("[data-snow-mode]")
            : [];
        const hintEl = switchRoot
            ? switchRoot.querySelector("[data-snow-hint]")
            : null;
        const columns = snowSection.querySelectorAll("[data-snow-column]");
        const classCta = snowSection.querySelector(".snow-queen-btn--schools");
        const familyCta = snowSection.querySelector(".snow-queen-btn--family");

        const modes = {
            class: {
                hint:
                    "Группы до 30–35 детей: квест на 4–6 этапов, спектакль, подарки и фото с актёрами.",
                focus: "class",
                classBtnText: "Забронировать дату для класса",
                familyBtnText: "Купить билеты для семьи"
            },
            family: {
                hint:
                    "Камерные показы до 50 зрителей: есть даты с квестом и без, рекомендуемый возраст 5–12 лет.",
                focus: "family",
                classBtnText: "Заявка на класс",
                familyBtnText: "Купить семейные билеты"
            }
        };

        function setMode(mode) {
            // If simplified version without switch don't do anything
            if (!modeButtons.length) return;

            const config = modes[mode] || modes.class;

            modeButtons.forEach((btn) => {
                const isActive = btn.getAttribute("data-snow-mode") === mode;
                btn.classList.toggle("tracks-toggle-btn--primary", isActive);
                btn.setAttribute("aria-pressed", isActive ? "true" : "false");
                if (!isActive) {
                    btn.classList.remove("tracks-toggle-btn--primary");
                }
            });

            columns.forEach((col) => {
                const value = col.getAttribute("data-snow-column");
                const active = value === config.focus;
                col.classList.toggle("is-active", active);
            });

            if (hintEl && config.hint) {
                hintEl.textContent = config.hint;
            }

            if (classCta && config.classBtnText) {
                classCta.textContent = config.classBtnText;
            }

            if (familyCta && config.familyBtnText) {
                familyCta.textContent = config.familyBtnText;
            }
        }

        if (modeButtons.length) {
            modeButtons.forEach((btn) => {
                btn.addEventListener("click", () => {
                    const value = btn.getAttribute("data-snow-mode") || "class";
                    setMode(value);
                });
            });

            setMode("class");
        }
    }
}
