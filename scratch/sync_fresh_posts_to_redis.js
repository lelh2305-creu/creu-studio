const fs = require('fs');
const path = require('path');

// 1. Read siteData.json
const siteDataPath = path.join(__dirname, '../src/data/siteData.json');
const siteData = JSON.parse(fs.readFileSync(siteDataPath, 'utf8'));

// 2. Read all MDX posts
const mdxDir = path.join(__dirname, '../src/content/posts');
const mdxFiles = fs.readdirSync(mdxDir).filter((f) => f.endsWith('.mdx'));

const mdxPosts = [];
mdxFiles.forEach((file, idx) => {
  const fileContent = fs.readFileSync(path.join(mdxDir, file), 'utf8');
  
  const frontmatterRegex = /^---\s*[\r\n]+([\s\S]*?)[\r\n]+---\s*[\r\n]+([\s\S]*)$/;
  const match = fileContent.match(frontmatterRegex);
  if (!match) return;

  const frontmatterBlock = match[1];
  const content = match[2];
  const data = {};

  frontmatterBlock.split('\n').forEach((line) => {
    const colonIndex = line.indexOf(':');
    if (colonIndex !== -1) {
      const key = line.slice(0, colonIndex).trim();
      let value = line.slice(colonIndex + 1).trim();
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      data[key] = value;
    }
  });

  const slug = data.slug || file.replace(/\.mdx$/, '');
  let contentVi = content.trim();
  let contentEn = '';

  if (content.includes('<!-- EN -->')) {
    const parts = content.split('<!-- EN -->');
    contentVi = parts[0].trim();
    contentEn = parts[1].trim();
  }

  mdxPosts.push({
    id: 1000 + idx,
    slug,
    title: data.title || 'Untitled Post',
    titleEn: data.title_en || data.titleEn || '',
    date: data.date || '2026-08-09',
    description: data.description || '',
    descriptionEn: data.description_en || data.descriptionEn || '',
    thumbnail: data.thumbnail || '/creu-logo.png',
    category: data.category || 'GENERAL',
    author: data.author || 'CREU Studio',
    content_vi: contentVi,
    content_en: contentEn,
    content: contentEn ? `${contentVi}\n\n<!-- EN -->\n\n${contentEn}` : contentVi,
  });
});

// Update siteData.blogPosts to have clean mdxPosts
siteData.blogPosts = mdxPosts;
fs.writeFileSync(siteDataPath, JSON.stringify(siteData, null, 2), 'utf8');
console.log(`Updated siteData.json with all ${mdxPosts.length} clean MDX posts!`);
