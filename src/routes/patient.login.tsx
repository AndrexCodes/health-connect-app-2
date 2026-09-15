import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Mail, Phone, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/patient/login")({
  head: () => ({ meta: [{ title: "Patient sign in — Medley" }] }),
  component: PatientLogin,
});

function PatientLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("alex.morgan@example.com");
  const [phone, setPhone] = useState("");

  return (
    <main className="grid min-h-screen bg-background md:grid-cols-2">
      <aside
        className="relative hidden overflow-hidden p-10 text-primary-foreground md:flex md:flex-col md:justify-between"
        style={{ backgroundColor: "oklch(0.58 0.15 245)" }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(600px 400px at 20% 20%, oklch(1 0 0 / 0.18), transparent), radial-gradient(500px 400px at 90% 90%, oklch(0.9 0.13 190 / 0.35), transparent)",
          }}
        />
        <Link to="/" className="relative inline-flex items-center gap-2 text-sm font-medium opacity-90 hover:opacity-100">
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>
        <div className="relative">
          <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
            Feel better,<br />sooner.
          </h1>
          <p className="mt-4 max-w-sm text-sm text-primary-foreground/85">
            Book trusted doctors, manage every visit, and keep your care in one calm place.
          </p>
          <div className="mt-8 flex items-center gap-2 rounded-2xl bg-white/10 p-4 text-sm backdrop-blur">
            <ShieldCheck className="h-5 w-5 shrink-0" />
            <span>Demo mode — no real credentials required.</span>
          </div>
        </div>
      </aside>

      <section className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-sm">
          <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground md:hidden">
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
          <h2 className="text-2xl font-bold tracking-tight">Welcome back</h2>
          <p className="mt-1 text-sm text-muted-foreground">Sign in to continue as a patient.</p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              navigate({ to: "/patient" });
            }}
            className="mt-8 space-y-4"
          >
            <div>
              <Label htmlFor="email">Email</Label>
              <div className="relative mt-1.5">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="h-11 pl-9" />
              </div>
            </div>
            <div>
              <Label htmlFor="phone">Phone (optional)</Label>
              <div className="relative mt-1.5">
                <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 (555) 000-0000" className="h-11 pl-9" />
              </div>
            </div>
            <Button type="submit" className="h-11 w-full text-base">Continue</Button>
            <p className="text-center text-xs text-muted-foreground">
              Are you a clinician?{" "}
              <Link to="/doctor/login" className="font-medium text-primary hover:underline">
                Doctor sign in
              </Link>
            </p>
          </form>
        </div>
      </section>
    </main>
  );
}
