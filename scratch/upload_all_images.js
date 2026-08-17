const fs = require('fs');
const path = require('path');

async function uploadTmpfiles(filePath) {
  try {
    const buffer = fs.readFileSync(filePath);
    const blob = new Blob([buffer]);
    const formData = new FormData();
    formData.append('file', blob, path.basename(filePath));

    const res = await fetch('https://tmpfiles.org/api/v1/upload', {
      method: 'POST',
      body: formData,
    });
    const json = await res.json();
    if (json.status === 'success' && json.data && json.data.url) {
      // Convert https://tmpfiles.org/12345/image.png to https://tmpfiles.org/dl/12345/image.png for direct link
      const directUrl = json.data.url.replace('tmpfiles.org/', 'tmpfiles.org/dl/');
      console.log(`Tmpfiles upload [${path.basename(filePath)}]:`, directUrl);
      return directUrl;
    }
  } catch (e) {
    console.error('Tmpfiles error:', e.message);
  }
  return null;
}

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
  const dir = path.join(__dirname, '../public/images/posts/quay-chup-noi-that-hcm');
  const files = ['thum.png', 'img1.png', 'img2.png'];

  const urls = {};
  for (const f of files) {
    const p = path.join(dir, f);
    if (fs.existsSync(p)) {
      console.log(`Uploading ${f}...`);
      let url = await uploadCatbox(p);
      if (!url) {
        url = await uploadTmpfiles(p);
      }
      urls[f] = url;
    }
  }
  console.log('\n--- UPLOADED CDN URLS ---');
  console.log(JSON.stringify(urls, null, 2));
}

main();
