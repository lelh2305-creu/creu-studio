const fs = require('fs');
const path = require('path');

const siteDataPath = path.join(__dirname, '../src/data/siteData.json');
const siteData = JSON.parse(fs.readFileSync(siteDataPath, 'utf8'));

if (Array.isArray(siteData.blogPosts)) {
  const post = siteData.blogPosts.find((p) => p.slug === 'thue-ngoai-thiet-ke-do-hoa-tphcm');
  if (post) {
    post.thumbnail = '/blog/thue-ngoai-thiet-ke-do-hoa-tphcm/thum.png';
    console.log('Updated post 21 thumbnail in siteData.json!');
  }
}

fs.writeFileSync(siteDataPath, JSON.stringify(siteData, null, 2), 'utf8');
