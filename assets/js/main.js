/* ==========================================================================
   BSH (BS Students Helper) - Interactive Web Logic
   Features:
   1. Interactive Quiz Teaser Engine
   2. Real-time SEC Grade Predictor
   3. Wall of Love Review Filtering & Review Submission Modal
   4. FAQ Accordions & Mobile Navigation
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    initCleanURLRouting();
    initAnnouncementBar();
    initNavigation();
    initQuizEngine();
    initSECGradeCalculator();
    initReviewSystem();
    initFAQAccordion();
    initStatsCounter();
    initComingSoonModal();
    initInspectProtection();
});

/* --------------------------------------------------------------------------
   0. Dark / Light Theme Toggle Engine
   -------------------------------------------------------------------------- */
function initThemeToggle() {
    function applyTheme(theme) {
        if (theme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            if (document.body) document.body.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            if (document.body) document.body.setAttribute('data-theme', 'light');
        }
        updateToggleIcons(theme);
    }

    function updateToggleIcons(theme) {
        const toggleBtns = document.querySelectorAll('#themeToggleBtn, .theme-toggle-btn');
        toggleBtns.forEach(btn => {
            const icon = btn.querySelector('i');
            if (icon) {
                if (theme === 'dark') {
                    icon.className = 'fa-solid fa-sun';
                    btn.setAttribute('aria-label', 'Switch to Light Theme');
                    btn.setAttribute('title', 'Switch to Light Theme');
                } else {
                    icon.className = 'fa-solid fa-moon';
                    btn.setAttribute('aria-label', 'Switch to Dark Theme');
                    btn.setAttribute('title', 'Switch to Dark Theme');
                }
            }
        });
    }

    const savedTheme = localStorage.getItem('bsh-theme');
    let currentTheme = savedTheme === 'dark' ? 'dark' : 'light';

    applyTheme(currentTheme);

    const toggleBtns = document.querySelectorAll('#themeToggleBtn, .theme-toggle-btn');
    toggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const activeTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = activeTheme === 'dark' ? 'light' : 'dark';
            localStorage.setItem('bsh-theme', newTheme);
            applyTheme(newTheme);
        });
    });
}

/* --------------------------------------------------------------------------
   0.1 Clean URL Routing & History State
   -------------------------------------------------------------------------- */
function initCleanURLRouting() {
    // Optional address bar cleanup for current page without blocking navigation
    if (window.location.protocol.startsWith('http') && window.location.pathname.endsWith('.html')) {
        const cleanPath = window.location.pathname.replace(/\.html$/, '');
        window.history.replaceState(null, '', cleanPath + window.location.hash);
    }
}

/* --------------------------------------------------------------------------
   0.1 Announcement Bar Dismissal
   -------------------------------------------------------------------------- */
function initAnnouncementBar() {
    const bar = document.getElementById('announcementBar');
    const closeBtn = document.getElementById('closeAnnouncementBtn');

    if (bar && closeBtn) {
        closeBtn.addEventListener('click', () => {
            bar.style.display = 'none';
        });
    }
}

/* --------------------------------------------------------------------------
   1. Navigation & Mobile Menu
   -------------------------------------------------------------------------- */
function initNavigation() {
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            const icon = menuToggle.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.className = 'fa-solid fa-xmark';
            } else {
                icon.className = 'fa-solid fa-bars';
            }
        });

        // Close mobile menu when clicking a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                if (menuToggle.querySelector('i')) {
                    menuToggle.querySelector('i').className = 'fa-solid fa-bars';
                }
            });
        });
    }
}

/* --------------------------------------------------------------------------
   2. Interactive Quiz Practice Engine
   -------------------------------------------------------------------------- */
