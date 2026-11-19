/* Checklist sign-up (Netlify Forms). Posts in the background and shows the
   link to the printable checklist; without JS the form posts normally and
   Netlify sends the visitor to the checklist page. */
(function () {
  document.querySelectorAll('form[name="checklist"]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      if (!window.fetch || !window.URLSearchParams) return;
      e.preventDefault();
      var status = form.parentNode.querySelector('.checklist-signup-status');
      if (!status) {
        status = document.createElement('div');
        status.className = 'checklist-signup-status';
        status.setAttribute('role', 'status');
        status.setAttribute('aria-live', 'polite');
        form.parentNode.insertBefore(status, form.nextSibling);
      }
      var btn = form.querySelector('button[type="submit"]');
      if (btn) btn.disabled = true;
      fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(new FormData(form)).toString()
      }).then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        form.hidden = true;
        status.innerHTML = 'Thank you. Your checklist is ready: <a href="/funeral-planning-checklist-printable.html">open the printable funeral planning checklist</a>.';
      }).catch(function () {
        if (btn) btn.disabled = false;
        status.textContent = 'Sorry, the sign-up did not go through. Please try again, or open the printable checklist directly.';
      });
    });
  });
})();
