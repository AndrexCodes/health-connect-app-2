import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, HeartPulse, Stethoscope, UserRound } from "lucide-react";

export const Route = createFileRoute("/")({
  component: RolePicker,
});

function RolePicker() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      {/* Ambient background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(1200px 600px at 15% -10%, oklch(0.9 0.06 245 / 0.8), transparent 60%), radial-gradient(900px 500px at 100% 20%, oklch(0.9 0.06 190 / 0.7), transparent 55%)",
        }}
      />

      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-soft">
            <Stethoscope className="h-5 w-5" />
          </span>
          <div>
            <div className="text-lg font-bold tracking-tight">JOVACGO</div>
            <div className="text-[11px] uppercase tracking-widest text-muted-foreground">Care, simplified</div>
          </div>
        </div>
        <span className="hidden rounded-full bg-primary-soft px-3 py-1 text-xs font-medium text-primary sm:inline-flex">
          UI/UX demo · No real data
        </span>
      </header>

      <section className="mx-auto max-w-6xl px-6 pb-24 pt-8 sm:pt-16">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-muted-foreground">
            <HeartPulse className="h-3.5 w-3.5 text-primary" />
            Trusted doctors, calm booking experience
          </span>
          <h1 className="mt-5 text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
            Choose your side of the visit.
          </h1>
          <p className="mt-4 max-w-lg text-base text-muted-foreground sm:text-lg">
            This is a click-through prototype. Pick a role to explore the full experience —
            everything is powered by local dummy data.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:mt-16 md:grid-cols-2">
          <RoleCard
            to="/patient/login"
            title="I'm a Patient"
            description="Find doctors by specialty, view profiles and reviews, book and manage appointments."
            icon={<UserRound className="h-6 w-6" />}
            accent="from-primary to-primary/70"
          />
          <RoleCard
            to="/doctor/login"
            title="I'm a Doctor"
            description="See today's schedule, manage availability, mark visits complete, and edit your profile."
            icon={<Stethoscope className="h-6 w-6" />}
            accent="from-accent to-accent/60"
            variant="accent"
          />
        </div>

        <div className="mt-16 grid gap-4 text-sm text-muted-foreground sm:grid-cols-3">
          <Fact number="8" label="Doctors" />
          <Fact number="7" label="Specialties" />
          <Fact number="95%" label="Satisfaction Rate" />
        </div>
      </section>
    </main>
  );
}

function RoleCard({
  to,
  title,
  description,
  icon,
  accent,
  variant = "primary",
}: {
  to: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  accent: string;
  variant?: "primary" | "accent";
}) {
  return (
    <Link
      to={to}
      className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-border bg-surface p-8 transition-all hover:-translate-y-1 hover:shadow-lift"
    >
      <div
        aria-hidden
        className={`absolute -right-16 -top-16 h-56 w-56 rounded-full bg-gradient-to-br ${accent} opacity-30 blur-3xl transition-opacity group-hover:opacity-50`}
      />
      <div className="relative">
        <span
          className={
            variant === "accent"
              ? "grid h-14 w-14 place-items-center rounded-2xl bg-accent/20 text-accent-foreground"
              : "grid h-14 w-14 place-items-center rounded-2xl bg-primary-soft text-primary"
          }
        >
          {icon}
        </span>
        <h2 className="mt-6 text-2xl font-bold tracking-tight">{title}</h2>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="relative mt-10 flex items-center gap-2 text-sm font-semibold text-primary">
        Get Started <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </div>
    </Link>
  );
}

function Fact({ number, label }: { number: string; label: string }) {
  return (
    <div className="rounded-2xl border border-border bg-surface/60 p-5">
      <div className="text-3xl font-bold tracking-tight text-foreground">{number}</div>
      <div className="mt-1 text-xs uppercase tracking-widest">{label}</div>
    </div>
  );
}
