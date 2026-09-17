(function () {
  'use strict';

  var PAGES = ['index.html', 'Bilder.html', 'Musik.html'];

  function currentPageIndex() {
    var path = window.location.pathname.split('/').pop() || 'index.html';
    var idx = -1;
    for (var i = 0; i < PAGES.length; i++) {
      if (PAGES[i].toLowerCase() === path.toLowerCase()) { idx = i; break; }
    }
    return idx === -1 ? 0 : idx;
  }

  function pauseAllMedia() {
    var media = document.querySelectorAll('video, audio');
    for (var i = 0; i < media.length; i++) {
      if (!media[i].paused) media[i].pause();
    }
  }

  function goTo(index) {
    if (index < 0 || index >= PAGES.length) return;
    pauseAllMedia();
    window.location.href = PAGES[index];
  }

  // Video/Audio pausieren bei Seitenwechsel (Klick, Menü, Swipe, zurück/vor)
  window.addEventListener('pagehide', pauseAllMedia);
  document.addEventListener('click', function (e) {
    var link = e.target.closest ? e.target.closest('nav a') : null;
    if (link) pauseAllMedia();
  });

  // Nur ein Song gleichzeitig abspielen
  document.addEventListener('play', function (e) {
    var target = e.target;
    if (!target || target.tagName !== 'AUDIO') return;
    var audios = document.querySelectorAll('audio');
    for (var i = 0; i < audios.length; i++) {
      if (audios[i] !== target) audios[i].pause();
    }
  }, true);

  // Swipe-Navigation zwischen den Seiten (nur auf Touch-Geräten)
  var isTouchDevice = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;
  if (isTouchDevice) {
    var startX = 0;
    var startY = 0;
    var tracking = false;
    var THRESHOLD = 60;
    var RESTRAINT = 75;

    document.addEventListener('touchstart', function (e) {
      if (e.touches.length !== 1) { tracking = false; return; }
      var target = e.target.closest ? e.target.closest('audio, video') : null;
      if (target) { tracking = false; return; }
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      tracking = true;
    }, { passive: true });

    document.addEventListener('touchend', function (e) {
      if (!tracking) return;
      tracking = false;
      var touch = e.changedTouches[0];
      var dx = touch.clientX - startX;
      var dy = touch.clientY - startY;
      if (Math.abs(dx) >= THRESHOLD && Math.abs(dy) <= RESTRAINT) {
        var idx = currentPageIndex();
        goTo(dx < 0 ? idx + 1 : idx - 1);
      }
    }, { passive: true });

    document.addEventListener('touchcancel', function () {
      tracking = false;
    }, { passive: true });
  }
})();
