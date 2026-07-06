
export function initScroll() {
    const progressBar = document.querySelector("[data-scroll-progress]");
    const stickyHeader = document.querySelector(".site-header");
    const heroSection = document.querySelector("#hero");
    const ctaDock = document.querySelector(".cta-dock");

    const updateScrollUI = () => {
        const docHeight =
            document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;

        if (progressBar) {
            progressBar.style.width = Math.min(Math.max(scrolled, 0), 100) + "%";
        }

        if (stickyHeader) {
            stickyHeader.classList.toggle("is-scrolled", window.scrollY > 12);
        }

        if (ctaDock) {
            const heroRect = heroSection
                ? heroSection.getBoundingClientRect()
                : null;
            const heroPassed = heroRect
                ? heroRect.bottom < 80
                : window.scrollY > 260;

            ctaDock.classList.toggle("cta-dock--hidden", !heroPassed);
        }
    };

    updateScrollUI();
    window.addEventListener("scroll", updateScrollUI, { passive: true });
    window.addEventListener("resize", updateScrollUI);

    if (ctaDock) {
        ctaDock.addEventListener("focusin", () => {
            ctaDock.classList.remove("cta-dock--hidden");
        });
    }

    const scrollLinks = document.querySelectorAll("[data-scroll-to]");

    if (scrollLinks.length) {
        scrollLinks.forEach((link) => {
            const targetId = link.getAttribute("data-scroll-to");
            if (!targetId) return;

            link.addEventListener("click", (event) => {
                const target = document.getElementById(targetId);
                if (!target) return;

                event.preventDefault();
                target.scrollIntoView({ behavior: "smooth", block: "start" });
            });
        });
    }
}
