"use client";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { calcProjection } from "@/lib/projection";

function formatDollar(val: number) {
  if (val >= 1000) return `$${(val / 1000).toFixed(0)}k`;
  return `$${val.toFixed(0)}`;
}

export default function ProjectionChart({
  monthlyAmount,
  yearsToGrow,
}: {
  monthlyAmount: number;
  yearsToGrow: number;
}) {
  const data = Array.from({ length: 19 }, (_, age) => ({
    age,
    value: Math.round(calcProjection(monthlyAmount, age)),
  }));

  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis
          dataKey="age"
          tickFormatter={(v) => `${v}`}
          label={{ value: "Child's age", position: "insideBottom", offset: -2, fontSize: 11 }}
          tick={{ fontSize: 11 }}
        />
        <YAxis tickFormatter={formatDollar} tick={{ fontSize: 11 }} width={42} />
        <Tooltip
          formatter={(value: number) => [`$${value.toLocaleString()}`, "Projected value"]}
          labelFormatter={(label) => `Age ${label}`}
        />
        <Line
          type="monotone"
          dataKey="value"
          stroke="#16a34a"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
