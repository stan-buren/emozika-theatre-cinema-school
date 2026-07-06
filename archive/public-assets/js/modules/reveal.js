
export function initReveal() {
    const revealEls = document.querySelectorAll(".reveal-on-scroll");

    if (revealEls.length) {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-visible");
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.15 }
        );

        revealEls.forEach((el) => observer.observe(el));
    }
}
