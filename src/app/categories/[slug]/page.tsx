import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getCategoryBySlug, getSubcategoriesByCategory, resolveStrapiMediaUrl } from '@/lib/strapi';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

const CategoryPage = async ({ params }: CategoryPageProps) => {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const subcategories = await getSubcategoriesByCategory(slug);

  return (
    <section className="bg-[#05070B] px-6 py-16 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 rounded-[2rem] border border-white/10 bg-slate-950/80 p-8 sm:p-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#7C61FF]">
                Category
              </p>
              <h1 className="mt-3 text-4xl font-semibold text-white sm:text-5xl">
                {category.name}
              </h1>
              <p className="mt-5 text-sm leading-7 text-slate-300">
                {category.description || 'Discover the subtopics available in this category.'}
              </p>
            </div>
            <div className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-slate-900/80">
              {category.image?.url ? (
                <Image
                  src={resolveStrapiMediaUrl(category.image.url) || '/'}
                  alt={category.image.alternativeText || category.name}
                  width={1200}
                  height={675}
                  unoptimized
                  className="h-48 w-full max-w-md object-cover"
                />
              ) : (
                <div className="flex h-48 w-full max-w-md items-center justify-center bg-gradient-to-br from-[#7C61FF] to-slate-700 text-5xl font-semibold text-white">
                  {category.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          </div>
        </div>

        {subcategories.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {subcategories.map((subcategory) => (
              <Card key={subcategory.id} className="group p-8" hoverable>
                <div className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-slate-900/80">
                  {subcategory.image?.url ? (
                    <Image
                      src={resolveStrapiMediaUrl(subcategory.image.url) || '/'}
                      alt={subcategory.image.alternativeText || subcategory.name}
                      width={1200}
                      height={675}
                      unoptimized
                      className="h-40 w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-40 w-full items-center justify-center bg-gradient-to-br from-slate-700 to-slate-800 text-3xl font-semibold text-white">
                      {subcategory.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                <div className="mt-6">
                  <h2 className="text-2xl font-semibold text-white">{subcategory.name}</h2>
                  <p className="mt-4 min-h-[4.5rem] text-sm leading-7 text-slate-300">
                    {subcategory.description || 'Browse the content available for this subtopic.'}
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-between gap-3">
                  <Badge variant="outline">Subtopic</Badge>
                  <Link
                    href={`/topics/${subcategory.slug}`}
                    className="text-sm font-semibold text-[#7C61FF] transition group-hover:text-white"
                  >
                    View posts →
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-12 text-center text-slate-400">
            No subtopics have been linked to this category yet.
          </div>
        )}
      </div>
    </section>
  );
};

export async function generateStaticParams() {
  try {
    const { getCategories } = await import('@/lib/strapi');
    const categories = await getCategories();
    return categories.map((category) => ({ slug: category.slug }));
  } catch (error) {
    console.error('Error generating category static params:', error);
    return [];
  }
}

export default CategoryPage;
