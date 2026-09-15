import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Mail, Phone, Droplets, MapPin, Calendar, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";
import { DoctorShell } from "@/components/shells";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useClinic } from "@/lib/clinic-store";
import type { Patient } from "@/lib/mockData";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/doctor/patients")({
  head: () => ({ meta: [{ title: "Patients — Medley Clinic" }] }),
  component: PatientsPage,
});

function PatientsPage() {
  const { appointments, currentDoctorId, patients, updateAppointmentStatus } = useClinic();
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<Patient | null>(null);

  const roster = useMemo(() => {
    const ids = new Set(appointments.filter((a) => a.doctorId === currentDoctorId).map((a) => a.patientId));
    return patients.filter((p) => ids.has(p.id));
  }, [appointments, currentDoctorId, patients]);

  const filtered = roster.filter((p) => !q || `${p.name} ${p.email}`.toLowerCase().includes(q.toLowerCase()));
  const active = selected ?? filtered[0] ?? null;

  const visits = useMemo(
    () =>
      active
        ? appointments
            .filter((a) => a.doctorId === currentDoctorId && a.patientId === active.id)
            .sort((a, b) => (a.date + a.time > b.date + b.time ? -1 : 1))
        : [],
    [appointments, currentDoctorId, active],
  );

  return (
    <DoctorShell title="Patients" subtitle="Everyone you've seen and everyone booked with you.">
      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <section className="rounded-3xl border border-border bg-card p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search patients" className="h-11 pl-9" />
          </div>

          <ul className="mt-3 max-h-[560px] space-y-1 overflow-y-auto pr-1">
            {filtered.length === 0 && (
              <li className="rounded-2xl bg-muted/60 p-4 text-sm text-muted-foreground">No patients found.</li>
            )}
            {filtered.map((p) => {
              const on = active?.id === p.id;
              return (
                <li key={p.id}>
                  <button
                    onClick={() => setSelected(p)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-2xl p-3 text-left transition-colors",
                      on ? "bg-primary-soft" : "hover:bg-muted",
                    )}
                  >
                    <img src={p.photo} alt="" className="h-11 w-11 rounded-xl bg-muted object-cover" />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-semibold">{p.name}</div>
                      <div className="truncate text-xs text-muted-foreground">{p.gender} · {p.age}y</div>
                    </div>
                    <span className={cn("text-[11px] font-medium", on ? "text-primary" : "text-muted-foreground")}>
                      {appointments.filter((a) => a.doctorId === currentDoctorId && a.patientId === p.id).length} visits
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>

        {/* Details */}
        {active ? (
          <section className="rounded-3xl border border-border bg-card p-6 sm:p-8">
            <div className="flex flex-wrap items-center gap-4">
              <img src={active.photo} alt="" className="h-16 w-16 rounded-2xl bg-muted object-cover" />
              <div className="min-w-0 flex-1">
                <h2 className="truncate text-xl font-bold">{active.name}</h2>
                <p className="text-xs text-muted-foreground">{active.gender} · {active.age}y · Blood group {active.bloodGroup}</p>
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <InfoRow icon={<Mail className="h-4 w-4" />} label="Email" value={active.email} />
              <InfoRow icon={<Phone className="h-4 w-4" />} label="Phone" value={active.phone} />
              <InfoRow icon={<Droplets className="h-4 w-4" />} label="Blood group" value={active.bloodGroup} />
              <InfoRow icon={<MapPin className="h-4 w-4" />} label="Address" value={active.address} />
            </div>

            <div className="mt-8">
              <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Appointments with you</h3>
              <ul className="mt-3 divide-y divide-border rounded-2xl border border-border bg-surface">
                {visits.length === 0 && (
                  <li className="p-4 text-sm text-muted-foreground">No appointments yet.</li>
                )}
                {visits.map((v) => (
                  <li key={v.id} className="flex flex-wrap items-center gap-3 p-4">
                    <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary text-sm font-semibold">
                      {v.time}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium">
                        <Calendar className="mr-1 inline h-3.5 w-3.5" /> {prettyDate(v.date)}
                      </div>
                      <div className="truncate text-xs text-muted-foreground">{v.reason}</div>
                    </div>
                    <Badge variant="secondary" className={cn("rounded-full",
                      v.status === "Upcoming" ? "bg-primary-soft text-primary" : v.status === "Completed" ? "bg-success/15 text-success-foreground" : "bg-destructive/10 text-destructive")}>
                      {v.status}
                    </Badge>
                    {v.status === "Upcoming" && (
                      <div className="flex w-full gap-2 sm:w-auto">
                        <Button size="sm" variant="outline" onClick={() => { updateAppointmentStatus(v.id, "Completed"); toast.success("Marked completed"); }}>
                          <CheckCircle2 className="mr-1 h-3.5 w-3.5" /> Complete
                        </Button>
                        <Button size="sm" variant="ghost" className="text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => { updateAppointmentStatus(v.id, "Cancelled"); toast.success("Cancelled"); }}>
                          <XCircle className="mr-1 h-3.5 w-3.5" /> Cancel
                        </Button>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ) : (
          <section className="rounded-3xl border border-dashed border-border p-12 text-center text-sm text-muted-foreground">
            Select a patient to see their details.
          </section>
        )}
      </div>
    </DoctorShell>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">{icon} {label}</div>
      <div className="mt-1 truncate text-sm font-medium">{value}</div>
    </div>
  );
}

function prettyDate(iso: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}
