// Central mock data for the Doctor Appointment Booking prototype.
// All data lives here — edit freely to extend the demo.

export type Specialty =
  | "Cardiology"
  | "Dermatology"
  | "Pediatrics"
  | "Dentistry"
  | "General Physician"
  | "Neurology"
  | "Orthopedics";

export const SPECIALTIES: Specialty[] = [
  "General Physician",
  "Cardiology",
  "Dermatology",
  "Pediatrics",
  "Dentistry",
  "Neurology",
  "Orthopedics",
];

export interface Review {
  author: string;
  rating: number;
  text: string;
  date: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: Specialty;
  photo: string;
  rating: number;
  reviewsCount: number;
  yearsExperience: number;
  clinic: string;
  location: string;
  fee: number;
  bio: string;
  qualifications: string[];
  languages: string[];
  reviews: Review[];
  /** hours in HH:MM 24h format */
  defaultSlots: string[];
}

const photo = (seed: string) =>
  `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(seed)}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;

export const DOCTORS: Doctor[] = [
  {
    id: "d1",
    name: "Dr. Amelia Chen",
    specialty: "Cardiology",
    photo: photo("Amelia Chen"),
    rating: 4.9,
    reviewsCount: 218,
    yearsExperience: 12,
    clinic: "Bayview Heart Institute",
    location: "San Francisco, CA",
    fee: 180,
    bio: "Board-certified cardiologist specializing in preventive cardiology and heart failure management. Passionate about patient education and long-term wellness.",
    qualifications: ["MD, Stanford University", "Cardiology Fellowship, UCSF", "FACC Certified"],
    languages: ["English", "Mandarin"],
    reviews: [
      { author: "Sarah M.", rating: 5, text: "Dr. Chen was incredibly thorough and reassuring.", date: "2 weeks ago" },
      { author: "James P.", rating: 5, text: "Best cardiologist I've ever seen. Highly recommend.", date: "1 month ago" },
      { author: "Nia K.", rating: 4, text: "Great experience, wait time was a bit long.", date: "2 months ago" },
    ],
    defaultSlots: ["09:00", "09:30", "10:00", "11:00", "14:00", "14:30", "15:00", "16:00"],
  },
  {
    id: "d2",
    name: "Dr. Marcus Reid",
    specialty: "Dermatology",
    photo: photo("Marcus Reid"),
    rating: 4.8,
    reviewsCount: 156,
    yearsExperience: 9,
    clinic: "Clearskin Dermatology",
    location: "Austin, TX",
    fee: 140,
    bio: "Dermatologist with focus on adult acne, skin cancer screening, and cosmetic dermatology.",
    qualifications: ["MD, Johns Hopkins", "Dermatology Residency, Mayo Clinic"],
    languages: ["English", "Spanish"],
    reviews: [
      { author: "Priya R.", rating: 5, text: "Really listened to my concerns.", date: "1 week ago" },
      { author: "Tom L.", rating: 5, text: "Fixed a stubborn issue no one else could.", date: "3 weeks ago" },
    ],
    defaultSlots: ["08:30", "09:00", "10:30", "11:00", "13:00", "15:30", "16:00", "16:30"],
  },
  {
    id: "d3",
    name: "Dr. Priya Patel",
    specialty: "Pediatrics",
    photo: photo("Priya Patel"),
    rating: 5.0,
    reviewsCount: 342,
    yearsExperience: 15,
    clinic: "Little Steps Pediatrics",
    location: "Seattle, WA",
    fee: 120,
    bio: "Pediatrician devoted to the health of children from birth through adolescence. Gentle, patient, and thorough.",
    qualifications: ["MD, University of Washington", "Board Certified Pediatrician"],
    languages: ["English", "Hindi", "Gujarati"],
    reviews: [
      { author: "Rachel G.", rating: 5, text: "My kids love Dr. Patel!", date: "3 days ago" },
      { author: "David H.", rating: 5, text: "Kind, calm, and knowledgeable.", date: "2 weeks ago" },
    ],
    defaultSlots: ["09:00", "09:30", "10:00", "10:30", "11:00", "14:00", "14:30", "15:00", "15:30"],
  },
  {
    id: "d4",
    name: "Dr. Ethan Walker",
    specialty: "Dentistry",
    photo: photo("Ethan Walker"),
    rating: 4.7,
    reviewsCount: 189,
    yearsExperience: 8,
    clinic: "Bright Smile Dental",
    location: "Denver, CO",
    fee: 95,
    bio: "General dentist offering cleanings, cosmetic dentistry, and family dental care in a calm, modern practice.",
    qualifications: ["DDS, University of Colorado", "Invisalign Certified"],
    languages: ["English"],
    reviews: [
      { author: "Lena B.", rating: 5, text: "Zero pain, great chairside manner.", date: "1 week ago" },
      { author: "Kyle S.", rating: 4, text: "Very professional office.", date: "1 month ago" },
    ],
    defaultSlots: ["08:00", "08:30", "09:00", "10:00", "13:00", "13:30", "14:00", "15:00"],
  },
  {
    id: "d5",
    name: "Dr. Sofia Alvarez",
    specialty: "General Physician",
    photo: photo("Sofia Alvarez"),
    rating: 4.9,
    reviewsCount: 401,
    yearsExperience: 18,
    clinic: "Downtown Family Clinic",
    location: "Chicago, IL",
    fee: 90,
    bio: "Family physician providing comprehensive primary care with an emphasis on preventive medicine.",
    qualifications: ["MD, Northwestern University", "Board Certified Family Medicine"],
    languages: ["English", "Spanish"],
    reviews: [
      { author: "Anna V.", rating: 5, text: "Dr. Alvarez has been our family doctor for years.", date: "5 days ago" },
      { author: "Mike D.", rating: 5, text: "Thoughtful and never rushed.", date: "2 weeks ago" },
    ],
    defaultSlots: ["08:00", "08:30", "09:00", "09:30", "10:00", "11:00", "14:00", "14:30", "15:00", "16:00"],
  },
  {
    id: "d6",
    name: "Dr. Jordan Ellis",
    specialty: "Neurology",
    photo: photo("Jordan Ellis"),
    rating: 4.8,
    reviewsCount: 134,
    yearsExperience: 11,
    clinic: "Northside Neuroscience",
    location: "Boston, MA",
    fee: 220,
    bio: "Neurologist specializing in migraine, epilepsy, and movement disorders.",
    qualifications: ["MD, Harvard Medical School", "Neurology Fellowship, MGH"],
    languages: ["English", "French"],
    reviews: [
      { author: "Grace T.", rating: 5, text: "Finally got answers about my headaches.", date: "1 month ago" },
    ],
    defaultSlots: ["10:00", "10:30", "11:00", "13:30", "14:00", "15:00", "15:30"],
  },
  {
    id: "d7",
    name: "Dr. Ravi Kapoor",
    specialty: "Orthopedics",
    photo: photo("Ravi Kapoor"),
    rating: 4.6,
    reviewsCount: 97,
    yearsExperience: 14,
    clinic: "Peak Orthopedic Center",
    location: "Portland, OR",
    fee: 165,
    bio: "Orthopedic surgeon focused on sports injuries and joint replacement.",
    qualifications: ["MD, UCLA", "Orthopedic Surgery Residency, HSS"],
    languages: ["English", "Hindi"],
    reviews: [
      { author: "Marco L.", rating: 5, text: "Got me back to running after my knee injury.", date: "3 weeks ago" },
    ],
    defaultSlots: ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00"],
  },
  {
    id: "d8",
    name: "Dr. Naomi Bright",
    specialty: "Dermatology",
    photo: photo("Naomi Bright"),
    rating: 4.9,
    reviewsCount: 223,
    yearsExperience: 10,
    clinic: "Luminous Skin Clinic",
    location: "Miami, FL",
    fee: 155,
    bio: "Cosmetic and medical dermatology, laser treatments, and pigmentation care.",
    qualifications: ["MD, University of Miami", "Board Certified Dermatologist"],
    languages: ["English", "Portuguese"],
    reviews: [
      { author: "Isabel M.", rating: 5, text: "Skin has never looked better.", date: "2 weeks ago" },
    ],
    defaultSlots: ["08:30", "09:00", "10:00", "11:30", "13:00", "14:30", "16:00"],
  },
];

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: "Male" | "Female" | "Non-binary";
  photo: string;
  email: string;
  phone: string;
  bloodGroup: string;
  address: string;
}

export const PATIENTS: Patient[] = [
  {
    id: "p1",
    name: "Alex Morgan",
    age: 32,
    gender: "Non-binary",
    photo: photo("Alex Morgan"),
    email: "alex.morgan@example.com",
    phone: "+1 (415) 555-0142",
    bloodGroup: "O+",
    address: "1420 Oak Street, San Francisco, CA",
  },
  {
    id: "p2",
    name: "Emma Rodriguez",
    age: 28,
    gender: "Female",
    photo: photo("Emma Rodriguez"),
    email: "emma.r@example.com",
    phone: "+1 (512) 555-0133",
    bloodGroup: "A+",
    address: "88 Congress Ave, Austin, TX",
  },
  {
    id: "p3",
    name: "Liam O'Connor",
    age: 45,
    gender: "Male",
    photo: photo("Liam OConnor"),
    email: "liam.oc@example.com",
    phone: "+1 (206) 555-0198",
    bloodGroup: "B-",
    address: "500 Pine St, Seattle, WA",
  },
  {
    id: "p4",
    name: "Sana Ahmed",
    age: 39,
    gender: "Female",
    photo: photo("Sana Ahmed"),
    email: "sana.a@example.com",
    phone: "+1 (312) 555-0177",
    bloodGroup: "AB+",
    address: "221 Lake Shore Dr, Chicago, IL",
  },
  {
    id: "p5",
    name: "Noah Kim",
    age: 8,
    gender: "Male",
    photo: photo("Noah Kim"),
    email: "parent.kim@example.com",
    phone: "+1 (720) 555-0119",
    bloodGroup: "O-",
    address: "76 Elm Ave, Denver, CO",
  },
];

export type AppointmentStatus = "Upcoming" | "Completed" | "Cancelled";

export interface Appointment {
  id: string;
  doctorId: string;
  patientId: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  reason: string;
  status: AppointmentStatus;
  notes?: string;
}

const today = new Date();
const shift = (days: number) => {
  const d = new Date(today);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
};

export const INITIAL_APPOINTMENTS: Appointment[] = [
  { id: "a1", doctorId: "d1", patientId: "p1", date: shift(2), time: "10:00", reason: "Annual check-up", status: "Upcoming" },
  { id: "a2", doctorId: "d5", patientId: "p1", date: shift(-14), time: "09:00", reason: "Flu symptoms", status: "Completed", notes: "Prescribed rest and fluids." },
  { id: "a3", doctorId: "d2", patientId: "p1", date: shift(-30), time: "15:30", reason: "Skin rash consult", status: "Completed" },
  { id: "a4", doctorId: "d3", patientId: "p5", date: shift(1), time: "09:30", reason: "Well-child visit", status: "Upcoming" },
  { id: "a5", doctorId: "d1", patientId: "p2", date: shift(0), time: "14:00", reason: "Chest palpitations follow-up", status: "Upcoming" },
  { id: "a6", doctorId: "d1", patientId: "p3", date: shift(0), time: "09:00", reason: "Blood pressure review", status: "Upcoming" },
  { id: "a7", doctorId: "d1", patientId: "p4", date: shift(0), time: "11:00", reason: "New patient consult", status: "Upcoming" },
  { id: "a8", doctorId: "d1", patientId: "p2", date: shift(-7), time: "10:30", reason: "ECG review", status: "Completed" },
  { id: "a9", doctorId: "d1", patientId: "p3", date: shift(-40), time: "15:00", reason: "Initial consult", status: "Cancelled" },
  { id: "a10", doctorId: "d4", patientId: "p1", date: shift(5), time: "13:30", reason: "Cleaning", status: "Upcoming" },
];

/** Doctor availability by weekday (0=Sun..6=Sat) → list of enabled HH:MM slots. */
export const INITIAL_AVAILABILITY: Record<string, Record<number, string[]>> = Object.fromEntries(
  DOCTORS.map((d) => [
    d.id,
    {
      0: [],
      1: d.defaultSlots,
      2: d.defaultSlots,
      3: d.defaultSlots,
      4: d.defaultSlots,
      5: d.defaultSlots,
      6: d.defaultSlots.slice(0, 3),
    },
  ]),
);

export const REASONS = [
  "General consultation",
  "Follow-up visit",
  "New symptoms",
  "Annual check-up",
  "Prescription refill",
  "Test results review",
  "Second opinion",
];

/** Currently signed-in patient & doctor for the demo. */
export const CURRENT_PATIENT_ID = "p1";
export const CURRENT_DOCTOR_ID = "d1";