const quizQuestions = [
    {
        subject: "Mathematics for Data Science I",
        question: "Given a random variable X representing student test scores with mean μ = 75 and standard deviation σ = 10, what is the Z-score for a student scoring 95?",
        options: [
            { text: "Z = +1.5", correct: false },
            { text: "Z = +2.0", correct: true },
            { text: "Z = +1.0", correct: false },
            { text: "Z = +2.5", correct: false }
        ],
        hint: "Formula: Z = (X - μ) / σ. Substitute X = 95, μ = 75, σ = 10.",
        explanation: "Z = (95 - 75) / 10 = 20 / 10 = 2.0. A score of 95 is exactly 2 standard deviations above the mean."
    },
    {
        subject: "Statistics for Data Science I",
        question: "In hypothesis testing, if the calculated p-value is 0.02 and your significance level α is 0.05, what is your statistical conclusion?",
        options: [
            { text: "Reject the Null Hypothesis (H₀)", correct: true },
            { text: "Fail to reject the Null Hypothesis (H₀)", correct: false },
            { text: "Accept the Null Hypothesis as 100% true", correct: false },
            { text: "Increase sample size before concluding", correct: false }
        ],
        hint: "Rule: If p-value ≤ α, reject H₀. Otherwise, fail to reject H₀.",
        explanation: "Since p-value (0.02) ≤ α (0.05), we have sufficient evidence to reject the Null Hypothesis (H₀)."
    },
    {
        subject: "Python Programming & Data Structures",
        question: "What will be the output of the following Python expression: [x**2 for x in range(5) if x % 2 != 0]?",
        options: [
            { text: "[0, 1, 4, 9, 16]", correct: false },
            { text: "[1, 9]", correct: true },
            { text: "[1, 3]", correct: false },
            { text: "[0, 4, 16]", correct: false }
        ],
        hint: "range(5) produces 0, 1, 2, 3, 4. Filter for odd values x % 2 != 0 (which are 1 and 3), then square them.",
        explanation: "Odd numbers in range(5) are 1 and 3. Squaring them gives 1² = 1 and 3² = 9. Output is [1, 9]."
    }
];

let currentQuizIndex = 0;
let selectedOptionIndex = null;
let quizTimerInterval = null;
let secondsRemaining = 105; // 01:45 countdown

function initQuizEngine() {
    if (!document.getElementById('quizSubject')) return;
    renderQuestion();
    startQuizTimer();

    const hintBtn = document.getElementById('quizHintBtn');
    const hintCard = document.getElementById('hintCard');
    const nextBtn = document.getElementById('quizNextBtn');

    if (hintBtn && hintCard) {
        hintBtn.addEventListener('click', () => {
            hintCard.classList.toggle('hidden');
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (selectedOptionIndex === null) return;

            const q = quizQuestions[currentQuizIndex];
            const feedbackBox = document.getElementById('quizFeedback');
            const feedbackTitle = document.getElementById('feedbackTitle');
            const feedbackText = document.getElementById('feedbackText');

            // If we are showing answer result, clicking next moves to next question
            if (nextBtn.dataset.state === 'answered') {
                currentQuizIndex = (currentQuizIndex + 1) % quizQuestions.length;
                selectedOptionIndex = null;
                nextBtn.dataset.state = 'submit';
                nextBtn.innerHTML = `<span>Submit Answer</span> <i class="fa-solid fa-arrow-right"></i>`;
                nextBtn.disabled = true;
                if (hintCard) hintCard.classList.add('hidden');
                feedbackBox.classList.add('hidden');
                renderQuestion();
                return;
            }

            // Reveal correctness
            const isCorrect = q.options[selectedOptionIndex].correct;
            const optionsContainer = document.getElementById('quizOptions');
            const optionEls = optionsContainer.querySelectorAll('.quiz-option');

            optionEls.forEach((el, idx) => {
                if (q.options[idx].correct) {
                    el.classList.add('correct');
                } else if (idx === selectedOptionIndex && !isCorrect) {
                    el.classList.add('incorrect');
                }
            });

            feedbackBox.classList.remove('hidden', 'correct-fb', 'incorrect-fb');
            if (isCorrect) {
                feedbackBox.classList.add('correct-fb');
                feedbackTitle.innerHTML = `<i class="fa-solid fa-circle-check"></i> Excellent! Correct Answer.`;
            } else {
                feedbackBox.classList.add('incorrect-fb');
                feedbackTitle.innerHTML = `<i class="fa-solid fa-circle-xmark"></i> Incorrect Answer.`;
            }
            feedbackText.textContent = q.explanation;

            nextBtn.dataset.state = 'answered';
            nextBtn.innerHTML = `<span>Next Question</span> <i class="fa-solid fa-arrow-right"></i>`;
        });
    }
}

