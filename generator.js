/**
 * ResumePilot — generator.js
 */

const Generator = (() => {

  const TEMPLATES = [
    { id: 1, name: 'Executive Classic',   region: 'Global',       icon: '👔', color: '#7C3AED' },
    { id: 2, name: 'Modern Minimal',      region: 'US/Canada',    icon: '⚡', color: '#3B82F6' },
    { id: 3, name: 'Tech Focused',        region: 'US/Canada',    icon: '💻', color: '#0EA5E9' },
    { id: 4, name: 'African Scholar',     region: 'Africa',       icon: '🎓', color: '#22C55E' },
    { id: 5, name: 'Creative Portfolio',  region: 'Europe',       icon: '🎨', color: '#EC4899' },
    { id: 6, name: 'Gulf Professional',   region: 'Middle East',  icon: '🏢', color: '#F59E0B' },
    { id: 7, name: 'Clean Impact',        region: 'Global',       icon: '✨', color: '#6366F1' },
    { id: 8, name: 'Leadership Bold',     region: 'US/Canada',    icon: '🚀', color: '#EF4444' },
  ];

  let _selectedTemplate = TEMPLATES[0];
  let _selectedRegion   = 'Africa';

  /* ── INIT ── */
  function init() {
    _renderTemplates();
    _loadSavedJD();
    _animateUsageBars();
  }

  /* ── TEMPLATE GALLERY ── */
  function _renderTemplates() {
    const gallery = document.getElementById('templateGallery');
    if (!gallery) return;

    gallery.innerHTML = TEMPLATES.map(t => `
      <div class="template-thumb ${t.id === _selectedTemplate.id ? 'selected' : ''}"
           id="tmpl_${t.id}" onclick="Generator.pickTemplate(${t.id})">
        <div class="template-selected-tick"><i class="fas fa-check"></i></div>
        <div class="template-thumb-icon">${t.icon}</div>
        <div class="template-thumb-name">${t.name}</div>
        <div class="template-thumb-region" style="background:${t.color};">${t.region}</div>
      </div>`).join('');
  }

  function pickTemplate(id) {
    _selectedTemplate = TEMPLATES.find(t => t.id === id) || TEMPLATES[0];
    document.querySelectorAll('.template-thumb').forEach(el => el.classList.remove('selected'));
    document.getElementById('tmpl_' + id)?.classList.add('selected');
    const badge = document.getElementById('selectedTemplateBadge');
    if (badge) badge.textContent = _selectedTemplate.name;
  }

  /* ── LOAD SAVED JD ── */
  function _loadSavedJD() {
    const saved = sessionStorage.getItem('rp_jd');
    if (saved) {
      const ta = document.getElementById('genJobDesc');
      if (ta) { ta.value = saved; sessionStorage.removeItem('rp_jd'); }
    }
  }

  /* ── USAGE BARS ── */
  function _animateUsageBars() {
    document.querySelectorAll('.usage-bar-fill[data-width]').forEach(el => {
      setTimeout(() => { el.style.width = el.dataset.width + '%'; }, 400);
    });
  }

  /* ── GENERATE ── */
  function generate() {
    const jd = document.getElementById('genJobDesc')?.value.trim() || '';
    if (!jd) {
      App.toast('Please paste a job description for best results', 'warning');
      return;
    }

    const tone    = document.querySelector('#toneChips   .chip.active')?.dataset.val || 'Professional';
    const length  = document.querySelector('#lengthChips .chip.active')?.dataset.val || 'One Page';
    const focus   = document.querySelector('#focusChips  .chip.active')?.dataset.val || 'Mixed';
    const extra   = document.getElementById('genInstructions')?.value.trim() || '';

    _showLoadingOverlay({ tone, length, focus });
  }

  /* ── LOADING OVERLAY ── */
  const STEPS = [
    'Reading your master profile...',
    'Analysing job description...',
    'Selecting best keywords...',
    'Crafting tailored bullet points...',
    'Applying template & formatting...',
    'Running ATS optimisation check...',
  ];

  function _showLoadingOverlay({ tone, length, focus }) {
    const overlay = document.createElement('div');
    overlay.className = 'gen-loading-overlay';
    overlay.id = 'genLoadingOverlay';
    overlay.innerHTML = `
      <div class="gen-loading-logo">✈</div>
      <div class="gen-loading-title">Generating Your Resume</div>
      <div class="gen-loading-sub">${tone} · ${length} · ${focus} · ${_selectedTemplate.name}</div>
      <div class="gen-steps" id="genStepList">
        ${STEPS.map((s, i) => `
          <div class="gen-step" id="gstep_${i}">
            <div class="gen-step-dot"></div>
            <span>${s}</span>
          </div>`).join('')}
      </div>`;
    document.body.appendChild(overlay);

    let step = 0;
    const interval = setInterval(() => {
      if (step > 0) {
        const prev = document.getElementById('gstep_' + (step - 1));
        if (prev) { prev.classList.remove('active'); prev.classList.add('done'); }
      }
      const cur = document.getElementById('gstep_' + step);
      if (cur) cur.classList.add('active');
      step++;
      if (step >= STEPS.length) {
        clearInterval(interval);
        setTimeout(() => {
          overlay.remove();
          _onGenerateDone();
        }, 700);
      }
    }, 520);
  }

  function _onGenerateDone() {
    App.toast('Resume generated successfully! Redirecting to preview...', 'success');
    setTimeout(() => { window.location.href = 'preview.html'; }, 1200);
  }

  /* ── PUBLIC ── */
  return { init, pickTemplate, generate };
})();

/* ── GLOBAL HELPERS (called from onclick) ── */
function selectGenRegion(el) {
  document.querySelectorAll('.region-gen').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
}

function selectChip(groupId, el) {
  document.querySelectorAll(`#${groupId} .chip`).forEach(c => c.classList.remove('active'));
  el.classList.add('active');
}

function loadSavedJD() {
  const saved = sessionStorage.getItem('rp_jd');
  if (saved) {
    const ta = document.getElementById('genJobDesc');
    if (ta) { ta.value = saved; App.toast('Last job description loaded', 'success'); }
  } else {
    App.toast('No saved job description found. Analyze a job first.', 'info');
  }
}

function generateResume() {
  Generator.generate();
}

document.addEventListener('DOMContentLoaded', () => Generator.init());
