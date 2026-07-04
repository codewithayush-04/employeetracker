import { Header } from "@/components/header";
import { StatCard } from "@/components/stat-card";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AttendanceChart } from "@/components/attendance-chart";
import { SalaryChart } from "@/components/salary-chart";
import {
  getDashboardStats,
  getWeeklyAttendanceTrend,
  getDepartmentSalaries,
  getRecentAttendance,
} from "@/actions/dashboard";
import { formatCurrency, formatTime, getStatusLabel } from "@/lib/utils";
import { Users, UserCheck, UserX, Wallet } from "lucide-react";

export default async function DashboardPage() {
  const [stats, weeklyTrend, deptSalaries, recentAttendance] =
    await Promise.all([
      getDashboardStats(),
      getWeeklyAttendanceTrend(),
      getDepartmentSalaries(),
      getRecentAttendance(),
    ]);

  const statusVariant = (status: string) => {
    switch (status) {
      case "present": return "success" as const;
      case "absent": return "danger" as const;
      case "half_day": return "warning" as const;
      case "late": return "warning" as const;
      default: return "default" as const;
    }
  };

  return (
    <div>
      <Header
        title="Dashboard"
        subtitle="Overview of your workforce metrics"
      />

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Total Employees"
          value={stats.totalEmployees}
          icon={Users}
          gradient="brand"
          trend="Active workforce"
          delay={0}
        />
        <StatCard
          title="Present Today"
          value={stats.presentToday}
          icon={UserCheck}
          gradient="success"
          trend={`${stats.totalEmployees > 0 ? Math.round((stats.presentToday / stats.totalEmployees) * 100) : 0}% attendance`}
          delay={50}
        />
        <StatCard
          title="Absent Today"
          value={stats.absentToday}
          icon={UserX}
          gradient="danger"
          delay={100}
        />
        <StatCard
          title="Monthly Salary"
          value={formatCurrency(stats.monthlySalary)}
          icon={Wallet}
          gradient="info"
          trend="Total payroll"
          delay={150}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Weekly Attendance Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <AttendanceChart data={weeklyTrend} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Department Salary Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <SalaryChart data={deptSalaries} />
          </CardContent>
        </Card>
      </div>

      {/* Recent Attendance */}
      <Card>
        <CardHeader>
          <CardTitle>Today&apos;s Attendance</CardTitle>
          <Badge variant="info">{recentAttendance.length} records</Badge>
        </CardHeader>
        <CardContent>
          {recentAttendance.length === 0 ? (
            <p className="text-sm text-foreground/40 text-center py-8">
              No attendance records for today yet.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--card-border)]">
                    <th className="text-left py-3 px-4 text-foreground/50 font-medium">
                      Employee
                    </th>
                    <th className="text-left py-3 px-4 text-foreground/50 font-medium">
                      Department
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
                  {recentAttendance.map((record: Record<string, unknown>) => (
                    <tr
                      key={record.id as string}
                      className="border-b border-[var(--card-border)] hover:bg-[var(--hover-bg)] transition-colors"
                    >
                      <td className="py-3 px-4 font-medium text-foreground">
                        {(record.employee as Record<string, unknown>)?.name as string || "—"}
                      </td>
                      <td className="py-3 px-4 text-foreground/60">
                        {(record.employee as Record<string, unknown>)?.department as string || "—"}
                      </td>
                      <td className="py-3 px-4 text-foreground/60">
                        {formatTime(record.check_in as string | null)}
                      </td>
                      <td className="py-3 px-4 text-foreground/60">
                        {formatTime(record.check_out as string | null)}
                      </td>
                      <td className="py-3 px-4 text-foreground/60">
                        {record.working_hours
                          ? `${record.working_hours}h`
                          : "—"}
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={statusVariant(record.status as string)}>
                          {getStatusLabel(record.status as string)}
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