function renderQuestion() {
    const q = quizQuestions[currentQuizIndex];
    document.getElementById('quizSubject').textContent = q.subject;
    document.getElementById('quizCurrentStep').textContent = currentQuizIndex + 1;
    document.getElementById('quizQuestion').textContent = q.question;
    document.getElementById('hintText').textContent = q.hint;

    const progressPercent = ((currentQuizIndex + 1) / quizQuestions.length) * 100;
    document.getElementById('quizProgressBar').style.width = `${progressPercent}%`;

    const optionsContainer = document.getElementById('quizOptions');
    optionsContainer.innerHTML = '';

    const optionLetters = ['A', 'B', 'C', 'D'];
    q.options.forEach((opt, idx) => {
        const optionEl = document.createElement('div');
        optionEl.className = 'quiz-option';
        optionEl.innerHTML = `
            <span class="option-letter">${optionLetters[idx]}</span>
            <span class="option-text">${opt.text}</span>
        `;
        optionEl.addEventListener('click', () => {
            const nextBtn = document.getElementById('quizNextBtn');
            if (nextBtn.dataset.state === 'answered') return; // locked after answering

            document.querySelectorAll('.quiz-option').forEach(el => el.classList.remove('selected'));
            optionEl.classList.add('selected');
            selectedOptionIndex = idx;
            nextBtn.disabled = false;
        });
        optionsContainer.appendChild(optionEl);
    });
}

function startQuizTimer() {
    const timerDisplay = document.getElementById('quizTime');
    if (!timerDisplay) return;

    if (quizTimerInterval) clearInterval(quizTimerInterval);

    quizTimerInterval = setInterval(() => {
        if (secondsRemaining <= 0) {
            secondsRemaining = 105;
        } else {
            secondsRemaining--;
        }
        const mins = Math.floor(secondsRemaining / 60);
        const secs = secondsRemaining % 60;
        timerDisplay.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }, 1000);
}

/* --------------------------------------------------------------------------
   3. Real-time SEC Grade Predictor
   -------------------------------------------------------------------------- */
function initSECGradeCalculator() {
    const assignmentSlider = document.getElementById('assignmentScore');
    const quiz1Slider = document.getElementById('quiz1Score');
    const quiz2Slider = document.getElementById('quiz2Score');
    const endtermSlider = document.getElementById('endtermScore');

    if (!assignmentSlider || !quiz1Slider || !quiz2Slider || !endtermSlider) return;

    const updateCalculator = () => {
        const ga = parseFloat(assignmentSlider.value);
        const q1 = parseFloat(quiz1Slider.value);
        const q2 = parseFloat(quiz2Slider.value);
        const et = parseFloat(endtermSlider.value);

        document.getElementById('valAssignment').textContent = `${ga} / 100`;
        document.getElementById('valQuiz1').textContent = `${q1} / 100`;
        document.getElementById('valQuiz2').textContent = `${q2} / 100`;
        document.getElementById('valEndterm').textContent = `${et} / 100`;

        // Official IITM BS Weighted Formula estimation
        // T = 0.1 * GA + max(0.6*Q1 + 0.4*ET, 0.2*Q1 + 0.3*Q2 + 0.4*ET, 0.25*Q1 + 0.35*Q2 + 0.4*ET)
        const option1 = 0.6 * q1 + 0.4 * et;
        const option2 = 0.2 * q1 + 0.3 * q2 + 0.4 * et;
        const option3 = 0.25 * q1 + 0.35 * q2 + 0.4 * et;
        
        const maxExamScore = Math.max(option1, option2, option3);
        const totalScore = (0.1 * ga) + (0.9 * (maxExamScore / 100) * 100);

        const clampedTotal = Math.min(100, Math.max(0, Math.round(totalScore * 10) / 10));
        document.getElementById('totalScore').textContent = `${clampedTotal} / 100`;

        // Determine Grade Letter
        let gradeLetter = 'S';
        let strokeColor = '#059669'; // Green

        if (clampedTotal >= 90) {
            gradeLetter = 'S';
            strokeColor = '#059669';
        } else if (clampedTotal >= 80) {
            gradeLetter = 'A';
            strokeColor = '#10B981';
        } else if (clampedTotal >= 70) {
            gradeLetter = 'B';
            strokeColor = '#D97706';
        } else if (clampedTotal >= 60) {
            gradeLetter = 'C';
            strokeColor = '#F59E0B';
        } else if (clampedTotal >= 50) {
            gradeLetter = 'D';
            strokeColor = '#3B82F6';
        } else if (clampedTotal >= 40) {
            gradeLetter = 'E';
            strokeColor = '#6B7280';
        } else {
            gradeLetter = 'F';
            strokeColor = '#EF4444';
        }

        document.getElementById('gradeLetter').textContent = gradeLetter;
        const gradeRing = document.getElementById('gradeRing');
        if (gradeRing) {
            gradeRing.style.stroke = strokeColor;
            // 264 is full circumference
            const dashoffset = 264 - (264 * (clampedTotal / 100));
            gradeRing.style.strokeDashoffset = dashoffset;
        }
    };

    [assignmentSlider, quiz1Slider, quiz2Slider, endtermSlider].forEach(slider => {
        slider.addEventListener('input', updateCalculator);
    });

    updateCalculator(); // Initial calculation
}

