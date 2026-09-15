import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Calendar, Clock, MapPin, XCircle, CalendarClock, Eye } from "lucide-react";
import { toast } from "sonner";
import { PatientShell } from "@/components/shells";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useClinic } from "@/lib/clinic-store";
import type { Appointment, AppointmentStatus } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { EmptyState } from "./patient.index";

export const Route = createFileRoute("/patient/appointments")({
  head: () => ({ meta: [{ title: "My appointments — Medley" }] }),
  component: MyAppointments,
});

const TABS: AppointmentStatus[] = ["Upcoming", "Completed", "Cancelled"];

function MyAppointments() {
  const { appointments, currentPatientId, doctors, updateAppointmentStatus, rescheduleAppointment } = useClinic();
  const [tab, setTab] = useState<AppointmentStatus>("Upcoming");
  const [viewing, setViewing] = useState<Appointment | null>(null);
  const [rescheduling, setRescheduling] = useState<Appointment | null>(null);

  const mine = useMemo(
    () =>
      appointments
        .filter((a) => a.patientId === currentPatientId)
        .sort((a, b) => (a.date + a.time > b.date + b.time ? -1 : 1)),
    [appointments, currentPatientId],
  );

  const shown = mine.filter((a) => a.status === tab);
  const findDoctor = (id: string) => doctors.find((d) => d.id === id)!;

  return (
    <PatientShell>
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">My appointments</h1>
            <p className="mt-1 text-sm text-muted-foreground">Manage upcoming visits and see your history.</p>
          </div>
          <Button asChild variant="outline">
            <Link to="/patient">Book another visit</Link>
          </Button>
        </div>

        <div className="mt-6 flex items-center gap-1 rounded-2xl bg-muted p-1">
          {TABS.map((t) => {
            const count = mine.filter((a) => a.status === t).length;
            return (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={cn(
                  "flex-1 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                  tab === t ? "bg-surface text-foreground shadow-soft" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {t}
                <span className={cn("ml-2 rounded-full px-2 py-0.5 text-xs", tab === t ? "bg-primary-soft text-primary" : "bg-transparent")}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-6 space-y-3">
          {shown.length === 0 ? (
            <EmptyState
              title={`No ${tab.toLowerCase()} appointments`}
              description={tab === "Upcoming" ? "Book a visit to see it show up here." : "Nothing to show yet."}
              action={
                tab === "Upcoming" ? (
                  <Button asChild>
                    <Link to="/patient">Find a doctor</Link>
                  </Button>
                ) : null
              }
            />
          ) : (
            shown.map((a) => {
              const d = findDoctor(a.doctorId);
              return (
                <article key={a.id} className="rounded-2xl border border-border bg-card p-4 sm:p-5">
                  <div className="flex flex-wrap items-start gap-4">
                    <img src={d.photo} alt="" className="h-14 w-14 shrink-0 rounded-2xl bg-primary-soft object-cover" />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold">{d.name}</h3>
                        <StatusBadge status={a.status} />
                      </div>
                      <p className="text-xs text-muted-foreground">{d.specialty} · {d.clinic}</p>

                      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {prettyDate(a.date)}</span>
                        <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {a.time}</span>
                        <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {d.location}</span>
                      </div>
                      <p className="mt-2 text-sm">
                        <span className="text-muted-foreground">Reason: </span>
                        {a.reason}
                      </p>
                    </div>

                    <div className="flex w-full flex-wrap gap-2 sm:w-auto sm:flex-col">
                      <Button size="sm" variant="outline" onClick={() => setViewing(a)}>
                        <Eye className="mr-1 h-3.5 w-3.5" /> View
                      </Button>
                      {a.status === "Upcoming" && (
                        <>
                          <Button size="sm" variant="outline" onClick={() => setRescheduling(a)}>
                            <CalendarClock className="mr-1 h-3.5 w-3.5" /> Reschedule
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
                        </>
                      )}
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </div>
      </div>

      {/* View details dialog */}
      <Dialog open={!!viewing} onOpenChange={(o) => !o && setViewing(null)}>
        <DialogContent>
          {viewing && (
            <>
              <DialogHeader>
                <DialogTitle>Appointment details</DialogTitle>
                <DialogDescription>Confirmation #{viewing.id}</DialogDescription>
              </DialogHeader>
              {(() => {
                const d = findDoctor(viewing.doctorId);
                return (
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-3 rounded-2xl bg-muted/60 p-3">
                      <img src={d.photo} alt="" className="h-12 w-12 rounded-xl bg-primary-soft object-cover" />
                      <div>
                        <div className="font-semibold">{d.name}</div>
                        <div className="text-xs text-muted-foreground">{d.specialty} · {d.clinic}</div>
                      </div>
                    </div>
                    <DetailRow label="Date" value={prettyDate(viewing.date)} />
                    <DetailRow label="Time" value={viewing.time} />
                    <DetailRow label="Status" value={viewing.status} />
                    <DetailRow label="Reason" value={viewing.reason} />
                    <DetailRow label="Location" value={`${d.clinic} · ${d.location}`} />
                    <DetailRow label="Fee" value={`$${d.fee}`} />
                    {viewing.notes && <DetailRow label="Notes" value={viewing.notes} />}
                  </div>
                );
              })()}
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Reschedule dialog */}
      <Dialog open={!!rescheduling} onOpenChange={(o) => !o && setRescheduling(null)}>
        <DialogContent>
          {rescheduling && (
            <RescheduleForm
              appt={rescheduling}
              onClose={() => setRescheduling(null)}
              onSubmit={(date, time) => {
                rescheduleAppointment(rescheduling.id, date, time);
                toast.success("Appointment rescheduled");
                setRescheduling(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </PatientShell>
  );
}

function StatusBadge({ status }: { status: AppointmentStatus }) {
  const styles: Record<AppointmentStatus, string> = {
    Upcoming: "bg-primary-soft text-primary",
    Completed: "bg-success/15 text-success-foreground",
    Cancelled: "bg-destructive/10 text-destructive",
  };
  return (
    <Badge variant="secondary" className={cn("rounded-full font-medium", styles[status])}>
      {status}
    </Badge>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium">{value}</span>
    </div>
  );
}

function RescheduleForm({
  appt,
  onSubmit,
  onClose,
}: {
  appt: Appointment;
  onSubmit: (date: string, time: string) => void;
  onClose: () => void;
}) {
  const { doctors, availability } = useClinic();
  const doctor = doctors.find((d) => d.id === appt.doctorId)!;
  const [date, setDate] = useState(appt.date);
  const [time, setTime] = useState(appt.time);
  const wd = new Date(date + "T00:00:00").getDay();
  const slots = availability[doctor.id]?.[wd] ?? doctor.defaultSlots;

  return (
    <>
      <DialogHeader>
        <DialogTitle>Reschedule with {doctor.name}</DialogTitle>
        <DialogDescription>Pick a new date &amp; time.</DialogDescription>
      </DialogHeader>
      <div className="space-y-3">
        <div>
          <label className="text-xs uppercase tracking-widest text-muted-foreground">Date</label>
          <input
            type="date"
            value={date}
            min={new Date().toISOString().slice(0, 10)}
            onChange={(e) => setDate(e.target.value)}
            className="mt-1 h-10 w-full rounded-lg border border-input bg-surface px-3 text-sm"
          />
        </div>
        <div>
          <label className="text-xs uppercase tracking-widest text-muted-foreground">Time</label>
          <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-4">
            {slots.length ? slots.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setTime(s)}
                className={cn(
                  "rounded-lg border px-2 py-1.5 text-sm font-medium",
                  time === s ? "border-primary bg-primary text-primary-foreground" : "border-border bg-surface",
                )}
              >
                {s}
              </button>
            )) : <p className="col-span-full text-xs text-muted-foreground">No slots available for this day.</p>}
          </div>
        </div>
      </div>
      <DialogFooter>
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button onClick={() => onSubmit(date, time)} disabled={!date || !time}>Confirm reschedule</Button>
      </DialogFooter>
    </>
  );
}

function prettyDate(iso: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
