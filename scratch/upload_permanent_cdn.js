const fs = require('fs');
const path = require('path');

async function uploadCatbox(filePath) {
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      console.log(`Uploading [${path.basename(filePath)}] to Catbox (Attempt ${attempt})...`);
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
        console.log(`SUCCESS Catbox [${path.basename(filePath)}]:`, text.trim());
        return text.trim();
      } else {
        console.error(`Catbox error [${path.basename(filePath)}]:`, text);
      }
    } catch (e) {
      console.error(`Attempt ${attempt} error:`, e.message);
      await new Promise((r) => setTimeout(r, 2000));
    }
  }
  return null;
}

async function uploadFreeImageHost(filePath) {
  try {
    console.log(`Uploading [${path.basename(filePath)}] to FreeImageHost...`);
    const buffer = fs.readFileSync(filePath);
    const base64 = buffer.toString('base64');
    const formData = new URLSearchParams();
    formData.append('key', '6d207e02198a847aa98d0a2a901485a5');
    formData.append('action', 'upload');
    formData.append('source', base64);
    formData.append('format', 'json');

    const res = await fetch('https://freeimage.host/api/1/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData.toString(),
    });
    const json = await res.json();
    if (json.image && json.image.url) {
      console.log(`SUCCESS FreeImageHost [${path.basename(filePath)}]:`, json.image.url);
      return json.image.url;
    }
  } catch (e) {
    console.error('FreeImageHost error:', e.message);
  }
  return null;
}

async function main() {
  const dir = path.join(__dirname, '../public/images/posts/quay-chup-noi-that-hcm');
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.png') || f.endsWith('.jpg'));

  const urls = {};
  for (const file of files) {
    const filePath = path.join(dir, file);
    let url = await uploadCatbox(filePath);
    if (!url) {
      url = await uploadFreeImageHost(filePath);
    }
    urls[file] = url;
  }

  console.log('\n--- PERMANENT CDN URLS ---');
  console.log(JSON.stringify(urls, null, 2));

  // Write results to JSON file
  fs.writeFileSync(
    path.join(__dirname, 'permanent_quay_chup_urls.json'),
    JSON.stringify(urls, null, 2),
    'utf8'
  );
}

main();
