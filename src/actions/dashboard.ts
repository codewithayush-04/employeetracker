"use server";

import { createClient } from "@/lib/supabase/server";
import type { DashboardStats, AttendanceSummary, DepartmentSalary } from "@/lib/types";
import { format, subDays } from "date-fns";

export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = await createClient();
  const today = format(new Date(), "yyyy-MM-dd");

  // Total employees (active)
  const { count: totalEmployees } = await supabase
    .from("employees")
    .select("*", { count: "exact", head: true })
    .eq("status", "active");

  // Today's attendance
  const { data: todayAttendance } = await supabase
    .from("attendance")
    .select("status")
    .eq("date", today);

  const presentToday = (todayAttendance || []).filter(
    (a) => a.status === "present" || a.status === "late"
  ).length;

  const absentToday = (totalEmployees || 0) - presentToday;

  // Monthly salary total (active employees)
  const { data: salaryData } = await supabase
    .from("employees")
    .select("salary")
    .eq("status", "active");

  const monthlySalary = (salaryData || []).reduce(
    (sum, e) => sum + (e.salary || 0),
    0
  );

  return {
    totalEmployees: totalEmployees || 0,
    presentToday,
    absentToday,
    monthlySalary,
  };
}

export async function getWeeklyAttendanceTrend(): Promise<AttendanceSummary[]> {
  const supabase = await createClient();
  const result: AttendanceSummary[] = [];

  for (let i = 6; i >= 0; i--) {
    const date = format(subDays(new Date(), i), "yyyy-MM-dd");
    const { data } = await supabase
      .from("attendance")
      .select("status")
      .eq("date", date);

    const records = data || [];
    result.push({
      date: format(subDays(new Date(), i), "EEE"),
      present: records.filter((a) => a.status === "present").length,
      absent: records.filter((a) => a.status === "absent").length,
      half_day: records.filter((a) => a.status === "half_day").length,
      late: records.filter((a) => a.status === "late").length,
    });
  }

  return result;
}

export async function getDepartmentSalaries(): Promise<DepartmentSalary[]> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("employees")
    .select("department, salary")
    .eq("status", "active");

  if (!data) return [];

  const deptMap = new Map<string, { total: number; count: number }>();

  data.forEach((emp) => {
    const curr = deptMap.get(emp.department) || { total: 0, count: 0 };
    curr.total += emp.salary || 0;
    curr.count += 1;
    deptMap.set(emp.department, curr);
  });

  return Array.from(deptMap.entries()).map(([dept, info]) => ({
    department: dept,
    totalSalary: info.total,
    employeeCount: info.count,
  }));
}

export async function getRecentAttendance() {
  const supabase = await createClient();
  const today = format(new Date(), "yyyy-MM-dd");

  const { data, error } = await supabase
    .from("attendance")
    .select("*, employee:employees(*)")
    .eq("date", today)
    .order("created_at", { ascending: false })
    .limit(10);

  if (error) {
    console.error("Error fetching recent attendance:", error);
    return [];
  }

  return data || [];
}
