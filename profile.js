/**
 * ResumePilot — profile.js
 */

/* ── TAB SWITCHING ── */
function switchProfileTab(tabId, btnEl) {
  document.querySelectorAll('.profile-section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.profile-tab').forEach(b => b.classList.remove('active'));
  const panel = document.getElementById('tab-' + tabId);
  if (panel) panel.classList.add('active');
  if (btnEl) btnEl.classList.add('active');
}

/* ── ENTRY TEMPLATES ── */
const ENTRY_TEMPLATES = {
  education: {
    title: 'Education',
    fields: [
      { id: 'institution', label: 'Institution *', type: 'text', placeholder: 'University of Lagos', span: 1 },
      { id: 'degree',      label: 'Degree *',      type: 'text', placeholder: 'B.Sc. Computer Science', span: 1 },
      { id: 'field',       label: 'Field of Study', type: 'text', placeholder: 'Computer Science', span: 1 },
      { id: 'grade',       label: 'Grade / GPA',    type: 'text', placeholder: '3.8 / 4.0 or First Class', span: 1 },
      { id: 'start',       label: 'Start Year',     type: 'text', placeholder: '2018', span: 1 },
      { id: 'end',         label: 'End Year',        type: 'text', placeholder: '2022 or Present', span: 1 },
    ],
  },
  experience: {
    title: 'Work Experience',
    fields: [
      { id: 'company',   label: 'Company *',    type: 'text',     placeholder: 'Google',                   span: 1 },
      { id: 'role',      label: 'Job Title *',  type: 'text',     placeholder: 'Senior Software Engineer', span: 1 },
      { id: 'location',  label: 'Location',     type: 'text',     placeholder: 'Lagos / Remote',           span: 1 },
      { id: 'start',     label: 'Start Date',   type: 'text',     placeholder: 'Jan 2022',                 span: 1 },
      { id: 'end',       label: 'End Date',     type: 'text',     placeholder: 'Present',                  span: 1 },
      { id: 'current',   label: 'Current Role', type: 'checkbox', placeholder: '',                         span: 1 },
      { id: 'bullets',   label: 'Responsibilities & Achievements', type: 'textarea', placeholder: '• Led team of 5 engineers...\n• Reduced load time by 40%...', span: 2 },
    ],
  },
  certifications: {
    title: 'Certification',
    fields: [
      { id: 'name',   label: 'Certification Name *', type: 'text', placeholder: 'AWS Solutions Architect', span: 1 },
      { id: 'issuer', label: 'Issuing Organization', type: 'text', placeholder: 'Amazon Web Services',     span: 1 },
      { id: 'date',   label: 'Issue Date',            type: 'text', placeholder: 'March 2023',              span: 1 },
      { id: 'expiry', label: 'Expiry Date',           type: 'text', placeholder: 'March 2026 or N/A',      span: 1 },
      { id: 'url',    label: 'Credential URL',        type: 'url',  placeholder: 'https://credential.url', span: 2 },
    ],
  },
  projects: {
    title: 'Project',
    fields: [
      { id: 'name',  label: 'Project Name *', type: 'text',     placeholder: 'E-Commerce Platform',              span: 1 },
      { id: 'role',  label: 'Your Role',      type: 'text',     placeholder: 'Lead Developer',                   span: 1 },
      { id: 'url',   label: 'Project URL',    type: 'url',      placeholder: 'https://github.com/...',           span: 1 },
      { id: 'tech',  label: 'Technologies',   type: 'text',     placeholder: 'React, Node.js, MongoDB',          span: 1 },
      { id: 'desc',  label: 'Description',    type: 'textarea', placeholder: 'Brief description of the project and your impact...', span: 2 },
    ],
  },
  languages: {
    title: 'Language',
    fields: [
      { id: 'language',    label: 'Language *',    type: 'text',   placeholder: 'English',      span: 1 },
      { id: 'proficiency', label: 'Proficiency *', type: 'select', options: ['Native / Bilingual', 'Fluent', 'Professional', 'Intermediate', 'Basic'], span: 1 },
    ],
  },
  references: {
    title: 'Reference',
    fields: [
      { id: 'name',     label: 'Full Name *',      type: 'text',  placeholder: 'Dr. Ade Okonkwo',          span: 1 },
      { id: 'title',    label: 'Job Title',         type: 'text',  placeholder: 'Head of Engineering',      span: 1 },
      { id: 'company',  label: 'Company',           type: 'text',  placeholder: 'Tech Corp Ltd',            span: 1 },
      { id: 'email',    label: 'Email',             type: 'email', placeholder: 'ade@techcorp.com',         span: 1 },
      { id: 'phone',    label: 'Phone',             type: 'tel',   placeholder: '+234 812 345 6789',        span: 1 },
      { id: 'relation', label: 'Relationship',      type: 'text',  placeholder: 'Former Manager',          span: 1 },
    ],
  },
};

