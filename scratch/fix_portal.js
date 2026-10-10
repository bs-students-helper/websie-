const fs = require('fs');
const path = require('path');

const projectRoot = path.join(__dirname, '..');

function findFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      findFiles(filePath, fileList);
    } else if (file.endsWith('.html') || file.endsWith('.js') || file.endsWith('.vue')) {
      fileList.push(filePath);
    }
  });
  return fileList;
}

const files = findFiles(path.join(projectRoot, 'public'));
files.push(path.join(projectRoot, 'src', 'components', 'QuizEngine.vue'));

let updatedFilesCount = 0;

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  let changed = false;

  // 1. Replace View Solutions (0) and View Solution (0) with View Solutions (1)
  if (content.includes('View Solutions (0)')) {
    content = content.replace(/View Solutions \(0\)/g, 'View Solutions (1)');
    changed = true;
  }
  if (content.includes('View Solution (0)')) {
    content = content.replace(/View Solution \(0\)/g, 'View Solution (1)');
    changed = true;
  }

  // 2. In question-portal-engine.js: Replace View Solutions (${n.qn}) with View Solutions (1)
  if (content.includes('View Solutions (${n.qn})')) {
    content = content.replace(/View Solutions \(\${n\.qn}\)/g, 'View Solutions (1)');
    changed = true;
  }

  // 3. Ensure setPortalMode in HTML files forces all .solution-box to open when mode === 'learning'
  if (f.endsWith('.html') && content.includes('function setPortalMode(mode)')) {
    // Check if setPortalMode already has DOM solution-box toggle
    if (!content.includes("document.querySelectorAll('.solution-box').forEach")) {
      const targetStr = "document.getElementById('btnLearningMode').classList.toggle('active', mode === 'learning');";
      const replacementStr = targetStr + "\n\n            document.querySelectorAll('.solution-box').forEach(box => { if (mode === 'learning') box.classList.add('open'); else box.classList.remove('open'); });\n            document.querySelectorAll('.accepted-ans-box').forEach(box => { box.style.display = (mode === 'learning') ? 'block' : 'none'; });";
      if (content.includes(targetStr)) {
        content = content.replace(targetStr, replacementStr);
        changed = true;
      }
    }
  }

  if (changed) {
    fs.writeFileSync(f, content, 'utf8');
    updatedFilesCount++;
    console.log('Updated:', path.relative(projectRoot, f));
  }
});

console.log('Total files updated:', updatedFilesCount);
