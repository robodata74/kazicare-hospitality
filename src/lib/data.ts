// KaziCare Hospitality — demo/seed data
// This is clearly-labeled DEMO DATA, not a live database.
// In a production build this module is replaced by API calls to the backend.

export type Department = "Kitchen" | "Front of House" | "Bar" | "Management" | "Support";

export interface Employee {
  id: string;
  name: string;
  role: string;
  department: Department;
  status: "Present" | "Late" | "Absent" | "On Leave" | "Off Today";
  photoInitials: string;
  phone: string;
  startDate: string;
  employmentType: "Full-time" | "Part-time" | "Casual";
}

export const employees: Employee[] = [
  { id: "E-1001", name: "Amina Wanjiru", role: "Head Chef", department: "Kitchen", status: "Present", photoInitials: "AW", phone: "+254 712 000 111", startDate: "2022-03-14", employmentType: "Full-time" },
  { id: "E-1002", name: "Brian Otieno", role: "Line Cook", department: "Kitchen", status: "Late", photoInitials: "BO", phone: "+254 712 000 112", startDate: "2023-06-01", employmentType: "Full-time" },
  { id: "E-1003", name: "Cynthia Achieng", role: "Sous Chef", department: "Kitchen", status: "Present", photoInitials: "CA", phone: "+254 712 000 113", startDate: "2021-11-20", employmentType: "Full-time" },
  { id: "E-1004", name: "David Kamau", role: "Server", department: "Front of House", status: "Present", photoInitials: "DK", phone: "+254 712 000 114", startDate: "2023-01-09", employmentType: "Part-time" },
  { id: "E-1005", name: "Esther Njeri", role: "Host", department: "Front of House", status: "Absent", photoInitials: "EN", phone: "+254 712 000 115", startDate: "2022-08-15", employmentType: "Full-time" },
  { id: "E-1006", name: "Felix Mwangi", role: "Server", department: "Front of House", status: "Present", photoInitials: "FM", phone: "+254 712 000 116", startDate: "2024-02-01", employmentType: "Casual" },
  { id: "E-1007", name: "Grace Adhiambo", role: "Restaurant Manager", department: "Management", status: "Present", photoInitials: "GA", phone: "+254 712 000 117", startDate: "2020-05-10", employmentType: "Full-time" },
  { id: "E-1008", name: "Hassan Ali", role: "Bartender", department: "Bar", status: "Present", photoInitials: "HA", phone: "+254 712 000 118", startDate: "2022-09-23", employmentType: "Full-time" },
  { id: "E-1009", name: "Irene Chebet", role: "Barback", department: "Bar", status: "On Leave", photoInitials: "IC", phone: "+254 712 000 119", startDate: "2023-04-04", employmentType: "Part-time" },
  { id: "E-1010", name: "James Kiptoo", role: "Dishwasher", department: "Support", status: "Present", photoInitials: "JK", phone: "+254 712 000 120", startDate: "2023-10-30", employmentType: "Full-time" },
  { id: "E-1011", name: "Kevin Njoroge", role: "Cleaner", department: "Support", status: "Off Today", photoInitials: "KN", phone: "+254 712 000 121", startDate: "2024-01-12", employmentType: "Casual" },
  { id: "E-1012", name: "Lucy Wambui", role: "Server", department: "Front of House", status: "Present", photoInitials: "LW", phone: "+254 712 000 122", startDate: "2023-07-19", employmentType: "Part-time" },
];

export interface DepartmentCoverage {
  department: Department;
  scheduled: number;
  present: number;
}

export const shiftCoverage: DepartmentCoverage[] = [
  { department: "Kitchen", scheduled: 12, present: 11 },
  { department: "Front of House", scheduled: 14, present: 13 },
  { department: "Bar", scheduled: 6, present: 6 },
  { department: "Management", scheduled: 4, present: 4 },
  { department: "Support", scheduled: 6, present: 3 },
];

