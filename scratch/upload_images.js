const fs = require('fs');
const path = require('path');

const files = [
  'ChatGPT Image Aug 17, 2026, 08_57_34 PM.png',
  'ChatGPT Image Aug 17, 2026, 09_00_30 PM.png',
  'ChatGPT Image Aug 17, 2026, 09_02_17 PM.png'
];

async function uploadFile(fileName) {
  const filePath = path.join(__dirname, '..', fileName);
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    return null;
  }
  const buffer = fs.readFileSync(filePath);
  const base64 = `data:image/png;base64,${buffer.toString('base64')}`;

  const presets = ['creu_preset', 'ml_default', 'unsigned', 'creustudio'];
  for (const preset of presets) {
    try {
      const res = await fetch('https://api.cloudinary.com/v1_1/creustudio/image/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ file: base64, upload_preset: preset }),
      });
      const data = await res.json();
      if (data.secure_url) {
        console.log(`Success [${fileName}] with preset [${preset}]: ${data.secure_url}`);
        return data.secure_url;
      } else {
        console.log(`Failed preset [${preset}] for [${fileName}]:`, data.error ? data.error.message : data);
      }
    } catch (e) {
      console.error(`Error preset [${preset}]:`, e.message);
    }
  }
  return null;
}

async function main() {
  const results = {};
  for (const file of files) {
    const url = await uploadFile(file);
    results[file] = url;
  }
  console.log('\n--- FINAL RESULTS ---');
  console.log(JSON.stringify(results, null, 2));
}

main();
