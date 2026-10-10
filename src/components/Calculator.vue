<template>
  <div class="calculator-app">
    <!-- Vue 3 SEC Grade Calculator Component -->
    <div class="calculator-card shadow-lg">
      <div class="calculator-header">
        <h2 class="card-title">IITM BS SEC & Course Grade Calculator</h2>
        <p class="card-subtitle">Official grading formulas for May 2026 Term</p>
      </div>

      <div class="calculator-body">
        <div class="filter-group mb-4">
          <label for="courseSelectVue" class="form-label font-semibold">Select Course / Subject:</label>
          <select id="courseSelectVue" v-model="selectedCourseId" class="form-select">
            <option value="">-- Choose Course --</option>
            <optgroup label="Foundational Level">
              <option value="maths1">Mathematics for Data Science 1</option>
              <option value="english1">English 1</option>
              <option value="ct">Computational Thinking</option>
              <option value="stats1">Statistics for Data Science 1</option>
              <option value="maths2">Mathematics for Data Science 2</option>
              <option value="english2">English 2</option>
              <option value="python">Programming in Python</option>
              <option value="stats2">Statistics for Data Science 2</option>
            </optgroup>
            <optgroup label="Diploma Level - Programming">
              <option value="pdsa">PDSA (Python Data Structures)</option>
              <option value="dbms">DBMS (Database Management)</option>
              <option value="appdev1">Modern Application Development 1 (MAD 1)</option>
              <option value="appdev2">Modern Application Development 2 (MAD 2)</option>
              <option value="system_commands">System Commands & Shell Scripting</option>
              <option value="java">Programming in Java</option>
            </optgroup>
            <optgroup label="Diploma Level - Data Science">
              <option value="mlt">Machine Learning Techniques (MLT)</option>
              <option value="mlp">Machine Learning Practice (MLP)</option>
              <option value="mld">Machine Learning Foundations (MLF)</option>
              <option value="bdm">Business Data Management (BDM)</option>
              <option value="ba">Business Analytics</option>
              <option value="tds">Tools in Data Science (TDS)</option>
            </optgroup>
          </select>
        </div>

        <div v-if="selectedCourse" class="selected-course-info p-4 rounded bg-surface border mb-4">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <h4 class="font-bold text-primary m-0">{{ selectedCourse.name }}</h4>
            <span class="badge bg-secondary text-capitalize">{{ selectedCourse.level }}</span>
          </div>
          <p class="text-muted text-xs mb-1"><strong>Formula:</strong> <code>{{ selectedCourse.formulaText }}</code></p>
          <ul class="text-xs text-muted pl-4 m-0">
            <li v-for="(note, idx) in selectedCourse.notes" :key="idx">{{ note }}</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

interface SubjectConfig {
  id: string;
  name: string;
  level: string;
  credits: number;
  formulaType: string;
  formulaText: string;
  notes: string[];
  inputs: string[];
}

const SUBJECT_DATABASE: Record<string, SubjectConfig> = {
  maths1: {
    id: "maths1",
    name: "Mathematics for Data Science 1",
    level: "foundational",
    credits: 4,
    formulaType: "foundational_standard",
    formulaText: "T = max(0.6*F + 0.3*max(Qz1, Qz2), 0.45*F + 0.25*Qz1 + 0.3*Qz2)",
    notes: [
      "Eligibility for ET: Best 5 of 8 (W1-W7 + Mock Quiz 1) >= 40/100 AND attendance in 1 of 2 Quizzes.",
      "Major Change: GAA weightage in Foundation Level is 0%."
    ],
    inputs: ["qz1", "qz2", "f"]
  },
  english1: {
    id: "english1",
    name: "English 1",
    level: "foundational",
    credits: 4,
    formulaType: "foundational_standard",
    formulaText: "T = max(0.6*F + 0.3*max(Qz1, Qz2), 0.45*F + 0.25*Qz1 + 0.3*Qz2)",
    notes: ["Eligibility for ET: Best 5 out of first 7 weekly assignments >= 40/100."],
    inputs: ["qz1", "qz2", "f"]
  },
  ct: {
    id: "ct",
    name: "Computational Thinking",
    level: "foundational",
    credits: 4,
    formulaType: "foundational_standard",
    formulaText: "T = max(0.6*F + 0.3*max(Qz1, Qz2), 0.45*F + 0.25*Qz1 + 0.3*Qz2)",
    notes: ["Eligibility for ET: Best 5 of 8 >= 40/100."],
    inputs: ["qz1", "qz2", "f"]
  },
  stats1: {
    id: "stats1",
    name: "Statistics for Data Science 1",
    level: "foundational",
    credits: 4,
    formulaType: "foundational_bonus",
    formulaText: "T = max(0.6*F + 0.3*max(Qz1, Qz2), 0.45*F + 0.25*Qz1 + 0.3*Qz2) + Bonus",
    notes: ["Bonus: Up to 5 marks extra activity bonus."],
    inputs: ["qz1", "qz2", "f", "bonus"]
  },
  python: {
    id: "python",
    name: "Programming in Python",
    level: "foundational",
    credits: 4,
    formulaType: "python_standard",
    formulaText: "T = 0.1*GAA + 0.1*PE1 + 0.1*PE2 + max(0.4*F + 0.25*max(Q1,Q2), 0.4*F + 0.15*Q1 + 0.15*Q2)",
    notes: ["Includes OPPE 1 and OPPE 2 programming exams."],
    inputs: ["gaa", "oppe1", "oppe2", "qz1", "qz2", "f"]
  },
  java: {
    id: "java",
    name: "Programming in Java",
    level: "diploma",
    credits: 4,
    formulaType: "diploma_oppe",
    formulaText: "T = 0.1*GAA + 0.15*OPPE1 + 0.15*OPPE2 + 0.2*Qz2 + 0.4*F",
    notes: ["Diploma level Java programming formula."],
    inputs: ["gaa", "oppe1", "oppe2", "qz2", "f"]
  }
};

const selectedCourseId = ref<string>('maths1');

const selectedCourse = computed(() => {
  return SUBJECT_DATABASE[selectedCourseId.value] || null;
});
</script>
