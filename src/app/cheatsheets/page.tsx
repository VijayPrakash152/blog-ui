import Link from 'next/link';
import { getCheatsheets, getSubcategories } from '@/lib/strapi';
import { CheatsheetFilter } from './CheatsheetFilter';

const CheatsheetsPage = async () => {
  const [cheatsheets, subcategories] = await Promise.all([getCheatsheets(), getSubcategories()]);

  return (
    <section className="bg-[#05070B] px-6 py-16 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 rounded-[2rem] border border-white/10 bg-slate-950/80 p-8 sm:p-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#7C61FF]">
                Reference library
              </p>
              <h1 className="mt-3 text-4xl font-semibold text-white sm:text-5xl">Cheatsheets</h1>
              <p className="mt-5 text-sm leading-7 text-slate-300">
                Quick reference guides for developers.
              </p>
            </div>
            <Link href="/" className="text-sm font-semibold text-[#7C61FF] transition hover:text-[#8c76ff]">
              Back to home
            </Link>
          </div>
        </div>

        {cheatsheets.length > 0 ? (
          <CheatsheetFilter subcategories={subcategories} cheatsheets={cheatsheets} />
        ) : (
          <div className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-12 text-center text-slate-400">
            No cheatsheets are available right now. Check back soon.
          </div>
        )}
      </div>
    </section>
  );
};

export default CheatsheetsPage;