/* --------------------------------------------------------------------------
   4. Testimonials Infinite Marquee & Review System
   -------------------------------------------------------------------------- */
function initReviewSystem() {
    const track = document.getElementById('testimonialsTrack');
    if (track) {
        // Clone initial set of cards to guarantee a 100% continuous infinite marquee loop
        const originalCards = Array.from(track.children);
        originalCards.forEach(card => {
            const clone = card.cloneNode(true);
            clone.setAttribute('aria-hidden', 'true');
            track.appendChild(clone);
        });
    }

    const filterTabs = document.querySelectorAll('.filter-tab');

    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            filterTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const category = tab.dataset.filter;
            const cards = document.querySelectorAll('.testimonial-card');

            cards.forEach(card => {
                if (category === 'all' || card.dataset.category === category) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // Review Modal Handlers
    const openBtn = document.getElementById('openReviewModalBtn');
    const closeBtn = document.getElementById('closeReviewModalBtn');
    const cancelBtn = document.getElementById('cancelReviewBtn');
    const modal = document.getElementById('reviewModal');
    const reviewForm = document.getElementById('reviewForm');

    const toggleModal = (show) => {
        if (modal) {
            if (show) modal.classList.remove('hidden');
            else modal.classList.add('hidden');
        }
    };

    if (openBtn) openBtn.addEventListener('click', () => toggleModal(true));
    if (closeBtn) closeBtn.addEventListener('click', () => toggleModal(false));
    if (cancelBtn) cancelBtn.addEventListener('click', () => toggleModal(false));

    if (reviewForm) {
        reviewForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('studentNameInput').value;
            const level = document.getElementById('levelSelect').value;
            const text = document.getElementById('reviewTextInput').value;

            // Generate user initials
            const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'BS';

            const newCard = document.createElement('div');
            newCard.className = 'testimonial-card';
            newCard.dataset.category = level;

            const levelLabel = level.charAt(0).toUpperCase() + level.slice(1) + ' Level';

            newCard.innerHTML = `
                <div class="card-top">
                    <div class="student-info">
                        <div class="avatar-badge avatar-green">${initials}</div>
                        <div>
                            <h4 class="student-name">${escapeHTML(name)} <i class="fa-solid fa-circle-check verified-badge" title="Verified Student"></i></h4>
                            <span class="student-meta">${levelLabel} • Just Now</span>
                        </div>
                    </div>
                    <div class="stars">
                        <i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i>
                    </div>
                </div>
                <p class="testimonial-body">"${escapeHTML(text)}"</p>
                <div class="card-footer-tag">Recent Community Post</div>
            `;

            if (track) {
                track.prepend(newCard);
            }
            reviewForm.reset();
            toggleModal(false);
        });
    }
}

function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
        tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
}

/* --------------------------------------------------------------------------
   5. FAQ Accordion
   -------------------------------------------------------------------------- */
function initFAQAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            faqItems.forEach(i => i.classList.remove('active'));
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

/* --------------------------------------------------------------------------
   6. Stats Number Counter Animation
   -------------------------------------------------------------------------- */
function initStatsCounter() {
    const statNumbers = document.querySelectorAll('.stat-number[data-target]');
    if (statNumbers.length === 0) return;

    let observerTriggered = false;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !observerTriggered) {
                observerTriggered = true;
                statNumbers.forEach(num => {
                    const target = parseInt(num.dataset.target, 10);
                    const duration = 1500; // ms
                    const startTime = performance.now();

                    const animateCount = (currentTime) => {
                        const elapsed = currentTime - startTime;
                        const progress = Math.min(elapsed / duration, 1);
                        const currentVal = Math.floor(progress * target);
                        
                        if (target > 1000) {
                            num.textContent = currentVal.toLocaleString() + '+';
                        } else {
                            num.textContent = currentVal + '%';
                        }

                        if (progress < 1) {
                            requestAnimationFrame(animateCount);
                        }
                    };

                    requestAnimationFrame(animateCount);
                });
            }
        });
    }, { threshold: 0.5 });

    const ribbon = document.querySelector('.stats-ribbon');
    if (ribbon) observer.observe(ribbon);
}

