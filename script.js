    // Elements
    const openBtn = document.getElementById('openBtn');
    const closeBtn = document.getElementById('closeBtn');
    const overlay = document.getElementById('overlay');
    const sidebar = document.getElementById('sidebar');
    const themeHeader = document.getElementById('themeToggleHeader');
    const themeSidebar = document.getElementById('themeToggleSidebar');
    const iconHeader = document.getElementById('themeIconHeader');
    const iconSidebar = document.getElementById('themeIconSidebar');
    const THEME_KEY = 'superloja:theme';
    const POP_MS = 220;

    // Open / close sidebar
    function openSidebar() {
      sidebar.classList.add('show');
      overlay.classList.add('show');
      sidebar.setAttribute('aria-hidden', 'false');
      overlay.setAttribute('aria-hidden', 'false');
      // move focus
      setTimeout(() => {
        const f = sidebar.querySelector('input, a, button');
        if (f) f.focus();
      }, 80);
    }

    function closeSidebar() {
      sidebar.classList.remove('show');
      overlay.classList.remove('show');
      sidebar.setAttribute('aria-hidden', 'true');
      overlay.setAttribute('aria-hidden', 'true');
      openBtn.focus();
    }

    openBtn.addEventListener('click', openSidebar);
    closeBtn.addEventListener('click', closeSidebar);
    overlay.addEventListener('click', closeSidebar);

    // ESC key closes sidebar
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && sidebar.classList.contains('show')) closeSidebar();
    });

    // apply theme and set emoji icons (dark -> moon, light -> sun)
    function setEmojiIcons(isDark) {
      const moon = '🌙';
      const sun = '☀️';
      // choose emoji values
      const headEmoji = isDark ? moon : sun;
      const sideEmoji = isDark ? moon : sun;

      // set icons
      if (iconHeader) {
        iconHeader.textContent = headEmoji;
        // add small pop animation
        iconHeader.classList.add('pop');
        setTimeout(() => iconHeader.classList.remove('pop'), POP_MS);
      }
      if (iconSidebar) {
        iconSidebar.textContent = sideEmoji;
        iconSidebar.classList.add('pop');
        setTimeout(() => iconSidebar.classList.remove('pop'), POP_MS);
      }
    }

    function applyTheme(isDark) {
      if (isDark) {
        document.documentElement.classList.add('theme-dark');
        if (themeHeader) themeHeader.checked = true;
        if (themeSidebar) themeSidebar.checked = true;
        if (themeHeader) themeHeader.setAttribute('aria-checked', 'true');
        if (themeSidebar) themeSidebar.setAttribute('aria-checked', 'true');
        localStorage.setItem(THEME_KEY, 'dark');
      } else {
        document.documentElement.classList.remove('theme-dark');
        if (themeHeader) themeHeader.checked = false;
        if (themeSidebar) themeSidebar.checked = false;
        if (themeHeader) themeHeader.setAttribute('aria-checked', 'false');
        if (themeSidebar) themeSidebar.setAttribute('aria-checked', 'false');
        localStorage.setItem(THEME_KEY, 'light');
      }
      // update emojis (with animation)
      setEmojiIcons(isDark);
    }

    function toggleThemeFromInput(e) {
      applyTheme(e.target.checked);
    }

    if (themeHeader) themeHeader.addEventListener('change', toggleThemeFromInput);
    if (themeSidebar) themeSidebar.addEventListener('change', toggleThemeFromInput);

    // init theme from storage
    (function initTheme() {
      const saved = localStorage.getItem(THEME_KEY);
      const isDark = (saved === 'dark');
      applyTheme(isDark);
    })();

    // Search: apply mobile search into cards
    const searchMobile = document.getElementById('searchMobile');
    const searchApply = document.getElementById('searchApply');
    if (searchApply) {
      searchApply.addEventListener('click', () => {
        const q = (searchMobile.value || '').trim().toLowerCase();
        filterCards(q);
        closeSidebar();
      });
    }

    function filterCards(q) {
      const cards = document.querySelectorAll('.card');
      let any = false;
      cards.forEach(card => {
        const title = (card.querySelector('.body > div')?.textContent || '').toLowerCase();
        if (!q || title.includes(q)) {
          card.style.display = '';
          any = true;
        } else {
          card.style.display = 'none';
        }
      });
    }

    // small cart demo
    function addCart(btn) {
      const span = document.querySelector('.cart-btn span');
      let n = parseInt(span.textContent || '0', 10) || 0;
      n++;
      span.textContent = n;
      btn.textContent = 'Adicionado ✓';
      btn.disabled = true;
      setTimeout(() => {
        btn.textContent = 'Comprar';
        btn.disabled = false;
      }, 1100);
    }

    // focus trap in sidebar (basic)
    sidebar.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return;
      const focusables = sidebar.querySelectorAll('a,button,input');
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });

    // close sidebar on resize if desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && sidebar.classList.contains('show')) closeSidebar();
    });