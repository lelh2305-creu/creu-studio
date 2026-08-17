const fs = require('fs');
const path = require('path');

const mdxPath = path.join(__dirname, '../src/content/posts/quay-chup-noi-that-hcm.mdx');
const siteDataPath = path.join(__dirname, '../src/data/siteData.json');

let mdxContent = fs.readFileSync(mdxPath, 'utf8');

// 1. Update thumbnail in MDX frontmatter
mdxContent = mdxContent.replace(
  /thumbnail:\s*["'][^"']+["']/,
  'thumbnail: "/images/posts/quay-chup-noi-that-hcm/thum.png"'
);

// 2. Insert image 1 if not present
const img1Tag = '\n\n![Quay chụp nội thất chuyên nghiệp tại HCM](/images/posts/quay-chup-noi-that-hcm/img1.png)\n';
if (!mdxContent.includes('quay-chup-noi-that-hcm/img1.png')) {
  mdxContent = mdxContent.replace(
    '## Quay Chụp Nội Thất Khác Gì Chụp Ảnh Thông Thường?',
    `## Quay Chụp Nội Thất Khác Gì Chụp Ảnh Thông Thường?${img1Tag}`
  );
}

// 3. Insert image 2 if not present
const img2Tag = '\n\n![Quy trình quay chụp nội thất tại CREU Studio](/images/posts/quay-chup-noi-that-hcm/img2.png)\n';
if (!mdxContent.includes('quay-chup-noi-that-hcm/img2.png')) {
  mdxContent = mdxContent.replace(
    '## Quy Trình Quay Chụp Nội Thất Tại CREU Studio',
    `## Quy Trình Quay Chụp Nội Thất Tại CREU Studio${img2Tag}`
  );
}

// Save updated MDX
fs.writeFileSync(mdxPath, mdxContent, 'utf8');
console.log('Updated quay-chup-noi-that-hcm.mdx successfully!');

// Split VI & EN content
let contentVi = mdxContent;
let contentEn = '';

if (mdxContent.includes('<!-- EN -->')) {
  const parts = mdxContent.split('<!-- EN -->');
  contentVi = parts[0].replace(/^---\s*[\r\n]+([\s\S]*?)[\r\n]+---\s*[\r\n]+/, '').trim();
  contentEn = parts[1].trim();
} else {
  contentVi = mdxContent.replace(/^---\s*[\r\n]+([\s\S]*?)[\r\n]+---\s*[\r\n]+/, '').trim();
}

// 4. Update siteData.json
const siteData = JSON.parse(fs.readFileSync(siteDataPath, 'utf8'));

if (Array.isArray(siteData.blogPosts)) {
  const post = siteData.blogPosts.find((p) => p.slug === 'quay-chup-noi-that-hcm');
  if (post) {
    post.thumbnail = '/images/posts/quay-chup-noi-that-hcm/thum.png';
    post.content_vi = contentVi;
    post.content_en = contentEn;
    post.content = `${contentVi}\n\n<!-- EN -->\n\n${contentEn}`;
    console.log('Synced post quay-chup-noi-that-hcm to siteData.json successfully!');
  } else {
    console.error('Post quay-chup-noi-that-hcm not found in siteData.json!');
  }
}

fs.writeFileSync(siteDataPath, JSON.stringify(siteData, null, 2), 'utf8');
