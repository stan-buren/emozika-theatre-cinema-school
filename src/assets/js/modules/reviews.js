export function initVideoReviewsSection() {
    var section = document.getElementById("reviews");
    if (!section) return;

    var grid = section.querySelector("[data-reviews-masonry]");
    var lightbox = document.querySelector("[data-review-lightbox]");

    if (!grid || !lightbox) return;

    function openReviewLightbox(lightbox, review) {
        var titleEl = lightbox.querySelector(".review-lightbox__title");
        var quoteEl = lightbox.querySelector(".review-lightbox__quote");
        var metaEl = lightbox.querySelector(".review-lightbox__meta");
        var videoContainer = lightbox.querySelector(".review-lightbox__video");

        if (!videoContainer) return;

        videoContainer.innerHTML = "";

        if (review.videoEmbedUrl) {
            var iframe = document.createElement("iframe");
            iframe.src = review.videoEmbedUrl;
            iframe.title = review.title || "Видеоотзыв";
            iframe.allow =
                "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
            iframe.allowFullscreen = true;
            videoContainer.appendChild(iframe);
        } else {
            // Placeholder for text-only reviews or missing video
            var placeholder = document.createElement("div");
            placeholder.className = "review-lightbox__video-placeholder";
            placeholder.textContent =
                "Это текстовый отзыв. Вы можете прочитать полную историю ниже.";
            // Only show placeholder if we really want to simulate a video slot, 
            // but for text reviews, usually we just show the quote. 
            // However, reusing the layout is fine.
            // CSS might hide this or style it.
            videoContainer.appendChild(placeholder);
        }

        if (titleEl) {
            // Prefer Author Name, fall back to Title
            titleEl.textContent = review.author || review.title || "";
        }
        if (quoteEl) {
            quoteEl.textContent = review.quote || "";
        }
        if (metaEl) {
            metaEl.textContent = review.meta || "";
        }

        lightbox.setAttribute("data-current-id", review.id);
        lightbox.hidden = false;
        lightbox.setAttribute("aria-hidden", "false");
        lightbox.classList.add("is-open");
        document.body.classList.add("is-lightbox-open");
    }

    function closeReviewLightbox(lightbox) {
        var videoContainer = lightbox.querySelector(".review-lightbox__video");
        if (videoContainer) {
            videoContainer.innerHTML = "";
        }
        lightbox.classList.remove("is-open");
        lightbox.hidden = true;
        lightbox.setAttribute("aria-hidden", "true");
        document.body.classList.remove("is-lightbox-open");
    }

    // Listener for the grid (delegation)
    grid.addEventListener("click", function (event) {
        var card = event.target.closest(".review-card");
        if (!card) return;

        // If it's a link or button inside the card, we might want to let it propagate behavior,
        // but currently the whole card is the trigger.

        // Prevent default if it's an anchor acting as a button
        // event.preventDefault(); 

        var review = {
            id: card.dataset.reviewId,
            videoEmbedUrl: card.dataset.videoUrl,
            quote: card.dataset.quote,
            title: card.dataset.title,
            author: card.dataset.author,
            meta: card.dataset.meta
        };

        openReviewLightbox(lightbox, review);
    });

    // Keyboard support for cards (Enter/Space)
    grid.addEventListener("keydown", function (event) {
        if (event.key === "Enter" || event.key === " ") {
            var card = event.target.closest(".review-card");
            if (card) {
                event.preventDefault();
                card.click();
            }
        }
    });

    // Closing Logic
    var closeBtn = lightbox.querySelector("[data-review-lightbox-close]");
    var backdrop = lightbox.querySelector("[data-review-lightbox-backdrop]");

    if (closeBtn) {
        closeBtn.addEventListener("click", function () {
            closeReviewLightbox(lightbox);
        });
    }

    if (backdrop) {
        backdrop.addEventListener("click", function () {
            closeReviewLightbox(lightbox);
        });
    }

    document.addEventListener("keydown", function (event) {
        if (
            event.key === "Escape" &&
            lightbox.classList.contains("is-open")
        ) {
            closeReviewLightbox(lightbox);
        }
    });
}
