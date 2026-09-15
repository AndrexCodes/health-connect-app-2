import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Mail, Phone, Droplets, MapPin, Pencil, Check } from "lucide-react";
import { toast } from "sonner";
import { PatientShell } from "@/components/shells";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useClinic, usePatient } from "@/lib/clinic-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/patient/profile")({
  head: () => ({ meta: [{ title: "Profile — Medley" }] }),
  component: PatientProfile,
});

function PatientProfile() {
  const { currentPatientId, updatePatient, appointments, doctors } = useClinic();
  const patient = usePatient(currentPatientId)!;
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(patient);

  const history = useMemo(
    () =>
      appointments
        .filter((a) => a.patientId === currentPatientId)
        .sort((a, b) => (a.date > b.date ? -1 : 1)),
    [appointments, currentPatientId],
  );

  return (
    <PatientShell>
      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
        <section className="overflow-hidden rounded-3xl border border-border bg-card">
          <div className="h-24 sm:h-28" style={{ background: "linear-gradient(120deg, oklch(0.58 0.15 245), oklch(0.78 0.13 190))" }} />
          <div className="px-6 pb-6 sm:px-8">
            <div className="-mt-12 flex flex-wrap items-end justify-between gap-4">
              <div className="flex items-end gap-4">
                <img src={patient.photo} alt="" className="h-20 w-20 rounded-3xl border-4 border-card bg-primary-soft object-cover" />
                <div className="pb-1">
                  <h1 className="text-xl font-bold sm:text-2xl">{patient.name}</h1>
                  <p className="text-sm text-muted-foreground">{patient.age} yrs · {patient.gender}</p>
                </div>
              </div>
              <Button variant={editing ? "default" : "outline"} onClick={() => {
                if (editing) {
                  updatePatient(patient.id, draft);
                  toast.success("Profile updated");
                }
                setEditing((v) => !v);
              }}>
                {editing ? <><Check className="mr-1 h-4 w-4" /> Save</> : <><Pencil className="mr-1 h-4 w-4" /> Edit profile</>}
              </Button>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Field icon={<Mail className="h-4 w-4" />} label="Email" value={draft.email} editing={editing} onChange={(v) => setDraft({ ...draft, email: v })} />
              <Field icon={<Phone className="h-4 w-4" />} label="Phone" value={draft.phone} editing={editing} onChange={(v) => setDraft({ ...draft, phone: v })} />
              <Field icon={<Droplets className="h-4 w-4" />} label="Blood group" value={draft.bloodGroup} editing={editing} onChange={(v) => setDraft({ ...draft, bloodGroup: v })} />
              <Field icon={<MapPin className="h-4 w-4" />} label="Address" value={draft.address} editing={editing} onChange={(v) => setDraft({ ...draft, address: v })} />
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-3xl border border-border bg-card p-6 sm:p-8">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Visit history</h2>
            <span className="text-sm text-muted-foreground">{history.length} visits</span>
          </div>

          <ol className="mt-4 space-y-2">
            {history.length === 0 && (
              <li className="rounded-2xl bg-muted/60 p-4 text-sm text-muted-foreground">No visits yet.</li>
            )}
            {history.map((a) => {
              const d = doctors.find((x) => x.id === a.doctorId)!;
              return (
                <li key={a.id} className="flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-surface p-3">
                  <img src={d.photo} alt="" className="h-10 w-10 rounded-xl bg-primary-soft object-cover" />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium">{d.name} · {d.specialty}</div>
                    <div className="truncate text-xs text-muted-foreground">{a.reason}</div>
                  </div>
                  <div className="text-right text-xs text-muted-foreground">
                    <div>{new Date(a.date + "T00:00:00").toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}</div>
                    <Badge variant="secondary" className={cn("mt-1 rounded-full", a.status === "Upcoming" ? "bg-primary-soft text-primary" : a.status === "Completed" ? "bg-success/15 text-success-foreground" : "bg-destructive/10 text-destructive")}>
                      {a.status}
                    </Badge>
                  </div>
                </li>
              );
            })}
          </ol>
        </section>
      </div>
    </PatientShell>
  );
}

function Field({
  icon,
  label,
  value,
  editing,
  onChange,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  editing: boolean;
  onChange: (v: string) => void;
}) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <Label className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
        {icon} {label}
      </Label>
      {editing ? (
        <Input value={value} onChange={(e) => onChange(e.target.value)} className="mt-2 h-10" />
      ) : (
        <div className="mt-2 text-sm font-medium">{value}</div>
      )}
    </div>
  );
}
