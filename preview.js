/**
 * ResumePilot — preview.js
 */

const Preview = (() => {

  const ATS_SCORE = 92;
  let _zoom      = 100;
  let _editMode  = false;

  /* ── INIT ── */
  function init() {
    _animateAtsRing();
    _animateScoreBars();
    _animateUsageBars();
    _autoScaleForMobile();
  }

  /* ── ATS RING ── */
  function _animateAtsRing() {
    const ring  = document.getElementById('atsRingFill');
    const numEl = document.getElementById('atsScoreNum');
    if (!ring || !numEl) return;

    const r            = 50;
    const circumference = 2 * Math.PI * r;
    ring.style.strokeDasharray  = circumference;
    ring.style.strokeDashoffset = circumference;

    const start = Date.now();
    const duration = 1300;

    const tick = () => {
      const p    = Math.min((Date.now() - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      numEl.textContent        = Math.round(ease * ATS_SCORE);
      ring.style.strokeDashoffset = circumference * (1 - ease * ATS_SCORE / 100);
      if (p < 1) requestAnimationFrame(tick);
      else numEl.textContent = ATS_SCORE;
    };
    requestAnimationFrame(() => requestAnimationFrame(tick));
  }

  /* ── SCORE BARS ── */
  function _animateScoreBars() {
    setTimeout(() => {
      document.querySelectorAll('.score-row-fill[data-width]').forEach(el => {
        el.style.width = el.dataset.width + '%';
      });
    }, 400);
  }

  /* ── USAGE BARS ── */
  function _animateUsageBars() {
    document.querySelectorAll('.usage-bar-fill[data-width]').forEach(el => {
      setTimeout(() => { el.style.width = el.dataset.width + '%'; }, 400);
    });
  }

  /* ── AUTO-SCALE ON SMALL SCREENS ── */
  function _autoScaleForMobile() {
    const container = document.querySelector('.a4-container');
    const page      = document.getElementById('resumeA4');
    if (!container || !page) return;

    const available = container.clientWidth - 48;
    if (available < 794) {
      const scale = Math.max(0.45, available / 794);
      _zoom = Math.round(scale * 100);
      _applyZoom();
    }
  }

  /* ── ZOOM ── */
  function _applyZoom() {
    const page  = document.getElementById('resumeA4');
    const label = document.getElementById('zoomLabel');
    if (page)  page.style.transform = `scale(${_zoom / 100})`;
    if (label) label.textContent    = _zoom + '%';

    // Keep container height in sync so page doesn't overlap content below
    const page2 = document.getElementById('resumeA4');
    if (page2) {
      const scaled = page2.offsetHeight * (_zoom / 100);
      const wrap   = document.querySelector('.a4-container');
      if (wrap) wrap.style.minHeight = (scaled + 64) + 'px';
    }
  }

  function zoomIn() {
    if (_zoom >= 150) return;
    _zoom = Math.min(150, _zoom + 10);
    _applyZoom();
  }

  function zoomOut() {
    if (_zoom <= 40) return;
    _zoom = Math.max(40, _zoom - 10);
    _applyZoom();
  }

  /* ── EDIT MODE ── */
  function toggleEdit() {
    _editMode = !_editMode;
    const page   = document.getElementById('resumeA4');
    const toggle = document.getElementById('editToggle');

    if (!page) return;

    // Toggle contenteditable on all editable fields
    page.querySelectorAll('[contenteditable]').forEach(el => {
      el.contentEditable = _editMode ? 'true' : 'false';
    });

    page.classList.toggle('edit-mode', _editMode);

    if (toggle) {
      toggle.classList.toggle('active', _editMode);
      toggle.innerHTML = _editMode
        ? '<i class="fas fa-check"></i> Done Editing'
        : '<i class="fas fa-pen"></i> Edit Mode';
    }

    App.toast(_editMode ? 'Click any text to edit it' : 'Changes saved', _editMode ? 'info' : 'success');
  }

  /* ── DOWNLOAD PDF ── */
  function downloadPDF() {
    App.toast('Preparing PDF — printing dialog will open...', 'info');
    setTimeout(() => window.print(), 600);
  }

  /* ── DOWNLOAD DOCX ── */
  function downloadDOCX() {
    App.toast('DOCX export — connect to a backend to enable this feature.', 'info');
  }

  /* ── SHARE ── */
  function shareResume() {
    App.openModal('shareModal');
  }

  function copyLink() {
    const input = document.querySelector('#shareModal input[type="text"]');
    if (!input) return;
    navigator.clipboard.writeText(input.value)
      .then(() => {
        App.toast('Link copied to clipboard!', 'success');
        App.closeModal('shareModal');
      })
      .catch(() => {
        input.select();
        document.execCommand('copy');
        App.toast('Link copied!', 'success');
        App.closeModal('shareModal');
      });
  }

  /* ── PUBLIC ── */
  return { init, zoomIn, zoomOut, toggleEdit, downloadPDF, downloadDOCX, shareResume, copyLink };
})();

document.addEventListener('DOMContentLoaded', () => Preview.init());
