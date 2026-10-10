const BSH_NAVIGATION_CONFIG={brand:{name:"BSH - Portal for IIT Madras BS Students",logo:"assets/images/logo.webp",homeUrl:"index.html"},navLinks:[{title:"Home",url:"index.html",pageId:"home"},{title:"Features",url:"index.html#features",pageId:"features"},{title:"Quiz Practice",url:"quiz_practice.html",pageId:"quiz_practice"},{title:"OPPE Lab",url:"oppe_practice.html",pageId:"oppe_practice"},{title:"Calculator",url:"calculator.html",pageId:"calculator"},{title:"About Us",url:"about.html",pageId:"about"},{title:"Reviews",url:"index.html#reviews",pageId:"reviews"},{title:"Feedback",url:"contact_us.html",pageId:"feedback"},{title:"FAQ",url:"index.html#faq",pageId:"faq"}],actionButtons:[{title:"Practice Quiz",url:"quiz_practice.html",type:"secondary",icon:"fa-solid fa-gamepad"},{title:"Calculate SEC Grade",url:"calculator.html",type:"primary",icon:"fa-solid fa-calculator"}],footer:{description:"The open, student-driven academic companion for IIT Madras BS in Data Science & Electronic Systems.",social:[{name:"Discord",icon:"fa-brands fa-discord",comingSoon:"BSH Discord Community"},{name:"GitHub",icon:"fa-brands fa-github",comingSoon:"BSH GitHub Repository"},{name:"LinkedIn",icon:"fa-brands fa-linkedin",comingSoon:"BSH LinkedIn Network"},{name:"YouTube",icon:"fa-brands fa-youtube",comingSoon:"BSH YouTube Tutorials"}],columns:[{heading:"Quick Navigation",links:[{title:"Features",url:"index.html#features"},{title:"Quiz Engine",url:"quiz_practice.html"},{title:"Calculator",url:"calculator.html"},{title:"About Us",url:"about.html"},{title:"Reviews",url:"index.html#reviews"}]},{heading:"Core Courses",links:[{title:"Mathematics 1 & 2",url:"quiz_practice.html"},{title:"Statistics 1 & 2",url:"quiz_practice.html"},{title:"Computational Thinking",url:"quiz_practice.html"},{title:"Python Programming",url:"oppe_practice.html"}]},{heading:"Community & Support",links:[{title:"FAQ",url:"index.html#faq"},{title:"Submit Feedback",url:"contact_us.html"},{title:"Discord Server",url:"#",comingSoon:"Official BSH Discord Server"},{title:"Open Source Repo",url:"#",comingSoon:"BSH Open Source GitHub Repo"}]}],copyright:"\xA9 2026 BSH (BS Students Helper). Built with passion for IITM BS Students."}};function getBSHRootPrefix(a){if(a&&a.dataset.rootPrefix!==void 0)return a.dataset.rootPrefix;const e=window.location.pathname.replace(/\\/g,"/");return e.includes("/python/")||e.includes("/java/")||e.includes("/mad2/")||e.includes("/mlt/")?"../../":""}function getBSHCurrentPageId(a){if(a&&a.dataset.activePage)return a.dataset.activePage;const e=window.location.pathname.replace(/\\/g,"/").split("/").pop()||"index.html";return e.includes("quiz_practice")||e.includes("quiz_1")||e.includes("quiz_2")?"quiz_practice":e.includes("oppe_practice")?"oppe_practice":e.includes("calculator")?"calculator":e.includes("about")?"about":e.includes("contact_us")?"feedback":e.includes("end_term")?"quiz_practice":e===""||e==="index.html"?"home":""}function renderBSHHeader(a){if(!a)return;const e=getBSHRootPrefix(a),t=getBSHCurrentPageId(a),c=BSH_NAVIGATION_CONFIG,d=c.navLinks.map(i=>{const v=i.url.startsWith("#")?i.url:e+i.url,s=t===i.pageId&&!i.url.includes("#")?" active":"";return`<a href="${v}" class="nav-link${s}">${i.title}</a>`}).join(`
                    `),l=["quiz_practice","oppe_practice","calculator"].includes(t),o=`
                <a href="${e}index.html" class="nav-link${t==="home"?" active":""}">Home</a>
                <div class="mobile-features-group">
                    <button type="button" class="mobile-features-toggle${l?" active":""}" aria-expanded="true">
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
  `,p=c.actionButtons.map(i=>`<a href="${e+i.url}" class="btn btn-${i.type} btn-full">${i.title}</a>`).join(`
                    `),u=`
        <div class="header-container">
            <!-- BSH Brand Logo -->
            <a href="${e+c.brand.homeUrl}" class="brand-logo" aria-label="${c.brand.name}">
                <img src="${e+c.brand.logo}" alt="${c.brand.name}" class="logo-img" width="160" height="58">
            </a>

            <!-- Navigation Links & Mobile Menu Drawer -->
            <nav class="nav-menu" id="navMenu">
                <div class="nav-links-desktop">
                    ${d}
                </div>
                <div class="nav-links-mobile">
                    ${o}
                    <div class="mobile-menu-actions">
                        ${p}
                    </div>
                </div>
            </nav>

            <!-- Desktop Header Actions -->
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
  `;a.innerHTML=u;const h=a.querySelector(".mobile-features-toggle"),m=a.querySelector("#mobileFeaturesSubmenu");h&&m&&h.addEventListener("click",i=>{i.preventDefault(),i.stopPropagation(),m.classList.toggle("collapsed"),h.classList.toggle("collapsed");const v=m.classList.contains("collapsed");h.setAttribute("aria-expanded",!v)})}function renderBSHFooter(a){if(!a)return;const e=getBSHRootPrefix(a),t=BSH_NAVIGATION_CONFIG,c=t.footer.social.map(o=>`<a href="#" data-coming-soon="${o.comingSoon}" aria-label="${o.name}"><i class="${o.icon}"></i></a>`).join(`
                    `),d=t.footer.columns.map(o=>{const p=o.links.map(u=>{const h=u.url.startsWith("#")?u.url:e+u.url,m=u.comingSoon?` data-coming-soon="${u.comingSoon}"`:"";return`<li><a href="${h}"${m}>${u.title}</a></li>`}).join(`
                        `);return`
                <div class="footer-col">
                    <h3 class="footer-heading">${o.heading}</h3>
                    <ul>
                        ${p}
                    </ul>
                </div>`}).join(`
`),l=`
        <div class="container footer-container">
            <div class="footer-brand">
                <a href="${e+t.brand.homeUrl}" class="brand-logo footer-logo" aria-label="${t.brand.name}">
                    <img src="${e+t.brand.logo}" alt="${t.brand.name}" class="logo-img-footer" width="160" height="58">
                </a>
                <p class="footer-desc">
                    ${t.footer.description}
                </p>
                <div class="social-links">
                    ${c}
                </div>
            </div>

            <div class="footer-links-group">
                ${d}
            </div>
        </div>

        <div class="footer-bottom text-center">
            <div class="container">
                <p>${t.footer.copyright}</p>
            </div>
        </div>
  `;a.innerHTML=l}function setupSearchableCourseSelect(a,e){const t=typeof a=="string"?document.getElementById(a):a;if(!t)return;const c=t.closest(".filter-group")||t.parentElement;if(!c)return;const d=Array.from(t.options).map(n=>({value:n.value,text:n.textContent.trim()}));let l=c.querySelector(".searchable-select");l&&l.remove(),l=document.createElement("div"),l.className="searchable-select";const o=document.createElement("button");o.type="button",o.className="searchable-select-btn";const p=document.createElement("span");p.className="searchable-select-label";const u=d.length>0&&d[0].value===""?d[0].text:"Select course...";p.textContent=t.value&&d.find(n=>n.value===t.value)?.text||u;const h=document.createElement("i");h.className="fa-solid fa-up-down searchable-select-arrow",o.appendChild(p),o.appendChild(h);const m=document.createElement("div");m.className="searchable-select-dropdown";const i=document.createElement("div");i.className="searchable-dropdown-search-wrap";const v=document.createElement("i");v.className="fa-solid fa-magnifying-glass searchable-search-icon";const s=document.createElement("input");s.type="text",s.className="searchable-dropdown-search-input",s.placeholder="Search course...",s.autocomplete="off",i.appendChild(v),i.appendChild(s);const g=document.createElement("div");g.className="searchable-options-list",m.appendChild(i),m.appendChild(g),l.appendChild(o),l.appendChild(m),t.style.display="none",c.appendChild(l);function S(n=""){g.innerHTML="";const f=n.trim().toLowerCase();let $=0;if(d.forEach(r=>{if(r.value===""&&d.length>1)return;const x=r.text.toLowerCase(),y=r.value.toLowerCase();if(!f||x.includes(f)||y.includes(f)){$++;const b=document.createElement("div"),k=r.value===t.value;b.className="searchable-option"+(k?" selected":""),b.dataset.value=r.value,b.innerHTML=`<span>${r.text}</span>`,k&&(b.innerHTML+='<i class="fa-solid fa-check searchable-check-icon"></i>'),b.addEventListener("click",E=>{E.stopPropagation(),L(r.value,r.text)}),g.appendChild(b)}}),$===0){const r=document.createElement("div");r.className="searchable-option-no-match",r.textContent="No courses found",g.appendChild(r)}}function L(n,f){t.value=n,p.textContent=n?f:u,n?o.classList.add("has-value"):o.classList.remove("has-value"),l.classList.remove("open"),s.value="",t.dispatchEvent(new Event("change",{bubbles:!0})),typeof e=="function"&&e()}function C(){l.classList.contains("open")?l.classList.remove("open"):(document.querySelectorAll(".searchable-select.open").forEach(n=>n.classList.remove("open")),l.classList.add("open"),S(""),setTimeout(()=>s.focus(),50))}if(o.addEventListener("click",n=>{n.stopPropagation(),C()}),s.addEventListener("click",n=>{n.stopPropagation()}),s.addEventListener("input",()=>{S(s.value)}),document.addEventListener("click",n=>{l.contains(n.target)||l.classList.remove("open")}),t.value){const n=d.find(f=>f.value===t.value);n&&(p.textContent=n.text,o.classList.add("has-value"))}}function initBSHComponents(){document.querySelectorAll('header.site-header, header[data-bsh-component="header"], #header').forEach(a=>renderBSHHeader(a)),document.querySelectorAll('footer.site-footer, footer[data-bsh-component="footer"], footer').forEach(a=>renderBSHFooter(a))}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",initBSHComponents):initBSHComponents();
