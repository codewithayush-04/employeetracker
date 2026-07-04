"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { AttendanceSummary } from "@/lib/types";
import { useEffect, useState } from "react";

interface AttendanceChartProps {
  data: AttendanceSummary[];
}

export function AttendanceChart({ data }: AttendanceChartProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-[300px] flex items-center justify-center">
        <div className="animate-shimmer w-full h-full rounded-xl bg-[var(--hover-bg)]" />
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} barCategoryGap="20%">
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
        <XAxis
          dataKey="date"
          tick={{ fill: "rgba(148,163,184,0.6)", fontSize: 12 }}
          axisLine={{ stroke: "rgba(148,163,184,0.1)" }}
        />
        <YAxis
          tick={{ fill: "rgba(148,163,184,0.6)", fontSize: 12 }}
          axisLine={{ stroke: "rgba(148,163,184,0.1)" }}
          allowDecimals={false}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "rgba(15, 23, 42, 0.9)",
            border: "1px solid rgba(51, 65, 85, 0.4)",
            borderRadius: "12px",
            backdropFilter: "blur(8px)",
            color: "#e2e8f0",
            fontSize: "13px",
          }}
          cursor={{ fill: "rgba(148,163,184,0.05)" }}
        />
        <Legend
          iconType="circle"
          wrapperStyle={{ fontSize: "12px", color: "rgba(148,163,184,0.6)" }}
        />
        <Bar dataKey="present" name="Present" fill="#10b981" radius={[4, 4, 0, 0]} />
        <Bar dataKey="absent" name="Absent" fill="#ef4444" radius={[4, 4, 0, 0]} />
        <Bar dataKey="late" name="Late" fill="#f59e0b" radius={[4, 4, 0, 0]} />
        <Bar dataKey="half_day" name="Half Day" fill="#3b82f6" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
