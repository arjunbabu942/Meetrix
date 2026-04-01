"use client";

import Card from "../ui/Card";
import {
  CalendarDays,
  FileText,
  CheckSquare,
  SmilePlus,
} from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  change?: string;
  icon: "calendar" | "file" | "task" | "sentiment";
}

export default function StatsCard({
  title,
  value,
  change,
  icon,
}: StatsCardProps) {
  const iconMap = {
    calendar: CalendarDays,
    file: FileText,
    task: CheckSquare,
    sentiment: SmilePlus,
  };

  const Icon = iconMap[icon];

  return (
    <Card className="flex items-center justify-between">
      <div>
        <p className="text-sm text-slate-400">{title}</p>
        <h3 className="mt-2 text-3xl font-bold text-white">{value}</h3>
        {change && (
          <p className="mt-2 text-sm text-emerald-400">{change}</p>
        )}
      </div>

      <div className="rounded-2xl bg-blue-600/20 p-4 text-blue-400">
        <Icon size={24} />
      </div>
    </Card>
  );
}