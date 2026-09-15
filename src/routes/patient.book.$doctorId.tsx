import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Calendar as CalendarIcon, Check, Clock, CreditCard, MapPin } from "lucide-react";
import { toast } from "sonner";
import { PatientShell } from "@/components/shells";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useClinic, useDoctor, usePatient } from "@/lib/clinic-store";
import { REASONS } from "@/lib/mockData";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/patient/book/$doctorId")({
  head: () => ({ meta: [{ title: "Book appointment — Medley" }] }),
  component: BookAppointment,
});

type Step = 1 | 2 | 3 | 4;

function BookAppointment() {
  const { doctorId } = Route.useParams();
  const navigate = useNavigate();
  const doctor = useDoctor(doctorId);
  const { currentPatientId, availability, bookAppointment } = useClinic();
  const patient = usePatient(currentPatientId);
  if (!doctor) throw notFound();

  const [step, setStep] = useState<Step>(1);
  const [date, setDate] = useState<string>("");
  const [time, setTime] = useState<string>("");
  const [reason, setReason] = useState<string>(REASONS[0]);
  const [notes, setNotes] = useState("");

  const days = useMemo(() => nextDays(14), []);
  const slots = useMemo(() => {
    if (!date) return [];
    const wd = new Date(date + "T00:00:00").getDay();
    return availability[doctor.id]?.[wd] ?? [];
  }, [date, availability, doctor.id]);

  const canNext = (step === 1 && !!date && !!time) || (step === 2 && !!reason) || step === 3;

  const handleConfirm = () => {
    const appt = bookAppointment({
      doctorId: doctor.id,
      patientId: currentPatientId,
      date,
      time,
      reason,
      notes,
    });
    toast.success("Appointment booked", { description: `${doctor.name} · ${prettyDate(date)} at ${time}` });
    setStep(4);
    // no navigation — show success screen
    void appt;
  };

  return (
    <PatientShell>
      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
        <Link to="/patient/doctor/$doctorId" params={{ doctorId: doctor.id }} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to profile
        </Link>

        <div className="mt-4 rounded-2xl border border-border bg-card p-4 sm:p-5">
          <div className="flex items-center gap-4">
            <img src={doctor.photo} alt="" className="h-14 w-14 rounded-2xl bg-primary-soft object-cover" />
            <div className="min-w-0 flex-1">
              <div className="truncate text-base font-semibold">{doctor.name}</div>
              <div className="truncate text-xs text-muted-foreground">
                {doctor.specialty} · {doctor.clinic}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs uppercase tracking-widest text-muted-foreground">Fee</div>
              <div className="text-lg font-bold">${doctor.fee}</div>
            </div>
          </div>
        </div>

        <Stepper step={step} />

        {step === 1 && (
          <section className="mt-6 rounded-3xl border border-border bg-card p-5 sm:p-8">
            <h2 className="text-lg font-semibold">Pick a date &amp; time</h2>
            <p className="mt-1 text-sm text-muted-foreground">Slots reflect Dr. {doctor.name.split(" ").pop()}&rsquo;s current availability.</p>

            <div className="mt-5">
              <Label className="text-xs uppercase tracking-widest text-muted-foreground">Date</Label>
              <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
                {days.map((d) => {
                  const key = d.iso;
                  const selected = date === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => {
                        setDate(key);
                        setTime("");
                      }}
                      className={cn(
                        "flex min-w-[76px] flex-col items-center rounded-2xl border px-3 py-3 text-center transition-colors",
                        selected
                          ? "border-primary bg-primary text-primary-foreground shadow-soft"
                          : "border-border bg-surface hover:border-primary/40",
                      )}
                    >
                      <span className={cn("text-[11px] uppercase tracking-widest", selected ? "text-primary-foreground/85" : "text-muted-foreground")}>
                        {d.wd}
                      </span>
                      <span className="mt-1 text-lg font-bold">{d.day}</span>
                      <span className={cn("text-[11px]", selected ? "text-primary-foreground/85" : "text-muted-foreground")}>{d.month}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-6">
              <Label className="text-xs uppercase tracking-widest text-muted-foreground">Time</Label>
              {date ? (
                slots.length ? (
                  <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-5">
                    {slots.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setTime(s)}
                        className={cn(
                          "rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors",
                          time === s
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-surface hover:border-primary/40",
                        )}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="mt-3 rounded-xl bg-muted/60 p-4 text-sm text-muted-foreground">
                    No availability for this day. Try a different date.
                  </p>
                )
              ) : (
                <p className="mt-3 rounded-xl bg-muted/60 p-4 text-sm text-muted-foreground">
                  Choose a date to see available times.
                </p>
              )}
            </div>
          </section>
        )}

        {step === 2 && (
          <section className="mt-6 rounded-3xl border border-border bg-card p-5 sm:p-8">
            <h2 className="text-lg font-semibold">Reason for visit</h2>
            <p className="mt-1 text-sm text-muted-foreground">This helps the doctor prepare for your appointment.</p>

            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              {REASONS.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setReason(r)}
                  className={cn(
                    "rounded-xl border px-4 py-3 text-left text-sm font-medium transition-colors",
                    reason === r ? "border-primary bg-primary-soft text-primary" : "border-border bg-surface hover:border-primary/40",
                  )}
                >
                  {r}
                </button>
              ))}
            </div>

            <div className="mt-6">
              <Label htmlFor="notes">Additional notes (optional)</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Symptoms, allergies, anything the doctor should know…"
                className="mt-2 min-h-24"
              />
            </div>
          </section>
        )}

        {step === 3 && (
          <section className="mt-6 rounded-3xl border border-border bg-card p-5 sm:p-8">
            <h2 className="text-lg font-semibold">Confirm details</h2>
            <p className="mt-1 text-sm text-muted-foreground">Review your appointment before booking.</p>

            <dl className="mt-6 divide-y divide-border rounded-2xl border border-border bg-surface">
              <Row label="Patient" value={patient?.name ?? "—"} />
              <Row label="Doctor" value={`${doctor.name} · ${doctor.specialty}`} />
              <Row icon={<CalendarIcon className="h-4 w-4" />} label="Date" value={prettyDate(date)} />
              <Row icon={<Clock className="h-4 w-4" />} label="Time" value={time} />
              <Row label="Reason" value={reason} />
              <Row icon={<MapPin className="h-4 w-4" />} label="Location" value={`${doctor.clinic} · ${doctor.location}`} />
              <Row icon={<CreditCard className="h-4 w-4" />} label="Fee" value={`$${doctor.fee}`} />
              {notes && <Row label="Notes" value={notes} />}
            </dl>
          </section>
        )}

        {step === 4 && (
          <section className="mt-6 rounded-3xl border border-border bg-card p-8 text-center">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-success/15 text-success">
              <Check className="h-8 w-8" />
            </div>
            <h2 className="mt-4 text-2xl font-bold">You&rsquo;re booked!</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              We&rsquo;ve confirmed your visit with {doctor.name} on {prettyDate(date)} at {time}.
            </p>

            <div className="mx-auto mt-6 max-w-md rounded-2xl bg-muted/60 p-4 text-left text-sm">
              <div className="flex items-center gap-3">
                <img src={doctor.photo} alt="" className="h-12 w-12 rounded-xl bg-primary-soft object-cover" />
                <div>
                  <div className="font-semibold">{doctor.name}</div>
                  <div className="text-xs text-muted-foreground">{doctor.clinic}</div>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                <div className="rounded-xl bg-surface p-2">
                  <div className="uppercase tracking-widest">Date</div>
                  <div className="mt-0.5 text-sm font-semibold text-foreground">{prettyDate(date)}</div>
                </div>
                <div className="rounded-xl bg-surface p-2">
                  <div className="uppercase tracking-widest">Time</div>
                  <div className="mt-0.5 text-sm font-semibold text-foreground">{time}</div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row">
              <Button asChild size="lg">
                <Link to="/patient/appointments">View my appointments</Link>
              </Button>
              <Button asChild size="lg" variant="outline" onClick={() => navigate({ to: "/patient" })}>
                <Link to="/patient">Back to home</Link>
              </Button>
            </div>
          </section>
        )}

        {step !== 4 && (
          <div className="mt-6 flex items-center justify-between gap-2">
            <Button variant="ghost" onClick={() => (step === 1 ? navigate({ to: "/patient/doctor/$doctorId", params: { doctorId: doctor.id } }) : setStep((step - 1) as Step))}>
              <ArrowLeft className="mr-1 h-4 w-4" /> Back
            </Button>
            {step < 3 ? (
              <Button disabled={!canNext} onClick={() => setStep((step + 1) as Step)} size="lg">
                Continue <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleConfirm} size="lg">
                Confirm booking <Check className="ml-1 h-4 w-4" />
              </Button>
            )}
          </div>
        )}
      </div>
    </PatientShell>
  );
}

