(function () {
    var toggle = document.querySelector('[data-nav-toggle]');
    if (toggle) {
        toggle.addEventListener('click', function () {
            document.body.classList.toggle('nav-open');
        });
    }

    document.querySelectorAll('[data-hero-carousel]').forEach(function (carousel) {
        var slides = Array.prototype.slice.call(carousel.querySelectorAll('.hero-slide'));
        var dots = Array.prototype.slice.call(carousel.querySelectorAll('.hero-dot'));
        var prev = carousel.querySelector('[data-hero-prev]');
        var next = carousel.querySelector('[data-hero-next]');
        var index = slides.findIndex(function (slide) {
            return slide.classList.contains('is-active');
        });
        if (index < 0) {
            index = 0;
        }

        function show(nextIndex) {
            index = (nextIndex + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === index);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === index);
                dot.setAttribute('aria-selected', dotIndex === index ? 'true' : 'false');
            });
        }

        if (prev) {
            prev.addEventListener('click', function () {
                show(index - 1);
            });
        }
        if (next) {
            next.addEventListener('click', function () {
                show(index + 1);
            });
        }
        dots.forEach(function (dot, dotIndex) {
            dot.addEventListener('click', function () {
                show(dotIndex);
            });
        });
        if (slides.length > 1) {
            window.setInterval(function () {
                show(index + 1);
            }, 5200);
        }
    });

    document.querySelectorAll('[data-filter-panel]').forEach(function (panel) {
        var scopeSelector = panel.getAttribute('data-filter-panel');
        var scope = document.querySelector(scopeSelector);
        if (!scope) {
            return;
        }
        var input = panel.querySelector('[data-filter-input]');
        var year = panel.querySelector('[data-filter-year]');
        var category = panel.querySelector('[data-filter-category]');
        var count = panel.querySelector('[data-filter-count]');
        var cards = Array.prototype.slice.call(scope.querySelectorAll('.movie-card'));

        function normalize(value) {
            return String(value || '').toLowerCase().trim();
        }

        function apply() {
            var keyword = normalize(input && input.value);
            var yearValue = year ? year.value : '';
            var categoryValue = category ? category.value : '';
            var visible = 0;
            cards.forEach(function (card) {
                var haystack = normalize([
                    card.getAttribute('data-title'),
                    card.getAttribute('data-category'),
                    card.getAttribute('data-region'),
                    card.getAttribute('data-genre')
                ].join(' '));
                var okKeyword = !keyword || haystack.indexOf(keyword) !== -1;
                var okYear = !yearValue || card.getAttribute('data-year') === yearValue;
                var okCategory = !categoryValue || card.getAttribute('data-category') === categoryValue;
                var visibleCard = okKeyword && okYear && okCategory;
                card.classList.toggle('hide-by-filter', !visibleCard);
                if (visibleCard) {
                    visible += 1;
                }
            });
            if (count) {
                count.textContent = visible + ' 部影片';
            }
        }

        [input, year, category].forEach(function (control) {
            if (control) {
                control.addEventListener('input', apply);
                control.addEventListener('change', apply);
            }
        });
        apply();
    });

    var params = new URLSearchParams(window.location.search);
    var query = params.get('q') || '';
    document.querySelectorAll('[data-search-query]').forEach(function (el) {
        if (query) {
            el.value = query;
            el.dispatchEvent(new Event('input'));
        }
    });
})();
