import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Calendar, User, Stethoscope } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { to: "/patient", label: "Discover", icon: Home, exact: true },
  { to: "/patient/appointments", label: "Visits", icon: Calendar },
  { to: "/patient/profile", label: "Profile", icon: User },
];

export function PatientBottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isActive = (to: string, exact?: boolean) =>
    exact ? pathname === to : pathname === to || pathname.startsWith(to + "/");

  return (
    <>
      <div className="h-24 md:h-0" aria-hidden />
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border/60 bg-surface/95 backdrop-blur-xl md:hidden">
        <ul className="mx-auto grid max-w-lg grid-cols-3 px-4 py-2">
          {items.map((item) => {
            const active = isActive(item.to, item.exact);
            const Icon = item.icon;
            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className={cn(
                    "flex flex-col items-center gap-1 rounded-xl px-3 py-2 text-xs font-medium transition-colors",
                    active ? "text-primary" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <span
                    className={cn(
                      "grid h-9 w-9 place-items-center rounded-xl transition-colors",
                      active ? "bg-primary-soft" : "bg-transparent",
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}

export function PatientTopBar() {
  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link to="/patient" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-soft">
            <Stethoscope className="h-5 w-5" />
          </span>
          <span className="text-lg font-bold tracking-tight">JOVACGO</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {items.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground data-[status=active]:bg-primary-soft data-[status=active]:text-primary"
              activeOptions={{ exact: item.exact }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link
          to="/"
          className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          Switch view
        </Link>
      </div>
    </header>
  );
}
