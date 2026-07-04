"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import type { DepartmentSalary } from "@/lib/types";
import { useEffect, useState } from "react";
import { formatCurrency } from "@/lib/utils";

interface SalaryChartProps {
  data: DepartmentSalary[];
}

const COLORS = [
  "#818cf8", // indigo
  "#34d399", // emerald
  "#fbbf24", // amber
  "#f87171", // red
  "#60a5fa", // blue
  "#a78bfa", // violet
  "#fb923c", // orange
  "#2dd4bf", // teal
];

export function SalaryChart({ data }: SalaryChartProps) {
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

  const chartData = data.map((d) => ({
    name: d.department,
    value: d.totalSalary,
    count: d.employeeCount,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={4}
          dataKey="value"
          stroke="none"
        >
          {chartData.map((_, index) => (
            <Cell
              key={`cell-${index}`}
              fill={COLORS[index % COLORS.length]}
              className="transition-opacity duration-200 hover:opacity-80"
            />
          ))}
        </Pie>
        <Tooltip
          formatter={(value) => formatCurrency(Number(value))}
          contentStyle={{
            backgroundColor: "rgba(15, 23, 42, 0.9)",
            border: "1px solid rgba(51, 65, 85, 0.4)",
            borderRadius: "12px",
            backdropFilter: "blur(8px)",
            color: "#e2e8f0",
            fontSize: "13px",
          }}
        />
        <Legend
          iconType="circle"
          wrapperStyle={{ fontSize: "12px", color: "rgba(148,163,184,0.6)" }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
