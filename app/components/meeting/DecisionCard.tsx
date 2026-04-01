"use client";

import Card from "../ui/Card";
import { CheckCircle2 } from "lucide-react";

interface DecisionCardProps {
  text: string;
}

export default function DecisionCard({ text }: DecisionCardProps) {
  return (
    <Card className="flex items-start gap-3">
      <div className="mt-1 rounded-full bg-emerald-500/20 p-2 text-emerald-400">
        <CheckCircle2 size={18} />
      </div>
      <p className="text-slate-200">{text}</p>
    </Card>
  );
}