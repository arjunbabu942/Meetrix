"use client";

import Card from "../ui/Card";
import { CheckCircle2 } from "lucide-react";

interface DecisionCardProps {
  text: string;
}

export default function DecisionCard({ text }: DecisionCardProps) {
  return (
    <Card className="flex items-start gap-3">
      <div className="mt-1 rounded-full bg-slate-700/70 p-2 text-slate-300 border border-white/15">
        <CheckCircle2 size={18} />
      </div>
      <p className="text-slate-200">{text}</p>
    </Card>
  );
}