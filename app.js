document.addEventListener('DOMContentLoaded', () => {
  const $ = s => document.querySelector(s);
  const $$ = s => document.querySelectorAll(s);

  const landing = $('#page-landing');
  const app = $('#page-app');
  const queryEl = $('#user-query');
  const popup = $('#cite-popup');
  let mode = 'general';

  // Data for citation popups
  const refData = {
    1: { title: 'Prevention of Type 2 Diabetes Mellitus by Changes in Lifestyle', meta: 'Tuomilehto J, et al. · N Engl J Med 2001 · IF 176.1', excerpt: '"Lifestyle changes including moderate exercise and dietary modification reduced diabetes incidence by 58% among high-risk subjects with impaired glucose tolerance."' },
    2: { title: 'Standards of Care in Diabetes — 2024', meta: 'American Diabetes Association · Diabetes Care 2024 · IF 16.2', excerpt: '"Screening for type 2 diabetes should begin at age 35 for all patients, or earlier for those with risk factors including overweight, family history, or certain ethnic backgrounds."' },
    3: { title: '대한당뇨병학회 진료지침 2023', meta: 'Korean Diabetes Association · 2023', excerpt: '"한국인 당뇨병 유병률은 약 16.7%이며, 공복혈당 126mg/dL 이상 또는 HbA1c 6.5% 이상을 진단 기준으로 한다."' },
    4: { title: 'Global Report on Diabetes', meta: 'World Health Organization · 2024', excerpt: '"Approximately 422 million adults worldwide have diabetes, with the majority living in low- and middle-income countries."' }
  };

  // Show app page
  function goApp(q) {
    landing.classList.remove('active');
    app.classList.add('active');
    queryEl.textContent = q;
    // Add to history
    const hist = $('#history-list');
    const first = hist.firstElementChild;
    if (first) first.classList.remove('active');
    const newItem = document.createElement('div');
    newItem.className = 'hist-item active';
    newItem.textContent = q;
    hist.prepend(newItem);
  }

  function goLanding() {
    app.classList.remove('active');
    landing.classList.add('active');
    $('#landing-input').value = '';
  }

  // Landing search
  $('#landing-send').addEventListener('click', () => {
    const q = $('#landing-input').value.trim();
    if (q) goApp(q);
  });
  $('#landing-input').addEventListener('keypress', e => {
    if (e.key === 'Enter') { const q = e.target.value.trim(); if (q) goApp(q); }
  });

  // Chips
  $$('.qchip').forEach(c => c.addEventListener('click', () => goApp(c.dataset.q)));
  $$('.lcat').forEach(c => c.addEventListener('click', () => goApp(c.dataset.q + ' 관련 질환')));

  // Back home
  $('#go-home').addEventListener('click', goLanding);
  $('#new-search-btn').addEventListener('click', goLanding);

  // Top search
  $('#top-search-input').addEventListener('keypress', e => {
    if (e.key === 'Enter') {
      const q = e.target.value.trim();
      if (q) { queryEl.textContent = q; e.target.value = ''; $('#answer-scroll').scrollTop = 0; }
    }
  });

  // Bottom search
  const bottomInput = $('#bottom-input');
  const bottomSend = $('#bottom-send');
  function doBottomSearch() {
    const q = bottomInput.value.trim();
    if (q) { queryEl.textContent = q; bottomInput.value = ''; $('#answer-scroll').scrollTop = 0; }
  }
  bottomSend.addEventListener('click', doBottomSearch);
  bottomInput.addEventListener('keypress', e => { if (e.key === 'Enter') doBottomSearch(); });

  // Mode toggle
  $$('.pill').forEach(p => {
    p.addEventListener('click', () => {
      $$('.pill').forEach(b => b.classList.remove('active'));
      p.classList.add('active');
      mode = p.dataset.mode;
      const label = $('#mode-label');
      if (mode === 'scholar') {
        document.body.classList.add('scholar-mode');
        label.textContent = 'Scholar 모드';
        label.classList.add('scholar');
      } else {
        document.body.classList.remove('scholar-mode');
        label.textContent = '일반 모드';
        label.classList.remove('scholar');
      }
    });
  });

  // Sidebar toggle
  const sidebar = $('#sidebar');
  $('#sidebar-toggle').addEventListener('click', () => {
    sidebar.style.display = sidebar.style.display === 'none' ? 'flex' : 'none';
  });

  // Citation click → popup
  $$('.cite').forEach(cite => {
    cite.addEventListener('click', e => {
      e.stopPropagation();
      const ref = cite.dataset.ref;
      const data = refData[ref];
      if (!data) return;
      $('#cp-num').textContent = ref;
      $('#cp-title').textContent = data.title;
      $('#cp-meta').textContent = data.meta;
      $('#cp-excerpt').textContent = data.excerpt;
      popup.classList.add('show');

      // Highlight source card
      $$('.src-card').forEach(c => c.classList.toggle('active', c.dataset.ref === ref));
      // Highlight ref
      $$('.ref').forEach(r => r.classList.toggle('highlight', r.id === 'ref-' + ref));
    });
  });

  // Close popup
  $('#cp-close').addEventListener('click', () => {
    popup.classList.remove('show');
    $$('.src-card').forEach(c => c.classList.remove('active'));
    $$('.ref').forEach(r => r.classList.remove('highlight'));
  });
  document.addEventListener('click', e => {
    if (!popup.contains(e.target) && !e.target.classList.contains('cite')) {
      popup.classList.remove('show');
      $$('.src-card').forEach(c => c.classList.remove('active'));
      $$('.ref').forEach(r => r.classList.remove('highlight'));
    }
  });

  // Source card click → scroll to ref
  $$('.src-card').forEach(card => {
    card.addEventListener('click', () => {
      const refEl = document.getElementById('ref-' + card.dataset.ref);
      if (refEl) refEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  });

  // Follow-up chips
  $$('.fu-chip').forEach(c => {
    c.addEventListener('click', () => {
      queryEl.textContent = c.textContent;
      $('#answer-scroll').scrollTop = 0;
    });
  });

  // History click
  document.addEventListener('click', e => {
    if (e.target.classList.contains('hist-item')) {
      $$('.hist-item').forEach(h => h.classList.remove('active'));
      e.target.classList.add('active');
      queryEl.textContent = e.target.textContent;
      $('#answer-scroll').scrollTop = 0;
    }
  });
});
