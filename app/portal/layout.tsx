"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { getCurrentUser, signOut } from "aws-amplify/auth";
import { ChevronRight, Sun, Moon, LayoutDashboard, ShieldCheck, Settings, LogOut, ArrowLeft } from "lucide-react";
import { useTheme } from "../components/ThemeProvider";
import { PageSkeleton } from "../components/ui/Skeleton";

const navItems = [
  { href: "/portal/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/portal/admin", label: "Admin", icon: ShieldCheck },
  { href: "/portal/settings", label: "Settings", icon: Settings },
];

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [authenticated, setAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (pathname === "/portal/login") {
      setChecking(false);
      return;
    }

    getCurrentUser()
      .then(() => setAuthenticated(true))
      .catch(() => router.replace("/portal/login"))
      .finally(() => setChecking(false));
  }, [pathname, router]);

  // Login page - no layout
  if (pathname === "/portal/login") {
    return <>{children}</>;
  }

  // Checking auth state
  if (checking) {
    return <PageSkeleton />;
  }

  // Not authenticated
  if (!authenticated) {
    return null;
  }

  async function handleSignOut() {
    await signOut();
    router.replace("/portal/login");
  }

  return (
    <div className="flex min-h-[calc(100vh-8rem)]">
      <aside className="hidden md:flex w-64 flex-col border-r border-border bg-background">
        <div className="px-6 py-6 flex items-center gap-2 text-sm text-muted-foreground">
          <ArrowLeft size={16} />
          <span>Menu</span>
        </div>

        <nav className="flex flex-col flex-1" aria-label="Portal navigation">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex items-center justify-between px-6 py-4 text-sm transition-colors ${
                  isActive
                    ? "bg-primary text-white font-medium"
                    : "text-foreground hover:bg-secondary"
                }`}
              >
                {isActive && (
                  <span className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
                )}
                <span className="flex items-center gap-3">
                  <item.icon size={18} />
                  {item.label}
                </span>
                <ChevronRight size={16} className={isActive ? "text-white/70" : "text-muted-foreground"} />
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-border px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-[var(--radius)] hover:bg-secondary text-muted-foreground hover:text-foreground"
            aria-label="Toggle dark mode"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      <div className="flex-1">{children}</div>
    </div>
  );
}
