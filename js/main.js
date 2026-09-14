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
});
