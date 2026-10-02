/* ==========================================================================
   BSH (BS Students Helper) - Centralized Question Portal Engine
   Author: BSH Engineering Team
   Description: Core unified UI engine for question rendering, whitespace dedenting,
                IDE code window with line numbers, syntax highlighting, bulletproof
                timer management, and mobile controls.
   ========================================================================== */

(function (global) {
    'use strict';

    // --------------------------------------------------------------------------
    // 1. Whitespace & Dedent Utilities (Fixes code snippet formatting bugs)
    // --------------------------------------------------------------------------
    function dedentCodeText(text) {
        if (!text) return '';
        
        // Convert Windows newlines and replace tab characters with 4 spaces
        let normalized = text.replace(/\r\n/g, '\n').replace(/\t/g, '    ');
        let lines = normalized.split('\n');

        // Trim leading empty lines
        while (lines.length > 0 && lines[0].trim() === '') {
            lines.shift();
        }
        // Trim trailing empty lines
        while (lines.length > 0 && lines[lines.length - 1].trim() === '') {
            lines.pop();
        }

        if (lines.length === 0) return '';

        // Fix HTML wrapper indent artifact: if line 1 has larger leading indent than rest of block, trim line 1 leading spaces
        if (lines.length > 1) {
            const line1Indent = lines[0].match(/^ */)[0].length;
            let restMinIndent = Infinity;
            for (let i = 1; i < lines.length; i++) {
                if (lines[i].trim().length > 0) {
                    const indent = lines[i].match(/^ */)[0].length;
                    if (indent < restMinIndent) restMinIndent = indent;
                }
            }
            if (restMinIndent !== Infinity && line1Indent > restMinIndent) {
                lines[0] = lines[0].trimStart();
            }
        }

        // Calculate minimum indentation across all non-empty lines
        let minIndent = Infinity;
        lines.forEach(line => {
            if (line.trim().length > 0) {
                const indent = line.match(/^ */)[0].length;
                if (indent < minIndent) {
                    minIndent = indent;
                }
            }
        });

        if (minIndent === Infinity || minIndent === 0) {
            return lines.join('\n');
        }

        // Remove minIndent leading spaces from each line so line 1 starts at column 0
        return lines
            .map(line => (line.length >= minIndent ? line.slice(minIndent) : line))
            .join('\n');
    }

    function escapeHtml(str) {
        if (typeof str !== 'string') return '';
        return str
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    // --------------------------------------------------------------------------
    // 2. Line-Numbered Syntax Highlighter Engine
    // --------------------------------------------------------------------------
    function highlightCodeSyntax(rawText) {
        const cleanText = dedentCodeText(rawText);
        if (!cleanText) return '';

        const tokens = [];

        function saveToken(cls, content) {
            const id = `___BSH_TOK_${tokens.length}___`;
            tokens.push(`<span class="${cls}">${content}</span>`);
            return id;
        }

        let code = cleanText;

        // Comments (# or // or /* ... */)
        code = code.replace(/(?:\/\*[\s\S]*?\*\/|\/\/[^\n]*|#[^\n]*)/g, (m) => saveToken('tok-comment', escapeHtml(m)));

        // Strings ("..." or '...' or `...`)
        code = code.replace(/(["'])(?:(?=(\\?))\2.)*?\1/g, (m) => saveToken('tok-string', escapeHtml(m)));

        // Escape remaining raw code for HTML safety
        code = escapeHtml(code);

        // Keywords
        const keywords = /\b(import|from|as|def|class|return|if|else|elif|for|in|while|try|except|with|True|False|None|lambda|assert|pass|public|static|void|int|double|boolean|String|new|null|var|val|function|const|let|select|where|group|by|order|extends|implements|interface|package|throws|throw|override|final|abstract)\b/g;
        code = code.replace(keywords, (m) => saveToken('tok-keyword', m));

        // Built-in Classes & Types
        const classes = /\b(np|pd|MinMaxScaler|StandardScaler|OneHotEncoder|ColumnTransformer|PolynomialFeatures|Pipeline|FeatureUnion|KNeighborsClassifier|KNeighborsRegressor|SGDRegressor|SGDClassifier|Ridge|Lasso|LinearRegression|GaussianNB|BernoulliNB|MultinomialNB|AdaBoostClassifier|VotingClassifier|VotingRegressor|RandomForestClassifier|MLPClassifier|MLPRegressor|PCA|RandomizedSearchCV|GridSearchCV|LabelEncoder|CountVectorizer|TfidfVectorizer|KMeans|AgglomerativeClustering|SVC|RidgeClassifier|LassoCV|ElasticNetCV|DummyRegressor|DummyClassifier|System|Math|Scanner|ArrayList|HashMap|LinkedHashMap|Map|List|Set|Optional|Stream|Collectors|PrintStream|FileOutputStream|FileInputStream|IOException|Thread|Observer|Experiment|Vehicle|Car|Showroom|Student|Object|DataFrame|Series)\b/g;
        code = code.replace(classes, (m) => saveToken('tok-class', m));

        // Function / Method Invocations
        const funcs = /\b(fit|fit_transform|transform|predict|predict_proba|fit_predict|array|read_csv|sum|mean|std|var_|drop|reshape|head|tail|iloc|loc|apply|isnull|notnull|isna|isin|group|groupby|shift|diff|convert|resize|flatten|toarray|classification_report|f1_score|accuracy_score|precision_score|recall_score|print|println|len|range|enumerate|zip|min|max|abs|score|collect|partitioningBy|getOrDefault|entrySet|stream|filter|ifPresentOrElse)\b(?=\s*\()/g;
        code = code.replace(funcs, (m) => saveToken('tok-func', m));

        // Numbers
        const numbers = /\b\d+(?:\.\d+)?(?:e[+-]?\d+)?\b/gi;
        code = code.replace(numbers, (m) => saveToken('tok-number', m));

        // Operators
        const operators = /(\+|-|\*|\/|==|!=|<=|>=|=|<|>|\||&|~|\^)/g;
        code = code.replace(operators, (m) => saveToken('tok-operator', m));

        // Restore token HTML
        tokens.forEach((tokHtml, i) => {
            code = code.replace(`___BSH_TOK_${i}___`, tokHtml);
        });

        // Split into lines & construct line numbers table structure matching professional IDEs
        const lines = code.split('\n');
        const rowsHtml = lines.map((lineContent, idx) => {
            const lineNum = idx + 1;
            return `<div class="code-line"><span class="line-num">${lineNum}</span><span class="line-code">${lineContent || ' '}</span></div>`;
        }).join('');

        return `<div class="code-container">${rowsHtml}</div>`;
    }

    function copyIdeCode(btn) {
        const windowEl = btn.closest('.ide-code-window');
        if (!windowEl) return;
        const lineCodes = windowEl.querySelectorAll('.line-code');
        let text = '';
        if (lineCodes.length > 0) {
            text = Array.from(lineCodes).map(el => el.textContent || el.innerText).join('\n');
        } else {
            const body = windowEl.querySelector('.ide-body pre');
            text = body ? (body.textContent || body.innerText) : '';
        }

        navigator.clipboard.writeText(text).then(() => {
            const icon = btn.querySelector('i');
            if (icon) {
                icon.className = 'fa-solid fa-check';
                setTimeout(() => { icon.className = 'fa-regular fa-copy'; }, 2000);
            }
        });
    }

    function initIDESyntaxHighlighter() {
        const selector = '.qp-code-box, .code-snippet-wrap, .code-block, pre.qp-code-box, pre code, pre[style*="font-family"]';
        const codeElements = document.querySelectorAll(selector);

        codeElements.forEach(el => {
            if (el.dataset.ideProcessed === 'true' || el.closest('.ide-code-window')) return;
            el.dataset.ideProcessed = 'true';

            const targetEl = el.querySelector('code') || el;
            let rawText = targetEl.textContent || targetEl.innerText || '';
            rawText = dedentCodeText(rawText);
            if (!rawText.trim()) return;

            let langLabel = 'Code Snippet';
            const lower = rawText.toLowerCase();
            if (lower.includes('public class') || lower.includes('system.out') || lower.includes('void main') || lower.includes('string[]') || lower.includes('class student') || lower.includes('scanner')) {
                langLabel = 'Java';
            } else if (lower.includes('select ') && lower.includes('from ')) {
                langLabel = 'SQL';
            } else if (lower.includes('import ') || lower.includes('from ') || lower.includes('def ') || lower.includes('print(') || lower.includes('np.') || lower.includes('pd.')) {
                langLabel = 'Python';
            }

            const highlightedContainer = highlightCodeSyntax(rawText);

            const ideWindow = document.createElement('div');
            ideWindow.className = 'ide-code-window';
            ideWindow.innerHTML = `
                <div class="ide-header">
                    <div class="ide-dots">
                        <span class="dot red"></span>
                        <span class="dot yellow"></span>
                        <span class="dot green"></span>
                    </div>
                    <span class="ide-title"><i class="fa-solid fa-code"></i> ${langLabel}</span>
                    <button type="button" class="ide-copy-btn" onclick="copyIdeCode(this)" title="Copy Code">
                        <i class="fa-regular fa-copy"></i>
                    </button>
                </div>
                <div class="ide-body">
                    ${highlightedContainer}
                </div>
            `;

            if (el.tagName === 'DIV' || el.tagName === 'PRE') {
                el.parentNode.replaceChild(ideWindow, el);
            } else {
                const container = el.closest('pre') || el;
                container.parentNode.replaceChild(ideWindow, container);
            }
        });
    }

    // --------------------------------------------------------------------------
    // 3. Centralized Timer Sub-Engine
    // --------------------------------------------------------------------------
    const Timer = {
        seconds: 0,
        interval: null,
        isRunning: false,

        init: function () {
            this.seconds = 0;
            this.start();
        },

        start: function () {
            if (this.interval) clearInterval(this.interval);
            this.isRunning = true;
            this.updateUI();
            this.interval = setInterval(() => {
                if (this.isRunning) {
                    this.seconds++;
                    this.updateUI();
                }
            }, 1000);
        },

        pause: function () {
            this.isRunning = false;
            this.updateUI();
        },

        resume: function () {
            this.isRunning = true;
            this.updateUI();
        },

        toggle: function () {
            this.isRunning = !this.isRunning;
            this.updateUI();
        },

        reset: function () {
            this.seconds = 0;
            this.updateUI();
        },

        updateUI: function () {
            const mins = Math.floor(this.seconds / 60).toString().padStart(2, '0');
            const secs = (this.seconds % 60).toString().padStart(2, '0');
            const timeStr = `${mins}:${secs}`;

            // Update all potential timer display elements in DOM safely
            const targets = ['timerDisplay', 'mobileTimerDisplay', 'navbarTimerDisplay'];
            targets.forEach(id => {
                const el = document.getElementById(id);
                if (el) el.textContent = timeStr;
            });

            document.querySelectorAll('.timer-display, [data-timer-display]').forEach(el => {
                el.textContent = timeStr;
            });

            // Update pause/play button icons
            const iconHtml = this.isRunning ? '<i class="fa-solid fa-pause"></i>' : '<i class="fa-solid fa-play"></i>';
            ['btnPauseTimer', 'mobileBtnPauseTimer'].forEach(id => {
                const btn = document.getElementById(id);
                if (btn) btn.innerHTML = iconHtml;
            });
            document.querySelectorAll('.btn-pause-timer').forEach(btn => {
                btn.innerHTML = iconHtml;
            });
        }
    };

    // --------------------------------------------------------------------------
    // 4. BSH Question Portal Engine Controller
    // --------------------------------------------------------------------------
    const BSHQuestionEngine = {
        Timer: Timer,
        dedentCodeText: dedentCodeText,
        highlightCodeSyntax: highlightCodeSyntax,
        initIDESyntaxHighlighter: initIDESyntaxHighlighter,
        copyIdeCode: copyIdeCode,
        escapeHtml: escapeHtml,
        userAnswers: {},
        currentMode: 'exam', // 'exam' or 'learning'

        setPortalMode: function (mode) {
            this.currentMode = mode;
            const btnExam = document.getElementById('btnExamMode');
            const btnLearning = document.getElementById('btnLearningMode');
            if (btnExam) btnExam.className = `mode-btn ${mode === 'exam' ? 'active' : ''}`;
            if (btnLearning) btnLearning.className = `mode-btn ${mode === 'learning' ? 'active' : ''}`;

            this.renderQuestions();
            this.updateScoreDisplay();
        },

        renderQuestions: function () {
            const container = document.getElementById('questionsContainer');
            if (!container) return;

            const questions = window.QUESTIONS_DATA || [];
            if (questions.length === 0) return;

            let html = '';
            questions.forEach((q) => {
                html += `
                <article class="qn-card" id="qnCard_${q.qn}">
                    <div class="qn-header-container">
                        <div class="qn-header-top">
                            <div class="qn-title-main">
                                Question ${q.qn} : ${q.id || q.qn}
                            </div>
                            <button type="button" class="btn-solution-pill" onclick="BSHQuestionEngine.toggleSolution(${q.qn})">
                                <i class="fa-regular fa-circle-check"></i> View Solutions (${q.qn})
                            </button>
                        </div>
                        <div class="qn-header-sub">
                            <span class="qn-id-tag">Question ${q.qn} : ${q.id || q.qn}</span>
                            <span class="qn-meta-info">Total Mark : ${q.marks ? q.marks.toFixed(2) : '1.00'} | Type : ${q.type || 'MCQ'}</span>
                        </div>
                    </div>

                    <div class="qn-text">${q.text ? escapeHtml(q.text).replace(/\\n/g, '<br>').replace(/\n/g, '<br>') : ''}</div>

                    ${q.code ? `
                    <div class="code-snippet-wrap">
                        <code>${escapeHtml(dedentCodeText(q.code))}</code>
                    </div>` : ''}

                    ${q.qnSubText ? `<div class="qn-text" style="margin-top:0.85rem;">${escapeHtml(q.qnSubText).replace(/\\n/g, '<br>').replace(/\n/g, '<br>')}</div>` : ''}

                    ${this.renderQuestionInputs(q)}

                    <div class="solution-box ${this.currentMode === 'learning' ? 'open' : ''}" id="solution_${q.qn}">
                        <div class="solution-title"><i class="fa-solid fa-circle-info" style="color:var(--accent-purple);"></i> Step-by-Step Solution & Code Trace</div>
                        <div class="solution-text">${q.solution ? escapeHtml(q.solution).replace(/\\n/g, '<br>').replace(/\n/g, '<br>') : ''}</div>
                    </div>
                </article>
                `;

                if (q.qn === 6 || q.qn === 15) {
                    html += `
                    <div class="ad-banner-box">
                        <span class="ad-tag">ADVERTISEMENT</span>
                        <div class="ad-actions">
                            <button type="button" class="btn-remove-ads" onclick="alert('Ad-free experience enabled.')"><i class="fa-solid fa-bolt"></i> Remove Ads</button>
                            <button type="button" class="btn-close-ad" onclick="this.parentElement.parentElement.remove()"><i class="fa-solid fa-xmark"></i></button>
                        </div>
                    </div>
                    `;
                }
            });

            container.innerHTML = html;
            this.updatePaletteStatuses();
            
            // Format newly rendered code blocks via line-numbered syntax highlighter
            initIDESyntaxHighlighter();
        },

        renderQuestionInputs: function (q) {
            if (q.type === 'COMPREHENSION') {
                return `<div style="font-size:0.88rem; color:var(--text-muted); font-style:italic; margin-bottom:1.25rem;">[Comprehension Passage Block - Subquestions are listed below]</div>`;
            }

            if (q.type === 'SA') {
                const userVal = this.userAnswers[q.qn] || '';
                const showGreen = this.currentMode === 'learning';

                return `
                <div class="sa-input-wrap">
                    <label for="sa_${q.qn}">Answer (Numeric):</label>
                    <input type="text" id="sa_${q.qn}" class="sa-input" value="${escapeHtml(userVal)}" placeholder="Answer" oninput="BSHQuestionEngine.handleSAInput(${q.qn}, this.value)">
                    <div class="accepted-ans-box" style="display:${showGreen ? 'block' : 'none'};">
                        <i class="fa-solid fa-circle-check"></i> Accepted Answer : ${q.acceptedAnswer || ''}
                    </div>
                </div>
                `;
            }

            const isMSQ = q.type === 'MSQ';
            const userArr = this.userAnswers[q.qn] || [];

            return `
            <div class="options-list">
                ${(q.options || []).map((optText, idx) => {
                    const isChecked = userArr.includes(idx);
                    const isCorrect = q.correct && q.correct.includes(idx);
                    let highlightClass = '';

                    if (isChecked) highlightClass = 'selected';
                    if (this.currentMode === 'learning') {
                        if (isCorrect) highlightClass = 'correct-highlight';
                        else if (isChecked && !isCorrect) highlightClass = 'incorrect-highlight';
                    }

                    const cleanOptText = (optText || '').replace(/\\n/g, '\n');
                    const isMultiLine = cleanOptText.includes('\n');
                    const formattedOpt = isMultiLine 
                        ? `<pre style="margin:0; font-family:var(--font-mono); font-size:0.9rem; line-height:1.5; text-align:left;"><code>${escapeHtml(dedentCodeText(cleanOptText))}</code></pre>` 
                        : escapeHtml(cleanOptText);

                    return `
                    <label class="option-item ${highlightClass}" onclick="BSHQuestionEngine.handleOptionSelect(${q.qn}, ${idx}, '${q.type}')">
                        <input type="${isMSQ ? 'checkbox' : 'radio'}" name="qn_${q.qn}" class="option-input" ${isChecked ? 'checked' : ''} onclick="event.stopPropagation(); BSHQuestionEngine.handleOptionSelect(${q.qn}, ${idx}, '${q.type}')">
                        <span class="option-text">${formattedOpt}</span>
                    </label>
                    `;
                }).join('')}
            </div>
            `;
        },

        handleOptionSelect: function (qnNum, optIdx, qnType) {
            if (qnType === 'MCQ') {
                this.userAnswers[qnNum] = [optIdx];
            } else if (qnType === 'MSQ') {
                if (!this.userAnswers[qnNum]) this.userAnswers[qnNum] = [];
                const pos = this.userAnswers[qnNum].indexOf(optIdx);
                if (pos >= 0) this.userAnswers[qnNum].splice(pos, 1);
                else this.userAnswers[qnNum].push(optIdx);
            }
            this.renderQuestions();
            this.updateScoreDisplay();
        },

        handleSAInput: function (qnNum, val) {
            this.userAnswers[qnNum] = val.trim();
            this.updateScoreDisplay();
            this.updatePaletteStatuses();
        },

        calculateQuestionScore: function (q) {
            const userAns = this.userAnswers[q.qn];
            if (userAns === undefined || userAns === null || userAns === '' || (Array.isArray(userAns) && userAns.length === 0)) return "0.00";

            if (q.type === 'SA') {
                return (userAns == q.acceptedAnswer) ? (q.marks || 1.0).toFixed(2) : "0.00";
            }

            if (q.type === 'MCQ') {
                return (userAns[0] === q.correct[0]) ? (q.marks || 1.0).toFixed(2) : "0.00";
            }

            if (q.type === 'MSQ') {
                const sortedUser = [...userAns].sort().join(',');
                const sortedCorrect = [...q.correct].sort().join(',');
                return (sortedUser === sortedCorrect) ? (q.marks || 1.0).toFixed(2) : "0.00";
            }

            return "0.00";
        },

        updateScoreDisplay: function () {
            let total = 0;
            let answeredCount = 0;
            const questions = window.QUESTIONS_DATA || [];
            let totalPossibleMarks = 0;

            questions.forEach(q => {
                const m = q.marks || 1.0;
                totalPossibleMarks += m;
                const score = parseFloat(this.calculateQuestionScore(q));
                total += score;

                const ans = this.userAnswers[q.qn];
                if (ans !== undefined && ans !== null && ans !== '' && (!Array.isArray(ans) || ans.length > 0)) {
                    answeredCount++;
                }
            });

            if (totalPossibleMarks === 0) totalPossibleMarks = 100;

            const liveScore = document.getElementById('liveScoreDisplay');
            if (liveScore) liveScore.textContent = `${total.toFixed(2)} / ${totalPossibleMarks.toFixed(2)}`;

            const livePct = document.getElementById('livePercentDisplay');
            if (livePct) livePct.textContent = `(${((total / totalPossibleMarks) * 100).toFixed(1)}%)`;

            const qnAnsCount = document.getElementById('qnAnsweredCount');
            if (qnAnsCount) qnAnsCount.textContent = `${answeredCount}/${questions.length}`;
        },

        updatePaletteStatuses: function () {
            const questions = window.QUESTIONS_DATA || [];
            questions.forEach(q => {
                const btn = document.getElementById(`paletteBtn_${q.qn}`);
                if (!btn) return;

                btn.className = 'palette-btn';

                const ans = this.userAnswers[q.qn];
                const hasAns = ans !== undefined && ans !== null && ans !== '' && (!Array.isArray(ans) || ans.length > 0);

                if (hasAns) {
                    btn.classList.add('answered');
                    if (this.currentMode === 'learning') {
                        const score = parseFloat(this.calculateQuestionScore(q));
                        if (score > 0) btn.classList.add('correct');
                        else btn.classList.add('incorrect');
                    }
                }
            });
        },

        toggleSolution: function (qnNum) {
            const box = document.getElementById(`solution_${qnNum}`);
            if (box) box.classList.toggle('open');
        },

        scrollToQuestion: function (qnNum) {
            const card = document.getElementById(`qnCard_${qnNum}`);
            if (card) {
                card.scrollIntoView({ behavior: 'smooth', block: 'center' });
                document.querySelectorAll('.palette-btn').forEach(b => b.classList.remove('active-qn'));
                const btn = document.getElementById(`paletteBtn_${qnNum}`);
                if (btn) btn.classList.add('active-qn');
            }
        },

        toggleMobileSidebar: function () {
            const sidebar = document.getElementById('portalSidebar');
            const toggleBtn = document.getElementById('mobileSidebarToggle');
            if (sidebar && toggleBtn) {
                sidebar.classList.toggle('open');
                toggleBtn.classList.toggle('active');
            }
        },

        submitExam: function () {
            this.setPortalMode('learning');

            let correctCount = 0;
            let incorrectCount = 0;
            let unansweredCount = 0;
            let totalScore = 0;
            const questions = window.QUESTIONS_DATA || [];
            let totalPossibleMarks = 0;

            questions.forEach(q => {
                totalPossibleMarks += (q.marks || 1.0);
                const ans = this.userAnswers[q.qn];
                const hasAns = ans !== undefined && ans !== null && ans !== '' && (!Array.isArray(ans) || ans.length > 0);

                if (!hasAns) {
                    unansweredCount++;
                } else {
                    const score = parseFloat(this.calculateQuestionScore(q));
                    totalScore += score;
                    if (score > 0) correctCount++;
                    else incorrectCount++;
                }
            });

            if (totalPossibleMarks === 0) totalPossibleMarks = 100;

            const modalScoreText = document.getElementById('modalScoreText');
            if (modalScoreText) modalScoreText.textContent = `${totalScore.toFixed(2)} / ${totalPossibleMarks.toFixed(2)}`;

            const modalPercentText = document.getElementById('modalPercentText');
            if (modalPercentText) modalPercentText.textContent = `${((totalScore / totalPossibleMarks) * 100).toFixed(1)}% Accuracy`;

            const elCorrect = document.getElementById('modalCorrectCount');
            if (elCorrect) elCorrect.textContent = correctCount;

            const elIncorrect = document.getElementById('modalIncorrectCount');
            if (elIncorrect) elIncorrect.textContent = incorrectCount;

            const elUnanswered = document.getElementById('modalUnansweredCount');
            if (elUnanswered) elUnanswered.textContent = unansweredCount;

            const resModal = document.getElementById('resultModal');
            if (resModal) resModal.classList.add('active');
        },

        resetExam: function () {
            this.userAnswers = {};
            this.Timer.reset();
            const resModal = document.getElementById('resultModal');
            if (resModal) resModal.classList.remove('active');
            this.setPortalMode('exam');
        },

        init: function () {
            // Auto initialize timer
            this.Timer.init();

            // Render questions if data exists
            if (window.QUESTIONS_DATA && window.QUESTIONS_DATA.length > 0) {
                this.renderQuestions();
                this.updateScoreDisplay();
            } else {
                initIDESyntaxHighlighter();
            }

            // Setup FAB back to top scroll listener
            window.addEventListener('scroll', () => {
                const fab = document.getElementById('fabBackToTop');
                if (fab) {
                    if (window.scrollY > 300) fab.classList.add('visible');
                    else fab.classList.remove('visible');
                }
            });
        }
    };

    // Global backwards-compatibility exports so existing html files work seamlessly
    global.BSHQuestionEngine = BSHQuestionEngine;
    global.dedentCodeText = dedentCodeText;
    global.copyIdeCode = copyIdeCode;
    global.initIDESyntaxHighlighter = initIDESyntaxHighlighter;
    global.startTimer = function () { BSHQuestionEngine.Timer.start(); };
    global.toggleTimer = function () { BSHQuestionEngine.Timer.toggle(); };
    global.resetTimer = function () { BSHQuestionEngine.Timer.reset(); };
    global.updateTimerUI = function () { BSHQuestionEngine.Timer.updateUI(); };
    global.updateTimerDisplay = function () { BSHQuestionEngine.Timer.updateUI(); };
    global.setPortalMode = function (m) { BSHQuestionEngine.setPortalMode(m); };
    global.renderQuestions = function () { BSHQuestionEngine.renderQuestions(); };
    global.handleOptionSelect = function (q, o, t) { BSHQuestionEngine.handleOptionSelect(q, o, t); };
    global.handleSAInput = function (q, v) { BSHQuestionEngine.handleSAInput(q, v); };
    global.calculateQuestionScore = function (q) { return BSHQuestionEngine.calculateQuestionScore(q); };
    global.updateScoreDisplay = function () { BSHQuestionEngine.updateScoreDisplay(); };
    global.updatePaletteStatuses = function () { BSHQuestionEngine.updatePaletteStatuses(); };
    global.toggleSolution = function (q) { BSHQuestionEngine.toggleSolution(q); };
    global.scrollToQuestion = function (q) { BSHQuestionEngine.scrollToQuestion(q); };
    global.toggleMobileSidebar = function () { BSHQuestionEngine.toggleMobileSidebar(); };
    global.submitExam = function () { BSHQuestionEngine.submitExam(); };
    global.resetExam = function () { BSHQuestionEngine.resetExam(); };
    global.openSummaryModal = function () {
        const m = document.getElementById('summaryModal');
        if (m) m.classList.add('active');
    };
    global.closeSummaryModal = function () {
        const m = document.getElementById('summaryModal');
        if (m) m.classList.remove('active');
    };
    global.closeResultModal = function () {
        const m = document.getElementById('resultModal');
        if (m) m.classList.remove('active');
    };
    global.scrollToTop = function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Auto connect on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => BSHQuestionEngine.init());
    } else {
        BSHQuestionEngine.init();
    }

})(typeof window !== 'undefined' ? window : this);
