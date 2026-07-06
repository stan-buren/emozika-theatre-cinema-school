export function initFaq() {
    const faqContainer = document.querySelector('#faq');
    if (!faqContainer) return;

    const faqItemsWrapper = faqContainer.querySelector('.faq-items');
    const queryInput = faqContainer.querySelector('[data-faq-search]');
    const resetBtn = faqContainer.querySelector('[data-faq-reset]');
    const countEl = faqContainer.querySelector('[data-faq-count]');

    if (!faqItemsWrapper) return;

    // 1. Fetch data
    fetch('assets/data/faq.json')
        .then((res) => {
            if (!res.ok) throw new Error('Failed to load FAQ');
            return res.json();
        })
        .then((data) => {
            renderFaq(data);
            bindSearch(data);
        })
        .catch((err) => {
            console.error(err);
            faqItemsWrapper.innerHTML = '<p class="text-muted">Не удалось загрузить вопросы. Пожалуйста, свяжитесь с нами.</p>';
        });

    function renderFaq(items) {
        if (!items.length) {
            faqItemsWrapper.innerHTML = '<p class="text-muted">Ничего не найдено.</p>';
            return;
        }

        const html = items
            .map(
                (item) => `
      <div class="faq-item">
        <button class="faq-question" type="button" aria-expanded="false">
          ${item.question}
          <span class="faq-icon">+</span>
        </button>
        <div class="faq-answer">
          <p>${item.answer}</p>
        </div>
      </div>
    `
            )
            .join('');

        faqItemsWrapper.innerHTML = html;
    }

    // 2. Event Delegation for accordions
    faqItemsWrapper.addEventListener('click', (e) => {
        const btn = e.target.closest('.faq-question');
        if (!btn) return;

        const item = btn.parentElement;
        const expanded = btn.getAttribute('aria-expanded') === 'true';

        // Collapse all others (optional - can be removed if multiple open allowed)
        // faqContainer.querySelectorAll('.faq-question').forEach(b => b.setAttribute('aria-expanded', 'false'));
        // faqContainer.querySelectorAll('.faq-item').forEach(i => i.classList.remove('is-open'));

        btn.setAttribute('aria-expanded', !expanded);
        item.classList.toggle('is-open', !expanded);
    });

    // 3. Search Logic
    function bindSearch(allData) {
        if (!queryInput) return;

        function doFilter() {
            const query = queryInput.value.toLowerCase().trim();
            const filtered = allData.filter(
                (item) =>
                    item.question.toLowerCase().includes(query) ||
                    item.answer.toLowerCase().includes(query)
            );

            renderFaq(filtered);

            if (countEl) {
                countEl.textContent = query
                    ? `Нашли ${filtered.length} из ${allData.length}`
                    : '';
                countEl.hidden = !query;
            }
        }

        queryInput.addEventListener('input', doFilter);

        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                queryInput.value = '';
                doFilter();
                queryInput.focus();
            });
        }
    }
}
