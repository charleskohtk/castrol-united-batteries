"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { getCurrentUser, signOut, fetchUserAttributes, fetchAuthSession } from "aws-amplify/auth";
import { ChevronRight, Sun, Moon, LayoutDashboard, ShieldCheck, Settings, LogOut, ArrowLeft, ClipboardList } from "lucide-react";
import { useTheme } from "../components/ThemeProvider";
import { PageSkeleton } from "../components/ui/Skeleton";

const adminRoutes = ["/portal/dashboard", "/portal/admin"];

const allNavItems = [
  { href: "/portal/dashboard", label: "Dashboard", icon: LayoutDashboard, adminOnly: true },
  { href: "/portal/registrations", label: "Registrations", icon: ClipboardList, adminOnly: false, dealerOnly: true },
  { href: "/portal/admin", label: "Admin", icon: ShieldCheck, adminOnly: true },
  { href: "/portal/settings", label: "Settings", icon: Settings, adminOnly: false },
];

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [authenticated, setAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);
  const [userEmail, setUserEmail] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (pathname === "/portal/login") {
      setChecking(false);
      return;
    }

    getCurrentUser()
      .then(async () => {
        setAuthenticated(true);
        try {
          const [attrs, session] = await Promise.all([
            fetchUserAttributes(),
            fetchAuthSession(),
          ]);
          setUserEmail(attrs.email || "");
          const groups = (session.tokens?.accessToken?.payload["cognito:groups"] as string[]) || [];
          const admin = groups.includes("ADMIN") || groups.includes("MANAGEMENT");
          setIsAdmin(admin);

          // Redirect dealers away from admin-only routes
          if (!admin && adminRoutes.includes(pathname)) {
            router.replace("/portal/registrations");
          }
        } catch { /* fallback */ }
      })
      .catch(() => router.replace("/portal/login"))
      .finally(() => setChecking(false));
  }, [pathname, router]);

  if (pathname === "/portal/login") {
    return <>{children}</>;
  }

  if (checking) {
    return <PageSkeleton />;
  }

  if (!authenticated) {
    return null;
  }

  async function handleSignOut() {
    await signOut();
    router.replace("/portal/login");
  }

  return (
    <div className="flex min-h-[calc(100vh-8rem)] flex-col">
      {/* Top bar with user email and sign out */}
      <header className="flex items-center justify-end gap-4 border-b border-border px-6 py-3">
        <span className="text-sm font-semibold text-muted-foreground">{userEmail}</span>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <LogOut size={14} />
          Sign Out
        </button>
      </header>

      <div className="flex flex-1">
        <aside className="hidden md:flex w-64 flex-col border-r border-border bg-background">
          {/* <div className="px-6 py-6 flex items-center gap-2 text-sm text-muted-foreground">
            <ArrowLeft size={16} />
            <span>Menu</span>
          </div> */}

          <nav className="flex flex-col flex-1" aria-label="Portal navigation">
            {allNavItems.filter((item) => {
              if (item.adminOnly && !isAdmin) return false;
              if (item.dealerOnly && isAdmin) return false;
              return true;
            }).map((item) => {
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

          <div className="border-t border-border px-6 py-4">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-[var(--radius)] hover:bg-secondary text-muted-foreground hover:text-foreground"
              aria-label="Toggle dark mode"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </aside>

        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
