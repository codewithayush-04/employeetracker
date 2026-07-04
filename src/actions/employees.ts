"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { Employee } from "@/lib/types";

export async function getEmployees(search?: string, department?: string, status?: string) {
  const supabase = await createClient();

  let query = supabase
    .from("employees")
    .select("*")
    .order("created_at", { ascending: false });

  if (search) {
    query = query.or(`name.ilike.%${search}%,mobile.ilike.%${search}%`);
  }
  if (department) {
    query = query.eq("department", department);
  }
  if (status) {
    query = query.eq("status", status);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching employees:", error);
    return [];
  }

  return data as Employee[];
}

export async function getEmployee(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("employees")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching employee:", error);
    return null;
  }

  return data as Employee;
}

export async function createEmployee(formData: FormData) {
  const supabase = await createClient();

  const employee = {
    name: formData.get("name") as string,
    mobile: formData.get("mobile") as string,
    aadhaar: formData.get("aadhaar") as string,
    department: formData.get("department") as string,
    designation: formData.get("designation") as string,
    salary: parseFloat(formData.get("salary") as string),
    joining_date: formData.get("joining_date") as string,
    status: (formData.get("status") as string) || "active",
  };

  const { error } = await supabase.from("employees").insert(employee);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard/employees");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function updateEmployee(id: string, formData: FormData) {
  const supabase = await createClient();

  const employee = {
    name: formData.get("name") as string,
    mobile: formData.get("mobile") as string,
    aadhaar: formData.get("aadhaar") as string,
    department: formData.get("department") as string,
    designation: formData.get("designation") as string,
    salary: parseFloat(formData.get("salary") as string),
    joining_date: formData.get("joining_date") as string,
    status: formData.get("status") as string,
  };

  const { error } = await supabase
    .from("employees")
    .update(employee)
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard/employees");
  revalidatePath(`/dashboard/employees/${id}`);
  revalidatePath("/dashboard");
  return { success: true };
}

export async function deleteEmployee(id: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("employees")
    .update({ status: "inactive" })
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard/employees");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function getDepartments(): Promise<string[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("employees")
    .select("department")
    .order("department");

  if (error) {
    console.error("Error fetching departments:", error);
    return [];
  }

  const departments = [...new Set(data.map((d: { department: string }) => d.department))];
  return departments;
}