function Row({ icon, label, value }: { icon?: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 px-4 py-3 text-sm">
      <dt className="flex items-center gap-2 text-muted-foreground">
        {icon}
        {label}
      </dt>
      <dd className="max-w-[65%] text-right font-medium">{value}</dd>
    </div>
  );
}

function Stepper({ step }: { step: Step }) {
  const steps = ["Date & time", "Reason", "Confirm", "Done"] as const;
  return (
    <ol className="mt-6 flex items-center gap-2 text-xs">
      {steps.map((label, i) => {
        const idx = (i + 1) as Step;
        const active = step === idx;
        const done = step > idx;
        return (
          <li key={label} className="flex flex-1 items-center gap-2">
            <span
              className={cn(
                "grid h-7 w-7 shrink-0 place-items-center rounded-full text-[11px] font-semibold transition-colors",
                done
                  ? "bg-success text-success-foreground"
                  : active
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground",
              )}
            >
              {done ? <Check className="h-3.5 w-3.5" /> : idx}
            </span>
            <span className={cn("hidden truncate font-medium sm:inline", active ? "text-foreground" : "text-muted-foreground")}>
              {label}
            </span>
            {i < steps.length - 1 && <span className="h-px flex-1 bg-border" />}
          </li>
        );
      })}
    </ol>
  );
}

function nextDays(count: number) {
  const out: { iso: string; day: string; wd: string; month: string }[] = [];
  const now = new Date();
  for (let i = 0; i < count; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    out.push({
      iso: d.toISOString().slice(0, 10),
      day: d.getDate().toString().padStart(2, "0"),
      wd: d.toLocaleDateString(undefined, { weekday: "short" }),
      month: d.toLocaleDateString(undefined, { month: "short" }),
    });
  }
  return out;
}

function prettyDate(iso: string) {
  if (!iso) return "";
  return new Date(iso + "T00:00:00").toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}
