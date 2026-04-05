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
    <Card className="cursor-pointer space-y-4 transition-all hover:bg-[#343841]/95">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <div className="mt-2 flex items-center gap-2 text-sm text-slate-400">
            <CalendarDays size={16} />
            <span>{date}</span>
          </div>
        </div>

        <span className="premium-button-ghost rounded-full px-3 py-1 text-xs font-medium text-slate-200">
          {status}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="flex items-center gap-2 text-slate-300">
          <CheckCircle2 size={16} className="text-white" />
          <span>{actionItems} action items</span>
        </div>

        <div className="flex items-center gap-2 text-slate-300">
          <MessageSquareText size={16} className="text-white" />
          <span>{sentiment}</span>
        </div>
      </div>
    </Card>
  );
}