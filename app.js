document.addEventListener('DOMContentLoaded', () => {
  const $ = s => document.querySelector(s);
  const $$ = s => document.querySelectorAll(s);

  const landing = $('#landing-page');
  const answer = $('#answer-page');
  const searchInput = $('#search-input');
  const searchBtn = $('#search-btn');
  const miniSearch = $('#mini-search');
  const backHome = $('#back-home');
  const queryText = $('#query-text');
  const modeIndicator = $('#mode-indicator');

  let mode = 'general';

  // Navigation
  function showAnswer(q) {
    landing.classList.remove('active');
    answer.classList.add('active');
    queryText.textContent = q;
    window.scrollTo(0, 0);
  }

  function showLanding() {
    answer.classList.remove('active');
    landing.classList.add('active');
    searchInput.value = '';
    window.scrollTo(0, 0);
  }

  // Search
  searchBtn.addEventListener('click', () => {
    const q = searchInput.value.trim();
    if (q) showAnswer(q);
  });

  searchInput.addEventListener('keypress', e => {
    if (e.key === 'Enter') { const q = searchInput.value.trim(); if (q) showAnswer(q); }
  });

  miniSearch.addEventListener('keypress', e => {
    if (e.key === 'Enter') {
      const q = miniSearch.value.trim();
      if (q) { queryText.textContent = q; miniSearch.value = ''; window.scrollTo(0, 0); }
    }
  });

  backHome.addEventListener('click', showLanding);

  // Mode toggle (일반 / Scholar)
  $$('.mode-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      $$('.mode-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      mode = btn.dataset.type;
      if (mode === 'scholar') {
        document.body.classList.add('scholar-mode');
        modeIndicator.textContent = 'Scholar 모드';
        modeIndicator.classList.add('scholar');
      } else {
        document.body.classList.remove('scholar-mode');
        modeIndicator.textContent = '일반 모드';
        modeIndicator.classList.remove('scholar');
      }
    });
  });

  // Popular chips
  $$('.p-chip').forEach(c => {
    c.addEventListener('click', () => { showAnswer(c.dataset.q || c.textContent); });
  });

  // Category cards
  $$('.cat-card').forEach(c => {
    c.addEventListener('click', () => { showAnswer(c.dataset.q || c.textContent); });
  });

  // TOC scroll spy
  const tocItems = $$('.toc-item');
  const sections = $$('.section');

  function updateToc() {
    let cur = '';
    sections.forEach(s => { if (s.getBoundingClientRect().top <= 100) cur = s.id; });
    tocItems.forEach(t => {
      t.classList.toggle('active', t.dataset.s === cur);
    });
  }
  window.addEventListener('scroll', updateToc);

  tocItems.forEach(t => {
    t.addEventListener('click', e => {
      e.preventDefault();
      const el = document.getElementById(t.dataset.s);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // Tabs
  $$('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      $$('.tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      $$('.tab-body').forEach(b => b.classList.add('hidden'));
      const target = document.getElementById(tab.dataset.tab);
      if (target) target.classList.remove('hidden');
    });
  });

  // Toggle (collapse)
  $$('.toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = document.getElementById(btn.dataset.target);
      if (target) {
        btn.classList.toggle('open');
        target.classList.toggle('open');
        const span = btn.querySelector('span');
        span.textContent = target.classList.contains('open') ? '접기' : '상세 보기';
      }
    });
  });

  // Citation hover → highlight source panel & reference
  $$('.cite').forEach(cite => {
    cite.addEventListener('mouseenter', () => {
      const ref = cite.dataset.ref;
      $$('.sp-item').forEach(s => s.classList.toggle('active', s.dataset.ref === ref));
      $$('.ref-item').forEach(r => r.classList.toggle('highlight', r.id === 'ref' + ref));
    });
    cite.addEventListener('mouseleave', () => {
      $$('.sp-item').forEach(s => s.classList.remove('active'));
      $$('.ref-item').forEach(r => r.classList.remove('highlight'));
    });
    cite.addEventListener('click', e => {
      e.preventDefault();
      const refEl = document.getElementById('ref' + cite.dataset.ref);
      if (refEl) refEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  });

  // Source panel item click → scroll to ref
  $$('.sp-item').forEach(item => {
    item.addEventListener('click', () => {
      const refEl = document.getElementById('ref' + item.dataset.ref);
      if (refEl) refEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  });

  // Follow-up chips
  $$('.fu-chip').forEach(c => {
    c.addEventListener('click', () => {
      queryText.textContent = c.textContent;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  // Feedback
  $$('.fb-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      $$('.fb-btn').forEach(b => { b.style.opacity = '0.5'; });
      btn.style.opacity = '1';
      btn.style.fontWeight = '600';
      if (btn.classList.contains('fb-up')) {
        btn.textContent = '감사합니다!';
        btn.style.background = 'var(--green-50)';
        btn.style.borderColor = 'var(--green-400)';
        btn.style.color = 'var(--green-700)';
      } else {
        btn.textContent = '개선할게요';
      }
    });
  });
});
