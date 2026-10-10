<template>
  <div class="portal-layout">
    <!-- Mobile Sidebar Toggle -->
    <button class="mobile-sidebar-toggle" id="mobileSidebarToggle" @click="isMobileSidebarOpen = !isMobileSidebarOpen" :class="{ active: isMobileSidebarOpen }">
      <span><i class="fa-solid fa-sliders"></i> Controls & Question Palette</span>
      <i class="fa-solid" :class="isMobileSidebarOpen ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
    </button>

    <!-- Sidebar -->
    <aside class="portal-sidebar" id="portalSidebar" :class="{ open: isMobileSidebarOpen }">
      <!-- Exam Header Info -->
      <div class="exam-info-header">
        <div class="exam-info-row">
          <span class="exam-info-label">Exam :</span>
          <span class="exam-info-val">{{ examTitle || 'Quiz Practice' }}</span>
        </div>
        <div class="exam-info-row">
          <span class="exam-info-label">Subject :</span>
          <span class="exam-info-val">{{ subjectName || 'General' }}</span>
        </div>
        <div class="exam-info-row">
          <span class="exam-info-label">Total Marks :</span>
          <span class="exam-info-val">{{ maxPossibleScore.toFixed(2) }}</span>
        </div>
        <div class="exam-info-row" v-if="qpDate">
          <span class="exam-info-label">Date :</span>
          <span class="exam-info-val" style="font-size:0.75rem;">{{ qpDate }}</span>
        </div>
      </div>

      <!-- Mode Switcher -->
      <div class="menu-block">
        <div class="menu-heading">Portal Mode</div>
        <div class="mode-toggle-group">
          <button type="button" class="mode-btn" :class="{ active: currentMode === 'exam' }" @click="setMode('exam')">
            <i class="fa-solid fa-pen-to-square"></i> Exam Mode
          </button>
          <button type="button" class="mode-btn" :class="{ active: currentMode === 'learning' }" @click="setMode('learning')">
            <i class="fa-solid fa-lightbulb"></i> Learning Mode
          </button>
        </div>
      </div>

      <!-- Timer & Live Score -->
      <div class="menu-block">
        <div class="menu-heading">Time & Progress</div>
        <div class="timer-box">
          <div class="timer-display">{{ formattedTime }}</div>
          <button type="button" class="btn-pause-timer" @click="toggleTimer" title="Pause / Resume Timer">
            <i class="fa-solid" :class="isTimerRunning ? 'fa-pause' : 'fa-play'"></i>
          </button>
        </div>
        <div class="live-score-box" style="margin-top: 10px; font-size: 0.85rem; font-weight: 600; text-align: center; color: var(--text-secondary);">
          Score: <span style="color: var(--accent-orange); font-weight: 700;">{{ currentScore.toFixed(2) }} / {{ maxPossibleScore.toFixed(2) }}</span>
          <span> ({{ scorePercentage }}%)</span>
        </div>
      </div>

      <!-- Question Palette -->
      <div class="menu-block">
        <div class="menu-heading">Question Palette ({{ answeredCount }}/{{ questions.length }})</div>
        <div class="palette-grid">
          <button 
            v-for="q in questions" 
            :key="q.qn"
            type="button"
            class="palette-btn"
            :class="getPaletteClass(q)"
            @click="scrollToQuestion(q.qn)"
          >
            {{ q.qn }}
          </button>
        </div>
      </div>

      <!-- Submit Action Button -->
      <div style="margin-top: 20px;">
        <button type="button" class="btn btn-primary btn-full" @click="submitExam">
          <i class="fa-solid fa-paper-plane"></i> Submit Exam
        </button>
      </div>
    </aside>

    <!-- Main Questions Container -->
    <main class="portal-main-content">
      <div v-if="loading" class="text-center" style="padding: 60px 0;">
        <i class="fa-solid fa-spinner fa-spin fa-2x" style="color: var(--accent-orange);"></i>
        <p style="margin-top: 12px; color: var(--text-secondary);">Loading question paper...</p>
      </div>

      <div v-else class="questions-list">
        <article 
          v-for="q in questions" 
          :key="q.qn"
          :id="`qnCard_${q.qn}`"
          class="qn-card"
        >
          <div class="qn-header-container">
            <div class="qn-header-top">
              <div class="qn-title-main">
                Question {{ q.qn }}
                <span v-if="q.parentQn" class="badge-type" style="background:rgba(167, 139, 250, 0.15); color:#7c3aed; font-size:0.75rem; padding:0.2rem 0.5rem; margin-left:8px;">
                  <i class="fa-solid fa-diagram-project"></i> Parent Q{{ q.parentQn }}
                </span>
              </div>
              <button type="button" class="btn-solution-pill" @click="toggleSolution(q.qn)">
                <i class="fa-regular fa-circle-check"></i> {{ openSolutions[q.qn] || currentMode === 'learning' ? 'Hide Solution' : 'View Solution (1)' }}
              </button>
            </div>
            <div class="qn-header-sub">
              <span class="qn-id-tag">{{ q.id || `Q-${q.qn}` }}</span>
              <span class="qn-meta-info">Total Mark : {{ (q.marks || 1).toFixed(2) }} | Type : {{ q.type }}</span>
            </div>
          </div>

          <!-- Question Body Text -->
          <div class="qn-text" v-html="q.text"></div>

          <!-- Question Inputs -->
          <!-- Comprehension Block -->
          <div v-if="q.type === 'COMPREHENSION'" style="font-size:0.88rem; color:var(--text-muted); font-style:italic; margin-bottom:1.25rem;">
            [Comprehension Passage Block - Subquestions are listed below]
          </div>

          <!-- SA Numeric Input -->
          <div v-else-if="q.type === 'SA'" class="sa-input-wrap">
            <label :for="`sa_${q.qn}`">Answer (Numeric):</label>
            <input 
              type="text" 
              :id="`sa_${q.qn}`" 
              class="sa-input" 
              :value="userAnswers[q.qn] || ''" 
              placeholder="Enter your answer" 
              @input="onSAInput(q.qn, ($event.target as HTMLInputElement).value)"
            />
            <div class="accepted-ans-box" :style="{ display: currentMode === 'learning' ? 'block' : 'none' }">
              <i class="fa-solid fa-circle-check"></i> Accepted Answer : {{ q.acceptedAnswer }}
            </div>
          </div>

          <!-- MCQ / MSQ Options -->
          <div v-else class="options-list">
            <label 
              v-for="(opt, idx) in q.options" 
              :key="idx"
              class="option-item"
              :class="getOptionClass(q, idx)"
              @click="onOptionSelect(q, idx)"
            >
              <input 
                :type="q.type === 'MSQ' ? 'checkbox' : 'radio'" 
                :name="`qn_${q.qn}`" 
                class="option-input"
                :checked="isOptionSelected(q.qn, idx)"
                @click.stop="onOptionSelect(q, idx)"
              />
              <span class="option-text" v-html="opt"></span>
            </label>
          </div>

          <!-- Solution Step-by-Step Box -->
          <div 
            class="solution-box" 
            :class="{ open: openSolutions[q.qn] || currentMode === 'learning' }"
            :id="`solution_${q.qn}`"
          >
            <div class="solution-title">
              <i class="fa-solid fa-circle-info" style="color:var(--accent-purple);"></i> Step-by-Step Solution
            </div>
            <div class="solution-text" v-html="q.solution"></div>
          </div>
        </article>
      </div>
    </main>

    <!-- Result Modal Dialog -->
    <div class="modal-overlay" :class="{ active: showResultsModal }">
      <div class="modal-card coming-soon-card">
        <div class="modal-header">
          <h3><i class="fa-solid fa-award" style="color:var(--accent-orange);"></i> Exam Performance Summary</h3>
          <button type="button" class="modal-close" @click="showResultsModal = false"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div class="coming-soon-body text-center">
          <div style="font-size: 2.8rem; font-weight: 800; color: var(--accent-orange); line-height: 1.1;">
            {{ currentScore.toFixed(2) }} / {{ maxPossibleScore.toFixed(2) }}
          </div>
          <div style="font-size: 1rem; font-weight: 600; color: var(--text-primary); margin-top: 6px; margin-bottom: 20px;">
            {{ scorePercentage }}% Accuracy Score
          </div>

          <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:12px; text-align:center; margin-bottom: 24px;">
            <div style="background:var(--bg-subtle); padding:12px; border-radius:12px; border:1px solid var(--border-light);">
              <div style="color:var(--accent-green); font-size:1.4rem; font-weight:700;">{{ correctCount }}</div>
              <div style="font-size:0.75rem; color:var(--text-muted);">Correct</div>
            </div>
            <div style="background:var(--bg-subtle); padding:12px; border-radius:12px; border:1px solid var(--border-light);">
              <div style="color:var(--accent-red); font-size:1.4rem; font-weight:700;">{{ incorrectCount }}</div>
              <div style="font-size:0.75rem; color:var(--text-muted);">Incorrect</div>
            </div>
            <div style="background:var(--bg-subtle); padding:12px; border-radius:12px; border:1px solid var(--border-light);">
              <div style="color:var(--text-muted); font-size:1.4rem; font-weight:700;">{{ unansweredCount }}</div>
              <div style="font-size:0.75rem; color:var(--text-muted);">Unanswered</div>
            </div>
          </div>

          <div style="display: flex; gap: 12px; justify-content: center;">
            <button type="button" class="btn btn-primary" @click="resetExam">
              <i class="fa-solid fa-rotate-right"></i> Retake Exam
            </button>
            <button type="button" class="btn btn-secondary" @click="showResultsModal = false; setMode('learning')">
              <i class="fa-solid fa-book-open"></i> Review Solutions
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue';

