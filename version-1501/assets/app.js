(function() {
    var toggle = document.querySelector('.menu-toggle');
    var panel = document.querySelector('.mobile-panel');

    if (toggle && panel) {
        toggle.addEventListener('click', function() {
            var opened = !panel.hasAttribute('hidden');
            if (opened) {
                panel.setAttribute('hidden', '');
                toggle.setAttribute('aria-expanded', 'false');
            } else {
                panel.removeAttribute('hidden');
                toggle.setAttribute('aria-expanded', 'true');
            }
        });
    }

    var hero = document.querySelector('[data-hero-slider]');
    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('.hero-dot'));
        var index = 0;

        function showSlide(nextIndex) {
            if (!slides.length) {
                return;
            }
            index = (nextIndex + slides.length) % slides.length;
            slides.forEach(function(slide, current) {
                slide.classList.toggle('is-active', current === index);
            });
            dots.forEach(function(dot, current) {
                dot.classList.toggle('is-active', current === index);
            });
        }

        dots.forEach(function(dot, current) {
            dot.addEventListener('click', function() {
                showSlide(current);
            });
        });

        window.setInterval(function() {
            showSlide(index + 1);
        }, 5200);
    }

    var filterForm = document.querySelector('[data-filter-form]');
    var filterList = document.querySelector('[data-filter-list]');

    if (filterForm && filterList) {
        var input = filterForm.querySelector('input[type="search"]');
        var cards = Array.prototype.slice.call(filterList.querySelectorAll('[data-filter-card]'));
        var params = new URLSearchParams(window.location.search);
        var query = params.get('q') || '';

        function applyFilter(value) {
            var normalized = String(value || '').trim().toLowerCase();
            cards.forEach(function(card) {
                var haystack = [card.getAttribute('data-title'), card.getAttribute('data-keywords')].join(' ').toLowerCase();
                card.classList.toggle('is-hidden', normalized && haystack.indexOf(normalized) === -1);
            });
        }

        if (input && query) {
            input.value = query;
            applyFilter(query);
        }

        if (input) {
            input.addEventListener('input', function() {
                applyFilter(input.value);
            });
        }

        filterForm.addEventListener('submit', function(event) {
            event.preventDefault();
            if (input) {
                applyFilter(input.value);
            }
        });
    }
})();
