import { Header } from "@/components/header";
import { Card, CardContent } from "@/components/ui/card";
import { EmployeeForm } from "@/components/employee-form";
import { Badge } from "@/components/ui/badge";
import { getEmployee, updateEmployee } from "@/actions/employees";
import { notFound } from "next/navigation";
import { formatDate, formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CalendarCheck } from "lucide-react";
import Link from "next/link";

export default async function EmployeeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const employee = await getEmployee(id);

  if (!employee) {
    notFound();
  }

  async function handleUpdate(formData: FormData) {
    "use server";
    return updateEmployee(id, formData);
  }

  return (
    <div>
      <Header title="Employee Details" subtitle={employee.name}>
        <Link href={`/dashboard/employees/${id}/attendance`}>
          <Button variant="outline" size="sm">
            <CalendarCheck className="h-4 w-4" />
            Attendance History
          </Button>
        </Link>
      </Header>

      {/* Info summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="glass rounded-xl p-4 text-center">
          <p className="text-xs text-foreground/50">Department</p>
          <p className="font-semibold text-foreground mt-1">{employee.department}</p>
        </div>
        <div className="glass rounded-xl p-4 text-center">
          <p className="text-xs text-foreground/50">Salary</p>
          <p className="font-semibold text-foreground mt-1">{formatCurrency(employee.salary)}</p>
        </div>
        <div className="glass rounded-xl p-4 text-center">
          <p className="text-xs text-foreground/50">Joined</p>
          <p className="font-semibold text-foreground mt-1">{formatDate(employee.joining_date)}</p>
        </div>
        <div className="glass rounded-xl p-4 text-center">
          <p className="text-xs text-foreground/50">Status</p>
          <div className="mt-1">
            <Badge variant={employee.status === "active" ? "success" : "danger"}>
              {employee.status === "active" ? "Active" : "Inactive"}
            </Badge>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      <Card>
        <CardContent>
          <h3 className="text-lg font-semibold text-foreground mb-6">
            Edit Employee
          </h3>
          <EmployeeForm
            employee={employee}
            action={handleUpdate}
            submitLabel="Update Employee"
          />
        </CardContent>
      </Card>
    </div>
  );
}
