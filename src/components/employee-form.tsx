"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useToast } from "@/components/ui/toast";
import type { Employee } from "@/lib/types";
import { useState } from "react";
import { useRouter } from "next/navigation";

const DEPARTMENTS = [
  { value: "Engineering", label: "Engineering" },
  { value: "Marketing", label: "Marketing" },
  { value: "Sales", label: "Sales" },
  { value: "HR", label: "Human Resources" },
  { value: "Finance", label: "Finance" },
  { value: "Operations", label: "Operations" },
  { value: "Design", label: "Design" },
  { value: "Support", label: "Support" },
];

const STATUS_OPTIONS = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

interface EmployeeFormProps {
  employee?: Employee;
  action: (formData: FormData) => Promise<{ error?: string; success?: boolean }>;
  submitLabel?: string;
}

export function EmployeeForm({ employee, action, submitLabel = "Save Employee" }: EmployeeFormProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    const result = await action(formData);
    setLoading(false);

    if (result?.error) {
      toast(result.error, "error");
    } else {
      toast(employee ? "Employee updated successfully" : "Employee created successfully", "success");
      router.push("/dashboard/employees");
      router.refresh();
    }
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Input
          id="name"
          name="name"
          label="Full Name"
          placeholder="John Doe"
          defaultValue={employee?.name}
          required
        />
        <Input
          id="mobile"
          name="mobile"
          label="Mobile Number"
          placeholder="+91 9876543210"
          defaultValue={employee?.mobile}
          required
        />
        <Input
          id="aadhaar"
          name="aadhaar"
          label="Aadhaar Number"
          placeholder="XXXX XXXX XXXX"
          defaultValue={employee?.aadhaar}
          required
        />
        <Select
          id="department"
          name="department"
          label="Department"
          options={DEPARTMENTS}
          placeholder="Select department"
          defaultValue={employee?.department}
          required
        />
        <Input
          id="designation"
          name="designation"
          label="Designation"
          placeholder="Software Engineer"
          defaultValue={employee?.designation}
          required
        />
        <Input
          id="salary"
          name="salary"
          label="Monthly Salary (₹)"
          type="number"
          placeholder="50000"
          defaultValue={employee?.salary?.toString()}
          required
          min="0"
        />
        <Input
          id="joining_date"
          name="joining_date"
          label="Joining Date"
          type="date"
          defaultValue={employee?.joining_date}
          required
        />
        <Select
          id="status"
          name="status"
          label="Status"
          options={STATUS_OPTIONS}
          defaultValue={employee?.status || "active"}
        />
      </div>

      <div className="flex items-center gap-3 pt-2">
        <Button type="submit" loading={loading}>
          {submitLabel}
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.back()}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
