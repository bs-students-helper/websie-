const fs = require('fs');
const path = require('path');

const projectRoot = path.join(__dirname, '..');

function findFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      findFiles(filePath, fileList);
    } else if (file.endsWith('.html') || file.endsWith('.js')) {
      fileList.push(filePath);
    }
  });
  return fileList;
}

const files = findFiles(path.join(projectRoot, 'public'));

let updatedCount = 0;

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  let changed = false;

  // 1. For HTML files: Fix setPortalMode to run DOM queries AFTER renderQuestions()
  if (f.endsWith('.html') && content.includes('function setPortalMode(mode)')) {
    // Replace old setPortalMode implementation with clean, correct-order implementation
    const oldSetPortalModeRegex = /function setPortalMode\(mode\) \{[\s\S]*?if \(window\.MathJax\) \{/g;
    const newSetPortalMode = `function setPortalMode(mode) {
            currentMode = mode;
            const btnExam = document.getElementById('btnExamMode');
            const btnLearning = document.getElementById('btnLearningMode');
            if (btnExam) btnExam.classList.toggle('active', mode === 'exam');
            if (btnLearning) btnLearning.classList.toggle('active', mode === 'learning');

            renderQuestions();

            document.querySelectorAll('.solution-box').forEach(box => {
                if (mode === 'learning') box.classList.add('open');
                else box.classList.remove('open');
            });
            document.querySelectorAll('.accepted-ans-box').forEach(box => {
                box.style.display = (mode === 'learning') ? 'block' : 'none';
            });

            updatePaletteStatuses();

            if (window.MathJax) {`;

    if (content.match(oldSetPortalModeRegex)) {
      content = content.replace(oldSetPortalModeRegex, newSetPortalMode);
      changed = true;
    }

    // Also inside renderQuestions(): ensure solution-box open and accepted-ans-box are applied after container.innerHTML = html
    if (content.includes('container.innerHTML = html;') && !content.includes("if (currentMode === 'learning') {\n                document.querySelectorAll('.solution-box')")) {
      content = content.replace(
        'container.innerHTML = html;',
        `container.innerHTML = html;
            if (typeof currentMode !== 'undefined' && currentMode === 'learning') {
                document.querySelectorAll('.solution-box').forEach(box => box.classList.add('open'));
                document.querySelectorAll('.accepted-ans-box').forEach(box => box.style.display = 'block');
            }`
      );
      changed = true;
    }
  }

  // 2. For question-portal-engine.js
  if (f.endsWith('question-portal-engine.js')) {
    if (content.includes('setPortalMode:function(e)')) {
      content = content.replace(
        'this.renderQuestions(),this.updateScoreDisplay()}',
        'this.renderQuestions(),this.updateScoreDisplay(),document.querySelectorAll(".solution-box").forEach(e=>{this.currentMode==="learning"?e.classList.add("open"):e.classList.remove("open")}),document.querySelectorAll(".accepted-ans-box").forEach(e=>{e.style.display=this.currentMode==="learning"?"block":"none"})}'
      );
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(f, content, 'utf8');
    updatedCount++;
    console.log('Updated:', path.relative(projectRoot, f));
  }
});

console.log('Total files updated:', updatedCount);
