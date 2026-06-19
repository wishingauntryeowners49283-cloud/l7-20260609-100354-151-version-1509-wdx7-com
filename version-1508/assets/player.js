(function () {
    function loadVideo(wrapper) {
        var video = wrapper.querySelector('video[data-src]');
        var sourceUrl = video ? video.getAttribute('data-src') : '';

        if (!video || !sourceUrl || wrapper.classList.contains('is-ready') || wrapper.classList.contains('is-loading')) {
            return;
        }

        wrapper.classList.add('is-loading');

        function playWhenReady() {
            wrapper.classList.remove('is-loading');
            wrapper.classList.add('is-ready');
            var result = video.play();

            if (result && typeof result.catch === 'function') {
                result.catch(function () {});
            }
        }

        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = sourceUrl;
            video.addEventListener('loadedmetadata', playWhenReady, { once: true });
            video.load();
            return;
        }

        if (window.Hls && window.Hls.isSupported()) {
            var hls = new window.Hls({
                enableWorker: true,
                lowLatencyMode: false,
                backBufferLength: 90
            });

            hls.loadSource(sourceUrl);
            hls.attachMedia(video);
            hls.on(window.Hls.Events.MANIFEST_PARSED, playWhenReady);
            hls.on(window.Hls.Events.ERROR, function (event, data) {
                if (!data || !data.fatal) {
                    return;
                }

                if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
                    hls.startLoad();
                } else if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
                    hls.recoverMediaError();
                } else {
                    hls.destroy();
                    wrapper.classList.remove('is-loading');
                }
            });
            return;
        }

        video.src = sourceUrl;
        video.addEventListener('loadedmetadata', playWhenReady, { once: true });
        video.load();
    }

    Array.prototype.slice.call(document.querySelectorAll('[data-player]')).forEach(function (wrapper) {
        var start = wrapper.querySelector('[data-player-start]');
        var video = wrapper.querySelector('video');

        if (start) {
            start.addEventListener('click', function () {
                loadVideo(wrapper);
            });
        }

        if (video) {
            video.addEventListener('click', function () {
                loadVideo(wrapper);
            });
        }
    });
})();
