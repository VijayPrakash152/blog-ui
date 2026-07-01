import TopicPageClient from './TopicPageClient';
import { getBlogsBySubcategory, getSubcategoryBySlug } from '@/lib/strapi';
import type { Blog, Subcategory } from '@/types';
import { notFound } from 'next/navigation';

interface TopicPageProps {
  params: Promise<{ slug: string }>;
}

const TopicPage = async ({ params }: TopicPageProps) => {
  const { slug } = await params;
  const subcategory = await getSubcategoryBySlug(slug);

  if (!subcategory) {
    notFound();
  }

  const blogs = await getBlogsBySubcategory(slug);
  const posts = blogs.map((blog) => ({
    ...blog,
    contentHtml: blog.content ? blog.content.replace(/<[^>]+>/g, '').slice(0, 140) : '',
  })) as Array<Blog & { contentHtml: string }>;

  return <TopicPageClient subcategory={subcategory} posts={posts} />;
};

export async function generateStaticParams() {
  try {
    const { getSubcategories } = await import('@/lib/strapi');
    const subcategories = await getSubcategories();
    return subcategories.map((subcategory) => ({ slug: subcategory.slug }));
  } catch (error) {
    console.error('Error generating subcategory static params:', error);
    return [];
  }
}

export default TopicPage;
