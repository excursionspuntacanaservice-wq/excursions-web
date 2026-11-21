/* ui.js: presentation helpers only (booking logic lives in app.js and is untouched).
   1) every "Book now" link goes straight to a working form: phones open the booking sheet, desktop opens the card's date picker
   2) the sticky phone bar steps aside while the offer card's own Book button is on screen */
(function () {
  'use strict';
  var desk = function () { return window.matchMedia('(min-width:980px)').matches; };
  var BK = 'a[href="#bk-side"], a[href="#bk-hero"]';

  function openSheet() { var b = document.querySelector('[data-open="bk-modal"]'); if (b) b.click(); }
  function openCard(id) {
    var f = document.getElementById(id); if (!f) return;
    var r = f.getBoundingClientRect();
    if (r.top < 0 || r.top > window.innerHeight * 0.5) f.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(function () {
      var d = f.querySelector('input[name=date]'), btn = f.querySelector('.dp-btn');
      if (btn && !btn.closest('[hidden]') && d && !d.value) {
        btn.focus({ preventScroll: true });
        if (btn.getAttribute('aria-expanded') !== 'true') btn.click();
      } else {
        var n = f.querySelector('.bk-next:not([hidden]), button.pay:not([hidden])'); if (n) n.focus({ preventScroll: true });
      }
    }, r.top < 0 || r.top > window.innerHeight * 0.5 ? 450 : 0);
  }
  // sin hoja de reserva en la página (landing "mañana": el formulario ya está abierto en la página) → bajar al formulario
  function go(a) { var id = (a.getAttribute('href') || '').slice(1); if (desk() || !document.querySelector('[data-open="bk-modal"]')) openCard(id); else openSheet(); }

  // llegada desde otra página con #bk-side / #bk-hero (botón Reservar de la página de precio): abrir el formulario, no dejar en la portada
  if (/^#bk-(side|hero)$/.test(location.hash)) window.addEventListener('load', function () { setTimeout(function () { go({ getAttribute: function () { return location.hash; } }); }, 300); });
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest(BK);
    if (!a || a.classList.contains('lb-cta') || e.defaultPrevented) return;
    e.preventDefault(); go(a);
  });
  // the photo viewer's Book button stops propagation, so catch it on the way down and act after it closes
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('.lb-cta'); if (!a) return;
    if (!desk()) e.preventDefault();
    setTimeout(function () { go(a); }, 0);
  }, true);

  var cta = document.querySelector('.offer .hero-cta');
  if (cta && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (en) {
      document.body.classList.toggle('mbar-off', en[0].isIntersecting && !desk());
    }, { rootMargin: '0px 0px -40px 0px' }).observe(cta);
  }
  // landing "mañana": la barra fija se aparta mientras el formulario está en pantalla (tiene su propio botón de pago)
  var mo = document.querySelectorAll('[data-mbar-off]');
  if (mo.length && 'IntersectionObserver' in window) {
    var vis = 0;
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (x) { vis += x.isIntersecting ? 1 : (x.target._seen ? -1 : 0); x.target._seen = x.isIntersecting; });
      document.body.classList.toggle('mbar-off', vis > 0 && !desk());
    }, { rootMargin: '0px 0px -80px 0px' });
    Array.prototype.forEach.call(mo, function (el) { el._seen = false; io.observe(el); });
  }
  // Saona ES mobile first screen has its own big button; keep the bottom bar away while it is visible
  var xf = document.querySelector('.x-first');
  if (xf && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (en) { document.body.classList.toggle('x-on', en[0].isIntersecting && !desk()); }).observe(xf);
  }
})();
