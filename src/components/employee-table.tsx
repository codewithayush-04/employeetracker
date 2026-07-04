"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Employee } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Eye, Pencil, Trash2, CalendarCheck } from "lucide-react";
import Link from "next/link";
import { deleteEmployee } from "@/actions/employees";
import { useToast } from "@/components/ui/toast";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Modal } from "@/components/ui/modal";

interface EmployeeTableProps {
  employees: Employee[];
}

export function EmployeeTable({ employees }: EmployeeTableProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!deleteId) return;
    setDeleting(true);
    const result = await deleteEmployee(deleteId);
    setDeleting(false);
    setDeleteId(null);

    if (result?.error) {
      toast(result.error, "error");
    } else {
      toast("Employee deactivated successfully", "success");
      router.refresh();
    }
  }

  if (employees.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-foreground/40 text-sm">No employees found.</p>
        <Link href="/dashboard/employees/new">
          <Button variant="primary" size="sm" className="mt-4">
            Add First Employee
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--card-border)]">
              <th className="text-left py-3 px-4 text-foreground/50 font-medium">Name</th>
              <th className="text-left py-3 px-4 text-foreground/50 font-medium hidden sm:table-cell">Mobile</th>
              <th className="text-left py-3 px-4 text-foreground/50 font-medium">Department</th>
              <th className="text-left py-3 px-4 text-foreground/50 font-medium hidden md:table-cell">Designation</th>
              <th className="text-left py-3 px-4 text-foreground/50 font-medium hidden lg:table-cell">Salary</th>
              <th className="text-left py-3 px-4 text-foreground/50 font-medium hidden lg:table-cell">Joining</th>
              <th className="text-left py-3 px-4 text-foreground/50 font-medium">Status</th>
              <th className="text-right py-3 px-4 text-foreground/50 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp, idx) => (
              <tr
                key={emp.id}
                className="border-b border-[var(--card-border)] hover:bg-[var(--hover-bg)] transition-colors animate-fade-in"
                style={{ animationDelay: `${idx * 30}ms` }}
              >
                <td className="py-3 px-4">
                  <div>
                    <p className="font-medium text-foreground">{emp.name}</p>
                    <p className="text-xs text-foreground/40 sm:hidden">{emp.mobile}</p>
                  </div>
                </td>
                <td className="py-3 px-4 text-foreground/60 hidden sm:table-cell">{emp.mobile}</td>
                <td className="py-3 px-4">
                  <Badge variant="info">{emp.department}</Badge>
                </td>
                <td className="py-3 px-4 text-foreground/60 hidden md:table-cell">{emp.designation}</td>
                <td className="py-3 px-4 text-foreground/60 hidden lg:table-cell font-mono">
                  {formatCurrency(emp.salary)}
                </td>
                <td className="py-3 px-4 text-foreground/60 hidden lg:table-cell">
                  {formatDate(emp.joining_date)}
                </td>
                <td className="py-3 px-4">
                  <Badge variant={emp.status === "active" ? "success" : "danger"}>
                    {emp.status === "active" ? "Active" : "Inactive"}
                  </Badge>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center justify-end gap-1">
                    <Link href={`/dashboard/employees/${emp.id}`}>
                      <button className="p-1.5 rounded-lg text-foreground/40 hover:text-foreground hover:bg-[var(--hover-bg)] transition-colors cursor-pointer">
                        <Eye className="h-4 w-4" />
                      </button>
                    </Link>
                    <Link href={`/dashboard/employees/${emp.id}`}>
                      <button className="p-1.5 rounded-lg text-foreground/40 hover:text-blue-400 hover:bg-blue-500/10 transition-colors cursor-pointer">
                        <Pencil className="h-4 w-4" />
                      </button>
                    </Link>
                    <Link href={`/dashboard/employees/${emp.id}/attendance`}>
                      <button className="p-1.5 rounded-lg text-foreground/40 hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors cursor-pointer">
                        <CalendarCheck className="h-4 w-4" />
                      </button>
                    </Link>
                    <button
                      onClick={() => setDeleteId(emp.id)}
                      className="p-1.5 rounded-lg text-foreground/40 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete confirmation modal */}
      <Modal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Deactivate Employee"
      >
        <p className="text-sm text-foreground/60 mb-6">
          Are you sure you want to deactivate this employee? They will be marked as inactive and hidden from active lists.
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={() => setDeleteId(null)}>
            Cancel
          </Button>
          <Button variant="danger" loading={deleting} onClick={handleDelete}>
            Deactivate
          </Button>
        </div>
      </Modal>
    </>
  );
}
