/* Lombardia Automobili - header hairline, section filters and a row-first masonry grid. No tracking, no third parties.
   Without JavaScript the grid falls back to CSS columns and every print stays visible. */
(function () {
  'use strict';
  var top = document.querySelector('.top');
  function onScroll() { if (top) top.classList.toggle('scrolled', window.scrollY > 8); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  var grid = document.getElementById('grid');
  if (!grid) return;
  var tiles = Array.prototype.slice.call(grid.querySelectorAll('.tile'));
  var bar = document.querySelector('.filters');

  // same breakpoints and gaps as the CSS grid in styles.css: [columns, column gap, row gap]
  var mq4 = window.matchMedia('(min-width: 1100px)'), mq3 = window.matchMedia('(min-width: 760px)');
  function spec() { return mq4.matches ? [4, 24, 34] : mq3.matches ? [3, 20, 30] : [2, 12, 24]; }

  function layout() {
    var s = spec(), W = grid.clientWidth, n = s[0], g = [s[1], s[2]];
    var cw = (W - g[0] * (n - 1)) / n;
    var shown = tiles.filter(function (t) { return !t.hidden; });
    shown.forEach(function (t) { t.style.width = cw + 'px'; });
    var heights = shown.map(function (t) { return t.offsetHeight; });
    var col = [];
    for (var i = 0; i < n; i++) col.push(0);
    shown.forEach(function (t, i) {
      var k = col.indexOf(Math.min.apply(Math, col));
      t.style.transform = 'translate(' + Math.round(k * (cw + g[0])) + 'px,' + Math.round(col[k]) + 'px)';
      col[k] += heights[i] + g[1];
    });
    grid.style.height = Math.max(0, Math.max.apply(Math, col) - g[1]) + 'px';
  }

  grid.classList.add('masonry');
  layout();
  requestAnimationFrame(function () { grid.classList.add('ready'); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(layout);
  var raf = 0, lastW = window.innerWidth;
  window.addEventListener('resize', function () {
    if (window.innerWidth === lastW) return;
    lastW = window.innerWidth;
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(layout);
  });

  if (!bar) return;
  bar.hidden = false;
  bar.addEventListener('click', function (e) {
    var b = e.target.closest('button');
    if (!b) return;
    var f = b.getAttribute('data-f');
    Array.prototype.forEach.call(bar.querySelectorAll('button'), function (x) {
      x.setAttribute('aria-pressed', x === b ? 'true' : 'false');
    });
    tiles.forEach(function (t) { t.hidden = !(f === 'all' || t.getAttribute('data-sec') === f); });
    layout();
  });
})();
