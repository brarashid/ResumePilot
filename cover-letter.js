/**
 * ResumePilot — cover-letter.js
 */

const CoverLetter = (() => {

  let _editMode = false;
  let _generated = false;

  /* ── GENERATED LETTERS by resume ── */
  const LETTERS = {
    res1: `Lagos, Nigeria
${_today()}

Hiring Manager
Google
Mountain View, CA

Dear Hiring Manager,

I am writing to express my strong interest in the Senior Software Engineer position at Google. With over 5 years of experience building scalable, high-performance web applications and a proven track record of delivering impactful engineering solutions, I am confident that my skills and passion align perfectly with Google's mission.

In my current role as Senior Frontend Developer at TechVest Africa, I led the development of a React-based fintech dashboard serving 50,000+ active users, achieving a 40% improvement in application performance through code splitting and lazy loading. I also architected a microservices integration layer that reduced API response times by 60% — experience that speaks directly to the scale and complexity of Google's engineering challenges.

What excites me most about Google is the opportunity to work on products that touch billions of lives. Your commitment to engineering excellence, open-source contribution, and a culture of continuous learning resonates deeply with how I approach my craft.

My technical toolkit includes React, TypeScript, Node.js, Python, AWS, and Docker — complemented by strong mentoring, communication, and cross-functional collaboration skills. I thrive in high-performance teams and am deeply passionate about clean, maintainable, and well-tested code.

I would be thrilled to bring my expertise and enthusiasm to the Google engineering team. Thank you for considering my application — I look forward to discussing how I can contribute to your team's continued success.

Warm regards,
John Adebayo
john.adebayo@example.com  |  +234 812 345 6789  |  linkedin.com/in/johnadebayo`,

    res2: `Lagos, Nigeria
${_today()}

Hiring Manager
Flutterwave
Lagos, Nigeria

Dear Hiring Manager,

I am excited to apply for the Lead Frontend Engineer position at Flutterwave. As someone who has followed Flutterwave's remarkable journey in reshaping African fintech infrastructure, I am deeply motivated by the opportunity to contribute to a product that is truly transforming how Africa transacts.

With 5+ years of frontend engineering experience — including leading React development for a fintech platform with 50,000+ users — I bring the technical depth and product sensibility that a high-growth company like Flutterwave demands. My expertise in React, TypeScript, and performance optimization directly aligns with the scale and speed your platform requires.

I have experience mentoring junior engineers, establishing frontend best practices, and collaborating closely with product and design teams to ship delightful user experiences. At Andela, I built reusable component libraries adopted across three enterprise client projects, giving me a strong foundation in the kind of scalable, composable architecture that powers world-class payment products.

Beyond the technical fit, Flutterwave's culture of ownership, speed, and African excellence speaks to me personally. I want to work where the work matters — and there are few places it matters more than building Africa's financial layer.

I would love the chance to bring my passion, skills, and pan-African perspective to your engineering team. I look forward to the possibility of connecting.

Best regards,
John Adebayo
john.adebayo@example.com  |  +234 812 345 6789`,

    res3: `Lagos, Nigeria
${_today()}

Hiring Manager
Shopify
Ottawa, Canada (Remote)

Dear Hiring Manager,

I am writing to apply for the Frontend Engineer position at Shopify. Shopify's mission — to make commerce better for everyone — is one I find deeply compelling, and I am eager to contribute my frontend engineering skills to the platform that powers millions of entrepreneurs worldwide.

Over the past 5 years I have specialized in building fast, accessible, and maintainable React applications. My experience spans fintech dashboards, e-commerce interfaces, and enterprise platforms — giving me broad exposure to the frontend challenges that matter most in a commerce context. I am particularly strong in TypeScript, component architecture, and performance optimization.

At Andela, I contributed to projects for Fortune 500 clients across Africa and the US, implementing CI/CD pipelines that reduced deployment time from 2 hours to 15 minutes and achieving 98% test coverage across all frontend modules. I bring this same discipline and attention to quality to every project I touch.

Remote-first collaboration is something I have practised throughout my career, and I am comfortable working across time zones with distributed teams. I am self-directed, communicate proactively, and believe that great products are built through trust, transparency, and shared ownership.

I would welcome the opportunity to discuss how my background can support Shopify's continued growth. Thank you for your time and consideration.

Yours sincerely,
John Adebayo
john.adebayo@example.com  |  +234 812 345 6789  |  linkedin.com/in/johnadebayo`,
  };

  /* ── HELPERS ── */
  function _today() {
    return new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  function _getSelected(group) {
    return document.querySelector(`.cl-chip[data-group="${group}"].active`)?.dataset.val || '';
  }

  function _getSelectedResume() {
    return document.querySelector('.select-item.selected')?.dataset.resume || 'res1';
  }

  function _updateCounts() {
    const letter = document.getElementById('clLetter');
    const wc     = document.getElementById('clWordCount');
    const cc     = document.getElementById('clCharCount');
    if (!letter) return;
    const text = letter.innerText || '';
    if (wc) wc.textContent = text.trim() ? text.trim().split(/\s+/).length : '—';
    if (cc) cc.textContent = text.trim() ? text.length : '—';
  }

  /* ── GENERATE ── */
  function generate() {
    const jd = document.getElementById('clJD')?.value.trim();
    if (!jd) { App.toast('Please paste a job description first', 'warning'); return; }

    const loading = document.getElementById('clLoading');
    const btn     = document.querySelector('.btn-gen-cl');

    if (loading) loading.classList.add('show');
    if (btn)     { btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...'; }

    // Hide the free overlay while generating
    const freeOverlay = document.getElementById('freeOverlay');
    if (freeOverlay) freeOverlay.style.display = 'none';

    setTimeout(() => {
      if (loading) loading.classList.remove('show');
      if (btn)     { btn.disabled = false; btn.innerHTML = '<i class="fas fa-magic"></i> Generate Cover Letter'; }

      const resumeKey = _getSelectedResume();
      const letter    = LETTERS[resumeKey] || LETTERS.res1;
      const editor    = document.getElementById('clLetter');

      if (editor) {
        editor.textContent = letter;
        _updateCounts();
      }

      const badge = document.getElementById('clBadge');
      if (badge) badge.style.display = 'inline-flex';

      _generated = true;
      App.toast('Cover letter generated!', 'success');
    }, 2000);
  }

  /* ── UNLOCK PREVIEW (demo mode) ── */
  function unlockPreview() {
    const overlay = document.getElementById('freeOverlay');
    if (overlay) overlay.style.display = 'none';
    _updateCounts();
    App.toast('Demo mode — upgrade to Pro to download and save.', 'info');
  }

  /* ── EDIT MODE ── */
  function toggleEdit() {
    _editMode = !_editMode;
    const editor = document.getElementById('clLetter');
    const toggle = document.getElementById('clEditToggle');

    if (editor) editor.contentEditable = _editMode ? 'true' : 'false';

    if (toggle) {
      toggle.classList.toggle('active', _editMode);
      toggle.innerHTML = _editMode
        ? '<i class="fas fa-check"></i> Done'
        : '<i class="fas fa-pen"></i> Edit';
    }

    if (_editMode && editor) editor.focus();
    if (!_editMode) _updateCounts();
    App.toast(_editMode ? 'Click to edit the letter' : 'Changes saved', _editMode ? 'info' : 'success');
  }

  /* ── DOWNLOAD PDF ── */
  function downloadPDF() {
    if (!_generated) { App.toast('Generate a cover letter first', 'warning'); return; }
    App.toast('Preparing PDF — print dialog opening...', 'info');
    setTimeout(() => window.print(), 600);
  }

  /* ── DOWNLOAD DOCX ── */
  function downloadDOCX() {
    if (!_generated) { App.toast('Generate a cover letter first', 'warning'); return; }
    App.toast('DOCX export — connect to a backend to enable this feature.', 'info');
  }

  /* ── SAVE ── */
  function save() {
    const editor = document.getElementById('clLetter');
    if (!editor || !_generated) { App.toast('Nothing to save yet', 'warning'); return; }
    try {
      localStorage.setItem('rp_cover_letter', editor.innerText);
      App.toast('Cover letter saved!', 'success');
    } catch {
      App.toast('Could not save — storage unavailable.', 'error');
    }
  }

  /* ── INIT ── */
  function init() {
    // Chip click handling
    document.querySelectorAll('.cl-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const group = chip.dataset.group;
        document.querySelectorAll(`.cl-chip[data-group="${group}"]`).forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
      });
    });

    // Resume item selection
    document.querySelectorAll('.select-item').forEach(item => {
      item.addEventListener('click', () => {
        document.querySelectorAll('.select-item').forEach(i => i.classList.remove('selected'));
        item.classList.add('selected');
      });
    });

    // Live word/char count when editing
    document.getElementById('clLetter')?.addEventListener('input', _updateCounts);

    // Animate usage bars
    document.querySelectorAll('.usage-bar-fill[data-width]').forEach(el => {
      setTimeout(() => { el.style.width = el.dataset.width + '%'; }, 400);
    });

    // Initial counts
    _updateCounts();
  }

  return { generate, unlockPreview, toggleEdit, downloadPDF, downloadDOCX, save };
})();

document.addEventListener('DOMContentLoaded', () => CoverLetter.init());
