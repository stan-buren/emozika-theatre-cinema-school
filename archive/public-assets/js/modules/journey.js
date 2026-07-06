
export function initJourney() {
    const prefersReducedMotion =
        window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const journey = document.querySelector(".studio-journey");

    if (journey) {
        const steps = Array.from(
            journey.querySelectorAll(".studio-journey-step[data-title][data-text]")
        );
        const journeyTrack = journey.querySelector(".studio-journey-track");
        const detailTitle = journey.querySelector(".studio-journey-detail-title");
        const detailText = journey.querySelector(".studio-journey-detail-text");

        function setActiveStep(step) {
            if (!step || !detailTitle || !detailText) {
                return;
            }

            const activeIndex = steps.indexOf(step);

            // подсвечиваем активный шаг и все пройденные
            steps.forEach((item, index) => {
                item.classList.toggle("is-active", item === step);
                item.classList.toggle(
                    "is-past",
                    activeIndex !== -1 && index < activeIndex
                );
            });

            const title = step.getAttribute("data-title") || "";
            const text = step.getAttribute("data-text") || "";

            detailTitle.textContent = title;
            detailText.textContent = text;

            // прогресс-линия в треке
            if (journeyTrack && steps.length > 1 && activeIndex !== -1) {
                const progress = (activeIndex / (steps.length - 1)) * 100;
                journeyTrack.style.setProperty("--journey-progress", progress + "%");
            }
        }

        // стартовое состояние
        let initiallyActive = journey.querySelector(
            ".studio-journey-step.is-active"
        );

        if (!initiallyActive && steps.length) {
            initiallyActive = steps[0];
        }

        if (initiallyActive) {
            setActiveStep(initiallyActive);
        }

        // --- авто-перелистывание шагов ---

        let autoRotateId = null;
        const AUTO_ROTATE_INTERVAL = 8000; // 8 секунд на шаг

        function stopAutoRotate() {
            if (autoRotateId !== null) {
                window.clearInterval(autoRotateId);
                autoRotateId = null;
            }
        }

        function startAutoRotate() {
            // уважаем prefers-reduced-motion и защищаемся от пустого списка шагов
            if (prefersReducedMotion || steps.length <= 1) {
                return;
            }

            stopAutoRotate();

            autoRotateId = window.setInterval(() => {
                const current =
                    journey.querySelector(".studio-journey-step.is-active") || steps[0];
                const currentIndex = steps.indexOf(current);
                const nextIndex = (currentIndex + 1) % steps.length;
                const nextStep = steps[nextIndex];

                setActiveStep(nextStep);
            }, AUTO_ROTATE_INTERVAL);
        }

        // запускаем автопрокрутку только если пользователь не просил "меньше движухи"
        if (!prefersReducedMotion) {
            startAutoRotate();
        }

        // клики по шагам
        journey.addEventListener("click", (event) => {
            const targetStep = event.target.closest(".studio-journey-step");
            if (!targetStep || !journey.contains(targetStep)) {
                return;
            }

            setActiveStep(targetStep);
            startAutoRotate(); // перезапускаем таймер с текущего шага
        });

        // навигация клавишами Enter / Space
        journey.addEventListener("keydown", (event) => {
            const key = event.key;

            if (key !== "Enter" && key !== " " && key !== "Spacebar") {
                return;
            }

            const targetStep = event.target.closest(".studio-journey-step");
            if (!targetStep || !journey.contains(targetStep)) {
                return;
            }

            event.preventDefault();
            setActiveStep(targetStep);
            startAutoRotate();
        });

        // при наведении мыши — ставим авто-перелистывание на паузу
        journey.addEventListener("mouseenter", stopAutoRotate);
        journey.addEventListener("mouseleave", startAutoRotate);
    }
}
