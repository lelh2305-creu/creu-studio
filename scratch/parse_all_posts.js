const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '../src/content/posts');
const files = fs.readdirSync(dir).filter((f) => f.endsWith('.mdx'));

const mdxThumbnails = {};
files.forEach((f) => {
  const content = fs.readFileSync(path.join(dir, f), 'utf8');
  const match = content.match(/thumbnail:\s*["']?([^"'\r\n]+)["']?/);
  const slug = f.replace(/\.mdx$/, '');
  mdxThumbnails[slug] = match ? match[1] : null;
});

console.log('MDX THUMBNAILS:');
console.log(JSON.stringify(mdxThumbnails, null, 2));

const siteDataPath = path.join(__dirname, '../src/data/siteData.json');
const siteData = JSON.parse(fs.readFileSync(siteDataPath, 'utf8'));
const jsonThumbnails = {};
if (Array.isArray(siteData.blogPosts)) {
  siteData.blogPosts.forEach((p) => {
    jsonThumbnails[p.slug] = p.thumbnail;
  });
}
console.log('\nSITEDATA THUMBNAILS:');
console.log(JSON.stringify(jsonThumbnails, null, 2));
