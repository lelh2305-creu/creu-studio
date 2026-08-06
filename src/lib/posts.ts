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
  content_vi: string;
  content_en?: string;
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
          
          let contentVi = content.trim();
          let contentEn = (data.content_en || data.contentEn || '').trim();

          if (content.includes('<!-- EN -->')) {
            const parts = content.split('<!-- EN -->');
            contentVi = parts[0].trim();
            contentEn = parts[1].trim();
          } else if (content.includes('<!-- ENGLISH -->')) {
            const parts = content.split('<!-- ENGLISH -->');
            contentVi = parts[0].trim();
            contentEn = parts[1].trim();
          }

          postsMap.set(slug, {
            slug,
            title: data.title || 'Untitled Post',
            titleEn: data.title_en || data.titleEn || '',
            date: data.date || '',
            description: data.description || '',
            descriptionEn: data.description_en || data.descriptionEn || '',
            thumbnail: data.thumbnail || '/creu-logo.png',
            category: data.category || 'General',
            author: data.author || 'CREU Studio',
            content: contentVi,
            content_vi: contentVi,
            content_en: contentEn,
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
            const contentVi = (post.content_vi || post.content || '').trim();
            const contentEn = (post.content_en || post.contentEn || '').trim();

            postsMap.set(post.slug, {
              slug: post.slug,
              title: post.title || 'Untitled Post',
              titleEn: post.title_en || post.titleEn || '',
              date: post.date || new Date().toISOString().split('T')[0],
              description: post.description || '',
              descriptionEn: post.description_en || post.descriptionEn || '',
              thumbnail: post.thumbnail || '/creu-logo.png',
              category: post.category || 'GENERAL',
              author: post.author || 'CREU Studio',
              content: contentVi,
              content_vi: contentVi,
              content_en: contentEn,
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