let _entryCounters = {};

function addEntry(section) {
  const listId = section + 'List';
  const container = document.getElementById(listId);
  if (!container) return;

  const tmpl = ENTRY_TEMPLATES[section];
  if (!tmpl) return;

  _entryCounters[section] = (_entryCounters[section] || 0) + 1;
  const idx = _entryCounters[section];
  const cardId = `${section}_card_${idx}`;

  const fieldsHtml = _buildFields(tmpl.fields, section, idx);

  const card = document.createElement('div');
  card.className = 'entry-card';
  card.id = cardId;
  card.innerHTML = `
    <div class="entry-card-header">
      <span class="entry-card-title">${tmpl.title} #${idx}</span>
      <button class="entry-remove-btn" onclick="removeEntry('${cardId}')" title="Remove">
        <i class="fas fa-trash"></i>
      </button>
    </div>
    <div class="grid-2">${fieldsHtml}</div>`;

  container.appendChild(card);
  card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function _buildFields(fields, section, idx) {
  return fields.map(f => {
    const id = `${section}_${f.id}_${idx}`;
    const spanClass = f.span === 2 ? 'style="grid-column:span 2;"' : '';

    if (f.type === 'textarea') {
      return `<div class="form-group" ${spanClass}>
        <label class="form-label">${f.label}</label>
        <textarea class="form-textarea" id="${id}" placeholder="${f.placeholder}" style="min-height:100px;"></textarea>
      </div>`;
    }
    if (f.type === 'select') {
      const options = f.options.map(o => `<option>${o}</option>`).join('');
      return `<div class="form-group" ${spanClass}>
        <label class="form-label">${f.label}</label>
        <select class="form-input" id="${id}"><option value="">Select...</option>${options}</select>
      </div>`;
    }
    if (f.type === 'checkbox') {
      return `<div class="form-group" ${spanClass} style="display:flex;align-items:center;gap:8px;padding-top:28px;">
        <input type="checkbox" id="${id}" style="width:16px;height:16px;accent-color:var(--primary);">
        <label for="${id}" style="font-size:0.875rem;font-weight:500;cursor:pointer;">Currently working here</label>
      </div>`;
    }
    return `<div class="form-group" ${spanClass}>
      <label class="form-label">${f.label}</label>
      <input type="${f.type}" class="form-input" id="${id}" placeholder="${f.placeholder}">
    </div>`;
  }).join('');
}

function removeEntry(cardId) {
  const card = document.getElementById(cardId);
  if (card) {
    card.style.opacity = '0';
    card.style.transform = 'translateY(-8px)';
    card.style.transition = 'all 0.2s ease';
    setTimeout(() => card.remove(), 200);
  }
}

/* ── SKILLS ── */
const _skills = { technical: [], soft: [] };

function addSkill(type) {
  const inputId = type === 'technical' ? 'newTechSkill' : 'newSoftSkill';
  const input = document.getElementById(inputId);
  if (!input) return;
  const val = input.value.trim();
  if (!val) return;
  if (_skills[type].includes(val)) { App.toast('Skill already added', 'warning'); return; }
  _skills[type].push(val);
  input.value = '';
  _renderSkills(type);
  _updateStrength();
}

function _renderSkills(type) {
  const displayId = type === 'technical' ? 'techSkillsDisplay' : 'softSkillsDisplay';
  const container = document.getElementById(displayId);
  if (!container) return;
  container.innerHTML = _skills[type].map(s => `
    <span class="skill-tag">
      ${s}
      <button onclick="removeSkill('${type}','${s.replace(/'/g,"\\'")}')">×</button>
    </span>`).join('');
}

function removeSkill(type, skill) {
  _skills[type] = _skills[type].filter(s => s !== skill);
  _renderSkills(type);
  _updateStrength();
}

/* ── PROFILE STRENGTH ── */
function _updateStrength() {
  const checks = {
    'Personal Info':   !!document.getElementById('p_name')?.value,
    'Summary':         (document.getElementById('p_summary')?.value?.length || 0) > 50,
    'Experience':      document.querySelectorAll('#experienceList .entry-card').length > 0,
    'Education':       document.querySelectorAll('#educationList .entry-card').length > 0,
    'Skills':          _skills.technical.length > 0,
    'Certifications':  document.querySelectorAll('#certificationsList .entry-card').length > 0,
    'Languages':       document.querySelectorAll('#languagesList .entry-card').length > 0,
  };

  const done = Object.values(checks).filter(Boolean).length;
  const total = Object.keys(checks).length;
  const pct = Math.round((done / total) * 100);

  const bar = document.getElementById('strengthBar');
  const pctEl = document.getElementById('strengthPct');
  const labelEl = document.getElementById('strengthLabel');
  const itemsEl = document.getElementById('strengthItems');

  if (bar) bar.style.width = pct + '%';
  if (pctEl) pctEl.textContent = pct + '%';

  if (labelEl) {
    const label = pct >= 90 ? 'Excellent' : pct >= 70 ? 'Good' : pct >= 50 ? 'Fair' : 'Weak';
    const cls   = pct >= 90 ? 'badge-success' : pct >= 70 ? 'badge-warning' : 'badge-danger';
    labelEl.textContent = label;
    labelEl.className = `badge ${cls}`;
  }

  if (itemsEl) {
    itemsEl.innerHTML = Object.entries(checks).map(([name, ok]) =>
      `<span class="strength-item ${ok ? 'done' : 'missing'}">
        <i class="fas fa-${ok ? 'check' : 'times'}"></i> ${name}
      </span>`
    ).join('');
  }
}

/* ── SAVE PROFILE ── */
function saveProfile() {
  const data = {
    name:        document.getElementById('p_name')?.value,
    email:       document.getElementById('p_email')?.value,
    phone:       document.getElementById('p_phone')?.value,
    location:    document.getElementById('p_location')?.value,
    nationality: document.getElementById('p_nationality')?.value,
    linkedin:    document.getElementById('p_linkedin')?.value,
    portfolio:   document.getElementById('p_portfolio')?.value,
    title:       document.getElementById('p_title')?.value,
    summary:     document.getElementById('p_summary')?.value,
    skills:      _skills,
  };
  try {
    localStorage.setItem('rp_profile', JSON.stringify(data));
    App.toast('Profile saved successfully!', 'success');
  } catch {
    App.toast('Could not save profile.', 'error');
  }
}

/* ── LOAD SAVED PROFILE ── */
function _loadProfile() {
  try {
    const saved = JSON.parse(localStorage.getItem('rp_profile') || '{}');
    const fields = { p_name: 'name', p_email: 'email', p_phone: 'phone', p_location: 'location',
                     p_nationality: 'nationality', p_linkedin: 'linkedin', p_portfolio: 'portfolio',
                     p_title: 'title', p_summary: 'summary' };
    Object.entries(fields).forEach(([id, key]) => {
      const el = document.getElementById(id);
      if (el && saved[key]) el.value = saved[key];
    });
    if (saved.skills) {
      _skills.technical = saved.skills.technical || [];
      _skills.soft = saved.skills.soft || [];
      _renderSkills('technical');
      _renderSkills('soft');
    }
  } catch { /* ignore */ }
}

/* ── SUMMARY COUNTER ── */
function _initSummaryCounter() {
  const textarea = document.getElementById('p_summary');
  const counter  = document.getElementById('summaryCount');
  if (!textarea || !counter) return;
  const update = () => { counter.textContent = `${textarea.value.length} / 500 characters`; };
  textarea.addEventListener('input', () => { update(); _updateStrength(); });
  update();
}

/* ── INIT ── */
document.addEventListener('DOMContentLoaded', () => {
  _loadProfile();
  _initSummaryCounter();
  _updateStrength();

  // Re-compute strength when personal fields change
  ['p_name','p_email','p_summary'].forEach(id => {
    document.getElementById(id)?.addEventListener('input', _updateStrength);
  });

  // Animate usage bar
  document.querySelectorAll('.usage-bar-fill[data-width]').forEach(el => {
    setTimeout(() => { el.style.width = el.dataset.width + '%'; }, 400);
  });
});
