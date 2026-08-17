const fs = require('fs');
const path = require('path');

const mdxPath = path.join(__dirname, '../src/content/posts/thue-ngoai-thiet-ke-do-hoa-tphcm.mdx');
const siteDataPath = path.join(__dirname, '../src/data/siteData.json');

const mdxContent = fs.readFileSync(mdxPath, 'utf8');

// Split VI and EN parts
let contentVi = mdxContent;
let contentEn = '';

if (mdxContent.includes('<!-- EN -->')) {
  const parts = mdxContent.split('<!-- EN -->');
  // Remove frontmatter from VI part
  contentVi = parts[0].replace(/^---\s*[\r\n]+([\s\S]*?)[\r\n]+---\s*[\r\n]+/, '').trim();
  contentEn = parts[1].trim();
}

const siteData = JSON.parse(fs.readFileSync(siteDataPath, 'utf8'));

if (Array.isArray(siteData.blogPosts)) {
  const post = siteData.blogPosts.find((p) => p.slug === 'thue-ngoai-thiet-ke-do-hoa-tphcm');
  if (post) {
    post.thumbnail = '/blog/thue-ngoai-thiet-ke-do-hoa-tphcm/thum.png';
    post.content_vi = contentVi;
    post.content_en = contentEn;
    post.content = `${contentVi}\n\n<!-- EN -->\n\n${contentEn}`;
    console.log('Synced MDX content to siteData.json successfully!');
  }
}

fs.writeFileSync(siteDataPath, JSON.stringify(siteData, null, 2), 'utf8');
