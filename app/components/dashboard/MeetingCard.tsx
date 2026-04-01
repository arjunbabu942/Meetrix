"use client";

import Card from "../ui/Card";
import { CalendarDays, CheckCircle2, MessageSquareText } from "lucide-react";

interface MeetingCardProps {
  title: string;
  date: string;
  actionItems: number;
  sentiment: string;
  status: string;
}

export default function MeetingCard({
  title,
  date,
  actionItems,
  sentiment,
  status,
}: MeetingCardProps) {
  return (
    <Card className="space-y-4 hover:bg-white/10 transition-all cursor-pointer">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <div className="mt-2 flex items-center gap-2 text-sm text-slate-400">
            <CalendarDays size={16} />
            <span>{date}</span>
          </div>
        </div>

        <span className="rounded-full bg-blue-600/20 px-3 py-1 text-xs font-medium text-blue-400">
          {status}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="flex items-center gap-2 text-slate-300">
          <CheckCircle2 size={16} className="text-emerald-400" />
          <span>{actionItems} action items</span>
        </div>

        <div className="flex items-center gap-2 text-slate-300">
          <MessageSquareText size={16} className="text-yellow-400" />
          <span>{sentiment}</span>
        </div>
      </div>
    </Card>
  );
}