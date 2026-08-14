/* ==========================================================================
   BSH (BS Students Helper) - SEC Grade & Course Score Calculator Engine
   Official May 2026 Term IIT Madras BS Grading Formulas & Logic
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // --------------------------------------------------------------------------
    // 1. Comprehensive Subject Database (May 2026 Rules)
    // --------------------------------------------------------------------------
    const SUBJECT_DATABASE = {
        // === FOUNDATIONAL LEVEL ===
        "maths1": {
            id: "maths1",
            name: "Mathematics for Data Science 1",
            level: "foundational",
            credits: 4,
            formulaType: "foundational_standard",
            formulaText: "T = max(0.6*F + 0.3*max(Qz1, Qz2), 0.45*F + 0.25*Qz1 + 0.3*Qz2)",
            notes: [
                "Eligibility for ET: Best 5 of 8 (W1-W7 + Mock Quiz 1) >= 40/100 AND attendance in 1 of 2 Quizzes.",
                "Major Change: GAA weightage in Foundation Level is 0%. 10 marks in Quizzes & ET are based on assignments."
            ],
            inputs: ["qz1", "qz2", "f", "gaa_check"]
        },
        "english1": {
            id: "english1",
            name: "English 1",
            level: "foundational",
            credits: 4,
            formulaType: "foundational_standard",
            formulaText: "T = max(0.6*F + 0.3*max(Qz1, Qz2), 0.45*F + 0.25*Qz1 + 0.3*Qz2)",
            notes: [
                "Eligibility for ET: Average of best 5 out of first 7 weekly assignments >= 40/100 AND attendance in 1 of 2 Quizzes."
            ],
            inputs: ["qz1", "qz2", "f", "gaa_check"]
        },
        "ct": {
            id: "ct",
            name: "Computational Thinking",
            level: "foundational",
            credits: 4,
            formulaType: "foundational_standard",
            formulaText: "T = max(0.6*F + 0.3*max(Qz1, Qz2), 0.45*F + 0.25*Qz1 + 0.3*Qz2)",
            notes: [
                "Eligibility for ET: Best 5 of 8 (W1-W7 + Mock Quiz 1) >= 40/100 AND attendance in 1 of 2 Quizzes."
            ],
            inputs: ["qz1", "qz2", "f", "gaa_check"]
        },
        "stats1": {
            id: "stats1",
            name: "Statistics for Data Science 1",
            level: "foundational",
            credits: 4,
            formulaType: "foundational_bonus",
            formulaText: "T = max(0.6*F + 0.3*max(Qz1, Qz2), 0.45*F + 0.25*Qz1 + 0.3*Qz2) + ExtraActivityBonus (capped to 5)",
            maxBonus: 5,
            notes: [
                "Extra Activity Bonus: 5 marks total (3.75 weekly extra + 1.25 quality). Added ONLY if you pass the course."
            ],
            inputs: ["qz1", "qz2", "f", "bonus", "gaa_check"]
        },
        "maths2": {
            id: "maths2",
            name: "Mathematics for Data Science 2",
            level: "foundational",
            credits: 4,
            formulaType: "foundational_bonus",
            formulaText: "T = min(100, max(0.6*F + 0.3*max(Qz1, Qz2), 0.45*F + 0.25*Qz1 + 0.3*Qz2) + BonusB)",
            maxBonus: 6,
            notes: [
                "Bonus B: Up to 6 marks in total (3 extra assignments of 2 marks each)."
            ],
            inputs: ["qz1", "qz2", "f", "bonus", "gaa_check"]
        },
        "english2": {
            id: "english2",
            name: "English 2",
            level: "foundational",
            credits: 4,
            formulaType: "foundational_standard",
            formulaText: "T = max(0.6*F + 0.3*max(Qz1, Qz2), 0.45*F + 0.25*Qz1 + 0.3*Qz2)",
            notes: [
                "Eligibility for ET: Best 5 of 7 weeks GA >= 40/100 AND attendance in 1 of 2 Quizzes."
            ],
            inputs: ["qz1", "qz2", "f", "gaa_check"]
        },
        "python": {
            id: "python",
            name: "Intro to Python Programming",
            level: "foundational",
            credits: 4,
            formulaType: "oppe_double",
            formulaText: "T = 0.15*Qz1 + 0.40*F + 0.25*max(PE1, PE2) + 0.20*min(PE1, PE2)",
            notes: [
                "OPPE Eligibility: System Compatibility Test (SCT) is MANDATORY.",
                "OPPE1: A1, A2, A3, A4 >= 40/100 each. OPPE2: A5, A6, A7, A8 >= 40/100 each.",
                "Grade Eligibility: Attend End Term AND score in max(PE1, PE2) >= 40/100."
            ],
            inputs: ["qz1", "pe1", "pe2", "f", "sct_check"]
        },
        "stats2": {
            id: "stats2",
            name: "Statistics for Data Science 2",
            level: "foundational",
            credits: 4,
            formulaType: "foundational_bonus",
            formulaText: "T = max(0.6*F + 0.3*max(Qz1, Qz2), 0.45*F + 0.25*Qz1 + 0.3*Qz2) + ExtraActivityBonus (capped to 5)",
            maxBonus: 5,
            notes: [
                "Extra Activity Bonus: 5 marks max. Added ONLY when you pass the course."
            ],
            inputs: ["qz1", "qz2", "f", "bonus", "gaa_check"]
        },

        // === DIPLOMA LEVEL ===
        "mlf": {
            id: "mlf",
            name: "Machine Learning Foundations (DS Diploma)",
            level: "diploma",
            credits: 4,
            formulaType: "diploma_standard",
            formulaText: "T = 0.05*GAA + max(0.6*F + 0.25*max(Qz1, Qz2), 0.40*F + 0.25*Qz1 + 0.30*Qz2)",
            notes: [
                "GAA = Average of best score in first 10 weekly graded assignments + Mock Quiz 1.",
                "Major Change: GAA weightage in Diploma Level is 5 marks."
            ],
            inputs: ["gaa", "qz1", "qz2", "f"]
        },
        "mlt": {
            id: "mlt",
            name: "Machine Learning Techniques (Diploma in DS)",
            level: "diploma",
            credits: 4,
            formulaType: "diploma_bonus",
            formulaText: "T = 0.05*GAA + max(0.6*F + 0.25*max(Qz1, Qz2), 0.40*F + 0.25*Qz1 + 0.30*Qz2) + Bonus(3)",
            notes: [
                "Bonus of 3 marks awarded for Programming Assignment Submission IF average of ALL assignments >= 40."
            ],
            inputs: ["gaa", "qz1", "qz2", "f", "prog_bonus"]
        },
        "mlp": {
            id: "mlp",
            name: "Machine Learning Practice (Diploma in DS)",
            level: "diploma",
            credits: 4,
            formulaType: "mlp_formula",
            formulaText: "T = 0.10*GAA + 0.30*F + 0.20*OPPE1 + 0.20*OPPE2 + 0.20*KA",
            notes: [
                "KA = Average score in 3 Kaggle Assignments.",
                "Eligibility for grade: Attend End Term AND max(OPPE1, OPPE2) >= 40/100."
            ],
            inputs: ["gaa", "pe1", "pe2", "ka", "f", "sct_check"]
        },
        "bdm": {
            id: "bdm",
            name: "Business Data Management (DS Diploma)",
            level: "diploma",
            credits: 4,
            formulaType: "diploma_standard",
            formulaText: "T = 0.05*GAA + max(0.6*F + 0.25*max(Qz1, Qz2), 0.40*F + 0.25*Qz1 + 0.30*Qz2)",
            notes: [
                "GAA = Average score in First 10 weekly graded assignments."
            ],
            inputs: ["gaa", "qz1", "qz2", "f"]
        },
        "ba": {
            id: "ba",
            name: "Business Analytics (Diploma in DS)",
            level: "diploma",
            credits: 4,
            formulaType: "ba_formula",
            formulaText: "T = Qz(20+20) + A(20) + F(40) where Qz = 2*(0.7*max(Q1,Q2) + 0.3*min(Q1,Q2))",
            notes: [
                "Assignments: A = Sum of Best 2 out of 3 assignments (max 20 marks).",
                "Quizzes: Qz1 (max 20), Qz2 (max 20). Qz = 2*(0.7*max(Qz1,Qz2) + 0.3*min(Qz1,Qz2)).",
                "End Term F: Capped at 40 marks. Eligibility: F >= 10/40."
            ],
            inputs: ["qz1_ba", "qz2_ba", "ba_a1", "ba_a2", "ba_a3", "f_ba"]
        },
        "tds": {
            id: "tds",
            name: "Tools in Data Science (Diploma in DS)",
            level: "diploma",
            credits: 4,
            formulaType: "tds_formula",
            formulaText: "T = 0.20*GAA + 0.20*ROE + 0.20*P1 + 0.20*P2 + 0.20*F",
            notes: [
                "GAA = Average of best 7 of 9 weekly portal assignments.",
                "ROE = Remote Online Exam (45 mins). P1, P2 = Take home open internet projects.",
                "F = Mandatory in-person final exam."
            ],
            inputs: ["gaa", "roe", "p1", "p2", "f"]
        },
        "pdsa": {
            id: "pdsa",
            name: "PDSA using Python (Diploma in Programming)",
            level: "diploma",
            credits: 4,
            formulaType: "oppe_single",
            formulaText: "T = 0.05*GAA + 0.20*OP + 0.45*F + max(0.20*max(Qz1, Qz2), 0.15*Qz1 + 0.15*Qz2)",
            notes: [
                "OP = Score in 120-min Online Proctored Remote Exam.",
                "GAA = Best 10 of 11 weekly assignments + Mock Quiz 1."
            ],
            inputs: ["gaa", "op", "qz1", "qz2", "f", "sct_check"]
        },
        "dbms": {
            id: "dbms",
            name: "Database Management Systems (DBMS)",
            level: "diploma",
            credits: 4,
            formulaType: "oppe_single",
            formulaText: "T = 0.05*GAA + 0.20*OP + 0.45*F + max(0.20*max(Qz1, Qz2), 0.15*Qz1 + 0.15*Qz2)",
            notes: [
                "OP = Online Proctored Exam (20% weightage)."
            ],
            inputs: ["gaa", "op", "qz1", "qz2", "f", "sct_check"]
        },
        "mad1_theory": {
            id: "mad1_theory",
            name: "Application Development - 1 Theory",
            level: "diploma",
            credits: 4,
            formulaType: "diploma_standard",
            formulaText: "T = 0.05*GAA + max(0.6*F + 0.25*max(Qz1, Qz2), 0.40*F + 0.25*Qz1 + 0.30*Qz2)",
            notes: ["Co-requisite: App Dev 1 Project."],
            inputs: ["gaa", "qz1", "qz2", "f"]
        },
        "mad1_proj": {
            id: "mad1_proj",
            name: "Application Development - 1 Project",
            level: "diploma",
            credits: 2,
            formulaType: "project_standard",
            formulaText: "T = 0.20*P1 + 0.30*P2 + 0.30*Viva + 0.20*Presentation",
            notes: ["Project evaluation based on code quality, viva, and presentation."],
            inputs: ["p1", "p2", "viva", "presentation"]
        },
        "mad2_theory": {
            id: "mad2_theory",
            name: "Application Development - 2 Theory",
            level: "diploma",
            credits: 4,
            formulaType: "diploma_standard",
            formulaText: "T = 0.05*GAA + max(0.6*F + 0.25*max(Qz1, Qz2), 0.40*F + 0.25*Qz1 + 0.30*Qz2)",
            notes: ["Co-requisite: App Dev 2 Project."],
            inputs: ["gaa", "qz1", "qz2", "f"]
        },
        "mad2_proj": {
            id: "mad2_proj",
            name: "Application Development - 2 Project",
            level: "diploma",
            credits: 2,
            formulaType: "project_standard",
            formulaText: "T = 0.20*P1 + 0.30*P2 + 0.30*Viva + 0.20*Presentation",
            notes: ["Project evaluation based on deliverables and oral defense."],
            inputs: ["p1", "p2", "viva", "presentation"]
        },
        "java": {
            id: "java",
            name: "Programming Concepts using Java",
            level: "diploma",
            credits: 4,
            formulaType: "oppe_single",
            formulaText: "T = 0.05*GAA + 0.20*OP + 0.45*F + max(0.20*max(Qz1, Qz2), 0.15*Qz1 + 0.15*Qz2)",
            notes: ["Requires OPPE System Compatibility Test."],
            inputs: ["gaa", "op", "qz1", "qz2", "f", "sct_check"]
        },
        "system_commands": {
            id: "system_commands",
            name: "System Commands & Linux (SC)",
            level: "diploma",
            credits: 3,
            formulaType: "oppe_single",
            formulaText: "T = 0.05*GAA + 0.20*OP + 0.45*F + max(0.20*max(Qz1, Qz2), 0.15*Qz1 + 0.15*Qz2)",
            notes: ["Hands-on command line exam."],
            inputs: ["gaa", "op", "qz1", "qz2", "f", "sct_check"]
        },
        "dl_genai_theory": {
            id: "dl_genai_theory",
            name: "Intro to Deep Learning & Gen AI Theory",
            level: "diploma",
            credits: 4,
            formulaType: "diploma_standard",
            formulaText: "T = 0.05*GAA + max(0.6*F + 0.25*max(Qz1, Qz2), 0.40*F + 0.25*Qz1 + 0.30*Qz2)",
            notes: ["Co-requisite: DL GenAI Project."],
            inputs: ["gaa", "qz1", "qz2", "f"]
        },

        // === DEGREE LEVEL ===
        "c_prog": {
            id: "c_prog",
            name: "Programming in C (Degree)",
            level: "degree",
            credits: 4,
            formulaType: "oppe_single",
            formulaText: "T = 0.10*GAA + 0.20*OP + 0.40*F + max(0.20*max(Qz1, Qz2), 0.15*Qz1 + 0.15*Qz2)",
            notes: ["Degree Level C Programming OPPE."],
            inputs: ["gaa", "op", "qz1", "qz2", "f", "sct_check"]
        },
        "mlops": {
            id: "mlops",
            name: "MLOPS (Machine Learning Operations)",
            level: "degree",
            credits: 4,
            formulaType: "oppe_single",
            formulaText: "T = 0.10*GAA + 0.20*OP + 0.40*F + max(0.20*max(Qz1, Qz2), 0.15*Qz1 + 0.15*Qz2)",
            notes: ["Remote OPPE conducted during OPPE 2 weekend."],
            inputs: ["gaa", "op", "qz1", "qz2", "f", "sct_check"]
        },
        "software_testing": {
            id: "software_testing",
            name: "Software Testing",
            level: "degree",
            credits: 4,
            formulaType: "degree_standard",
            formulaText: "T = 0.10*GAA + max(0.50*F + 0.20*max(Qz1, Qz2), 0.40*F + 0.25*Qz1 + 0.25*Qz2)",
            notes: ["GAA weightage in Degree Level remains 10%."],
            inputs: ["gaa", "qz1", "qz2", "f"]
        },
        "software_engg": {
            id: "software_engg",
            name: "Software Engineering",
            level: "degree",
            credits: 4,
            formulaType: "degree_standard",
            formulaText: "T = 0.10*GAA + max(0.50*F + 0.20*max(Qz1, Qz2), 0.40*F + 0.25*Qz1 + 0.25*Qz2)",
            notes: ["Degree core course."],
            inputs: ["gaa", "qz1", "qz2", "f"]
        },
        "ai_search": {
            id: "ai_search",
            name: "AI: Search Methods for Problem Solving",
            level: "degree",
            credits: 4,
            formulaType: "degree_standard",
            formulaText: "T = 0.10*GAA + max(0.50*F + 0.20*max(Qz1, Qz2), 0.40*F + 0.25*Qz1 + 0.25*Qz2)",
            notes: ["Degree elective."],
            inputs: ["gaa", "qz1", "qz2", "f"]
        },
        "deep_learning_cv": {
            id: "deep_learning_cv",
            name: "Deep Learning for Computer Vision",
            level: "degree",
            credits: 4,
            formulaType: "degree_standard",
            formulaText: "T = 0.10*GAA + max(0.50*F + 0.20*max(Qz1, Qz2), 0.40*F + 0.25*Qz1 + 0.25*Qz2)",
            notes: ["Advanced AI course."],
            inputs: ["gaa", "qz1", "qz2", "f"]
        },
        "llm": {
            id: "llm",
            name: "Large Language Models (LLM)",
            level: "degree",
            credits: 4,
            formulaType: "degree_standard",
            formulaText: "T = 0.10*GAA + max(0.50*F + 0.20*max(Qz1, Qz2), 0.40*F + 0.25*Qz1 + 0.25*Qz2)",
            notes: ["GenAI elective."],
            inputs: ["gaa", "qz1", "qz2", "f"]
        },
        "computer_systems_design": {
            id: "computer_systems_design",
            name: "Computer Systems Design",
            level: "degree",
            credits: 4,
            formulaType: "degree_standard",
            formulaText: "T = 0.10*GAA + max(0.50*F + 0.20*max(Qz1, Qz2), 0.40*F + 0.25*Qz1 + 0.25*Qz2)",
            notes: ["Systems stream."],
            inputs: ["gaa", "qz1", "qz2", "f"]
        },
        "ads": {
            id: "ads",
            name: "Algorithms for Data Science (ADS)",
            level: "degree",
            credits: 4,
            formulaType: "degree_standard",
            formulaText: "T = 0.10*GAA + max(0.50*F + 0.20*max(Qz1, Qz2), 0.40*F + 0.25*Qz1 + 0.25*Qz2)",
            notes: ["Algorithmic core."],
            inputs: ["gaa", "qz1", "qz2", "f"]
        },
        "discrete_maths": {
            id: "discrete_maths",
            name: "Discrete Mathematics",
            level: "degree",
            credits: 4,
            formulaType: "degree_standard",
            formulaText: "T = 0.10*GAA + max(0.50*F + 0.20*max(Qz1, Qz2), 0.40*F + 0.25*Qz1 + 0.25*Qz2)",
            notes: ["Math core."],
            inputs: ["gaa", "qz1", "qz2", "f"]
        }
    };

    // --------------------------------------------------------------------------
    // 2. DOM Elements
    // --------------------------------------------------------------------------
    const tabCourseCalc = document.getElementById('tabCourseCalc');
    const tabCgpaCalc = document.getElementById('tabCgpaCalc');
    const courseCalcSection = document.getElementById('courseCalcSection');
    const cgpaCalcSection = document.getElementById('cgpaCalcSection');

    const levelFilters = document.querySelectorAll('.filter-chip');
    const subjectSelect = document.getElementById('subjectSelect');
    const subjectSearch = document.getElementById('subjectSearch');

    const formulaInfoBox = document.getElementById('formulaInfoBox');
    const displaySubjectName = document.getElementById('displaySubjectName');
    const displayLevelTag = document.getElementById('displayLevelTag');
    const displayFormulaEquation = document.getElementById('displayFormulaEquation');
    const displayFormulaNotes = document.getElementById('displayFormulaNotes');

    const dynamicInputsWrap = document.getElementById('dynamicInputsWrap');

    const resultGradeLetter = document.getElementById('resultGradeLetter');
    const resultGradeRing = document.getElementById('resultGradeRing');
    const resultTotalScore = document.getElementById('resultTotalScore');
    const resultGradePoints = document.getElementById('resultGradePoints');
    const resultStatusBadge = document.getElementById('resultStatusBadge');
    const resultStepList = document.getElementById('resultStepList');
    const targetGrid = document.getElementById('targetGrid');

    // CGPA DOM
    const cgpaTableBody = document.getElementById('cgpaTableBody');
    const addCourseRowBtn = document.getElementById('addCourseRowBtn');
    const totalCreditsEl = document.getElementById('totalCreditsEl');
    const overallCgpaEl = document.getElementById('overallCgpaEl');
    const cgpaStatusBadge = document.getElementById('cgpaStatusBadge');

    // State Variables
    let currentSubjectId = "maths1";
    let activeLevelFilter = "all";

    // --------------------------------------------------------------------------
    // 3. Populate Subject Dropdown
    // --------------------------------------------------------------------------
    function renderSubjectOptions(filter = "all", searchQuery = "") {
        subjectSelect.innerHTML = "";
        const query = searchQuery.toLowerCase().trim();

        const groups = {
            "foundational": { title: "Foundational Level Courses", options: [] },
            "diploma": { title: "Diploma Level Courses", options: [] },
            "degree": { title: "Degree Level Courses", options: [] }
        };

        Object.values(SUBJECT_DATABASE).forEach(subj => {
            if (filter !== "all" && subj.level !== filter) return;
            if (query && !subj.name.toLowerCase().includes(query)) return;
            if (groups[subj.level]) {
                groups[subj.level].options.push(subj);
            }
        });

        let hasAny = false;
        Object.keys(groups).forEach(lvlKey => {
            const group = groups[lvlKey];
            if (group.options.length > 0) {
                hasAny = true;
                const optGroup = document.createElement('optgroup');
                optGroup.label = group.title;
                group.options.forEach(subj => {
                    const opt = document.createElement('option');
                    opt.value = subj.id;
                    opt.textContent = `${subj.name} (${subj.credits} Credits)`;
                    if (subj.id === currentSubjectId) opt.selected = true;
                    optGroup.appendChild(opt);
                });
                subjectSelect.appendChild(optGroup);
            }
        });

        if (!hasAny) {
            const opt = document.createElement('option');
            opt.value = "";
            opt.textContent = "No subjects matching search query";
            subjectSelect.appendChild(opt);
        } else if (!subjectSelect.value) {
            // Select first available
            const firstOpt = subjectSelect.querySelector('option[value]');
            if (firstOpt && firstOpt.value) {
                subjectSelect.value = firstOpt.value;
                currentSubjectId = firstOpt.value;
            }
        }
    }

    // --------------------------------------------------------------------------
    // 4. Render Dynamic Input Controls based on Subject
    // --------------------------------------------------------------------------
    function loadSubjectForm(subjId) {
        const subj = SUBJECT_DATABASE[subjId];
        if (!subj) return;

        currentSubjectId = subjId;
        displaySubjectName.textContent = subj.name;
        displayLevelTag.textContent = `${subj.level.toUpperCase()} LEVEL • ${subj.credits} CREDITS`;
        displayFormulaEquation.textContent = subj.formulaText;

        // Notes
        displayFormulaNotes.innerHTML = "";
        subj.notes.forEach(noteText => {
            const div = document.createElement('div');
            div.className = "note-item";
            div.innerHTML = `<i class="fa-solid fa-circle-check"></i> <span>${noteText}</span>`;
            displayFormulaNotes.appendChild(div);
        });

        // Dynamic Form Fields
        dynamicInputsWrap.innerHTML = "";

        subj.inputs.forEach(inputKey => {
            const inputHtml = createInputFieldHTML(inputKey);
            if (inputHtml) {
                const wrapper = document.createElement('div');
                wrapper.innerHTML = inputHtml;
                dynamicInputsWrap.appendChild(wrapper.firstElementChild);
            }
        });

        // Attach event listeners to all newly created range/number inputs
        const inputs = dynamicInputsWrap.querySelectorAll('input, select');
        inputs.forEach(inp => {
            inp.addEventListener('input', calculateCourseScore);
            inp.addEventListener('change', calculateCourseScore);
        });

        // Initial calculation
        calculateCourseScore();
    }

    function createInputFieldHTML(key) {
        switch (key) {
            case "qz1":
                return `
                <div class="input-group">
                    <div class="input-header">
                        <label class="input-label" for="inp_qz1">Quiz 1 Score (In-Person)</label>
                        <span class="input-badge" id="val_qz1">80 / 100</span>
                    </div>
                    <input type="range" id="inp_qz1" min="0" max="100" value="80" class="range-slider">
                </div>`;
            case "qz2":
                return `
                <div class="input-group">
                    <div class="input-header">
                        <label class="input-label" for="inp_qz2">Quiz 2 Score (In-Person)</label>
                        <span class="input-badge" id="val_qz2">75 / 100</span>
                    </div>
                    <input type="range" id="inp_qz2" min="0" max="100" value="75" class="range-slider">
                </div>`;
            case "f":
                return `
                <div class="input-group">
                    <div class="input-header">
                        <label class="input-label" for="inp_f">End-Term Final Exam Score (F)</label>
                        <span class="input-badge" id="val_f">82 / 100</span>
                    </div>
                    <input type="range" id="inp_f" min="0" max="100" value="82" class="range-slider">
                </div>`;
            case "gaa":
                return `
                <div class="input-group">
                    <div class="input-header">
                        <label class="input-label" for="inp_gaa">Weekly Assignment Avg (GAA)</label>
                        <span class="input-badge" id="val_gaa">90 / 100</span>
                    </div>
                    <input type="range" id="inp_gaa" min="0" max="100" value="90" class="range-slider">
                </div>`;
            case "pe1":
                return `
                <div class="input-group">
                    <div class="input-header">
                        <label class="input-label" for="inp_pe1">OPPE 1 Score (Remote Proctored)</label>
                        <span class="input-badge" id="val_pe1">70 / 100</span>
                    </div>
                    <input type="range" id="inp_pe1" min="0" max="100" value="70" class="range-slider">
                </div>`;
            case "pe2":
                return `
                <div class="input-group">
                    <div class="input-header">
                        <label class="input-label" for="inp_pe2">OPPE 2 Score (Remote Proctored)</label>
                        <span class="input-badge" id="val_pe2">85 / 100</span>
                    </div>
                    <input type="range" id="inp_pe2" min="0" max="100" value="85" class="range-slider">
                </div>`;
            case "op":
                return `
                <div class="input-group">
                    <div class="input-header">
                        <label class="input-label" for="inp_op">Online Proctored Exam (OP)</label>
                        <span class="input-badge" id="val_op">78 / 100</span>
                    </div>
                    <input type="range" id="inp_op" min="0" max="100" value="78" class="range-slider">
                </div>`;
            case "ka":
                return `
                <div class="input-group">
                    <div class="input-header">
                        <label class="input-label" for="inp_ka">Kaggle Assignments Avg (3 KAs)</label>
                        <span class="input-badge" id="val_ka">88 / 100</span>
                    </div>
                    <input type="range" id="inp_ka" min="0" max="100" value="88" class="range-slider">
                </div>`;
            case "roe":
                return `
                <div class="input-group">
                    <div class="input-header">
                        <label class="input-label" for="inp_roe">Remote Online Exam (ROE 45m)</label>
                        <span class="input-badge" id="val_roe">85 / 100</span>
                    </div>
                    <input type="range" id="inp_roe" min="0" max="100" value="85" class="range-slider">
                </div>`;
            case "p1":
                return `
                <div class="input-group">
                    <div class="input-header">
                        <label class="input-label" for="inp_p1">Project 1 / Milestone 1 Score</label>
                        <span class="input-badge" id="val_p1">90 / 100</span>
                    </div>
                    <input type="range" id="inp_p1" min="0" max="100" value="90" class="range-slider">
                </div>`;
            case "p2":
                return `
                <div class="input-group">
                    <div class="input-header">
                        <label class="input-label" for="inp_p2">Project 2 / Milestone 2 Score</label>
                        <span class="input-badge" id="val_p2">88 / 100</span>
                    </div>
                    <input type="range" id="inp_p2" min="0" max="100" value="88" class="range-slider">
                </div>`;
            case "bonus":
                return `
                <div class="input-group">
                    <div class="input-header">
                        <label class="input-label" for="inp_bonus">Extra Activity Bonus Marks</label>
                        <span class="input-badge" id="val_bonus">4 / 5</span>
                    </div>
                    <input type="range" id="inp_bonus" min="0" max="6" value="4" class="range-slider">
                </div>`;
            case "prog_bonus":
                return `
                <div class="checkbox-group">
                    <input type="checkbox" id="inp_prog_bonus" checked>
                    <label for="inp_prog_bonus">Submitted Programming Assignment (+3 Marks Bonus)</label>
                </div>`;
            case "sct_check":
                return `
                <div class="checkbox-group">
                    <input type="checkbox" id="inp_sct_check" checked>
                    <label for="inp_sct_check">Completed OPPE System Compatibility Test (SCT)</label>
                </div>`;
            case "gaa_check":
                return `
                <div class="checkbox-group">
                    <input type="checkbox" id="inp_gaa_check" checked>
                    <label for="inp_gaa_check">Met Assignment & Quiz Cutoff Eligibility (>=40/100 Best 5)</label>
                </div>`;
            case "qz1_ba":
                return `
                <div class="input-group">
                    <div class="input-header">
                        <label class="input-label" for="inp_qz1_ba">BA Quiz 1 Score (Max 20 Marks)</label>
                        <span class="input-badge" id="val_qz1_ba">16 / 20</span>
                    </div>
                    <input type="range" id="inp_qz1_ba" min="0" max="20" value="16" class="range-slider">
                </div>`;
            case "qz2_ba":
                return `
                <div class="input-group">
                    <div class="input-header">
                        <label class="input-label" for="inp_qz2_ba">BA Quiz 2 Score (Max 20 Marks)</label>
                        <span class="input-badge" id="val_qz2_ba">14 / 20</span>
                    </div>
                    <input type="range" id="inp_qz2_ba" min="0" max="20" value="14" class="range-slider">
                </div>`;
            case "ba_a1":
                return `
                <div class="input-group">
                    <div class="input-header">
                        <label class="input-label" for="inp_ba_a1">BA Assignment 1 (Max 10 Marks)</label>
                        <span class="input-badge" id="val_ba_a1">9 / 10</span>
                    </div>
                    <input type="range" id="inp_ba_a1" min="0" max="10" value="9" class="range-slider">
                </div>`;
            case "ba_a2":
                return `
                <div class="input-group">
                    <div class="input-header">
                        <label class="input-label" for="inp_ba_a2">BA Assignment 2 (Max 10 Marks)</label>
                        <span class="input-badge" id="val_ba_a2">8 / 10</span>
                    </div>
                    <input type="range" id="inp_ba_a2" min="0" max="10" value="8" class="range-slider">
                </div>`;
            case "ba_a3":
                return `
                <div class="input-group">
                    <div class="input-header">
                        <label class="input-label" for="inp_ba_a3">BA Assignment 3 (Max 10 Marks)</label>
                        <span class="input-badge" id="val_ba_a3">7 / 10</span>
                    </div>
                    <input type="range" id="inp_ba_a3" min="0" max="10" value="7" class="range-slider">
                </div>`;
            case "f_ba":
                return `
                <div class="input-group">
                    <div class="input-header">
                        <label class="input-label" for="inp_f_ba">BA End-Term Exam (Capped at 40 Marks)</label>
                        <span class="input-badge" id="val_f_ba">32 / 40</span>
                    </div>
                    <input type="range" id="inp_f_ba" min="0" max="40" value="32" class="range-slider">
                </div>`;
            case "viva":
                return `
                <div class="input-group">
                    <div class="input-header">
                        <label class="input-label" for="inp_viva">Project Viva Score</label>
                        <span class="input-badge" id="val_viva">85 / 100</span>
                    </div>
                    <input type="range" id="inp_viva" min="0" max="100" value="85" class="range-slider">
                </div>`;
            case "presentation":
                return `
                <div class="input-group">
                    <div class="input-header">
                        <label class="input-label" for="inp_presentation">Project Presentation Score</label>
                        <span class="input-badge" id="val_presentation">90 / 100</span>
                    </div>
                    <input type="range" id="inp_presentation" min="0" max="100" value="90" class="range-slider">
                </div>`;
            default:
                return "";
        }
    }

    // Helper to read inputs safely
    function getVal(id, defaultVal = 0) {
        const el = document.getElementById(id);
        if (!el) return defaultVal;
        if (el.type === 'checkbox') return el.checked;
        const v = parseFloat(el.value);
        return isNaN(v) ? defaultVal : v;
    }

    function updateBadgeText(id, text) {
        const el = document.getElementById(id);
        if (el) el.textContent = text;
    }

    // --------------------------------------------------------------------------
    // 5. Course Score & Grade Calculation Logic
    // --------------------------------------------------------------------------
    function calculateCourseScore() {
        const subj = SUBJECT_DATABASE[currentSubjectId];
        if (!subj) return;

        // Update input badges UI
        if (document.getElementById('inp_qz1')) updateBadgeText('val_qz1', `${getVal('inp_qz1')} / 100`);
        if (document.getElementById('inp_qz2')) updateBadgeText('val_qz2', `${getVal('inp_qz2')} / 100`);
        if (document.getElementById('inp_f')) updateBadgeText('val_f', `${getVal('inp_f')} / 100`);
        if (document.getElementById('inp_gaa')) updateBadgeText('val_gaa', `${getVal('inp_gaa')} / 100`);
        if (document.getElementById('inp_pe1')) updateBadgeText('val_pe1', `${getVal('inp_pe1')} / 100`);
        if (document.getElementById('inp_pe2')) updateBadgeText('val_pe2', `${getVal('inp_pe2')} / 100`);
        if (document.getElementById('inp_op')) updateBadgeText('val_op', `${getVal('inp_op')} / 100`);
        if (document.getElementById('inp_ka')) updateBadgeText('val_ka', `${getVal('inp_ka')} / 100`);
        if (document.getElementById('inp_roe')) updateBadgeText('val_roe', `${getVal('inp_roe')} / 100`);
        if (document.getElementById('inp_p1')) updateBadgeText('val_p1', `${getVal('inp_p1')} / 100`);
        if (document.getElementById('inp_p2')) updateBadgeText('val_p2', `${getVal('inp_p2')} / 100`);
        if (document.getElementById('inp_bonus')) updateBadgeText('val_bonus', `${getVal('inp_bonus')} / ${subj.maxBonus || 5}`);
        if (document.getElementById('inp_qz1_ba')) updateBadgeText('val_qz1_ba', `${getVal('inp_qz1_ba')} / 20`);
        if (document.getElementById('inp_qz2_ba')) updateBadgeText('val_qz2_ba', `${getVal('inp_qz2_ba')} / 20`);
        if (document.getElementById('inp_ba_a1')) updateBadgeText('val_ba_a1', `${getVal('inp_ba_a1')} / 10`);
        if (document.getElementById('inp_ba_a2')) updateBadgeText('val_ba_a2', `${getVal('inp_ba_a2')} / 10`);
        if (document.getElementById('inp_ba_a3')) updateBadgeText('val_ba_a3', `${getVal('inp_ba_a3')} / 10`);
        if (document.getElementById('inp_f_ba')) updateBadgeText('val_f_ba', `${getVal('inp_f_ba')} / 40`);
        if (document.getElementById('inp_viva')) updateBadgeText('val_viva', `${getVal('inp_viva')} / 100`);
        if (document.getElementById('inp_presentation')) updateBadgeText('val_presentation', `${getVal('inp_presentation')} / 100`);

        let T = 0;
        let steps = [];
        let isEligible = true;
        let statusReason = "Eligible for Final Grade";

        const type = subj.formulaType;

        if (type === "foundational_standard" || type === "foundational_bonus") {
            const Qz1 = getVal('inp_qz1');
            const Qz2 = getVal('inp_qz2');
            const F = getVal('inp_f');
            const bonus = (type === "foundational_bonus") ? getVal('inp_bonus') : 0;
            const gaaEligible = getVal('inp_gaa_check', true);

            if (!gaaEligible) {
                isEligible = false;
                statusReason = "Ineligible (Assignment cutoff < 40/100)";
            }

            const maxQz = Math.max(Qz1, Qz2);
            const opt1 = 0.60 * F + 0.30 * maxQz;
            const opt2 = 0.45 * F + 0.25 * Qz1 + 0.30 * Qz2;
            const coreT = Math.max(opt1, opt2);
            T = coreT + bonus;
            if (subj.id === "maths2") T = Math.min(100, T);

            steps.push(`Option 1 (0.60*F + 0.30*max(Q1,Q2)) = 0.60*${F} + 0.30*${maxQz} = ${opt1.toFixed(2)}`);
            steps.push(`Option 2 (0.45*F + 0.25*Q1 + 0.30*Q2) = 0.45*${F} + 0.25*${Qz1} + 0.30*${Qz2} = ${opt2.toFixed(2)}`);
            steps.push(`Core Score = max(${opt1.toFixed(2)}, ${opt2.toFixed(2)}) = ${coreT.toFixed(2)}`);
            if (bonus > 0) steps.push(`Extra Activity Bonus Added = +${bonus} (Total T = ${T.toFixed(2)})`);

        } else if (type === "oppe_double") { // Python
            const Qz1 = getVal('inp_qz1');
            const PE1 = getVal('inp_pe1');
            const PE2 = getVal('inp_pe2');
            const F = getVal('inp_f');
            const sct = getVal('inp_sct_check', true);

            if (!sct) {
                isEligible = false;
                statusReason = "OPPE Ineligible (SCT Test Not Completed)";
            }

            const maxPE = Math.max(PE1, PE2);
            const minPE = Math.min(PE1, PE2);

            if (maxPE < 40) {
                isEligible = false;
                statusReason = "Grade = I_OP (Score in programming exam < 40/100)";
            }

            T = 0.15 * Qz1 + 0.40 * F + 0.25 * maxPE + 0.20 * minPE;

            steps.push(`Quiz 1 Component (15%) = 0.15 * ${Qz1} = ${(0.15 * Qz1).toFixed(2)}`);
            steps.push(`End Term Component (40%) = 0.40 * ${F} = ${(0.40 * F).toFixed(2)}`);
            steps.push(`Max OPPE (${maxPE}) Component (25%) = 0.25 * ${maxPE} = ${(0.25 * maxPE).toFixed(2)}`);
            steps.push(`Min OPPE (${minPE}) Component (20%) = 0.20 * ${minPE} = ${(0.20 * minPE).toFixed(2)}`);

        } else if (type === "diploma_standard" || type === "diploma_bonus") {
            const GAA = getVal('inp_gaa');
            const Qz1 = getVal('inp_qz1');
            const Qz2 = getVal('inp_qz2');
            const F = getVal('inp_f');
            const progBonus = (type === "diploma_bonus" && getVal('inp_prog_bonus')) ? 3 : 0;

            const maxQz = Math.max(Qz1, Qz2);
            const opt1 = 0.60 * F + 0.25 * maxQz;
            const opt2 = 0.40 * F + 0.25 * Qz1 + 0.30 * Qz2;
            const examComponent = Math.max(opt1, opt2);

            T = 0.05 * GAA + examComponent + progBonus;

            steps.push(`GAA Component (5%) = 0.05 * ${GAA} = ${(0.05 * GAA).toFixed(2)}`);
            steps.push(`Exam Option 1 (0.6F + 0.25*maxQz) = 0.6*${F} + 0.25*${maxQz} = ${opt1.toFixed(2)}`);
            steps.push(`Exam Option 2 (0.4F + 0.25Q1 + 0.3Q2) = 0.4*${F} + 0.25*${Qz1} + 0.3*${Qz2} = ${opt2.toFixed(2)}`);
            steps.push(`Exam Score Component = max(${opt1.toFixed(2)}, ${opt2.toFixed(2)}) = ${examComponent.toFixed(2)}`);
            if (progBonus > 0) steps.push(`Programming Assignment Submission Bonus = +3 Marks`);

        } else if (type === "mlp_formula") {
            const GAA = getVal('inp_gaa');
            const PE1 = getVal('inp_pe1');
            const PE2 = getVal('inp_pe2');
            const KA = getVal('inp_ka');
            const F = getVal('inp_f');
            const sct = getVal('inp_sct_check', true);

            if (!sct) {
                isEligible = false;
                statusReason = "Ineligible (SCT Test Not Completed)";
            }

            if (Math.max(PE1, PE2) < 40) {
                isEligible = false;
                statusReason = "Grade = I_OP (Max OPPE score < 40/100)";
            }

            T = 0.10 * GAA + 0.30 * F + 0.20 * PE1 + 0.20 * PE2 + 0.20 * KA;

            steps.push(`GAA (10%) = 0.10 * ${GAA} = ${(0.10 * GAA).toFixed(2)}`);
            steps.push(`End Term F (30%) = 0.30 * ${F} = ${(0.30 * F).toFixed(2)}`);
            steps.push(`OPPE 1 (20%) = 0.20 * ${PE1} = ${(0.20 * PE1).toFixed(2)}`);
            steps.push(`OPPE 2 (20%) = 0.20 * ${PE2} = ${(0.20 * PE2).toFixed(2)}`);
            steps.push(`Kaggle Assignments (20%) = 0.20 * ${KA} = ${(0.20 * KA).toFixed(2)}`);

        } else if (type === "ba_formula") {
            const Qz1 = getVal('inp_qz1_ba');
            const Qz2 = getVal('inp_qz2_ba');
            const a1 = getVal('inp_ba_a1');
            const a2 = getVal('inp_ba_a2');
            const a3 = getVal('inp_ba_a3');
            const F = getVal('inp_f_ba');

            const qMax = Math.max(Qz1, Qz2);
            const qMin = Math.min(Qz1, Qz2);
            const Qz = 2 * (0.70 * qMax + 0.30 * qMin);

            const arrA = [a1, a2, a3].sort((a, b) => b - a);
            const A = arrA[0] + arrA[1];

            if (F < 10) {
                isEligible = false;
                statusReason = "Awarded U Grade (End term exam score < 10/40)";
            }

            T = Qz + A + F;

            steps.push(`Quiz Component Qz = 2 * (0.7*${qMax} + 0.3*${qMin}) = ${Qz.toFixed(2)} / 40`);
            steps.push(`Assignment Component A = Best 2 of (${a1}, ${a2}, ${a3}) = ${A.toFixed(2)} / 20`);
            steps.push(`End Term Component F = ${F.toFixed(2)} / 40`);

        } else if (type === "tds_formula") {
            const GAA = getVal('inp_gaa');
            const ROE = getVal('inp_roe');
            const P1 = getVal('inp_p1');
            const P2 = getVal('inp_p2');
            const F = getVal('inp_f');

            T = 0.20 * GAA + 0.20 * ROE + 0.20 * P1 + 0.20 * P2 + 0.20 * F;

            steps.push(`GAA (20%) = 0.20 * ${GAA} = ${(0.20 * GAA).toFixed(2)}`);
            steps.push(`ROE Remote Exam (20%) = 0.20 * ${ROE} = ${(0.20 * ROE).toFixed(2)}`);
            steps.push(`Project 1 (20%) = 0.20 * ${P1} = ${(0.20 * P1).toFixed(2)}`);
            steps.push(`Project 2 (20%) = 0.20 * ${P2} = ${(0.20 * P2).toFixed(2)}`);
            steps.push(`Final Exam F (20%) = 0.20 * ${F} = ${(0.20 * F).toFixed(2)}`);

        } else if (type === "oppe_single") {
            const GAA = getVal('inp_gaa');
            const OP = getVal('inp_op');
            const Qz1 = getVal('inp_qz1');
            const Qz2 = getVal('inp_qz2');
            const F = getVal('inp_f');

            const qMax = Math.max(Qz1, Qz2);
            const qOpt1 = 0.20 * qMax;
            const qOpt2 = 0.15 * Qz1 + 0.15 * Qz2;
            const qComp = Math.max(qOpt1, qOpt2);

            const gaaWeight = (subj.level === "degree") ? 0.10 : 0.05;
            const fWeight = (subj.level === "degree") ? 0.40 : 0.45;

            T = gaaWeight * GAA + 0.20 * OP + fWeight * F + qComp;

            steps.push(`GAA (${(gaaWeight * 100).toFixed(0)}%) = ${gaaWeight} * ${GAA} = ${(gaaWeight * GAA).toFixed(2)}`);
            steps.push(`Online Proctored Exam (20%) = 0.20 * ${OP} = ${(0.20 * OP).toFixed(2)}`);
            steps.push(`End Term F (${(fWeight * 100).toFixed(0)}%) = ${fWeight} * ${F} = ${(fWeight * F).toFixed(2)}`);
            steps.push(`Quiz Component = max(0.2*${qMax}, 0.15*${Qz1}+0.15*${Qz2}) = ${qComp.toFixed(2)}`);

        } else if (type === "degree_standard") {
            const GAA = getVal('inp_gaa');
            const Qz1 = getVal('inp_qz1');
            const Qz2 = getVal('inp_qz2');
            const F = getVal('inp_f');

            const qMax = Math.max(Qz1, Qz2);
            const opt1 = 0.50 * F + 0.20 * qMax;
            const opt2 = 0.40 * F + 0.25 * Qz1 + 0.25 * Qz2;
            const examComp = Math.max(opt1, opt2);

            T = 0.10 * GAA + examComp;

            steps.push(`GAA Component (10%) = 0.10 * ${GAA} = ${(0.10 * GAA).toFixed(2)}`);
            steps.push(`Exam Option 1 (0.5F + 0.2maxQ) = 0.5*${F} + 0.2*${qMax} = ${opt1.toFixed(2)}`);
            steps.push(`Exam Option 2 (0.4F + 0.25Q1 + 0.25Q2) = 0.4*${F} + 0.25*${Qz1} + 0.25*${Qz2} = ${opt2.toFixed(2)}`);
            steps.push(`Exam Component = max(${opt1.toFixed(2)}, ${opt2.toFixed(2)}) = ${examComp.toFixed(2)}`);

        } else if (type === "project_standard") {
            const P1 = getVal('inp_p1');
            const P2 = getVal('inp_p2');
            const Viva = getVal('inp_viva');
            const Pres = getVal('inp_presentation');

            T = 0.20 * P1 + 0.30 * P2 + 0.30 * Viva + 0.20 * Pres;

            steps.push(`Milestone 1 (20%) = 0.20 * ${P1} = ${(0.20 * P1).toFixed(2)}`);
            steps.push(`Milestone 2 (30%) = 0.30 * ${P2} = ${(0.30 * P2).toFixed(2)}`);
            steps.push(`Viva Defense (30%) = 0.30 * ${Viva} = ${(0.30 * Viva).toFixed(2)}`);
            steps.push(`Presentation (20%) = 0.20 * ${Pres} = ${(0.20 * Pres).toFixed(2)}`);
        }

        // Clamp T between 0 and 100
        T = Math.max(0, Math.min(100, T));

        // Determine Letter Grade & Grade Points
        const { grade, gpa } = getGradeLetterAndPoints(T, isEligible);

        // Update UI Results
        resultTotalScore.textContent = `${T.toFixed(1)} / 100`;
        resultGradeLetter.textContent = grade;
        resultGradePoints.textContent = `${gpa} Points`;

        if (isEligible) {
            resultStatusBadge.className = "pill-badge text-success";
            resultStatusBadge.innerHTML = `<i class="fa-solid fa-circle-check"></i> Eligible for Grading`;
        } else {
            resultStatusBadge.className = "pill-badge text-danger";
            resultStatusBadge.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> ${statusReason}`;
        }

        // Update Ring Offset
        const circumference = 264;
        const offset = circumference - (T / 100) * circumference;
        resultGradeRing.style.strokeDashoffset = offset;
        resultGradeRing.style.stroke = getGradeColor(grade);

        // Update Step-by-Step Breakdown List
        resultStepList.innerHTML = "";
        steps.forEach((st, idx) => {
            const div = document.createElement('div');
            div.className = "breakdown-step";
            div.textContent = `${idx + 1}. ${st}`;
            resultStepList.appendChild(div);
        });

        // Calculate Target Scores needed in End Term
        renderTargetEndTermPredictor(T, subj);
    }

    function getGradeLetterAndPoints(score, isEligible) {
        if (!isEligible) return { grade: "U", gpa: 0 };
        if (score >= 90) return { grade: "S", gpa: 10 };
        if (score >= 80) return { grade: "A", gpa: 9 };
        if (score >= 70) return { grade: "B", gpa: 8 };
        if (score >= 60) return { grade: "C", gpa: 7 };
        if (score >= 50) return { grade: "D", gpa: 6 };
        if (score >= 40) return { grade: "E", gpa: 4 };
        return { grade: "U", gpa: 0 };
    }

    function getGradeColor(grade) {
        switch (grade) {
            case "S": return "#059669";
            case "A": return "#10B981";
            case "B": return "#2563EB";
            case "C": return "#D97706";
            case "D": return "#F59E0B";
            case "E": return "#888880";
            default: return "#DC2626";
        }
    }

    // --------------------------------------------------------------------------
    // 6. Target End-Term Score Predictor
    // --------------------------------------------------------------------------
    function renderTargetEndTermPredictor(currentT, subj) {
        targetGrid.innerHTML = "";
        const grades = [
            { letter: "S", cutoff: 90 },
            { letter: "A", cutoff: 80 },
            { letter: "B", cutoff: 70 },
            { letter: "C", cutoff: 60 }
        ];

        const fInput = document.getElementById('inp_f') || document.getElementById('inp_f_ba');
        const currentF = fInput ? parseFloat(fInput.value) || 0 : 0;

        grades.forEach(g => {
            const card = document.createElement('div');
            card.className = "target-item";

            // Approximate required F
            // T = baseWithoutF + fWeight * F  => F = (cutoff - baseWithoutF) / fWeight
            // Quick linear approximation:
            let neededF = currentF + (g.cutoff - currentT) * 1.6;
            neededF = Math.round(neededF);

            let displayTxt = "";
            if (currentT >= g.cutoff) {
                displayTxt = "Already Achieved!";
            } else if (neededF > 100) {
                displayTxt = "Requires > 100 Marks";
            } else if (neededF <= 0) {
                displayTxt = "0 Marks Needed";
            } else {
                displayTxt = `${neededF} / 100 in ET`;
            }

            card.innerHTML = `
                <div class="target-grade-badge" style="background: ${getGradeColor(g.letter)}">${g.letter}</div>
                <div class="card-sub mb-1">Target >= ${g.cutoff}%</div>
                <div class="target-needed">${displayTxt}</div>
            `;
            targetGrid.appendChild(card);
        });
    }

    // --------------------------------------------------------------------------
    // 7. CGPA & Multi-Subject Calculator Engine
    // --------------------------------------------------------------------------
    let cgpaCourses = [
        { name: "Mathematics 1", credits: 4, score: 88, grade: "A", points: 9 },
        { name: "Statistics 1", credits: 4, score: 92, grade: "S", points: 10 },
        { name: "Computational Thinking", credits: 4, score: 78, grade: "B", points: 8 },
        { name: "English 1", credits: 4, score: 85, grade: "A", points: 9 }
    ];

    function renderCgpaTable() {
        cgpaTableBody.innerHTML = "";
        cgpaCourses.forEach((course, index) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>
                    <input type="text" class="cgpa-name-input" value="${course.name}" data-index="${index}">
                </td>
                <td>
                    <select class="cgpa-credit-select" data-index="${index}">
                        <option value="4" ${course.credits == 4 ? 'selected' : ''}>4 Credits</option>
                        <option value="3" ${course.credits == 3 ? 'selected' : ''}>3 Credits</option>
                        <option value="2" ${course.credits == 2 ? 'selected' : ''}>2 Credits</option>
                        <option value="1" ${course.credits == 1 ? 'selected' : ''}>1 Credit</option>
                    </select>
                </td>
                <td>
                    <input type="number" min="0" max="100" class="cgpa-score-input" value="${course.score}" data-index="${index}" style="width: 80px;">
                </td>
                <td>
                    <strong class="cgpa-grade-display" style="color: ${getGradeColor(course.grade)}">${course.grade} (${course.points} pts)</strong>
                </td>
                <td>
                    <button class="btn btn-outline remove-cgpa-row" data-index="${index}" style="padding: 4px 10px; font-size: 0.8rem; border-color: var(--accent-red); color: var(--accent-red);">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>
            `;
            cgpaTableBody.appendChild(tr);
        });

        calculateCgpaOverall();
    }

    function calculateCgpaOverall() {
        let totalWeightedPoints = 0;
        let totalCredits = 0;

        cgpaCourses.forEach(c => {
            const { grade, gpa } = getGradeLetterAndPoints(c.score, true);
            c.grade = grade;
            c.points = gpa;
            totalWeightedPoints += c.points * c.credits;
            totalCredits += c.credits;
        });

        const overallCGPA = totalCredits > 0 ? (totalWeightedPoints / totalCredits) : 0;

        totalCreditsEl.textContent = `${totalCredits} Credits`;
        overallCgpaEl.textContent = overallCGPA.toFixed(2);

        if (overallCGPA >= 9.0) {
            cgpaStatusBadge.className = "pill-badge text-success";
            cgpaStatusBadge.innerHTML = `<i class="fa-solid fa-trophy"></i> S-Grade Distinction Target`;
        } else if (overallCGPA >= 8.0) {
            cgpaStatusBadge.className = "pill-badge text-success";
            cgpaStatusBadge.innerHTML = `<i class="fa-solid fa-star"></i> First Class with Distinction`;
        } else if (overallCGPA >= 6.5) {
            cgpaStatusBadge.className = "pill-badge text-warning";
            cgpaStatusBadge.innerHTML = `<i class="fa-solid fa-check"></i> Good Standing`;
        } else {
            cgpaStatusBadge.className = "pill-badge text-danger";
            cgpaStatusBadge.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> Academic Warning Threshold (<6.5)`;
        }
    }

    // CGPA Event Delegation
    cgpaTableBody.addEventListener('input', (e) => {
        const index = e.target.getAttribute('data-index');
        if (index === null) return;
        if (e.target.classList.contains('cgpa-name-input')) {
            cgpaCourses[index].name = e.target.value;
        } else if (e.target.classList.contains('cgpa-credit-select')) {
            cgpaCourses[index].credits = parseInt(e.target.value) || 4;
        } else if (e.target.classList.contains('cgpa-score-input')) {
            cgpaCourses[index].score = parseFloat(e.target.value) || 0;
        }
        renderCgpaTable();
    });

    cgpaTableBody.addEventListener('change', (e) => {
        const index = e.target.getAttribute('data-index');
        if (index === null) return;
        if (e.target.classList.contains('cgpa-credit-select')) {
            cgpaCourses[index].credits = parseInt(e.target.value) || 4;
            renderCgpaTable();
        }
    });

    cgpaTableBody.addEventListener('click', (e) => {
        const btn = e.target.closest('.remove-cgpa-row');
        if (btn) {
            const index = parseInt(btn.getAttribute('data-index'));
            cgpaCourses.splice(index, 1);
            renderCgpaTable();
        }
    });

    addCourseRowBtn.addEventListener('click', () => {
        cgpaCourses.push({
            name: `Course ${cgpaCourses.length + 1}`,
            credits: 4,
            score: 80,
            grade: "A",
            points: 9
        });
        renderCgpaTable();
    });

    // --------------------------------------------------------------------------
    // 8. Mode Switcher & Filter Listeners
    // --------------------------------------------------------------------------
    tabCourseCalc.addEventListener('click', () => {
        tabCourseCalc.classList.add('active');
        tabCgpaCalc.classList.remove('active');
        courseCalcSection.classList.remove('hidden');
        cgpaCalcSection.classList.add('hidden');
    });

    tabCgpaCalc.addEventListener('click', () => {
        tabCgpaCalc.classList.add('active');
        tabCourseCalc.classList.remove('active');
        cgpaCalcSection.classList.remove('hidden');
        courseCalcSection.classList.add('hidden');
        renderCgpaTable();
    });

    levelFilters.forEach(chip => {
        chip.addEventListener('click', () => {
            levelFilters.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            activeLevelFilter = chip.getAttribute('data-level');
            renderSubjectOptions(activeLevelFilter, subjectSearch.value);
            if (subjectSelect.value) {
                loadSubjectForm(subjectSelect.value);
            }
        });
    });

    subjectSelect.addEventListener('change', (e) => {
        loadSubjectForm(e.target.value);
    });

    subjectSearch.addEventListener('input', (e) => {
        renderSubjectOptions(activeLevelFilter, e.target.value);
        if (subjectSelect.value) {
            loadSubjectForm(subjectSelect.value);
        }
    });

    // Initial Initialization
    renderSubjectOptions("all", "");
    loadSubjectForm("maths1");
    renderCgpaTable();
});
