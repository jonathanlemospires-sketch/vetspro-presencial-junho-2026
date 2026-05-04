/* Landing Presencial Junho 2026 (v1 verde) — vanilla JS */
(function () {
  'use strict';

  // ====== CONFIG ======
  // URL do Apps Script Web App (preencha após deploy do apps-script/Code.gs — ver SETUP.md)
  var WEB_APP_URL = 'https://script.google.com/macros/s/REPLACE_ME/exec';
  // Para onde o lead é redirecionado após enviar o form
  var REDIRECT_URL = 'https://gruposvip.com/redirect/627/curso-presencial-vetspro-27-e-28-de-junho';

  // ====== FACEBOOK PIXEL — InitiateCheckout no submit ======
  function trackInitiateCheckout() {
    try { if (typeof fbq === 'function') fbq('track', 'InitiateCheckout'); } catch (_) {}
  }

  // ====== FORM SUBMIT ======
  var form = document.getElementById('enroll-form');
  if (form) {
    var btn = document.getElementById('form-submit');
    var btnLabel = btn && btn.querySelector('.btn-label');

    function setLoading(loading) {
      if (!btn) return;
      btn.disabled = loading;
      if (btnLabel) btnLabel.textContent = loading ? 'Enviando…' : 'Garantir minha vaga — Lote 1';
    }
    function onlyDigits(v) { return (v || '').toString().replace(/\D/g, ''); }

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var nome = (form.elements['nome'].value || '').trim();
      var ddd = onlyDigits(form.elements['ddd'].value);
      var whatsapp = onlyDigits(form.elements['whatsapp'].value);

      if (!nome || nome.length < 2) {
        form.elements['nome'].focus();
        form.elements['nome'].setCustomValidity('Por favor, informe seu nome.');
        form.elements['nome'].reportValidity();
        return;
      }
      if (!ddd || ddd.length < 2) {
        form.elements['ddd'].focus();
        form.elements['ddd'].setCustomValidity('DDD inválido.');
        form.elements['ddd'].reportValidity();
        return;
      }
      if (!whatsapp || whatsapp.length < 8) {
        form.elements['whatsapp'].focus();
        form.elements['whatsapp'].setCustomValidity('Número inválido.');
        form.elements['whatsapp'].reportValidity();
        return;
      }
      ['nome','ddd','whatsapp'].forEach(function (n) { form.elements[n].setCustomValidity(''); });

      setLoading(true);
      trackInitiateCheckout();

      var params = new URLSearchParams();
      params.append('nome', nome);
      params.append('ddd', ddd);
      params.append('whatsapp', whatsapp);
      params.append('source', 'landing-v1-verde');

      function redirect() { window.location.href = REDIRECT_URL; }

      try {
        var promise = fetch(WEB_APP_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
          body: params.toString()
        });
        var redirected = false;
        var fallback = setTimeout(function () { if (!redirected) { redirected = true; redirect(); } }, 1500);
        promise.finally(function () {
          if (!redirected) { redirected = true; clearTimeout(fallback); redirect(); }
        });
      } catch (err) {
        redirect();
      }
    });

    ['nome','ddd','whatsapp'].forEach(function (n) {
      var el = form.elements[n];
      if (el) el.addEventListener('input', function () { el.setCustomValidity(''); });
    });
  }
})();
