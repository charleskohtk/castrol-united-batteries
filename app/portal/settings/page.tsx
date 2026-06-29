"use client";

import { useTheme } from "../../components/ThemeProvider";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/Card";

export default function PortalSettingsPage() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-bold text-foreground mb-6">Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
        </CardHeader>
        <CardContent>
          <fieldset>
            <legend className="sr-only">Theme preference</legend>
            <div className="flex gap-3">
              {(["light", "dark", "system"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTheme(t)}
                  className={`px-4 py-2 rounded-[var(--radius)] border text-sm capitalize transition-colors ${
                    theme === t
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border hover:bg-secondary"
                  }`}
                  aria-pressed={theme === t}
                >
                  {t}
                </button>
              ))}
            </div>
          </fieldset>
        </CardContent>
      </Card>
    </div>
  );
}
