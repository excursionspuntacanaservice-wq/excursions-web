/* Sofia en la web: chat de BuilderBot (segunda Sofia, solo web) + aviso proactivo.
   El aviso sale como mucho una vez por sesión (pestaña) y nunca si el visitante ya abrió el chat en esta sesión.
   En el móvil: burbuja corta junto al botón tras 8 s y algo de scroll (no tapa la página, se oculta sola a los 25 s).
   Además sale en estos momentos:
   1) el visitante vuelve de WhatsApp sin quedarse allá,
   2) lleva 40 s en el formulario de reserva sin pulsar Continuar / Reservar,
   3) intención de salida (ratón hacia arriba en PC, subida rápida en el móvil).
   El mensaje del visitante va prellenado con lo que ya eligió (tour, fecha, personas, hotel); él decide si lo envía. */
(function () {
  'use strict';
  var BOT = 'a7ad56cd-39c2-4dcb-a924-0c09e82aa09d', SDK = 'https://cdn.builderbot.cloud/sdk.umd.js';
  var L = (document.documentElement.lang || 'en').slice(0, 2).toLowerCase();
  var T = {
    es: {
      mhi: '¡Hola! Soy Sofia 👋 ¿Te digo el precio exacto y la hora de recogida en tu hotel?',
      ret: '¡Hola de nuevo! ¿Seguimos con tu reserva de {t}{w}? Te mando el link de pago aquí mismo, con cancelación gratis hasta 24 h antes.', cta2: 'Seguir mi reserva', w: ' para el {d}', wa: ' ({a} adultos)',
      any: 'tu excursión', status: 'En línea · responde en segundos', open: 'Chatear con Sofia', close: 'Cerrar', cta: 'Chatear aquí', fab: 'Chat',
      hi: 'Hola, soy Sofia de Excursions Punta Cana. ¿Te ayudo a reservar? Te digo el precio exacto y la hora de recogida en tu hotel aquí mismo.',
      back: '¿Pudiste escribirnos por WhatsApp? Si prefieres, te atiendo aquí mismo y te mando el link de pago sin salir de la página.',
      form: '¿Alguna duda antes de pagar? Te confirmo precio, hora de recogida y cancelación aquí mismo.',
      exit: 'Antes de irte: te reservo {t} en 2 minutos aquí mismo, con cancelación gratis hasta 24 h antes.',
      pre: 'Hola Sofia, quiero reservar {t}', d: ' para el {d}', p: ', {a} adultos', c: ' y {c} niños', h: '. Hotel: {h}', q: 'Hola Sofia, tengo una pregunta sobre {t}'
    },
    en: {
      mhi: "Hi! I'm Sofia 👋 Want the exact price and pickup time at your hotel?",
      ret: 'Welcome back! Shall we continue booking {t}{w}? I can send your payment link right here, with free cancellation up to 24 h before.', cta2: 'Continue my booking', w: ' on {d}', wa: ' ({a} adults)',
      any: 'your tour', status: 'Online · replies in seconds', open: 'Chat with Sofia', close: 'Close', cta: 'Chat here', fab: 'Chat',
      hi: 'Hi, I’m Sofia from Excursions Punta Cana. Can I help you book? I can tell you the exact price and your hotel pickup time right here.',
      back: 'Did you manage to message us on WhatsApp? If you prefer, I can help you right here and send your payment link without leaving the page.',
      form: 'Any questions before you pay? I can confirm the price, pickup time and cancellation right here.',
      exit: 'Before you go: I can book {t} for you in 2 minutes right here, with free cancellation up to 24 h before.',
      pre: 'Hi Sofia, I’d like to book {t}', d: ' on {d}', p: ', {a} adults', c: ' and {c} children', h: '. Hotel: {h}', q: 'Hi Sofia, I have a question about {t}'
    },
    fr: {
      mhi: 'Bonjour ! Je suis Sofia 👋 Le prix exact et l’heure de prise en charge à votre hôtel ?',
      ret: 'Bon retour ! On continue la réservation de {t}{w} ? Je vous envoie le lien de paiement ici même, avec annulation gratuite jusqu’à 24 h avant.', cta2: 'Continuer ma réservation', w: ' pour le {d}', wa: ' ({a} adultes)',
      any: 'votre excursion', status: 'En ligne · répond en quelques secondes', open: 'Discuter avec Sofia', close: 'Fermer', cta: 'Discuter ici', fab: 'Chat',
      hi: 'Bonjour, je suis Sofia d’Excursions Punta Cana. Je vous aide à réserver ? Je vous donne le prix exact et l’heure de prise en charge à votre hôtel, ici même.',
      back: 'Avez-vous pu nous écrire sur WhatsApp ? Si vous préférez, je m’occupe de vous ici et je vous envoie le lien de paiement sans quitter la page.',
      form: 'Une question avant de payer ? Je vous confirme le prix, l’heure de prise en charge et l’annulation ici même.',
      exit: 'Avant de partir : je vous réserve {t} en 2 minutes ici même, avec annulation gratuite jusqu’à 24 h avant.',
      pre: 'Bonjour Sofia, je voudrais réserver {t}', d: ' pour le {d}', p: ', {a} adultes', c: ' et {c} enfants', h: '. Hôtel : {h}', q: 'Bonjour Sofia, j’ai une question sur {t}'
    },
    pt: {
      mhi: 'Olá! Sou a Sofia 👋 Quer o preço exato e o horário de busca no seu hotel?',
      ret: 'Que bom te ver de novo! Seguimos com a reserva de {t}{w}? Envio o link de pagamento aqui mesmo, com cancelamento grátis até 24 h antes.', cta2: 'Continuar minha reserva', w: ' para {d}', wa: ' ({a} adultos)',
      any: 'seu passeio', status: 'Online · responde em segundos', open: 'Conversar com a Sofia', close: 'Fechar', cta: 'Conversar aqui', fab: 'Chat',
      hi: 'Olá, sou a Sofia da Excursions Punta Cana. Posso ajudar com a reserva? Digo o preço exato e o horário de busca no seu hotel aqui mesmo.',
      back: 'Conseguiu nos escrever no WhatsApp? Se preferir, atendo você aqui mesmo e envio o link de pagamento sem sair da página.',
      form: 'Alguma dúvida antes de pagar? Confirmo o preço, o horário de busca e o cancelamento aqui mesmo.',
      exit: 'Antes de sair: reservo {t} para você em 2 minutos aqui mesmo, com cancelamento grátis até 24 h antes.',
      pre: 'Olá Sofia, quero reservar {t}', d: ' para {d}', p: ', {a} adultos', c: ' e {c} crianças', h: '. Hotel: {h}', q: 'Olá Sofia, tenho uma pergunta sobre {t}'
    },
    de: {
      mhi: 'Hallo! Ich bin Sofia 👋 Genauer Preis und Abholzeit an Ihrem Hotel?',
      ret: 'Willkommen zurück! Sollen wir die Buchung von {t}{w} fortsetzen? Ich schicke Ihnen den Zahlungslink direkt hier, mit kostenloser Stornierung bis 24 h vorher.', cta2: 'Buchung fortsetzen', w: ' am {d}', wa: ' ({a} Erwachsene)',
      any: 'Ihren Ausflug', status: 'Online · antwortet in Sekunden', open: 'Mit Sofia chatten', close: 'Schließen', cta: 'Hier chatten', fab: 'Chat',
      hi: 'Hallo, ich bin Sofia von Excursions Punta Cana. Darf ich bei der Buchung helfen? Ich nenne Ihnen den genauen Preis und die Abholzeit an Ihrem Hotel direkt hier.',
      back: 'Konnten Sie uns auf WhatsApp schreiben? Wenn Sie möchten, helfe ich Ihnen direkt hier und schicke den Zahlungslink, ohne die Seite zu verlassen.',
      form: 'Noch Fragen vor dem Bezahlen? Ich bestätige Preis, Abholzeit und Stornierung direkt hier.',
      exit: 'Bevor Sie gehen: Ich buche {t} für Sie in 2 Minuten direkt hier, mit kostenloser Stornierung bis 24 h vorher.',
      pre: 'Hallo Sofia, ich möchte {t} buchen', d: ' am {d}', p: ', {a} Erwachsene', c: ' und {c} Kinder', h: '. Hotel: {h}', q: 'Hallo Sofia, ich habe eine Frage zu {t}'
    },
    it: {
      mhi: 'Ciao! Sono Sofia 👋 Vuoi il prezzo esatto e l’orario di prelievo in hotel?',
      ret: 'Bentornato! Continuiamo la prenotazione di {t}{w}? Ti mando il link di pagamento qui stesso, con cancellazione gratuita fino a 24 h prima.', cta2: 'Continua la prenotazione', w: ' per il {d}', wa: ' ({a} adulti)',
      any: 'la tua escursione', status: 'Online · risponde in pochi secondi', open: 'Chatta con Sofia', close: 'Chiudi', cta: 'Chatta qui', fab: 'Chat',
      hi: 'Ciao, sono Sofia di Excursions Punta Cana. Ti aiuto a prenotare? Ti dico il prezzo esatto e l’orario di prelievo al tuo hotel qui stesso.',
      back: 'Sei riuscito a scriverci su WhatsApp? Se preferisci, ti seguo qui e ti mando il link di pagamento senza lasciare la pagina.',
      form: 'Qualche dubbio prima di pagare? Ti confermo prezzo, orario di prelievo e cancellazione qui stesso.',
      exit: 'Prima di andare: ti prenoto {t} in 2 minuti qui stesso, con cancellazione gratuita fino a 24 h prima.',
      pre: 'Ciao Sofia, vorrei prenotare {t}', d: ' per il {d}', p: ', {a} adulti', c: ' e {c} bambini', h: '. Hotel: {h}', q: 'Ciao Sofia, ho una domanda su {t}'
    },
    pl: {
      mhi: 'Cześć! Jestem Sofia 👋 Podać dokładną cenę i godzinę odbioru z hotelu?',
      ret: 'Witaj ponownie! Kontynuujemy rezerwację {t}{w}? Wyślę link do płatności tutaj, z darmowym anulowaniem do 24 h przed.', cta2: 'Kontynuuj rezerwację', w: ' na {d}', wa: ' ({a} dorosłych)',
      any: 'Twoją wycieczkę', status: 'Online · odpowiada w kilka sekund', open: 'Czat z Sofią', close: 'Zamknij', cta: 'Czatuj tutaj', fab: 'Chat',
      hi: 'Cześć, jestem Sofia z Excursions Punta Cana. Pomóc w rezerwacji? Podam dokładną cenę i godzinę odbioru z Twojego hotelu tutaj.',
      back: 'Udało się napisać do nas na WhatsApp? Jeśli wolisz, obsłużę Cię tutaj i wyślę link do płatności bez opuszczania strony.',
      form: 'Masz pytanie przed płatnością? Potwierdzę cenę, godzinę odbioru i zasady anulowania tutaj.',
      exit: 'Zanim wyjdziesz: zarezerwuję {t} w 2 minuty tutaj, z darmowym anulowaniem do 24 h przed.',
      pre: 'Cześć Sofia, chcę zarezerwować {t}', d: ' na {d}', p: ', {a} dorosłych', c: ' i {c} dzieci', h: '. Hotel: {h}', q: 'Cześć Sofia, mam pytanie o {t}'
    }
  };
  var t = T[L] || T.en, locale = T[L] ? L : 'en', sdkLoc = locale === 'es' ? 'es' : 'en';
  var desk = function () { return window.matchMedia('(min-width:980px)').matches; };
  var get = function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } };
  var set = function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} };
  var sget = function (k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } };
  var sset = function (k, v) { try { sessionStorage.setItem(k, v); } catch (e) {} };
  function ev(name) { try { if (typeof window.clarity === 'function') window.clarity('event', name); } catch (e) {} }

  // ---------- SDK (se carga solo cuando hace falta) ----------
  var sdkState = 0, sdkWait = [];
  function loadSdk(cb) {
    if (sdkState === 2) return cb();
    sdkWait.push(cb); if (sdkState === 1) return; sdkState = 1;
    var s = document.createElement('script'); s.src = SDK; s.async = true;
    s.setAttribute('data-builderbot-chat', ''); s.setAttribute('data-id', BOT);
    s.setAttribute('data-company', 'Sofia · Excursions Punta Cana'); s.setAttribute('data-avatar-initials', 'S');
    s.setAttribute('data-locale', sdkLoc);
    document.body.appendChild(s);
    var tries = 0, iv = setInterval(function () {
      var b = document.querySelector('chat-widget-button button'), c = document.querySelector('chat-widget-container');
      if ((b && c && c.shadowRoot) || ++tries > 60) {
        clearInterval(iv); sdkState = b ? 2 : 0;
        var w = sdkWait; sdkWait = []; if (b) { try { enhance(); } catch (e) {} w.forEach(function (f) { f(); }); }
      }
    }, 250);
  }
  // ---------- chat cómodo: hoja flotante en el móvil, respuestas rápidas, teclado del iPhone ----------
  var QR = {
    es: ['¿Cuánto cuesta?', '¿A qué hora me recogen?', 'Quiero reservar', '¿Puedo cancelar?'],
    en: ['How much is it?', 'What time is pickup?', 'I want to book', 'Can I cancel?'],
    fr: ['Combien ça coûte ?', 'À quelle heure est la prise en charge ?', 'Je veux réserver', 'Puis-je annuler ?'],
    pt: ['Quanto custa?', 'A que horas me buscam?', 'Quero reservar', 'Posso cancelar?'],
    de: ['Was kostet es?', 'Wann ist die Abholung?', 'Ich möchte buchen', 'Kann ich stornieren?'],
    it: ['Quanto costa?', 'A che ora è il prelievo?', 'Voglio prenotare', 'Posso cancellare?'],
    pl: ['Ile to kosztuje?', 'O której jest odbiór?', 'Chcę zarezerwować', 'Czy mogę anulować?']
  };
  var BACK = { es: 'Volver a la página', en: 'Back to the page', fr: 'Retour à la page', pt: 'Voltar à página', de: 'Zurück zur Seite', it: 'Torna alla pagina', pl: 'Wróć do strony' };
  var enhanced = false;
  function enhance() {
    var host = document.querySelector('chat-widget-container'), r = host && host.shadowRoot;
    var box = r && r.querySelector('.chat-widget-container');
    if (!box || enhanced) return; enhanced = true;
    var st = document.createElement('style');
    st.textContent =
      // tema claro con los colores de la web (el SDK se ponía oscuro en teléfonos con modo oscuro)
      ':host,.chat-widget-container,.dark-mode{--chat-primary-color:#0B2233!important;--chat-secondary-color:#566974!important;--chat-text-color:#0B2233!important;' +
      '--chat-text-secondary-color:#566974!important;--chat-background:#FFFFFF!important;--chat-background-chat:#F6F1E9!important;--chat-white:#FFFFFF!important;' +
      '--chat-user-message-bg:#0B2233!important;--chat-user-message-text:#FFFFFF!important;--chat-agent-message-bg:#FFFFFF!important;--chat-agent-message-text:#0B2233!important;' +
      '--chat-border-color:#E7E1D7!important;--chat-hover-color:#F3EEE6!important;--chat-accent-color:#CF4A24!important;--chat-time-color:#8A99A3!important;--chat-icon-color:#566974!important;' +
      '--chat-send-button:#CF4A24!important;--chat-send-button-hover:#B23D1B!important;--chat-input-background:#FFFFFF!important;--chat-input-placeholder:#8A99A3!important;' +
      '--chat-light-gray:#F3EEE6!important;--chat-lighter-gray:#FBF9F5!important}' +
      '.selector-btn{display:none!important}' +
      '@media (max-width:768px){.chat-widget-container,.chat-widget-container.expanded{top:auto!important;left:0!important;right:0!important;' +
      'bottom:0!important;width:100vw!important;max-width:100vw!important;height:76dvh!important;max-height:76dvh!important;' +
      'border-radius:18px 18px 0 0!important;box-sizing:border-box!important}.resize-button{display:none!important}' +
      // teclado abierto: el chat ocupa justo lo que se ve encima del teclado, como WhatsApp
      '.chat-widget-container.sf-kbon,.chat-widget-container.expanded.sf-kbon{top:var(--sf-top,0px)!important;bottom:auto!important;height:var(--sf-h,60dvh)!important;max-height:var(--sf-h,60dvh)!important;border-radius:0!important}' +
      // 16 px: el iPhone no hace zoom al tocar el campo de texto (con 14 px agrandaba todo y cortaba los lados)
      'textarea{font-size:16px!important;line-height:1.35!important}.chat-messages{overscroll-behavior:contain}' +
      // solo el botón de cerrar en la cabecera: la papelera abre un diálogo del sistema que congela la página en el iPhone
      '.chat-header button:not(.back-button){display:none!important}}' +
      '.sf-hi{align-self:flex-start;max-width:85%;margin:12px 12px 4px;padding:10px 13px;border-radius:4px 16px 16px 16px;background:#fff;border:1px solid #E7E1D7;' +
      'color:#0B2233;font-size:15px;line-height:1.45;white-space:pre-line;box-shadow:0 1px 2px rgba(11,34,51,.06)}' +
      '@media (min-width:769px){.chat-widget-container:not(.expanded){height:min(620px,calc(100dvh - 120px))!important;max-height:min(620px,calc(100dvh - 120px))!important}}' +
      '.sf-qr{flex:none;display:flex;gap:8px;overflow-x:auto;padding:8px 12px 4px;scrollbar-width:none;-webkit-overflow-scrolling:touch}.sf-qr::-webkit-scrollbar{display:none}' +
      '.sf-qr[hidden]{display:none}.sf-qr button{flex:none;border:1px solid #E7E1D7;background:#fff;color:#0B2233;border-radius:999px;' +
      'padding:9px 13px;font-family:inherit;font-size:14px;font-weight:600;line-height:1;cursor:pointer;white-space:nowrap}.sf-qr button:active{transform:scale(.97)}';
    r.appendChild(st);

    // respuestas rápidas: un toque y se envían, como en cualquier app de mensajería
    var qr = document.createElement('div'); qr.className = 'sf-qr';
    (QR[locale] || QR.en).forEach(function (q) {
      var b = document.createElement('button'); b.type = 'button'; b.textContent = q;
      b.addEventListener('click', function () {
        var ta = r.querySelector('textarea'), send = r.querySelector('.send-button');
        if (!ta || !send) return;
        ta.value = q; ta.dispatchEvent(new Event('input', { bubbles: true }));
        setTimeout(function () { send.click(); ev('sofia_rapida'); }, 30);
      });
      qr.appendChild(b);
    });
    var inp = r.querySelector('chat-input'); if (inp) box.insertBefore(qr, inp);
    // saludo fijo arriba: el chat nunca se ve vacío al abrirlo
    var msgs0 = r.querySelector('.chat-messages');
    if (msgs0) { var hi = document.createElement('div'); hi.className = 'sf-hi'; hi.textContent = t.mhi; msgs0.insertBefore(hi, msgs0.firstChild); }
    var qrSync = function () { qr.hidden = r.querySelectorAll('.message-wrapper.user').length >= 2; };
    var msgs = r.querySelector('.messages-container') || r.querySelector('.chat-messages');
    var toEnd = function () { var m = r.querySelector('.chat-messages'); if (m) m.scrollTop = m.scrollHeight; };
    if (msgs) new MutationObserver(function () { qrSync(); toEnd(); }).observe(msgs, { childList: true, subtree: true });
    qrSync();

    // móvil: la página sigue visible arriba; tocarla cierra el chat y vuelves donde estabas
    var bd = document.createElement('button'); bd.type = 'button'; bd.className = 'sf-bd'; bd.hidden = true;
    bd.innerHTML = '<span>✕ </span>'; bd.querySelector('span').textContent = '✕ ' + (BACK[locale] || BACK.en);
    bd.addEventListener('click', function () { var b = r.querySelector('.back-button'); if (b) b.click(); });
    document.body.appendChild(bd);
    var mob = function () { return window.matchMedia('(max-width:768px)').matches; };
    var sync = function () { var on = box.classList.contains('visible'); bd.hidden = !(on && mob()); document.body.classList.toggle('sf-chat-on', on && mob()); };
    new MutationObserver(sync).observe(box, { attributes: true, attributeFilter: ['class'] });
    sync();

    // iPhone: con el teclado abierto, la hoja sube y el campo de texto queda a la vista
    var vv = window.visualViewport;
    if (vv) {
      // el chat se ajusta a lo que queda visible encima del teclado (iPhone y Android) y baja al último mensaje
      var kb = function () {
        var on = mob() && box.classList.contains('visible') && window.innerHeight - vv.height > 120;
        if (on) {
          host.style.setProperty('--sf-top', Math.round(vv.offsetTop) + 'px'); host.style.setProperty('--sf-h', Math.round(vv.height) + 'px');
          if (!box.classList.contains('sf-kbon')) { box.classList.add('sf-kbon'); setTimeout(toEnd, 60); }
        } else if (box.classList.contains('sf-kbon')) { box.classList.remove('sf-kbon'); host.style.removeProperty('--sf-top'); host.style.removeProperty('--sf-h'); }
        document.body.classList.toggle('sf-kb-on', on);
      };
      vv.addEventListener('resize', kb); vv.addEventListener('scroll', kb);
      r.addEventListener('focusin', function () { setTimeout(kb, 350); setTimeout(toEnd, 400); });
      r.addEventListener('focusout', function () { setTimeout(kb, 350); });
    }
  }
  function form() {
    var f = document.querySelector('#bk-modal:not([hidden]) form.bk') || document.querySelector('form.bk.st2') || document.getElementById('bk-side') || document.querySelector('form.bk, form.hf');
    return f;
  }
  // ---------- memoria: lo que el visitante eligió (tour, fecha, personas, hotel) queda en su navegador 30 días ----------
  function trip() {
    var x = null; try { x = JSON.parse(get('sf_trip') || 'null'); } catch (e) {}
    if (!x || Date.now() - x.t > 30 * 864e5) return null;
    if (x.date && x.date < new Date().toISOString().slice(0, 10)) return null; // fecha ya pasó
    var paid = +get('sf_paid') || 0; if (paid && paid > x.t) return null;   // ya pagó después de elegir
    return x;
  }
  var saveT = 0;
  function saveTrip(f) {
    clearTimeout(saveT);
    saveT = setTimeout(function () {
      if (!f) return;
      var v = function (n) { var x = f.querySelector('[name=' + n + ']'); return x && x.value ? String(x.value).trim().slice(0, 80) : ''; };
      var slug = f.dataset.slug || '', old = null; try { old = JSON.parse(get('sf_trip') || 'null'); } catch (e) {}
      if (!old || old.slug !== slug) old = {};
      var x = { tour: String(f.dataset.tourL || f.dataset.tour || old.tour || '').trim().slice(0, 60), slug: slug, page: location.pathname,
        date: v('date') || old.date || '', adults: v('adults') || old.adults || '', children: v('children') || old.children || '', hotel: v('hotel') || old.hotel || '', t: Date.now() };
      if (!x.date && !x.hotel) return;
      set('sf_trip', JSON.stringify(x));
    }, 600);
  }
  ['change', 'input', 'click'].forEach(function (n) {
    document.addEventListener(n, function (e) {
      var c = e.target && e.target.closest ? (e.target.closest('form.bk') || e.target.closest('.qk') || e.target.closest('form.hf')) : null;
      if (c) saveTrip(c);
    }, true);
  });
  function fmtD(d) { if (!d) return ''; var p = d.split('-'); return locale === 'en' ? p[1] + '/' + p[2] : p[2] + '/' + p[1]; }

  function prefill() {
    var f = form(), tour = (f && (f.dataset.tourL || f.dataset.tour)) || (document.querySelector('h1') || {}).textContent || '';
    tour = String(tour).trim();
    var v = function (n) { var x = f ? f.querySelector('[name=' + n + ']') : null; return x && x.value ? String(x.value).trim() : ''; };
    var d = v('date'), a = v('adults'), c = v('children'), h = v('hotel'), tr = trip();
    if (!d && !h && tr && (!f || !f.dataset.slug || f.dataset.slug === tr.slug)) { d = tr.date || ''; a = tr.adults || ''; c = tr.children || ''; h = tr.hotel || ''; tour = tr.tour || tour; }
    if (!d && !h) return desk() ? t.q.replace('{t}', tour) : '';   // en el móvil no dejamos texto que el cliente tenga que borrar
    if (d) { var p = d.split('-'); d = locale === 'en' ? p[1] + '/' + p[2] + '/' + p[0] : p[2] + '/' + p[1] + '/' + p[0]; }
    return t.pre.replace('{t}', tour) + (d ? t.d.replace('{d}', d) : '') + (a ? t.p.replace('{a}', a) : '') +
      (+c > 0 ? t.c.replace('{c}', c) : '') + (h ? t.h.replace('{h}', h.slice(0, 80)) : '');
  }
  // Registro del origen (anuncio/gclid, ChatGPT, etc.) de cada chat abierto, en la misma hoja que los clics a WhatsApp.
  // La compra la mide Google en thanks.html (success_url de Stripe); esto es para nosotros. Sin datos personales.
  var LOG = 'https://hook.us2.make.com/a4pf96xny4cxg2m2m6v6s9omc4b42fu6', logged = false;
  function fuente() {
    var s = null, g = null;
    try { s = JSON.parse(get('epc_src') || 'null'); } catch (e) {}
    try { g = JSON.parse(get('epc_gclid') || 'null'); } catch (e) {}
    if (g && Date.now() - g.t > 90 * 864e5) g = null;
    return ((s && s.s) || 'directo > ' + location.pathname).slice(0, 200) + (g && g.g ? ' | ' + g.k + ':' + g.g : '');
  }
  function logOpen(why) {
    if (logged) return; logged = true;
    try {
      var f = form(), v = function (n) { var x = f ? f.querySelector('[name=' + n + ']') : null; return x && x.value ? String(x.value) : ''; };
      var body = new URLSearchParams({
        fuente: fuente(), pagina: location.pathname, idioma: document.documentElement.lang || '',
        tour: f && f.dataset.tour ? f.dataset.tour : '', fecha: v('date'), adultos: v('adults'), ninos: v('children'),
        boton: 'chat web Sofia (' + why + ')', dispositivo: desk() ? 'pc' : 'movil'
      });
      if (window.fetch) fetch(LOG, { method: 'POST', body: body, keepalive: true, credentials: 'omit', referrerPolicy: 'strict-origin' }).catch(function () {});
    } catch (e) {}
  }
  var opened = false;
  function openChat(why) {
    hideTeaser(); fab.classList.remove('sf-unread'); opened = true; set('sf_open', String(Date.now())); sset('sf_open_s', '1');
    ev('sofia_chat_' + why); logOpen(why);
    loadSdk(function () {
      var wb = document.querySelector('chat-widget-button'), c = document.querySelector('chat-widget-container');
      // el botón propio del SDK queda oculto: se abre con nuestro botón y se cierra con el "—" del panel
      if (wb && !wb.hasAttribute('is-open')) wb.querySelector('button').click();
      setTimeout(function () {
        var ta2 = c && c.shadowRoot ? c.shadowRoot.querySelector('textarea') : null;
        if (!ta2) return;
        var pf = prefill();
        if (!ta2.value && pf) { ta2.value = pf; ta2.dispatchEvent(new Event('input', { bubbles: true })); }
        // en el móvil no abrimos el teclado solos: primero se ve la conversación, el cliente toca para escribir
        if (desk()) { try { ta2.focus({ preventScroll: true }); } catch (e) {} }
      }, 400);
    });
  }

  // ---------- botón fijo + aviso ----------
  var fab = document.createElement('button');
  fab.type = 'button'; fab.className = 'sf-fab'; fab.setAttribute('aria-label', t.open);
  fab.innerHTML = '<span class="sf-av" aria-hidden="true">S</span><span class="sf-fab-t"></span><i class="sf-dot" aria-hidden="true"></i><b class="sf-badge" aria-hidden="true">1</b>';
  fab.querySelector('.sf-fab-t').textContent = t.fab;
  fab.addEventListener('click', function () { openChat('boton'); });
  fab.addEventListener('pointerenter', function () { loadSdk(function () {}); }, { once: true });

  var tz = document.createElement('div');
  tz.className = 'sf-tz'; tz.setAttribute('role', 'dialog'); tz.setAttribute('aria-live', 'polite'); tz.hidden = true;
  tz.innerHTML = '<button type="button" class="sf-x"></button><div class="sf-hd"><span class="sf-av" aria-hidden="true">S</span><span><b>Sofia</b><small></small></span></div><p class="sf-msg"></p><button type="button" class="btn btn-sea sf-go"></button>';
  var x = tz.querySelector('.sf-x'); x.setAttribute('aria-label', t.close); x.textContent = '×';
  tz.querySelector('small').textContent = t.status; tz.querySelector('.sf-go').textContent = t.cta;
  tz.setAttribute('aria-label', t.open);
  x.addEventListener('click', function (e) { e.stopPropagation(); hideTeaser(); ev('sofia_aviso_cerrado'); });
  tz.querySelector('.sf-go').addEventListener('click', function () { openChat(tz.dataset.why || 'aviso'); });
  tz.addEventListener('click', function (e) { if (tz.classList.contains('sf-mini') && !e.target.closest('.sf-go')) openChat(tz.dataset.why || 'aviso'); });

  document.body.appendChild(tz); document.body.appendChild(fab);
  // en el móvil el botón aparece al bajar, para no tapar el botón Reservar de la primera pantalla
  function fabVis() { fab.classList.toggle('sf-wait', !desk() && window.scrollY < 500 && tz.hidden); }
  fabVis(); window.addEventListener('scroll', fabVis, { passive: true }); window.addEventListener('resize', fabVis);
  var why0 = '';
  var tzHide = 0;
  function hideTeaser() { clearTimeout(tzHide); tz.hidden = true; document.body.classList.remove('sf-tz-on'); fabVis(); }
  // una vez por sesión: sessionStorage (se borra al cerrar la pestaña)
  function canNudge() {
    if (opened || !tz.hidden) return false;
    return !sget('sf_tz_s') && !sget('sf_open_s');
  }
  function nudge(why) {
    if (!canNudge()) return;
    if (document.querySelector('.save') || document.body.classList.contains('lock')) { setTimeout(function () { nudge(why); }, 8000); return; }
    why0 = why; tz.dataset.why = why;
    var f = form(), tn = f && (f.dataset.tourL || f.dataset.tour) ? String(f.dataset.tourL || f.dataset.tour).trim() : t.any;
    var mob1 = !desk(), msg = (mob1 && why === 'hi' ? t.mhi : (t[why] || t.hi)).replace('{t}', tn);
    if (why === 'ret') { var tr = trip() || {}; msg = t.ret.replace('{t}', tr.tour || tn).replace('{w}', (tr.date ? t.w.replace('{d}', fmtD(tr.date)) : '') + (+tr.adults > 0 ? t.wa.replace('{a}', tr.adults) : '')); }
    tz.querySelector('.sf-msg').textContent = msg;
    tz.querySelector('.sf-go').textContent = why === 'ret' ? t.cta2 : t.cta;
    var modal = document.getElementById('bk-modal');
    tz.classList.toggle('sf-top', mob1 && !!modal && !modal.hidden);
    tz.classList.toggle('sf-mini', mob1);
    tz.hidden = false; document.body.classList.add('sf-tz-on'); fab.classList.add('sf-unread'); fabVis();
    sset('sf_tz_s', String(Date.now())); set('sf_tz', String(Date.now())); ev('sofia_aviso_' + why);
    clearTimeout(tzHide); if (mob1) tzHide = setTimeout(hideTeaser, 25000);
    loadSdk(function () {});
  }

  // 1) vuelve de WhatsApp sin quedarse allá
  document.addEventListener('click', function (e) {
    var a = e.target && e.target.closest ? e.target.closest('a[href*="wa.me/"]') : null;
    if (a) { set('sf_wa', String(Date.now())); }
  }, true);
  function waBack() {
    var w = +get('sf_wa') || 0, dt = Date.now() - w;
    if (w && dt > 4000 && dt < 30 * 60 * 1000) { set('sf_wa', ''); setTimeout(function () { nudge('back'); }, 1200); }
  }
  document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'visible') waBack(); });
  window.addEventListener('pageshow', waBack);

  // 2) 40 s en el formulario sin pulsar Continuar / Reservar
  var fTimer = 0, fDone = false;
  function fStart(e) {
    if (fDone || fTimer) return;
    if (!(e.target && e.target.closest && e.target.closest('form.bk, form.hf, #bk-modal'))) return;
    fTimer = setTimeout(function () { if (!fDone) nudge('form'); }, 40000);
  }
  ['click', 'input', 'change', 'focusin'].forEach(function (n) { document.addEventListener(n, fStart, true); });
  document.addEventListener('click', function (e) {
    if (e.target && e.target.closest && e.target.closest('.qk-go, .bk-next, button.pay, button[type=submit]')) { fDone = true; clearTimeout(fTimer); }
  }, true);
  document.addEventListener('submit', function () { fDone = true; clearTimeout(fTimer); }, true);

  // 3) intención de salida
  var t0 = Date.now();
  document.addEventListener('mouseout', function (e) {
    if (!desk() || e.relatedTarget || e.clientY > 8 || Date.now() - t0 < 8000) return;
    nudge('exit');
  });
  var lastY = window.scrollY, lastT = Date.now(), maxY = 0;
  window.addEventListener('scroll', function () {
    var y = window.scrollY, now = Date.now(); maxY = Math.max(maxY, y);
    if (!desk() && now - t0 > 20000 && maxY > document.body.scrollHeight * 0.35 && lastY - y > 700 && now - lastT < 500) nudge('exit');
    if (now - lastT > 300) { lastY = y; lastT = now; }
  }, { passive: true });

  // 4) vuelve otro día con una reserva a medias: se la recordamos con sus datos (máx. 1 aviso cada 24 h)
  var tr0 = trip(), visitNew = !get('sf_seen') || Date.now() - (+get('sf_seen')) > 30 * 60 * 1000;
  set('sf_seen', String(Date.now())); setInterval(function () { set('sf_seen', String(Date.now())); }, 60000);
  if (tr0 && visitNew && Date.now() - tr0.t > 30 * 60 * 1000) setTimeout(function () { if (!why0) nudge('ret'); }, 6000);

  // 5) visitante frío que lee con interés (30 s y 40 % de la página) en una página con reserva
  if (form()) {
    var engT = Date.now(), engDone = false;
    var eng = function () {
      if (engDone || why0) return;
      var h = document.documentElement, pct = (h.scrollTop + window.innerHeight) / Math.max(1, h.scrollHeight);
      if (Date.now() - engT > 30000 && pct > 0.4) { engDone = true; window.removeEventListener('scroll', eng); nudge('hi'); }
    };
    window.addEventListener('scroll', eng, { passive: true }); setTimeout(eng, 31000);
  }

  // 6) móvil: burbuja corta tras 8 s en la página y algo de scroll (cualquier página con el chat)
  var mT = Date.now(), mDone = false;
  var mScroll = function () {
    if (mDone || why0 || desk()) return;
    var h = document.documentElement, y = window.scrollY || h.scrollTop, room = h.scrollHeight - window.innerHeight;
    if (Date.now() - mT > 8000 && (y > 500 || (room > 0 && y / room > 0.3) || room < 300)) { mDone = true; window.removeEventListener('scroll', mScroll); nudge('hi'); }
  };
  window.addEventListener('scroll', mScroll, { passive: true }); setTimeout(mScroll, 8200);

  // aviso inicial suave para visitas de anuncios (después de 25 s sin otra señal)
  if (/[?&](gclid|gbraid|wbraid|gad_source)=/.test(location.search)) setTimeout(function () { if (!why0) nudge('hi'); }, 25000);
})();
