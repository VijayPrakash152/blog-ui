"use client";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-[#070A11] text-white shadow-[0_2px_40px_rgba(0,0,0,0.15)]">
      <Container className="relative flex items-center justify-between gap-8 py-5">
        <Link href="/" className="inline-flex items-center gap-3 text-lg font-semibold tracking-wide text-white transition hover:text-[#7C61FF]">
          <img src="/favicon-32x32.png" alt="Vijay Prakash favicon" className="h-10 w-10 rounded-2xl bg-[#7C61FF]/10 object-cover" />
          Vijay Prakash
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link href="/profile" className="text-sm font-medium text-slate-300 transition hover:text-white">
            About
          </Link>
          <Link href="/" className="text-sm font-medium text-slate-300 transition hover:text-white">
            Posts
          </Link>
          <Link href="/categories" className="text-sm font-medium text-slate-300 transition hover:text-white">
            Categories
          </Link>
        </nav>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="md:hidden rounded-[1rem] p-3"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>

        {isMenuOpen && (
          <div className="absolute inset-x-0 top-full z-50 rounded-b-3xl border border-white/10 bg-slate-950/95 p-6 shadow-2xl shadow-black/30 backdrop-blur-xl md:hidden">
            <div className="flex flex-col gap-4">
              {[
                { href: "/profile", label: "About" },
                { href: "/", label: "Posts" },
                { href: "/categories", label: "Categories" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-2xl bg-white/5 px-4 py-3 text-base font-semibold text-white transition hover:bg-[#7C61FF]/15"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </Container>
    </header>
  );
};

export default Header;
