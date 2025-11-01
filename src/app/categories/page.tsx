import CategoriesPage from '../components/Categories';

const Categories = async () => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/categories?populate[image][fields][0]=url`,
    {
      next: { revalidate: 86400 },
    }
  );
  const data = await response.json();
  const categories = data.data;
  return <CategoriesPage categories={categories} />;
};

export default Categories;
