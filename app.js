document.addEventListener("DOMContentLoaded", function() {
    setupMobileMenu();
    setupHeroCarousel();
    setupFilters();
    setupSearchInputs();
});

function setupMobileMenu() {
    const button = document.querySelector(".menu-toggle");
    const panel = document.querySelector(".mobile-panel");

    if (!button || !panel) {
        return;
    }

    button.addEventListener("click", function() {
        panel.classList.toggle("is-open");
    });
}

function setupHeroCarousel() {
    const hero = document.querySelector("[data-hero]");

    if (!hero) {
        return;
    }

    const slides = Array.from(hero.querySelectorAll(".hero-slide"));
    const dots = Array.from(hero.querySelectorAll(".hero-dot"));
    const previous = hero.querySelector("[data-hero-prev]");
    const next = hero.querySelector("[data-hero-next]");
    let current = 0;
    let timer = null;

    function show(index) {
        current = (index + slides.length) % slides.length;
        slides.forEach(function(slide, slideIndex) {
            slide.classList.toggle("active", slideIndex === current);
        });
        dots.forEach(function(dot, dotIndex) {
            dot.classList.toggle("active", dotIndex === current);
        });
    }

    function start() {
        stop();
        timer = window.setInterval(function() {
            show(current + 1);
        }, 5200);
    }

    function stop() {
        if (timer) {
            window.clearInterval(timer);
        }
    }

    dots.forEach(function(dot, index) {
        dot.addEventListener("click", function() {
            show(index);
            start();
        });
    });

    if (previous) {
        previous.addEventListener("click", function() {
            show(current - 1);
            start();
        });
    }

    if (next) {
        next.addEventListener("click", function() {
            show(current + 1);
            start();
        });
    }

    hero.addEventListener("mouseenter", stop);
    hero.addEventListener("mouseleave", start);
    show(0);
    start();
}

function setupSearchInputs() {
    const params = new URLSearchParams(window.location.search);
    const query = params.get("q") || "";
    const pageInput = document.getElementById("pageSearch");

    if (pageInput && query) {
        pageInput.value = query;
        pageInput.dispatchEvent(new Event("input"));
    }
}

function setupFilters() {
    const list = document.querySelector("[data-card-list]");

    if (!list) {
        return;
    }

    const cards = Array.from(list.querySelectorAll("[data-card]"));
    const search = document.getElementById("pageSearch");
    const year = document.getElementById("yearFilter");
    const type = document.getElementById("typeFilter");
    const empty = document.querySelector("[data-empty-state]");

    function normalize(value) {
        return String(value || "").trim().toLowerCase();
    }

    function apply() {
        const keyword = normalize(search ? search.value : "");
        const yearValue = normalize(year ? year.value : "");
        const typeValue = normalize(type ? type.value : "");
        let visible = 0;

        cards.forEach(function(card) {
            const text = normalize(card.dataset.search + " " + card.dataset.title);
            const cardYear = normalize(card.dataset.year);
            const cardType = normalize(card.dataset.type);
            const matched = (!keyword || text.includes(keyword)) && (!yearValue || cardYear === yearValue) && (!typeValue || cardType === typeValue);
            card.hidden = !matched;

            if (matched) {
                visible += 1;
            }
        });

        if (empty) {
            empty.classList.toggle("is-visible", visible === 0);
        }
    }

    [search, year, type].forEach(function(control) {
        if (control) {
            control.addEventListener("input", apply);
            control.addEventListener("change", apply);
        }
    });

    apply();
}
