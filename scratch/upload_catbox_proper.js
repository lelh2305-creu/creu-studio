const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');

// Minimal FormData for Node.js (using native APIs)
class FormDataLike {
  constructor() {
    this.fields = [];
  }

  append(name, value, filename) {
    this.fields.push({ name, value, filename });
  }

  async getBuffer() {
    const boundary = '----' + Math.random().toString(36).substr(2);
    let body = '';

    for (const field of this.fields) {
      body += `--${boundary}\r\nContent-Disposition: form-data; name="${field.name}"`;
      if (field.filename) {
        body += `; filename="${field.filename}"`;
      }
      body += '\r\n\r\n';
    }

    const buffers = [];
    const textEncoder = new TextEncoder();

    // Build multipart manually
    for (let i = 0; i < this.fields.length; i++) {
      const field = this.fields[i];
      buffers.push(Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="${field.name}"`));
      if (field.filename) {
        buffers.push(Buffer.from(`; filename="${field.filename}"`));
      }
      buffers.push(Buffer.from('\r\n\r\n'));

      if (field.value instanceof fs.ReadStream || Buffer.isBuffer(field.value)) {
        buffers.push(field.value);
      } else if (typeof field.value === 'string') {
        buffers.push(Buffer.from(field.value));
      }
      buffers.push(Buffer.from('\r\n'));
    }

    buffers.push(Buffer.from(`--${boundary}--\r\n`));

    return { buffer: Buffer.concat(buffers), boundary };
  }
}

async function uploadToCatbox(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, fileData) => {
      if (err) {
        reject(err);
        return;
      }

      const boundary = '----' + Math.random().toString(36).substr(2);
      const fileContent = Buffer.from(fileData);
      const filename = path.basename(filePath);

      // Build multipart body
      let body = Buffer.alloc(0);
      body = Buffer.concat([
        body,
        Buffer.from(`--${boundary}\r\n`),
        Buffer.from(`Content-Disposition: form-data; name="fileToUpload"; filename="${filename}"\r\n`),
        Buffer.from('Content-Type: image/png\r\n\r\n'),
        fileContent,
        Buffer.from(`\r\n--${boundary}--\r\n`),
      ]);

      const options = {
        hostname: 'catbox.moe',
        port: 443,
        path: '/user/api.php',
        method: 'POST',
        headers: {
          'Content-Type': `multipart/form-data; boundary=${boundary}`,
          'Content-Length': body.length,
        },
      };

      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          const url = data.trim();
          if (url.startsWith('https://')) {
            resolve(url);
          } else {
            reject(new Error(`Invalid response: ${data}`));
          }
        });
      });

      req.on('error', reject);
      req.write(body);
      req.end();
    });
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

    fs.writeFileSync(path.join(__dirname, 'catbox_urls.json'), JSON.stringify({ url48, url58 }, null, 2));
    console.log('\n✓ URLs saved to catbox_urls.json');
  } catch (e) {
    console.error('Error:', e.message);
    process.exit(1);
  }
}

main();
