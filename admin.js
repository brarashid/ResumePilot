/**
 * ResumePilot — admin.js
 * Admin Panel: Users, Templates, AI Usage, Revenue, Downloads
 */

const Admin = (() => {
  /* ─── MOCK DATA ─── */
  const USERS = [
    { id:1,  name:'John Adebayo',     email:'john@example.com',     plan:'Pro',      resumes:8,  joined:'2024-12-10', status:'Active'   },
    { id:2,  name:'Fatima Al-Rashid', email:'fatima@example.com',   plan:'Free',     resumes:2,  joined:'2025-01-05', status:'Active'   },
    { id:3,  name:'Michael Chen',     email:'mchen@example.com',    plan:'Business', resumes:15, joined:'2024-11-20', status:'Active'   },
    { id:4,  name:'Amara Osei',       email:'amara@example.com',    plan:'Pro',      resumes:5,  joined:'2025-02-14', status:'Active'   },
    { id:5,  name:'Sarah Johnson',    email:'sarah.j@example.com',  plan:'Free',     resumes:1,  joined:'2025-03-01', status:'Inactive' },
    { id:6,  name:'David Nkrumah',    email:'david.n@example.com',  plan:'Pro',      resumes:6,  joined:'2025-01-22', status:'Active'   },
    { id:7,  name:'Priya Sharma',     email:'priya.s@example.com',  plan:'Business', resumes:20, joined:'2024-10-08', status:'Active'   },
    { id:8,  name:'Carlos Mendez',    email:'carlos.m@example.com', plan:'Free',     resumes:3,  joined:'2025-03-18', status:'Active'   },
    { id:9,  name:'Aisha Bello',      email:'aisha.b@example.com',  plan:'Pro',      resumes:7,  joined:'2025-02-05', status:'Active'   },
    { id:10, name:"James O'Brien",    email:'james.ob@example.com', plan:'Free',     resumes:0,  joined:'2025-04-01', status:'Inactive' },
    { id:11, name:'Nadia Petrov',     email:'nadia.p@example.com',  plan:'Pro',      resumes:9,  joined:'2024-12-28', status:'Active'   },
    { id:12, name:'Emmanuel Kwame',   email:'ekwame@example.com',   plan:'Business', resumes:18, joined:'2024-09-15', status:'Active'   },
    { id:13, name:'Zara Williams',    email:'zara.w@example.com',   plan:'Pro',      resumes:4,  joined:'2025-04-10', status:'Active'   },
    { id:14, name:'Hassan Ibrahim',   email:'hassan.i@example.com', plan:'Free',     resumes:2,  joined:'2025-04-22', status:'Active'   },
    { id:15, name:'Mei Lin',          email:'mei.l@example.com',    plan:'Business', resumes:22, joined:'2024-08-30', status:'Active'   },
    { id:16, name:'Olumide Adeyemi',  email:'olu.a@example.com',    plan:'Pro',      resumes:11, joined:'2025-01-15', status:'Active'   },
  ];

  const TEMPLATES = [
    { id:1, name:'Executive Classic',  region:'Global',      uses:3420, rating:4.9, category:'Professional', icon:'' },
    { id:2, name:'Modern Minimal',     region:'US/Canada',   uses:5102, rating:4.8, category:'Modern',       icon:'' },
    { id:3, name:'Tech Focused',       region:'US/Canada',   uses:4875, rating:4.7, category:'Technical',    icon:'' },
    { id:4, name:'African Scholar',    region:'Africa',      uses:2890, rating:4.9, category:'Academic',     icon:'' },
    { id:5, name:'Creative Portfolio', region:'Europe',      uses:1950, rating:4.6, category:'Creative',     icon:'' },
    { id:6, name:'Gulf Professional',  region:'Middle East', uses:2100, rating:4.8, category:'Professional', icon:'' },
    { id:7, name:'Clean Impact',       region:'Global',      uses:3800, rating:4.7, category:'Modern',       icon:'' },
    { id:8, name:'Leadership Bold',    region:'US/Canada',   uses:2300, rating:4.5, category:'Executive',    icon:'' },
  ];

  const DOWNLOADS = [
    { user:'John Adebayo',    email:'john@example.com',     resume:'Full-Stack Dev — Google',    format:'PDF',  date:'2025-05-20', plan:'Pro'      },
    { user:'Priya Sharma',    email:'priya.s@example.com',  resume:'Product Manager — Stripe',   format:'DOCX', date:'2025-05-20', plan:'Business' },
    { user:'David Nkrumah',   email:'david.n@example.com',  resume:'Data Analyst — MTN',         format:'PDF',  date:'2025-05-19', plan:'Pro'      },
    { user:'Aisha Bello',     email:'aisha.b@example.com',  resume:'UX Designer — Paystack',     format:'PDF',  date:'2025-05-19', plan:'Pro'      },
    { user:'Michael Chen',    email:'mchen@example.com',    resume:'SRE Engineer — Meta',        format:'DOCX', date:'2025-05-18', plan:'Business' },
    { user:'Amara Osei',      email:'amara@example.com',    resume:'Marketing Lead — Jumia',     format:'PDF',  date:'2025-05-18', plan:'Pro'      },
    { user:'Nadia Petrov',    email:'nadia.p@example.com',  resume:'Backend Engineer — Wise',    format:'PDF',  date:'2025-05-17', plan:'Pro'      },
    { user:'Emmanuel Kwame',  email:'ekwame@example.com',   resume:'CTO Application — Andela',   format:'DOCX', date:'2025-05-17', plan:'Business' },
  ];

  /* ─── STATE ─── */
  let _filter   = '';
  let _plan     = 'all';
  let _page     = 1;
  const PER_PAGE = 8;
  const _charts  = {};
  let _currentTab = 'users';

  /* ─── INIT ─── */
  function init() {
    _renderUsersTable();
    _renderTemplatesGrid();
    _renderDownloadsTable();
  }

  /* ─── TAB SWITCH ─── */
  function switchTab(tabId, btnEl) {
    document.querySelectorAll('.admin-tab-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.admin-tab').forEach(el => el.classList.remove('active'));
    const panel = document.getElementById('tab-' + tabId);
    if (panel) panel.classList.add('active');
    if (btnEl) btnEl.classList.add('active');
    _currentTab = tabId;
    requestAnimationFrame(() => {
      if (tabId === 'ai-usage')  _initAiCharts();
      if (tabId === 'revenue')   _initRevenueCharts();
      if (tabId === 'downloads') _initDownloadsChart();
    });
  }

  /* ─── USERS TABLE ─── */
  function _filteredUsers() {
    return USERS.filter(u => {
      const q = _filter.toLowerCase();
      const matchQ = !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
      const matchP = _plan === 'all' || u.plan.toLowerCase() === _plan.toLowerCase();
      return matchQ && matchP;
    });
  }

  function _renderUsersTable() {
    const tbody = document.getElementById('usersTableBody');
    const pagi  = document.getElementById('usersPagination');
    if (!tbody) return;

    const all   = _filteredUsers();
    const total = all.length;
    const pages = Math.ceil(total / PER_PAGE);
    if (_page > pages && pages > 0) _page = pages;
    const start = (_page - 1) * PER_PAGE;
    const slice = all.slice(start, start + PER_PAGE);

    const avatarColors = [
      'linear-gradient(135deg,#7C3AED,#5B21B6)',
      'linear-gradient(135deg,#3B82F6,#1D4ED8)',
      'linear-gradient(135deg,#22C55E,#15803D)',
      'linear-gradient(135deg,#F59E0B,#B45309)',
      'linear-gradient(135deg,#EF4444,#B91C1C)',
      'linear-gradient(135deg,#EC4899,#BE185D)',
    ];

    if (slice.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:48px;color:var(--text-muted);">
        <i class="fas fa-users" style="font-size:2rem;display:block;margin-bottom:10px;opacity:0.3;"></i>No users found.</td></tr>`;
    } else {
      tbody.innerHTML = slice.map((u, i) => {
        const initials = u.name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();
        const bg = avatarColors[(u.id - 1) % avatarColors.length];
        const planClass = { Pro:'plan-pro', Free:'plan-free', Business:'plan-business' }[u.plan] || '';
        const active = u.status === 'Active';
        return `<tr>
          <td>
            <div style="display:flex;align-items:center;gap:10px;">
              <div style="width:34px;height:34px;border-radius:50%;background:${bg};color:#fff;font-size:0.7rem;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;">${initials}</div>
              <div>
                <div style="font-weight:600;font-size:0.875rem;color:var(--text);">${_esc(u.name)}</div>
                <div style="font-size:0.72rem;color:var(--text-muted);">ID #${u.id}</div>
              </div>
            </div>
          </td>
          <td style="font-size:0.85rem;color:var(--text-secondary);">${_esc(u.email)}</td>
          <td><span class="user-plan-badge ${planClass}">${u.plan}</span></td>
          <td style="font-size:0.875rem;text-align:center;font-weight:600;">${u.resumes}</td>
          <td style="font-size:0.82rem;color:var(--text-muted);">${_fmtDate(u.joined)}</td>
          <td>
            <span style="display:inline-flex;align-items:center;gap:5px;font-size:0.82rem;font-weight:500;color:${active?'var(--success)':'#9CA3AF'};">
              <span style="width:7px;height:7px;border-radius:50%;background:${active?'var(--success)':'#D1D5DB'};${active?'box-shadow:0 0 0 2px #dcfce7;':''}"></span>
              ${u.status}
            </span>
          </td>
          <td>
            <div style="display:flex;gap:5px;">
              <button class="admin-row-btn" title="View" onclick="Admin.viewUser(${u.id})"><i class="fas fa-eye"></i></button>
              <button class="admin-row-btn warn" title="Edit" onclick="Admin.editUser(${u.id})"><i class="fas fa-pen"></i></button>
              <button class="admin-row-btn danger" title="Delete" onclick="Admin.deleteUser(${u.id})"><i class="fas fa-trash"></i></button>
            </div>
          </td>
        </tr>`;
      }).join('');
    }

    // Pagination
    if (pagi) {
      const from = total === 0 ? 0 : start + 1;
      const to   = Math.min(start + PER_PAGE, total);
      let btns = '';
      if (pages > 1) {
        btns += `<button class="page-btn" ${_page===1?'disabled':''} onclick="Admin._pg(${_page-1})"><i class="fas fa-chevron-left"></i></button>`;
        for (let i = 1; i <= pages; i++) {
          if (pages <= 7 || i===1 || i===pages || Math.abs(i-_page)<=1) {
            btns += `<button class="page-btn ${i===_page?'active':''}" onclick="Admin._pg(${i})">${i}</button>`;
          } else if (Math.abs(i-_page)===2) {
            btns += `<button class="page-btn" disabled>…</button>`;
          }
        }
        btns += `<button class="page-btn" ${_page===pages?'disabled':''} onclick="Admin._pg(${_page+1})"><i class="fas fa-chevron-right"></i></button>`;
      }
      pagi.innerHTML = `
        <div class="pagination-info">Showing ${from}–${to} of ${total} users</div>
        <div class="pagination-btns">${btns}</div>`;
    }
  }

  function _pg(p) { _page = p; _renderUsersTable(); }

  function filterUsers(q) { _filter = q; _page = 1; _renderUsersTable(); }
  function filterByPlan(p) { _plan = p; _page = 1; _renderUsersTable(); }

  function viewUser(id) {
    const u = USERS.find(x=>x.id===id);
    if (u) App.toast(`Viewing ${u.name} — detail panel coming soon.`, 'info');
  }
  function editUser(id) {
    const u = USERS.find(x=>x.id===id);
    if (u) App.toast(`Editing ${u.name} — modal coming soon.`, 'info');
  }
  function deleteUser(id) {
    const u = USERS.find(x=>x.id===id);
    if (!u) return;
    if (confirm(`Delete user "${u.name}"? This cannot be undone.`)) {
      USERS.splice(USERS.findIndex(x=>x.id===id), 1);
      _renderUsersTable();
      App.toast(`User "${u.name}" removed.`, 'success');
    }
  }

  /* ─── TEMPLATES GRID ─── */
  function _renderTemplatesGrid() {
    const grid = document.getElementById('adminTemplatesGrid');
    if (!grid) return;
    const accentColors = ['#7C3AED','#3B82F6','#22C55E','#F59E0B','#EF4444','#EC4899','#14B8A6','#8B5CF6'];
    grid.innerHTML = TEMPLATES.map((t,i) => {
      const c = accentColors[i % accentColors.length];
      return `
        <div class="template-admin-card">
          <div class="template-admin-thumb" style="background:linear-gradient(135deg,${c}18,${c}30);border-bottom:3px solid ${c};">
            <div style="font-size:2.5rem;">${t.icon}</div>
            <div style="position:absolute;top:8px;right:8px;background:${c};color:#fff;font-size:0.65rem;font-weight:700;padding:2px 7px;border-radius:10px;">${t.region}</div>
          </div>
          <div class="template-admin-info">
            <div class="template-admin-name">${_esc(t.name)}</div>
            <div class="template-admin-meta">
              <span><i class="fas fa-download" style="color:${c};"></i> ${t.uses.toLocaleString()} uses</span>
              &nbsp;·&nbsp;
              <span><i class="fas fa-star" style="color:#F59E0B;"></i> ${t.rating}</span>
              &nbsp;·&nbsp;
              <span style="color:${c};font-weight:600;">${t.category}</span>
            </div>
            <div class="template-admin-actions">
              <button class="btn btn-secondary" style="padding:5px 12px;font-size:0.78rem;flex:1;" onclick="Admin.editTemplate(${t.id})"><i class="fas fa-pen"></i> Edit</button>
              <button class="btn" style="padding:5px 10px;font-size:0.78rem;background:#FEE2E2;color:#991B1B;border:none;" onclick="Admin.deleteTemplate(${t.id})"><i class="fas fa-trash"></i></button>
            </div>
          </div>
        </div>`;
    }).join('');
  }

  function uploadTemplate() {
    App.toast('Template upload — connect to storage API to enable.', 'info');
  }
  function editTemplate(id) {
    const t = TEMPLATES.find(x=>x.id===id);
    if (t) App.toast(`Editing "${t.name}" — coming soon.`, 'info');
  }
  function deleteTemplate(id) {
    const t = TEMPLATES.find(x=>x.id===id);
    if (!t) return;
    if (confirm(`Delete template "${t.name}"?`)) {
      TEMPLATES.splice(TEMPLATES.findIndex(x=>x.id===id), 1);
      _renderTemplatesGrid();
      App.toast(`Template "${t.name}" deleted.`, 'success');
    }
  }

  /* ─── DOWNLOADS TABLE ─── */
  function _renderDownloadsTable() {
    const tbody = document.getElementById('downloadsTableBody');
    if (!tbody) return;
    tbody.innerHTML = DOWNLOADS.map(d => `
      <tr>
        <td>
          <div style="font-weight:600;font-size:0.875rem;">${_esc(d.user)}</div>
          <div style="font-size:0.75rem;color:var(--text-muted);">${_esc(d.email)}</div>
        </td>
        <td style="font-size:0.85rem;">${_esc(d.resume)}</td>
        <td><span style="display:inline-block;padding:2px 10px;border-radius:20px;font-size:0.72rem;font-weight:700;background:${d.format==='PDF'?'#FEE2E2':'#DBEAFE'};color:${d.format==='PDF'?'#991B1B':'#1E40AF'};">${d.format}</span></td>
        <td style="font-size:0.82rem;color:var(--text-muted);">${_fmtDate(d.date)}</td>
        <td><span style="display:inline-block;padding:2px 10px;border-radius:20px;font-size:0.72rem;font-weight:600;background:${d.plan==='Business'?'#FEF3C7':d.plan==='Pro'?'var(--primary-light)':'#F3F4F6'};color:${d.plan==='Business'?'#92400E':d.plan==='Pro'?'var(--primary)':'#6B7280'};">${d.plan}</span></td>
        <td><button class="admin-row-btn" title="View" onclick="App.toast('Download record retrieved','info')"><i class="fas fa-eye"></i></button></td>
      </tr>`).join('');
  }

  /* ─── CHART: AI USAGE ─── */
  function _initAiCharts() {
    _mkChart('aiRequestsChart', () => new Chart(document.getElementById('aiRequestsChart'), {
      type: 'line',
      data: {
        labels: _days(30),
        datasets: [
          { label:'Resume Gen',   data:_seed(30,200,500), borderColor:'#7C3AED', backgroundColor:'#7C3AED18', fill:true, tension:0.4, pointRadius:2 },
          { label:'JD Analysis',  data:_seed(30,300,700), borderColor:'#3B82F6', backgroundColor:'#3B82F618', fill:true, tension:0.4, pointRadius:2 },
          { label:'Cover Letter', data:_seed(30,80,180),  borderColor:'#22C55E', backgroundColor:'#22C55E18', fill:true, tension:0.4, pointRadius:2 },
        ],
      },
      options: _lineOpts(),
    }));

    _mkChart('aiFeatureChart', () => new Chart(document.getElementById('aiFeatureChart'), {
      type: 'doughnut',
      data: {
        labels: ['Resume Gen','JD Analysis','Cover Letters','ATS Scoring','Keywords'],
        datasets: [{ data:[8492,12847,3201,9440,6320], backgroundColor:['#7C3AED','#3B82F6','#22C55E','#F59E0B','#EC4899'], borderWidth:0, hoverOffset:8 }],
      },
      options: _donutOpts(),
    }));
  }

  /* ─── CHART: REVENUE ─── */
  function _initRevenueCharts() {
    _mkChart('mrrChart', () => new Chart(document.getElementById('mrrChart'), {
      type: 'line',
      data: {
        labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
        datasets: [
          { label:'MRR ($)',      data:[12400,14200,15800,17500,20100,22400,23800,24900,25700,27200,27900,28490], borderColor:'#7C3AED', backgroundColor:'#7C3AED18', fill:true, tension:0.4, pointRadius:3, pointBackgroundColor:'#7C3AED' },
          { label:'Pro Revenue',  data:[7200,8300,9100,10400,11900,13200,14000,14700,15200,16100,16500,16900],    borderColor:'#3B82F6', backgroundColor:'transparent',     tension:0.4, pointRadius:2, borderDash:[4,4] },
        ],
      },
      options: _lineOpts(),
    }));

    _mkChart('planChart', () => new Chart(document.getElementById('planChart'), {
      type: 'doughnut',
      data: {
        labels: ['Free','Pro','Business'],
        datasets: [{ data:[942,273,69], backgroundColor:['#E5E7EB','#7C3AED','#F59E0B'], borderWidth:0, hoverOffset:8 }],
      },
      options: _donutOpts(),
    }));
  }

  /* ─── CHART: DOWNLOADS ─── */
  function _initDownloadsChart() {
    _mkChart('downloadsChart', () => new Chart(document.getElementById('downloadsChart'), {
      type: 'bar',
      data: {
        labels: _days(14),
        datasets: [
          { label:'PDF',  data:_seed(14,120,380), backgroundColor:'#7C3AED', borderRadius:6 },
          { label:'DOCX', data:_seed(14,60,180),  backgroundColor:'#3B82F6', borderRadius:6 },
        ],
      },
      options: {
        responsive:true, maintainAspectRatio:false,
        plugins:{ legend:{ position:'top', labels:{ font:{ family:'DM Sans',size:12 }, padding:16 } } },
        scales:{
          x:{ grid:{ display:false }, ticks:{ font:{ family:'DM Sans',size:11 } } },
          y:{ grid:{ color:'#F3F4F6' },  ticks:{ font:{ family:'DM Sans',size:11 } } },
        },
      },
    }));
  }

  /* ─── CHART HELPERS ─── */
  function _mkChart(id, factory) {
    if (_charts[id]) { _charts[id].destroy(); delete _charts[id]; }
    const el = document.getElementById(id);
    if (!el) return;
    _charts[id] = factory();
  }
  function _lineOpts() {
    return {
      responsive:true, maintainAspectRatio:false,
      interaction:{ mode:'index', intersect:false },
      plugins:{ legend:{ position:'top', labels:{ font:{ family:'DM Sans',size:12 }, padding:16 } } },
      scales:{
        x:{ grid:{ display:false }, ticks:{ font:{ family:'DM Sans',size:11 }, maxRotation:45 } },
        y:{ grid:{ color:'#F3F4F6' },  ticks:{ font:{ family:'DM Sans',size:11 } } },
      },
    };
  }
  function _donutOpts() {
    return { responsive:true, maintainAspectRatio:false, cutout:'65%',
      plugins:{ legend:{ position:'bottom', labels:{ font:{ family:'DM Sans',size:12 }, padding:16 } } } };
  }
  function _days(n) {
    return Array.from({length:n},(_,i)=>{ const d=new Date(); d.setDate(d.getDate()-(n-1-i)); return `${d.getDate()}/${d.getMonth()+1}`; });
  }
  function _seed(len,min,max) {
    return Array.from({length:len},(_,i)=>Math.max(min,Math.min(max,Math.round(min+(max-min)*(0.5+0.4*Math.sin(i*0.7+1.2)+0.1*(Math.random()-0.5))))));
  }

  /* ─── ACTIONS ─── */
  function exportCSV() {
    const header = ['ID','Name','Email','Plan','Resumes','Joined','Status'];
    const rows   = USERS.map(u=>[u.id,u.name,u.email,u.plan,u.resumes,u.joined,u.status]);
    _downloadCSV([header,...rows], `resumepilot-users-${_today()}.csv`);
    App.toast('Users exported as CSV.', 'success');
  }
  function exportDownloadsCSV() {
    const header = ['User','Email','Resume','Format','Date','Plan'];
    const rows   = DOWNLOADS.map(d=>[d.user,d.email,d.resume,d.format,d.date,d.plan]);
    _downloadCSV([header,...rows], `resumepilot-downloads-${_today()}.csv`);
    App.toast('Downloads exported as CSV.', 'success');
  }
  function _downloadCSV(rows, filename) {
    const csv  = rows.map(r=>r.map(c=>`"${String(c).replace(/"/g,'""')}"`).join(',')).join('\n');
    const blob = new Blob([csv],{type:'text/csv'});
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href=url; a.download=filename; a.click(); URL.revokeObjectURL(url);
  }
  function refreshData() {
    const btn = document.querySelector('[onclick="Admin.refreshData()"]');
    if (btn) { btn.innerHTML='<i class="fas fa-sync fa-spin"></i> Refreshing…'; btn.disabled=true; }
    setTimeout(()=>{
      _renderUsersTable(); _renderTemplatesGrid(); _renderDownloadsTable();
      if (_currentTab==='ai-usage')  _initAiCharts();
      if (_currentTab==='revenue')   _initRevenueCharts();
      if (_currentTab==='downloads') _initDownloadsChart();
      if (btn) { btn.innerHTML='<i class="fas fa-sync"></i> Refresh'; btn.disabled=false; }
      App.toast('Data refreshed.', 'success');
    }, 1200);
  }

  /* ─── UTILS ─── */
  function _esc(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
  function _fmtDate(iso){ return new Date(iso).toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'}); }
  function _today(){ return new Date().toISOString().slice(0,10); }

  /* ─── INLINE STYLES for admin-specific micro-components ─── */
  const _css = `
    .user-plan-badge{display:inline-block;padding:2px 10px;border-radius:20px;font-size:0.72rem;font-weight:600;}
    .user-plan-badge.plan-free{background:#F3F4F6;color:#6B7280;}
    .user-plan-badge.plan-pro{background:var(--primary-light);color:var(--primary);}
    .user-plan-badge.plan-business{background:#FEF3C7;color:#92400E;}
    .admin-row-btn{width:28px;height:28px;border-radius:6px;border:1px solid var(--border);background:transparent;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;font-size:0.72rem;color:var(--text-muted);transition:all 0.15s;}
    .admin-row-btn:hover{background:var(--primary-light);color:var(--primary);border-color:var(--primary-mid);}
    .admin-row-btn.warn:hover{background:#FEF3C7;color:#92400E;border-color:#FDE68A;}
    .admin-row-btn.danger:hover{background:#FEE2E2;color:var(--danger);border-color:#FCA5A5;}
    #usersTableBody td{vertical-align:middle;}
  `;
  const _styleEl = document.createElement('style');
  _styleEl.textContent = _css;
  document.head.appendChild(_styleEl);

  /* ─── PUBLIC ─── */
  return { init, switchTab, filterUsers, filterByPlan, viewUser, editUser, deleteUser,
           uploadTemplate, editTemplate, deleteTemplate, exportCSV, exportDownloadsCSV,
           refreshData, _pg };
})();

document.addEventListener('DOMContentLoaded', () => Admin.init());
