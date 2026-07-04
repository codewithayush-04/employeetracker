import { Header } from "@/components/header";
import { Card, CardContent } from "@/components/ui/card";
import { EmployeeForm } from "@/components/employee-form";
import { createEmployee } from "@/actions/employees";

export default function NewEmployeePage() {
  return (
    <div>
      <Header title="Add Employee" subtitle="Create a new employee record" />

      <Card>
        <CardContent>
          <EmployeeForm
            action={createEmployee}
            submitLabel="Create Employee"
          />
        </CardContent>
      </Card>
    </div>
  );
}
