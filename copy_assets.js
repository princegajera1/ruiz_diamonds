import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sourceDir = 'C:\\Users\\princ\\.gemini\\antigravity\\brain\\f0193820-4f8f-4fbf-adab-44d2d1b2e63b';
const destDir = path.join(__dirname, 'public', 'assets');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

const files = fs.readdirSync(sourceDir);
let copiedCount = 0;

files.forEach(file => {
  if (file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.jpeg')) {
    let destFile = file;
    // Rename logo file for simplicity if we want, but keeping original name is fine to match the jsx
    fs.copyFileSync(path.join(sourceDir, file), path.join(destDir, file));
    copiedCount++;
    console.log(`Copied ${file} to public/assets/`);
  }
});

console.log(`\nSuccessfully copied ${copiedCount} images to public/assets/`);
