"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";

interface SalaryMonthPickerProps {
  currentYear: number;
  currentMonth: number;
}

export function SalaryMonthPicker({
  currentYear,
  currentMonth,
}: SalaryMonthPickerProps) {
  const router = useRouter();

  const navigateTo = (year: number, month: number) => {
    router.push(`/dashboard/salary?year=${year}&month=${month}`);
  };

  const goBack = () => {
    if (currentMonth === 1) {
      navigateTo(currentYear - 1, 12);
    } else {
      navigateTo(currentYear, currentMonth - 1);
    }
  };

  const goForward = () => {
    if (currentMonth === 12) {
      navigateTo(currentYear + 1, 1);
    } else {
      navigateTo(currentYear, currentMonth + 1);
    }
  };

  const goToCurrentMonth = () => {
    const now = new Date();
    navigateTo(now.getFullYear(), now.getMonth() + 1);
  };

  const displayMonth = format(
    new Date(currentYear, currentMonth - 1),
    "MMMM yyyy"
  );

  return (
    <div className="glass rounded-2xl p-4">
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={goBack}
          className="p-2 rounded-xl hover:bg-[var(--hover-bg)] transition-colors cursor-pointer"
        >
          <ChevronLeft className="h-5 w-5 text-foreground/60" />
        </button>

        <div className="px-6 py-2 rounded-xl bg-[var(--input-bg)] border border-[var(--input-border)] min-w-[200px] text-center">
          <span className="text-sm font-semibold text-foreground">
            {displayMonth}
          </span>
        </div>

        <button
          onClick={goForward}
          className="p-2 rounded-xl hover:bg-[var(--hover-bg)] transition-colors cursor-pointer"
        >
          <ChevronRight className="h-5 w-5 text-foreground/60" />
        </button>

        <Button variant="outline" size="sm" onClick={goToCurrentMonth}>
          This Month
        </Button>
      </div>
    </div>
  );
}
