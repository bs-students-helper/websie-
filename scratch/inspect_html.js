const fs = require('fs');
const path = require('path');

const projectRoot = path.join(__dirname, '..');

function findFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      findFiles(filePath, fileList);
    } else if (file.endsWith('.html')) {
      fileList.push(filePath);
    }
  });
  return fileList;
}

const htmlFiles = findFiles(path.join(projectRoot, 'public'));

htmlFiles.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  if (content.includes('setPortalMode')) {
    const has0 = content.includes('View Solutions (0)') || content.includes('View Solution (0)');
    const hasQN = content.includes('View Solutions (${');
    const hasSolutionBoxOpen = content.includes("solution-box ${currentMode === 'learning'");
    console.log(path.relative(projectRoot, f) + ' | Has0: ' + has0 + ' | HasQN: ' + hasQN + ' | HasSolutionBoxOpen: ' + hasSolutionBoxOpen);
  }
});
