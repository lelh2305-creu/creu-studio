const fs = require('fs');
const path = require('path');

async function testUpload() {
  const file1 = path.join(__dirname, '../ChatGPT Image Aug 17, 2026, 08_39_09 PM.png');
  const buffer = fs.readFileSync(file1);
  const base64 = `data:image/png;base64,${buffer.toString('base64')}`;

  const presets = ['ml_default', 'unsigned', 'creu_preset', 'creustudio'];
  for (const preset of presets) {
    try {
      const res = await fetch('https://api.cloudinary.com/v1_1/creustudio/image/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ file: base64, upload_preset: preset }),
      });
      const data = await res.json();
      console.log(`Preset ${preset}:`, data);
      if (data.secure_url) {
        console.log('SUCCESS CLOUDINARY URL:', data.secure_url);
        return;
      }
    } catch (e) {
      console.error(`Error ${preset}:`, e);
    }
  }
}

testUpload();
