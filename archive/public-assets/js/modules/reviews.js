
export function initVideoReviewsSection() {
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

    const videoReviews = [
        {
            id: "review-den-materi",
            kind: "video",

            title: "«День матери» — фильм как точка роста",
            quote:
                "После съёмок дочь сама попросила выйти на сцену. Кино дало ей уверенность говорить вслух и не бояться крупного плана.",
            authorLabel: "Мама Алисы, 10 лет",

            thumbUrl: "assets/img/posters/love-tank-hero.webp",
            thumbAlt: "Кадр из фильма «День матери»",

            videoEmbedUrl:
                "https://vk.com/video_ext.php?oid=-58293658&id=456241867",
            platform: "vk",
            videoId: "vk-456241867",

            persona: "parent",
            childName: "Алиса",
            childAge: 10,
            yearsInStudio: 2,
            yearsInStudioLabel: "1,5 года в студии",
            branch: "ТРК «Гранд Каньон»",

            event: "Киношкола: съёмки фильма «День матери»",

            topics: ["кино", "уверенность", "команда"],

            isFeatured: true,
            order: 5,
            isActive: true,

            durationSeconds: 140,
            durationLabel: "02:20",
            recordedAt: "2024-11-20",
        },
        {
            id: "review-stage-confidence",
            kind: "quote",

            title: "Соня, 11 лет — перестала бояться сцены",
            quote:
                "Через месяц занятий она сама вышла с монологом, без шпаргалки. Педагог бережно её готовил, и страх сцену сменил азарт.",
            authorLabel: "Мама Сони, 11 лет",

            thumbUrl: "assets/img/posters/snow-queen.webp",
            thumbAlt: "Фото со сцены новогоднего спектакля",

            videoEmbedUrl: "",
            platform: "",
            videoId: "",

            persona: "parent",
            childName: "Соня",
            childAge: 11,
            yearsInStudio: 1,
            yearsInStudioLabel: "3 месяца в студии",
            branch: "Парнас / «Гранд Каньон»",

            event: "Пробный спектакль на сцене «Эмоцики»",

            topics: ["уверенность", "речь", "первый_опыт"],

            isFeatured: false,
            order: 15,
            isActive: true,

            durationSeconds: null,
            durationLabel: "Текст",
            recordedAt: "2024-12-05",
        },
        {
            id: "review-family-6plus",
            kind: "quote",

            title: "6+ группа — стала смелее общаться",
            quote:
                "Сын раньше прятался за мной, а теперь сам здоровается с педагогами и детьми. Мы уже готовим первый новогодний выход на сцену.",
            authorLabel: "Папа Тимофея, 6 лет",

            thumbUrl: "assets/img/posters/snow-queen-horizontal.webp",
            thumbAlt: "Камерный зал перед началом спектакля",

            videoEmbedUrl: "",
            platform: "",
            videoId: "",

            persona: "parent",
            childName: "Тимофей",
            childAge: 6,
            yearsInStudio: 1,
            yearsInStudioLabel: "2 месяца в студии",
            branch: "Проспект Просвещения",

            event: "Занятия студии 6+",

            topics: ["первый_опыт", "атмосфера"],

            isFeatured: false,
            order: 25,
            isActive: true,

            durationSeconds: null,
            durationLabel: "Текст",
            recordedAt: "2024-10-28",
        },
    ];

    var section = document.getElementById("reviews");
    if (!section) return;

    var strip = section.querySelector("[data-reviews-strip]");
    var lightbox = section.querySelector("[data-review-lightbox]");
    if (!strip || !lightbox) return;

    var activeReviews = videoReviews.filter(function (review) {
        return review.isActive !== false;
    });

    if (!activeReviews.length) {
        section.classList.add("section-reviews--empty");
        return;
    }

    // сортировка: сначала избранные, потом по order
    activeReviews.sort(function (a, b) {
        var aFeatured = !!a.isFeatured;
        var bFeatured = !!b.isFeatured;

        if (aFeatured !== bFeatured) {
            return aFeatured ? -1 : 1;
        }

        var orderA = typeof a.order === "number" ? a.order : 0;
        var orderB = typeof b.order === "number" ? b.order : 0;
        return orderA - orderB;
    });

    // рендер карточек
    activeReviews.forEach(function (review) {
        var card = createReviewVideoCard(review);
        strip.appendChild(card);
    });

    // клик по карточкам — открываем модалку
    strip.addEventListener("click", function (event) {
        var card = event.target.closest(".review-video-card");
        if (!card) return;

        var reviewId = card.getAttribute("data-review-id");
        var review = null;
        for (var i = 0; i < activeReviews.length; i++) {
            if (activeReviews[i].id === reviewId) {
                review = activeReviews[i];
                break;
            }
        }
        if (!review) return;

        openReviewLightbox(lightbox, review);
    });

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
