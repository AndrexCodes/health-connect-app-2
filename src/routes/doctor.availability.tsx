import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Clock } from "lucide-react";
import { DoctorShell } from "@/components/shells";
import { useClinic, useDoctor } from "@/lib/clinic-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/doctor/availability")({
  head: () => ({ meta: [{ title: "Availability — Medley Clinic" }] }),
  component: AvailabilityPage,
});

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// A full set of possible slots the doctor could opt in/out of.
const ALL_SLOTS = ["08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00"];

function AvailabilityPage() {
  const { currentDoctorId, availability, toggleSlot } = useClinic();
  const doctor = useDoctor(currentDoctorId)!;

  return (
    <DoctorShell
      title="Availability"
      subtitle="Toggle the slots you can offer each weekday. Patients only see enabled times."
    >
      <div className="space-y-4">
        {WEEKDAYS.map((label, wd) => {
          const enabled = new Set(availability[doctor.id]?.[wd] ?? []);
          return (
            <section key={wd} className="rounded-3xl border border-border bg-card p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h2 className="text-base font-semibold">{fullDay(label)}</h2>
                  <p className="text-xs text-muted-foreground">
                    {enabled.size} slot{enabled.size === 1 ? "" : "s"} enabled
                  </p>
                </div>
                {enabled.size === 0 && (
                  <span className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">Day off</span>
                )}
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8">
                {ALL_SLOTS.map((s) => {
                  const on = enabled.has(s);
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => {
                        toggleSlot(doctor.id, wd, s);
                        toast(on ? `Removed ${s} on ${fullDay(label)}` : `Added ${s} on ${fullDay(label)}`);
                      }}
                      className={cn(
                        "flex items-center justify-center gap-1 rounded-xl border px-2 py-2 text-sm font-medium transition-colors",
                        on
                          ? "border-primary bg-primary text-primary-foreground shadow-soft"
                          : "border-border bg-surface text-muted-foreground hover:border-primary/40 hover:text-foreground",
                      )}
                    >
                      <Clock className="h-3 w-3 opacity-70" /> {s}
                    </button>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </DoctorShell>
  );
}

function fullDay(short: string) {
  return {
    Sun: "Sunday", Mon: "Monday", Tue: "Tuesday", Wed: "Wednesday", Thu: "Thursday", Fri: "Friday", Sat: "Saturday",
  }[short] ?? short;
}
