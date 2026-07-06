
export function initAbonements() {
    const ABONEMENTS_DATA_URL = 'assets/data/abonements.json';

    function createAbonementCard(abonement) {
        const article = document.createElement('article');
        article.className = 'abonement-card';

        if (abonement.highlight || abonement.isHero) {
            article.classList.add('abonement-card--highlight');
        }

        article.dataset.abonementId = abonement.id;

        article.innerHTML = `
    ${abonement.tagLine ? `<p class="abonement-tagline">${abonement.tagLine}</p>` : ''}
    <h3 class="abonement-name">${abonement.name}</h3>
    ${abonement.age ? `<p class="abonement-age">${abonement.age}</p>` : ''}
    ${abonement.description ? `<p class="abonement-description">${abonement.description}</p>` : ''}
    ${Array.isArray(abonement.bullets) && abonement.bullets.length
                ? `<ul class="abonement-list">
            ${abonement.bullets.map((item) => `<li>${item}</li>`).join('')}
          </ul>`
                : ''
            }
    <div class="abonement-bottom">
      ${abonement.price ? `<p class="abonement-price">${abonement.price}</p>` : ''}
      ${abonement.note ? `<p class="abonement-note">${abonement.note}</p>` : ''}
    </div>
    ${abonement.badge ? `<span class="abonement-badge">${abonement.badge}</span>` : ''}
  `;

        if (abonement.isHero) {
            article.classList.add('abonement-card--hero');
            article.setAttribute(
                'aria-label',
                `${abonement.name}. Чаще всего родители выбирают именно этот формат.`
            );
        }

        return article;
    }

    function renderAbonementsGrid(container, abonements) {
        container.innerHTML = '';

        abonements.forEach((item) => {
            const card = createAbonementCard(item);
            container.appendChild(card);
        });
    }

    function loadAbonementsData() {
        return fetch(ABONEMENTS_DATA_URL)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Не удалось загрузить данные абонементов');
                }
                return response.json();
            })
            .catch((error) => {
                console.error('[Abonements] Ошибка загрузки данных:', error);
                return [];
            });
    }

    function initAbonementsSection() {
        const gridRoot = document.querySelector('[data-abonements-root]');

        if (!gridRoot) {
            return;
        }

        const contactsSection = document.getElementById('contacts');

        const scrollToContacts = (event) => {
            if (event) {
                event.preventDefault();
            }

            if (!contactsSection) {
                return;
            }

            contactsSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        };

        // Рендер карточек из JSON
        loadAbonementsData().then((abonements) => {
            if (!Array.isArray(abonements) || abonements.length === 0) {
                return;
            }

            renderAbonementsGrid(gridRoot, abonements);

            // Клик по карточке героя ведёт туда же, куда и главный CTA
            const heroCard = gridRoot.querySelector('.abonement-card--hero');

            if (heroCard) {
                heroCard.addEventListener('click', scrollToContacts);
            }
        });

        // Кнопки CTA внизу блока абонементов
        const ctaButtons = document.querySelectorAll('[data-scroll-to="contacts"]');

        if (ctaButtons.length) {
            ctaButtons.forEach((button) => {
                button.addEventListener('click', scrollToContacts);
            });
        }

        // Быстрый подбор абонемента
        const picker = document.querySelector('[data-abonement-picker]');

        if (picker) {
            const ageSelect = picker.querySelector('[data-abonement-age]');
            const goalSelect = picker.querySelector('[data-abonement-goal]');
            const scheduleSelect = picker.querySelector('[data-abonement-schedule]');
            const pickButton = picker.querySelector('[data-abonement-pick]');
            const badgeEl = picker.querySelector('[data-abonement-result-badge]');
            const titleEl = picker.querySelector('[data-abonement-result-title]');
            const textEl = picker.querySelector('[data-abonement-result-text]');
            const ctaEl = picker.querySelector('[data-abonement-cta-main]');

            function getRecommendation() {
                const age = ageSelect ? ageSelect.value : '7-11';
                const goal = goalSelect ? goalSelect.value : 'stage';
                const schedule = scheduleSelect ? scheduleSelect.value : 'standard';

                // Базовая заготовка
                const fallback = {
                    badge: 'Рекомендация',
                    title: 'Пробное занятие',
                    text: 'Начните с пробного урока — познакомитесь с педагогом и форматом занятий.',
                    cta: 'Записаться на пробное'
                };

                if (goal === 'cinema') {
                    return {
                        badge: 'Киноформат',
                        title: 'Съёмочный модуль + занятия',
                        text: 'Киноформат с пробами и 1–2 занятиями в неделю — ребёнок окажется на площадке и получит готовый фильм.',
                        cta: 'Записаться в киноформат'
                    };
                }

                if (age === '12-16' || schedule === 'intense') {
                    return {
                        badge: 'Интенсив',
                        title: 'Модуль на 4 месяца',
                        text: 'Глубокая программа с регулярными репетициями, сценами и итоговым спектаклем на сцене театра.',
                        cta: 'Выбрать модуль'
                    };
                }

                if (goal === 'speech') {
                    return {
                        badge: 'Речь',
                        title: 'Курс речи + студия',
                        text: 'Комбинация сценической речи и актёрки: дикция, уверенность, выступления перед аудиторией.',
                        cta: 'Уточнить расписание'
                    };
                }

                if (age === '4-6') {
                    return {
                        badge: 'Старт',
                        title: 'Пробное занятие в младшей группе',
                        text: 'Мягкое знакомство через игру и пластику. Поможет понять, готов ли малыш заниматься регулярно.',
                        cta: 'Записаться на пробу'
                    };
                }

                return fallback;
            }

            function updateRecommendation() {
                const rec = getRecommendation();

                if (badgeEl && rec.badge) {
                    badgeEl.textContent = rec.badge;
                }

                if (titleEl) {
                    titleEl.textContent = rec.title;
                }

                if (textEl) {
                    textEl.textContent = rec.text;
                }

                if (ctaEl && rec.cta) {
                    ctaEl.textContent = rec.cta;
                }
            }

            if (pickButton) {
                pickButton.addEventListener('click', function (e) {
                    e.preventDefault();
                    updateRecommendation();
                });
            }

            [ageSelect, goalSelect, scheduleSelect].forEach((field) => {
                if (!field) return;
                field.addEventListener('change', updateRecommendation);
            });

            // Initial call
            updateRecommendation();
        }
    }

    initAbonementsSection();
}
