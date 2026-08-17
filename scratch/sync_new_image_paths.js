const fs = require('fs');
const path = require('path');

const siteDataPath = path.join(__dirname, '../src/data/siteData.json');
const siteData = JSON.parse(fs.readFileSync(siteDataPath, 'utf8'));

const postsToSync = ['thiet-ke-poster-chuyen-nghiep-tphcm', 'thue-ngoai-thiet-ke-do-hoa-tphcm'];

for (const slug of postsToSync) {
  const mdxPath = path.join(__dirname, `../src/content/posts/${slug}.mdx`);
  if (!fs.existsSync(mdxPath)) continue;

  const mdxContent = fs.readFileSync(mdxPath, 'utf8');

  let contentVi = mdxContent;
  let contentEn = '';

  if (mdxContent.includes('<!-- EN -->')) {
    const parts = mdxContent.split('<!-- EN -->');
    contentVi = parts[0].replace(/^---\s*[\r\n]+([\s\S]*?)[\r\n]+---\s*[\r\n]+/, '').trim();
    contentEn = parts[1].trim();
  }

  const post = siteData.blogPosts.find((p) => p.slug === slug);
  if (post) {
    const ext = slug === 'thiet-ke-poster-chuyen-nghiep-tphcm' ? 'jpg' : 'png';
    post.thumbnail = `/images/posts/${slug}/thum.${ext}`;
    post.content_vi = contentVi;
    post.content_en = contentEn;
    post.content = `${contentVi}\n\n<!-- EN -->\n\n${contentEn}`;
    console.log(`Synced ${slug} to siteData.json successfully!`);
  }
}

fs.writeFileSync(siteDataPath, JSON.stringify(siteData, null, 2), 'utf8');
