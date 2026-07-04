import { Header } from "@/components/header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmployeeTable } from "@/components/employee-table";
import { getEmployees, getDepartments } from "@/actions/employees";
import { Plus } from "lucide-react";
import Link from "next/link";
import { EmployeeFilters } from "./filters";

export default async function EmployeesPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; department?: string; status?: string }>;
}) {
  const params = await searchParams;
  const search = params.search || "";
  const department = params.department || "";
  const status = params.status || "";

  const [employees, departments] = await Promise.all([
    getEmployees(search, department, status),
    getDepartments(),
  ]);

  return (
    <div>
      <Header title="Employees" subtitle={`${employees.length} employees found`}>
        <Link href="/dashboard/employees/new">
          <Button size="sm">
            <Plus className="h-4 w-4" />
            Add Employee
          </Button>
        </Link>
      </Header>

      {/* Filters */}
      <EmployeeFilters departments={departments} />

      {/* Table */}
      <Card className="mt-6">
        <CardContent>
          <EmployeeTable employees={employees} />
        </CardContent>
      </Card>
    </div>
  );
}
