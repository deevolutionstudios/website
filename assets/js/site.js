// Shared behaviour for every page: fade-up on scroll, the mobile menu, the Our Work filters and the contact form.
(function () {
  // Fade up as sections scroll into view (the CSS only hides .fu once this class is set, so pages work without JS).
  document.documentElement.classList.add('js');
  var fus = document.querySelectorAll('.fu');
  if ('IntersectionObserver' in window) {
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e, i) {
        if (e.isIntersecting) { setTimeout(function () { e.target.classList.add('vis'); }, i * 90); obs.unobserve(e.target); }
      });
    }, { threshold: 0.08 });
    fus.forEach(function (el) { obs.observe(el); });
  } else {
    fus.forEach(function (el) { el.classList.add('vis'); });
  }

  // Mobile menu
  var btn = document.getElementById('hamburger');
  var menu = document.getElementById('mobileMenu');
  if (btn && menu) {
    var set = function (open) {
      btn.classList.toggle('open', open); menu.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    };
    btn.addEventListener('click', function () { set(!menu.classList.contains('open')); });
    menu.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { set(false); }); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') set(false); });
  }

  // Our Work filters
  var filters = document.querySelectorAll('.filter-btn');
  filters.forEach(function (f) {
    f.addEventListener('click', function () {
      filters.forEach(function (b) { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });
      f.classList.add('active'); f.setAttribute('aria-pressed', 'true');
      var want = f.dataset.filter;
      document.querySelectorAll('[data-type]').forEach(function (card) {
        var show = want === 'all' || card.dataset.type.split(' ').indexOf(want) >= 0;
        card.style.display = show ? '' : 'none';
        if (show) card.classList.add('vis');
      });
    });
  });

  // Contact and tester forms (Formspree): send without leaving the page, keep the normal post as the no-JS fallback.
  [['contactForm', 'formSuccess'], ['testerForm', 'testerSuccess']].forEach(function (ids) {
  var form = document.getElementById(ids[0]);
  var done = document.getElementById(ids[1]);
  if (form && done) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var b = form.querySelector('.form-submit');
      var data = new FormData(form); // includes the "What do you need?" pick (its radios use form="contactForm")
      b.textContent = 'Sending…'; b.disabled = true;
      fetch(form.action, { method: 'POST', body: data, headers: { Accept: 'application/json' } })
        .then(function (r) {
          if (!r.ok) throw new Error(r.status);
          form.style.display = 'none'; done.classList.add('show'); done.focus();
        })
        .catch(function () { b.textContent = 'Something went wrong. Try again'; b.disabled = false; });
    });
  }
  });
})();
