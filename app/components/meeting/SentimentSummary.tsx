"use client";

import Card from "../ui/Card";
import { SmilePlus, AlertTriangle, Meh } from "lucide-react";

export default function SentimentSummary() {
  return (
    <Card className="space-y-4">
      <div>
        <h3 className="text-xl font-semibold text-white">
          Sentiment Snapshot
        </h3>
        <p className="text-sm text-slate-400">
          High-level emotional tone across the meeting
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
          <SmilePlus className="mx-auto mb-2 text-emerald-400" size={24} />
          <p className="text-sm text-slate-400">Positive</p>
          <p className="mt-1 text-xl font-bold text-white">62%</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
          <Meh className="mx-auto mb-2 text-yellow-400" size={24} />
          <p className="text-sm text-slate-400">Neutral</p>
          <p className="mt-1 text-xl font-bold text-white">24%</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
          <AlertTriangle className="mx-auto mb-2 text-red-400" size={24} />
          <p className="text-sm text-slate-400">Concern</p>
          <p className="mt-1 text-xl font-bold text-white">14%</p>
        </div>
      </div>
    </Card>
  );
}