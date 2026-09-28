/* ==========================================================================
   BSH (BS Students Helper) - JSON Component Engine
   Dynamically renders shared Navbar and Footer templates across all pages.
   ========================================================================== */

const BSH_NAVIGATION_CONFIG = {
  "brand": {
    "name": "BSH - Portal for IIT Madras BS Students",
    "logo": "assets/images/logo.webp",
    "homeUrl": "index.html"
  },
  "navLinks": [
    { "title": "Home", "url": "index.html", "pageId": "home" },
    { "title": "Features", "url": "index.html#features", "pageId": "features" },
    { "title": "Quiz Practice", "url": "quiz_practice.html", "pageId": "quiz_practice" },
    { "title": "OPPE Lab", "url": "oppe_practice.html", "pageId": "oppe_practice" },
    { "title": "Calculator", "url": "calculator.html", "pageId": "calculator" },
    { "title": "About Us", "url": "about.html", "pageId": "about" },
    { "title": "Reviews", "url": "index.html#reviews", "pageId": "reviews" },
    { "title": "Feedback", "url": "contact_us.html", "pageId": "feedback" },
    { "title": "FAQ", "url": "index.html#faq", "pageId": "faq" }
  ],
  "actionButtons": [
    { "title": "Practice Quiz", "url": "quiz_practice.html", "type": "secondary", "icon": "fa-solid fa-gamepad" },
    { "title": "Calculate SEC Grade", "url": "calculator.html", "type": "primary", "icon": "fa-solid fa-calculator" }
  ],
  "footer": {
    "description": "The open, student-driven academic companion for IIT Madras BS in Data Science & Electronic Systems.",
    "social": [
      { "name": "Discord", "icon": "fa-brands fa-discord", "comingSoon": "BSH Discord Community" },
      { "name": "GitHub", "icon": "fa-brands fa-github", "comingSoon": "BSH GitHub Repository" },
      { "name": "LinkedIn", "icon": "fa-brands fa-linkedin", "comingSoon": "BSH LinkedIn Network" },
      { "name": "YouTube", "icon": "fa-brands fa-youtube", "comingSoon": "BSH YouTube Tutorials" }
    ],
    "columns": [
      {
        "heading": "Quick Navigation",
        "links": [
          { "title": "Features", "url": "index.html#features" },
          { "title": "Quiz Engine", "url": "quiz_practice.html" },
          { "title": "Calculator", "url": "calculator.html" },
          { "title": "About Us", "url": "about.html" },
          { "title": "Reviews", "url": "index.html#reviews" }
        ]
      },
      {
        "heading": "Core Courses",
        "links": [
          { "title": "Mathematics 1 & 2", "url": "quiz_practice.html" },
          { "title": "Statistics 1 & 2", "url": "quiz_practice.html" },
          { "title": "Computational Thinking", "url": "quiz_practice.html" },
          { "title": "Python Programming", "url": "oppe_practice.html" }
        ]
      },
      {
        "heading": "Community & Support",
        "links": [
          { "title": "FAQ", "url": "index.html#faq" },
          { "title": "Submit Feedback", "url": "contact_us.html" },
          { "title": "Discord Server", "url": "#", "comingSoon": "Official BSH Discord Server" },
          { "title": "Open Source Repo", "url": "#", "comingSoon": "BSH Open Source GitHub Repo" }
        ]
      }
    ],
    "copyright": "© 2026 BSH (BS Students Helper). Built with passion for IITM BS Students."
  }
};

function getBSHRootPrefix(container) {
  if (container && container.dataset.rootPrefix !== undefined) {
    return container.dataset.rootPrefix;
  }
  const currentPath = window.location.pathname.replace(/\\/g, '/');
  if (currentPath.includes('/python/') || currentPath.includes('/java/') || currentPath.includes('/mad2/') || currentPath.includes('/mlt/')) {
    return '../../';
  }
  return '';
}

function getBSHCurrentPageId(container) {
  if (container && container.dataset.activePage) {
    return container.dataset.activePage;
  }
  const path = window.location.pathname.replace(/\\/g, '/');
  const filename = path.split('/').pop() || 'index.html';

  if (filename.includes('quiz_practice') || filename.includes('quiz_1') || filename.includes('quiz_2')) return 'quiz_practice';
  if (filename.includes('oppe_practice')) return 'oppe_practice';
  if (filename.includes('calculator')) return 'calculator';
  if (filename.includes('about')) return 'about';
  if (filename.includes('contact_us')) return 'feedback';
  if (filename.includes('end_term')) return 'quiz_practice';
  if (filename === '' || filename === 'index.html') return 'home';

  return '';
}

