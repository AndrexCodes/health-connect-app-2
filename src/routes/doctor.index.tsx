import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { CalendarClock, CheckCircle2, Clock, Users, ArrowRight, Activity } from "lucide-react";
import { DoctorShell } from "@/components/shells";
import { Button } from "@/components/ui/button";
import { useClinic } from "@/lib/clinic-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/doctor/")({
  head: () => ({ meta: [{ title: "Dashboard — Medley Clinic" }] }),
  component: DoctorDashboard,
});

function DoctorDashboard() {
  const { appointments, currentDoctorId, doctors, patients } = useClinic();
  const doctor = doctors.find((d) => d.id === currentDoctorId)!;
  const today = new Date().toISOString().slice(0, 10);

  const mine = useMemo(() => appointments.filter((a) => a.doctorId === currentDoctorId), [appointments, currentDoctorId]);
  const todays = mine.filter((a) => a.date === today && a.status === "Upcoming").sort((a, b) => a.time.localeCompare(b.time));
  const upcoming = mine.filter((a) => a.status === "Upcoming" && a.date >= today);
  const completed = mine.filter((a) => a.status === "Completed").length;
  const uniquePatients = new Set(mine.map((a) => a.patientId)).size;
  const next = todays[0];
  const nextPatient = next ? patients.find((p) => p.id === next.patientId) : null;

  return (
    <DoctorShell
      title={`Good ${greeting()}, ${doctor.name.split(" ").pop()}`}
      subtitle={new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}
      action={
        <Button asChild variant="outline">
          <Link to="/doctor/schedule">Open schedule</Link>
        </Button>
      }
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={<CalendarClock className="h-5 w-5" />} label="Today's appointments" value={todays.length.toString()} tone="primary" />
        <StatCard icon={<Clock className="h-5 w-5" />} label="Upcoming (all)" value={upcoming.length.toString()} tone="accent" />
        <StatCard icon={<CheckCircle2 className="h-5 w-5" />} label="Completed" value={completed.toString()} tone="success" />
        <StatCard icon={<Users className="h-5 w-5" />} label="Total patients" value={uniquePatients.toString()} tone="neutral" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[2fr_1fr]">
        {/* Today */}
        <section className="rounded-3xl border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Today's schedule</h2>
            <Link to="/doctor/schedule" className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {todays.length === 0 ? (
            <EmptyBlock title="Nothing on today" description="You have no appointments scheduled for today." />
          ) : (
            <ul className="mt-4 divide-y divide-border">
              {todays.map((a) => {
                const p = patients.find((x) => x.id === a.patientId)!;
                return (
                  <li key={a.id} className="flex items-center gap-4 py-3">
                    <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-primary-soft text-primary">
                      <div className="text-center">
                        <div className="text-[10px] uppercase tracking-widest">at</div>
                        <div className="text-sm font-bold">{a.time}</div>
                      </div>
                    </div>
                    <img src={p.photo} alt="" className="h-10 w-10 rounded-xl bg-muted object-cover" />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-semibold">{p.name}</div>
                      <div className="truncate text-xs text-muted-foreground">{a.reason}</div>
                    </div>
                    <span className="hidden text-xs text-muted-foreground sm:inline">{p.gender} · {p.age}y</span>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        {/* Next patient */}
        <section className="rounded-3xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold">Next patient</h2>
          {next && nextPatient ? (
            <div className="mt-4">
              <div className="flex items-center gap-3">
                <img src={nextPatient.photo} alt="" className="h-14 w-14 rounded-2xl bg-muted object-cover" />
                <div>
                  <div className="font-semibold">{nextPatient.name}</div>
                  <div className="text-xs text-muted-foreground">{nextPatient.gender} · {nextPatient.age}y</div>
                </div>
              </div>
              <div className="mt-4 rounded-2xl bg-primary-soft p-4 text-sm text-primary">
                <div className="flex items-center gap-2 font-medium">
                  <Activity className="h-4 w-4" /> {next.reason}
                </div>
                <div className="mt-1 text-xs text-primary/80">Scheduled today at {next.time}</div>
              </div>
              <Button asChild className="mt-4 w-full">
                <Link to="/doctor/patients">Open patient</Link>
              </Button>
            </div>
          ) : (
            <EmptyBlock title="No more patients today" description="Enjoy the calm — check back tomorrow." />
          )}
        </section>
      </div>
    </DoctorShell>
  );
}

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "morning";
  if (h < 18) return "afternoon";
  return "evening";
}

function StatCard({
  icon,
  label,
  value,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  tone: "primary" | "accent" | "success" | "neutral";
}) {
  const styles = {
    primary: "bg-primary text-primary-foreground",
    accent: "bg-accent/70 text-accent-foreground",
    success: "bg-success/20 text-success-foreground",
    neutral: "bg-muted text-foreground",
  }[tone];
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className={cn("grid h-10 w-10 place-items-center rounded-xl", styles)}>{icon}</div>
      <div className="mt-4 text-3xl font-bold tracking-tight">{value}</div>
      <div className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">{label}</div>
    </div>
  );
}

function EmptyBlock({ title, description }: { title: string; description: string }) {
  return (
    <div className="mt-4 rounded-2xl bg-muted/60 p-6 text-center">
      <div className="text-sm font-semibold">{title}</div>
      <div className="mt-1 text-xs text-muted-foreground">{description}</div>
    </div>
  );
}
