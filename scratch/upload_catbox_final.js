const fs = require('fs');
const path = require('path');
const https = require('https');
const FormData = require('form-data');

async function uploadToCatbox(filePath) {
  return new Promise((resolve, reject) => {
    const fileStream = fs.createReadStream(filePath);
    const form = new FormData();
    form.append('fileToUpload', fileStream);

    const options = {
      hostname: 'catbox.moe',
      port: 443,
      path: '/user/api.php',
      method: 'POST',
      headers: form.getHeaders(),
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        const url = data.trim();
        if (url.startsWith('http')) {
          resolve(url);
        } else {
          reject(new Error(`Invalid response: ${data}`));
        }
      });
    });

    req.on('error', (e) => {
      reject(e);
    });

    form.pipe(req);
  });
}

async function main() {
  try {
    const file48 = path.join(__dirname, '../ChatGPT Image Aug 17, 2026, 09_41_48 PM.png');
    const file58 = path.join(__dirname, '../ChatGPT Image Aug 17, 2026, 09_41_58 PM.png');

    console.log('Uploading to Catbox...');

    const url48 = await uploadToCatbox(file48);
    console.log(`✓ Hình 48: ${url48}`);

    const url58 = await uploadToCatbox(file58);
    console.log(`✓ Hình 58: ${url58}`);

    // Save URLs to temp file for next script
    fs.writeFileSync(path.join(__dirname, 'catbox_urls.json'), JSON.stringify({
      url48,
      url58,
    }, null, 2));

    console.log('\n✓ Upload complete! URLs saved.');
  } catch (e) {
    console.error('Upload error:', e.message);
    process.exit(1);
  }
}

main();
