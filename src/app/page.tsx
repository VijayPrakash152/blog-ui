import HomeComponent from './components/HomeComponent';

const Home = async () => {
  const response = await fetch('http://localhost:1337/api/blogs?pagination[page]=1&pagination[pageSize]=6&populate[thumbnail][fields][0]=url&populate[category]=true', {
    "cache": "no-store"
  });
  const posts = await response.json();
  return (
    <HomeComponent data={posts?.data} />
  );
};

export default Home;


