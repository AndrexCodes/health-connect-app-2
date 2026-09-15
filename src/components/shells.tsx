import type { ReactNode } from "react";
import { PatientBottomNav, PatientTopBar } from "@/components/patient-nav";
import { DoctorSidebar, DoctorTopBar, DoctorMobileNav } from "@/components/doctor-nav";

export function PatientShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <PatientTopBar />
      {children}
      <PatientBottomNav />
    </div>
  );
}

export function DoctorShell({
  title,
  subtitle,
  action,
  children,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background lg:pl-64">
      <DoctorSidebar />
      <DoctorMobileNav />
      <DoctorTopBar title={title} subtitle={subtitle} action={action} />
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
    </div>
  );
}
