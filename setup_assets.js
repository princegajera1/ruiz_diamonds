import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Copy Images
const sourceDir = 'C:\\Users\\princ\\.gemini\\antigravity\\brain\\f0193820-4f8f-4fbf-adab-44d2d1b2e63b';
const destDir = path.join(__dirname, 'public', 'assets');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

const files = fs.readdirSync(sourceDir);
let copiedCount = 0;

files.forEach(file => {
  if (file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.jpeg')) {
    fs.copyFileSync(path.join(sourceDir, file), path.join(destDir, file));
    copiedCount++;
  }
});
console.log(`✅ Successfully copied ${copiedCount} images to public/assets/`);

// 2. Fix Paths in Code
const targetString = '/@fs/C:/Users/princ/.gemini/antigravity/brain/f0193820-4f8f-4fbf-adab-44d2d1b2e63b/';
const replacement = '/assets/';

let fixedFilesCount = 0;

function replaceInDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      replaceInDir(fullPath);
    } else if (file.endsWith('.jsx') || file.endsWith('.css')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes(targetString)) {
        content = content.replaceAll(targetString, replacement);
        fs.writeFileSync(fullPath, content);
        fixedFilesCount++;
        console.log(`  - Fixed paths in ${file}`);
      }
    }
  }
}

replaceInDir(path.join(__dirname, 'src'));
console.log(`✅ Successfully updated image paths in ${fixedFilesCount} files!`);
