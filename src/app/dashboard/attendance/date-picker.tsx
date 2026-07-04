"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { useRouter } from "next/navigation";
import { format, addDays, subDays, parseISO } from "date-fns";

interface AttendanceDatePickerProps {
  currentDate: string;
}

export function AttendanceDatePicker({ currentDate }: AttendanceDatePickerProps) {
  const router = useRouter();

  const navigateToDate = (date: string) => {
    router.push(`/dashboard/attendance?date=${date}`);
  };

  const goBack = () => {
    const prev = format(subDays(parseISO(currentDate), 1), "yyyy-MM-dd");
    navigateToDate(prev);
  };

  const goForward = () => {
    const next = format(addDays(parseISO(currentDate), 1), "yyyy-MM-dd");
    navigateToDate(next);
  };

  const goToToday = () => {
    navigateToDate(format(new Date(), "yyyy-MM-dd"));
  };

  const displayDate = format(parseISO(currentDate), "EEEE, dd MMMM yyyy");

  return (
    <div className="glass rounded-2xl p-4">
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={goBack}
            className="p-2 rounded-xl hover:bg-[var(--hover-bg)] transition-colors cursor-pointer"
          >
            <ChevronLeft className="h-5 w-5 text-foreground/60" />
          </button>

          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--input-bg)] border border-[var(--input-border)] min-w-[240px] justify-center">
            <Calendar className="h-4 w-4 text-brand-400" />
            <span className="text-sm font-medium text-foreground">
              {displayDate}
            </span>
          </div>

          <button
            onClick={goForward}
            className="p-2 rounded-xl hover:bg-[var(--hover-bg)] transition-colors cursor-pointer"
          >
            <ChevronRight className="h-5 w-5 text-foreground/60" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <Input
            type="date"
            value={currentDate}
            onChange={(e) => {
              if (e.target.value) navigateToDate(e.target.value);
            }}
            className="w-auto"
          />
          <Button variant="outline" size="sm" onClick={goToToday}>
            Today
          </Button>
        </div>
      </div>
    </div>
  );
}
