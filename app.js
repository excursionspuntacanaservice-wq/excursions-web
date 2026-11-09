/* Excursions Punta Cana — booking logic. No secrets here: prices are recomputed on the server (Make). */
(function () {
  'use strict';
  var HOOK = 'https://hook.us2.make.com/spazsnvez9twnync65aglpm35tbem80q', LEAD_HOOK = 'https://hook.us2.make.com/ckkn6bita5ehxtn5tykmfxfv6b6cnobb', WA = '18299621705', S = {"en": {"book": "Book now", "book_total": "Book & pay securely · {t}", "opening": "Opening secure payment…", "err_pay": "We couldn't open the payment page. Tap \"Chat on WhatsApp\" and we'll send you a secure payment link right away.", "err_fields": "Please fill in the highlighted fields.", "wa_msg": "Hi! I'd like to book {tour}", "wa_on": " on {d}", "wa_for": " for {a} adult(s)", "wa_kids": " and {c} child(ren)", "date_ph": "Choose a date", "pk_val_near": "Entrance of a hotel near: ", "pk_val_meet": "Meeting point: Petromovil Las Canas del Este", "avail": "Check availability", "brk": "{p} = {t} · no extra fees", "brk_veh": "Total {t} · no extra fees", "child": " child", "children": " children", "avail_ok": "Available on {d}", "step1": "Step 1 of 2 · Date and people", "step2": "Step 2 of 2 · Pickup and contact", "pick_date": "Choose a date to check availability.", "change": "Change", "adult": " adult", "adults": " adults", "kids": " kids", "lead_ok": "Sent! Check your inbox (and the spam folder, just in case). We’ll also remind you before your trip.", "lead_err": "We couldn’t send it right now. Try again in a minute or message us on WhatsApp.", "lead_email": "Enter a valid email.", "save_t": "Not booking today? Save this tour", "save_p": "We email you your hotel’s pickup time, the price and the link to book. No payment.", "save_b": "Send", "close": "Close"}, "es": {"book": "Reservar", "book_total": "Reservar y pagar seguro · {t}", "opening": "Abriendo el pago seguro…", "err_pay": "No pudimos abrir la página de pago. Toca \"Escríbenos por WhatsApp\" y te enviamos el link de pago seguro al momento.", "err_fields": "Completa los campos marcados.", "wa_msg": "¡Hola! Quiero reservar {tour}", "wa_on": " para el {d}", "wa_for": " para {a} adulto(s)", "wa_kids": " y {c} niño(s)", "date_ph": "Elige una fecha", "pk_val_near": "Entrada de hotel cerca de: ", "pk_val_meet": "Punto de encuentro: Petromovil Las Canas del Este", "avail": "Ver disponibilidad", "brk": "{p} = {t} · sin cargos extra", "brk_veh": "Total {t} · sin cargos extra", "child": " niño", "children": " niños", "avail_ok": "Disponible el {d}", "step1": "Paso 1 de 2 · Fecha y personas", "step2": "Paso 2 de 2 · Recogida y contacto", "pick_date": "Elige una fecha para ver disponibilidad.", "change": "Cambiar", "adult": " adulto", "adults": " adultos", "kids": " niños", "lead_ok": "¡Enviado! Revisa tu correo (y la carpeta de spam, por si acaso). También te recordamos antes de tu viaje.", "lead_err": "No pudimos enviarlo ahora. Inténtalo en un minuto o escríbenos por WhatsApp.", "lead_email": "Escribe un correo válido.", "save_t": "¿Hoy no reservas? Guarda este tour", "save_p": "Te mandamos por correo la hora de recogida de tu hotel, el precio y el link para reservar. Sin pago.", "save_b": "Enviar", "close": "Cerrar"}};
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  function money(n) { return '$' + (n % 1 ? n.toFixed(2) : String(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  // Earliest bookable day, in Punta Cana time (UTC-4, no DST): tomorrow, or the day after once it's past CUTOFF_H.
  // The operator needs the booking the evening before, so late-night bookings for the next morning are blocked.
  var CUTOFF_H = 22;
  function firstDay() { var rd = new Date(Date.now() - 4 * 3600 * 1000);
    return new Date(rd.getUTCFullYear(), rd.getUTCMonth(), rd.getUTCDate() + (rd.getUTCHours() >= CUTOFF_H ? 2 : 1)); }
  function lateCut() { return new Date(Date.now() - 4 * 3600 * 1000).getUTCHours() >= CUTOFF_H; }
  function tomorrow() { var d = firstDay(); var m = d.getMonth() + 1, day = d.getDate();
    return d.getFullYear() + '-' + (m < 10 ? '0' : '') + m + '-' + (day < 10 ? '0' : '') + day; }
  function waLink(text) { return 'https://wa.me/' + WA + '?text=' + encodeURIComponent(text); }
  // Google Ads secondary counters (observation only, not used for bidding)
  // Origen de la visita (primer toque, 30 días): anuncio, ChatGPT, Google, Instagram o directo.
  var SRC = (function () {
    var cur = '';
    try {
      var u = new URLSearchParams(window.location.search), r = document.referrer, h = '';
      try { h = r ? new URL(r).hostname.replace(/^www\./, '') : ''; } catch (e) {}
      if (u.get('gclid') || u.get('gbraid') || u.get('wbraid') || u.get('gad_source')) cur = 'google-ads' + (u.get('gad_campaignid') ? ' ' + u.get('gad_campaignid') : '');
      else if (u.get('fbclid')) cur = 'meta';
      else if (u.get('utm_source')) cur = u.get('utm_source') + (u.get('utm_medium') ? '/' + u.get('utm_medium') : '') + (u.get('utm_campaign') ? '/' + u.get('utm_campaign') : '');
      else if (h && h.indexOf('excursionspuntacana.net') < 0 && h.indexOf('stripe.com') < 0) cur = 'ref ' + h;
      if (cur) cur += ' > ' + window.location.pathname;
      var old = null; try { old = JSON.parse(localStorage.getItem('epc_src') || 'null'); } catch (e) {}
      var fresh = old && (Date.now() - old.t) < 30 * 864e5;
      if (cur && !fresh) { old = { s: cur, t: Date.now() }; fresh = true; }
      if (!fresh) { old = { s: 'directo > ' + window.location.pathname, t: Date.now() }; }
      localStorage.setItem('epc_src', JSON.stringify(old));
      return (old.s + (cur && cur !== old.s ? ' | ultimo: ' + cur : '')).slice(0, 200);
    } catch (e) { return (cur || 'directo').slice(0, 200); }
  })();
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
    isl: [
      // Uvero Alto · Macao · Cap Cana (Uvero Alto + Cap Cana: $85 / $42.50, min 4 pax; see ZONE85)
      ['zoetry','6:20'],['sivory','6:35'],['excellence punta cana','6:40'],['excellence pc','6:40'],['sirenis','6:40'],['breathless','6:40'],
      ['excellence el carmen','6:45'],['excellence del carmen','6:45'],['finest','6:45'],
      ['dreams onyx','6:35'],['now onyx','6:35'],['nickelodeon','6:45'],['el faro','6:45'],
      ['live aqua','6:40'],['dreams punta cana','6:45'],['royalton chic','6:45'],['chic punta cana','6:45'],['hard rock','6:45'],['dreams macao','6:50'],
      // Bávaro (new provider)
      ['punta cana princess','7:10','L'],['princess punta cana','7:10','L'],['occidental caribe','7:15','L'],['royalton splash','7:15','B'],['splash punta cana','7:15','B'],
      ['riu republica','7:20','L'],['ocean blue','7:20','L'],['bahia principe','7:20','B'],['riu','7:25','L'],['bavaro princess','7:30','L'],['vista sol','7:30','B'],
      ['iberostar','7:35','L'],['palladium','7:40','L'],['occidental punta cana','7:40','L'],['impressive','7:50','B'],['melia','7:55','B'],['lopesan','7:55','M'],['barcelo','8:00','L'],
      // Bávaro (previous provider)
      ['royalton','7:05'],['majestic','7:05'],['vik arena','7:30'],['caribe deluxe','7:40'],['whala','7:50'],['whalas','7:50'],['dreams royal beach','7:55'],
      // Cabeza de Toro (new provider: Catalonia, Serenade, Sunscape Coco)
      ['catalonia','7:30','B'],['serenade','7:35','B'],['sunscape coco','7:40','B'],
      ['natura park','7:50'],['dreams palm beach','7:50'],['be live','7:50'],['radisson','8:10'],
      // Punta Cana · Cap Cana · Bayahibe · La Romana (previous provider)
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
      ['royalton chic',null],['chic punta cana',null],['hacienda dominicus',null],['dominicus',null],['la romana',null],['casa de campo',null]],
    // Buggy / ATV (Adventure Boogies, Macao): 1st tour 9:00 AM, 2nd 12:00 PM (+3 h), 3rd 3:00 PM (+6 h). Cap Cana: confirm on WhatsApp
    bg: [['dreams flora','6:20','9:20','12:20'],['jewel palm','7:10','10:10','1:10'],['sunscape coco','7:15','10:15','1:15'],['be live','7:15','10:15','1:15'],['serenade','7:20','10:20','1:20'],['radisson','7:25','10:25','1:25'],['catalonia','7:30','10:30','1:30'],['plaza san juan','7:30','10:30','1:30'],['marriott','7:35','10:35','1:35'],['barcelo bavaro beach','7:30','10:30','1:30'],['barcelo palace','7:35','10:35','1:35'],['barcelo','7:35','10:35','1:35'],['lopesan','7:40','10:40','1:40'],['palma real','7:40','10:40','1:40'],['melia caribe','7:50','10:50','1:50'],['melia punta cana','7:55','10:55','1:55'],['melia','7:50','10:50','1:50'],['paradisus palma real','8:00','11:00','2:00'],['paradisus','8:00','11:00','2:00'],['garden suites','8:05','11:05','2:05'],['the reserve','8:05','11:05','2:05'],['falcon','8:05','11:05','2:05'],['dreams royal beach','8:10','11:10','2:10'],['secrets royal','8:10','11:10','2:10'],['whala','8:10','11:10','2:10'],['impressive','8:10','11:10','2:10'],['vista sol','8:15','11:15','2:15'],['palladium','8:15','11:15','2:15'],['grand palladium bavaro','8:20','11:20','2:20'],['occidental punta cana','8:25','11:25','2:25'],['bavaro princess','7:30','10:30','1:30'],['caribe deluxe','7:40','10:40','1:40'],['karibo','7:40','10:40','1:40'],['punta cana princess','7:50','10:50','1:50'],['princess punta cana','7:50','10:50','1:50'],['vik arena','7:55','10:55','1:55'],['ocean blue','8:00','11:00','2:00'],['iberostar punta cana','8:10','11:10','2:10'],['iberostar dominicana','8:10','11:10','2:10'],['iberostar grand','8:15','11:15','2:15'],['iberostar bavaro','8:15','11:15','2:15'],['iberostar','8:10','11:10','2:10'],['riu palace punta cana','7:35','10:35','1:35'],['riu bambu','7:40','10:40','1:40'],['riu palace macao','7:45','10:45','1:45'],['riu naiboa','7:50','10:50','1:50'],['riu palace bavaro','7:50','10:50','1:50'],['riu','7:50','10:50','1:50'],['bahia principe punta cana','8:00','11:00','2:00'],['bahia principe','8:05','11:05','2:05'],['royalton punta cana','8:00','11:00','2:00'],['royalton splash','8:05','11:05','2:05'],['royalton bavaro','8:10','11:10','2:10'],['royalton','8:05','11:05','2:05'],['majestic colonial','8:15','11:15','2:15'],['majestic mirage','8:20','11:20','2:20'],['majestic elegance','8:20','11:20','2:20'],['majestic','8:15','11:15','2:15'],['riu republica','8:25','11:25','2:25'],['occidental caribe','8:30','11:30','2:30'],['hard rock','8:30','11:30','2:30'],['zoetry','7:30','10:30','1:30'],['sivory','7:30','10:30','1:30'],['excellence punta cana','7:35','10:35','1:35'],['excellence pc','7:35','10:35','1:35'],['sirenis','7:50','10:50','1:50'],['excellence el carmen','7:55','10:55','1:55'],['excellence del carmen','7:55','10:55','1:55'],['finest','7:55','10:55','1:55'],['secrets tides','8:00','11:00','2:00'],['breathless','8:00','11:00','2:00'],['dreams onyx','8:05','11:05','2:05'],['now onyx','8:05','11:05','2:05'],['live aqua','8:10','11:10','2:10'],['alltra','8:15','11:15','2:15'],['funique','8:15','11:15','2:15'],['nickelodeon','8:20','11:20','2:20'],['royalton chic','8:25','11:25','2:25'],['chic punta cana','8:25','11:25','2:25'],['el faro','8:30','11:30','2:30'],['dreams macao','8:35','11:35','2:35'],['eden roc',null],['sanctuary',null],['dreams cap cana',null],['hyatt',null],['secrets cap cana',null],['trs cap cana',null],['ancora',null],['cap cana',null]]
  };
  var ZONE85 = / (uvero|cap ?cana|zoetry|sivory|excellence|finest|sirenis|breathless|secrets tides|onyx|live aqua|alltra|funique|nickelodeon|chic|el faro|dreams punta cana|eden roc|sanctuary|hyatt|ancora|margaritaville) /;
  var PK_GROUP = { 'saona-island': 'isl', 'catalina-island': 'isl', 'santo-domingo': 'isl', 'party-boat': 'pb', 'snorkeling-punta-cana': 'snk', 'horseback-riding': 'hr', 'buggy': 'bg', 'atv': 'bg' };
  PK.snk = PK.pb;
  var PK_SHIFTS = {
    pb: { en: ['12:00 PM boat', '3:00 PM boat'], es: ['Barco 12:00 PM', 'Barco 3:00 PM'], pm: [false, true] },
    hr: { en: ['Early morning', 'Morning', 'Afternoon', 'Late afternoon'], es: ['Temprano', 'Mañana', 'Tarde', 'Tarde (2do)'], pm: [false, false, true, true] },
    bg: { en: ['9:00 AM', '12:00 PM', '3:00 PM'], es: ['9:00 AM', '12:00 PM', '3:00 PM'], pm: [false, false, true] },
    snk: { en: ['12:00 PM · family', '3:00 PM · adults only'], es: ['12:00 PM · familiar', '3:00 PM · solo adultos'], pm: [false, true] }
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
    var out = t + (pm ? ' PM' : ' AM');
    // isl rows may carry the pickup spot: L = lobby, B = barrier/gate, M = hotel's excursion meeting point
    if (g === 'isl' && best[2]) {
      var es = (document.documentElement.lang || '').indexOf('es') === 0;
      var SPOT = es ? { L: 'lobby del hotel', B: 'barrera (entrada) del hotel', M: 'meeting point de excursiones del hotel' }
                    : { L: 'hotel lobby', B: 'hotel barrier gate (entrance)', M: "hotel's excursion meeting point" };
      if (SPOT[best[2]]) out += ' · ' + SPOT[best[2]];
    }
    return out;
  }


  // ---------- calendar (replaces the browser date field) ----------
  function iso(d) { var m = d.getMonth() + 1, x = d.getDate(); return d.getFullYear() + '-' + (m < 10 ? '0' : '') + m + '-' + (x < 10 ? '0' : '') + x; }
  function picker(root, L, onPick) {
    var btn = $('.dp-btn', root), val = $('.dp-v', root), input = $('input[name=date]', root), pop = $('.dp-pop', root);
    var loc = L === 'es' ? 'es-DO' : 'en-US', weekStart = L === 'es' ? 1 : 0;
    var min = firstDay();
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
      var late = '';
      if (lateCut()) {
        var lt = L === 'es' ? ['¿Lo necesitas para mañana?', 'Escríbenos y lo consultamos con el operador'] : ['Need it for tomorrow?', 'Message us and we\u2019ll check with the operator'];
        late = '<p class="dp-late">' + lt[0] + ' <a href="' + waLink(L === 'es' ? 'Hola, quiero saber si hay cupo para mañana' : 'Hi, is there space for tomorrow?') + '" target="_blank" rel="noopener">' + lt[1] + '</a></p>';
      }
      pop.innerHTML = h + '</div>' + late;
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
    // Uvero Alto / Cap Cana hotels: Saona, Catalina, Santo Domingo cost $85 / $42.50 and need 4+ people (same rule as Make)
    function zone85() { var hi = $('[name=hotel]', form), r = $('input[value=nohotel]', form);
      return PK_GROUP[form.dataset.slug] === 'isl' && !!hi && !(r && r.checked) && ZONE85.test(normH(hi.value)); }
    function pax() { return (a ? +a.value : 0) + (c ? +c.value : 0); }
    function total() { if (veh && veh.length) return vTotal(); var z = zone85(); return (a ? +a.value : 0) * (z ? 85 : adult) + (c ? +c.value : 0) * (z ? 42.5 : child); }
    // product options (dolphin programs, buggy vehicles, private boat sizes): pick one, price and WhatsApp text follow it
    var opts = null, optI = 0;
    try { opts = form.dataset.opts ? JSON.parse(form.dataset.opts) : null; } catch (e) { opts = null; }
    if (opts && opts.length) {
      var top = $('.bk-top', form), ob = document.createElement('div');
      ob.className = 'fld bk-opts';
      ob.innerHTML = '<span class="lbl">' + (form.dataset.optsLbl || (L === 'es' ? 'Elige una opción' : 'Choose an option')) + '</span><div class="opt-l" role="radiogroup"></div>';
      opts.forEach(function (o, i) {
        var lb = document.createElement('label');
        lb.innerHTML = '<input type="radio" name="' + form.id + '-opt" value="' + i + '"' + (i === 0 ? ' checked' : '') + '><span class="opt-c"><b class="opt-n"></b><b class="opt-p"></b><span class="opt-d"></span></span>';
        $('.opt-n', lb).textContent = o.n; $('.opt-d', lb).textContent = o.d || ''; $('.opt-p', lb).textContent = money(o.p);
        $('.opt-l', ob).appendChild(lb);
      });
      top.parentNode.insertBefore(ob, top.nextSibling);
      var kids = $('.bk-kids', form); if (kids && form.dataset.optsNote) kids.textContent = form.dataset.optsNote; else if (kids) kids.hidden = true;
      var showOpt = function () {
        var o = opts[optI], pb = $('.bk-price', form); if (!pb) return;
        var fr = $('.bk-from', pb); if (fr) fr.hidden = true;
        $('b', pb).textContent = money(o.p); $('span:last-child', pb).textContent = o.u || o.n;
      };
      $$('input', ob).forEach(function (r) { r.addEventListener('change', function () { optI = +r.value; showOpt(); refresh(); syncSun(); ev('option_pick'); }); });
      showOpt();
    }

    // vehicle planner (buggy / ATV): how the group splits into vehicles; price = sum of vehicles
    var veh = null, vt = 0, vc = [], vAuto = true;
    try { veh = form.dataset.veh ? JSON.parse(form.dataset.veh) : null; } catch (e) { veh = null; }
    var VT = L === 'es' ? { type: 'Vehículo', how: '¿Cómo se reparten?', seat: ' asiento', seats: ' asientos', ok: 'Listo: {p} personas en {s} asientos.', short: 'Faltan {n} asiento(s) para {p} personas. Agrega un vehículo.', extra: 'Sobra(n) {n} asiento(s): pagas el vehículo completo.', none: 'Elige al menos un vehículo.', ppl: ' para {a} persona(s)', dep: '. Salida ', pk: ' (recogida {t})' }
                       : { type: 'Vehicle', how: 'How do you split up?', seat: ' seat', seats: ' seats', ok: 'All set: {p} people in {s} seats.', short: '{n} seat(s) missing for {p} people. Add a vehicle.', extra: '{n} empty seat(s): you pay for the whole vehicle.', none: 'Choose at least one vehicle.', ppl: ' for {a} people', dep: '. Departure ', pk: ' (pickup {t})' };
    function vSeats() { return veh[vt].v.reduce(function (s, o, i) { return s + o.s * (vc[i] || 0); }, 0); }
    function vTotal() { return veh[vt].v.reduce(function (s, o, i) { return s + o.p * (vc[i] || 0); }, 0); }
    function vText() { return veh[vt].v.map(function (o, i) { return vc[i] ? vc[i] + ' × ' + o.n : ''; }).filter(Boolean).join(' + '); }
    // cheapest split that seats everyone exactly; ties go to fewer vehicles
    function vSuggest(p) {
      var v = veh[vt].v, best = [{ c: 0, n: 0, k: [] }];
      for (var x = 1; x <= p; x++) { best[x] = null;
        v.forEach(function (o, i) { var b = best[x - o.s]; if (x - o.s < 0 || !b) return;
          var c = b.c + o.p, n = b.n + 1; if (!best[x] || c < best[x].c || (c === best[x].c && n < best[x].n)) { var k = b.k.slice(); k[i] = (k[i] || 0) + 1; best[x] = { c: c, n: n, k: k }; } }); }
      vc = v.map(function (o, i) { return (best[p] && best[p].k[i]) || 0; });
    }
    if (veh && veh.length) {
      var vtop = $('.bk-top', form), vb = document.createElement('div');
      vb.className = 'bk-veh';
      vb.innerHTML = (veh.length > 1 ? '<div class="fld"><span class="lbl">' + VT.type + '</span><div class="seg" role="radiogroup"></div></div>' : '') +
        '<div class="fld"><span class="lbl">' + VT.how + '</span><div class="veh-l"></div></div><p class="veh-st" aria-live="polite"></p>';
      if (veh.length > 1) veh.forEach(function (t, i) { var lb = document.createElement('label');
        lb.innerHTML = '<input type="radio" name="' + form.id + '-vt" value="' + i + '"' + (i === 0 ? ' checked' : '') + '><span></span>';
        $('span', lb).textContent = t.n; $('.seg', vb).appendChild(lb); });
      // after date + people, so people are chosen first
      var r2 = $('.row2', form); (r2 || vtop).parentNode.insertBefore(vb, (r2 || vtop).nextSibling);
      var kidsV = $('.bk-kids', form); if (kidsV) { if (form.dataset.vehNote) kidsV.textContent = form.dataset.vehNote; else kidsV.hidden = true; }
      var drawV = function () {
        var l = $('.veh-l', vb); l.innerHTML = '';
        veh[vt].v.forEach(function (o, i) {
          var row = document.createElement('div'); row.className = 'veh-r';
          row.innerHTML = '<span class="veh-n"><b></b><small></small></span><div class="step" role="group"><button type="button" class="vb" data-d="-1">−</button><output></output><button type="button" class="vb" data-d="1">+</button></div>';
          $('b', row).textContent = o.n; $('small', row).textContent = o.s + (o.s > 1 ? VT.seats : VT.seat) + ' · ' + money(o.p);
          $('.step', row).setAttribute('aria-label', o.n);
          $$('.vb', row)[0].setAttribute('aria-label', (L === 'es' ? 'Quitar ' : 'Remove ') + o.n);
          $$('.vb', row)[1].setAttribute('aria-label', (L === 'es' ? 'Agregar ' : 'Add ') + o.n);
          $('output', row).textContent = vc[i] || 0;
          $$('.vb', row).forEach(function (b) { b.addEventListener('click', function () { vAuto = false; vc[i] = Math.max(0, Math.min(15, (vc[i] || 0) + (+b.dataset.d))); $('output', row).textContent = vc[i]; showV(); refresh(); ev('vehicle_edit'); }); });
          l.appendChild(row);
        });
      };
      var showV = function () {
        var p = a ? +a.value : 1, s = vSeats(), st = $('.veh-st', vb), pb = $('.bk-price', form);
        st.className = 'veh-st' + (s < p || !s ? ' bad' : '');
        st.textContent = !s ? VT.none : s < p ? VT.short.replace('{n}', p - s).replace('{p}', p) : s > p ? VT.extra.replace('{n}', s - p) : VT.ok.replace('{p}', p).replace('{s}', s);
        if (pb) { var fr = $('.bk-from', pb); if (fr) fr.hidden = true; $('b', pb).textContent = money(vTotal()); $('span:last-child', pb).textContent = veh[vt].n + (vText() ? ' · ' + vText() : ''); }
      };
      $$('input[name="' + form.id + '-vt"]', vb).forEach(function (r) { r.addEventListener('change', function () { vt = +r.value; vSuggest(a ? +a.value : 1); vAuto = true; drawV(); showV(); refresh(); ev('vehicle_type'); }); });
      var resync = function () { vSuggest(a ? +a.value : 1); vAuto = true; drawV(); showV(); };
      if (a) a.addEventListener('change', resync);
      $$('.sb', form).forEach(function (b) { b.addEventListener('click', function () { setTimeout(function () { resync(); refresh(); }, 0); }); });
      resync();
      form._vehBad = function () { var p = a ? +a.value : 1, s = vSeats(); return !s || s < p ? $('.veh-st', vb).textContent : ''; };
    }
    function waText() {
      var vs = veh && veh.length ? veh[vt].n + (vText() ? ': ' + vText() + ' = ' + money(vTotal()) : '') : '';
      var t = T.wa_msg.replace('{tour}', form.dataset.tourL + (opts && opts.length ? ' (' + opts[optI].n + ')' : vs ? ' (' + vs + ')' : ''));
      if (date && date.value) t += T.wa_on.replace('{d}', fmtDate(date.value, L));
      if (a) t += vs ? VT.ppl.replace('{a}', a.value) : T.wa_for.replace('{a}', a.value);
      if (c && +c.value > 0) t += T.wa_kids.replace('{c}', c.value);
      if (mode !== 'pay' && PK_SHIFTS[PK_GROUP[form.dataset.slug]]) t += (L === 'es' ? '. Salida ' : '. Departure ') + PK_SHIFTS[PK_GROUP[form.dataset.slug]][L === 'es' ? 'es' : 'en'][shiftIdx | 0];
      var hv = mode !== 'pay' && $('[name=hotel]', form) ? $('[name=hotel]', form).value.trim() : '';
      if (hv) { var ct = curTime(); t += '. Hotel: ' + hv + (ct ? (L === 'es' ? ' (recogida ' : ' (pickup ') + ct.split(' · ')[0] + ')' : ''); }
      return t + '.';
    }
    function refresh() {
      if (pay) pay.textContent = T.book_total.replace('{t}', money(total()));
      var zn = $('.bk-zone-msg', form), z = zone85();
      if (z && !zn && pay) { zn = document.createElement('p'); zn.className = 'bk-zone-msg'; zn.setAttribute('aria-live', 'polite'); pay.parentNode.insertBefore(zn, pay); }
      if (zn) { zn.hidden = !z; zn.textContent = z ? (L === 'es' ? 'Hoteles de Uvero Alto y Cap Cana: $85 por adulto / $42.50 por niño, recogida directa en tu hotel, mínimo 4 personas.' : 'Uvero Alto and Cap Cana hotels: $85 per adult / $42.50 per child, direct pickup at your hotel, minimum 4 people.') : ''; }
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
      if (grp === 'bg') return (pkMode() === 'hotel' ? hotelIn.value.trim() : (nhMode() === 'meet' ? T.pk_val_meet : T.pk_val_near + nearIn.value.trim())) + ' · Tour ' + PK_SHIFTS.bg.en[shiftIdx | 0];
      if (pkMode() === 'hotel') return hotelIn.value.trim() + (sunset() ? ' · SUNSET 4-6 PM' : '');
      return (nhMode() === 'meet' ? T.pk_val_meet : T.pk_val_near + nearIn.value.trim()) + (sunset() ? ' · SUNSET 4-6 PM' : '');
    }
    // departure choice (Party Boat / Snorkel / Horseback) + pickup time shown before paying
    var slug = form.dataset.slug, grp = PK_GROUP[slug], shiftIdx = 0, pkTime = null;
    if (grp && hotelIn) {
      var pkSel = $('.pk-sel', form) || hotelIn.closest('.fld');
      if (PK_SHIFTS[grp] && pkSel) {
        var labs = PK_SHIFTS[grp][L === 'es' ? 'es' : 'en'], sh = document.createElement('div');
        sh.className = 'fld pk-shift';
        sh.innerHTML = '<span class="lbl">' + (L === 'es' ? 'Salida' : 'Departure') + '</span><div class="seg' + (labs.length === 3 ? ' seg3' : labs.length > 2 ? ' seg4' : '') + '" role="radiogroup"></div>';
        labs.forEach(function (t, i) {
          var lb = document.createElement('label');
          lb.innerHTML = '<input type="radio" name="' + form.id + '-shift" value="' + i + '"' + (i === 0 ? ' checked' : '') + '><span></span>';
          $('span', lb).textContent = t; $('.seg', sh).appendChild(lb);
        });
        pkSel.parentNode.insertBefore(sh, pkSel);
        $$('input', sh).forEach(function (r) { r.addEventListener('change', function () { shiftIdx = +r.value; showTime(); refresh(); }); });
      }
      pkTime = document.createElement('p'); pkTime.className = 'pk-time'; pkTime.setAttribute('aria-live', 'polite'); pkTime.hidden = true;
      hotelIn.parentNode.appendChild(pkTime);
    }
    function sunset() { return !!(opts && opts.length && opts[optI].k === 'sunset'); }
    function curTime() { return grp && pkMode() === 'hotel' && !sunset() ? pickupTime(slug, hotelIn.value, shiftIdx) : ''; }
    function syncSun() { var s = $('.pk-shift', form), st1 = !!$('.bk-next', form) && !form.classList.contains('st2'); if (s) s.hidden = sunset() || st1; if (typeof showTime === 'function') showTime(); }
    form._syncSun = syncSun;
    function showTime() {
      if (!pkTime) return;
      var t = curTime(), v = hotelIn.value.trim();
      if (t) { pkTime.textContent = (L === 'es' ? 'Hora de recogida en tu hotel: ' : 'Pickup time at your hotel: ') + t; pkTime.hidden = false; }
      else if (v.length >= 3 || sunset()) { pkTime.textContent = sunset() ? (L === 'es' ? 'Paseo al atardecer de 4:00 a 6:00 PM. Te confirmamos la hora de recogida en tu hotel por WhatsApp.' : 'Sunset ride from 4:00 to 6:00 PM. We confirm your hotel pickup time on WhatsApp.') : (L === 'es' ? 'Te confirmamos la hora de recogida por WhatsApp.' : 'We confirm your pickup time on WhatsApp.'); pkTime.hidden = false; }
      else pkTime.hidden = true;
    }
    if (hotelIn) ['input', 'change'].forEach(function (k) { hotelIn.addEventListener(k, refresh); });
    if (pkTime) { ['input', 'change'].forEach(function (k) { hotelIn.addEventListener(k, showTime); }); $$('input[type=radio]', form).forEach(function (r) { r.addEventListener('change', showTime); }); showTime(); }
    syncSun();
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
      if (form._vehBad && form._vehBad()) { msg.textContent = form._vehBad(); msg.hidden = false; ev('book_veh_seats'); return; }
      if (grp === 'snk' && shiftIdx === 1 && c && +c.value > 0) { msg.textContent = L === 'es' ? 'El barco de las 3:00 PM es solo para adultos (18+). Con niños, elige el barco familiar de las 12:00 PM.' : 'The 3:00 PM boat is adults only (18+). With children, choose the 12:00 PM family boat.'; msg.hidden = false; ev('book_snk_kids_pm'); return; }
      if (zone85() && pax() < 4) { msg.textContent = L === 'es' ? 'En hoteles de Uvero Alto y Cap Cana este tour sale desde 4 personas. Escríbenos por WhatsApp y te ayudamos.' : 'From Uvero Alto and Cap Cana hotels this tour runs with 4 people or more. Message us on WhatsApp and we will help you.'; msg.hidden = false; ev('book_zone_min4'); return; }
      msg.hidden = true;
      cvBookOnce(); ev('book_submit');
      var hp = $('[name=website]', form);
      var body = new URLSearchParams({
        tour: form.dataset.tour, slug: form.dataset.slug, date: date.value, adults: a.value, children: c ? c.value : '0',
        hotel: pickupValue(), name: $('[name=name]', form) ? $('[name=name]', form).value.trim() : '',
        whatsapp: (function (v) { var d = v.replace(/\D/g, ''); return (d.length === 10 && v.trim().charAt(0) !== '+') ? '1' + d : d; })($('[name=whatsapp]', form) ? $('[name=whatsapp]', form).value : ''), email: $('[name=email]', form).value.trim(),
        lang: L, website: hp ? hp.value : '', pickup_time: curTime(), fuente: SRC, veh: veh && veh.length ? vc.map(function (n) { return n || 0; }).join(',') : ''
      });
      pay.disabled = true; pay.textContent = T.opening;
      var ctl = window.AbortController ? new AbortController() : null, timer = setTimeout(function () { if (ctl) ctl.abort(); }, 25000);
      fetch(HOOK, { method: 'POST', body: body, signal: ctl ? ctl.signal : undefined, credentials: 'omit', referrerPolicy: 'strict-origin' })
        .then(function (r) { return r.json(); })
        .then(function (j) {
          clearTimeout(timer);
          if (j && j.ok && typeof j.url === 'string' && j.url.indexOf('https://checkout.stripe.com/') === 0) { ev('stripe_checkout'); window.location.assign(j.url); return; }
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
  // 'Tocó Reservar': first tap on any booking button (Check dates / Book now) or inside the booking form, once per page view
  var cvBookSent = false;
  function cvBookOnce() { if (!cvBookSent) { cvBookSent = true; conv(CV_BOOK); } }
  document.addEventListener('click', function (e) {
    var t = e.target && e.target.closest ? e.target.closest('a[href="#bk-side"],[data-open="bk-modal"],.hero-cta,.lb-cta,form.bk,.qk') : null;
    if (t) cvBookOnce();
  }, true);
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

  // quick booking on the mobile offer card: date + people + live total on the first screen, then the full form opens prefilled
  $$('.qk').forEach(function (q) {
    var L = q.dataset.lang || 'en', ad = parseFloat(q.dataset.adult) || 0, ch = parseFloat(q.dataset.child) || 0;
    var qa = $('[name=adults]', q), qc = $('[name=children]', q), qt = $('.qk-t', q), go = $('.qk-go', q);
    function clampQ(inp) { var v = parseInt(inp.value, 10), mn = +inp.min, mx = +inp.max; if (isNaN(v)) v = mn; inp.value = Math.max(mn, Math.min(mx, v)); }
    function upd() { qt.textContent = money((+qa.value || 0) * ad + (+qc.value || 0) * ch); }
    var qdp = picker($('.dp', q), L, function () { upd(); ev('date_selected'); });
    $$('.sb', q).forEach(function (b) { b.addEventListener('click', function () { var inp = $('input', b.parentNode); inp.value = (+inp.value || 0) + (+b.dataset.step); clampQ(inp); upd(); ev('passengers_changed'); }); });
    [qa, qc].forEach(function (inp) { inp.addEventListener('change', function () { clampQ(inp); upd(); }); });
    upd();
    // while the date card is on screen, hide the fixed bottom bar so the two buttons don't compete
    if ('IntersectionObserver' in window) new IntersectionObserver(function (en) { document.body.classList.toggle('qk-on', en[0].isIntersecting); }, { threshold: 0.15 }).observe(q);
    go.addEventListener('click', function () {
      var f = document.getElementById(q.dataset.target); if (!f) return;
      var fa = $('[name=adults]', f), fc = $('[name=children]', f);
      if (fa) fa.value = qa.value; if (fc) fc.value = qc.value;
      if (qdp.input.value) { var fdp = $('.dp', f), fin = $('input[name=date]', f);
        if (fin) fin.value = qdp.input.value;
        if (fdp) { $('.dp-v', fdp).textContent = $('.dp-v', q).textContent; fdp.classList.add('has'); var fb = $('.dp-btn', fdp); if (fb) fb.setAttribute('aria-invalid', 'false'); } }
      if (fa) fa.dispatchEvent(new Event('change'));
      // date already chosen: skip straight to pickup + contact
      var nx = $('.bk-next', f); if (qdp.input.value && nx) setTimeout(function () { nx.click(); }, 0);
      ev('continue_clicked');
    });
  });

  // hotel autocomplete: suggestions appear under the field while the customer types (same on iPhone and Android)
  // [name, area]. Uvero Alto and Cap Cana names must match ZONE85 (the $85 zone); the label is checked against ZONE85 when shown.
  var HOTELS = [
    ['Zoetry Agua','Uvero Alto'],['Sivory Punta Cana','Uvero Alto'],['Excellence Punta Cana','Uvero Alto'],['Excellence El Carmen','Uvero Alto'],['Finest Punta Cana','Uvero Alto'],
    ['Sirenis Punta Cana','Uvero Alto'],['Breathless Punta Cana','Uvero Alto'],['Secrets Tides Punta Cana','Uvero Alto'],['Dreams Onyx','Uvero Alto'],['Live Aqua Punta Cana','Uvero Alto'],
    ['Wyndham Alltra Punta Cana','Uvero Alto'],['Nickelodeon Punta Cana','Uvero Alto'],['Royalton Chic Punta Cana','Uvero Alto'],['Ocean El Faro','Uvero Alto'],['Dreams Punta Cana','Uvero Alto'],
    ['Hard Rock Punta Cana','Macao'],['Dreams Macao','Macao'],
    ['Riu Palace Bávaro','Bávaro'],['Riu Palace Punta Cana','Bávaro'],['Riu Palace Macao','Bávaro'],['Riu Republica','Bávaro'],['Riu Naiboa','Bávaro'],['Riu Bambu','Bávaro'],
    ['Occidental Caribe','Bávaro'],['Occidental Punta Cana','Bávaro'],['Royalton Bávaro','Bávaro'],['Royalton Punta Cana','Bávaro'],['Royalton Splash Punta Cana','Bávaro'],
    ['Majestic Elegance','Bávaro'],['Majestic Colonial','Bávaro'],['Majestic Mirage','Bávaro'],['Bahía Príncipe','Bávaro'],['Iberostar Selection Bávaro','Bávaro'],['Iberostar Dominicana','Bávaro'],
    ['Iberostar Punta Cana','Bávaro'],['Ocean Blue & Sand','Bávaro'],['Punta Cana Princess','Bávaro'],['Bávaro Princess','Bávaro'],['Caribe Deluxe Princess','Bávaro'],['Vik Arena Blanca','Bávaro'],
    ['Grand Palladium','Bávaro'],['Impressive Punta Cana','Bávaro'],['Vista Sol Punta Cana','Bávaro'],['Whala Bávaro','Bávaro'],['Dreams Royal Beach','Bávaro'],['Secrets Royal Beach','Bávaro'],
    ['Meliá Caribe Beach','Bávaro'],['Paradisus Palma Real','Bávaro'],['Lopesan Costa Bávaro','Bávaro'],['Lopesan Caoba Lagoon','Bávaro'],['Lopesan Serenity Bay','Bávaro'],
    ['Lopesan Splash Cove','Bávaro'],['Barceló Bávaro Palace','Bávaro'],['Barceló Bávaro Beach','Bávaro'],
    ['Dreams Palm Beach','Cabeza de Toro'],['Dreams Flora','Cabeza de Toro'],['Jewel Palm Beach','Cabeza de Toro'],['Be Live Collection','Cabeza de Toro'],['Natura Park','Cabeza de Toro'],
    ['Serenade Punta Cana','Cabeza de Toro'],['Catalonia Bávaro','Cabeza de Toro'],['Catalonia Royal Bávaro','Cabeza de Toro'],['Sunscape Coco Punta Cana','Cabeza de Toro'],['Radisson Blu Punta Cana','Cabeza de Toro'],
    ['Club Med Punta Cana','Punta Cana'],['Four Points Punta Cana','Punta Cana'],['The Westin Puntacana','Punta Cana'],['Tortuga Bay','Punta Cana'],['TRS Turquesa','Punta Cana'],
    ['Sanctuary Cap Cana','Cap Cana'],['Hyatt Ziva Cap Cana','Cap Cana'],['Hyatt Zilara Cap Cana','Cap Cana'],['Secrets Cap Cana','Cap Cana'],['Eden Roc Cap Cana','Cap Cana'],
    ['TRS Cap Cana','Cap Cana'],['Ancora Punta Cana','Cap Cana'],['Margaritaville Island Reserve Cap Cana','Cap Cana'],
    ['Viva Dominicus','Bayahibe'],['Iberostar Hacienda Dominicus','Bayahibe'],['Dreams Dominicus','Bayahibe'],['Sunscape Dominicus','Bayahibe'],['Cadaqués Caribe','Bayahibe'],['Hilton La Romana','Bayahibe'],
    ['Casa de Campo','La Romana'],['Bahía La Romana','La Romana'],['La Estancia','La Romana']
  ];
  function hotelAC(inp) {
    var form = inp.form, L = (form && form.dataset.lang ? form.dataset.lang : document.documentElement.lang) === 'es' ? 'es' : 'en';
    var isl = !!form && PK_GROUP[form.dataset.slug] === 'isl', box = inp.parentNode, cur = -1, items = [];
    inp.setAttribute('autocomplete', 'off'); inp.setAttribute('autocorrect', 'off'); inp.setAttribute('spellcheck', 'false'); inp.removeAttribute('list');
    inp.setAttribute('role', 'combobox'); inp.setAttribute('aria-autocomplete', 'list'); inp.setAttribute('aria-expanded', 'false');
    var ul = document.createElement('ul'); ul.className = 'ac'; ul.id = (inp.id || ('ac' + Math.random().toString(36).slice(2))) + '-ac'; ul.setAttribute('role', 'listbox'); ul.hidden = true;
    inp.setAttribute('aria-controls', ul.id); box.classList.add('ac-w'); box.appendChild(ul);
    function close() { ul.hidden = true; cur = -1; inp.setAttribute('aria-expanded', 'false'); inp.removeAttribute('aria-activedescendant'); }
    function choose(h) { inp.value = h[0]; close(); ['input', 'change'].forEach(function (k) { inp.dispatchEvent(new Event(k, { bubbles: true })); }); ev('hotel_pick'); }
    function mark(i) { $$('li', ul).forEach(function (li, k) { li.setAttribute('aria-selected', k === i ? 'true' : 'false'); }); cur = i;
      if (i >= 0) { inp.setAttribute('aria-activedescendant', ul.id + '-' + i); ul.children[i].scrollIntoView({ block: 'nearest' }); } }
    function show() {
      var q = normH(inp.value).trim();
      if (q.length < 2) { close(); return; }
      var words = q.split(' ');
      items = HOTELS.filter(function (h) { var n = normH(h[0] + ' ' + h[1]); return words.every(function (w) { return n.indexOf(' ' + w) >= 0; }); }).slice(0, 7);
      if (!items.length || (items.length === 1 && normH(items[0][0]) === normH(inp.value))) { close(); return; }
      ul.innerHTML = '';
      items.forEach(function (h, i) {
        var li = document.createElement('li'), b = document.createElement('b'), s = document.createElement('span');
        li.id = ul.id + '-' + i; li.setAttribute('role', 'option'); li.setAttribute('aria-selected', 'false');
        b.textContent = h[0];
        s.textContent = h[1] + (isl && ZONE85.test(normH(h[0])) ? (L === 'es' ? ' · $85 por adulto, mín. 4 personas' : ' · $85 per adult, min. 4 people') : '');
        li.appendChild(b); li.appendChild(s);
        // pointerdown + preventDefault: the tap is not lost when the field loses focus
        li.addEventListener('pointerdown', function (e) { e.preventDefault(); choose(h); });
        li.addEventListener('click', function (e) { e.preventDefault(); if (!ul.hidden) choose(h); });
        ul.appendChild(li);
      });
      var was = ul.hidden; ul.style.top = (inp.offsetTop + inp.offsetHeight) + 'px';
      ul.hidden = false; cur = -1; inp.setAttribute('aria-expanded', 'true');
      if (was) try { ul.scrollIntoView({ block: 'nearest' }); } catch (e) {}
    }
    inp.addEventListener('input', function (e) { if (e.isTrusted) show(); });
    inp.addEventListener('focus', show);
    inp.addEventListener('blur', function () { setTimeout(close, 150); });
    inp.addEventListener('keydown', function (e) {
      if (ul.hidden) return;
      if (e.key === 'ArrowDown') { e.preventDefault(); mark(Math.min(items.length - 1, cur + 1)); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); mark(Math.max(0, cur - 1)); }
      else if (e.key === 'Enter' && cur >= 0) { e.preventDefault(); choose(items[cur]); }
      else if (e.key === 'Escape') { e.stopPropagation(); close(); }
    });
  }
  $$('input[name=hotel], input[name=near]').forEach(hotelAC);
  $$('input[name=email]').forEach(function (i) { i.setAttribute('inputmode', 'email'); i.setAttribute('autocapitalize', 'off'); i.setAttribute('spellcheck', 'false'); });

  // booking in two steps (sidebar and phone sheet): 1) date + people → "Check availability"  2) availability confirmed, pickup + contact + pay
  function twoStep(fm) {
    var L = fm.dataset.lang === 'es' ? 'es' : 'en', T = S[L];
    var dIn = $('[name=date]', fm), payB = $('button.pay', fm);
    var s1 = [$('.fld.dp', fm), $('.row2', fm), $('.bk-veh', fm)].filter(Boolean);
    var s2 = [$('.pk-shift', fm), $('.pk-sel', fm), $('[name=name]', fm) && $('[name=name]', fm).closest('.fld'), $('[name=whatsapp]', fm) && $('[name=whatsapp]', fm).closest('.row2'), $('[name=email]', fm) && $('[name=email]', fm).closest('.row2, .fld'), $('.hint', fm), payB].filter(Boolean);
    if (!(dIn && payB && s1.length >= 2 && s2.length >= 4)) return;
    var nxt = document.createElement('button'); nxt.type = 'button'; nxt.className = 'btn btn-sea btn-block btn-lg bk-next';
    var sum = document.createElement('div'); sum.className = 'bk-sum ok'; sum.hidden = true;
    var sumT = document.createElement('b'), sumS = document.createElement('span'), sumE = document.createElement('button');
    sumT.className = 'bk-ok'; sumE.type = 'button'; sumE.className = 'bk-edit'; sumE.textContent = T.change;
    sum.appendChild(sumT); sum.appendChild(sumS); sum.appendChild(sumE);
    var note = document.createElement('p'); note.className = 'bk-step'; note.textContent = T.step1;
    var anc = s1[0].parentNode.classList.contains('row2') ? s1[0].parentNode : s1[0];
    anc.parentNode.insertBefore(note, anc);
    anc.parentNode.insertBefore(sum, anc);
    payB.parentNode.insertBefore(nxt, payB);
    var amount = function () { var m = (payB.textContent || '').match(/\$[\d,.]+/); return m ? m[0] : ''; };
    // total explained under the button, so "$150" never reads as the price per person
    var brk = document.createElement('p'); brk.className = 'bk-brk'; nxt.parentNode.insertBefore(brk, nxt.nextSibling);
    var label = function () {
      nxt.textContent = T.avail;
      var t = amount(), a = $('[name=adults]', fm), c = $('[name=children]', fm);
      if (!t || !a) { brk.textContent = ''; return; }
      if ($('.bk-veh', fm)) { brk.textContent = T.brk_veh.replace('{t}', t); return; }
      var na = +a.value || 1, nc = c ? (+c.value || 0) : 0;
      var p = na + (na === 1 ? T.adult : T.adults) + (nc > 0 ? ' + ' + nc + (nc === 1 ? T.child : T.children) : ' × $' + (fm.dataset.adult || '75'));
      brk.textContent = T.brk.replace('{p}', p).replace('{t}', t);
    };
    var showStep = function (step) {
      s1.forEach(function (el) { el.hidden = step === 2; });
      s2.forEach(function (el) { el.hidden = step === 1; });
      nxt.hidden = step === 2; brk.hidden = step === 2; sum.hidden = step === 1;
      fm.classList.toggle('st2', step === 2);
      if (fm._syncSun) fm._syncSun();
      note.textContent = step === 1 ? T.step1 : T.step2;
      if (step === 1) label();
    };
    nxt.addEventListener('click', function () {
      var msgE = $('.msg', fm);
      if (!(dIn.value && dIn.value >= tomorrow())) {
        var b = $('.dp-btn', fm); if (b) { b.setAttribute('aria-invalid', 'true'); setTimeout(function () { b.click(); }, 0); }
        if (msgE) { msgE.textContent = T.pick_date; msgE.hidden = false; }
        return;
      }
      var vb2 = fm._vehBad && fm._vehBad(); if (vb2) { if (msgE) { msgE.textContent = vb2; msgE.hidden = false; } return; }
      if (msgE) msgE.hidden = true;
      var dv = $('.dp-v', fm), a = $('[name=adults]', fm), c = $('[name=children]', fm);
      var ppl = $('.bk-veh', fm) ? a.value + (L === 'es' ? (a.value === '1' ? ' persona' : ' personas') : (a.value === '1' ? ' person' : ' people')) : a.value + (a.value === '1' ? T.adult : T.adults) + (c && +c.value > 0 ? ', ' + c.value + T.kids : '');
      sumT.textContent = T.avail_ok.replace('{d}', dv ? dv.textContent : dIn.value);
      sumS.textContent = ppl + ' · ' + amount();
      showStep(2); ev('book_step2');
      var h = $('[name=hotel]', fm); if (h && !h.closest('[hidden]')) h.focus({ preventScroll: true });
    });
    sumE.addEventListener('click', function () { showStep(1); });
    $$('.sb, input', fm).forEach(function (el) { el.addEventListener('click', function () { setTimeout(label, 0); }); el.addEventListener('change', function () { setTimeout(label, 0); }); });
    new MutationObserver(label).observe(payB, { childList: true, characterData: true, subtree: true });
    showStep(1);
  }
  $$('form.bk[data-mode="pay"]').forEach(twoStep);

  // "save this tour": one email, no payment → Make (Leads sheet + email with pickup time + alert)
  var leadDone = false;
  try { leadDone = localStorage.getItem('epc_lead') === '1'; } catch (err) {}
  function setupLead(f) {
    var L = f.dataset.lang === 'es' ? 'es' : 'en', T = S[L];
    var em = $('[name=email]', f), btn = $('button[type=submit]', f), msg = $('.msg', f), ok = $('.lead-ok', f), hp = $('[name=website]', f);
    var hotel = $('[name=hotel]', f), when = $('[name=when]', f);
    if (!em || !btn) return;
    em.setAttribute('inputmode', 'email'); em.setAttribute('autocapitalize', 'off'); em.setAttribute('spellcheck', 'false');
    var once = false;
    f.addEventListener('focusin', function () { if (!once) { once = true; ev('lead_start'); } });
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var v = em.value.trim();
      if (!(em.checkValidity() && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v))) { em.setAttribute('aria-invalid', 'true'); if (msg) { msg.textContent = T.lead_email; msg.hidden = false; } em.focus(); return; }
      em.setAttribute('aria-invalid', 'false'); if (msg) msg.hidden = true;
      var q = ''; try { var u = new URLSearchParams(window.location.search); q = (u.get('gad_campaignid') ? 'ads ' + u.get('gad_campaignid') : (u.get('utm_source') || document.referrer || 'direct')); } catch (err) {}
      var body = new URLSearchParams({
        email: v, hotel: hotel ? hotel.value.trim() : '', when: when ? when.value.trim() : '',
        tour: f.dataset.tour || 'Saona Island', slug: f.dataset.slug || 'saona-island', lang: L,
        pickup_time: hotel ? pickupTime(f.dataset.slug || 'saona-island', hotel.value, 0) : '',
        source: ('web ' + q).slice(0, 120), website: hp ? hp.value : ''
      });
      var old = btn.textContent; btn.disabled = true; btn.textContent = '…';
      var ctl = window.AbortController ? new AbortController() : null, timer = setTimeout(function () { if (ctl) ctl.abort(); }, 20000);
      fetch(LEAD_HOOK, { method: 'POST', body: body, signal: ctl ? ctl.signal : undefined, credentials: 'omit', referrerPolicy: 'strict-origin' })
        .then(function (r) { if (!r.ok) throw new Error('bad'); return r.text(); })
        .then(function () {
          clearTimeout(timer); ev('lead_submit'); leadDone = true;
          try { localStorage.setItem('epc_lead', '1'); } catch (err) {}
          $$('.lead-r, .save-r, .hp, button[type=submit], .lead-fine', f).forEach(function (el) { el.hidden = true; });
          if (ok) { ok.textContent = T.lead_ok; ok.hidden = false; }
          var bar = f.closest('.save'); if (bar) setTimeout(function () { bar.remove(); }, 6000);
        })
        .catch(function () { clearTimeout(timer); btn.disabled = false; btn.textContent = old; if (msg) { msg.textContent = T.lead_err; msg.hidden = false; } ev('lead_error'); });
    });
    $$('input', f).forEach(function (i) { i.addEventListener('input', function () { if (i.getAttribute('aria-invalid') === 'true') i.setAttribute('aria-invalid', 'false'); }); });
  }
  $$('form.lead').forEach(setupLead);

  // slide-up "save this tour" after 45 s or 55% scroll, once per visit, never after a lead or while a sheet is open
  var leadIn = $('#lead-in');
  if (leadIn && !leadDone) {
    var shown = false, dismissed = false;
    try { dismissed = sessionStorage.getItem('epc_save') === '1'; } catch (err) {}
    var L2 = leadIn.dataset.lang === 'es' ? 'es' : 'en', T2 = S[L2];
    var showSave = function () {
      if (shown || dismissed || leadDone) return;
      if (document.body.classList.contains('lock')) { setTimeout(showSave, 4000); return; }
      shown = true;
      var bar = document.createElement('div'); bar.className = 'save'; bar.setAttribute('role', 'dialog'); bar.setAttribute('aria-label', T2.save_t);
      bar.innerHTML = '<button type="button" class="x" aria-label="' + T2.close + '">×</button><b></b><p></p>' +
        '<form class="lead" novalidate><div class="save-r"><input name="email" type="email" maxlength="80" required autocomplete="email" placeholder="you@email.com" aria-label="Email"><button class="btn btn-sea" type="submit"></button></div>' +
        '<div class="hp" aria-hidden="true"><label>Website<input name="website" tabindex="-1" autocomplete="off"></label></div><p class="msg" role="alert" hidden></p><p class="lead-ok" role="status" hidden></p></form>';
      $('b', bar).textContent = T2.save_t; $('p', bar).textContent = T2.save_p; $('button[type=submit]', bar).textContent = T2.save_b;
      if (L2 === 'es') $('input[name=email]', bar).placeholder = 'tu@correo.com';
      var lf = $('form.lead', bar); lf.dataset.lang = L2; lf.dataset.tour = leadIn.dataset.tour; lf.dataset.slug = leadIn.dataset.slug;
      document.body.appendChild(bar); setupLead(lf); ev('save_bar_shown');
      $('.x', bar).addEventListener('click', function () { bar.remove(); dismissed = true; try { sessionStorage.setItem('epc_save', '1'); } catch (err) {} ev('save_bar_closed'); });
    };
    // phones: no timer, only after real scroll (on a small screen the bar covered the page while people were still reading)
    if (window.innerWidth >= 760) setTimeout(showSave, 45000);
    var onScroll = function () {
      var h = document.documentElement, pct = (h.scrollTop + window.innerHeight) / Math.max(1, h.scrollHeight);
      if (pct > 0.55) { window.removeEventListener('scroll', onScroll); setTimeout(showSave, 1500); }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // photo viewer: tapping a gallery photo opens it large (was a dead click)
  var gimgs = $$('.gal img, picture.m1 img, picture.m2 img, picture.m3 img');
  if (gimgs.length) {
    var es2 = (document.documentElement.lang || 'en').indexOf('es') === 0;
    var lb = document.createElement('div'); lb.className = 'lb'; lb.hidden = true;
    lb.setAttribute('role', 'dialog'); lb.setAttribute('aria-modal', 'true'); lb.setAttribute('aria-label', es2 ? 'Foto' : 'Photo');
    lb.innerHTML = '<button type="button" class="lb-x" aria-label="' + (es2 ? 'Cerrar' : 'Close') + '">×</button><button type="button" class="lb-p" aria-label="' + (es2 ? 'Anterior' : 'Previous') + '">‹</button><img alt=""><button type="button" class="lb-n" aria-label="' + (es2 ? 'Siguiente' : 'Next') + '">›</button><p class="lb-cap"><span class="lb-num"></span><span class="lb-txt"></span></p>' +
      (document.getElementById('bk-side') ? '<a class="btn btn-sea lb-cta" href="#bk-side">' + (es2 ? 'Elige tu fecha · $' : 'Pick a date · $') + (document.getElementById('bk-side').dataset.adult || '75') + (es2 ? ' por adulto' : ' per adult') + '</a>' : '');
    document.body.appendChild(lb);
    var lbImg = $('img', lb), cur = 0, sx = null;
    var srcOf = function (im) { var so = im.parentNode && im.parentNode.querySelector ? im.parentNode.querySelector('source[srcset]') : null; if (so) { var c = so.getAttribute('srcset').split(',').map(function (x) { return x.trim().split(' ')[0]; }); if (c.length) return c[c.length - 1]; } return im.currentSrc || im.src; };
    var lbNum = $('.lb-num', lb), lbTxt = $('.lb-txt', lb);
    var show = function (i) { cur = (i + gimgs.length) % gimgs.length; lbImg.src = srcOf(gimgs[cur]); lbImg.alt = gimgs[cur].alt || ''; if (lbNum) lbNum.textContent = (cur + 1) + ' / ' + gimgs.length; if (lbTxt) lbTxt.textContent = gimgs[cur].alt || ''; };
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
