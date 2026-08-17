const fs = require('fs');
const path = require('path');

const mdxPath = path.join(__dirname, '../src/content/posts/quay-chup-noi-that-hcm.mdx');
const siteDataPath = path.join(__dirname, '../src/data/siteData.json');

const permanentUrls = {
  thum: 'https://files.catbox.moe/wjzvzk.png',
  img01: 'https://files.catbox.moe/vr6yot.png',
  img1: 'https://files.catbox.moe/rqn3bl.png',
  img2: 'https://files.catbox.moe/x30qdh.png',
};

let mdx = fs.readFileSync(mdxPath, 'utf8');

// 1. Set frontmatter thumbnail
mdx = mdx.replace(/thumbnail:\s*["'][^"']+["']/, `thumbnail: "${permanentUrls.thum}"`);

// 2. Replace any tmpfiles or old local image links in MDX
mdx = mdx.replace(/https?:\/\/tmpfiles\.org\/[^\s"\')]+/g, permanentUrls.thum);
mdx = mdx.replace(/\/images\/posts\/quay-chup-noi-that-hcm\/thum\.png/g, permanentUrls.thum);
mdx = mdx.replace(/\/images\/posts\/quay-chup-noi-that-hcm\/img01\.png/g, permanentUrls.img01);
mdx = mdx.replace(/\/images\/posts\/quay-chup-noi-that-hcm\/img1\.png/g, permanentUrls.img1);
mdx = mdx.replace(/\/images\/posts\/quay-chup-noi-that-hcm\/img2\.png/g, permanentUrls.img2);

// Make sure content images are formatted cleanly
if (!mdx.includes(permanentUrls.img01)) {
  mdx = mdx.replace(
    '# Quay Chụp Nội Thất Tại HCM: Không Gian Đẹp Xứng Đáng Được Ghi Lại Đúng Cách',
    `# Quay Chụp Nội Thất Tại HCM: Không Gian Đẹp Xứng Đáng Được Ghi Lại Đúng Cách\n\n![Không gian nội thất được quay chụp chuyên nghiệp](${permanentUrls.img01})`
  );
}

fs.writeFileSync(mdxPath, mdx, 'utf8');
console.log('Updated quay-chup-noi-that-hcm.mdx with PERMANENT Catbox CDN links!');

// 3. Update siteData.json
const siteData = JSON.parse(fs.readFileSync(siteDataPath, 'utf8'));

if (Array.isArray(siteData.blogPosts)) {
  const post = siteData.blogPosts.find((p) => p.slug === 'quay-chup-noi-that-hcm');
  if (post) {
    post.thumbnail = permanentUrls.thum;

    let contentVi = mdx;
    let contentEn = '';
    if (mdx.includes('<!-- EN -->')) {
      const parts = mdx.split('<!-- EN -->');
      contentVi = parts[0].replace(/^---\s*[\r\n]+([\s\S]*?)[\r\n]+---\s*[\r\n]+/, '').trim();
      contentEn = parts[1].trim();
    } else {
      contentVi = mdx.replace(/^---\s*[\r\n]+([\s\S]*?)[\r\n]+---\s*[\r\n]+/, '').trim();
    }

    post.content_vi = contentVi;
    post.content_en = contentEn;
    post.content = contentEn ? `${contentVi}\n\n<!-- EN -->\n\n${contentEn}` : contentVi;
    console.log('Synced post quay-chup-noi-that-hcm to siteData.json successfully!');
  }
}

fs.writeFileSync(siteDataPath, JSON.stringify(siteData, null, 2), 'utf8');
