/**
 * ResumePilot — api.js
 * Mock API layer. Replace these with real fetch() calls when a backend is ready.
 */

const API = (() => {

  // Emails that belong to company staff — these accounts get admin access.
  // Replace with real role checks when a backend is connected.
  const _ADMIN_EMAILS = [
    'admin@resumepilot.com',
    'staff@resumepilot.com',
  ];

  function _delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async function login(email, password) {
    await _delay(900);
    if (!email || !password) throw new Error('Missing credentials');
    const role = _ADMIN_EMAILS.includes(email.trim().toLowerCase()) ? 'admin' : 'user';
    return { token: 'mock_token_' + Date.now(), user: { email, name: email.split('@')[0], role } };
  }

  async function register({ name, email, phone, password }) {
    await _delay(1100);
    if (!name || !email || !password) throw new Error('Missing fields');
    // Self-registered accounts are always regular users, never admins.
    return { token: 'mock_token_' + Date.now(), user: { name, email, phone, role: 'user' } };
  }

  return { login, register };
})();
