import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import {
  INITIAL_APPOINTMENTS,
  INITIAL_AVAILABILITY,
  DOCTORS,
  PATIENTS,
  CURRENT_PATIENT_ID,
  CURRENT_DOCTOR_ID,
  type Appointment,
  type AppointmentStatus,
  type Doctor,
  type Patient,
} from "./mockData";

interface ClinicStore {
  appointments: Appointment[];
  availability: Record<string, Record<number, string[]>>;
  doctors: Doctor[];
  patients: Patient[];
  currentPatientId: string;
  currentDoctorId: string;
  bookAppointment: (a: Omit<Appointment, "id" | "status"> & { status?: AppointmentStatus }) => Appointment;
  updateAppointmentStatus: (id: string, status: AppointmentStatus) => void;
  rescheduleAppointment: (id: string, date: string, time: string) => void;
  toggleSlot: (doctorId: string, weekday: number, slot: string) => void;
  updateDoctor: (id: string, patch: Partial<Doctor>) => void;
  updatePatient: (id: string, patch: Partial<Patient>) => void;
}

const Ctx = createContext<ClinicStore | null>(null);

export function ClinicProvider({ children }: { children: ReactNode }) {
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [availability, setAvailability] = useState(INITIAL_AVAILABILITY);
  const [doctors, setDoctors] = useState<Doctor[]>(DOCTORS);
  const [patients, setPatients] = useState<Patient[]>(PATIENTS);

  const bookAppointment: ClinicStore["bookAppointment"] = useCallback((a) => {
    const created: Appointment = {
      id: `a${Date.now()}`,
      status: a.status ?? "Upcoming",
      doctorId: a.doctorId,
      patientId: a.patientId,
      date: a.date,
      time: a.time,
      reason: a.reason,
      notes: a.notes,
    };
    setAppointments((prev) => [created, ...prev]);
    return created;
  }, []);

  const updateAppointmentStatus = useCallback((id: string, status: AppointmentStatus) => {
    setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
  }, []);

  const rescheduleAppointment = useCallback((id: string, date: string, time: string) => {
    setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, date, time, status: "Upcoming" } : a)));
  }, []);

  const toggleSlot = useCallback((doctorId: string, weekday: number, slot: string) => {
    setAvailability((prev) => {
      const doc = { ...(prev[doctorId] ?? {}) };
      const list = new Set(doc[weekday] ?? []);
      if (list.has(slot)) list.delete(slot);
      else list.add(slot);
      doc[weekday] = Array.from(list).sort();
      return { ...prev, [doctorId]: doc };
    });
  }, []);

  const updateDoctor = useCallback((id: string, patch: Partial<Doctor>) => {
    setDoctors((prev) => prev.map((d) => (d.id === id ? { ...d, ...patch } : d)));
  }, []);

  const updatePatient = useCallback((id: string, patch: Partial<Patient>) => {
    setPatients((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  }, []);

  const value = useMemo<ClinicStore>(
    () => ({
      appointments,
      availability,
      doctors,
      patients,
      currentPatientId: CURRENT_PATIENT_ID,
      currentDoctorId: CURRENT_DOCTOR_ID,
      bookAppointment,
      updateAppointmentStatus,
      rescheduleAppointment,
      toggleSlot,
      updateDoctor,
      updatePatient,
    }),
    [appointments, availability, doctors, patients, bookAppointment, updateAppointmentStatus, rescheduleAppointment, toggleSlot, updateDoctor, updatePatient],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useClinic() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useClinic must be used inside <ClinicProvider>");
  return ctx;
}

export function useDoctor(id: string | undefined) {
  const { doctors } = useClinic();
  return doctors.find((d) => d.id === id);
}

export function usePatient(id: string | undefined) {
  const { patients } = useClinic();
  return patients.find((p) => p.id === id);
}
