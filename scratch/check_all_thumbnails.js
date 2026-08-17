const fs = require('fs');
const path = require('path');
const { getAllPosts } = require('../src/lib/posts');

const posts = getAllPosts();
console.log(`Found ${posts.length} posts:`);
posts.forEach((p, i) => {
  console.log(`${i + 1}. [${p.slug}] -> thumbnail: "${p.thumbnail}"`);
});
