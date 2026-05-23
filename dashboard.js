/**
 * ResumePilot — dashboard.js
 */

const Dashboard = (() => {

  const RESUMES = [
    { company:'Google',      position:'Senior Software Engineer',  ats:92, status:'Applied',      date:'2025-05-18' },
    { company:'Stripe',      position:'Backend Engineer',          ats:88, status:'Interviewing', date:'2025-05-15' },
    { company:'Paystack',    position:'Full-Stack Developer',      ats:95, status:'Applied',      date:'2025-05-12' },
    { company:'Andela',      position:'Lead Engineer',             ats:79, status:'Draft',        date:'2025-05-10' },
    { company:'Flutterwave', position:'React Developer',           ats:84, status:'Applied',      date:'2025-05-08' },
  ];

  const PIPELINE = [
    { label:'Applied',      count:8, color:'#7C3AED' },
    { label:'Screening',    count:4, color:'#3B82F6' },
    { label:'Interviewing', count:2, color:'#F59E0B' },
    { label:'Offer',        count:1, color:'#22C55E' },
    { label:'Rejected',     count:3, color:'#EF4444' },
  ];

  function init() {
    _setGreeting();
    _animateStats();
    _animateUsageBars();
    _renderResumesTable();
    _renderPipelineOverview();
    requestAnimationFrame(_initCharts);
  }

  function _setGreeting() {
    const h = new Date().getHours();
    const part = h < 12 ? 'Morning' : h < 17 ? 'Afternoon' : 'Evening';
    const el = document.getElementById('greetingText');
    if (el) el.textContent = `Good ${part}, John 👋`;
  }

  function _animateStats() {
    _countUp('statResumes', 5, 1200);
    _countUp('statAts', 88, 1500);
    _countUp('statApps', 8, 1000);
  }

  function _countUp(id, target, duration) {
    const el = document.getElementById(id);
    if (!el) return;
    const start = Date.now();
    const tick = () => {
      const p = Math.min((Date.now() - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(ease * target);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  function _animateUsageBars() {
    document.querySelectorAll('.usage-bar-fill[data-width]').forEach(el => {
      setTimeout(() => { el.style.width = el.dataset.width + '%'; }, 400);
    });
  }

  function _renderResumesTable() {
    const tbody = document.getElementById('resumesBody');
    if (!tbody) return;
    const statusStyle = {
      Applied:      'background:#EDE9FE;color:#5B21B6;',
      Interviewing: 'background:#D1FAE5;color:#065F46;',
      Draft:        'background:#F3F4F6;color:#6B7280;',
      Rejected:     'background:#FEE2E2;color:#991B1B;',
    };
    tbody.innerHTML = RESUMES.map(r => {
      const ss = statusStyle[r.status] || '';
      const atsColor = r.ats >= 90 ? '#16A34A' : r.ats >= 75 ? '#D97706' : '#DC2626';
      return `<tr>
        <td><span style="font-weight:600;">${r.company}</span></td>
        <td style="color:var(--text-secondary);font-size:0.85rem;">${r.position}</td>
        <td><span style="font-weight:800;color:${atsColor};font-family:'Syne',sans-serif;">${r.ats}%</span></td>
        <td><span style="display:inline-block;padding:3px 10px;border-radius:20px;font-size:0.72rem;font-weight:700;${ss}">${r.status}</span></td>
        <td>
          <div style="display:flex;gap:6px;">
            <button class="btn btn-sm btn-secondary" style="padding:4px 10px;font-size:0.75rem;" onclick="App.toast('Opening preview...','info')"><i class="fas fa-eye"></i></button>
            <button class="btn btn-sm btn-outline" style="padding:4px 10px;font-size:0.75rem;" onclick="App.toast('Opening editor...','info')"><i class="fas fa-pen"></i></button>
          </div>
        </td>
      </tr>`;
    }).join('');
  }

  function _renderPipelineOverview() {
    const container = document.getElementById('pipelineOverview');
    if (!container) return;
    const total = PIPELINE.reduce((s, p) => s + p.count, 0);
    container.innerHTML = PIPELINE.map(p => `
      <div class="pipeline-item">
        <div class="pipeline-dot" style="background:${p.color};"></div>
        <div class="pipeline-label">${p.label}</div>
        <div class="pipeline-bar-wrap">
          <div class="pipeline-bar">
            <div class="pipeline-bar-fill" style="width:${Math.round(p.count / total * 100)}%;background:${p.color};"></div>
          </div>
        </div>
        <div class="pipeline-count">${p.count}</div>
      </div>`).join('');
  }

  function _initCharts() {
    const pEl = document.getElementById('pipelineChart');
    if (pEl) {
      new Chart(pEl, {
        type: 'doughnut',
        data: {
          labels: PIPELINE.map(p => p.label),
          datasets: [{ data: PIPELINE.map(p => p.count), backgroundColor: PIPELINE.map(p => p.color), borderWidth: 0, hoverOffset: 8 }],
        },
        options: {
          responsive: true,
          cutout: '65%',
          plugins: { legend: { position: 'bottom', labels: { font: { family: 'DM Sans', size: 12 }, padding: 12 } } },
        },
      });
    }

    const aEl = document.getElementById('atsChart');
    if (aEl) {
      new Chart(aEl, {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
          datasets: [{
            label: 'ATS Score',
            data: [62, 71, 78, 84, 88],
            borderColor: '#7C3AED',
            backgroundColor: '#7C3AED18',
            fill: true,
            tension: 0.4,
            pointRadius: 4,
            pointBackgroundColor: '#7C3AED',
          }],
        },
        options: {
          responsive: true,
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { display: false }, ticks: { font: { family: 'DM Sans', size: 11 } } },
            y: { min: 50, max: 100, grid: { color: '#F3F4F6' }, ticks: { font: { family: 'DM Sans', size: 11 } } },
          },
        },
      });
    }
  }

  return { init };
})();

document.addEventListener('DOMContentLoaded', () => Dashboard.init());
