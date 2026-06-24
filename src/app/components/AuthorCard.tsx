import Link from "next/link";
import { ExternalLink } from "lucide-react";

const AuthorCard = () => {
  return (
    <aside className="rounded-[2rem] border border-white/10 bg-[#10161F] p-6 text-sm text-slate-200 shadow-sm shadow-black/20">
      <div className="flex items-start gap-4">
        <div className="shrink-0">
          <div className="h-16 w-16 overflow-hidden rounded-full border border-white/10 bg-slate-900">
            <img
              src="/profile-picture.jpg"
              alt="Vijay Prakash"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
        <div>
          <p className="text-sm uppercase tracking-[0.28em] text-[#7C61FF]">Author</p>
          <h3 className="mt-3 text-xl font-semibold text-white">Vijay Prakash</h3>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Software engineer and storyteller. Writes about engineering systems, product strategy, and building thoughtful developer experiences.
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-3 rounded-3xl border border-white/10 bg-slate-950/70 p-4">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase tracking-[0.3em] text-slate-500">Experience</span>
          <span className="text-sm font-semibold text-white">10+ years</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase tracking-[0.3em] text-slate-500">Focus</span>
          <span className="text-sm font-semibold text-white">Product engineering</span>
        </div>
      </div>

      <div className="mt-6 flex items-center gap-3 text-slate-300">
        <Link href="https://github.com/VijayPrakash152" className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/5 transition hover:bg-white/10">
          <ExternalLink className="h-4 w-4" />
        </Link>
        <Link href="https://www.linkedin.com/in/me-vijay-prakash" className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/5 transition hover:bg-white/10">
          <ExternalLink className="h-4 w-4" />
        </Link>
        <Link href="https://x.com/VijayPr4788148" className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/5 transition hover:bg-white/10">
          <ExternalLink className="h-4 w-4" />
        </Link>
      </div>
    </aside>
  );
};

export default AuthorCard;