function renderBSHHeader(headerEl) {
  if (!headerEl) return;

  const prefix = getBSHRootPrefix(headerEl);
  const activePageId = getBSHCurrentPageId(headerEl);
  const config = BSH_NAVIGATION_CONFIG;

  const navLinksHTML = config.navLinks.map(link => {
    const isExternalOrHash = link.url.includes('#') && !link.url.startsWith('index.html#');
    const fullUrl = link.url.startsWith('#') ? link.url : (prefix + link.url);
    const isActive = activePageId === link.pageId && !link.url.includes('#') ? ' active' : '';
    return `<a href="${fullUrl}" class="nav-link${isActive}">${link.title}</a>`;
  }).join('\n                ');

  const mobileActionsHTML = config.actionButtons.map(btn => {
    return `<a href="${prefix + btn.url}" class="btn btn-${btn.type} btn-full">${btn.title}</a>`;
  }).join('\n                    ');

  const headerHTML = `
        <div class="header-container">
            <!-- BSH Brand Logo -->
            <a href="${prefix + config.brand.homeUrl}" class="brand-logo" aria-label="${config.brand.name}">
                <img src="${prefix + config.brand.logo}" alt="${config.brand.name}" class="logo-img" width="160" height="58">
            </a>

            <!-- Navigation Links & Mobile Menu Drawer -->
            <nav class="nav-menu" id="navMenu">
                ${navLinksHTML}
                <div class="mobile-menu-actions">
                    ${mobileActionsHTML}
                </div>
            </nav>

            <!-- Desktop Header Actions -->
            <div class="header-actions">
                <a href="${prefix}quiz_practice.html" class="btn btn-outline nav-btn-desktop">
                    <i class="fa-solid fa-gamepad"></i>
                    <span>Practice Quiz</span>
                </a>
                <a href="${prefix}calculator.html" class="btn btn-primary nav-btn-desktop">
                    <span>Calculate SEC Grade</span>
                    <i class="fa-solid fa-calculator"></i>
                </a>
                <button class="theme-toggle-btn" id="themeToggleBtn" aria-label="Toggle Light/Dark Theme" title="Toggle Theme">
                    <i class="fa-solid fa-moon"></i>
                </button>
                <button class="mobile-menu-toggle" id="menuToggle" aria-label="Toggle Navigation Menu">
                    <i class="fa-solid fa-bars"></i>
                </button>
            </div>
        </div>
  `;

  headerEl.innerHTML = headerHTML;
}

function renderBSHFooter(footerEl) {
  if (!footerEl) return;

  const prefix = getBSHRootPrefix(footerEl);
  const config = BSH_NAVIGATION_CONFIG;

  const socialHTML = config.footer.social.map(s => {
    return `<a href="#" data-coming-soon="${s.comingSoon}" aria-label="${s.name}"><i class="${s.icon}"></i></a>`;
  }).join('\n                    ');

  const columnsHTML = config.footer.columns.map(col => {
    const linksHTML = col.links.map(l => {
      const href = l.url.startsWith('#') ? l.url : (prefix + l.url);
      const comingSoonAttr = l.comingSoon ? ` data-coming-soon="${l.comingSoon}"` : '';
      return `<li><a href="${href}"${comingSoonAttr}>${l.title}</a></li>`;
    }).join('\n                        ');

    return `
                <div class="footer-col">
                    <h3 class="footer-heading">${col.heading}</h3>
                    <ul>
                        ${linksHTML}
                    </ul>
                </div>`;
  }).join('\n');

  const footerHTML = `
        <div class="container footer-container">
            <div class="footer-brand">
                <a href="${prefix + config.brand.homeUrl}" class="brand-logo footer-logo" aria-label="${config.brand.name}">
                    <img src="${prefix + config.brand.logo}" alt="${config.brand.name}" class="logo-img-footer" width="160" height="58">
                </a>
                <p class="footer-desc">
                    ${config.footer.description}
                </p>
                <div class="social-links">
                    ${socialHTML}
                </div>
            </div>

            <div class="footer-links-group">
                ${columnsHTML}
            </div>
        </div>

        <div class="footer-bottom text-center">
            <div class="container">
                <p>${config.footer.copyright}</p>
            </div>
        </div>
  `;

  footerEl.innerHTML = footerHTML;
}

function initBSHComponents() {
  const headers = document.querySelectorAll('header.site-header, header[data-bsh-component="header"], #header');
  headers.forEach(header => renderBSHHeader(header));

  const footers = document.querySelectorAll('footer.site-footer, footer[data-bsh-component="footer"], footer');
  footers.forEach(footer => renderBSHFooter(footer));
}

// Execute immediately if DOM is ready, or on DOMContentLoaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initBSHComponents);
} else {
  initBSHComponents();
}
