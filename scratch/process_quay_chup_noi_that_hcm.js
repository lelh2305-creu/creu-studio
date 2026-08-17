const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, '../public/images/posts/quay-chup-noi-that-hcm');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const f1 = path.join(__dirname, '../ChatGPT Image Aug 17, 2026, 08_57_34 PM.png');
const f2 = path.join(__dirname, '../ChatGPT Image Aug 17, 2026, 09_00_30 PM.png');
const f3 = path.join(__dirname, '../ChatGPT Image Aug 17, 2026, 09_02_17 PM.png');

const t1 = path.join(targetDir, 'thum.png');
const t2 = path.join(targetDir, 'img1.png');
const t3 = path.join(targetDir, 'img2.png');

if (fs.existsSync(f1)) fs.copyFileSync(f1, t1);
if (fs.existsSync(f2)) fs.copyFileSync(f2, t2);
if (fs.existsSync(f3)) fs.copyFileSync(f3, t3);

console.log('Copied files to public/images/posts/quay-chup-noi-that-hcm/');