interface Question {
  qn: number;
  id?: string;
  type: 'MCQ' | 'MSQ' | 'SA' | 'COMPREHENSION';
  marks?: number;
  parentQn?: number;
  text?: string;
  options?: string[];
  correct?: number[];
  acceptedAnswer?: string;
  solution?: string;
}

const props = defineProps<{
  questionsUrl?: string;
  questionsData?: Question[];
  examTitle?: string;
  subjectName?: string;
  totalMarks?: number;
  qpDate?: string;
}>();

const loading = ref(true);
const questions = ref<Question[]>([]);
const currentMode = ref<'exam' | 'learning'>('exam');
const userAnswers = ref<Record<number, any>>({});
const openSolutions = ref<Record<number, boolean>>({});
const timerSeconds = ref(0);
const isTimerRunning = ref(true);
const showResultsModal = ref(false);
const isMobileSidebarOpen = ref(false);
let timerInterval: any = null;

// Timer Formatting
const formattedTime = computed(() => {
  const m = Math.floor(timerSeconds.value / 60).toString().padStart(2, '0');
  const s = (timerSeconds.value % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
});

// Calculate Maximum Possible Score
const maxPossibleScore = computed(() => {
  if (props.totalMarks) return props.totalMarks;
  return questions.value.reduce((acc, q) => acc + (q.marks || 0), 0) || 50;
});

// Scoring logic
function getQuestionScore(q: Question): number {
  const ans = userAnswers.value[q.qn];
  if (ans == null || ans === '' || (Array.isArray(ans) && ans.length === 0)) return 0;

  if (q.type === 'SA') {
    return ans === q.acceptedAnswer ? (q.marks || 1) : 0;
  }
  if (q.type === 'MCQ') {
    return (q.correct && q.correct[0] === ans[0]) ? (q.marks || 1) : 0;
  }
  if (q.type === 'MSQ') {
    const userSorted = [...(ans || [])].sort().join(',');
    const correctSorted = [...(q.correct || [])].sort().join(',');
    return userSorted === correctSorted ? (q.marks || 1) : 0;
  }
  return 0;
}

const currentScore = computed(() => {
  return questions.value.reduce((acc, q) => acc + getQuestionScore(q), 0);
});

const scorePercentage = computed(() => {
  if (maxPossibleScore.value === 0) return '0.0';
  return ((currentScore.value / maxPossibleScore.value) * 100).toFixed(1);
});

const answeredCount = computed(() => {
  return questions.value.filter(q => {
    if (q.type === 'COMPREHENSION') return false;
    const ans = userAnswers.value[q.qn];
    return ans != null && ans !== '' && (!Array.isArray(ans) || ans.length > 0);
  }).length;
});

const correctCount = computed(() => {
  return questions.value.filter(q => q.type !== 'COMPREHENSION' && getQuestionScore(q) > 0).length;
});

const incorrectCount = computed(() => {
  return questions.value.filter(q => {
    if (q.type === 'COMPREHENSION') return false;
    const ans = userAnswers.value[q.qn];
    const hasAns = ans != null && ans !== '' && (!Array.isArray(ans) || ans.length > 0);
    return hasAns && getQuestionScore(q) === 0;
  }).length;
});

const unansweredCount = computed(() => {
  return questions.value.filter(q => {
    if (q.type === 'COMPREHENSION') return false;
    const ans = userAnswers.value[q.qn];
    return !(ans != null && ans !== '' && (!Array.isArray(ans) || ans.length > 0));
  }).length;
});

// Mode Toggle
function setMode(mode: 'exam' | 'learning') {
  currentMode.value = mode;
  triggerMathJax();
}

// Option handlers
function isOptionSelected(qn: number, idx: number): boolean {
  const ans = userAnswers.value[qn];
  if (!ans) return false;
  return Array.isArray(ans) ? ans.includes(idx) : ans === idx;
}

function onOptionSelect(q: Question, idx: number) {
  if (q.type === 'MCQ') {
    userAnswers.value[q.qn] = [idx];
  } else if (q.type === 'MSQ') {
    if (!userAnswers.value[q.qn]) userAnswers.value[q.qn] = [];
    const pos = userAnswers.value[q.qn].indexOf(idx);
    if (pos >= 0) userAnswers.value[q.qn].splice(pos, 1);
    else userAnswers.value[q.qn].push(idx);
  }
}

function onSAInput(qn: number, val: string) {
  userAnswers.value[qn] = val.trim();
}

function getOptionClass(q: Question, idx: number): string {
  const selected = isOptionSelected(q.qn, idx);
  let cls = selected ? 'selected' : '';
  if (currentMode.value === 'learning') {
    const isCorrect = q.correct?.includes(idx);
    if (isCorrect) cls += ' correct-highlight';
    else if (selected && !isCorrect) cls += ' incorrect-highlight';
  }
  return cls;
}

function getPaletteClass(q: Question): string {
  const ans = userAnswers.value[q.qn];
  const hasAns = ans != null && ans !== '' && (!Array.isArray(ans) || ans.length > 0);
  let cls = hasAns ? 'answered' : '';
  if (currentMode.value === 'learning' && hasAns) {
    if (getQuestionScore(q) > 0) cls += ' correct';
    else cls += ' incorrect';
  }
  return cls;
}

function toggleSolution(qn: number) {
  openSolutions.value[qn] = !openSolutions.value[qn];
  triggerMathJax();
}

function scrollToQuestion(qn: number) {
  const el = document.getElementById(`qnCard_${qn}`);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function toggleTimer() {
  isTimerRunning.value = !isTimerRunning.value;
}

function submitExam() {
  setMode('learning');
  showResultsModal.value = true;
}

function resetExam() {
  userAnswers.value = {};
  openSolutions.value = {};
  timerSeconds.value = 0;
  showResultsModal.value = false;
  setMode('exam');
}

function triggerMathJax() {
  nextTick(() => {
    if (typeof window !== 'undefined' && (window as any).MathJax) {
      (window as any).MathJax.typesetPromise?.();
    }
  });
}

onMounted(async () => {
  if (props.questionsData && props.questionsData.length > 0) {
    questions.value = props.questionsData;
    loading.value = false;
  } else {
    const url = props.questionsUrl || '/assets/data/quizzes/maths1_quiz1_13jul25.json';
    try {
      const res = await fetch(url);
      if (res.ok) {
        questions.value = await res.json();
      }
    } catch (err) {
      console.error('Failed to load quiz data:', err);
    } finally {
      loading.value = false;
    }
  }

  // Timer loop
  timerInterval = setInterval(() => {
    if (isTimerRunning.value) {
      timerSeconds.value++;
    }
  }, 1000);

  triggerMathJax();
});
</script>

<style scoped>
.portal-layout {
  display: flex;
  gap: 24px;
  width: 90%;
  max-width: 1240px;
  margin: 30px auto;
  position: relative;
}
.portal-sidebar {
  width: 280px;
  min-width: 280px;
  flex-shrink: 0;
  background: var(--bg-surface);
  border: 1.5px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: 20px;
  box-shadow: var(--shadow-md);
  position: sticky;
  top: 90px;
  height: fit-content;
  max-height: calc(100vh - 110px);
  overflow-y: auto;
}
.portal-main-content {
  flex: 1;
  min-width: 0;
}
.exam-info-header {
  border-bottom: 1px dashed var(--border-color);
  padding-bottom: 12px;
  margin-bottom: 16px;
}
.exam-info-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  padding: 3px 0;
}
.exam-info-label {
  color: var(--text-muted);
}
.exam-info-val {
  font-weight: 700;
  color: var(--text-primary);
}
.menu-block {
  margin-top: 16px;
}
.menu-heading {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-muted);
  margin-bottom: 8px;
}
.mode-toggle-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.mode-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border-color);
  background: var(--bg-main);
  color: var(--text-secondary);
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s;
}
.mode-btn.active {
  background: var(--accent-orange, #e65527);
  color: #fff;
  border-color: var(--accent-orange, #e65527);
}
.timer-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--bg-main);
  border: 1px solid var(--border-color);
  padding: 8px 14px;
  border-radius: var(--radius-sm);
}
.timer-display {
  font-family: var(--font-mono);
  font-weight: 700;
  font-size: 1.2rem;
  color: var(--text-primary);
}
.btn-pause-timer {
  background: none;
  border: none;
  color: var(--accent-orange);
  cursor: pointer;
  font-size: 1.1rem;
}
.palette-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 6px;
  max-height: 180px;
  overflow-y: auto;
  padding-right: 4px;
}
.palette-btn {
  width: 100%;
  aspect-ratio: 1;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border-color);
  background: var(--bg-main);
  color: var(--text-primary);
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.2s;
}
.palette-btn.answered {
  background: #2563eb;
  color: #fff;
  border-color: #2563eb;
}
.palette-btn.correct {
  background: #10b981;
  color: #fff;
  border-color: #10b981;
}
.palette-btn.incorrect {
  background: #ef4444;
  color: #fff;
  border-color: #ef4444;
}
.qn-card {
  background: var(--bg-surface);
  border: 1.5px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: var(--shadow-sm);
}
.qn-header-container {
  border-bottom: 1px solid var(--border-light);
  padding-bottom: 12px;
  margin-bottom: 16px;
}
.qn-header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.qn-title-main {
  font-family: var(--font-heading);
  font-size: 1.1rem;
  font-weight: 700;
}
.qn-header-sub {
  display: flex;
  gap: 12px;
  font-size: 0.78rem;
  color: var(--text-muted);
  margin-top: 4px;
}
.btn-solution-pill {
  background: var(--bg-subtle);
  border: 1px solid var(--border-color);
  border-radius: 50px;
  padding: 4px 12px;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-primary);
  cursor: pointer;
}
.options-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 16px 0;
}
.option-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 16px;
  border: 1.5px solid var(--border-color);
  border-radius: var(--radius-md);
  background: var(--bg-main);
  cursor: pointer;
  transition: 0.2s;
  font-size: 0.92rem;
}
.option-item.selected {
  border-color: var(--accent-orange);
  background: var(--bg-surface);
}
.option-item.correct-highlight {
  border-color: #10b981;
  background: rgba(16, 185, 129, 0.1);
  color: #065f46;
}
.option-item.incorrect-highlight {
  border-color: #ef4444;
  background: rgba(239, 68, 68, 0.1);
  color: #991b1b;
}
.sa-input-wrap {
  margin: 16px 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.sa-input {
  padding: 10px 14px;
  border: 1.5px solid var(--border-color);
  border-radius: var(--radius-sm);
  background: var(--bg-main);
  color: var(--text-primary);
  font-size: 0.95rem;
  outline: none;
}
.accepted-ans-box {
  padding: 8px 12px;
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid #10b981;
  border-radius: var(--radius-sm);
  color: #065f46;
  font-size: 0.85rem;
  font-weight: 600;
}
.solution-box {
  display: none;
  margin-top: 16px;
  padding: 16px;
  border-radius: var(--radius-md);
  background: var(--bg-subtle);
  border: 1px dashed var(--border-color);
}
.solution-box.open {
  display: block;
}
.solution-title {
  font-weight: 700;
  font-size: 0.9rem;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
}
.solution-text {
  font-size: 0.88rem;
  line-height: 1.5;
  color: var(--text-secondary);
}

.mobile-sidebar-toggle {
  display: none;
  width: 100%;
  padding: 12px 16px;
  background: var(--bg-surface);
  border: 1.5px solid var(--border-color);
  border-radius: var(--radius-md);
  font-weight: 700;
  font-size: 0.9rem;
  color: var(--text-primary);
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  margin-bottom: 16px;
}

@media (max-width: 920px) {
  .portal-layout {
    flex-direction: column;
  }
  .mobile-sidebar-toggle {
    display: flex;
  }
  .portal-sidebar {
    display: none;
    width: 100%;
    position: static;
    max-height: none;
  }
  .portal-sidebar.open {
    display: block;
  }
}
</style>
