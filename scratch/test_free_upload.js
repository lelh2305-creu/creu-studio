const fs = require('fs');
const path = require('path');

async function testUploadCatbox(filePath) {
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
    console.log(`Catbox upload [${path.basename(filePath)}]:`, text);
    return text.startsWith('http') ? text.trim() : null;
  } catch (e) {
    console.error('Catbox error:', e.message);
    return null;
  }
}

async function testUploadImgBB(filePath) {
  try {
    const buffer = fs.readFileSync(filePath);
    const base64 = buffer.toString('base64');
    const formData = new URLSearchParams();
    formData.append('key', '6d207e02198a847aa98d0a2a901485a5'); // Free public key or API
    formData.append('image', base64);

    const res = await fetch('https://api.imgbb.com/1/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData.toString(),
    });
    const json = await res.json();
    if (json.data && json.data.url) {
      console.log(`ImgBB upload [${path.basename(filePath)}]:`, json.data.url);
      return json.data.url;
    } else {
      console.log('ImgBB res:', json);
    }
  } catch (e) {
    console.error('ImgBB error:', e.message);
  }
  return null;
}

async function main() {
  const dir = path.join(__dirname, '../public/images/posts/quay-chup-noi-that-hcm');
  const files = ['thum.png', 'img1.png', 'img2.png'];

  for (const f of files) {
    const p = path.join(dir, f);
    if (fs.existsSync(p)) {
      console.log(`Uploading ${f}...`);
      let url = await testUploadImgBB(p);
      if (!url) {
        url = await testUploadCatbox(p);
      }
      console.log(`Final URL for ${f}: ${url}`);
    }
  }
}

main();
