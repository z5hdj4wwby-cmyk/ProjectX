// ProjectX — shared front-end behaviour (no backend, UI only)

document.addEventListener('DOMContentLoaded', function () {
  // Mobile nav toggle
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      links.classList.toggle('open');
      var expanded = links.classList.contains('open');
      toggle.setAttribute('aria-expanded', expanded);
    });
    links.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        links.classList.remove('open');
      });
    });
  }

  // Highlight current page in nav
  var here = (window.location.pathname.split('/').pop() || 'index.html');
  document.querySelectorAll('.nav-links a').forEach(function (a) {
    var target = a.getAttribute('href');
    if (target === here || (here === '' && target === 'index.html')) {
      a.classList.add('active');
    }
  });

  // Contact form — UI-only submission handling.
  // NOTE: no backend is wired up yet. On submit we simply validate the
  // fields client-side and show a confirmation message. Replace this
  // handler with a real submission (e.g. POST to an email/form service)
  // when a backend destination is chosen.
  var form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var valid = true;
      form.querySelectorAll('[required]').forEach(function (field) {
        var row = field.closest('.form-row');
        if (!field.value.trim()) {
          valid = false;
          if (row) row.classList.add('invalid');
        } else if (row) {
          row.classList.remove('invalid');
        }
      });

      var success = document.getElementById('contact-success');
      if (valid) {
        form.reset();
        if (success) success.classList.add('show');
      } else if (success) {
        success.classList.remove('show');
      }
    });

    form.querySelectorAll('[required]').forEach(function (field) {
      field.addEventListener('input', function () {
        var row = field.closest('.form-row');
        if (row && field.value.trim()) row.classList.remove('invalid');
      });
    });
  }

  // Subjects page tab filter (GCSE / A-Level)
  var tabButtons = document.querySelectorAll('.tab-btn');
  if (tabButtons.length) {
    var panels = document.querySelectorAll('[data-panel]');
    tabButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        tabButtons.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        var target = btn.getAttribute('data-tab');
        panels.forEach(function (panel) {
          panel.style.display = (target === 'all' || panel.getAttribute('data-panel') === target) ? '' : 'none';
        });
      });
    });
  }

  // Progress carousel (swipe via native scroll-snap, plus arrow/dot controls)
  document.querySelectorAll('.carousel').forEach(function (root) {
    var track = root.querySelector('.carousel-track');
    var slides = Array.prototype.slice.call(track.children);
    var dots = Array.prototype.slice.call(root.querySelectorAll('.carousel-dot'));
    var prevBtn = root.querySelector('.carousel-arrow--prev');
    var nextBtn = root.querySelector('.carousel-arrow--next');
    var current = 0;

    function goTo(i) {
      current = Math.max(0, Math.min(slides.length - 1, i));
      track.scrollTo({ left: slides[current].offsetLeft, behavior: 'smooth' });
      updateDots();
    }
    function updateDots() {
      dots.forEach(function (d, i) { d.classList.toggle('active', i === current); });
    }
    if (prevBtn) prevBtn.addEventListener('click', function () { goTo(current - 1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { goTo(current + 1); });
    dots.forEach(function (d, i) { d.addEventListener('click', function () { goTo(i); }); });

    var scrollTimeout;
    track.addEventListener('scroll', function () {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(function () {
        var idx = Math.round(track.scrollLeft / track.clientWidth);
        current = Math.max(0, Math.min(slides.length - 1, idx));
        updateDots();
      }, 100);
    });
  });

  // Reveal the full example report (hidden by default) when a "report-trigger"
  // element is clicked, so there is only ever one instance of the report on
  // the page rather than a duplicate preview.
  var reportPanel = document.getElementById('example-report');
  function revealReport() {
    if (reportPanel && reportPanel.hidden) reportPanel.hidden = false;
  }
  document.querySelectorAll('.report-trigger').forEach(function (el) {
    el.addEventListener('click', revealReport);
  });
  // Arriving directly at #example-report (e.g. from another page) needs the
  // panel revealed before the browser's own hash-scroll can find it.
  if (reportPanel && location.hash === '#example-report') {
    revealReport();
    requestAnimationFrame(function () { reportPanel.scrollIntoView({ block: 'start' }); });
  }
});
