import { H as Hls } from './hls.js';

function attachPlayer(video) {
    var source = video.getAttribute('data-hls-src');
    if (!source) {
        return;
    }

    if (Hls && Hls.isSupported()) {
        var hls = new Hls({
            enableWorker: true,
            lowLatencyMode: true
        });
        hls.loadSource(source);
        hls.attachMedia(video);
        video._hls = hls;
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = source;
    }
}

document.querySelectorAll('video[data-hls-src]').forEach(function (video) {
    attachPlayer(video);
});

document.querySelectorAll('[data-player-start]').forEach(function (button) {
    button.addEventListener('click', function () {
        var wrap = button.closest('.player-wrap');
        var video = wrap ? wrap.querySelector('video') : null;
        if (!video) {
            return;
        }
        video.play().then(function () {
            button.classList.add('is-hidden');
        }).catch(function () {
            button.classList.remove('is-hidden');
        });
    });
});

document.querySelectorAll('.player-wrap video').forEach(function (video) {
    video.addEventListener('play', function () {
        var wrap = video.closest('.player-wrap');
        var button = wrap ? wrap.querySelector('[data-player-start]') : null;
        if (button) {
            button.classList.add('is-hidden');
        }
    });
});
