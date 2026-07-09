"use client";

import Link from "next/link";
import Image from "next/image";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "../ThemeProvider";

export function Navbar() {
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
      <nav className="mx-auto flex max-w-full items-center justify-between px-8 py-6" aria-label="Main navigation">
        <Link href="/" aria-label="Castrol Warranty Home">
          <Image src="/castrol-logo.svg" alt="Castrol" width={158} height={48} priority />
        </Link>

        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="p-2 rounded-[var(--radius)] hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
          {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </nav>
    </header>
  );
}
