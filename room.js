/* Página "Agrega tu número de habitación": el cliente pone su habitación con la referencia de la reserva (viene en el correo del ticket). */
(function () {
  'use strict';
  var HOOK = 'https://hook.us2.make.com/nidjiu061xqkuiydfrjofw16rmn1d6g4';
  var f = document.querySelector('form.rm-f'); if (!f) return;
  var es = (document.documentElement.lang || 'en').slice(0, 2) === 'es';
  var T = es ? {
    need: 'Escribe tu número de habitación.', ref: 'Escribe la referencia de tu reserva (empieza con EPC-).', wait: 'Guardando…',
    ok: function (d) { return '¡Listo! Guardamos la habitación ' + d.hab + ' para ' + d.tour + ' el ' + d.fecha + '. Te recogemos en la entrada o lobby de ' + d.hotel + (d.hora && d.hora.indexOf(':') > 0 ? ' a las ' + d.hora : '') + '. Gracias.'; },
    bad: 'No encontramos una reserva pagada con esa referencia. Revisa el correo del ticket o escríbenos a info@excursionspuntacana.net o por WhatsApp.',
    net: 'No se pudo guardar por la conexión. Inténtalo otra vez en un momento.'
  } : {
    need: 'Please enter your room number.', ref: 'Please enter your booking reference (it starts with EPC-).', wait: 'Saving…',
    ok: function (d) { return 'All set! We saved room ' + d.hab + ' for ' + d.tour + ' on ' + d.fecha + '. We pick you up at the entrance or lobby of ' + d.hotel + (d.hora && d.hora.indexOf(':') > 0 ? ' at ' + d.hora : '') + '. Thank you.'; },
    bad: 'We could not find a paid booking with that reference. Check your ticket email or write to info@excursionspuntacana.net or on WhatsApp.',
    net: 'It could not be saved because of the connection. Please try again in a moment.'
  };
  var q = new URLSearchParams(location.search);
  var ref = f.querySelector('[name=ref]'), hab = f.querySelector('[name=hab]'), btn = f.querySelector('button'), msg = f.querySelector('.rm-msg');
  var r0 = (q.get('ref') || '').replace(/[^A-Za-z0-9-]/g, '').slice(0, 40);
  if (r0) { ref.value = r0; f.querySelector('.rm-ref').hidden = true; }
  var h0 = (q.get('hab') || '').replace(/[^0-9A-Za-z -]/g, '').slice(0, 20); if (h0) hab.value = h0;
  function say(t, good) { msg.textContent = t; msg.hidden = false; msg.className = 'rm-msg ' + (good ? 'rm-ok' : 'rm-err'); }
  f.addEventListener('submit', function (e) {
    e.preventDefault();
    var h = hab.value.replace(/[^0-9A-Za-z -]/g, '').trim().slice(0, 20), r = ref.value.replace(/[^A-Za-z0-9-]/g, '').trim();
    if (!r) { f.querySelector('.rm-ref').hidden = false; ref.focus(); return say(T.ref); }
    if (!h) { hab.focus(); return say(T.need); }
    btn.disabled = true; var lbl = btn.textContent; btn.textContent = T.wait;
    fetch(HOOK, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: 'ref=' + encodeURIComponent(r) + '&hab=' + encodeURIComponent(h) + '&lang=' + (es ? 'es' : 'en') })
      .then(function (res) { return res.text(); })
      .then(function (t) {
        var d = null; try { d = JSON.parse(t); } catch (err) {}
        if (d && d.ok) { say(T.ok(d), true); f.querySelector('.rm-fields').hidden = true; try { if (window.clarity) window.clarity('event', 'habitacion_ok'); } catch (err) {} }
        else say(T.bad);
      })
      .catch(function () { say(T.net); })
      .then(function () { btn.disabled = false; btn.textContent = lbl; });
  });
})();
(function () { var l = document.querySelector('a.lang'); if (l && location.search) l.href = l.href.split('?')[0] + location.search; })();
