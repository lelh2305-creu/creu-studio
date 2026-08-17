const fs = require('fs');
const path = require('path');

async function uploadCatbox(filePath) {
  try {
    const buffer = fs.readFileSync(filePath);
    const blob = new Blob([buffer]);
    const formData = new FormData();
    formData.append('reqtype', 'fileupload');
    formData.append('fileToUpload', blob, path.basename(filePath));

    const res = await fetch('https://catbox.moe/user/api.php', {
      method: 'POST',
      body: formData,
    });
    const text = await res.text();
    if (text.startsWith('http')) {
      console.log(`Uploaded SUCCESS:`, text.trim());
      return text.trim();
    } else {
      console.error('Upload failed response:', text);
    }
  } catch (e) {
    console.error('Error uploading:', e.message);
  }
  return null;
}

async function main() {
  const filePath = path.join(__dirname, '../ChatGPT Image Aug 17, 2026, 09_41_48 PM.png');
  const url = await uploadCatbox(filePath);
  console.log('FINAL_URL:', url);
}

main();
