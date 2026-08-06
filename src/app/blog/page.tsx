import { getAllPosts } from '@/lib/posts';
import BlogPageClient from './BlogPageClient';

export const metadata = {
  title: 'Blog & Sáng tạo | CREU Studio',
  description: 'Góc nhìn sáng tạo, xu hướng thiết kế thương hiệu, video production và bài viết chuyên sâu từ CREU Studio.',
};

export default function BlogListPage() {
  const posts = getAllPosts();
  return <BlogPageClient initialPosts={posts} />;
}
