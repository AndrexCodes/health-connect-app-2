import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Pencil, DollarSign, MapPin, GraduationCap, Languages } from "lucide-react";
import { toast } from "sonner";
import { DoctorShell } from "@/components/shells";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useClinic, useDoctor } from "@/lib/clinic-store";
import { SPECIALTIES, type Specialty } from "@/lib/mockData";

export const Route = createFileRoute("/doctor/profile")({
  head: () => ({ meta: [{ title: "Profile — Medley Clinic" }] }),
  component: DoctorProfile,
});

function DoctorProfile() {
  const { currentDoctorId, updateDoctor } = useClinic();
  const doctor = useDoctor(currentDoctorId)!;
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(doctor);

  const save = () => {
    updateDoctor(doctor.id, draft);
    setEditing(false);
    toast.success("Profile updated");
  };

  return (
    <DoctorShell
      title="My profile"
      subtitle="What patients see when they browse and book with you."
      action={
        editing ? (
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => { setDraft(doctor); setEditing(false); }}>Cancel</Button>
            <Button onClick={save}><Check className="mr-1 h-4 w-4" /> Save changes</Button>
          </div>
        ) : (
          <Button onClick={() => setEditing(true)} variant="outline"><Pencil className="mr-1 h-4 w-4" /> Edit</Button>
        )
      }
    >
      <section className="overflow-hidden rounded-3xl border border-border bg-card">
        <div className="h-24 sm:h-28" style={{ background: "linear-gradient(120deg, oklch(0.58 0.15 245), oklch(0.78 0.13 190))" }} />
        <div className="px-6 pb-6 sm:px-8">
          <div className="-mt-12 flex flex-wrap items-end gap-4">
            <img src={doctor.photo} alt="" className="h-20 w-20 rounded-3xl border-4 border-card bg-primary-soft object-cover" />
            <div className="pb-1">
              <h2 className="text-xl font-bold sm:text-2xl">{doctor.name}</h2>
              <p className="text-sm text-muted-foreground">{doctor.specialty} · {doctor.yearsExperience} yrs</p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <FieldWrap label="Full name">
              {editing ? <Input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} /> : <span>{doctor.name}</span>}
            </FieldWrap>

            <FieldWrap label="Specialty" icon={<GraduationCap className="h-4 w-4" />}>
              {editing ? (
                <Select value={draft.specialty} onValueChange={(v) => setDraft({ ...draft, specialty: v as Specialty })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {SPECIALTIES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              ) : (
                <span>{doctor.specialty}</span>
              )}
            </FieldWrap>

            <FieldWrap label="Consultation fee (USD)" icon={<DollarSign className="h-4 w-4" />}>
              {editing ? (
                <Input type="number" value={draft.fee} onChange={(e) => setDraft({ ...draft, fee: Number(e.target.value) })} />
              ) : (
                <span>${doctor.fee}</span>
              )}
            </FieldWrap>

            <FieldWrap label="Years of experience">
              {editing ? (
                <Input type="number" value={draft.yearsExperience} onChange={(e) => setDraft({ ...draft, yearsExperience: Number(e.target.value) })} />
              ) : (
                <span>{doctor.yearsExperience} years</span>
              )}
            </FieldWrap>

            <FieldWrap label="Clinic" icon={<MapPin className="h-4 w-4" />}>
              {editing ? <Input value={draft.clinic} onChange={(e) => setDraft({ ...draft, clinic: e.target.value })} /> : <span>{doctor.clinic}</span>}
            </FieldWrap>

            <FieldWrap label="Location" icon={<MapPin className="h-4 w-4" />}>
              {editing ? <Input value={draft.location} onChange={(e) => setDraft({ ...draft, location: e.target.value })} /> : <span>{doctor.location}</span>}
            </FieldWrap>

            <FieldWrap label="Languages" icon={<Languages className="h-4 w-4" />}>
              {editing ? (
                <Input
                  value={draft.languages.join(", ")}
                  onChange={(e) => setDraft({ ...draft, languages: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })}
                />
              ) : (
                <span>{doctor.languages.join(", ")}</span>
              )}
            </FieldWrap>

            <FieldWrap label="Qualifications (one per line)">
              {editing ? (
                <Textarea
                  value={draft.qualifications.join("\n")}
                  onChange={(e) => setDraft({ ...draft, qualifications: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean) })}
                  className="min-h-24"
                />
              ) : (
                <ul className="list-disc pl-5">
                  {doctor.qualifications.map((q) => <li key={q}>{q}</li>)}
                </ul>
              )}
            </FieldWrap>
          </div>

          <div className="mt-4">
            <FieldWrap label="Bio">
              {editing ? (
                <Textarea value={draft.bio} onChange={(e) => setDraft({ ...draft, bio: e.target.value })} className="min-h-28" />
              ) : (
                <p className="text-sm leading-relaxed">{doctor.bio}</p>
              )}
            </FieldWrap>
          </div>
        </div>
      </section>
    </DoctorShell>
  );
}

function FieldWrap({ label, icon, children }: { label: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <Label className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
        {icon} {label}
      </Label>
      <div className="mt-2 text-sm font-medium">{children}</div>
    </div>
  );
}
