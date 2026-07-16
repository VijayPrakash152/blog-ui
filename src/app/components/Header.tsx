"use client";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/posts", label: "Posts" },
  { href: "/profile", label: "About" },
  { href: "/#contact", label: "Contact" },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#070A11]/90 text-white backdrop-blur-xl">
      <Container className="relative flex items-center justify-between gap-8 py-4">
        <Link href="/" className="inline-flex items-center gap-3 text-lg font-semibold tracking-wide text-white transition hover:text-[#7C61FF]">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#7C61FF]/20 bg-[#7C61FF]/10 text-sm font-semibold text-[#7C61FF]">
            VP
          </div>
          Vijay Prakash
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => {
            const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition ${isActive ? "text-white" : "text-slate-300 hover:text-white"}`}
              >
                {item.label}
              </Link>
            );
          })}
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
              {navItems.map((item) => (
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
