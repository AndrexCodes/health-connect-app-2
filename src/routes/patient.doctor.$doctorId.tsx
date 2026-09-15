import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, MapPin, Star, GraduationCap, Languages, CalendarCheck, ArrowRight } from "lucide-react";
import { PatientShell } from "@/components/shells";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useDoctor } from "@/lib/clinic-store";

export const Route = createFileRoute("/patient/doctor/$doctorId")({
  head: ({ params }) => ({ meta: [{ title: `Doctor · Medley` }, { name: "og:title", content: `Doctor profile — Medley (${params.doctorId})` }] }),
  component: DoctorProfile,
  notFoundComponent: () => (
    <PatientShell>
      <div className="mx-auto max-w-md px-6 py-24 text-center">
        <h1 className="text-2xl font-semibold">Doctor not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">Try browsing other specialists.</p>
        <Button asChild className="mt-6">
          <Link to="/patient">Back to discovery</Link>
        </Button>
      </div>
    </PatientShell>
  ),
});

function DoctorProfile() {
  const { doctorId } = Route.useParams();
  const doctor = useDoctor(doctorId);
  if (!doctor) throw notFound();

  return (
    <PatientShell>
      <div className="mx-auto max-w-6xl px-4 pt-6 sm:px-6">
        <Link to="/patient" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to search
        </Link>
      </div>

      <div className="mx-auto mt-4 grid max-w-6xl gap-6 px-4 pb-10 sm:px-6 lg:grid-cols-[1.6fr_1fr]">
        {/* Left column */}
        <div className="space-y-6">
          <section className="overflow-hidden rounded-3xl border border-border bg-card">
            <div
              className="h-28 sm:h-36"
              style={{
                background:
                  "linear-gradient(120deg, oklch(0.58 0.15 245), oklch(0.78 0.13 190))",
              }}
            />
            <div className="p-6 sm:p-8">
              <div className="-mt-16 flex flex-wrap items-end justify-between gap-4">
                <div className="flex items-end gap-4">
                  <img
                    src={doctor.photo}
                    alt=""
                    className="h-24 w-24 rounded-3xl border-4 border-card bg-primary-soft object-cover shadow-soft"
                  />
                  <div className="pb-1">
                    <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{doctor.name}</h1>
                    <p className="text-sm text-muted-foreground">
                      {doctor.specialty} · {doctor.yearsExperience} years experience
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-lg bg-warning/15 px-2.5 py-1 text-sm font-semibold text-warning-foreground">
                    <Star className="h-4 w-4 fill-current text-warning" /> {doctor.rating.toFixed(1)}
                  </span>
                  <span className="text-xs text-muted-foreground">({doctor.reviewsCount} reviews)</span>
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <InfoTile icon={<MapPin className="h-4 w-4" />} label="Clinic" value={doctor.clinic} sub={doctor.location} />
                <InfoTile icon={<GraduationCap className="h-4 w-4" />} label="Qualifications" value={doctor.qualifications[0]} sub={`+${doctor.qualifications.length - 1} more`} />
                <InfoTile icon={<Languages className="h-4 w-4" />} label="Languages" value={doctor.languages.join(", ")} />
              </div>

              <div className="mt-6">
                <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">About</h2>
                <p className="mt-2 text-sm leading-relaxed text-foreground">{doctor.bio}</p>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                {doctor.qualifications.map((q) => (
                  <Badge key={q} variant="secondary" className="rounded-full">{q}</Badge>
                ))}
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-border bg-card p-6 sm:p-8">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Patient reviews</h2>
              <span className="text-sm text-muted-foreground">{doctor.reviewsCount} verified visits</span>
            </div>
            <div className="space-y-4">
              {doctor.reviews.map((r) => (
                <div key={r.author} className="rounded-2xl bg-muted/60 p-4">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{r.author}</div>
                    <div className="inline-flex items-center gap-1 text-sm text-warning-foreground">
                      {Array.from({ length: r.rating }).map((_, i) => (
                        <Star key={i} className="h-3.5 w-3.5 fill-current text-warning" />
                      ))}
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{r.text}</p>
                  <div className="mt-1 text-xs text-muted-foreground">{r.date}</div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right column — book */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <section className="rounded-3xl border border-border bg-card p-6 shadow-soft">
            <div className="flex items-baseline justify-between">
              <div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground">Consultation fee</div>
                <div className="mt-1 text-3xl font-bold tracking-tight">${doctor.fee}</div>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-success/15 px-3 py-1 text-xs font-medium text-success-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-success" /> Accepting new
              </span>
            </div>

            <div className="mt-4 rounded-2xl bg-primary-soft p-4 text-sm text-primary">
              <div className="flex items-center gap-2 font-medium">
                <CalendarCheck className="h-4 w-4" />
                Next available: <span className="font-semibold">today at {doctor.defaultSlots[0]}</span>
              </div>
              <p className="mt-1 text-xs text-primary/80">
                Choose a date and time on the booking screen.
              </p>
            </div>

            <Button asChild size="lg" className="mt-5 h-12 w-full text-base">
              <Link to="/patient/book/$doctorId" params={{ doctorId: doctor.id }}>
                Book appointment <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>

            <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs text-muted-foreground">
              <div className="rounded-xl bg-muted/60 p-2">
                <div className="text-sm font-semibold text-foreground">{doctor.yearsExperience}+</div>
                yrs
              </div>
              <div className="rounded-xl bg-muted/60 p-2">
                <div className="text-sm font-semibold text-foreground">{doctor.rating.toFixed(1)}</div>
                rating
              </div>
              <div className="rounded-xl bg-muted/60 p-2">
                <div className="text-sm font-semibold text-foreground">{doctor.reviewsCount}</div>
                reviews
              </div>
            </div>
          </section>
        </aside>
      </div>
    </PatientShell>
  );
}

function InfoTile({ icon, label, value, sub }: { icon: React.ReactNode; label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-2xl bg-muted/60 p-4">
      <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
        {icon} {label}
      </div>
      <div className="mt-1 truncate text-sm font-semibold">{value}</div>
      {sub && <div className="truncate text-xs text-muted-foreground">{sub}</div>}
    </div>
  );
}
