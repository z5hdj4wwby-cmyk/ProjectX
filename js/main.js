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

    // Give every slide's card the same height (the tallest slide's natural
    // height) so nothing resizes or reflows when swiping between them.
    function equalizeSlideHeights() {
      var cards = slides.map(function (s) { return s.querySelector('.mock-card') || s; });
      cards.forEach(function (c) { c.style.minHeight = ''; });
      var maxH = cards.reduce(function (max, c) { return Math.max(max, c.offsetHeight); }, 0);
      cards.forEach(function (c) { c.style.minHeight = maxH + 'px'; });
    }
    equalizeSlideHeights();
    window.addEventListener('load', equalizeSlideHeights);
    var resizeTimeout;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(equalizeSlideHeights, 150);
    });

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

  // Full report modal — opened from the carousel's topic-breakdown card, the
  // "Sample Report" nav link, or the footer link. Only index.html has the
  // #report-modal element; on every other page these same-class links point
  // to "index.html#example-report" and are left to navigate normally, with
  // the hash picked up and opened on load below.
  var reportModal = document.getElementById('report-modal');
  var lastReportTrigger = null;

  function openReportModal() {
    if (!reportModal) return;
    reportModal.hidden = false;
    document.body.classList.add('modal-open');
    var closeBtn = reportModal.querySelector('.modal-close');
    if (closeBtn) closeBtn.focus();
  }
  function closeReportModal() {
    if (!reportModal) return;
    reportModal.hidden = true;
    document.body.classList.remove('modal-open');
    if (lastReportTrigger && typeof lastReportTrigger.focus === 'function') lastReportTrigger.focus();
  }

  document.querySelectorAll('.report-trigger').forEach(function (el) {
    el.addEventListener('click', function (e) {
      if (!reportModal) return; // let cross-page links navigate normally
      e.preventDefault();
      lastReportTrigger = el;
      openReportModal();
    });
  });

  if (reportModal) {
    var modalCloseBtn = reportModal.querySelector('.modal-close');
    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeReportModal);
    reportModal.addEventListener('click', function (e) {
      if (e.target === reportModal) closeReportModal();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !reportModal.hidden) closeReportModal();
    });
    var modalCta = document.getElementById('report-modal-contact-cta');
    if (modalCta) modalCta.addEventListener('click', closeReportModal);

    // Arriving from another page with #example-report in the URL: open the
    // modal, then drop the hash so the address bar stays clean while it's open.
    if (location.hash === '#example-report') {
      openReportModal();
      history.replaceState(null, '', location.pathname + location.search);
    }
  }
});
