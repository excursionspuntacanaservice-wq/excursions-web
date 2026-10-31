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
  function ev(name) { try { if (typeof window.clarity === 'function') window.clarity('event', name); } catch (e) {} }
  function conv(label) { try { if (typeof window.gtag === 'function') window.gtag('event', 'conversion', { send_to: 'AW-18525941849/' + label }); } catch (e) {} }
  var CV_BOOK = 'JUcZCPfonaUdENng7YFF', CV_WA = 'Qk6_CPronaUdENng7YFF';
  document.addEventListener('click', function (e) {
    var l = e.target && e.target.closest ? e.target.closest('a[href*="wa.me/"]') : null;
    if (l) { conv(CV_WA); ev('whatsapp_click'); }
  }, true);
  function fmtDate(v, lang) { if (!v) return ''; var p = v.split('-'); return lang === 'es' ? p[2] + '/' + p[1] + '/' + p[0] : p[1] + '/' + p[2] + '/' + p[0]; }

  // ---------- pickup time by hotel (same tables Sofia uses on WhatsApp) ----------
  // isl: Saona / Catalina / Santo Domingo (one morning pickup). pb: Party Boat / Snorkel [12 PM boat, 3 PM boat].
  // hr: Horseback [early morning, morning, afternoon, late afternoon]. null = no fixed time, we confirm on WhatsApp.
  var PK = {
    isl: [['zoetry','6:20'],['sivory','6:35'],['excellence punta cana','6:40'],['excellence pc','6:40'],['sirenis','6:40'],['breathless','6:40'],['excellence el carmen','6:45'],['excellence del carmen','6:45'],['finest','6:45'],
      ['dreams onyx','6:35'],['now onyx','6:35'],['live aqua','6:40'],['dreams punta cana','6:45'],['nickelodeon','6:45'],['royalton chic','6:45'],['chic punta cana','6:45'],['el faro','6:45'],
      ['hard rock','6:45'],['dreams macao','6:50'],
      ['riu republica','7:00'],['occidental caribe','7:05'],['royalton','7:05'],['majestic','7:05'],['bahia principe','7:10'],['riu','7:15'],['iberostar','7:30'],
      ['ocean blue','7:20'],['punta cana princess','7:25'],['princess punta cana','7:25'],['vik arena','7:30'],['caribe deluxe','7:40'],
      ['occidental punta cana','7:00'],['palladium','7:35'],['vista sol','7:40'],['impressive','7:45'],['whala','7:50'],['whalas','7:50'],['dreams royal beach','7:55'],
      ['melia','8:00'],['lopesan','8:00'],['barcelo','8:10'],
      ['natura park','7:50'],['dreams palm beach','7:50'],['be live','7:50'],['serenade','7:50'],['catalonia','8:00'],['radisson','8:10'],
      ['club med','7:45'],['four points','7:45'],['westin','8:00'],['tortuga bay','8:00'],
      ['sanctuary','7:30'],['margaritaville','7:30'],['hyatt','7:30'],['secrets cap cana','7:30'],['eden roc','7:30'],['trs cap cana','7:30'],['ancora','7:30'],
      ['cadaques','9:10'],['sunscape dominicus','9:10'],['iberostar hacienda','9:10'],['hacienda dominicus','9:10'],['dreams dominicus','9:10'],['viva dominicus','9:10'],['hilton la romana','9:10'],
      ['bahia la romana','8:30'],['casa de campo','9:00'],['la estancia','9:25']],
    pb: [['sivory','10:20','1:20'],['zoetry','10:20','1:20'],['excellence punta cana','10:20','1:20'],['excellence pc','10:20','1:20'],
      ['sirenis','10:30','1:30'],['excellence el carmen','10:30','1:30'],['excellence del carmen','10:30','1:30'],['breathless','10:30','1:30'],
      ['now onyx','10:40','1:40'],['dreams onyx','10:40','1:40'],['live aqua','10:40','1:40'],['wyndham alltra','10:40','1:40'],
      ['nickelodeon','10:45','1:45'],['royalton chic','10:45','1:45'],['chic punta cana','10:45','1:45'],['el faro','10:45','1:45'],['dreams macao','11:00','2:00'],
      ['hard rock','10:15','1:15'],['riu republica','10:25','1:25'],['occidental caribe','10:25','1:25'],['royalton punta cana','10:25','1:25'],['royalton','10:30','1:30'],['majestic','10:30','1:30'],['bahia principe','10:40','1:40'],['riu','10:55','1:55'],['iberostar','11:15','2:15'],
      ['punta cana princess','10:35','1:35'],['princess punta cana','10:35','1:35'],['vik arena','10:35','1:35'],['ocean blue','10:40','1:40'],['caribe deluxe','10:50','1:50'],['bavaro princess','10:55','1:55'],['occidental punta cana','11:00','2:00'],['palladium','11:10','2:10'],
      ['vista sol','11:20','2:20'],['impressive','11:20','2:20'],['whala','11:25','2:25'],['dreams royal beach','11:30','2:30'],['secrets royal','11:30','2:30'],['melia','11:35','2:35'],['palma real','11:35','2:35'],['lopesan','11:40','2:40'],['barcelo bavaro beach','11:40','2:40'],['barcelo','11:35','2:35'],
      ['dreams flora','11:00','2:00'],['jewel palm','11:00','2:00'],['be live','11:00','2:00'],['radisson','11:10','2:10'],['serenade','11:10','2:10'],['catalonia','11:10','2:10'],
      ['sanctuary','10:30','1:30'],['secrets cap cana','10:30','1:30'],['trs cap cana','10:30','1:30'],['hyatt','10:30','1:30'],['margaritaville','10:30','1:30'],
      ['westin','10:45','1:45'],['tortuga bay','10:45','1:45'],['club med','10:45','1:45'],
      ['hacienda dominicus',null],['dominicus',null],['la romana',null],['casa de campo',null]],
    hr: [['hard rock','7:50','9:00','1:40','3:00'],['riu republica','8:00','9:10','1:50','3:10'],['occidental caribe','8:05','9:15','1:55','3:15'],['royalton','8:05','9:15','1:55','3:15'],['majestic','8:05','9:15','1:55','3:15'],
      ['bahia principe','8:10','9:20','2:00','3:20'],['riu','8:15','9:25','2:05','3:25'],['iberostar','8:15','9:25','2:05','3:25'],['ocean blue','8:20','9:30','2:10','3:30'],['vik arena','8:20','9:30','2:10','3:30'],
      ['punta cana princess','8:20','9:30','2:10','3:30'],['princess punta cana','8:20','9:30','2:10','3:30'],['caribe deluxe','8:25','9:35','2:15','3:35'],['bavaro princess','8:25','9:35','2:15','3:35'],['occidental punta cana','8:25','9:35','2:15','3:35'],['palladium','8:25','9:35','2:15','3:35'],
      ['vista sol','8:30','9:40','2:20','3:40'],['impressive','8:30','9:40','2:20','3:40'],['whala','8:30','9:40','2:20','3:40'],['secrets royal','8:35','9:45','2:25','3:45'],['dreams royal beach','8:35','9:45','2:25','3:45'],['palma real','8:35','9:45','2:25','3:45'],['melia','8:35','9:45','2:25','3:45'],
      ['lopesan','8:40','9:50','2:30','3:50'],['barcelo','8:45','9:55','2:35','3:55'],['dreams flora','8:15','9:25','2:05','3:25'],['be live','8:15','9:25','2:05','3:25'],['radisson','8:20','9:30','2:10','3:30'],['serenade','8:20','9:30','2:10','3:30'],['catalonia','8:25','9:35','2:15','3:35'],
      ['royalton chic',null],['chic punta cana',null],['hacienda dominicus',null],['dominicus',null],['la romana',null],['casa de campo',null]]
  };
  var PK_GROUP = { 'saona-island': 'isl', 'catalina-island': 'isl', 'santo-domingo': 'isl', 'party-boat': 'pb', 'snorkeling-punta-cana': 'pb', 'horseback-riding': 'hr' };
  var PK_SHIFTS = {
    pb: { en: ['12:00 PM boat', '3:00 PM boat'], es: ['Barco 12:00 PM', 'Barco 3:00 PM'], pm: [false, true] },
    hr: { en: ['Early morning', 'Morning', 'Afternoon', 'Late afternoon'], es: ['Temprano', 'Mañana', 'Tarde', 'Tarde (2do)'], pm: [false, false, true, true] }
  };
  function normH(s) { return ' ' + String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, ' ').trim() + ' '; }
  // returns "6:45 AM", or '' when the hotel is not in the table (we confirm the time on WhatsApp)
  function pickupTime(slug, hotel, shift) {
    var g = PK_GROUP[slug], rows = g && PK[g], h = normH(hotel), best = null;
    if (!rows || h.length < 4) return '';
    rows.forEach(function (r) { if (h.indexOf(' ' + r[0] + ' ') >= 0 && (!best || r[0].length > best[0].length)) best = r; });
    if (!best) return '';
    var i = g === 'isl' ? 0 : (shift | 0), t = best[1 + i];
    if (!t) return '';
    var pm = g === 'isl' ? false : PK_SHIFTS[g].pm[i];
    return t + (pm ? ' PM' : ' AM');
  }


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
    // departure choice (Party Boat / Snorkel / Horseback) + pickup time shown before paying
    var slug = form.dataset.slug, grp = PK_GROUP[slug], shiftIdx = 0, pkTime = null;
    if (grp && hotelIn && mode === 'pay') {
      var pkSel = $('.pk-sel', form);
      if (PK_SHIFTS[grp] && pkSel) {
        var labs = PK_SHIFTS[grp][L === 'es' ? 'es' : 'en'], sh = document.createElement('div');
        sh.className = 'fld pk-shift';
        sh.innerHTML = '<span class="lbl">' + (L === 'es' ? 'Salida' : 'Departure') + '</span><div class="seg' + (labs.length > 2 ? ' seg4' : '') + '" role="radiogroup"></div>';
        labs.forEach(function (t, i) {
          var lb = document.createElement('label');
          lb.innerHTML = '<input type="radio" name="' + form.id + '-shift" value="' + i + '"' + (i === 0 ? ' checked' : '') + '><span></span>';
          $('span', lb).textContent = t; $('.seg', sh).appendChild(lb);
        });
        pkSel.parentNode.insertBefore(sh, pkSel);
        $$('input', sh).forEach(function (r) { r.addEventListener('change', function () { shiftIdx = +r.value; showTime(); }); });
      }
      pkTime = document.createElement('p'); pkTime.className = 'pk-time'; pkTime.setAttribute('aria-live', 'polite'); pkTime.hidden = true;
      hotelIn.parentNode.appendChild(pkTime);
    }
    function curTime() { return grp && pkMode() === 'hotel' ? pickupTime(slug, hotelIn.value, shiftIdx) : ''; }
    function showTime() {
      if (!pkTime) return;
      var t = curTime(), v = hotelIn.value.trim();
      if (t) { pkTime.textContent = (L === 'es' ? 'Hora de recogida en tu hotel: ' : 'Pickup time at your hotel: ') + t; pkTime.hidden = false; }
      else if (v.length >= 3) { pkTime.textContent = L === 'es' ? 'Te confirmamos la hora de recogida por WhatsApp.' : 'We confirm your pickup time on WhatsApp.'; pkTime.hidden = false; }
      else pkTime.hidden = true;
    }
    if (pkTime) { ['input', 'change'].forEach(function (k) { hotelIn.addEventListener(k, showTime); }); $$('input[type=radio]', form).forEach(function (r) { r.addEventListener('change', showTime); }); showTime(); }
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
      if (bad.length) {
        var lbE = bad[0].id ? $('label[for="' + bad[0].id + '"]', form) : null, fl = bad[0].closest('.fld'), nm = lbE ? lbE.textContent : (fl && $('.lbl', fl) ? $('.lbl', fl).textContent : '');
        msg.textContent = T.err_fields + (nm ? ' (' + nm.trim() + ')' : ''); msg.hidden = false; ev('book_missing_fields'); bad[0].focus(); return; }
      msg.hidden = true;
      conv(CV_BOOK); ev('book_submit');
      var hp = $('[name=website]', form);
      var body = new URLSearchParams({
        tour: form.dataset.tour, slug: form.dataset.slug, date: date.value, adults: a.value, children: c ? c.value : '0',
        hotel: pickupValue(), name: $('[name=name]', form).value.trim(),
        whatsapp: (function (v) { var d = v.replace(/\D/g, ''); return (d.length === 10 && v.trim().charAt(0) !== '+') ? '1' + d : d; })($('[name=whatsapp]', form).value), email: $('[name=email]', form).value.trim(),
        lang: L, website: hp ? hp.value : '', pickup_time: curTime()
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
          msg.textContent = T.err_pay; msg.hidden = false; ev('book_pay_error'); if (chat) chat.focus();
        });
    });
    $$('input', form).forEach(function (i) { i.addEventListener('input', function () { if (i.getAttribute('aria-invalid') === 'true') i.setAttribute('aria-invalid', 'false'); }); });
  }
  $$('form.bk').forEach(setup);
  $$('form.bk').forEach(function (f) { var once = false; f.addEventListener('focusin', function () { if (!once) { once = true; ev('book_start'); } }); f.addEventListener('click', function () { if (!once) { once = true; ev('book_start'); } }); });

  // mobile modal
  var modal = $('#bk-modal'), lastFocus = null;
  function openM() { if (!modal) return; ev('book_open'); lastFocus = document.activeElement; modal.hidden = false; document.body.classList.add('lock'); var f = $('input,button.pay,a.chat', modal); if (f) f.focus(); }
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
  var HOTELS = ['Riu Palace Bávaro','Riu Palace Punta Cana','Riu Republica','Riu Naiboa','Occidental Caribe','Occidental Punta Cana','Royalton Bávaro','Royalton Punta Cana','Royalton Chic','Majestic Elegance','Majestic Colonial','Majestic Mirage','Bahía Príncipe','Iberostar Selection Bávaro','Iberostar Dominicana','Iberostar Punta Cana','Ocean Blue & Sand','Princess Punta Cana','Vik Arena Blanca','Grand Palladium','Impressive Punta Cana','Dreams Royal Beach','Dreams Onyx','Dreams Macao','Dreams Palm Beach','Live Aqua','Nickelodeon Punta Cana','Hard Rock Punta Cana','Zoetry Agua','Sivory','Excellence Punta Cana','Excellence El Carmen','Sirenis','Breathless Punta Cana','Meliá Caribe Beach','Paradisus Palma Real','Lopesan Costa Bávaro','Lopesan Caoba Lagoon','Lopesan Serenity Bay','Lopesan Splash Cove','Barceló Bávaro Palace','Be Live Collection','Serenade Punta Cana','Catalonia Bávaro','Catalonia Royal Bávaro','Radisson Blu Punta Cana','Club Med Punta Cana','Four Points Punta Cana','The Westin Puntacana','Tortuga Bay','Sanctuary Cap Cana','Hyatt Ziva Cap Cana','Hyatt Zilara Cap Cana','Secrets Cap Cana','Secrets Royal Beach','Eden Roc Cap Cana','TRS Cap Cana','TRS Turquesa','Ancora Punta Cana','Viva Dominicus','Iberostar Hacienda Dominicus','Hilton La Romana','Sunscape Dominicus','Casa de Campo','Bahía La Romana','La Estancia'];
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
      var showStep = function (step) {
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
        showStep(2); ev('book_step2');
        var h = $('[name=hotel]', fm); if (h && !h.closest('[hidden]')) h.focus();
      });
      sumE.addEventListener('click', function () { showStep(1); });
      $$('.sb, input', fm).forEach(function (el) { el.addEventListener('click', function () { setTimeout(label, 0); }); el.addEventListener('change', function () { setTimeout(label, 0); }); });
      new MutationObserver(label).observe(payB, { childList: true, characterData: true, subtree: true });
      showStep(1);
    }
  }

  // photo viewer: tapping a gallery photo opens it large (was a dead click)
  var gimgs = $$('.gal img, picture.m1 img, picture.m2 img, picture.m3 img');
  if (gimgs.length) {
    var es2 = (document.documentElement.lang || 'en').indexOf('es') === 0;
    var lb = document.createElement('div'); lb.className = 'lb'; lb.hidden = true;
    lb.setAttribute('role', 'dialog'); lb.setAttribute('aria-modal', 'true'); lb.setAttribute('aria-label', es2 ? 'Foto' : 'Photo');
    lb.innerHTML = '<button type="button" class="lb-x" aria-label="' + (es2 ? 'Cerrar' : 'Close') + '">×</button><button type="button" class="lb-p" aria-label="' + (es2 ? 'Anterior' : 'Previous') + '">‹</button><img alt=""><button type="button" class="lb-n" aria-label="' + (es2 ? 'Siguiente' : 'Next') + '">›</button>' +
      (document.getElementById('bk-side') ? '<a class="btn btn-sea lb-cta" href="#bk-side">' + (es2 ? 'Reservar · $75 por adulto' : 'Book now · $75 per adult') + '</a>' : '');
    document.body.appendChild(lb);
    var lbImg = $('img', lb), cur = 0, sx = null;
    var srcOf = function (im) { var so = im.parentNode && im.parentNode.querySelector ? im.parentNode.querySelector('source[srcset]') : null; if (so) { var c = so.getAttribute('srcset').split(',').map(function (x) { return x.trim().split(' ')[0]; }); if (c.length) return c[c.length - 1]; } return im.currentSrc || im.src; };
    var show = function (i) { cur = (i + gimgs.length) % gimgs.length; lbImg.src = srcOf(gimgs[cur]); lbImg.alt = gimgs[cur].alt || ''; };
    var open = function (i) { show(i); lb.hidden = false; document.body.classList.add('lock'); ev('photo_open'); };
    var close = function () { lb.hidden = true; document.body.classList.remove('lock'); };
    gimgs.forEach(function (im, i) { im.style.cursor = 'zoom-in'; im.addEventListener('click', function () { open(i); }); });
    $('.lb-x', lb).addEventListener('click', close);
    var lbCta = $('.lb-cta', lb);
    if (lbCta) lbCta.addEventListener('click', function (e) { e.stopPropagation(); close(); ev('photo_book_cta'); });
    $('.lb-p', lb).addEventListener('click', function (e) { e.stopPropagation(); show(cur - 1); });
    $('.lb-n', lb).addEventListener('click', function (e) { e.stopPropagation(); show(cur + 1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
    document.addEventListener('keydown', function (e) { if (lb.hidden) return; if (e.key === 'Escape') close(); if (e.key === 'ArrowLeft') show(cur - 1); if (e.key === 'ArrowRight') show(cur + 1); });
    lb.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', function (e) { if (sx === null) return; var dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 40) show(cur + (dx < 0 ? 1 : -1)); sx = null; });
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
