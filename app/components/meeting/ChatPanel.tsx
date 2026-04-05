"use client";

import Card from "../ui/Card";
import { SendHorizonal } from "lucide-react";

export default function ChatPanel() {
  return (
    <Card className="space-y-4">
      <div>
        <h3 className="text-xl font-semibold text-white">Ask this meeting</h3>
        <p className="text-sm text-slate-400">
          Ask questions about decisions, action items, or context
        </p>
      </div>

      <div className="space-y-3 rounded-2xl border border-white/15 bg-[#1d2026]/75 p-4 min-h-[220px]">
        <div className="rounded-xl bg-slate-700/70 px-4 py-3 text-sm text-slate-200">
          Why did we delay the API launch?
        </div>
        <div className="rounded-xl bg-slate-800/80 px-4 py-3 text-sm text-slate-300">
          The team decided to delay the API launch because integration blockers
          were still unresolved and Finance requested additional review.
        </div>
      </div>

      <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-[#1d2026]/75 px-4 py-3">
        <input
          type="text"
          placeholder="Ask a question..."
          className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
        />
        <button className="rounded-xl bg-slate-300 p-2 text-slate-950 hover:bg-white">
          <SendHorizonal size={18} />
        </button>
      </div>
    </Card>
  );
}