import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Mail, Lock, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/doctor/login")({
  head: () => ({ meta: [{ title: "Doctor sign in — Medley" }] }),
  component: DoctorLogin,
});

function DoctorLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("amelia.chen@medley.health");
  const [password, setPassword] = useState("••••••••");

  return (
    <main className="grid min-h-screen bg-background md:grid-cols-2">
      <section className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-sm">
          <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
          <h2 className="text-2xl font-bold tracking-tight">Clinician portal</h2>
          <p className="mt-1 text-sm text-muted-foreground">Sign in to your Medley practice.</p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              navigate({ to: "/doctor" });
            }}
            className="mt-8 space-y-4"
          >
            <div>
              <Label htmlFor="email">Work email</Label>
              <div className="relative mt-1.5">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="h-11 pl-9" />
              </div>
            </div>
            <div>
              <Label htmlFor="pw">Password</Label>
              <div className="relative mt-1.5">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="pw" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="h-11 pl-9" />
              </div>
            </div>
            <Button type="submit" className="h-11 w-full text-base">Sign in</Button>
            <p className="text-center text-xs text-muted-foreground">
              Are you a patient?{" "}
              <Link to="/patient/login" className="font-medium text-primary hover:underline">
                Patient sign in
              </Link>
            </p>
          </form>
        </div>
      </section>

      <aside
        className="relative hidden overflow-hidden p-10 text-primary-foreground md:flex md:flex-col md:justify-between"
        style={{ backgroundColor: "oklch(0.4 0.12 245)" }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(500px 400px at 90% 10%, oklch(0.9 0.13 190 / 0.4), transparent), radial-gradient(600px 500px at 10% 100%, oklch(1 0 0 / 0.12), transparent)",
          }}
        />
        <div className="relative ml-auto">
          <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur">Clinician workspace</span>
        </div>
        <div className="relative">
          <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
            One workspace<br />for the whole practice.
          </h1>
          <p className="mt-4 max-w-sm text-sm text-primary-foreground/85">
            Schedules, availability, patient details, and profile management — designed for the pace of clinical work.
          </p>
          <div className="mt-8 flex items-center gap-2 rounded-2xl bg-white/10 p-4 text-sm backdrop-blur">
            <ShieldCheck className="h-5 w-5 shrink-0" />
            <span>Demo mode — no real credentials required.</span>
          </div>
        </div>
      </aside>
    </main>
  );
}
