const fs = require('fs');
const path = require('path');

const quayChupMdxPath = path.join(__dirname, '../src/content/posts/quay-chup-noi-that-hcm.mdx');
const posterMdxPath = path.join(__dirname, '../src/content/posts/thiet-ke-poster-chuyen-nghiep-tphcm.mdx');
const siteDataPath = path.join(__dirname, '../src/data/siteData.json');

// CDN mapping for quay-chup-noi-that-hcm
const quayChupUrls = {
  thum: 'https://files.catbox.moe/cvwj50.png',
  img1: 'https://files.catbox.moe/rqn3bl.png',
  img2: 'https://files.catbox.moe/x30qdh.png',
};

// CDN mapping for thiet-ke-poster-chuyen-nghiep-tphcm
const posterUrls = {
  thum: 'https://files.catbox.moe/iygny7.png',
  img1: 'https://files.catbox.moe/pnugt8.png',
  img2: 'https://files.catbox.moe/anuvsf.png',
};

// 1. Update quay-chup-noi-that-hcm.mdx
let qcMdx = fs.readFileSync(quayChupMdxPath, 'utf8');
qcMdx = qcMdx.replace(/thumbnail:\s*["'][^"']+["']/, `thumbnail: "${quayChupUrls.thum}"`);
qcMdx = qcMdx.replace(/\/images\/posts\/quay-chup-noi-that-hcm\/thum\.png/g, quayChupUrls.thum);
qcMdx = qcMdx.replace(/\/images\/posts\/quay-chup-noi-that-hcm\/img1\.png/g, quayChupUrls.img1);
qcMdx = qcMdx.replace(/\/images\/posts\/quay-chup-noi-that-hcm\/img2\.png/g, quayChupUrls.img2);
fs.writeFileSync(quayChupMdxPath, qcMdx, 'utf8');
console.log('Updated quay-chup-noi-that-hcm.mdx with CDN URLs');

// 2. Update thiet-ke-poster-chuyen-nghiep-tphcm.mdx
let posterMdx = fs.readFileSync(posterMdxPath, 'utf8');
posterMdx = posterMdx.replace(/thumbnail:\s*["'][^"']+["']/, `thumbnail: "${posterUrls.thum}"`);
posterMdx = posterMdx.replace(/\/images\/posts\/thiet-ke-poster-chuyen-nghiep-tphcm\/thum\.png/g, posterUrls.thum);
posterMdx = posterMdx.replace(/\/images\/posts\/thiet-ke-poster-chuyen-nghiep-tphcm\/img-01\.png/g, posterUrls.img1);
posterMdx = posterMdx.replace(/\/images\/posts\/thiet-ke-poster-chuyen-nghiep-tphcm\/img-02\.png/g, posterUrls.img2);
fs.writeFileSync(posterMdxPath, posterMdx, 'utf8');
console.log('Updated thiet-ke-poster-chuyen-nghiep-tphcm.mdx with CDN URLs');

// 3. Update siteData.json
const siteData = JSON.parse(fs.readFileSync(siteDataPath, 'utf8'));

if (Array.isArray(siteData.blogPosts)) {
  // Update quay-chup-noi-that-hcm
  const p1 = siteData.blogPosts.find((p) => p.slug === 'quay-chup-noi-that-hcm');
  if (p1) {
    p1.thumbnail = quayChupUrls.thum;
    let vi = qcMdx;
    let en = '';
    if (qcMdx.includes('<!-- EN -->')) {
      const parts = qcMdx.split('<!-- EN -->');
      vi = parts[0].replace(/^---\s*[\r\n]+([\s\S]*?)[\r\n]+---\s*[\r\n]+/, '').trim();
      en = parts[1].trim();
    } else {
      vi = qcMdx.replace(/^---\s*[\r\n]+([\s\S]*?)[\r\n]+---\s*[\r\n]+/, '').trim();
    }
    p1.content_vi = vi;
    p1.content_en = en;
    p1.content = en ? `${vi}\n\n<!-- EN -->\n\n${en}` : vi;
  }

  // Update thiet-ke-poster-chuyen-nghiep-tphcm
  const p2 = siteData.blogPosts.find((p) => p.slug === 'thiet-ke-poster-chuyen-nghiep-tphcm');
  if (p2) {
    p2.thumbnail = posterUrls.thum;
    let vi = posterMdx;
    let en = '';
    if (posterMdx.includes('<!-- EN -->')) {
      const parts = posterMdx.split('<!-- EN -->');
      vi = parts[0].replace(/^---\s*[\r\n]+([\s\S]*?)[\r\n]+---\s*[\r\n]+/, '').trim();
      en = parts[1].trim();
    } else {
      vi = posterMdx.replace(/^---\s*[\r\n]+([\s\S]*?)[\r\n]+---\s*[\r\n]+/, '').trim();
    }
    p2.content_vi = vi;
    p2.content_en = en;
    p2.content = en ? `${vi}\n\n<!-- EN -->\n\n${en}` : vi;
  }
}

fs.writeFileSync(siteDataPath, JSON.stringify(siteData, null, 2), 'utf8');
console.log('Updated siteData.json with CDN URLs');
