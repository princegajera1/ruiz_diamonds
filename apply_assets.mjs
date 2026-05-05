import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const srcDir = path.join(__dirname, 'src');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
  });
}

const logoPattern = /\/@fs\/[^\/]+\/media__\d+\.jpg/g;
const imgPattern = /\/@fs\/[^\/]+\/(?:hero_banner|cat_ring|cat_necklace|cat_earrings|cat_bangles)_\d+\.png/g;

walkDir(srcDir, (filePath) => {
  if (filePath.endsWith('.jsx')) {
    let content = fs.readFileSync(filePath, 'utf-8');
    let modified = false;

    // Check if we need to add imports
    const needsLogo = logoPattern.test(content);
    const needsImg = imgPattern.test(content);

    // Calculate relative path to assets folder
    const relativeDepth = filePath.split(path.sep).length - srcDir.split(path.sep).length - 1;
    const prefix = relativeDepth === 0 ? './assets/' : '../'.repeat(relativeDepth) + 'assets/';

    if (needsLogo) {
      if (!content.includes(`import logoImg from '${prefix}roz_logo.png';`)) {
        content = `import logoImg from '${prefix}roz_logo.png';\n` + content;
      }
      // Replace JSX src attributes specifically for the logo
      content = content.replace(/src="\/@fs\/[^"]+media__\d+\.jpg"/g, 'src={logoImg}');
      modified = true;
    }

    if (needsImg) {
      if (!content.includes(`import mainImg from '${prefix}img_1.jpg.jpeg';`)) {
        content = `import mainImg from '${prefix}img_1.jpg.jpeg';\n` + content;
      }
      
      // Replace src string attributes
      content = content.replace(/src="\/@fs\/[^"]+\.png"/g, 'src={mainImg}');
      // Replace object property values e.g. image: "/@fs/..."
      content = content.replace(/image:\s*['"]\/@fs\/[^'"]+\.png['"]/g, 'image: mainImg');
      // Replace inline background URLs
      content = content.replace(/url\(['"]?\/@fs\/[^'"]+\.png['"]?\)/g, 'url(${mainImg})');
      
      modified = true;
    }

    if (modified) {
      fs.writeFileSync(filePath, content, 'utf-8');
      console.log(`Updated ${path.basename(filePath)}`);
    }
  } else if (filePath.endsWith('.css')) {
    let content = fs.readFileSync(filePath, 'utf-8');
    let modified = false;

    // CSS files: replace url(/@fs/...) with url(../assets/...)
    // All our CSS files are 1 level deep (in components/ or pages/), except index.css which has no images
    if (content.match(logoPattern) || content.match(imgPattern)) {
      content = content.replace(/url\(['"]?\/@fs\/[^'"]+media__\d+\.jpg['"]?\)/g, `url('../assets/roz_logo.png')`);
      content = content.replace(/url\(['"]?\/@fs\/[^'"]+\.png['"]?\)/g, `url('../assets/img_1.jpg.jpeg')`);
      modified = true;
    }

    if (modified) {
      fs.writeFileSync(filePath, content, 'utf-8');
      console.log(`Updated ${path.basename(filePath)}`);
    }
  }
});

console.log("Done updating code to use src/assets!");
