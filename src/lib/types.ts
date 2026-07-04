export interface Employee {
  id: string;
  name: string;
  mobile: string;
  aadhaar: string;
  department: string;
  designation: string;
  salary: number;
  joining_date: string;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
}

export interface Attendance {
  id: string;
  employee_id: string;
  date: string;
  check_in: string | null;
  check_out: string | null;
  working_hours: number | null;
  status: "present" | "absent" | "half_day" | "late";
  created_at: string;
  employee?: Employee;
}

export interface DashboardStats {
  totalEmployees: number;
  presentToday: number;
  absentToday: number;
  monthlySalary: number;
}

export interface AttendanceSummary {
  date: string;
  present: number;
  absent: number;
  half_day: number;
  late: number;
}

export interface DepartmentSalary {
  department: string;
  totalSalary: number;
  employeeCount: number;
}

export interface MonthlyAttendance {
  employeeId: string;
  employeeName: string;
  department: string;
  totalPresent: number;
  totalAbsent: number;
  totalHalfDay: number;
  totalLate: number;
  totalWorkingHours: number;
}

export interface SalaryRecord {
  employeeId: string;
  employeeName: string;
  department: string;
  designation: string;
  baseSalary: number;
  daysPresent: number;
  daysAbsent: number;
  daysHalfDay: number;
  workingDays: number;
  calculatedSalary: number;
}