/* --------------------------------------------------------------------------
   7. Feature "Coming Soon / Stay Tuned" Modal Handler
   -------------------------------------------------------------------------- */
function initComingSoonModal() {
    const modal = document.getElementById('comingSoonModal');
    const closeIconBtn = document.getElementById('closeComingSoonModal');
    const closeBtn = document.getElementById('closeComingSoonBtn');
    const notifyForm = document.getElementById('comingSoonNotifyForm');
    const notifyEmail = document.getElementById('notifyEmail');
    const successMsg = document.getElementById('notifySuccessMsg');
    const comingSoonTitle = document.getElementById('comingSoonTitle');

    if (!modal) return;

    const openModal = (featureName) => {
        if (comingSoonTitle) {
            comingSoonTitle.textContent = featureName ? `${featureName}` : 'Feature Under Development';
        }
        if (successMsg) successMsg.style.display = 'none';
        if (notifyForm) notifyForm.style.display = 'block';
        if (notifyEmail) notifyEmail.value = '';

        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Lock background scrolling
    };

    const closeModal = () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    };

    // Attach click listeners to all data-coming-soon elements & placeholder links
    document.addEventListener('click', (e) => {
        const comingSoonTarget = e.target.closest('[data-coming-soon]');
        if (comingSoonTarget) {
            e.preventDefault();
            const featureName = comingSoonTarget.getAttribute('data-coming-soon');
            openModal(featureName);
            return;
        }

        const anchor = e.target.closest('a');
        if (anchor) {
            const href = anchor.getAttribute('href');
            // If it's a dummy anchor # or empty, open coming soon modal (unless handled by other logic)
            if ((href === '#' || href === '') && !anchor.classList.contains('brand-logo') && !anchor.hasAttribute('data-filter')) {
                e.preventDefault();
                const featureText = anchor.textContent.trim() || 'Portal Feature';
                openModal(featureText);
            }
        }
    });

    // Close Modal Events
    if (closeIconBtn) closeIconBtn.addEventListener('click', closeModal);
    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    // Handle email subscription
    if (notifyForm) {
        notifyForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = notifyEmail.value.trim();
            if (email) {
                // Store subscriber email locally for demo
                const subscribers = JSON.parse(localStorage.getItem('bsh_subscribers') || '[]');
                subscribers.push({ email, date: new Date().toISOString() });
                localStorage.setItem('bsh_subscribers', JSON.stringify(subscribers));

                notifyForm.style.display = 'none';
                if (successMsg) successMsg.style.display = 'block';
            }
        });
    }
}

/* --------------------------------------------------------------------------
   Inspect & Developer Tools Protection Engine
   -------------------------------------------------------------------------- */
function initInspectProtection() {
    // 1. Disable Right-Click Context Menu (Silent)
    document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        return false;
    });

    // 2. Prevent Image Dragging (Silent)
    document.addEventListener('dragstart', (e) => {
        if (e.target && e.target.tagName === 'IMG') {
            e.preventDefault();
            return false;
        }
    });

    // 3. Prevent DevTools & Source Viewing Keyboard Shortcuts (Silent)
    document.addEventListener('keydown', (e) => {
        const key = e.key ? e.key.toUpperCase() : '';
        const keyCode = e.keyCode || e.which;

        // F12 key (Key code 123)
        const isF12 = key === 'F12' || keyCode === 123;
        
        // Ctrl+Shift+I / Cmd+Opt+I (Inspect element)
        // Ctrl+Shift+J / Cmd+Opt+J (Console)
        // Ctrl+Shift+C / Cmd+Opt+C (Element picker)
        // Ctrl+Shift+K / Cmd+Opt+K (Firefox console)
        // Ctrl+Shift+E (Network tab)
        const isDevToolsShortcut = (e.ctrlKey || e.metaKey) && (e.shiftKey || e.altKey) && ['I', 'J', 'C', 'K', 'E'].includes(key);

        // Ctrl+U / Cmd+U (View Page Source)
        const isViewSourceShortcut = (e.ctrlKey || e.metaKey) && key === 'U';

        // Ctrl+S / Cmd+S (Save Page)
        const isSaveShortcut = (e.ctrlKey || e.metaKey) && key === 'S';

        if (isF12 || isDevToolsShortcut || isViewSourceShortcut || isSaveShortcut) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
    }, true);
}


