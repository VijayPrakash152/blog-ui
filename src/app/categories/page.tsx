import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getCategories, getSubcategories, resolveStrapiMediaUrl } from "@/lib/strapi";

const CategoriesPage = async () => {
  try {
    const [categories, subcategories] = await Promise.all([
      getCategories(),
      getSubcategories(),
    ]);

    const subcategoryCountByCategory = subcategories.reduce<Record<string, number>>(
      (acc, subcategory) => {
        subcategory.categories?.forEach((category) => {
          const key = category.slug || category.name;
          acc[key] = (acc[key] || 0) + 1;
        });
        return acc;
      },
      {}
    );

    return (
      <section className="bg-[#05070B] px-6 py-16 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#7C61FF]">
                Categories
              </p>
              <h1 className="mt-3 text-4xl font-semibold text-white sm:text-5xl">
                Explore topics by category.
              </h1>
            </div>
            <p className="max-w-2xl text-sm leading-6 text-slate-400">
              Browse the main content areas and discover the subtopics that sit underneath each one.
            </p>
          </div>

          {categories.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {categories.map((category) => {
                const count = subcategoryCountByCategory[category.slug] || 0;

                return (
                  <Card key={category.id} className="group p-8" hoverable>
                    <div className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-slate-900/80">
                      {category.image?.url ? (
                        <Image
                          src={resolveStrapiMediaUrl(category.image.url) || "/"}
                          alt={category.image.alternativeText || category.name}
                          width={1200}
                          height={675}
                          unoptimized
                          className="h-48 w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-48 w-full items-center justify-center bg-gradient-to-br from-[#7C61FF] to-slate-700 text-4xl font-semibold text-white">
                          {category.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>

                    <div className="mt-6">
                      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#7C61FF]">
                        {category.name}
                      </p>
                      <h2 className="mt-3 text-2xl font-semibold text-white">
                        {category.name}
                      </h2>
                    </div>

                    <p className="mt-5 min-h-[4.5rem] text-sm leading-7 text-slate-300">
                      {category.description || "Discover the content spanning this category."}
                    </p>

                    <div className="mt-6 flex items-center justify-between gap-3">
                      <Badge variant="outline">
                        {count} {count === 1 ? "subcategory" : "subcategories"}
                      </Badge>
                      <Link
                        href={`/categories/${category.slug}`}
                        className="text-sm font-semibold text-[#7C61FF] transition group-hover:text-white"
                      >
                        View topics →
                      </Link>
                    </div>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-12 text-center text-slate-400">
              No categories are available right now. Please check back soon.
            </div>
          )}
        </div>
      </section>
    );
  } catch (error) {
    console.error("Failed to load categories page:", error);

    return (
      <section className="bg-[#05070B] px-6 py-16 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-12 text-center text-slate-400">
            We could not load the categories right now. Please try again shortly.
          </div>
        </div>
      </section>
    );
  }
};

export default CategoriesPage;