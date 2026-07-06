// Core modules - loaded immediately for critical UX
import { initReveal } from './modules/reveal.js';
import { initScroll } from './modules/scroll.js';

document.addEventListener("DOMContentLoaded", () => {
    // 1. Base Initialization
    initReveal();
    initScroll();

    // 2. Dynamic Component Loading
    // Checks if a selector exists on the page, and if so, dynamically imports the module.
    const loadModule = (selector, importFn, initFnName) => {
        if (document.querySelector(selector)) {
            importFn()
                .then((module) => {
                    if (module && typeof module[initFnName] === "function") {
                        module[initFnName]();
                    }
                })
                .catch((err) => {
                    console.error(`Failed to load module for ${selector}`, err);
                });
        }
    };

    // Map selectors to modules
    loadModule("#stats", () => import("./modules/stats.js"), "initStats");
    loadModule("#faq", () => import("./modules/faq.js"), "initFaq");
    loadModule(
        "#snow-queen",
        () => import("./modules/snow-queen.js"),
        "initSnowQueen"
    );
    loadModule(
        ".studio-journey",
        () => import("./modules/journey.js"),
        "initJourney"
    );
    loadModule(
        ".studio-track-path",
        () => import("./modules/studio-timeline.js"),
        "initStudioTimeline"
    );
    loadModule("#afisha", () => import("./modules/afisha.js"), "initAfisha");
    loadModule("#films", () => import("./modules/films.js"), "initFilms");
    loadModule("#gallery", () => import("./modules/gallery.js"), "initGallery");
    loadModule("#people", () => import("./modules/people.js"), "initPeople");
    loadModule(
        "#reviews",
        () => import("./modules/reviews.js"),
        "initVideoReviewsSection"
    );
    loadModule(
        "#branches",
        () => import("./modules/branches.js"),
        "initBranches"
    );
    loadModule(
        "#abonements",
        () => import("./modules/abonements.js"),
        "initAbonements"
    );
    loadModule("#awards", () => import("./modules/awards.js"), "initAwards");

    // 3. Simple Event Listeners (Inline)
    const castingNewsButton = document.querySelector(
        ".section-casting .casting-btn-secondary"
    );
    if (castingNewsButton) {
        castingNewsButton.addEventListener("click", (event) => {
            event.preventDefault();
        });
    }
});
