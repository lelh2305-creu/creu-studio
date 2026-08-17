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
      console.log(`Catbox upload [${path.basename(filePath)}]:`, text.trim());
      return text.trim();
    }
  } catch (e) {
    console.error('Catbox error:', e.message);
  }
  return null;
}

async function main() {
  const dir = path.join(__dirname, '../public/images/posts/thiet-ke-poster-chuyen-nghiep-tphcm');
  const files = ['thum.png', 'img-01.png', 'img-02.png'];

  const urls = {};
  for (const f of files) {
    const p = path.join(dir, f);
    if (fs.existsSync(p)) {
      console.log(`Uploading ${f}...`);
      let url = await uploadCatbox(p);
      urls[f] = url;
    }
  }
  console.log('\n--- UPLOADED POSTER CDN URLS ---');
  console.log(JSON.stringify(urls, null, 2));
}

main();
