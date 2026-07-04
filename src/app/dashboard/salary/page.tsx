import { Header } from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getMonthlyAttendanceSummary } from "@/actions/attendance";
import { formatCurrency, getWorkingDaysInMonth } from "@/lib/utils";
import { SalaryMonthPicker } from "./month-picker";

export default async function SalaryPage({
  searchParams,
}: {
  searchParams: Promise<{ year?: string; month?: string }>;
}) {
  const sp = await searchParams;
  const now = new Date();
  const year = sp.year ? parseInt(sp.year) : now.getFullYear();
  const month = sp.month ? parseInt(sp.month) : now.getMonth() + 1;

  const records = await getMonthlyAttendanceSummary(year, month);
  const workingDays = getWorkingDaysInMonth(year, month);

  // Calculate salary for each employee
  const salaryRecords = records.map((r) => {
    const effectiveDays = r.totalPresent + r.totalLate + r.totalHalfDay * 0.5;
    const perDaySalary = r.baseSalary / workingDays;
    const calculatedSalary = Math.round(perDaySalary * effectiveDays);

    return {
      ...r,
      workingDays,
      effectiveDays,
      perDaySalary: Math.round(perDaySalary),
      calculatedSalary,
    };
  });

  const totalBaseSalary = salaryRecords.reduce(
    (sum, r) => sum + r.baseSalary,
    0
  );
  const totalCalculatedSalary = salaryRecords.reduce(
    (sum, r) => sum + r.calculatedSalary,
    0
  );

  return (
    <div>
      <Header
        title="Salary Records"
        subtitle="Monthly salary calculation based on attendance"
      />

      {/* Month picker */}
      <SalaryMonthPicker currentYear={year} currentMonth={month} />

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
        <div className="glass rounded-xl p-5 text-center">
          <p className="text-xs text-foreground/50">Total Base Salary</p>
          <p className="text-2xl font-bold text-foreground mt-1">
            {formatCurrency(totalBaseSalary)}
          </p>
        </div>
        <div className="glass rounded-xl p-5 text-center">
          <p className="text-xs text-foreground/50">Total Payable</p>
          <p className="text-2xl font-bold text-emerald-400 mt-1">
            {formatCurrency(totalCalculatedSalary)}
          </p>
        </div>
        <div className="glass rounded-xl p-5 text-center">
          <p className="text-xs text-foreground/50">Working Days</p>
          <p className="text-2xl font-bold text-brand-400 mt-1">
            {workingDays} days
          </p>
        </div>
      </div>

      {/* Salary table */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Employee Salary Breakdown</CardTitle>
          <Badge variant="info">{salaryRecords.length} employees</Badge>
        </CardHeader>
        <CardContent>
          {salaryRecords.length === 0 ? (
            <p className="text-sm text-foreground/40 text-center py-8">
              No salary records to display.
            </p>
          ) : (
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
                    <th className="text-center py-3 px-4 text-foreground/50 font-medium hidden md:table-cell">
                      Present
                    </th>
                    <th className="text-center py-3 px-4 text-foreground/50 font-medium hidden md:table-cell">
                      Absent
                    </th>
                    <th className="text-center py-3 px-4 text-foreground/50 font-medium hidden lg:table-cell">
                      Late
                    </th>
                    <th className="text-center py-3 px-4 text-foreground/50 font-medium hidden lg:table-cell">
                      Half Day
                    </th>
                    <th className="text-center py-3 px-4 text-foreground/50 font-medium hidden lg:table-cell">
                      Hours
                    </th>
                    <th className="text-right py-3 px-4 text-foreground/50 font-medium">
                      Base Salary
                    </th>
                    <th className="text-right py-3 px-4 text-foreground/50 font-medium">
                      Payable
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {salaryRecords.map((record, idx) => (
                    <tr
                      key={record.employeeId}
                      className="border-b border-[var(--card-border)] hover:bg-[var(--hover-bg)] transition-colors animate-fade-in"
                      style={{ animationDelay: `${idx * 20}ms` }}
                    >
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-foreground">
                            {record.employeeName}
                          </p>
                          <p className="text-xs text-foreground/40 sm:hidden">
                            {record.department}
                          </p>
                        </div>
                      </td>
                      <td className="py-3 px-4 hidden sm:table-cell">
                        <Badge variant="info">{record.department}</Badge>
                      </td>
                      <td className="py-3 px-4 text-center hidden md:table-cell">
                        <span className="text-emerald-400 font-medium">
                          {record.totalPresent}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center hidden md:table-cell">
                        <span className="text-red-400 font-medium">
                          {record.totalAbsent}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center hidden lg:table-cell">
                        <span className="text-orange-400 font-medium">
                          {record.totalLate}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center hidden lg:table-cell">
                        <span className="text-amber-400 font-medium">
                          {record.totalHalfDay}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center hidden lg:table-cell font-mono text-foreground/60">
                        {record.totalWorkingHours}h
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-foreground/60">
                        {formatCurrency(record.baseSalary)}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="font-mono font-semibold text-foreground">
                          {formatCurrency(record.calculatedSalary)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-[var(--card-border)]">
                    <td
                      colSpan={7}
                      className="py-3 px-4 font-semibold text-foreground"
                    >
                      Total
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-foreground/60">
                      {formatCurrency(totalBaseSalary)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-emerald-400">
                      {formatCurrency(totalCalculatedSalary)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
