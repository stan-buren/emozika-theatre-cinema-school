
export function initAbonements() {
    const gridRoot = document.querySelector('[data-abonements-root]');

    // Attach listeners to EXISTING cards
    if (gridRoot) {
        const contactsSection = document.getElementById('contacts');
        const scrollToContacts = (event) => {
            if (event) event.preventDefault();
            if (contactsSection) {
                contactsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        };

        const heroCard = gridRoot.querySelector('.abonement-card--hero');
        if (heroCard) {
            heroCard.addEventListener('click', scrollToContacts);
        }

        // Also ensure all CTA buttons work
        const ctaButtons = document.querySelectorAll('[data-scroll-to="contacts"]');
        ctaButtons.forEach((button) => {
            button.addEventListener('click', scrollToContacts);
        });
    }

    // Picker Logic
    const picker = document.querySelector('[data-abonement-picker]');

    if (picker) {
        // Helper to get checked value
        const getValue = (name) => {
            const checked = picker.querySelector(`input[name="${name}"]:checked`);
            return checked ? checked.value : null;
        };

        const badgeEl = picker.querySelector('[data-abonement-result-badge]');
        const titleEl = picker.querySelector('[data-abonement-result-title]');
        const textEl = picker.querySelector('[data-abonement-result-text]');
        const ctaEl = picker.querySelector('[data-abonement-cta-main]');
        const pickButton = picker.querySelector('[data-abonement-pick]');

        function getRecommendation() {
            const age = getValue('age') || '7-11';
            const goal = getValue('goal') || 'stage';
            const schedule = getValue('schedule') || 'standard';

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

            // Fade out effect could be added here
            if (badgeEl && rec.badge) badgeEl.textContent = rec.badge;
            if (titleEl) titleEl.textContent = rec.title;
            if (textEl) textEl.textContent = rec.text;
            if (ctaEl && rec.cta) ctaEl.textContent = rec.cta;
        }

        if (pickButton) {
            pickButton.addEventListener('click', function (e) {
                e.preventDefault();
                updateRecommendation();
            });
        }

        // Listen to all radio inputs change
        const allRadios = picker.querySelectorAll('input[type="radio"]');
        allRadios.forEach(radio => {
            radio.addEventListener('change', updateRecommendation);
        });

        // Initialize state
        updateRecommendation();
    }
}
