/**
 * ResumePilot — settings.js
 */

const Settings = (() => {

  /* ── SCROLL TO SECTION ── */
  function scrollTo(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });

    document.querySelectorAll('.settings-nav-item').forEach(a => a.classList.remove('active'));
    const target = document.querySelector(`.settings-nav-item[href="#${id}"]`);
    if (target) target.classList.add('active');
  }

  /* ── SAVE ACCOUNT ── */
  function saveAccount() {
    const name  = document.getElementById('settName')?.value.trim();
    const email = document.getElementById('settEmail')?.value.trim();

    if (!name)  { App.toast('Name cannot be empty.', 'warning'); return; }
    if (!email || !email.includes('@')) { App.toast('Enter a valid email.', 'warning'); return; }

    App.toast('Account details saved!', 'success');
  }

  /* ── CHANGE PASSWORD ── */
  function changePassword() {
    const oldPass     = document.getElementById('settOldPass')?.value;
    const newPass     = document.getElementById('settNewPass')?.value;
    const confirmPass = document.getElementById('settConfirmPass')?.value;

    if (!oldPass) { App.toast('Enter your current password.', 'warning'); return; }
    if (!newPass || newPass.length < 8) { App.toast('New password must be at least 8 characters.', 'warning'); return; }
    if (newPass !== confirmPass) { App.toast('Passwords do not match.', 'error'); return; }

    const inputs = ['settOldPass', 'settNewPass', 'settConfirmPass'];
    inputs.forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });

    App.toast('Password updated successfully!', 'success');
  }

  /* ── PREVIEW PHOTO ── */
  function previewPhoto(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { App.toast('File exceeds 2MB limit.', 'error'); return; }

    const reader = new FileReader();
    reader.onload = e => {
      const img = document.getElementById('avatarImg');
      if (img) {
        img.src = e.target.result;
        img.classList.add('visible');
      }
    };
    reader.readAsDataURL(file);
    App.toast('Photo updated!', 'success');
  }

  /* ── REMOVE PHOTO ── */
  function removePhoto() {
    const img = document.getElementById('avatarImg');
    if (img) {
      img.src = '';
      img.classList.remove('visible');
    }
    const input = document.getElementById('photoInput');
    if (input) input.value = '';
    App.toast('Photo removed.', 'info');
  }

  /* ── SAVE NOTIFICATIONS ── */
  function saveNotif() {
    App.toast('Notification preferences saved.', 'success');
  }

  /* ── UPGRADE PLAN ── */
  function upgradePlan(plan) {
    if (plan === 'pro') {
      App.toast('Redirecting to checkout — Pro plan $9.99/mo...', 'info');
    } else if (plan === 'business') {
      App.toast('Our sales team will be in touch shortly!', 'info');
    }
  }

  /* ── CANCEL SUBSCRIPTION ── */
  function cancelSubscription() {
    App.toast('You are on the Free plan — no subscription to cancel.', 'info');
  }

  /* ── EXPORT DATA ── */
  function exportData() {
    App.toast('Preparing your data export... (demo only)', 'info');
  }

  /* ── SIGN OUT ALL ── */
  function signOutAll() {
    App.toast('All sessions revoked. Please sign in again.', 'success');
    setTimeout(() => { window.location.href = 'auth.html'; }, 1800);
  }

  /* ── CONFIRM DELETE ── */
  function confirmDelete() {
    const input = document.getElementById('deleteConfirmInput')?.value;
    if (input !== 'DELETE') {
      App.toast('Please type DELETE to confirm.', 'warning');
      return;
    }
    App.closeModal('deleteModal');
    App.toast('Account deletion initiated. Redirecting...', 'error');
    setTimeout(() => { window.location.href = 'auth.html'; }, 2000);
  }

  /* ── INIT ── */
  function init() {
    document.querySelectorAll('.usage-bar-fill[data-width]').forEach(el => {
      setTimeout(() => { el.style.width = el.dataset.width + '%'; }, 400);
    });

    // Highlight active nav on scroll
    const sections = ['profile-photo', 'account', 'notifications', 'subscription', 'danger'];
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          document.querySelectorAll('.settings-nav-item').forEach(a => a.classList.remove('active'));
          const target = document.querySelector(`.settings-nav-item[href="#${id}"]`);
          if (target) target.classList.add('active');
        }
      });
    }, { threshold: 0.4 });

    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
  }

  return { scrollTo, saveAccount, changePassword, previewPhoto, removePhoto, saveNotif, upgradePlan, cancelSubscription, exportData, signOutAll, confirmDelete };
})();

document.addEventListener('DOMContentLoaded', () => Settings.init());
