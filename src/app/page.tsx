import { Daum } from '@/api/blog/blog.interface';
import HomeComponent from './components/HomeComponent';
import {remark} from 'remark';
import html from 'remark-html';

const preprocessMarkdown = async (markdown: string) => {
  const processed = await remark().use(html).process(markdown);
  return processed.toString();
};

const Home = async () => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/blogs?pagination[page]=1&pagination[pageSize]=6&populate[thumbnail][fields][0]=url&populate[category]=true`,
    {
      next: { revalidate: 86400 },
    }
  );
  const posts = await response.json();

  // Preprocess markdown content for all posts
  const processedPosts = await Promise.all(
    posts?.data.map(async (blog: Daum) => ({
      ...blog,
      contentHtml: await preprocessMarkdown(blog.content.substring(0, 100) + " ... ")
    }))
  );

  return <HomeComponent data={processedPosts} />;
};

export default Home;
