const fs = require('fs');
const path = require('path');

const mdxPath = path.join(__dirname, '../src/content/posts/outsource-marketing-cho-startup-tphcm.mdx');
const siteDataPath = path.join(__dirname, '../src/data/siteData.json');

const cdnUrl = 'https://files.catbox.moe/vr6yot.png';

let mdxContent = fs.readFileSync(mdxPath, 'utf8');

const imgMarkdown = `\n\n![Outsource Marketing Cho Startup Tại TP.HCM](${cdnUrl})\n`;

if (!mdxContent.includes(cdnUrl)) {
  mdxContent = mdxContent.replace(
    '## Tại Sao Outsource Marketing Ngay Từ Đầu?',
    `## Tại Sao Outsource Marketing Ngay Từ Đầu?${imgMarkdown}`
  );
  fs.writeFileSync(mdxPath, mdxContent, 'utf8');
  console.log('Inserted CDN image into MDX file successfully!');
} else {
  console.log('CDN image already in MDX file');
}

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
  const post = siteData.blogPosts.find((p) => p.slug === 'outsource-marketing-cho-startup-tphcm');
  if (post) {
    post.content_vi = contentVi;
    post.content_en = contentEn;
    post.content = contentEn ? `${contentVi}\n\n<!-- EN -->\n\n${contentEn}` : contentVi;
    console.log('Synced updated content to siteData.json successfully!');
  } else {
    console.error('Post not found in siteData.json!');
  }
}

fs.writeFileSync(siteDataPath, JSON.stringify(siteData, null, 2), 'utf8');
