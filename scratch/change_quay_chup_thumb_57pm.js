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
      const url = json.data.url.replace('tmpfiles.org/', 'tmpfiles.org/dl/');
      console.log(`Tmpfiles success [${path.basename(filePath)}]:`, url);
      return url;
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
      console.log(`Catbox success [${path.basename(filePath)}]:`, text.trim());
      return text.trim();
    }
  } catch (e) {
    console.error('Catbox error:', e.message);
  }
  return null;
}

async function main() {
  const file57pm = path.join(__dirname, '../ChatGPT Image Aug 17, 2026, 10_57_49 PM.png');
  if (!fs.existsSync(file57pm)) {
    console.error('File 57pm does not exist!');
    process.exit(1);
  }

  console.log('Uploading 57pm image for thumbnail...');
  let thumbUrl = await uploadTmpfiles(file57pm);
  if (!thumbUrl) {
    thumbUrl = await uploadCatbox(file57pm);
  }

  if (!thumbUrl) {
    console.error('Upload failed!');
    process.exit(1);
  }

  console.log('\n--- NEW THUMBNAIL CDN URL (57pm) ---');
  console.log(thumbUrl);

  const mdxPath = path.join(__dirname, '../src/content/posts/quay-chup-noi-that-hcm.mdx');
  const siteDataPath = path.join(__dirname, '../src/data/siteData.json');

  let mdxContent = fs.readFileSync(mdxPath, 'utf8');

  // Update thumbnail in MDX frontmatter
  mdxContent = mdxContent.replace(
    /thumbnail:\s*["'][^"']+["']/,
    `thumbnail: "${thumbUrl}"`
  );

  fs.writeFileSync(mdxPath, mdxContent, 'utf8');
  console.log('Updated quay-chup-noi-that-hcm.mdx thumbnail successfully!');

  // Split VI & EN
  let contentVi = mdxContent;
  let contentEn = '';

  if (mdxContent.includes('<!-- EN -->')) {
    const parts = mdxContent.split('<!-- EN -->');
    contentVi = parts[0].replace(/^---\s*[\r\n]+([\s\S]*?)[\r\n]+---\s*[\r\n]+/, '').trim();
    contentEn = parts[1].trim();
  } else {
    contentVi = mdxContent.replace(/^---\s*[\r\n]+([\s\S]*?)[\r\n]+---\s*[\r\n]+/, '').trim();
  }

  // Update siteData.json
  const siteData = JSON.parse(fs.readFileSync(siteDataPath, 'utf8'));

  if (Array.isArray(siteData.blogPosts)) {
    const post = siteData.blogPosts.find((p) => p.slug === 'quay-chup-noi-that-hcm');
    if (post) {
      post.thumbnail = thumbUrl;
      post.content_vi = contentVi;
      post.content_en = contentEn;
      post.content = contentEn ? `${contentVi}\n\n<!-- EN -->\n\n${contentEn}` : contentVi;
      console.log('Synced post quay-chup-noi-that-hcm to siteData.json successfully!');
    }
  }

  fs.writeFileSync(siteDataPath, JSON.stringify(siteData, null, 2), 'utf8');
}

main();
