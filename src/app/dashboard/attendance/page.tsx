import { Header } from "@/components/header";
import { Card, CardContent } from "@/components/ui/card";
import { AttendanceTable } from "@/components/attendance-table";
import { getAttendanceByDate } from "@/actions/attendance";
import { getTodayISO } from "@/lib/utils";
import { AttendanceDatePicker } from "./date-picker";

export default async function AttendancePage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const params = await searchParams;
  const date = params.date || getTodayISO();
  const records = await getAttendanceByDate(date);

  const presentCount = records.filter(
    (r) =>
      r.attendance?.status === "present" || r.attendance?.status === "late"
  ).length;

  return (
    <div>
      <Header
        title="Daily Attendance"
        subtitle={`${presentCount} of ${records.length} employees present`}
      />

      {/* Date picker */}
      <AttendanceDatePicker currentDate={date} />

      {/* Attendance table */}
      <Card className="mt-6">
        <CardContent>
          <AttendanceTable
            records={records as never[]}
            date={date}
          />
        </CardContent>
      </Card>
    </div>
  );
}
