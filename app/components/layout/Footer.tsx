export function Footer() {
  return (
    <footer className="mt-8 border-t border-border bg-background px-4 py-6">
      <div className="mx-auto max-w-7xl text-center text-xs text-muted-foreground caption">
        © {new Date().getFullYear()} Castrol Battery Warranty Portal. All rights reserved.
      </div>
    </footer>
  );
}
