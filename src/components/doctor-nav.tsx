import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, CalendarClock, Sliders, Users, User, Stethoscope, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useClinic, useDoctor } from "@/lib/clinic-store";

const items = [
  { to: "/doctor", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/doctor/schedule", label: "Schedule", icon: CalendarClock },
  { to: "/doctor/availability", label: "Availability", icon: Sliders },
  { to: "/doctor/patients", label: "Patients", icon: Users },
  { to: "/doctor/profile", label: "Profile", icon: User },
];

export function DoctorSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { currentDoctorId } = useClinic();
  const doc = useDoctor(currentDoctorId);

  const isActive = (to: string, exact?: boolean) =>
    exact ? pathname === to : pathname === to || pathname.startsWith(to + "/");

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 shrink-0 flex-col bg-sidebar text-sidebar-foreground lg:flex">
      <div className="flex h-16 items-center gap-2 px-6">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground">
          <Stethoscope className="h-5 w-5" />
        </span>
        <span className="text-lg font-bold tracking-tight">JOVACGO Clinic</span>
      </div>

      {doc && (
        <div className="mx-4 mt-2 flex items-center gap-3 rounded-2xl bg-sidebar-accent/70 p-3">
          <img src={doc.photo} alt="" className="h-11 w-11 rounded-xl bg-white/10 object-cover" />
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold">{doc.name}</div>
            <div className="truncate text-xs text-sidebar-foreground/70">{doc.specialty}</div>
          </div>
        </div>
      )}

      <nav className="mt-4 flex-1 space-y-1 px-3">
        {items.map((item) => {
          const active = isActive(item.to, item.exact);
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-soft"
                  : "text-sidebar-foreground/85 hover:bg-sidebar-accent hover:text-sidebar-foreground",
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3">
        <Link
          to="/"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-sidebar-foreground/85 transition-colors hover:bg-sidebar-accent"
        >
          <LogOut className="h-4 w-4" />
          Switch view
        </Link>
      </div>
    </aside>
  );
}

export function DoctorTopBar({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <header className="sticky top-0 z-20 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="min-w-0">
          <h1 className="truncate text-lg font-bold tracking-tight sm:text-xl">{title}</h1>
          {subtitle && <p className="truncate text-xs text-muted-foreground sm:text-sm">{subtitle}</p>}
        </div>
        {action}
      </div>
    </header>
  );
}

/** Mobile top bar with quick nav for doctor pages on small screens. */
export function DoctorMobileNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isActive = (to: string, exact?: boolean) =>
    exact ? pathname === to : pathname === to || pathname.startsWith(to + "/");

  return (
    <nav className="border-b border-border/60 bg-surface lg:hidden">
      <ul className="scrollbar-none flex gap-1 overflow-x-auto px-3 py-2">
        {items.map((item) => {
          const active = isActive(item.to, item.exact);
          const Icon = item.icon;
          return (
            <li key={item.to}>
              <Link
                to={item.to}
                className={cn(
                  "flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                  active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted",
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
