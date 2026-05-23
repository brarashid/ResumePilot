/**
 * ResumePilot — analyzer.js
 */

let _selectedRegion = 'Africa';

/* ── REGION SELECTION ── */
function selectRegion(el) {
  document.querySelectorAll('.region-card').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
  _selectedRegion = el.dataset.region;
}

/* ── URL EXTRACTION (mock) ── */
function extractFromUrl() {
  const url = document.getElementById('jobUrl').value.trim();
  if (!url) { App.toast('Please enter a job URL first', 'warning'); return; }
  App.toast('Extracting job description from URL...', 'info');
  setTimeout(() => {
    document.getElementById('jobDescription').value = _MOCK_JD;
    _updateJdCount();
    App.toast('Job description extracted!', 'success');
  }, 1400);
}

/* ── JD CHARACTER COUNTER ── */
function _updateJdCount() {
  const jd  = document.getElementById('jobDescription');
  const cnt = document.getElementById('jdCount');
  if (jd && cnt) cnt.textContent = jd.value.length + ' characters';
}

/* ── ANALYZE ── */
function analyzeJob() {
  const jd = document.getElementById('jobDescription').value.trim();
  if (jd.length < 50) {
    App.toast('Please paste a job description (at least 50 characters)', 'warning');
    return;
  }

  const btn = document.getElementById('analyzeBtn');
  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Analyzing...';

  document.getElementById('emptyResults').style.display = 'none';
  document.getElementById('resultsPanel').style.display = 'none';

  // Show a loading card while "processing"
  const loader = document.createElement('div');
  loader.id = 'analyzeLoader';
  loader.className = 'card analyze-loading';
  loader.innerHTML = `<div class="analyze-spinner"></div><div class="analyze-loading-text">AI is analyzing your job description...</div>`;
  document.getElementById('resultsPanel').insertAdjacentElement('beforebegin', loader);

  setTimeout(() => {
    loader.remove();
    btn.disabled = false;
    btn.innerHTML = '<i class="fas fa-brain"></i> Analyze Job Description';
    _renderResults(_generateAnalysis(jd));
  }, 2200);
}

/* ── MOCK ANALYSIS ENGINE ── */
function _generateAnalysis(jd) {
  const text = jd.toLowerCase();

  const ALL_KEYWORDS = {
    technical: ['javascript','react','node.js','python','sql','aws','docker','kubernetes','typescript',
                'rest api','graphql','mongodb','postgresql','git','ci/cd','agile','scrum','linux',
                'machine learning','data analysis','excel','power bi','java','spring boot'],
    soft:      ['communication','leadership','teamwork','problem solving','critical thinking',
                'time management','attention to detail','collaboration','adaptability'],
  };

  const matched = [], missing = [];
  [...ALL_KEYWORDS.technical, ...ALL_KEYWORDS.soft].forEach(kw => {
    (text.includes(kw) ? matched : missing).push(kw);
  });

  // Derive score from how many keywords are found
  const score = Math.min(98, Math.max(42, Math.round(50 + (matched.length / (matched.length + missing.length)) * 48)));

  const skills = [
    { name: 'Technical Match', pct: score,            color: '#7C3AED' },
    { name: 'Experience Fit',  pct: score - 8,        color: '#3B82F6' },
    { name: 'Keyword Density', pct: score + 4 > 98 ? 98 : score + 4, color: '#22C55E' },
    { name: 'Soft Skills',     pct: score - 15 < 30 ? 30 : score - 15, color: '#F59E0B' },
  ];

  return { score, matched: matched.slice(0, 14), missing: missing.slice(0, 10), skills };
}

/* ── RENDER RESULTS ── */
function _renderResults({ score, matched, missing, skills }) {
  const panel = document.getElementById('resultsPanel');
  panel.style.display = 'flex';

  // ATS Ring
  _animateRing(score);

  // Score label
  const label = score >= 85 ? 'Excellent Match' : score >= 70 ? 'Good Match' : score >= 55 ? 'Fair Match' : 'Needs Work';
  const desc  = score >= 85
    ? 'Your profile is a strong match for this role. Apply with confidence!'
    : score >= 70
    ? 'Good alignment. Adding a few missing keywords will boost your score.'
    : score >= 55
    ? 'Moderate match. Update your resume to include the missing keywords.'
    : 'Significant gaps found. Tailor your resume carefully before applying.';

  document.getElementById('scoreLabel').textContent = label;
  document.getElementById('scoreDesc').textContent  = desc;

  // Score meter bars
  document.getElementById('scoreMeter').innerHTML = skills.map(s => `
    <div class="score-meter-row">
      <div class="score-meter-label">${s.name}</div>
      <div class="score-meter-bar"><div class="score-meter-fill" style="width:0%;background:${s.color};" data-w="${s.pct}"></div></div>
      <div class="score-meter-val">${s.pct}%</div>
    </div>`).join('');

  // Keywords
  document.getElementById('matchedKeywords').innerHTML = matched.map(k =>
    `<span class="keyword-tag matched"><i class="fas fa-check"></i> ${k}</span>`).join('');
  document.getElementById('missingKeywords').innerHTML = missing.map(k =>
    `<span class="keyword-tag missing"><i class="fas fa-times"></i> ${k}</span>`).join('');

  // Skills gap
  document.getElementById('skillsGap').innerHTML = skills.map(s => `
    <div class="skills-gap-row">
      <div class="skills-gap-name">${s.name}</div>
      <div class="skills-gap-bar-wrap">
        <div class="skills-gap-bar"><div class="skills-gap-fill" style="width:0%;background:${s.color};" data-w="${s.pct}"></div></div>
      </div>
      <div class="skills-gap-pct" style="color:${s.color};">${s.pct}%</div>
    </div>`).join('');

  // Recommendations
  const recs = _buildRecs(score, missing);
  document.getElementById('recommendations').innerHTML = recs.map(r => `
    <div class="rec-item">
      <div class="rec-icon" style="background:${r.bg};">${r.icon}</div>
      <div class="rec-body">
        <div class="rec-title">${r.title}</div>
        <div class="rec-desc">${r.desc}</div>
      </div>
    </div>`).join('');

  // Animate bars after paint
  requestAnimationFrame(() => requestAnimationFrame(() => {
    document.querySelectorAll('[data-w]').forEach(el => {
      el.style.width = el.dataset.w + '%';
    });
  }));

  panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
  App.toast(`Analysis complete — ${score}% match score!`, 'success');
}

