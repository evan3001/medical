// ===== MediAnswer App =====

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const landingPage = document.getElementById('landing-page');
  const answerPage = document.getElementById('answer-page');
  const searchInput = document.getElementById('search-input');
  const searchBtn = document.getElementById('search-btn');
  const miniSearch = document.getElementById('mini-search');
  const backToHome = document.getElementById('back-to-home');
  const queryText = document.getElementById('query-text');
  const modeIndicator = document.getElementById('mode-indicator');
  const typeBtns = document.querySelectorAll('.type-btn');
  const chips = document.querySelectorAll('.chip');
  const tocLinks = document.querySelectorAll('.toc-link');
  const treatmentTabs = document.querySelectorAll('.treatment-tab');
  const depthToggles = document.querySelectorAll('.depth-toggle');
  const followupChips = document.querySelectorAll('.followup-chip');
  const categoryCards = document.querySelectorAll('.category-card');

  let currentMode = 'general'; // 'general' or 'expert'

  // ===== Page Navigation =====
  function showAnswerPage(query) {
    landingPage.classList.remove('active');
    answerPage.classList.add('active');
    queryText.textContent = query;
    miniSearch.value = '';
    window.scrollTo(0, 0);
  }

  function showLandingPage() {
    answerPage.classList.remove('active');
    landingPage.classList.add('active');
    searchInput.value = '';
    window.scrollTo(0, 0);
  }

  // ===== Search =====
  function performSearch() {
    const query = searchInput.value.trim();
    if (query) {
      showAnswerPage(query);
    }
  }

  searchBtn.addEventListener('click', performSearch);
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') performSearch();
  });

  miniSearch.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      const query = miniSearch.value.trim();
      if (query) {
        queryText.textContent = query;
        miniSearch.value = '';
        window.scrollTo(0, 0);
      }
    }
  });

  // Back to home
  backToHome.addEventListener('click', showLandingPage);

  // ===== User Type Toggle =====
  typeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      typeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentMode = btn.dataset.type;

      if (currentMode === 'expert') {
        document.body.classList.add('expert-mode');
        modeIndicator.textContent = '🤓 전문가 모드';
        modeIndicator.classList.add('expert-mode');
      } else {
        document.body.classList.remove('expert-mode');
        modeIndicator.textContent = '👤 일반인 모드';
        modeIndicator.classList.remove('expert-mode');
      }
    });
  });

  // ===== Popular Query Chips =====
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      const query = chip.dataset.query || chip.textContent;
      searchInput.value = query;
      showAnswerPage(query);
    });
  });

  // ===== Category Cards =====
  categoryCards.forEach(card => {
    card.addEventListener('click', () => {
      const category = card.dataset.category;
      searchInput.value = category + ' 관련 질환';
      showAnswerPage(category + ' 관련 질환');
    });
  });

  // ===== TOC Scroll Spy =====
  const sections = document.querySelectorAll('.answer-section');

  function updateTocActive() {
    let currentSection = '';

    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= 120) {
        currentSection = section.id;
      }
    });

    tocLinks.forEach(link => {
      link.classList.remove('active');
      if (link.dataset.section === currentSection) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', updateTocActive);

  // TOC click
  tocLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.getElementById(link.dataset.section);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ===== Treatment Tabs =====
  treatmentTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      treatmentTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      // Hide all tab contents
      document.querySelectorAll('.treatment-content').forEach(c => {
        c.style.display = 'none';
      });

      // Show selected tab content
      const targetId = 'tab-' + tab.dataset.tab;
      const targetContent = document.getElementById(targetId);
      if (targetContent) {
        targetContent.style.display = 'block';
      }
    });
  });

  // ===== Depth Toggles (Collapsible) =====
  depthToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const targetId = toggle.dataset.target;
      const target = document.getElementById(targetId);

      if (target) {
        toggle.classList.toggle('expanded');
        target.classList.toggle('expanded');

        const text = toggle.querySelector('.toggle-text');
        if (target.classList.contains('expanded')) {
          text.textContent = '접기';
        } else {
          text.textContent = '상세 보기';
        }
      }
    });
  });

  // ===== Follow-up Chips =====
  followupChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const query = chip.textContent;
      queryText.textContent = query;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  // ===== Feedback Buttons =====
  document.querySelectorAll('.fb-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.fb-btn').forEach(b => {
        b.style.opacity = '0.5';
      });
      btn.style.opacity = '1';
      btn.style.fontWeight = '700';

      if (btn.classList.contains('fb-good')) {
        btn.textContent = '👍 감사합니다!';
      } else {
        btn.textContent = '👎 개선할게요';
      }
    });
  });
});
