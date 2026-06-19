(function () {
  var menuButton = document.querySelector('[data-menu-button]');
  var mobileNav = document.querySelector('[data-mobile-nav]');

  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', function () {
      mobileNav.classList.toggle('open');
    });
  }

  var yearNodes = document.querySelectorAll('[data-year]');
  for (var i = 0; i < yearNodes.length; i += 1) {
    yearNodes[i].textContent = new Date().getFullYear();
  }

  var slides = document.querySelectorAll('[data-hero-slide]');
  var dots = document.querySelectorAll('[data-hero-dot]');
  var current = 0;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }
    current = (index + slides.length) % slides.length;
    for (var i = 0; i < slides.length; i += 1) {
      slides[i].classList.toggle('active', i === current);
    }
    for (var j = 0; j < dots.length; j += 1) {
      dots[j].classList.toggle('active', j === current);
    }
  }

  if (slides.length) {
    for (var d = 0; d < dots.length; d += 1) {
      (function (dotIndex) {
        dots[dotIndex].addEventListener('click', function () {
          showSlide(dotIndex);
        });
      })(d);
    }
    window.setInterval(function () {
      showSlide(current + 1);
    }, 5200);
  }

  var searchInputs = document.querySelectorAll('[data-search-box]');
  for (var s = 0; s < searchInputs.length; s += 1) {
    bindSearch(searchInputs[s]);
  }

  function bindSearch(input) {
    var target = document.querySelector(input.getAttribute('data-target'));
    if (!target) {
      return;
    }
    var items = target.querySelectorAll('[data-search-item]');
    input.addEventListener('input', function () {
      var query = input.value.trim().toLowerCase();
      for (var i = 0; i < items.length; i += 1) {
        var hay = (items[i].getAttribute('data-keywords') || '').toLowerCase();
        items[i].classList.toggle('is-hidden', query && hay.indexOf(query) === -1);
      }
    });
  }

  var filterButtons = document.querySelectorAll('[data-filter-button]');
  for (var f = 0; f < filterButtons.length; f += 1) {
    filterButtons[f].addEventListener('click', function () {
      var group = this.closest('[data-filter-group]');
      var target = document.querySelector(this.getAttribute('data-target'));
      if (!group || !target) {
        return;
      }
      var filter = this.getAttribute('data-filter');
      var buttons = group.querySelectorAll('[data-filter-button]');
      var cards = target.querySelectorAll('[data-search-item]');
      for (var b = 0; b < buttons.length; b += 1) {
        buttons[b].classList.toggle('active', buttons[b] === this);
      }
      for (var c = 0; c < cards.length; c += 1) {
        var text = cards[c].getAttribute('data-keywords') || '';
        cards[c].classList.toggle('is-hidden', filter !== 'all' && text.indexOf(filter) === -1);
      }
    });
  }
})();
