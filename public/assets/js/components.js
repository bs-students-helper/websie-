const BSH_NAVIGATION_CONFIG={brand:{name:"BSH - Portal for IIT Madras BS Students",logo:"assets/images/logo.webp",homeUrl:"index.html"},navLinks:[{title:"Home",url:"index.html",pageId:"home"},{title:"Features",url:"index.html#features",pageId:"features"},{title:"Quiz Practice",url:"quiz_practice.html",pageId:"quiz_practice"},{title:"OPPE Lab",url:"oppe_practice.html",pageId:"oppe_practice"},{title:"Calculator",url:"calculator.html",pageId:"calculator"},{title:"About Us",url:"about.html",pageId:"about"},{title:"Reviews",url:"index.html#reviews",pageId:"reviews"},{title:"Feedback",url:"contact_us.html",pageId:"feedback"},{title:"FAQ",url:"index.html#faq",pageId:"faq"}],actionButtons:[{title:"Practice Quiz",url:"quiz_practice.html",type:"secondary",icon:"fa-solid fa-gamepad"},{title:"Calculate SEC Grade",url:"calculator.html",type:"primary",icon:"fa-solid fa-calculator"}],footer:{description:"The open, student-driven academic companion for IIT Madras BS in Data Science & Electronic Systems.",social:[{name:"Discord",icon:"fa-brands fa-discord",comingSoon:"BSH Discord Community"},{name:"GitHub",icon:"fa-brands fa-github",comingSoon:"BSH GitHub Repository"},{name:"LinkedIn",icon:"fa-brands fa-linkedin",comingSoon:"BSH LinkedIn Network"},{name:"YouTube",icon:"fa-brands fa-youtube",comingSoon:"BSH YouTube Tutorials"}],columns:[{heading:"Quick Navigation",links:[{title:"Features",url:"index.html#features"},{title:"Quiz Engine",url:"quiz_practice.html"},{title:"Calculator",url:"calculator.html"},{title:"About Us",url:"about.html"},{title:"Reviews",url:"index.html#reviews"}]},{heading:"Core Courses",links:[{title:"Mathematics 1 & 2",url:"quiz_practice.html"},{title:"Statistics 1 & 2",url:"quiz_practice.html"},{title:"Computational Thinking",url:"quiz_practice.html"},{title:"Python Programming",url:"oppe_practice.html"}]},{heading:"Community & Support",links:[{title:"FAQ",url:"index.html#faq"},{title:"Submit Feedback",url:"contact_us.html"},{title:"Discord Server",url:"#",comingSoon:"Official BSH Discord Server"},{title:"Open Source Repo",url:"#",comingSoon:"BSH Open Source GitHub Repo"}]}],copyright:"\xA9 2026 BSH (BS Students Helper). Built with passion for IITM BS Students."}};function getBSHRootPrefix(a){if(a&&a.dataset&&a.dataset.rootPrefix!==void 0){let e=a.dataset.rootPrefix.trim();return e==="/"||e===""||e.startsWith("../")?"/":(e.endsWith("/")||(e+="/"),e)}return"/"}function getBSHCurrentPageId(a){if(a&&a.dataset&&a.dataset.activePage)return a.dataset.activePage;const e=window.location.pathname.replace(/\\/g,"/").split("/").pop()||"index.html";return e.includes("quiz_practice")||e.includes("quiz_1")||e.includes("quiz_2")||e.includes("end_term")?"quiz_practice":e.includes("oppe_practice")?"oppe_practice":e.includes("calculator")?"calculator":e.includes("about")?"about":e.includes("contact_us")?"feedback":e===""||e==="index.html"?"home":""}function renderBSHHeader(a){if(!a)return;const e=getBSHRootPrefix(a),t=getBSHCurrentPageId(a),c=BSH_NAVIGATION_CONFIG,u=c.navLinks.map(l=>{const s=l.url.startsWith("#")?l.url:e+l.url,S=t===l.pageId&&!l.url.includes("#")?" active":"";return`<a href="${s}" class="nav-link${S}">${l.title}</a>`}).join(`
`),o=["quiz_practice","oppe_practice","calculator"].includes(t),n=`
    <a href="${e}index.html" class="nav-link${t==="home"?" active":""}">Home</a>
    <div class="mobile-features-group">
      <button type="button" class="mobile-features-toggle${o?" active":""}" aria-expanded="true">
        <span>Features</span>
        <i class="fa-solid fa-chevron-down toggle-icon"></i>
      </button>
      <div class="mobile-submenu" id="mobileFeaturesSubmenu">
        <a href="${e}quiz_practice.html" class="mobile-submenu-link${t==="quiz_practice"?" active":""}">
          <span>Quiz Practice</span>
        </a>
        <a href="${e}oppe_practice.html" class="mobile-submenu-link${t==="oppe_practice"?" active":""}">
          <span>OPPE Lab</span>
        </a>
        <a href="${e}calculator.html" class="mobile-submenu-link${t==="calculator"?" active":""}">
          <span>Calculator</span>
        </a>
      </div>
    </div>
    <a href="${e}about.html" class="nav-link${t==="about"?" active":""}">About Us</a>
    <a href="${e}index.html#reviews" class="nav-link">Reviews</a>
    <a href="${e}contact_us.html" class="nav-link${t==="feedback"?" active":""}">Feedback</a>
    <a href="${e}index.html#faq" class="nav-link">FAQ</a>
  `,h=c.actionButtons.map(l=>`<a href="${e+l.url}" class="btn btn-${l.type} btn-full">${l.title}</a>`).join(`
`),d=`
    <div class="header-container">
      <a href="${e+c.brand.homeUrl}" class="brand-logo" aria-label="${c.brand.name}">
        <img src="${e+c.brand.logo}" alt="${c.brand.name}" class="logo-img" width="160" height="58">
      </a>
      <nav class="nav-menu" id="navMenu">
        <div class="nav-links-desktop">
          ${u}
        </div>
        <div class="nav-links-mobile">
          ${n}
          <div class="mobile-menu-actions">
            ${h}
          </div>
        </div>
      </nav>
      <div class="header-actions">
        <a href="${e}quiz_practice.html" class="btn btn-outline nav-btn-desktop">
          <i class="fa-solid fa-gamepad"></i>
          <span>Practice Quiz</span>
        </a>
        <a href="${e}calculator.html" class="btn btn-primary nav-btn-desktop">
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
  `;a.innerHTML=d;const f=a.querySelector(".mobile-features-toggle"),m=a.querySelector("#mobileFeaturesSubmenu");f&&m&&f.addEventListener("click",l=>{l.preventDefault(),l.stopPropagation(),m.classList.toggle("collapsed"),f.classList.toggle("collapsed"),f.setAttribute("aria-expanded",!m.classList.contains("collapsed"))});const p=a.querySelector("#menuToggle"),v=a.querySelector("#navMenu");p&&v&&p.addEventListener("click",l=>{l.preventDefault(),l.stopPropagation(),v.classList.toggle("active");const s=p.querySelector("i");s&&(s.className=v.classList.contains("active")?"fa-solid fa-xmark":"fa-solid fa-bars")}),a.querySelectorAll(".nav-link, .mobile-submenu-link, .btn-full").forEach(l=>{l.addEventListener("click",()=>{if(!l.classList.contains("mobile-features-toggle")&&v){v.classList.remove("active");const s=p?p.querySelector("i"):null;s&&(s.className="fa-solid fa-bars")}})})}function renderBSHFooter(a){if(!a)return;const e=getBSHRootPrefix(a),t=BSH_NAVIGATION_CONFIG,c=t.footer.social.map(n=>`<a href="#" data-coming-soon="${n.comingSoon}" aria-label="${n.name}"><i class="${n.icon}"></i></a>`).join(`
`),u=t.footer.columns.map(n=>{const h=n.links.map(d=>{const f=d.url.startsWith("#")?d.url:e+d.url,m=d.comingSoon?` data-coming-soon="${d.comingSoon}"`:"";return`<li><a href="${f}"${m}>${d.title}</a></li>`}).join(`
`);return`
      <div class="footer-col">
        <h3 class="footer-heading">${n.heading}</h3>
        <ul>${h}</ul>
      </div>`}).join(`
`),o=`
    <div class="container footer-container">
      <div class="footer-brand">
        <a href="${e+t.brand.homeUrl}" class="brand-logo footer-logo" aria-label="${t.brand.name}">
          <img src="${e+t.brand.logo}" alt="${t.brand.name}" class="logo-img-footer" width="160" height="58">
        </a>
        <p class="footer-desc">${t.footer.description}</p>
        <div class="social-links">${c}</div>
      </div>
      <div class="footer-links-group">${u}</div>
    </div>
    <div class="footer-bottom text-center">
      <div class="container">
        <p>${t.footer.copyright}</p>
      </div>
    </div>
  `;a.innerHTML=o}function setupSearchableCourseSelect(a,e){const t=typeof a=="string"?document.getElementById(a):a;if(!t)return;const c=t.closest(".filter-group")||t.parentElement;if(!c)return;const u=Array.from(t.options).map(i=>({value:i.value,text:i.textContent.trim()}));let o=c.querySelector(".searchable-select");o&&o.remove(),o=document.createElement("div"),o.className="searchable-select";const n=document.createElement("button");n.type="button",n.className="searchable-select-btn";const h=document.createElement("span");h.className="searchable-select-label";const d=u.length>0&&u[0].value===""?u[0].text:"Select course...";h.textContent=t.value&&u.find(i=>i.value===t.value)?.text||d;const f=document.createElement("i");f.className="fa-solid fa-up-down searchable-select-arrow",n.appendChild(h),n.appendChild(f);const m=document.createElement("div");m.className="searchable-select-dropdown";const p=document.createElement("div");p.className="searchable-dropdown-search-wrap";const v=document.createElement("i");v.className="fa-solid fa-magnifying-glass searchable-search-icon";const l=document.createElement("input");l.type="text",l.className="searchable-dropdown-search-input",l.placeholder="Search course...",l.autocomplete="off",p.appendChild(v),p.appendChild(l);const s=document.createElement("div");s.className="searchable-options-list",m.appendChild(p),m.appendChild(s),o.appendChild(n),o.appendChild(m),t.style.display="none",c.appendChild(o);function S(i=""){s.innerHTML="";const b=i.trim().toLowerCase();let $=0;if(u.forEach(r=>{if(r.value===""&&u.length>1)return;const C=r.text.toLowerCase(),x=r.value.toLowerCase();if(!b||C.includes(b)||x.includes(b)){$++;const g=document.createElement("div"),k=r.value===t.value;g.className="searchable-option"+(k?" selected":""),g.dataset.value=r.value,g.innerHTML=`<span>${r.text}</span>`,k&&(g.innerHTML+='<i class="fa-solid fa-check searchable-check-icon"></i>'),g.addEventListener("click",E=>{E.stopPropagation(),L(r.value,r.text)}),s.appendChild(g)}}),$===0){const r=document.createElement("div");r.className="searchable-option-no-match",r.textContent="No courses found",s.appendChild(r)}}function L(i,b){t.value=i,h.textContent=i?b:d,i?n.classList.add("has-value"):n.classList.remove("has-value"),o.classList.remove("open"),l.value="",t.dispatchEvent(new Event("change",{bubbles:!0})),typeof e=="function"&&e()}function y(){o.classList.contains("open")?o.classList.remove("open"):(document.querySelectorAll(".searchable-select.open").forEach(i=>i.classList.remove("open")),o.classList.add("open"),S(""),setTimeout(()=>l.focus(),50))}if(n.addEventListener("click",i=>{i.stopPropagation(),y()}),l.addEventListener("click",i=>i.stopPropagation()),l.addEventListener("input",()=>S(l.value)),document.addEventListener("click",i=>{o.contains(i.target)||o.classList.remove("open")}),t.value){const i=u.find(b=>b.value===t.value);i&&(h.textContent=i.text,n.classList.add("has-value"))}}function initBSHComponents(){document.querySelectorAll('header.site-header, header[data-bsh-component="header"], #header').forEach(a=>renderBSHHeader(a)),document.querySelectorAll('footer.site-footer, footer[data-bsh-component="footer"], footer').forEach(a=>renderBSHFooter(a))}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",initBSHComponents):initBSHComponents();
