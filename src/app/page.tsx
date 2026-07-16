import PortfolioHome from './components/portfolio/PortfolioHome';
import { fetchBlogPosts } from '@/lib/blog-data';

const Home = async () => {
  try {
    const posts = await fetchBlogPosts({ pageSize: 6 });
    return <PortfolioHome posts={posts} />;
  } catch {
    return (
      <div className="min-h-screen bg-[#05070B] px-6 py-20 text-white sm:px-10 lg:px-16">
        <div className="mx-auto max-w-4xl rounded-[2rem] border border-white/10 bg-[#0B1220] p-10 text-center shadow-lg shadow-black/20">
          <p className="text-sm uppercase tracking-[0.3em] text-[#7C61FF]">Portfolio</p>
          <h1 className="mt-6 text-3xl font-semibold leading-tight text-white sm:text-4xl">
            Unable to load the portfolio experience at the moment.
          </h1>
          <p className="mt-4 text-sm leading-7 text-slate-400">
            Please try again later or verify that the API backend is available.
          </p>
        </div>
      </div>
    );
  }
};

export default Home;
