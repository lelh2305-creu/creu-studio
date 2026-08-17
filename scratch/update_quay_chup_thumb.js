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
  const thumb47pm = path.join(__dirname, '../ChatGPT Image Aug 17, 2026, 10_40_47 PM.png');
  const extraImg = path.join(__dirname, '../d72b1d9b-e053-4520-a149-8f06a28d87c7.png');

  console.log('Uploading 47pm image for thumbnail...');
  const thumbUrl = await uploadCatbox(thumb47pm);

  let extraUrl = null;
  if (fs.existsSync(extraImg)) {
    console.log('Uploading extra image...');
    extraUrl = await uploadCatbox(extraImg);
  }

  if (!thumbUrl) {
    console.error('Failed to upload thumbnail!');
    process.exit(1);
  }

  console.log('\n--- UPLOADED CDN URLS ---');
  console.log('Thumbnail (47pm):', thumbUrl);
  if (extraUrl) console.log('Extra image:', extraUrl);

  const mdxPath = path.join(__dirname, '../src/content/posts/quay-chup-noi-that-hcm.mdx');
  const siteDataPath = path.join(__dirname, '../src/data/siteData.json');

  let mdxContent = fs.readFileSync(mdxPath, 'utf8');

  // Update thumbnail in MDX frontmatter
  mdxContent = mdxContent.replace(
    /thumbnail:\s*["'][^"']+["']/,
    `thumbnail: "${thumbUrl}"`
  );

  // If extraUrl exists, insert or replace line 21 local image
  if (extraUrl) {
    if (mdxContent.includes('/images/posts/quay-chup-noi-that-hcm/img01.png')) {
      mdxContent = mdxContent.replace(
        '/images/posts/quay-chup-noi-that-hcm/img01.png',
        extraUrl
      );
    } else if (!mdxContent.includes(extraUrl)) {
      mdxContent = mdxContent.replace(
        '## Các Dạng Dự Án Quay Chụp Nội Thất Tại CREU',
        `![Dự án quay chụp nội thất CREU](${extraUrl})\n\n## Các Dạng Dự Án Quay Chụp Nội Thất Tại CREU`
      );
    }
  }

  fs.writeFileSync(mdxPath, mdxContent, 'utf8');
  console.log('Updated quay-chup-noi-that-hcm.mdx with new thumbnail and image CDN URLs');

  // Split VI & EN parts
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
    } else {
      console.error('Post quay-chup-noi-that-hcm not found in siteData.json!');
    }
  }

  fs.writeFileSync(siteDataPath, JSON.stringify(siteData, null, 2), 'utf8');
}

main();
