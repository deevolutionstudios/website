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

  // Screenshots & Art: tap a picture to see it full screen, then go left and right (arrows, keys or swipe).
  document.querySelectorAll('.shots').forEach(function (strip) {
    var imgs = [].slice.call(strip.querySelectorAll('img'));
    if (!imgs.length) return;
    var box, pic, count, at = 0, opener = null;
    var show = function (i) {
      at = (i + imgs.length) % imgs.length;
      pic.src = imgs[at].dataset.full || imgs[at].currentSrc || imgs[at].src; // the sharper copy when there is one
      count.textContent = (at + 1) + ' / ' + imgs.length;
    };
    var close = function () {
      box.classList.remove('open'); document.documentElement.classList.remove('viewer-on');
      if (opener && opener.focus) opener.focus();
    };
    var build = function () {
      box = document.createElement('div');
      box.className = 'viewer' + (imgs.length < 2 ? ' single' : '');
      box.setAttribute('role', 'dialog'); box.setAttribute('aria-modal', 'true'); box.setAttribute('aria-label', 'Screenshots & Art');
      box.innerHTML = '<button class="viewer-close" type="button" aria-label="Close">&times;</button>' +
        '<button class="viewer-prev" type="button" aria-label="Previous picture">&#8249;</button>' +
        '<img class="viewer-img" alt="">' +
        '<button class="viewer-next" type="button" aria-label="Next picture">&#8250;</button>' +
        '<div class="viewer-count" aria-live="polite"></div>';
      document.body.appendChild(box);
      pic = box.querySelector('.viewer-img'); count = box.querySelector('.viewer-count');
      box.querySelector('.viewer-close').addEventListener('click', close);
      box.querySelector('.viewer-prev').addEventListener('click', function () { show(at - 1); });
      box.querySelector('.viewer-next').addEventListener('click', function () { show(at + 1); });
      box.addEventListener('click', function (e) { if (e.target === box) close(); }); // tap the dark backdrop to close
      var x0 = null;
      box.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
      box.addEventListener('touchend', function (e) {
        if (x0 === null) return;
        var dx = e.changedTouches[0].clientX - x0; x0 = null;
        if (Math.abs(dx) > 40) show(at + (dx < 0 ? 1 : -1));
      });
      box.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') close();
        else if (e.key === 'ArrowLeft') show(at - 1);
        else if (e.key === 'ArrowRight') show(at + 1);
        else if (e.key === 'Tab') { // keep focus inside the viewer
          var b = box.querySelectorAll('button'), first = b[0], last = b[b.length - 1];
          if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
          else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
        }
      });
    };
    var open = function (i) {
      if (!box) build();
      opener = document.activeElement; show(i);
      box.classList.add('open'); document.documentElement.classList.add('viewer-on');
      box.querySelector('.viewer-close').focus();
    };
    imgs.forEach(function (img, i) {
      img.tabIndex = 0; img.setAttribute('role', 'button');
      img.setAttribute('aria-label', 'Open picture ' + (i + 1) + ' of ' + imgs.length + ' full screen');
      img.addEventListener('click', function () { open(i); });
      img.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(i); } });
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
      // Tester sign-ups also go to the studio's MailerLite list (group Testers, with a confirm email).
      var ml = form.getAttribute('data-mailerlite');
      if (ml) {
        var m = new FormData();
        m.append('fields[email]', data.get('email') || '');
        m.append('fields[name]', data.get('name') || '');
        m.append('fields[game]', data.get('game') || '');
        m.append('fields[device]', data.get('phone') || '');
        m.append('ml-submit', '1'); m.append('anticsrf', 'true');
        fetch(ml, { method: 'POST', body: m, mode: 'no-cors' }).catch(function () {});
      }
      fetch(form.action, { method: 'POST', body: data, headers: { Accept: 'application/json' } })
        .then(function (r) {
          if (!r.ok) throw new Error(r.status);
          form.style.display = 'none'; done.classList.add('show'); done.focus();
        })
        .catch(function () { b.textContent = 'Something went wrong. Try again'; b.disabled = false; });
    });
  }
  });
  // New game alerts (footer): straight to MailerLite's release news form, which sends a confirm email.
  (function () {
    var f = document.getElementById('newsForm'), done = document.getElementById('newsDone');
    if (!f || !done) return;
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var b = f.querySelector('button'); b.textContent = 'Sending…'; b.disabled = true;
      fetch(f.action, { method: 'POST', body: new FormData(f), mode: 'no-cors' })
        .then(function () { f.hidden = true; f.style.display = 'none'; done.hidden = false; done.focus(); })
        .catch(function () { b.textContent = 'Try again'; b.disabled = false; });
    });
  })();
})();
