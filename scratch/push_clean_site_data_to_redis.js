const fs = require('fs');
const path = require('path');

const siteDataPath = path.join(__dirname, '../src/data/siteData.json');
const siteData = JSON.parse(fs.readFileSync(siteDataPath, 'utf8'));

// Check UPSTASH environment variables
const url = process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN;

console.log('UPSTASH_URL:', url ? 'FOUND' : 'MISSING');
console.log('UPSTASH_TOKEN:', token ? 'FOUND' : 'MISSING');

// Check quay-chup-noi-that-hcm in siteData
const post = siteData.blogPosts.find((p) => p.slug === 'quay-chup-noi-that-hcm');
console.log('\n--- LOCAL SITEDATA POST FOR quay-chup-noi-that-hcm ---');
console.log('Contains vr6yot.png?:', post.content_vi.includes('vr6yot.png'));

async function pushToRedis() {
  if (!url || !token) {
    console.log('No Upstash env vars locally, script will exit.');
    return;
  }

  try {
    const cleanUrl = url.replace(/\/$/, '');
    console.log('Pushing clean siteData to Upstash Redis...');
    const res = await fetch(`${cleanUrl}/set/site_data`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(siteData),
    });
    const text = await res.text();
    console.log('Upstash Redis set/site_data response:', text);

    // Also clear old keys 'blog:posts' and 'posts' if they exist
    await fetch(`${cleanUrl}/del/blog:posts`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    await fetch(`${cleanUrl}/del/posts`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('Cleared stale Redis keys (blog:posts, posts).');
  } catch (e) {
    console.error('Error pushing to Redis:', e.message);
  }
}

pushToRedis();
