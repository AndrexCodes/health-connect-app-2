import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { MapPin, Search, Star, Filter, Clock, ArrowRight, HeartPulse } from "lucide-react";
import { PatientShell } from "@/components/shells";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useClinic, usePatient } from "@/lib/clinic-store";
import { SPECIALTIES, type Doctor } from "@/lib/mockData";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/patient/")({
  head: () => ({ meta: [{ title: "Find a doctor — Medley" }] }),
  component: PatientHome,
});

function PatientHome() {
  const { doctors, currentPatientId } = useClinic();
  const me = usePatient(currentPatientId);
  const [query, setQuery] = useState("");
  const [specialty, setSpecialty] = useState<string>("All");
  const [location, setLocation] = useState("");
  const [onlyToday, setOnlyToday] = useState(false);

  const filtered = useMemo(() => {
    return doctors.filter((d) => {
      if (specialty !== "All" && d.specialty !== specialty) return false;
      if (query && !`${d.name} ${d.specialty} ${d.clinic}`.toLowerCase().includes(query.toLowerCase())) return false;
      if (location && !d.location.toLowerCase().includes(location.toLowerCase())) return false;
      if (onlyToday && d.defaultSlots.length < 4) return false;
      return true;
    });
  }, [doctors, query, specialty, location, onlyToday]);

  return (
    <PatientShell>
      <section className="mx-auto max-w-6xl px-4 pt-6 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl bg-primary p-6 text-primary-foreground sm:p-10">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(500px 300px at 90% 0%, oklch(0.9 0.13 190 / 0.35), transparent), radial-gradient(500px 300px at 10% 100%, oklch(1 0 0 / 0.15), transparent)",
            }}
          />
          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur">
                <HeartPulse className="h-3.5 w-3.5" /> Hi{me ? `, ${me.name.split(" ")[0]}` : ""}
              </span>
              <h1 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl">Find the right doctor for you.</h1>
              <p className="mt-2 max-w-md text-sm text-primary-foreground/85">
                Browse specialists, compare reviews, and book a visit in under a minute.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-col sm:items-end">
              <MiniStat label="Doctors" value={doctors.length.toString()} />
              <MiniStat label="Specialties" value={SPECIALTIES.length.toString()} />
            </div>
          </div>

          <div className="relative mt-6 grid gap-2 rounded-2xl bg-white/95 p-2 shadow-lift sm:grid-cols-[1.4fr_1fr_auto]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search doctors, clinics, symptoms"
                className="h-11 border-transparent bg-transparent pl-9 text-foreground placeholder:text-muted-foreground focus-visible:ring-0"
              />
            </div>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="City, state, or ZIP"
                className="h-11 border-transparent bg-transparent pl-9 text-foreground placeholder:text-muted-foreground focus-visible:ring-0"
              />
            </div>
            <Button className="h-11 gap-2 px-6">
              <Search className="h-4 w-4" /> Search
            </Button>
          </div>
        </div>
      </section>

      {/* Filter chips */}
      <section className="mx-auto mt-6 max-w-6xl px-4 sm:px-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-widest text-muted-foreground">
            <Filter className="h-3.5 w-3.5" /> Filter
          </span>
          <Chip active={specialty === "All"} onClick={() => setSpecialty("All")}>
            All
          </Chip>
          {SPECIALTIES.map((s) => (
            <Chip key={s} active={specialty === s} onClick={() => setSpecialty(s)}>
              {s}
            </Chip>
          ))}
          <Chip active={onlyToday} onClick={() => setOnlyToday((v) => !v)}>
            <Clock className="mr-1 inline h-3 w-3" /> Available today
          </Chip>
        </div>
      </section>

      {/* Results */}
      <section className="mx-auto mt-6 max-w-6xl px-4 pb-10 sm:px-6">
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="text-lg font-semibold">
            {filtered.length} {filtered.length === 1 ? "doctor" : "doctors"} found
          </h2>
          <span className="text-xs text-muted-foreground">Sorted by rating</span>
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            title="No doctors match your filters"
            description="Try clearing the specialty or location filter to see more results."
            action={
              <Button
                variant="outline"
                onClick={() => {
                  setQuery("");
                  setSpecialty("All");
                  setLocation("");
                  setOnlyToday(false);
                }}
              >
                Clear filters
              </Button>
            }
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[...filtered].sort((a, b) => b.rating - a.rating).map((d) => (
              <DoctorCard key={d.id} doctor={d} />
            ))}
          </div>
        )}
      </section>
    </PatientShell>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/10 px-4 py-3 text-right backdrop-blur">
      <div className="text-2xl font-bold leading-none">{value}</div>
      <div className="mt-1 text-[11px] uppercase tracking-widest text-primary-foreground/75">{label}</div>
    </div>
  );
}

function Chip({ active, onClick, children }: { active?: boolean; onClick?: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-surface text-muted-foreground hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}

function DoctorCard({ doctor }: { doctor: Doctor }) {
  const nextSlot = doctor.defaultSlots[0];
  return (
    <Link
      to="/patient/doctor/$doctorId"
      params={{ doctorId: doctor.id }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:shadow-lift"
    >
      <div className="flex items-start gap-4">
        <div className="relative">
          <img src={doctor.photo} alt="" className="h-16 w-16 rounded-2xl bg-primary-soft object-cover" />
          <span className="absolute -bottom-1 -right-1 grid h-5 w-5 place-items-center rounded-full border-2 border-card bg-success text-[10px] text-success-foreground">
            ●
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="truncate text-base font-semibold">{doctor.name}</h3>
            <span className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-warning/15 px-2 py-0.5 text-xs font-medium text-warning-foreground">
              <Star className="h-3 w-3 fill-current text-warning" /> {doctor.rating.toFixed(1)}
            </span>
          </div>
          <Badge variant="secondary" className="mt-1 rounded-full bg-primary-soft text-primary hover:bg-primary-soft">
            {doctor.specialty}
          </Badge>
          <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" /> {doctor.location}
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-2 rounded-xl bg-muted/60 px-3 py-2 text-xs">
        <div className="flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5 text-primary" />
          <span className="font-medium">Next: today {nextSlot}</span>
        </div>
        <span className="font-semibold text-foreground">${doctor.fee}</span>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm">
        <span className="text-xs text-muted-foreground">{doctor.yearsExperience} yrs experience</span>
        <span className="inline-flex items-center gap-1 font-semibold text-primary">
          Book <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="grid place-items-center rounded-3xl border border-dashed border-border bg-surface/60 px-6 py-16 text-center">
      <div className="grid h-14 w-14 place-items-center rounded-2xl bg-primary-soft text-primary">
        <Search className="h-6 w-6" />
      </div>
      <h3 className="mt-4 text-base font-semibold">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
