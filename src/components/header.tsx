import { ThemeToggle } from "@/components/theme-toggle";

interface HeaderProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}

export function Header({ title, subtitle, children }: HeaderProps) {
  return (
    <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <div className="pl-12 lg:pl-0">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm text-foreground/50 mt-1">{subtitle}</p>
        )}
      </div>
      <div className="flex items-center gap-3 pl-12 lg:pl-0">
        {children}
        <ThemeToggle />
      </div>
    </header>
  );
}
