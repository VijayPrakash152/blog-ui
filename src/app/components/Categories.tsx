import React from 'react';
import Link from 'next/link';
import { CategoryDto } from '@/api/blog/categories/categories.interface';

interface CategoriesPageProps {
    categories: CategoryDto[];
}

const CategoriesPage = ({ categories }: CategoriesPageProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-10 px-4 relative">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 rounded-lg bg-black bg-opacity-60 p-4 text-center text-white">
          <p className="text-lg font-semibold">This page is currently under development 🛠️🚧</p>
        </div>
      <div className="container mx-auto max-w-7xl">
        <h1 className="text-5xl font-extrabold text-gray-800 mb-12 text-center">
          Explore Our Categories
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <div
              key={category.id}
              className="bg-white rounded-lg shadow-xl p-6 transition-transform transform hover:-translate-y-2 hover:shadow-2xl border-t-4 border-blue-600"
            >
              {/* Category Image */}
              <div className="w-full h-48 mb-6">
                <img
                  src={category.image.url}
                  alt={category.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>

              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                {category.name}
              </h2>
              <p className="text-gray-600 mb-5 text-sm leading-relaxed">
                {category.description}
              </p>
              <Link
                href={`/categories/${category.slug}`}
                className="inline-block bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Learn More
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
    </div>
  );
};

export default CategoriesPage;
