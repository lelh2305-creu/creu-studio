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
      console.log(`Uploaded SUCCESS [${path.basename(filePath)}]:`, text.trim());
      return text.trim();
    } else {
      console.error(`Upload failed [${path.basename(filePath)}]:`, text);
    }
  } catch (e) {
    console.error(`Error uploading [${path.basename(filePath)}]:`, e.message);
  }
  return null;
}

async function main() {
  const thumbFile = path.join(__dirname, '../ed796f74-d9ff-4abb-aa32-ede03399a54b.png');
  const inlineFile = path.join(__dirname, '../ChatGPT Image Aug 17, 2026, 10_27_23 PM.png');

  console.log('Uploading thumbnail (54b)...');
  const thumbUrl = await uploadCatbox(thumbFile);

  console.log('Uploading inline image...');
  const inlineUrl = await uploadCatbox(inlineFile);

  if (!thumbUrl || !inlineUrl) {
    console.error('Failed to upload one or both images!');
    process.exit(1);
  }

  console.log('\n--- UPLOADED URLS ---');
  console.log('Thumbnail (54b):', thumbUrl);
  console.log('Inline image:', inlineUrl);

  const mdxPath = path.join(__dirname, '../src/content/posts/dich-vu-content-marketing-tphcm.mdx');
  const siteDataPath = path.join(__dirname, '../src/data/siteData.json');

  let mdxContent = fs.readFileSync(mdxPath, 'utf8');

  // Update thumbnail in MDX frontmatter
  mdxContent = mdxContent.replace(
    /thumbnail:\s*["'][^"']+["']/,
    `thumbnail: "${thumbUrl}"`
  );

  // Insert inline image under "## Content Marketing Là Gì Và Tại Sao Nó Hiệu Quả?"
  const inlineMarkdown = `\n\n![Dịch vụ Content Marketing hiệu quả tại TP.HCM](${inlineUrl})\n`;
  if (!mdxContent.includes(inlineUrl)) {
    mdxContent = mdxContent.replace(
      '## Content Marketing Là Gì Và Tại Sao Nó Hiệu Quả?',
      `## Content Marketing Là Gì Và Tại Sao Nó Hiệu Quả?${inlineMarkdown}`
    );
  }

  fs.writeFileSync(mdxPath, mdxContent, 'utf8');
  console.log('Updated dich-vu-content-marketing-tphcm.mdx successfully!');

  // Split VI and EN parts
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
    const post = siteData.blogPosts.find((p) => p.slug === 'dich-vu-content-marketing-tphcm');
    if (post) {
      post.thumbnail = thumbUrl;
      post.content_vi = contentVi;
      post.content_en = contentEn;
      post.content = contentEn ? `${contentVi}\n\n<!-- EN -->\n\n${contentEn}` : contentVi;
      console.log('Synced post dich-vu-content-marketing-tphcm to siteData.json successfully!');
    } else {
      console.error('Post dich-vu-content-marketing-tphcm not found in siteData.json!');
    }
  }

  fs.writeFileSync(siteDataPath, JSON.stringify(siteData, null, 2), 'utf8');
}

main();
