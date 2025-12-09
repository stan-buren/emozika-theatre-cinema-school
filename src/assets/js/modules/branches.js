
export function initBranches() {
    var branchCards = document.querySelectorAll('.branch-card');
    var filterButtons = document.querySelectorAll('.branches-filter');
    var myMetroSelect = document.querySelector('[data-branch-my-metro]');

    var activeFilter = 'all'; // 'all' | 'adults'
    var highlightMetro = '';

    function getMetroFromQuery() {
        if (typeof window === 'undefined') return '';
        var params = new URLSearchParams(window.location.search);
        return params.get('metro') || '';
    }

    var metroFromUrl = getMetroFromQuery();
    if (metroFromUrl) {
        highlightMetro = metroFromUrl;
        if (myMetroSelect) myMetroSelect.value = highlightMetro;
    }

    function updateView() {
        var highlight = (highlightMetro || "").toLowerCase();

        branchCards.forEach(function (card) {
            var isAdultsAttr = card.getAttribute('data-adults');
            // Check if attribute exists (for boolean) or verify value
            // In our template: data-adults={branch.isAdults}. If false, Astro might omit it.
            // If present, it's typically "" (empty string).
            var cardIsAdults = card.hasAttribute('data-adults');

            var cardMetro = (card.getAttribute('data-metro') || "").toLowerCase();

            // Filtering
            var matchesFilter = true;
            if (activeFilter === 'adults') {
                matchesFilter = cardIsAdults;
            }

            // Highlighting (Metro)
            if (highlight && cardMetro === highlight) {
                card.classList.add('branch-card--highlight');
            } else {
                card.classList.remove('branch-card--highlight');
            }

            // If we filter out non-adults, simply hide them
            card.style.display = matchesFilter ? '' : 'none';
        });
    }

    // Listeners
    if (filterButtons && filterButtons.length) {
        filterButtons.forEach(function (btn) {
            btn.addEventListener("click", function () {
                var value = btn.getAttribute("data-branch-filter") || "all";
                activeFilter = value;

                filterButtons.forEach(b => b.classList.toggle('is-active', b === btn));
                updateView();
            });
        });
    }

    if (myMetroSelect) {
        myMetroSelect.addEventListener("change", function () {
            highlightMetro = myMetroSelect.value || "";
            updateView();
        });
    }

    // Initial check
    updateView();
}
