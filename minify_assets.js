const fs = require('fs');
const path = require('path');
const esbuild = require('esbuild');

async function minifyAll() {
  console.log('--- Starting Asset Minification ---');

  // Minify JS files in public/assets/js if present
  const jsDir = path.join(__dirname, 'public', 'assets', 'js');
  if (fs.existsSync(jsDir)) {
    const jsFiles = fs.readdirSync(jsDir).filter(f => f.endsWith('.js'));
    for (const f of jsFiles) {
      const fullPath = path.join(jsDir, f);
      const code = fs.readFileSync(fullPath, 'utf8');
      const origSize = (code.length / 1024).toFixed(1);
      const minified = await esbuild.transform(code, { minify: true, target: 'es2020' });
      fs.writeFileSync(fullPath, minified.code, 'utf8');
      const newSize = (minified.code.length / 1024).toFixed(1);
      console.log(`Minified JS ${f}: ${origSize} KB -> ${newSize} KB`);
    }
  }
}

minifyAll().catch(console.error);
