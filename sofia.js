/* Sofia en la web: chat propio conectado a Sofía 2.0 (sofia-bot en Render, misma Sofía que WhatsApp) + aviso proactivo.
   El aviso sale como mucho una vez por sesión (pestaña) y nunca si el visitante ya abrió el chat en esta sesión.
   En el móvil: burbuja corta junto al botón tras 8 s y algo de scroll (no tapa la página, se oculta sola a los 25 s).
   Además sale en estos momentos:
   1) el visitante vuelve de WhatsApp sin quedarse allá,
   2) lleva 40 s en el formulario de reserva sin pulsar Continuar / Reservar,
   3) intención de salida (ratón hacia arriba en PC, subida rápida en el móvil).
   El mensaje del visitante va prellenado con lo que ya eligió (tour, fecha, personas, hotel); él decide si lo envía. */
(function () {
  'use strict';
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
  var t = T[L] || T.en, locale = T[L] ? L : 'en';
  var desk = function () { return window.matchMedia('(min-width:980px)').matches; };
  var get = function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } };
  var set = function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} };
  var sget = function (k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } };
  var sset = function (k, v) { try { sessionStorage.setItem(k, v); } catch (e) {} };
  function ev(name) { try { if (typeof window.clarity === 'function') window.clarity('event', name); } catch (e) {} }

  // ---------- chat propio conectado a Sofía 2.0 (antes: SDK de BuilderBot) ----------
  var API = 'https://sofia-bot-0s0d.onrender.com';
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
  var UI = {
    es: { ph: 'Escribe tu mensaje…', typing: 'Sofia está escribiendo…', err: 'No se pudo enviar. Revisa tu conexión e inténtalo otra vez.', pay: 'Pagar ahora', link: 'Abrir enlace', wait: 'Un momento, por favor: estás enviando muchos mensajes.' },
    en: { ph: 'Type your message…', typing: 'Sofia is typing…', err: 'Could not send. Check your connection and try again.', pay: 'Pay now', link: 'Open link', wait: 'One moment please: too many messages.' },
    fr: { ph: 'Écrivez votre message…', typing: 'Sofia écrit…', err: 'Envoi impossible. Vérifiez votre connexion et réessayez.', pay: 'Payer', link: 'Ouvrir le lien', wait: 'Un instant, s’il vous plaît.' },
    pt: { ph: 'Escreva sua mensagem…', typing: 'Sofia está digitando…', err: 'Não foi possível enviar. Verifique sua conexão e tente de novo.', pay: 'Pagar agora', link: 'Abrir link', wait: 'Um momento, por favor.' },
    de: { ph: 'Nachricht schreiben…', typing: 'Sofia schreibt…', err: 'Senden fehlgeschlagen. Bitte Verbindung prüfen und erneut versuchen.', pay: 'Jetzt bezahlen', link: 'Link öffnen', wait: 'Einen Moment bitte.' },
    it: { ph: 'Scrivi il tuo messaggio…', typing: 'Sofia sta scrivendo…', err: 'Invio non riuscito. Controlla la connessione e riprova.', pay: 'Paga ora', link: 'Apri link', wait: 'Un momento, per favore.' },
    pl: { ph: 'Napisz wiadomość…', typing: 'Sofia pisze…', err: 'Nie udało się wysłać. Sprawdź połączenie i spróbuj ponownie.', pay: 'Zapłać teraz', link: 'Otwórz link', wait: 'Chwileczkę, proszę.' }
  };
  var u = UI[locale] || UI.en;
  var sid = get('sf_sid');
  if (!sid || !/^[a-z0-9]{16,40}$/.test(sid)) {
    sid = ''; var ab = 'abcdefghijklmnopqrstuvwxyz0123456789';
    for (var si = 0; si < 24; si++) sid += ab[Math.floor(Math.random() * 36)];
    set('sf_sid', sid);
  }
  var lastId = 0, seenIds = {}, panel = null, list, ta, sendB, qr, typing, bd, busy = false, isOpen = false, pollT = 0, nUser = 0;
  var mob = function () { return window.matchMedia('(max-width:768px)').matches; };
  function el(tag, cls, txt) { var e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; }
  var toEnd = function () { if (list) list.scrollTop = list.scrollHeight; };
  // texto con links: el de Stripe sale como botón "Pagar"; el resto como link normal (nada de HTML del servidor)
  function render(text, box) {
    var re = /https?:\/\/[^\s<>"']+/g, s = String(text || ''), i = 0, m;
    while ((m = re.exec(s))) {
      var url = m[0].replace(/[).,;:!?]+$/, '');
      if (m.index > i) box.appendChild(document.createTextNode(s.slice(i, m.index)));
      var stripe = /^https:\/\/(checkout|buy)\.stripe\.com\//.test(url);
      var a = el('a', stripe ? 'sf-pay' : 'sf-lnk', stripe ? u.pay : (/wa\.me|maps|goo\.gl/.test(url) ? u.link : url));
      a.href = url; a.target = '_blank'; a.rel = 'noopener';
      if (stripe) a.addEventListener('click', function () { ev('sofia_link_pago'); });
      box.appendChild(a);
      i = m.index + url.length; re.lastIndex = i;
    }
    if (i < s.length) box.appendChild(document.createTextNode(s.slice(i)));
  }
  function addMsg(m) {
    if (!m || seenIds[m.id]) return; seenIds[m.id] = 1; lastId = Math.max(lastId, m.id || 0);
    var txt = String(m.content || '');
    if (!txt.trim() || /^\[(imagen|image|audio|nota de voz)/i.test(txt)) return;
    var mine = m.role === 'user'; if (mine) nUser++;
    // "[botones: A | B | C]" (los botones de WhatsApp) salen como opciones que se tocan y se envían
    var opts = []; txt = txt.replace(/\n?\[(?:botones|buttons|lista|list)[^:\]]*:\s*([^\]]+)\]/gi, function (_, x) { opts = opts.concat(x.split('|').map(function (o) { return o.trim(); }).filter(Boolean)); return ''; }).trim();
    var b = el('div', 'sf-m ' + (mine ? 'sf-u' : 'sf-a')); render(txt, b);
    list.insertBefore(b, typing);
    if (!mine && opts.length) {
      var ob = el('div', 'sf-opts');
      opts.slice(0, 10).forEach(function (o) { var x = el('button', '', o); x.type = 'button'; x.addEventListener('click', function () { ob.remove(); send(o); ev('sofia_boton'); }); ob.appendChild(x); });
      list.insertBefore(ob, typing);
    } qr.hidden = nUser >= 2; toEnd();
    if (!mine && !isOpen) fab.classList.add('sf-unread');
  }
  function api(path, opt) {
    return fetch(API + path, Object.assign({ credentials: 'omit', referrerPolicy: 'strict-origin', cache: 'no-store' }, opt || {}))
      .then(function (r) { return r.json().then(function (j) { j.__s = r.status; return j; }); });
  }
  function poll() {
    clearTimeout(pollT);
    if (!panel || document.visibilityState === 'hidden') { pollT = setTimeout(poll, 8000); return; }
    api('/chat/poll?sid=' + sid + '&after=' + lastId).then(function (j) { (j.messages || []).forEach(addMsg); })
      .catch(function () {}).then(function () { pollT = setTimeout(poll, isOpen ? 3000 : 15000); });
  }
  function send(text) {
    text = String(text || '').trim(); if (!text || busy) return;
    busy = true; sendB.disabled = true; typing.hidden = false; toEnd();
    var tmp = el('div', 'sf-m sf-u'); render(text, tmp); list.insertBefore(tmp, typing); nUser++; qr.hidden = nUser >= 2; toEnd();
    ta.value = ''; autoH();
    api('/chat/send', { method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sid: sid, text: text.slice(0, 1000), page: location.pathname, lang: locale, after: lastId }) })
      .then(function (j) {
        if (j.__s === 429) { list.insertBefore(el('div', 'sf-m sf-a sf-err', u.wait), typing); return; }
        if (j.__s !== 200) throw new Error('http ' + j.__s);
        tmp.remove(); nUser--; (j.messages || []).forEach(addMsg);
      })
      .catch(function () { tmp.classList.add('sf-fail'); list.insertBefore(el('div', 'sf-m sf-a sf-err', u.err), typing); if (!ta.value) ta.value = text; })
      .then(function () { busy = false; sendB.disabled = false; typing.hidden = true; toEnd(); ev('sofia_msg'); });
  }
  function autoH() { ta.style.height = 'auto'; ta.style.height = Math.min(ta.scrollHeight, 120) + 'px'; }
  function loadSdk(cb) {
    if (panel) return cb && cb();
    panel = el('div', 'sf-chat'); panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-label', t.open); panel.hidden = true;
    var hd = el('div', 'sf-ch-h'), av = el('span', 'sf-av', 'S'), nm = el('span', 'sf-ch-n'), x = el('button', 'sf-ch-x', '×');
    av.setAttribute('aria-hidden', 'true'); nm.appendChild(el('b', '', 'Sofia')); nm.appendChild(el('small', '', t.status));
    x.type = 'button'; x.setAttribute('aria-label', t.close); x.addEventListener('click', closeChat);
    hd.appendChild(av); hd.appendChild(nm); hd.appendChild(x);
    list = el('div', 'sf-ch-l'); list.appendChild(el('div', 'sf-m sf-a', t.mhi));
    typing = el('div', 'sf-ch-t', u.typing); typing.hidden = true; list.appendChild(typing);
    qr = el('div', 'sf-qr');
    (QR[locale] || QR.en).forEach(function (q) { var b = el('button', '', q); b.type = 'button'; b.addEventListener('click', function () { send(q); ev('sofia_rapida'); }); qr.appendChild(b); });
    var f = el('form', 'sf-ch-f'); ta = el('textarea'); ta.rows = 1; ta.maxLength = 1000; ta.placeholder = u.ph; ta.setAttribute('aria-label', u.ph);
    sendB = el('button', 'sf-ch-s', '➤'); sendB.type = 'submit'; sendB.setAttribute('aria-label', 'Enviar');
    f.appendChild(ta); f.appendChild(sendB);
    f.addEventListener('submit', function (e) { e.preventDefault(); send(ta.value); });
    ta.addEventListener('keydown', function (e) { if (e.key === 'Enter' && !e.shiftKey && desk()) { e.preventDefault(); send(ta.value); } });
    ta.addEventListener('input', autoH);
    panel.appendChild(hd); panel.appendChild(list); panel.appendChild(qr); panel.appendChild(f);
    document.body.appendChild(panel);
    // móvil: la página sigue visible arriba; tocarla cierra el chat
    bd = el('button', 'sf-bd'); bd.type = 'button'; bd.hidden = true; bd.appendChild(el('span', '', '✕ ' + (BACK[locale] || BACK.en)));
    bd.addEventListener('click', closeChat); document.body.appendChild(bd);
    // iPhone/Android: con el teclado abierto el chat ocupa lo visible encima del teclado
    var vv = window.visualViewport;
    if (vv) {
      var kb = function () {
        var on = isOpen && mob() && window.innerHeight - vv.height > 120;
        if (on) { panel.style.top = Math.round(vv.offsetTop) + 'px'; panel.style.height = Math.round(vv.height) + 'px'; panel.classList.add('sf-kbon'); setTimeout(toEnd, 60); }
        else if (panel.classList.contains('sf-kbon')) { panel.classList.remove('sf-kbon'); panel.style.top = ''; panel.style.height = ''; }
      };
      vv.addEventListener('resize', kb); vv.addEventListener('scroll', kb);
      ta.addEventListener('focus', function () { setTimeout(kb, 350); setTimeout(toEnd, 400); });
      ta.addEventListener('blur', function () { setTimeout(kb, 350); });
    }
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && isOpen) closeChat(); });
    document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'visible') poll(); });
    // historial de esta persona (si ya habló antes en este navegador)
    api('/chat/poll?sid=' + sid + '&after=0').then(function (j) { (j.messages || []).forEach(addMsg); }).catch(function () {}).then(function () { poll(); });
    if (cb) cb();
  }
  function closeChat() {
    if (!panel) return; isOpen = false; panel.hidden = true; bd.hidden = true;
    document.body.classList.remove('sf-chat-on'); panel.classList.remove('sf-kbon'); panel.style.top = ''; panel.style.height = '';
    try { ta.blur(); } catch (e) {}
  }
  // el chat ya abierto antes por esta persona: se carga el historial en segundo plano para avisar si Sofia contestó
  if (get('sf_open')) setTimeout(function () { loadSdk(); }, 3000);
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
      isOpen = true; panel.hidden = false; bd.hidden = !mob(); document.body.classList.toggle('sf-chat-on', mob());
      var pf = prefill();
      if (!ta.value && pf) { ta.value = pf; autoH(); }
      toEnd(); poll();
      // en el móvil no abrimos el teclado solos: primero se ve la conversación, el cliente toca para escribir
      if (desk()) { try { ta.focus({ preventScroll: true }); } catch (e) {} }
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
  var why0 = '', bkTouched = false;
  var tzHide = 0;
  function hideTeaser() { clearTimeout(tzHide); tz.hidden = true; document.body.classList.remove('sf-tz-on'); fabVis(); }
  // una vez por sesión: sessionStorage (se borra al cerrar la pestaña)
  function canNudge() {
    if (opened || !tz.hidden) return false;
    return !sget('sf_tz_s') && !sget('sf_open_s');
  }
  function nudge(why) {
    if (!canNudge()) return;
    // no interrumpir a quien ya está llenando la reserva (Clarity 17-nov: el aviso salía a mitad del paso 2)
    if (bkTouched && why !== 'form' && why !== 'back') return;
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
    if (e.target && e.target.closest && e.target.closest('form.bk, form.hf, #bk-modal')) bkTouched = true;
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

  // 6) móvil: burbuja corta tras 30 s (antes 8 s: salía al 67% de las visitas, Clarity 17-nov) en la página y algo de scroll (cualquier página con el chat)
  var mT = Date.now(), mDone = false;
  var mScroll = function () {
    if (mDone || why0 || desk()) return;
    var h = document.documentElement, y = window.scrollY || h.scrollTop, room = h.scrollHeight - window.innerHeight;
    if (Date.now() - mT > 30000 && (y > 500 || (room > 0 && y / room > 0.3) || room < 300)) { mDone = true; window.removeEventListener('scroll', mScroll); nudge('hi'); }
  };
  window.addEventListener('scroll', mScroll, { passive: true }); setTimeout(mScroll, 30200);

  // aviso inicial suave para visitas de anuncios (después de 25 s sin otra señal)
  if (/[?&](gclid|gbraid|wbraid|gad_source)=/.test(location.search)) setTimeout(function () { if (!why0) nudge('hi'); }, 25000);
})();
