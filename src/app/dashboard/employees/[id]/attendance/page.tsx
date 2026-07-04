import { Header } from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getEmployee } from "@/actions/employees";
import { getEmployeeAttendance } from "@/actions/attendance";
import { notFound } from "next/navigation";
import { formatTime, getStatusLabel } from "@/lib/utils";
import { format } from "date-fns";
import { AttendanceMonthPicker } from "./month-picker";

export default async function EmployeeAttendancePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ year?: string; month?: string }>;
}) {
  const { id } = await params;
  const sp = await searchParams;

  const employee = await getEmployee(id);
  if (!employee) notFound();

  const now = new Date();
  const year = sp.year ? parseInt(sp.year) : now.getFullYear();
  const month = sp.month ? parseInt(sp.month) : now.getMonth() + 1;

  const attendance = await getEmployeeAttendance(id, year, month);

  // Calculate summary
  const totalPresent = attendance.filter((a) => a.status === "present").length;
  const totalAbsent = attendance.filter((a) => a.status === "absent").length;
  const totalHalfDay = attendance.filter((a) => a.status === "half_day").length;
  const totalLate = attendance.filter((a) => a.status === "late").length;
  const totalHours = attendance.reduce(
    (sum, a) => sum + (a.working_hours || 0),
    0
  );

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

  return (
    <div>
      <Header
        title="Attendance History"
        subtitle={`${employee.name} — ${employee.department}`}
      />

      {/* Month picker */}
      <AttendanceMonthPicker
        employeeId={id}
        currentYear={year}
        currentMonth={month}
      />

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mt-6">
        <div className="glass rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-emerald-400">{totalPresent}</p>
          <p className="text-xs text-foreground/50 mt-1">Present</p>
        </div>
        <div className="glass rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-red-400">{totalAbsent}</p>
          <p className="text-xs text-foreground/50 mt-1">Absent</p>
        </div>
        <div className="glass rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-amber-400">{totalHalfDay}</p>
          <p className="text-xs text-foreground/50 mt-1">Half Day</p>
        </div>
        <div className="glass rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-orange-400">{totalLate}</p>
          <p className="text-xs text-foreground/50 mt-1">Late</p>
        </div>
        <div className="glass rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-blue-400">
            {Math.round(totalHours * 10) / 10}h
          </p>
          <p className="text-xs text-foreground/50 mt-1">Total Hours</p>
        </div>
      </div>

      {/* Attendance table */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>
            {format(new Date(year, month - 1), "MMMM yyyy")} Records
          </CardTitle>
          <Badge variant="info">{attendance.length} days</Badge>
        </CardHeader>
        <CardContent>
          {attendance.length === 0 ? (
            <p className="text-sm text-foreground/40 text-center py-8">
              No attendance records for this month.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--card-border)]">
                    <th className="text-left py-3 px-4 text-foreground/50 font-medium">
                      Date
                    </th>
                    <th className="text-left py-3 px-4 text-foreground/50 font-medium">
                      Day
                    </th>
                    <th className="text-left py-3 px-4 text-foreground/50 font-medium">
                      Check In
                    </th>
                    <th className="text-left py-3 px-4 text-foreground/50 font-medium">
                      Check Out
                    </th>
                    <th className="text-left py-3 px-4 text-foreground/50 font-medium">
                      Hours
                    </th>
                    <th className="text-left py-3 px-4 text-foreground/50 font-medium">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {attendance.map((record, idx) => (
                    <tr
                      key={record.id}
                      className="border-b border-[var(--card-border)] hover:bg-[var(--hover-bg)] transition-colors animate-fade-in"
                      style={{ animationDelay: `${idx * 20}ms` }}
                    >
                      <td className="py-3 px-4 font-medium text-foreground">
                        {format(new Date(record.date), "dd MMM")}
                      </td>
                      <td className="py-3 px-4 text-foreground/60">
                        {format(new Date(record.date), "EEEE")}
                      </td>
                      <td className="py-3 px-4 text-foreground/60">
                        {formatTime(record.check_in)}
                      </td>
                      <td className="py-3 px-4 text-foreground/60">
                        {formatTime(record.check_out)}
                      </td>
                      <td className="py-3 px-4 text-foreground/60 font-mono">
                        {record.working_hours
                          ? `${record.working_hours}h`
                          : "—"}
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={statusVariant(record.status)}>
                          {getStatusLabel(record.status)}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
