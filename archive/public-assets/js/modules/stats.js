export function initStats() {
    const prefersReducedMotion =
        window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const statsSection = document.querySelector("#stats");
    const statNumbers = document.querySelectorAll(".stat-number[data-target]");

    if (statsSection && statNumbers.length) {
        const statsObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;

                    if (prefersReducedMotion) {
                        statNumbers.forEach((el) => {
                            const target = parseInt(el.dataset.target, 10);
                            const suffix = el.dataset.suffix || "";
                            if (!isNaN(target)) {
                                el.textContent = target + suffix;
                            }
                        });
                    } else {
                        statNumbers.forEach((el) => animateCounter(el));
                    }

                    statsObserver.unobserve(entry.target);
                });
            },
            { threshold: 0.3 }
        );

        statsObserver.observe(statsSection);
    }
}

function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    if (isNaN(target)) return;

    const suffix = el.dataset.suffix || "";
    const duration = 800;
    const startTime = performance.now();

    function tick(now) {
        const progress = Math.min((now - startTime) / duration, 1);
        const value = Math.floor(target * progress);
        el.textContent = value + suffix;

        if (progress < 1) {
            requestAnimationFrame(tick);
        }
    }

    requestAnimationFrame(tick);
}
