
export function initStudioTimeline() {
    const prefersReducedMotion =
        window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const timelineBlocks = document.querySelectorAll(
        ".section-studio .studio-track-path[data-timeline]"
    );

    if (timelineBlocks.length) {
        timelineBlocks.forEach((block) => {
            const steps = Array.from(
                block.querySelectorAll(".timeline-step")
            );

            if (!steps.length) return;

            let activeIndex = steps.findIndex((step) =>
                step.classList.contains("timeline-step--active")
            );

            if (activeIndex < 0) {
                activeIndex = 0;
                steps[0].classList.add("timeline-step--active");
            }

            function setActive(index) {
                steps.forEach((step, i) => {
                    step.classList.toggle("timeline-step--active", i === index);
                });
            }

            setActive(activeIndex);

            const autoplay =
                block.dataset.autoplay === "true" && !prefersReducedMotion;
            let intervalId = null;
            const STEP_INTERVAL = 6000; // 6 секунд на шаг

            function startAutoplay() {
                if (!autoplay || intervalId !== null || steps.length <= 1) return;
                intervalId = window.setInterval(() => {
                    activeIndex = (activeIndex + 1) % steps.length;
                    setActive(activeIndex);
                }, STEP_INTERVAL);
            }

            function stopAutoplay() {
                if (intervalId === null) return;
                window.clearInterval(intervalId);
                intervalId = null;
            }

            steps.forEach((step, index) => {
                step.addEventListener("click", () => {
                    activeIndex = index;
                    setActive(activeIndex);
                    stopAutoplay();
                });
            });

            block.addEventListener("mouseenter", stopAutoplay);
            block.addEventListener("mouseleave", startAutoplay);

            startAutoplay();
        });
    }
}
