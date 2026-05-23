/**
 * ResumePilot — api.js
 * Mock API layer. Replace these with real fetch() calls when a backend is ready.
 */

const API = (() => {

  function _delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async function login(email, password) {
    await _delay(900);
    if (!email || !password) throw new Error('Missing credentials');
    // Mock: accept any valid-looking credentials
    return { token: 'mock_token_' + Date.now(), user: { email, name: email.split('@')[0] } };
  }

  async function register({ name, email, phone, password }) {
    await _delay(1100);
    if (!name || !email || !password) throw new Error('Missing fields');
    return { token: 'mock_token_' + Date.now(), user: { name, email, phone } };
  }

  return { login, register };
})();
