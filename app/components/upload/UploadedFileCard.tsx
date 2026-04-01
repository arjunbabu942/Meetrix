"use client";

import Card from "../ui/Card";
import { FileText, Users, CalendarDays, FileBarChart2 } from "lucide-react";

interface UploadedFileCardProps {
  fileName: string;
  meetingDate: string;
  speakers: number;
  words: number;
}

export default function UploadedFileCard({
  fileName,
  meetingDate,
  speakers,
  words,
}: UploadedFileCardProps) {
  return (
    <Card className="space-y-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-blue-600/20 p-3 text-blue-400">
            <FileText size={20} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">{fileName}</h3>
            <p className="text-sm text-slate-400">Transcript uploaded</p>
          </div>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3 text-sm">
        <div className="flex items-center gap-2 text-slate-300">
          <CalendarDays size={16} className="text-blue-400" />
          <span>{meetingDate}</span>
        </div>
        <div className="flex items-center gap-2 text-slate-300">
          <Users size={16} className="text-purple-400" />
          <span>{speakers} speakers</span>
        </div>
        <div className="flex items-center gap-2 text-slate-300">
          <FileBarChart2 size={16} className="text-emerald-400" />
          <span>{words} words</span>
        </div>
      </div>
    </Card>
  );
}