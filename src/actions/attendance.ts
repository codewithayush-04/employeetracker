"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { Attendance } from "@/lib/types";

export async function getAttendanceByDate(date: string) {
  const supabase = await createClient();

  // Get all active employees with their attendance for the given date
  const { data: employees, error: empError } = await supabase
    .from("employees")
    .select("*")
    .eq("status", "active")
    .order("name");

  if (empError) {
    console.error("Error fetching employees:", empError);
    return [];
  }

  const { data: attendanceData, error: attError } = await supabase
    .from("attendance")
    .select("*")
    .eq("date", date);

  if (attError) {
    console.error("Error fetching attendance:", attError);
    return [];
  }

  // Merge employees with their attendance
  return employees.map((emp) => {
    const att = attendanceData?.find((a: Attendance) => a.employee_id === emp.id);
    return {
      ...emp,
      attendance: att || null,
    };
  });
}

export async function markCheckIn(employeeId: string, date: string) {
  const supabase = await createClient();

  const checkInTime = new Date().toISOString();

  // Upsert: create or update attendance record
  const { error } = await supabase
    .from("attendance")
    .upsert(
      {
        employee_id: employeeId,
        date,
        check_in: checkInTime,
        status: "present",
      },
      { onConflict: "employee_id,date" }
    );

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard/attendance");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function markCheckOut(employeeId: string, date: string) {
  const supabase = await createClient();

  const checkOutTime = new Date().toISOString();

  const { error } = await supabase
    .from("attendance")
    .update({
      check_out: checkOutTime,
    })
    .eq("employee_id", employeeId)
    .eq("date", date);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard/attendance");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function markAbsent(employeeId: string, date: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("attendance")
    .upsert(
      {
        employee_id: employeeId,
        date,
        status: "absent",
        check_in: null,
        check_out: null,
        working_hours: null,
      },
      { onConflict: "employee_id,date" }
    );

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard/attendance");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function updateAttendanceStatus(
  employeeId: string,
  date: string,
  status: "present" | "absent" | "half_day" | "late"
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("attendance")
    .upsert(
      {
        employee_id: employeeId,
        date,
        status,
      },
      { onConflict: "employee_id,date" }
    );

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard/attendance");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function getEmployeeAttendance(
  employeeId: string,
  year: number,
  month: number
) {
  const supabase = await createClient();

  const startDate = `${year}-${String(month).padStart(2, "0")}-01`;
  const endDate =
    month === 12
      ? `${year + 1}-01-01`
      : `${year}-${String(month + 1).padStart(2, "0")}-01`;

  const { data, error } = await supabase
    .from("attendance")
    .select("*")
    .eq("employee_id", employeeId)
    .gte("date", startDate)
    .lt("date", endDate)
    .order("date");

  if (error) {
    console.error("Error fetching employee attendance:", error);
    return [];
  }

  return data as Attendance[];
}

export async function getMonthlyAttendanceSummary(year: number, month: number) {
  const supabase = await createClient();

  const startDate = `${year}-${String(month).padStart(2, "0")}-01`;
  const endDate =
    month === 12
      ? `${year + 1}-01-01`
      : `${year}-${String(month + 1).padStart(2, "0")}-01`;

  const { data: employees, error: empError } = await supabase
    .from("employees")
    .select("*")
    .eq("status", "active")
    .order("name");

  if (empError) {
    console.error("Error:", empError);
    return [];
  }

  const { data: attendance, error: attError } = await supabase
    .from("attendance")
    .select("*")
    .gte("date", startDate)
    .lt("date", endDate);

  if (attError) {
    console.error("Error:", attError);
    return [];
  }

  return employees.map((emp) => {
    const empAttendance = (attendance || []).filter(
      (a: Attendance) => a.employee_id === emp.id
    );

    const totalPresent = empAttendance.filter((a: Attendance) => a.status === "present").length;
    const totalAbsent = empAttendance.filter((a: Attendance) => a.status === "absent").length;
    const totalHalfDay = empAttendance.filter((a: Attendance) => a.status === "half_day").length;
    const totalLate = empAttendance.filter((a: Attendance) => a.status === "late").length;
    const totalWorkingHours = empAttendance.reduce(
      (sum: number, a: Attendance) => sum + (a.working_hours || 0),
      0
    );

    return {
      employeeId: emp.id,
      employeeName: emp.name,
      department: emp.department,
      designation: emp.designation,
      baseSalary: emp.salary,
      totalPresent,
      totalAbsent,
      totalHalfDay,
      totalLate,
      totalWorkingHours: Math.round(totalWorkingHours * 100) / 100,
    };
  });
}
