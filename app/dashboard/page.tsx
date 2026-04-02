"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  CalendarDays,
  FolderKanban,
  CheckCircle2,
  Clock3,
  BrainCircuit,
  ArrowRight,
  Sparkles,
} from "lucide-react";

type Meeting = {
  id: string;
  project_name: string;
  meeting_title: string;
  transcript: string;
  decisions?: string[] | string | null;
  action_items?: { task: string; owner: string }[] | string | null;
  sentiment?: string | null;
  created_at: string;
};

export default function DashboardPage() {
  const router = useRouter();

  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const response = await fetch(
          "https://arjunbabu.app.n8n.cloud/webhook/7971f148-6a0b-4e4e-9d5f-acb9437b6b51"
        );

        const text = await response.text();
        console.log("RAW DASHBOARD RESPONSE:", text);

        if (!text) {
          console.error("Empty response from n8n");
          setLoading(false);
          return;
        }

        let data;
        try {
          data = JSON.parse(text);
        } catch (err) {
          console.error("Invalid JSON from n8n:", err);
          setLoading(false);
          return;
        }

        const fetchedMeetings: Meeting[] = Array.isArray(data.meetings)
          ? data.meetings
          : [];

        setMeetings(fetchedMeetings);
      } catch (error) {
        console.error("Error fetching meetings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMeetings();
  }, []);

  const filteredMeetings = useMemo(() => {
    return meetings.filter((meeting) => {
      const title = meeting.meeting_title?.toLowerCase() || "";
      const project = meeting.project_name?.toLowerCase() || "";
      const transcript = meeting.transcript?.toLowerCase() || "";
      const q = search.toLowerCase();

      return (
        title.includes(q) || project.includes(q) || transcript.includes(q)
      );
    });
  }, [meetings, search]);

  const stats = useMemo(() => {
    const totalMeetings = meetings.length;

    const totalDecisions = meetings.reduce((count, meeting) => {
      if (Array.isArray(meeting.decisions)) return count + meeting.decisions.length;

      if (typeof meeting.decisions === "string") {
        try {
          const parsed = JSON.parse(meeting.decisions);
          return Array.isArray(parsed) ? count + parsed.length : count;
        } catch {
          return count;
        }
      }

      return count;
    }, 0);

    const totalActions = meetings.reduce((count, meeting) => {
      if (Array.isArray(meeting.action_items))
        return count + meeting.action_items.length;

      if (typeof meeting.action_items === "string") {
        try {
          const parsed = JSON.parse(meeting.action_items);
          return Array.isArray(parsed) ? count + parsed.length : count;
        } catch {
          return count;
        }
      }

      return count;
    }, 0);

    const positiveCount = meetings.filter(
      (m) => m.sentiment?.toLowerCase() === "positive"
    ).length;

    return {
      totalMeetings,
      totalDecisions,
      totalActions,
      positiveCount,
    };
  }, [meetings]);

  const getSentimentStyle = (sentiment?: string | null) => {
    const value = sentiment?.toLowerCase();

    if (value === "positive") {
      return "bg-emerald-500/10 text-emerald-300 border border-emerald-400/20";
    }

    if (value === "negative") {
      return "bg-red-500/10 text-red-300 border border-red-400/20";
    }

    return "bg-amber-500/10 text-amber-300 border border-amber-400/20";
  };

  return (
    <main className="min-h-screen bg-transparent text-white px-4 md:px-8 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Top Header */}
        <div className="mb-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-400/20 text-violet-300 px-4 py-2 rounded-full text-sm mb-4">
              <Sparkles size={16} />
              Meeting Intelligence Hub
            </div>

            <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
              Dashboard
            </h1>
            <p className="text-slate-400 mt-3 text-base md:text-lg max-w-2xl">
              Search transcripts, review decisions, track action items, and
              revisit meeting intelligence in one place.
            </p>
          </div>

          <div className="glass-card rounded-3xl p-5 w-full lg:w-[360px]">
            <div className="flex items-center gap-3 mb-3">
              <BrainCircuit className="text-violet-300" />
              <h2 className="text-lg font-semibold">AI Ready</h2>
            </div>
            <p className="text-slate-300 text-sm leading-6">
              Your meeting assistant can extract decisions, action items, and
              answer questions directly from transcripts.
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative">
            <Search
              className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search by meeting title, project, or transcript..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#0B1220]/90 border border-slate-700/50 rounded-2xl pl-14 pr-5 py-4 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/40 transition"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-10">
          <StatCard
            title="Total Meetings"
            value={stats.totalMeetings}
            icon={<CalendarDays className="text-violet-300" />}
          />
          <StatCard
            title="Decisions Extracted"
            value={stats.totalDecisions}
            icon={<CheckCircle2 className="text-emerald-300" />}
          />
          <StatCard
            title="Action Items"
            value={stats.totalActions}
            icon={<Clock3 className="text-amber-300" />}
          />
          <StatCard
            title="Positive Meetings"
            value={stats.positiveCount}
            icon={<FolderKanban className="text-cyan-300" />}
          />
        </div>

        {/* Meetings */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">Recent Meetings</h2>
            <p className="text-slate-400 mt-1">
              Open any meeting to explore transcript insights and ask AI
              questions.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="rounded-3xl border border-slate-800/70 bg-[#0F172A]/70 p-6 animate-pulse"
              >
                <div className="h-6 w-1/2 bg-slate-800 rounded mb-4" />
                <div className="h-4 w-1/3 bg-slate-800 rounded mb-3" />
                <div className="h-4 w-2/3 bg-slate-800 rounded mb-6" />
                <div className="h-10 w-full bg-slate-800 rounded-2xl" />
              </div>
            ))}
          </div>
        ) : filteredMeetings.length === 0 ? (
          <div className="glass-card rounded-3xl p-10 text-center">
            <h3 className="text-2xl font-semibold mb-2">No meetings found</h3>
            <p className="text-slate-400">
              Try a different search or upload more meeting transcripts.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredMeetings.map((meeting) => (
              <div
                key={meeting.id}
                className="glass-card dark-card-hover rounded-3xl p-6"
              >
                <div className="flex items-start justify-between gap-4 mb-5">
                  <div>
                    <h3 className="text-2xl font-bold leading-tight mb-2 text-slate-100">
                      {meeting.meeting_title || "Untitled Meeting"}
                    </h3>
                    <p className="text-slate-400 text-sm">
                      {meeting.project_name || "Unknown Project"}
                    </p>
                  </div>

                  <span
                    className={`text-xs px-3 py-1.5 rounded-full font-medium whitespace-nowrap ${getSentimentStyle(
                      meeting.sentiment
                    )}`}
                  >
                    {meeting.sentiment || "Neutral"}
                  </span>
                </div>

                <p className="text-slate-300 leading-7 text-sm md:text-base line-clamp-4 mb-6">
                  {meeting.transcript || "No transcript available."}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-slate-800/70">
                  <div className="text-sm text-slate-500">
                    {meeting.created_at
                      ? new Date(meeting.created_at).toLocaleString()
                      : "No date"}
                  </div>

                  <button
                    onClick={() => router.push(`/meetings/${meeting.id}`)}
                    className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-500 px-5 py-2.5 rounded-xl font-medium transition"
                  >
                    View Details
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="glass-card rounded-3xl p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="w-12 h-12 rounded-2xl bg-[#111827] border border-slate-700/60 flex items-center justify-center">
          {icon}
        </div>
      </div>

      <h3 className="text-slate-400 text-sm mb-2">{title}</h3>
      <p className="text-4xl font-bold">{value}</p>
    </div>
  );
}