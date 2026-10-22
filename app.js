/* Excursions Punta Cana — booking logic. No secrets here: prices are recomputed on the server (Make). */
(function () {
  'use strict';
  var HOOK = 'https://hook.us2.make.com/spazsnvez9twnync65aglpm35tbem80q', WA = '18299621705', S = {"en": {"book": "Book now", "book_total": "Book now · {t}", "opening": "Opening secure payment…", "err_pay": "We couldn't open the payment page. Tap \"Chat on WhatsApp\" and we'll send you a secure payment link right away.", "err_fields": "Please fill in the highlighted fields.", "wa_msg": "Hi! I'd like to book {tour}", "wa_on": " on {d}", "wa_for": " for {a} adult(s)", "wa_kids": " and {c} child(ren)", "date_ph": "Choose a date", "pk_val_near": "Entrance of a hotel near: ", "pk_val_meet": "Meeting point: Petromovil Las Canas del Este"}, "es": {"book": "Reservar", "book_total": "Reservar · {t}", "opening": "Abriendo el pago seguro…", "err_pay": "No pudimos abrir la página de pago. Toca \"Escríbenos por WhatsApp\" y te enviamos el link de pago seguro al momento.", "err_fields": "Completa los campos marcados.", "wa_msg": "¡Hola! Quiero reservar {tour}", "wa_on": " para el {d}", "wa_for": " para {a} adulto(s)", "wa_kids": " y {c} niño(s)", "date_ph": "Elige una fecha", "pk_val_near": "Entrada de hotel cerca de: ", "pk_val_meet": "Punto de encuentro: Petromovil Las Canas del Este"}};
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  function money(n) { return '$' + (n % 1 ? n.toFixed(2) : String(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function tomorrow() { var d = new Date(); d.setDate(d.getDate() + 1); var m = d.getMonth() + 1, day = d.getDate();
    return d.getFullYear() + '-' + (m < 10 ? '0' : '') + m + '-' + (day < 10 ? '0' : '') + day; }
  function waLink(text) { return 'https://wa.me/' + WA + '?text=' + encodeURIComponent(text); }
  // Google Ads secondary counters (observation only, not used for bidding)
  function conv(label) { try { if (typeof window.gtag === 'function') window.gtag('event', 'conversion', { send_to: 'AW-18525941849/' + label }); } catch (e) {} }
  var CV_BOOK = 'JUcZCPfonaUdENng7YFF', CV_WA = 'Qk6_CPronaUdENng7YFF';
  document.addEventListener('click', function (e) {
    var l = e.target && e.target.closest ? e.target.closest('a[href*="wa.me/"]') : null;
    if (l) conv(CV_WA);
  }, true);
  function fmtDate(v, lang) { if (!v) return ''; var p = v.split('-'); return lang === 'es' ? p[2] + '/' + p[1] + '/' + p[0] : p[1] + '/' + p[2] + '/' + p[0]; }


  // ---------- calendar (replaces the browser date field) ----------
  function iso(d) { var m = d.getMonth() + 1, x = d.getDate(); return d.getFullYear() + '-' + (m < 10 ? '0' : '') + m + '-' + (x < 10 ? '0' : '') + x; }
  function picker(root, L, onPick) {
    var btn = $('.dp-btn', root), val = $('.dp-v', root), input = $('input[name=date]', root), pop = $('.dp-pop', root);
    var loc = L === 'es' ? 'es-DO' : 'en-US', weekStart = L === 'es' ? 1 : 0;
    var min = new Date(); min.setHours(0, 0, 0, 0); min.setDate(min.getDate() + 1);
    var max = new Date(min); max.setFullYear(max.getFullYear() + 1);
    var view = new Date(min.getFullYear(), min.getMonth(), 1), sel = null, focusDay = new Date(min);
    var fMonth = new Intl.DateTimeFormat(loc, { month: 'long', year: 'numeric' });
    var fLong = new Intl.DateTimeFormat(loc, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
    var fFull = new Intl.DateTimeFormat(loc, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    var fWd = new Intl.DateTimeFormat(loc, { weekday: 'narrow' });
    function same(a, b) { return a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate(); }
    function render() {
      var y = view.getFullYear(), m = view.getMonth();
      var canPrev = new Date(y, m, 1) > new Date(min.getFullYear(), min.getMonth(), 1);
      var canNext = new Date(y, m + 1, 1) <= max;
      var h = '<div class="dp-h"><button type="button" class="dp-nav" data-nav="-1" aria-label="' + pop.dataset.prev + '"' + (canPrev ? '' : ' disabled') + '>‹</button>' +
        '<b class="dp-m" aria-live="polite">' + (function (t) { t = t.replace(' de ', ' '); return t.charAt(0).toUpperCase() + t.slice(1); })(fMonth.format(view)) + '</b><button type="button" class="dp-nav" data-nav="1" aria-label="' + pop.dataset.next + '"' + (canNext ? '' : ' disabled') + '>›</button></div><div class="dp-g" role="grid">';
      for (var i = 0; i < 7; i++) { var wd = new Date(2024, 0, 7 + ((i + weekStart) % 7)); h += '<span class="dp-wd" aria-hidden="true">' + fWd.format(wd) + '</span>'; }
      var first = new Date(y, m, 1), lead = (first.getDay() - weekStart + 7) % 7, days = new Date(y, m + 1, 0).getDate();
      for (i = 0; i < lead; i++) h += '<span></span>';
      for (var d = 1; d <= days; d++) {
        var dt = new Date(y, m, d), off = dt < min || dt > max;
        h += '<button type="button" class="dp-d' + (same(dt, sel) ? ' on' : '') + '" data-d="' + iso(dt) + '" tabindex="' + (same(dt, focusDay) ? '0' : '-1') + '"' +
          (off ? ' disabled' : '') + (same(dt, sel) ? ' aria-pressed="true"' : '') + ' aria-label="' + fFull.format(dt) + '">' + d + '</button>';
      }
      pop.innerHTML = h + '</div>';
    }
    function open() { if (!pop.hidden) return; if (sel) { view = new Date(sel.getFullYear(), sel.getMonth(), 1); focusDay = new Date(sel); } render(); pop.hidden = false; btn.setAttribute('aria-expanded', 'true');
      var f = $('.dp-d[tabindex="0"]:not([disabled])', pop) || $('.dp-d:not([disabled])', pop); if (f) f.focus(); }
    function close(refocus) { if (pop.hidden) return; pop.hidden = true; btn.setAttribute('aria-expanded', 'false'); if (refocus) btn.focus(); }
    function pick(s) { var p = s.split('-'); sel = new Date(+p[0], +p[1] - 1, +p[2]); input.value = s; val.textContent = fLong.format(sel); root.classList.add('has');
      btn.setAttribute('aria-invalid', 'false'); close(true); onPick(); }
    function moveFocus(days) { var n = new Date(focusDay); n.setDate(n.getDate() + days); if (n < min || n > max) return; focusDay = n;
      if (n.getMonth() !== view.getMonth() || n.getFullYear() !== view.getFullYear()) view = new Date(n.getFullYear(), n.getMonth(), 1);
      render(); var f = $('.dp-d[data-d="' + iso(n) + '"]', pop); if (f) f.focus(); }
    btn.addEventListener('click', function () { pop.hidden ? open() : close(true); });
    pop.addEventListener('click', function (e) {
      e.stopPropagation();
      var t = e.target.closest('button'); if (!t || t.disabled) return;
      if (t.dataset.nav) { view = new Date(view.getFullYear(), view.getMonth() + (+t.dataset.nav), 1); focusDay = new Date(Math.max(min, view)); render(); var f = $('.dp-nav[data-nav="' + t.dataset.nav + '"]', pop); if (f && !f.disabled) f.focus(); return; }
      if (t.dataset.d) pick(t.dataset.d);
    });
    pop.addEventListener('keydown', function (e) {
      var k = e.key;
      if (k === 'Escape') { e.preventDefault(); close(true); return; }
      if (!e.target.classList.contains('dp-d')) return;
      var mv = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }[k];
      if (mv) { e.preventDefault(); focusDay = new Date(e.target.dataset.d.replace(/-/g, '/')); moveFocus(mv); }
    });
    document.addEventListener('click', function (e) { if (e.target.isConnected && !root.contains(e.target)) close(false); });
    return { el: btn, input: input };
  }

  function setup(form) {
    var L = form.dataset.lang || 'en', T = S[L];
    var adult = parseFloat(form.dataset.adult) || 0, child = parseFloat(form.dataset.child) || 0, mode = form.dataset.mode;
    var a = $('[name=adults]', form), c = $('[name=children]', form);
    var pay = $('.pay', form), chat = $('.chat', form), msg = $('.msg', form);
    var dpRoot = $('.dp', form), dp = dpRoot ? picker(dpRoot, L, function () { refresh(); }) : null, date = dp ? dp.input : null;

    function clamp(inp) { var v = parseInt(inp.value, 10), mn = +inp.min, mx = +inp.max; if (isNaN(v)) v = mn; inp.value = Math.max(mn, Math.min(mx, v)); }
    function total() { return (a ? +a.value : 0) * adult + (c ? +c.value : 0) * child; }
    function waText() {
      var t = T.wa_msg.replace('{tour}', form.dataset.tourL);
      if (date && date.value) t += T.wa_on.replace('{d}', fmtDate(date.value, L));
      if (a) t += T.wa_for.replace('{a}', a.value);
      if (c && +c.value > 0) t += T.wa_kids.replace('{c}', c.value);
      return t + '.';
    }
    function refresh() {
      if (pay) pay.textContent = T.book_total.replace('{t}', money(total()));
      if (chat) chat.href = waLink(waText());
    }
    var pkN = $('.pk-n', form), pkH = $('.pk-h', form), hotelIn = $('[name=hotel]', form), nearIn = $('[name=near]', form), nearBox = $('.pk-near', form);
    function pkMode() { var r = $('input[value=nohotel]', form); return r && r.checked ? 'nohotel' : 'hotel'; }
    function nhMode() { var r = $('input[value=meet]', form); return r && r.checked ? 'meet' : 'near'; }
    function syncPk() {
      if (!pkN) return;
      var no = pkMode() === 'nohotel', near = nhMode() === 'near';
      pkN.hidden = !no; pkH.hidden = no; hotelIn.required = !no; nearIn.required = no && near; nearBox.hidden = !(no && near);
    }
    $$('input[type=radio]', form).forEach(function (r) { r.addEventListener('change', function () { syncPk(); refresh(); }); });
    syncPk();
    function pickupValue() {
      if (pkMode() === 'hotel') return hotelIn.value.trim();
      return nhMode() === 'meet' ? T.pk_val_meet : T.pk_val_near + nearIn.value.trim();
    }
    $$('.sb', form).forEach(function (b) {
      b.addEventListener('click', function () { var inp = $('input', b.parentNode); inp.value = (+inp.value || 0) + (+b.dataset.step); clamp(inp); refresh(); });
    });
    [a, c].forEach(function (inp) { if (inp) inp.addEventListener('change', function () { clamp(inp); refresh(); }); });
    refresh();

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (mode !== 'pay') { conv(CV_WA); window.open(waLink(waText()), '_blank', 'noopener'); return; }
      var bad = [];
      $$('input[required]', form).forEach(function (i) {
        if (i.closest('[hidden]')) return;
        var ok = i.checkValidity() && i.value.trim().length >= (i.name === 'name' || i.name === 'hotel' || i.name === 'near' ? 2 : 1);
        if (i.name === 'whatsapp') ok = ok && i.value.replace(/\D/g, '').length >= 8;
        if (i.name === 'date') ok = ok && i.value >= tomorrow();
        i.setAttribute('aria-invalid', ok ? 'false' : 'true'); if (!ok) bad.push(i);
      });
      if (date && !(date.value && date.value >= tomorrow())) { dp.el.setAttribute('aria-invalid', 'true'); bad.unshift(dp.el); } else if (dp) { dp.el.setAttribute('aria-invalid', 'false'); }
      if (bad.length) { msg.textContent = T.err_fields; msg.hidden = false; bad[0].focus(); return; }
      msg.hidden = true;
      conv(CV_BOOK);
      var hp = $('[name=website]', form);
      var body = new URLSearchParams({
        tour: form.dataset.tour, slug: form.dataset.slug, date: date.value, adults: a.value, children: c ? c.value : '0',
        hotel: pickupValue(), name: $('[name=name]', form).value.trim(),
        whatsapp: (function (v) { var d = v.replace(/\D/g, ''); return (d.length === 10 && v.trim().charAt(0) !== '+') ? '1' + d : d; })($('[name=whatsapp]', form).value), email: $('[name=email]', form).value.trim(),
        lang: L, website: hp ? hp.value : ''
      });
      pay.disabled = true; pay.textContent = T.opening;
      var ctl = window.AbortController ? new AbortController() : null, timer = setTimeout(function () { if (ctl) ctl.abort(); }, 25000);
      fetch(HOOK, { method: 'POST', body: body, signal: ctl ? ctl.signal : undefined, credentials: 'omit', referrerPolicy: 'strict-origin' })
        .then(function (r) { return r.json(); })
        .then(function (j) {
          clearTimeout(timer);
          if (j && j.ok && typeof j.url === 'string' && j.url.indexOf('https://checkout.stripe.com/') === 0) { window.location.assign(j.url); return; }
          throw new Error('no url');
        })
        .catch(function () {
          clearTimeout(timer); pay.disabled = false; refresh();
          msg.textContent = T.err_pay; msg.hidden = false; if (chat) chat.focus();
        });
    });
    $$('input', form).forEach(function (i) { i.addEventListener('input', function () { if (i.getAttribute('aria-invalid') === 'true') i.setAttribute('aria-invalid', 'false'); }); });
  }
  $$('form.bk').forEach(setup);

  // mobile modal
  var modal = $('#bk-modal'), lastFocus = null;
  function openM() { if (!modal) return; lastFocus = document.activeElement; modal.hidden = false; document.body.classList.add('lock'); var f = $('input,button.pay,a.chat', modal); if (f) f.focus(); }
  function closeM() { if (!modal) return; modal.hidden = true; document.body.classList.remove('lock'); if (lastFocus) lastFocus.focus(); }
  $$('[data-open]').forEach(function (b) { b.addEventListener('click', openM); });
  $$('.hero-cta, .final-b a[href="#bk-hero"]').forEach(function (a) {
    a.addEventListener('click', function (e) { if (window.matchMedia('(max-width:979px)').matches) { e.preventDefault(); openM(); } });
  });
  if (modal) {
    modal.addEventListener('click', function (e) { if (e.target === modal || e.target.hasAttribute('data-close')) closeM(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !modal.hidden) closeM(); });
  }

  // hotel suggestions: faster typing on phones
  var HOTELS = ['Riu Palace Bávaro','Riu Palace Punta Cana','Riu Republica','Riu Naiboa','Occidental Caribe','Occidental Punta Cana','Royalton Bávaro','Royalton Punta Cana','Royalton Chic','Majestic Elegance','Majestic Colonial','Majestic Mirage','Bahía Príncipe','Iberostar Selection Bávaro','Iberostar Dominicana','Iberostar Punta Cana','Ocean Blue & Sand','Princess Punta Cana','Vik Arena Blanca','Grand Palladium','Impressive Punta Cana','Dreams Royal Beach','Dreams Onyx','Dreams Macao','Dreams Palm Beach','Live Aqua','Nickelodeon Punta Cana','Hard Rock Punta Cana','Zoetry Agua','Sivory','Excellence Punta Cana','Excellence El Carmen','Sirenis','Breathless Punta Cana','Meliá Caribe Beach','Paradisus Palma Real','Lopesan Costa Bávaro','Barceló Bávaro Palace','Be Live Collection','Serenade Punta Cana','Catalonia Bávaro','Catalonia Royal Bávaro','Radisson Blu Punta Cana','Club Med Punta Cana','Four Points Punta Cana','The Westin Puntacana','Tortuga Bay','Sanctuary Cap Cana','Hyatt Ziva Cap Cana','Hyatt Zilara Cap Cana','Secrets Cap Cana','Secrets Royal Beach','Eden Roc Cap Cana','TRS Cap Cana','TRS Turquesa','Ancora Punta Cana','Viva Dominicus','Iberostar Hacienda Dominicus','Hilton La Romana','Sunscape Dominicus','Casa de Campo','Bahía La Romana','La Estancia'];
  var hl = $('#hotel-list');
  if (!hl && $('input[name=hotel]')) {
    hl = document.createElement('datalist'); hl.id = 'hotel-list';
    HOTELS.forEach(function (h) { var o = document.createElement('option'); o.value = h; hl.appendChild(o); });
    document.body.appendChild(hl);
    $$('input[name=hotel], input[name=near]').forEach(function (i) { i.setAttribute('list', 'hotel-list'); });
  }
  $$('input[name=email]').forEach(function (i) { i.setAttribute('inputmode', 'email'); i.setAttribute('autocapitalize', 'off'); i.setAttribute('spellcheck', 'false'); });

  // phone booking sheet in two steps: 1) date + people  2) pickup + contact + pay
  var fm = $('#bk-m');
  if (fm && fm.dataset.mode === 'pay') {
    var es = fm.dataset.lang === 'es';
    var dIn = $('[name=date]', fm), payB = $('button.pay', fm);
    var s1 = [$('.fld.dp', fm), $('.row2', fm)].filter(Boolean);
    var s2 = [$('.pk-sel', fm), $('[name=name]', fm) && $('[name=name]', fm).closest('.fld'), $('[name=whatsapp]', fm) && $('[name=whatsapp]', fm).closest('.row2'), $('.hint', fm), payB].filter(Boolean);
    if (dIn && payB && s1.length === 2 && s2.length >= 4) {
      var nxt = document.createElement('button'); nxt.type = 'button'; nxt.className = 'btn btn-sea btn-block btn-lg bk-next';
      var sum = document.createElement('div'); sum.className = 'bk-sum'; sum.hidden = true;
      var sumT = document.createElement('span'), sumE = document.createElement('button');
      sumE.type = 'button'; sumE.className = 'bk-edit'; sumE.textContent = es ? 'Cambiar' : 'Change';
      sum.appendChild(sumT); sum.appendChild(sumE);
      var note = document.createElement('p'); note.className = 'bk-step'; note.textContent = es ? 'Paso 1 de 2 · Fecha y personas' : 'Step 1 of 2 · Date and people';
      s1[0].parentNode.insertBefore(note, s1[0]);
      s1[0].parentNode.insertBefore(sum, s1[0]);
      payB.parentNode.insertBefore(nxt, payB);
      var amount = function () { var m = (payB.textContent || '').match(/\$[\d,.]+/); return m ? m[0] : ''; };
      var label = function () { var t = amount(); nxt.textContent = (es ? 'Continuar' : 'Continue') + (t ? ' · ' + t : ''); };
      var show = function (step) {
        s1.forEach(function (el) { el.hidden = step === 2; });
        s2.forEach(function (el) { el.hidden = step === 1; });
        nxt.hidden = step === 2; sum.hidden = step === 1;
        note.textContent = step === 1 ? (es ? 'Paso 1 de 2 · Fecha y personas' : 'Step 1 of 2 · Date and people') : (es ? 'Paso 2 de 2 · Recogida y contacto' : 'Step 2 of 2 · Pickup and contact');
        if (step === 1) label();
      };
      var tmr = function () { var d = new Date(); d.setDate(d.getDate() + 1); return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); };
      nxt.addEventListener('click', function () {
        var msgE = $('.msg', fm);
        if (!(dIn.value && dIn.value >= tmr())) {
          var b = $('.dp-btn', fm); if (b) { b.setAttribute('aria-invalid', 'true'); setTimeout(function () { b.click(); }, 0); }
          if (msgE) { msgE.textContent = es ? 'Elige una fecha para continuar.' : 'Choose a date to continue.'; msgE.hidden = false; }
          return;
        }
        if (msgE) msgE.hidden = true;
        var dv = $('.dp-v', fm), a = $('[name=adults]', fm), c = $('[name=children]', fm);
        var ppl = a.value + (es ? (a.value === '1' ? ' adulto' : ' adultos') : (a.value === '1' ? ' adult' : ' adults')) + (c && +c.value > 0 ? ', ' + c.value + (es ? ' niños' : ' kids') : '');
        sumT.textContent = (dv ? dv.textContent : dIn.value) + ' · ' + ppl + ' · ' + amount();
        show(2);
        var h = $('[name=hotel]', fm); if (h && !h.closest('[hidden]')) h.focus();
      });
      sumE.addEventListener('click', function () { show(1); });
      $$('.sb, input', fm).forEach(function (el) { el.addEventListener('click', function () { setTimeout(label, 0); }); el.addEventListener('change', function () { setTimeout(label, 0); }); });
      new MutationObserver(label).observe(payB, { childList: true, characterData: true, subtree: true });
      show(1);
    }
  }

  // payment cancelled notice / thanks reference (only plain query values, never injected as HTML)
  try {
    var q = new URLSearchParams(window.location.search);
    if (q.get('cancelled') === '1') { var n = $('[data-cancelled]'); if (n) { n.textContent = (document.documentElement.lang || 'en').indexOf('es') === 0 ? 'El pago no se completó, así que el tour todavía no está reservado. Puedes intentarlo de nuevo o escribirnos.' : 'Your payment wasn\u2019t completed, so the tour isn\u2019t booked yet. You can try again or message us.'; n.hidden = false; } }
    var ref = q.get('ref'), box = $('[data-ref]');
    if (ref && box && /^EPC-[0-9]{12}-[0-9]{1,3}$/.test(ref)) { $('b', box).textContent = ref; box.hidden = false; }
  } catch (err) { /* old browser: notices stay hidden */ }

  // hero video: the photo shows first; only the video that fits the screen is downloaded, after the page has loaded,
  // and it fades in once it really plays. Slow / data-saver connections keep the photo. Never a play button.
  var media = $('.hero-media');
  if (media) {
    var startVid = function () {
      var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      var c = navigator.connection || {};
      var slow = c.saveData || /(^|-)2g$/.test(c.effectiveType || '');
      var mob = window.matchMedia('(max-width:760px)').matches;
      var v = $(mob ? '.hv-m' : '.hv-d', media);
      if (reduce || slow || !v || !v.getAttribute('data-src')) { media.classList.add('novid'); return; }
      var fail = function () { media.classList.add('novid'); };
      v.muted = true; v.defaultMuted = true; v.setAttribute('muted', ''); v.playsInline = true;
      v.addEventListener('playing', function () { media.classList.add('vplay'); });
      v.addEventListener('error', fail);
      v.preload = 'auto'; v.src = v.getAttribute('data-src');
      try { var p = v.play(); if (p && p.catch) p.catch(fail); } catch (err) { fail(); }
      document.addEventListener('visibilitychange', function () { if (!document.hidden && !media.classList.contains('novid')) { var q = v.play(); if (q && q.catch) q.catch(function () {}); } });
    };
    if (document.readyState === 'complete') setTimeout(startVid, 300);
    else window.addEventListener('load', function () { setTimeout(startVid, 300); });
  }
})();
