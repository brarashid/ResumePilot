/**
 * ResumePilot — admin-guard.js
 * Must be the first script loaded on admin.html.
 * Redirects any non-admin visitor before the page renders.
 */
(function () {
  var token = localStorage.getItem('rp_token');
  var user  = JSON.parse(localStorage.getItem('rp_user') || '{}');
  if (!token || user.role !== 'admin') {
    window.location.replace('dashboard.html');
  }
}());
