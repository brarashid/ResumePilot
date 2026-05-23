/**
 * ResumePilot — tracker.js
 */

const Tracker = (() => {

  let _apps = [
    { id: 'app1', company: 'Google', role: 'Senior Software Engineer', stage: 'interview', ats: 92, date: '2024-02-01', resume: 'Modern Pro — Google', recruiter: 'Sarah Kim', recruiterEmail: 'sarah.kim@google.com', notes: 'Phone screen went well. Coding round next week.', timeline: [{ stage: 'draft', date: '2024-01-20' }, { stage: 'applied', date: '2024-02-01' }, { stage: 'interview', date: '2024-02-08' }] },
    { id: 'app2', company: 'Flutterwave', role: 'Lead Frontend Engineer', stage: 'applied', ats: 88, date: '2024-02-05', resume: 'African Elite — Flutterwave', recruiter: '', recruiterEmail: '', notes: '', timeline: [{ stage: 'draft', date: '2024-02-03' }, { stage: 'applied', date: '2024-02-05' }] },
    { id: 'app3', company: 'Shopify', role: 'Frontend Engineer', stage: 'applied', ats: 75, date: '2024-02-08', resume: 'Clean Classic — Shopify', recruiter: '', recruiterEmail: '', notes: '', timeline: [{ stage: 'applied', date: '2024-02-08' }] },
    { id: 'app4', company: 'Stripe', role: 'Software Engineer II', stage: 'offer', ats: 94, date: '2024-01-15', resume: 'Modern Pro — Stripe', recruiter: 'James Chen', recruiterEmail: 'jchen@stripe.com', notes: 'Verbal offer received. Negotiating comp.', timeline: [{ stage: 'draft', date: '2024-01-10' }, { stage: 'applied', date: '2024-01-15' }, { stage: 'interview', date: '2024-01-22' }, { stage: 'offer', date: '2024-02-01' }] },
    { id: 'app5', company: 'Meta', role: 'Frontend Engineer', stage: 'rejected', ats: 68, date: '2024-01-20', resume: 'Clean Classic', recruiter: '', recruiterEmail: '', notes: 'Did not pass technical screen.', timeline: [{ stage: 'applied', date: '2024-01-20' }, { stage: 'rejected', date: '2024-01-28' }] },
    { id: 'app6', company: 'Andela', role: 'Senior React Developer', stage: 'draft', ats: 81, date: '', resume: 'Modern Pro', recruiter: '', recruiterEmail: '', notes: 'Tailoring resume before applying.', timeline: [{ stage: 'draft', date: '2024-02-10' }] },
  ];

  let _activeId = null;

  const STAGE_LABELS = {
    draft: 'Draft', applied: 'Applied', interview: 'Interview', offer: 'Offer', rejected: 'Rejected'
  };

  /* ── INIT ── */
  function init() {
    _renderAll();
    _initSortable();
    _updateStats();

    document.querySelectorAll('.usage-bar-fill[data-width]').forEach(el => {
      setTimeout(() => { el.style.width = el.dataset.width + '%'; }, 400);
    });
  }

  /* ── RENDER ALL CARDS ── */
  function _renderAll() {
    const cols = ['draft', 'applied', 'interview', 'offer', 'rejected'];
    cols.forEach(col => {
      const list = document.getElementById('list-' + col);
      if (!list) return;
      list.innerHTML = '';
      _apps.filter(a => a.stage === col).forEach(a => {
        list.appendChild(_buildCard(a));
      });
    });
    _updateColCounts();
  }

  /* ── BUILD CARD ELEMENT ── */
  function _buildCard(app) {
    const div = document.createElement('div');
    div.className = 'app-card';
    div.dataset.id = app.id;

    let atsClass = '';
    if (app.ats >= 80) atsClass = 'high';
    else if (app.ats >= 60) atsClass = 'mid';
    else if (app.ats) atsClass = 'low';

    const dateStr = app.date ? _fmtDate(app.date) : '';

    div.innerHTML = `
      <div class="app-card-header">
        <div class="app-card-company">${_esc(app.company)}</div>
        ${app.ats ? `<div class="app-card-ats ${atsClass}">${app.ats}%</div>` : ''}
      </div>
      <div class="app-card-role">${_esc(app.role)}</div>
      <div class="app-card-meta">
        <div class="app-card-date">${dateStr}</div>
      </div>
    `;

    div.addEventListener('click', () => openDrawer(app.id));
    return div;
  }

  /* ── SORTABLE ── */
  function _initSortable() {
    if (typeof Sortable === 'undefined') return;
    document.querySelectorAll('.sortable-list').forEach(list => {
      Sortable.create(list, {
        group: 'kanban',
        animation: 150,
        ghostClass: 'sortable-ghost',
        dragClass: 'sortable-drag',
        onEnd(evt) {
          const id    = evt.item.dataset.id;
          const toCol = evt.to.dataset.col;
          const app   = _apps.find(a => a.id === id);
          if (app && app.stage !== toCol) {
            app.stage = toCol;
            app.timeline.push({ stage: toCol, date: new Date().toISOString().split('T')[0] });
          }
          _updateColCounts();
          _updateStats();
        }
      });
    });
  }

  /* ── COLUMN COUNTS ── */
  function _updateColCounts() {
    ['draft', 'applied', 'interview', 'offer', 'rejected'].forEach(col => {
      const el = document.getElementById('count-' + col);
      if (el) el.textContent = _apps.filter(a => a.stage === col).length;
    });
  }

  /* ── STATS ── */
  function _updateStats() {
    const total    = _apps.length;
    const active   = _apps.filter(a => !['rejected', 'offer'].includes(a.stage)).length;
    const offers   = _apps.filter(a => a.stage === 'offer').length;
    const applied  = _apps.filter(a => a.stage !== 'draft').length;
    const interviews = _apps.filter(a => ['interview', 'offer'].includes(a.stage)).length;
    const rate     = applied > 0 ? Math.round((interviews / applied) * 100) : 0;

    _set('statTotal', total);
    _set('statInterviewRate', rate + '%');
    _set('statActive', active);
    _set('statOffers', offers);
  }

  /* ── FILTER CARDS ── */
  function filterCards() {
    const role     = (document.getElementById('filterRole')?.value || '').toLowerCase();
    const dateFrom = document.getElementById('filterDateFrom')?.value || '';
    const dateTo   = document.getElementById('filterDateTo')?.value || '';

    document.querySelectorAll('.app-card').forEach(card => {
      const id  = card.dataset.id;
      const app = _apps.find(a => a.id === id);
      if (!app) return;

      let show = true;
      if (role && !app.company.toLowerCase().includes(role) && !app.role.toLowerCase().includes(role)) show = false;
      if (dateFrom && app.date && app.date < dateFrom) show = false;
      if (dateTo   && app.date && app.date > dateTo)   show = false;

      card.style.display = show ? '' : 'none';
    });
  }

  /* ── CLEAR FILTERS ── */
  function clearFilters() {
    const r = document.getElementById('filterRole');
    const f = document.getElementById('filterDateFrom');
    const t = document.getElementById('filterDateTo');
    if (r) r.value = '';
    if (f) f.value = '';
    if (t) t.value = '';
    document.querySelectorAll('.app-card').forEach(c => { c.style.display = ''; });
  }

  /* ── OPEN DRAWER ── */
  function openDrawer(id) {
    const app = _apps.find(a => a.id === id);
    if (!app) return;
    _activeId = id;

    _set('drawerCompany', app.company);
    _set('drawerRole', app.role);
    _set('dCompany', app.company);
    _set('dPosition', app.role);
    _set('dDate', app.date ? _fmtDate(app.date) : '—');
    _set('dATS', app.ats ? app.ats + '%' : '—');
    _set('dResume', app.resume || '—');
    _set('dStatus', STAGE_LABELS[app.stage] || app.stage);
    _set('dRecruiter', app.recruiter || '—');
    _set('dRecruiterEmail', app.recruiterEmail || '—');

    const notes = document.getElementById('dNotes');
    if (notes) notes.value = app.notes || '';

    _renderTimeline(app.timeline || []);

    document.getElementById('appDrawer')?.classList.add('open');
    document.getElementById('drawerOverlay')?.classList.add('open');
  }

  /* ── RENDER TIMELINE ── */
  function _renderTimeline(timeline) {
    const el = document.getElementById('dTimeline');
    if (!el) return;
    el.innerHTML = timeline.map(t => `
      <div class="timeline-item">
        <div class="timeline-dot ${t.stage}"></div>
        <div class="timeline-content">
          <div class="timeline-title">${STAGE_LABELS[t.stage] || t.stage}</div>
          <div class="timeline-date">${t.date ? _fmtDate(t.date) : ''}</div>
        </div>
      </div>
    `).join('');
  }

  /* ── CLOSE DRAWER ── */
  function closeDrawer() {
    document.getElementById('appDrawer')?.classList.remove('open');
    document.getElementById('drawerOverlay')?.classList.remove('open');
    _activeId = null;
  }

  /* ── SAVE NOTES ── */
  function saveNotes() {
    if (!_activeId) return;
    const app = _apps.find(a => a.id === _activeId);
    if (!app) return;
    const notes = document.getElementById('dNotes');
    if (notes) app.notes = notes.value;
    App.toast('Notes saved!', 'success');
  }

  /* ── DELETE APPLICATION ── */
  function deleteApplication() {
    if (!_activeId) return;
    _apps = _apps.filter(a => a.id !== _activeId);
    closeDrawer();
    _renderAll();
    _updateStats();
    App.toast('Application removed.', 'success');
  }

  /* ── OPEN ADD MODAL ── */
  function openAddModal(defaultStage) {
    const stage = document.getElementById('addStage');
    if (stage && defaultStage) stage.value = defaultStage;
    const date  = document.getElementById('addDate');
    if (date) date.value = new Date().toISOString().split('T')[0];
    App.openModal('addAppModal');
  }

  /* ── ADD APPLICATION ── */
  function addApplication() {
    const company  = document.getElementById('addCompany')?.value.trim();
    const position = document.getElementById('addPosition')?.value.trim();
    const stage    = document.getElementById('addStage')?.value || 'draft';
    const ats      = parseInt(document.getElementById('addATS')?.value) || 0;
    const date     = document.getElementById('addDate')?.value || '';
    const resume   = document.getElementById('addResume')?.value.trim() || '';

    if (!company || !position) { App.toast('Company and position are required.', 'warning'); return; }

    const id = 'app' + Date.now();
    _apps.push({ id, company, role: position, stage, ats, date, resume, recruiter: '', recruiterEmail: '', notes: '', timeline: [{ stage, date: date || new Date().toISOString().split('T')[0] }] });

    App.closeModal('addAppModal');
    _clearAddForm();
    _renderAll();
    _updateStats();
    App.toast('Application added!', 'success');
  }

  function _clearAddForm() {
    ['addCompany', 'addPosition', 'addATS', 'addDate', 'addResume'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });
    const stage = document.getElementById('addStage');
    if (stage) stage.value = 'draft';
  }

  /* ── HELPERS ── */
  function _set(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  }

  function _fmtDate(dateStr) {
    try {
      return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch { return dateStr; }
  }

  function _esc(str) {
    return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  return { init, filterCards, clearFilters, openDrawer, closeDrawer, saveNotes, deleteApplication, openAddModal, addApplication };
})();

document.addEventListener('DOMContentLoaded', () => Tracker.init());
