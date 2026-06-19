(function () {
  var players = document.querySelectorAll('[data-player]');

  for (var i = 0; i < players.length; i += 1) {
    bindPlayer(players[i]);
  }

  function bindPlayer(shell) {
    var video = shell.querySelector('video');
    var overlay = shell.querySelector('[data-player-overlay]');
    var playButton = shell.querySelector('[data-play-button]');
    var src = shell.getAttribute('data-video');
    var ready = false;
    var hls = null;

    if (!video || !src) {
      return;
    }

    function load() {
      if (ready) {
        return;
      }
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = src;
      } else if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({ enableWorker: true });
        hls.loadSource(src);
        hls.attachMedia(video);
      } else {
        video.src = src;
      }
      ready = true;
      shell._hls = hls;
    }

    function start() {
      load();
      shell.classList.add('is-playing');
      video.controls = true;
      var promise = video.play();
      if (promise && typeof promise.catch === 'function') {
        promise.catch(function () {});
      }
    }

    if (overlay) {
      overlay.addEventListener('click', start);
    }
    if (playButton) {
      playButton.addEventListener('click', function (event) {
        event.stopPropagation();
        start();
      });
    }
    video.addEventListener('click', function () {
      if (video.paused) {
        start();
      }
    });
  }
})();
