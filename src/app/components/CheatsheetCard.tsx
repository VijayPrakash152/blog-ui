import Link from 'next/link';
import { ArrowRight, Download } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { Cheatsheet } from '@/types';

interface CheatsheetCardProps {
  cheatsheet: Cheatsheet;
}

export const CheatsheetCard = ({ cheatsheet }: CheatsheetCardProps) => {
  return (
    <Card className="flex h-full flex-col p-6">
      <div className="flex flex-wrap gap-2">
        {cheatsheet.subcategories?.length ? (
          cheatsheet.subcategories.map((subcategory) => (
            <Badge key={subcategory.slug} variant="outline">
              {subcategory.name}
            </Badge>
          ))
        ) : (
          <Badge variant="outline">Reference</Badge>
        )}
      </div>

      <h3 className="mt-5 text-2xl font-semibold text-white">{cheatsheet.title}</h3>
      <p className="mt-3 text-sm leading-7 text-slate-300">
        Quick reference guide for developers and technical teams.
      </p>

      <div className="mt-auto flex flex-wrap items-center gap-3 pt-6">
        <Link href={`/cheatsheets/${cheatsheet.slug}`}>
          <Button type="button" size="sm">
            <span className="mr-2">View</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>

        {cheatsheet.downloadUrl ? (
          <a
            href={cheatsheet.downloadUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-[#7C61FF] hover:text-[#7C61FF]"
          >
            <Download className="mr-2 h-4 w-4" />
            Download
          </a>
        ) : null}
      </div>
    </Card>
  );
};
