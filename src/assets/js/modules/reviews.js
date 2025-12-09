export function initVideoReviewsSection() {
    var section = document.getElementById("reviews");
    if (!section) return; // Guard if module loaded but section not present

    var strip = section.querySelector("[data-reviews-strip]");
    var lightbox = document.querySelector("[data-review-lightbox]");

    function buildReviewMetaLine(review) {
        var parts = [];

        if (review.authorLabel) {
            parts.push(review.authorLabel);
        } else if (review.childName || review.childAge) {
            var childBits = [];
            if (review.childName) {
                childBits.push(review.childName);
            }
            if (typeof review.childAge === "number") {
                childBits.push(review.childAge + " лет");
            }
            if (childBits.length) {
                parts.push(childBits.join(", "));
            }
        }

        if (review.yearsInStudioLabel) {
            parts.push(review.yearsInStudioLabel);
        }

        if (review.branch) {
            parts.push(review.branch);
        }

        return parts.join(" • ");
    }

    function createReviewVideoCard(review) {
        var card = document.createElement("article");
        var hasVideo = Boolean(review.videoEmbedUrl);
        card.className =
            "review-video-card card card-hover" +
            (hasVideo ? "" : " review-video-card--text");
        card.setAttribute("data-review-id", review.id);

        var poster = document.createElement("div");
        poster.className = "review-video-card__poster";
        if (review.thumbUrl) {
            poster.style.backgroundImage = "url(" + review.thumbUrl + ")";
        } else {
            poster.classList.add("review-video-card__poster--empty");
        }

        if (review.durationLabel) {
            var duration = document.createElement("span");
            duration.className = "review-video-card__duration";
            duration.textContent = review.durationLabel;
            poster.appendChild(duration);
        }

        var badge = document.createElement("span");
        badge.className = "review-video-card__badge";
        badge.textContent = hasVideo ? "Видеоотзыв" : "История";
        if (!hasVideo) {
            badge.classList.add("review-video-card__badge--text");
        }

        var title = document.createElement("h3");
        title.className = "review-video-card__title";
        title.textContent = review.title || "";

        var meta = document.createElement("p");
        meta.className = "review-video-card__meta";
        meta.textContent = buildReviewMetaLine(review);

        card.appendChild(poster);
        card.appendChild(badge);
        card.appendChild(title);
        card.appendChild(meta);

        return card;
    }

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
            var placeholder = document.createElement("div");
            placeholder.className = "review-lightbox__video-placeholder";
            placeholder.textContent =
                "Видео добавим в ближайшее время. Пока что можно прочитать историю ниже или спросить ссылку у администратора.";
            videoContainer.appendChild(placeholder);
        }

        if (titleEl) {
            titleEl.textContent = review.title || "";
        }
        if (quoteEl) {
            quoteEl.textContent = review.quote || "";
        }
        if (metaEl) {
            metaEl.textContent =
                buildReviewMetaLine(review) +
                (review.event ? " • " + review.event : "");
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

    // Listener for the strip (delegation)
    if (strip && lightbox) {
        strip.addEventListener("click", function (event) {
            var card = event.target.closest(".review-video-card");
            if (!card) return;

            var review = {
                id: card.getAttribute('data-review-id'),
                title: card.querySelector('.review-video-card__title').innerText,
                // meta is optional for lightbox but nice to have
                // we can grab it from card text or data attributes if we added them.
                // for now let's just use what we have in data attributes or simple text
                videoEmbedUrl: card.getAttribute('data-video-url'),
                quote: card.getAttribute('data-quote'),
            };

            if (review.videoEmbedUrl || review.quote) {
                openReviewLightbox(lightbox, review);
            }
        });
    }

    // стрелки прокрутки
    var leftArrow = section.querySelector("[data-reviews-arrow='left']");
    var rightArrow = section.querySelector("[data-reviews-arrow='right']");

    function scrollStrip(direction) {
        if (!strip) return;
        var firstCard = strip.querySelector(".review-video-card");
        var cardWidth = firstCard ? firstCard.getBoundingClientRect().width : 260;
        strip.scrollBy({
            left: direction * (cardWidth * 0.9 + 16),
            behavior: "smooth",
        });
    }

    if (leftArrow) {
        leftArrow.addEventListener("click", function () {
            scrollStrip(-1);
        });
    }
    if (rightArrow) {
        rightArrow.addEventListener("click", function () {
            scrollStrip(1);
        });
    }

    // закрытие модалки
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