export interface AttentionItem {
  id: string;
  severity: "critical" | "warning" | "info";
  title: string;
  detail: string;
  action: string;
}

export const attentionItems: AttentionItem[] = [
  {
    id: "A-1",
    severity: "critical",
    title: "Support is understaffed for the evening shift",
    detail: "2 of 6 scheduled Support employees have not clocked in for the 4:00 PM shift.",
    action: "Review Coverage",
  },
  {
    id: "A-2",
    severity: "warning",
    title: "Esther Njeri has not clocked in",
    detail: "Scheduled for the 8:00 AM Front of House shift, no attendance record logged.",
    action: "Contact Employee",
  },
  {
    id: "A-3",
    severity: "warning",
    title: "Food safety certificate expiring soon",
    detail: "Brian Otieno's food safety training expires in 9 days.",
    action: "Send Reminder",
  },
  {
    id: "A-4",
    severity: "info",
    title: "3 leave requests awaiting approval",
    detail: "Submitted by Front of House and Bar staff for the coming week.",
    action: "Review Requests",
  },
];

export interface LeaveRequest {
  id: string;
  employee: string;
  department: Department;
  type: "Annual" | "Sick" | "Compassionate" | "Unpaid";
  from: string;
  to: string;
  status: "Pending" | "Approved" | "Rejected";
  conflict: boolean;
}

export const leaveRequests: LeaveRequest[] = [
  { id: "L-201", employee: "Irene Chebet", department: "Bar", type: "Annual", from: "2026-08-10", to: "2026-08-14", status: "Approved", conflict: false },
  { id: "L-202", employee: "Felix Mwangi", department: "Front of House", type: "Sick", from: "2026-08-13", to: "2026-08-13", status: "Pending", conflict: true },
  { id: "L-203", employee: "James Kiptoo", department: "Support", type: "Annual", from: "2026-08-18", to: "2026-08-20", status: "Pending", conflict: false },
  { id: "L-204", employee: "Cynthia Achieng", department: "Kitchen", type: "Compassionate", from: "2026-08-12", to: "2026-08-12", status: "Approved", conflict: false },
];

export interface ShiftRow {
  id: string;
  employee: string;
  department: Department;
  day: string;
  time: string;
  status: "Fully Staffed" | "Understaffed" | "Open" | "Completed";
}

export const shifts: ShiftRow[] = [
  { id: "S-01", employee: "Amina Wanjiru", department: "Kitchen", day: "Mon", time: "6:00 AM – 2:00 PM", status: "Completed" },
  { id: "S-02", employee: "Brian Otieno", department: "Kitchen", day: "Mon", time: "2:00 PM – 10:00 PM", status: "Fully Staffed" },
  { id: "S-03", employee: "David Kamau", department: "Front of House", day: "Mon", time: "11:00 AM – 7:00 PM", status: "Fully Staffed" },
  { id: "S-04", employee: "Esther Njeri", department: "Front of House", day: "Mon", time: "8:00 AM – 4:00 PM", status: "Understaffed" },
  { id: "S-05", employee: "Hassan Ali", department: "Bar", day: "Mon", time: "4:00 PM – 12:00 AM", status: "Fully Staffed" },
  { id: "S-06", employee: "Open Shift", department: "Support", day: "Mon", time: "4:00 PM – 10:00 PM", status: "Open" },
];

export const kpi = {
  scheduled: 42,
  present: 37,
  late: 3,
  absent: 2,
  onLeave: 4,
  criticalIssues: 1,
};

export const workforceHealthScore = {
  score: 84,
  factors: [
    { label: "Attendance", weight: "30%", note: "92% attendance rate this week" },
    { label: "Punctuality", weight: "20%", note: "3 late arrivals out of 42 scheduled" },
    { label: "Shift coverage", weight: "20%", note: "Support understaffed on 2 shifts" },
    { label: "Documentation", weight: "15%", note: "1 certificate expiring within 14 days" },
    { label: "Training", weight: "15%", note: "All core roles current except 1" },
  ],
};
