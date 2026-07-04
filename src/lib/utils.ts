import { format, parseISO, differenceInMinutes } from "date-fns";

export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: string | Date, fmt: string = "dd MMM yyyy"): string {
  const d = typeof date === "string" ? parseISO(date) : date;
  return format(d, fmt);
}

export function formatTime(dateString: string | null): string {
  if (!dateString) return "—";
  return format(parseISO(dateString), "hh:mm a");
}

export function calculateWorkingHours(
  checkIn: string | null,
  checkOut: string | null
): number | null {
  if (!checkIn || !checkOut) return null;
  const minutes = differenceInMinutes(parseISO(checkOut), parseISO(checkIn));
  return Math.round((minutes / 60) * 100) / 100;
}

export function getAttendanceStatusColor(status: string): string {
  switch (status) {
    case "present":
      return "bg-emerald-500/15 text-emerald-400 border-emerald-500/30";
    case "absent":
      return "bg-red-500/15 text-red-400 border-red-500/30";
    case "half_day":
      return "bg-amber-500/15 text-amber-400 border-amber-500/30";
    case "late":
      return "bg-orange-500/15 text-orange-400 border-orange-500/30";
    default:
      return "bg-slate-500/15 text-slate-400 border-slate-500/30";
  }
}

export function getStatusLabel(status: string): string {
  switch (status) {
    case "present":
      return "Present";
    case "absent":
      return "Absent";
    case "half_day":
      return "Half Day";
    case "late":
      return "Late";
    default:
      return status;
  }
}

export function getTodayISO(): string {
  return format(new Date(), "yyyy-MM-dd");
}

export function getWorkingDaysInMonth(year: number, month: number): number {
  const daysInMonth = new Date(year, month, 0).getDate();
  let workingDays = 0;
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month - 1, day);
    const dayOfWeek = date.getDay();
    if (dayOfWeek !== 0) {
      // Excluding only Sundays
      workingDays++;
    }
  }
  return workingDays;
}