/* ── ATS RING ANIMATION ── */
function _animateRing(score) {
  const ring = document.querySelector('#analyzerRing .ats-ring-fill');
  const numEl = document.getElementById('matchScoreNum');
  if (!ring || !numEl) return;

  const r = 52;
  const circumference = 2 * Math.PI * r;
  const color = score >= 85 ? '#22C55E' : score >= 70 ? '#7C3AED' : score >= 55 ? '#F59E0B' : '#EF4444';

  ring.style.strokeDasharray  = circumference;
  ring.style.strokeDashoffset = circumference;
  ring.style.stroke = color;
  ring.style.transition = 'stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)';

  const start = Date.now();
  const tick = () => {
    const p = Math.min((Date.now() - start) / 1200, 1);
    numEl.textContent = Math.round(p * score);
    if (p < 1) requestAnimationFrame(tick);
    else numEl.textContent = score;
  };

  requestAnimationFrame(() => {
    ring.style.strokeDashoffset = circumference * (1 - score / 100);
    requestAnimationFrame(tick);
  });
}

/* ── RECOMMENDATIONS BUILDER ── */
function _buildRecs(score, missing) {
  const recs = [];
  if (missing.length > 0) {
    recs.push({
      icon: '🔑', bg: '#F5F3FF',
      title: 'Add missing keywords to your resume',
      desc: `Include: ${missing.slice(0, 5).join(', ')}${missing.length > 5 ? ` and ${missing.length - 5} more` : ''}.`,
    });
  }
  if (score < 75) {
    recs.push({
      icon: '✍️', bg: '#DCFCE7',
      title: 'Rewrite your professional summary',
      desc: 'Tailor your summary to mirror the job description language and highlight your most relevant skills.',
    });
  }
  recs.push({
    icon: '📊', bg: '#DBEAFE',
    title: 'Quantify your achievements',
    desc: 'Add metrics to bullet points (e.g., "Reduced load time by 40%", "Managed a team of 8 engineers").',
  });
  recs.push({
    icon: '🎯', bg: '#FEF3C7',
    title: 'Match the job title exactly',
    desc: 'Use the exact job title from the posting in your resume header and summary section.',
  });
  if (score >= 80) {
    recs.push({
      icon: '🚀', bg: '#DCFCE7',
      title: 'Strong match — apply now!',
      desc: 'Your profile is well-aligned. Generate a tailored resume and cover letter to maximize your chances.',
    });
  }
  return recs;
}

/* ── NAVIGATE TO GENERATOR ── */
function goToGenerator() {
  const jd = document.getElementById('jobDescription').value.trim();
  if (jd) sessionStorage.setItem('rp_jd', jd);
  window.location.href = 'generator.html';
}

/* ── MOCK JD ── */
const _MOCK_JD = `Senior Software Engineer — Google
Location: Lagos, Nigeria (Remote)

About the role:
We are looking for a Senior Software Engineer to join our growing engineering team. You will design, build, and maintain scalable backend systems and REST APIs.

Requirements:
• 5+ years of experience with JavaScript, Node.js, and React
• Strong knowledge of SQL and MongoDB databases
• Experience with AWS, Docker, and Kubernetes
• Familiarity with CI/CD pipelines and Git workflows
• Excellent communication and teamwork skills
• Experience with Agile/Scrum methodology
• TypeScript experience is a plus
• Problem solving and critical thinking mindset`;

/* ── INIT ── */
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('jobDescription')?.addEventListener('input', _updateJdCount);

  document.querySelectorAll('.usage-bar-fill[data-width]').forEach(el => {
    setTimeout(() => { el.style.width = el.dataset.width + '%'; }, 400);
  });
});
