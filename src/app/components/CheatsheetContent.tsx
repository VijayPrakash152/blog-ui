'use client';

import { useEffect } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Check, Copy } from 'lucide-react';

interface CheatsheetContentProps {
  html: string;
}

export const CheatsheetContent = ({ html }: CheatsheetContentProps) => {
  useEffect(() => {
    const preBlocks = Array.from(document.querySelectorAll('pre'));

    preBlocks.forEach((pre, index) => {
      if (pre.querySelector('.cheatsheet-copy-button')) {
        return;
      }

      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'cheatsheet-copy-button absolute right-3 top-3 inline-flex items-center rounded-md border border-white/10 bg-slate-950/80 p-2 text-slate-200 transition hover:bg-slate-900';
      button.setAttribute('data-copy-id', String(index));
      button.innerHTML = renderToStaticMarkup(<Copy className="h-4 w-4" />);
      button.addEventListener('click', async () => {
        const code = pre.textContent?.trim() || '';
        if (!code) {
          return;
        }

        try {
          await navigator.clipboard.writeText(code);
          button.innerHTML = renderToStaticMarkup(<Check className="h-4 w-4" />);
          window.setTimeout(() => {
            button.innerHTML = renderToStaticMarkup(<Copy className="h-4 w-4" />);
          }, 2000);
        } catch (error) {
          console.error('Failed to copy code block:', error);
        }
      });

      pre.classList.add('relative');
      pre.appendChild(button);
    });
  }, [html]);

  return (
    <div
      className="cheatsheet-content max-w-none space-y-2 text-slate-300"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};
