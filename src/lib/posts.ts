import fs from 'fs';
import path from 'path';

export interface Post {
  slug: string;
  title: string;
  titleEn?: string;
  date: string;
  description: string;
  descriptionEn?: string;
  thumbnail: string;
  category: string;
  author?: string;
  content: string;
  contentEn?: string;
}

const postsDirectory = path.join(process.cwd(), 'src/content/posts');
const siteDataPath = path.join(process.cwd(), 'src/data/siteData.json');

function parseFrontmatter(fileContent: string): { data: Record<string, string>; content: string } {
  const frontmatterRegex = /^---\s*[\r\n]+([\s\S]*?)[\r\n]+---\s*[\r\n]+([\s\S]*)$/;
  const match = fileContent.match(frontmatterRegex);

  if (!match) {
    return { data: {}, content: fileContent };
  }

  const frontmatterBlock = match[1];
  const content = match[2];
  const data: Record<string, string> = {};

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

  return { data, content };
}

export function getAllPosts(): Post[] {
  const postsMap = new Map<string, Post>();

  // 1. Read static MDX files
  if (fs.existsSync(postsDirectory)) {
    const filenames = fs.readdirSync(postsDirectory);
    filenames
      .filter((file) => file.endsWith('.mdx') || file.endsWith('.md'))
      .forEach((file) => {
        try {
          const filePath = path.join(postsDirectory, file);
          const fileContent = fs.readFileSync(filePath, 'utf8');
          const { data, content } = parseFrontmatter(fileContent);

          const slug = data.slug || file.replace(/\.mdx?$/, '');

          postsMap.set(slug, {
            slug,
            title: data.title || 'Untitled Post',
            titleEn: data.titleEn || data.title_en || '',
            date: data.date || '',
            description: data.description || '',
            descriptionEn: data.descriptionEn || data.description_en || '',
            thumbnail: data.thumbnail || '/creu-logo.png',
            category: data.category || 'General',
            author: data.author || 'CREU Studio',
            content: content,
            contentEn: data.contentEn || data.content_en || '',
          });
        } catch {}
      });
  }

  // 2. Read dynamic siteData.json blog posts if present
  if (fs.existsSync(siteDataPath)) {
    try {
      const raw = fs.readFileSync(siteDataPath, 'utf8');
      const siteData = JSON.parse(raw);
      if (Array.isArray(siteData.blogPosts)) {
        siteData.blogPosts.forEach((post: any) => {
          if (post && post.slug) {
            postsMap.set(post.slug, {
              slug: post.slug,
              title: post.title || 'Untitled Post',
              titleEn: post.titleEn || post.title_en || '',
              date: post.date || new Date().toISOString().split('T')[0],
              description: post.description || '',
              descriptionEn: post.descriptionEn || post.description_en || '',
              thumbnail: post.thumbnail || '/creu-logo.png',
              category: post.category || 'GENERAL',
              author: post.author || 'CREU Studio',
              content: post.content || post.content_vi || '',
              contentEn: post.contentEn || post.content_en || '',
            });
          }
        });
      }
    } catch {}
  }

  const postsList = Array.from(postsMap.values());
  return postsList.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPostBySlug(slug: string): Post | null {
  const posts = getAllPosts();
  return posts.find((p) => p.slug === slug) || null;
}
