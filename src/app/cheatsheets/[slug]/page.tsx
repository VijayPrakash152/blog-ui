import Link from 'next/link';
import { Download } from 'lucide-react';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getCheatsheetBySlug, getCheatsheetsBySubcategory } from '@/lib/strapi';
import { cheatsheetMarkdownToHtml } from '@/lib/cheatsheet-markdown';
import { CheatsheetCard } from '@/app/components/CheatsheetCard';
import { CheatsheetContent } from '@/app/components/CheatsheetContent';

interface CheatsheetDetailPageProps {
  params: Promise<{ slug: string }>;
}

const CheatsheetDetailPage = async ({ params }: CheatsheetDetailPageProps) => {
  const { slug } = await params;
  const cheatsheet = await getCheatsheetBySlug(slug);

  if (!cheatsheet) {
    notFound();
  }

  const [contentHtml, relatedCheatsheets] = await Promise.all([
    cheatsheetMarkdownToHtml(cheatsheet.content || ''),
    getCheatsheetsBySubcategory(cheatsheet.subcategories?.[0]?.slug || ''),
  ]);

  const related = relatedCheatsheets.filter((item) => item.slug !== cheatsheet.slug).slice(0, 3);
  const subcategory = cheatsheet.subcategories?.[0];

  return (
    <section className="bg-[#05070B] px-6 py-16 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <nav className="mb-8 flex flex-wrap items-center gap-2 text-sm text-slate-400">
          <Link href="/cheatsheets" className="transition hover:text-[#7C61FF]">
            Cheatsheets
          </Link>
          <span>/</span>
          {subcategory ? (
            <Link href={`/topics/${subcategory.slug}`} className="transition hover:text-[#7C61FF]">
              {subcategory.name}
            </Link>
          ) : null}
        </nav>

        <div className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-8 sm:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl">
              <h1 className="text-4xl font-semibold text-white sm:text-5xl">{cheatsheet.title}</h1>
              <div className="mt-6 flex flex-wrap gap-2">
                {cheatsheet.subcategories?.length ? (
                  cheatsheet.subcategories.map((subcategoryItem) => (
                    <Badge key={subcategoryItem.slug} variant="outline">
                      {subcategoryItem.name}
                    </Badge>
                  ))
                ) : (
                  <Badge variant="outline">Reference</Badge>
                )}
              </div>
            </div>

            {cheatsheet.downloadUrl ? (
              <a href={cheatsheet.downloadUrl} target="_blank" rel="noreferrer">
                <Button type="button" className="w-full lg:w-auto">
                  <Download className="mr-2 h-4 w-4" />
                  Download PDF
                </Button>
              </a>
            ) : null}
          </div>

          <div className="mt-10">
            <CheatsheetContent html={contentHtml} />
          </div>
        </div>

        {related.length > 0 ? (
          <div className="mt-12">
            <h2 className="text-2xl font-semibold text-white">More cheatsheets in {subcategory?.name || 'this topic'}</h2>
            <div className="mt-6 grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
              {related.map((item) => (
                <CheatsheetCard key={item.id} cheatsheet={item} />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
};

export async function generateStaticParams() {
  try {
    const { getCheatsheets } = await import('@/lib/strapi');
    const cheatsheets = await getCheatsheets();
    return cheatsheets.map((cheatsheet) => ({ slug: cheatsheet.slug }));
  } catch (error) {
    console.error('Error generating cheatsheet static params:', error);
    return [];
  }
}

export default CheatsheetDetailPage;
