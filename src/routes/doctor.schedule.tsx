import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Calendar, CheckCircle2, XCircle, Clock, LayoutGrid, List } from "lucide-react";
import { toast } from "sonner";
import { DoctorShell } from "@/components/shells";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useClinic } from "@/lib/clinic-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/doctor/schedule")({
  head: () => ({ meta: [{ title: "Schedule — Medley Clinic" }] }),
  component: DoctorSchedule,
});

function DoctorSchedule() {
  const { appointments, currentDoctorId, patients, updateAppointmentStatus } = useClinic();
  const today = new Date().toISOString().slice(0, 10);
  const [view, setView] = useState<"list" | "calendar">("list");
  const [selectedDate, setSelectedDate] = useState<string>(today);

  const mine = useMemo(
    () => appointments.filter((a) => a.doctorId === currentDoctorId).sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time)),
    [appointments, currentDoctorId],
  );

  const days = useMemo(() => nextDays(14), []);
  const dayCounts = useMemo(() => {
    const m: Record<string, number> = {};
    for (const a of mine) if (a.status === "Upcoming") m[a.date] = (m[a.date] ?? 0) + 1;
    return m;
  }, [mine]);

  const forDay = mine.filter((a) => a.date === selectedDate);

  const findPatient = (id: string) => patients.find((p) => p.id === id)!;

  return (
    <DoctorShell
      title="Schedule"
      subtitle="Upcoming appointments and today's queue"
      action={
        <div className="flex items-center gap-1 rounded-xl bg-muted p-1">
          <button
            onClick={() => setView("list")}
            className={cn("rounded-lg px-3 py-1.5 text-xs font-medium", view === "list" ? "bg-surface shadow-soft" : "text-muted-foreground")}
          >
            <List className="mr-1 inline h-3.5 w-3.5" /> List
          </button>
          <button
            onClick={() => setView("calendar")}
            className={cn("rounded-lg px-3 py-1.5 text-xs font-medium", view === "calendar" ? "bg-surface shadow-soft" : "text-muted-foreground")}
          >
            <LayoutGrid className="mr-1 inline h-3.5 w-3.5" /> Calendar
          </button>
        </div>
      }
    >
      {view === "calendar" && (
        <section className="mb-6 rounded-3xl border border-border bg-card p-5">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Next 14 days</h2>
          <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
            {days.map((d) => {
              const active = selectedDate === d.iso;
              const count = dayCounts[d.iso] ?? 0;
              return (
                <button
                  key={d.iso}
                  onClick={() => setSelectedDate(d.iso)}
                  className={cn(
                    "flex min-w-[76px] flex-col items-center rounded-2xl border px-3 py-3 text-center transition-colors",
                    active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-surface hover:border-primary/40",
                  )}
                >
                  <span className={cn("text-[11px] uppercase tracking-widest", active ? "text-primary-foreground/85" : "text-muted-foreground")}>{d.wd}</span>
                  <span className="mt-1 text-lg font-bold">{d.day}</span>
                  <span className={cn("mt-1 rounded-full px-1.5 text-[10px] font-medium", count > 0 ? (active ? "bg-white/25" : "bg-primary-soft text-primary") : "opacity-0")}>{count} appt</span>
                </button>
              );
            })}
          </div>
        </section>
      )}

      <section className="rounded-3xl border border-border bg-card p-5 sm:p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            {view === "calendar" ? prettyDate(selectedDate) : "All appointments"}
          </h2>
          <span className="text-sm text-muted-foreground">
            {view === "calendar" ? forDay.length : mine.length} total
          </span>
        </div>

        {(view === "calendar" ? forDay : mine).length === 0 ? (
          <div className="rounded-2xl bg-muted/60 p-8 text-center text-sm text-muted-foreground">
            No appointments to show.
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {(view === "calendar" ? forDay : mine).map((a) => {
              const p = findPatient(a.patientId);
              return (
                <li key={a.id} className="flex flex-wrap items-center gap-4 py-4">
                  <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-primary-soft text-primary">
                    <div className="text-center">
                      <Clock className="mx-auto h-3.5 w-3.5" />
                      <div className="text-sm font-bold">{a.time}</div>
                    </div>
                  </div>
                  <img src={p.photo} alt="" className="h-10 w-10 rounded-xl bg-muted object-cover" />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="truncate text-sm font-semibold">{p.name}</div>
                      <StatusBadge status={a.status} />
                    </div>
                    <div className="truncate text-xs text-muted-foreground">
                      <Calendar className="mr-1 inline h-3 w-3" /> {prettyDate(a.date)} · {a.reason}
                    </div>
                  </div>

                  {a.status === "Upcoming" ? (
                    <div className="flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-success-foreground hover:bg-success/10"
                        onClick={() => {
                          updateAppointmentStatus(a.id, "Completed");
                          toast.success("Marked as completed");
                        }}
                      >
                        <CheckCircle2 className="mr-1 h-3.5 w-3.5" /> Complete
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => {
                          updateAppointmentStatus(a.id, "Cancelled");
                          toast.success("Appointment cancelled");
                        }}
                      >
                        <XCircle className="mr-1 h-3.5 w-3.5" /> Cancel
                      </Button>
                    </div>
                  ) : null}
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </DoctorShell>
  );
}

function StatusBadge({ status }: { status: "Upcoming" | "Completed" | "Cancelled" }) {
  const styles = {
    Upcoming: "bg-primary-soft text-primary",
    Completed: "bg-success/15 text-success-foreground",
    Cancelled: "bg-destructive/10 text-destructive",
  }[status];
  return <Badge variant="secondary" className={cn("rounded-full font-medium", styles)}>{status}</Badge>;
}

function nextDays(count: number) {
  const out: { iso: string; day: string; wd: string }[] = [];
  const now = new Date();
  for (let i = 0; i < count; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    out.push({
      iso: d.toISOString().slice(0, 10),
      day: d.getDate().toString().padStart(2, "0"),
      wd: d.toLocaleDateString(undefined, { weekday: "short" }),
    });
  }
  return out;
}

function prettyDate(iso: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
}
