"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { formatTime, getStatusLabel } from "@/lib/utils";
import { LogIn, LogOut, Clock, UserX } from "lucide-react";
import { useState } from "react";
import {
  markCheckIn,
  markCheckOut,
  markAbsent,
  updateAttendanceStatus,
} from "@/actions/attendance";
import { useRouter } from "next/navigation";
import type { Employee, Attendance } from "@/lib/types";

interface AttendanceRecord extends Employee {
  attendance: Attendance | null;
}

interface AttendanceTableProps {
  records: AttendanceRecord[];
  date: string;
}

export function AttendanceTable({ records, date }: AttendanceTableProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  async function handleCheckIn(employeeId: string) {
    setLoadingId(`in-${employeeId}`);
    const result = await markCheckIn(employeeId, date);
    setLoadingId(null);
    if (result?.error) {
      toast(result.error, "error");
    } else {
      toast("Checked in successfully", "success");
      router.refresh();
    }
  }

  async function handleCheckOut(employeeId: string) {
    setLoadingId(`out-${employeeId}`);
    const result = await markCheckOut(employeeId, date);
    setLoadingId(null);
    if (result?.error) {
      toast(result.error, "error");
    } else {
      toast("Checked out successfully", "success");
      router.refresh();
    }
  }

  async function handleMarkAbsent(employeeId: string) {
    setLoadingId(`abs-${employeeId}`);
    const result = await markAbsent(employeeId, date);
    setLoadingId(null);
    if (result?.error) {
      toast(result.error, "error");
    } else {
      toast("Marked absent", "success");
      router.refresh();
    }
  }

  async function handleStatusChange(
    employeeId: string,
    status: "present" | "absent" | "half_day" | "late"
  ) {
    setLoadingId(`status-${employeeId}`);
    const result = await updateAttendanceStatus(employeeId, date, status);
    setLoadingId(null);
    if (result?.error) {
      toast(result.error, "error");
    } else {
      toast(`Status updated to ${getStatusLabel(status)}`, "success");
      router.refresh();
    }
  }

  const statusVariant = (status: string) => {
    switch (status) {
      case "present":
        return "success" as const;
      case "absent":
        return "danger" as const;
      case "half_day":
        return "warning" as const;
      case "late":
        return "warning" as const;
      default:
        return "default" as const;
    }
  };

  if (records.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-foreground/40 text-sm">
          No active employees found.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[var(--card-border)]">
            <th className="text-left py-3 px-4 text-foreground/50 font-medium">
              Employee
            </th>
            <th className="text-left py-3 px-4 text-foreground/50 font-medium hidden sm:table-cell">
              Department
            </th>
            <th className="text-left py-3 px-4 text-foreground/50 font-medium">
              Check In
            </th>
            <th className="text-left py-3 px-4 text-foreground/50 font-medium">
              Check Out
            </th>
            <th className="text-left py-3 px-4 text-foreground/50 font-medium hidden md:table-cell">
              Hours
            </th>
            <th className="text-left py-3 px-4 text-foreground/50 font-medium">
              Status
            </th>
            <th className="text-right py-3 px-4 text-foreground/50 font-medium">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {records.map((record, idx) => {
            const att = record.attendance;
            const hasCheckedIn = !!att?.check_in;
            const hasCheckedOut = !!att?.check_out;

            return (
              <tr
                key={record.id}
                className="border-b border-[var(--card-border)] hover:bg-[var(--hover-bg)] transition-colors animate-fade-in"
                style={{ animationDelay: `${idx * 20}ms` }}
              >
                <td className="py-3 px-4">
                  <div>
                    <p className="font-medium text-foreground">
                      {record.name}
                    </p>
                    <p className="text-xs text-foreground/40 sm:hidden">
                      {record.department}
                    </p>
                  </div>
                </td>
                <td className="py-3 px-4 text-foreground/60 hidden sm:table-cell">
                  {record.department}
                </td>
                <td className="py-3 px-4 text-foreground/60">
                  {hasCheckedIn ? (
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-emerald-400" />
                      {formatTime(att!.check_in)}
                    </span>
                  ) : (
                    "—"
                  )}
                </td>
                <td className="py-3 px-4 text-foreground/60">
                  {hasCheckedOut ? (
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-amber-400" />
                      {formatTime(att!.check_out)}
                    </span>
                  ) : (
                    "—"
                  )}
                </td>
                <td className="py-3 px-4 text-foreground/60 hidden md:table-cell font-mono">
                  {att?.working_hours ? `${att.working_hours}h` : "—"}
                </td>
                <td className="py-3 px-4">
                  {att ? (
                    <select
                      value={att.status}
                      onChange={(e) =>
                        handleStatusChange(
                          record.id,
                          e.target.value as "present" | "absent" | "half_day" | "late"
                        )
                      }
                      className="text-xs rounded-full border px-2.5 py-1 bg-transparent cursor-pointer focus:outline-none"
                      disabled={loadingId === `status-${record.id}`}
                    >
                      <option value="present">Present</option>
                      <option value="absent">Absent</option>
                      <option value="half_day">Half Day</option>
                      <option value="late">Late</option>
                    </select>
                  ) : (
                    <Badge variant="default">No Record</Badge>
                  )}
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center justify-end gap-1">
                    {!hasCheckedIn && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCheckIn(record.id)}
                          loading={loadingId === `in-${record.id}`}
                          className="text-xs"
                        >
                          <LogIn className="h-3.5 w-3.5" />
                          <span className="hidden sm:inline">In</span>
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleMarkAbsent(record.id)}
                          loading={loadingId === `abs-${record.id}`}
                          className="text-xs text-red-400"
                        >
                          <UserX className="h-3.5 w-3.5" />
                        </Button>
                      </>
                    )}
                    {hasCheckedIn && !hasCheckedOut && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCheckOut(record.id)}
                        loading={loadingId === `out-${record.id}`}
                        className="text-xs"
                      >
                        <LogOut className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Out</span>
                      </Button>
                    )}
                    {hasCheckedIn && hasCheckedOut && (
                      <Badge variant="success">Done</Badge>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
