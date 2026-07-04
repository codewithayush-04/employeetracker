"use client";

import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

interface EmployeeFiltersProps {
  departments: string[];
}

export function EmployeeFilters({ departments }: EmployeeFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateParams = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.push(`/dashboard/employees?${params.toString()}`);
    },
    [router, searchParams]
  );

  const deptOptions = departments.map((d) => ({ value: d, label: d }));

  const statusOptions = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
  ];

  return (
    <div className="glass rounded-2xl p-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Input
          placeholder="Search by name or mobile..."
          icon={<Search className="h-4 w-4" />}
          defaultValue={searchParams.get("search") || ""}
          onChange={(e) => {
            const timer = setTimeout(() => updateParams("search", e.target.value), 300);
            return () => clearTimeout(timer);
          }}
        />
        <Select
          options={deptOptions}
          placeholder="All Departments"
          defaultValue={searchParams.get("department") || ""}
          onChange={(e) => updateParams("department", e.target.value)}
        />
        <Select
          options={statusOptions}
          placeholder="All Status"
          defaultValue={searchParams.get("status") || ""}
          onChange={(e) => updateParams("status", e.target.value)}
        />
      </div>
    </div>
  );
}
