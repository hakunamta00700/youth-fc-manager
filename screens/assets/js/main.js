// Youth FC Manager - main.js
(function() {
  'use strict';

  // --- Progress bars: animate from data-width attribute ---
  document.querySelectorAll('.progress-bar[data-width]').forEach(function(el) {
    el.style.width = el.getAttribute('data-width') + '%';
  });

  // --- Date display in elements with data-date attribute ---
  document.querySelectorAll('[data-date]').forEach(function(el) {
    var d = new Date();
    el.textContent = d.toLocaleDateString('ko-KR', {
      year: 'numeric', month: 'long', day: 'numeric', weekday: 'long'
    });
  });

  // --- Sidebar active state from current URL path ---
  var path = window.location.pathname;
  document.querySelectorAll('.sidebar a.nav-item').forEach(function(a) {
    if (path.endsWith(a.getAttribute('href'))) a.classList.add('active');
  });

  // --- Mobile bottom nav active state ---
  document.querySelectorAll('.mobile-bottom-nav a').forEach(function(a) {
    if (path.endsWith(a.getAttribute('href'))) a.classList.add('active');
  });

  // --- Sidebar toggle on mobile ---
  document.getElementById('sidebarToggle').addEventListener('click', function() {
    var sidebar = document.querySelector('.sidebar');
    var currentLeft = sidebar.style.left;
    sidebar.style.left = (currentLeft === '0px' || currentLeft === '') ? '-240px' : '0px';
  });

})();

// --- Toggle attendance status (present -> late -> absent -> present) ---
function toggleAttendance(el) {
  var status = el.querySelector('.status');
  if (!status) return;
  if (status.classList.contains('present')) {
    status.className = 'status late';
    status.textContent = '지각';
  } else if (status.classList.contains('late')) {
    status.className = 'status absent';
    status.textContent = '결석';
  } else {
    status.className = 'status present';
    status.textContent = '출석';
  }
}

// --- Toast notification system ---
function showToast(msg, type) {
  type = type || 'info';
  var container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  var toast = document.createElement('div');
  toast.className = 'toast-msg ' + type;
  toast.textContent = msg;
  container.appendChild(toast);
  setTimeout(function() { toast.remove(); }, 3000);
}
