"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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
  MessageSquareText,
  Loader2,
  FolderOpen,
} from "lucide-react";

type Meeting = {
  id: string;
  project_name: string;
  meeting_title: string;
  transcript: string;
  decisions?: string[] | string | null;
  action_items?: { task: string; owner: string; deadline?: string }[] | string | null;
  sentiment?: string | null;
  created_at: string;
};

type ChatMessage = {
  role: "user" | "ai";
  text: string;
};

export default function DashboardPage() {
  const router = useRouter();

  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Cross-meeting AI Chat
  const [question, setQuestion] = useState("");
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [aiLoading, setAiLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

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

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, aiLoading]);

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

  // ✅ PROJECT GROUPING
  const groupedMeetings = useMemo(() => {
    const groups: Record<string, Meeting[]> = {};

    filteredMeetings.forEach((meeting) => {
      const project = meeting.project_name?.trim() || "Untitled Project";

      if (!groups[project]) {
        groups[project] = [];
      }

      groups[project].push(meeting);
    });

    return groups;
  }, [filteredMeetings]);

  const stats = useMemo(() => {
    const totalMeetings = meetings.length;

    const totalDecisions = meetings.reduce((count, meeting) => {
      if (Array.isArray(meeting.decisions)) {
        return count + meeting.decisions.length;
      }

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
      if (Array.isArray(meeting.action_items)) {
        return count + meeting.action_items.length;
      }

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
      return "bg-white/10 text-white border border-white/15";
    }

    if (value === "negative") {
      return "bg-white/10 text-white border border-white/15";
    }

    return "bg-white/10 text-white border border-white/15";
  };

  // Cross-meeting AI
  const askGlobalAI = async (customQuestion?: string) => {
    const currentQuestion = (customQuestion || question).trim();

    if (!currentQuestion || meetings.length === 0 || aiLoading) return;

    const userMessage: ChatMessage = {
      role: "user",
      text: currentQuestion,
    };

    setChat((prev) => [...prev, userMessage]);
    setQuestion("");
    setAiLoading(true);

    try {
      const combinedTranscript = meetings
        .map(
          (m) =>
            `Meeting: ${m.meeting_title}\nProject: ${m.project_name}\nTranscript:\n${m.transcript}`
        )
        .join("\n\n----------------------\n\n");

      const res = await fetch(
        "https://arjunbabu.app.n8n.cloud/webhook/llm-chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            transcript: combinedTranscript,
            question: currentQuestion,
          }),
        }
      );

      const rawText = await res.text();

      console.log("GLOBAL AI RAW RESPONSE:", rawText);

      let data: any = null;

      try {
        data = rawText ? JSON.parse(rawText) : null;
      } catch (err) {
        console.warn("AI response is not valid JSON, using raw text instead.");
      }

      const aiText =
        data?.answer ||
        data?.output ||
        data?.text ||
        rawText ||
        "I couldn't find a strong answer across your uploaded meetings.";

      const aiMessage: ChatMessage = {
        role: "ai",
        text: aiText,
      };

      setChat((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error(err);
      setChat((prev) => [
        ...prev,
        {
          role: "ai",
          text: "Something went wrong while getting the AI response.",
        },
      ]);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#1C1F24] px-4 py-8 text-[#F8FAFC] md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <div className="premium-label mb-4 inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white">
              <Sparkles size={16} />
              Meeting Intelligence Hub
            </div>

            <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
              Dashboard
            </h1>
            <p className="mt-3 max-w-2xl text-base text-[#C1C8D0] md:text-lg">
              Search transcripts, review decisions, track action items, and
              ask AI across all uploaded meetings.
            </p>
          </div>

          <div className="premium-surface w-full rounded-3xl p-5 lg:w-[360px]">
            <div className="flex items-center gap-3 mb-3">
              <BrainCircuit className="text-white" />
              <h2 className="text-lg font-semibold">AI Ready</h2>
            </div>
            <p className="text-sm leading-6 text-[#C1C8D0]">
              Your meeting assistant can extract decisions, action items, and answer questions directly from transcripts.
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
              className="premium-input w-full rounded-2xl py-4 pl-14 pr-5 text-[#F8FAFC] placeholder:text-[#98A2B3] transition focus:outline-none"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-10">
          <StatCard
            title="Total Meetings"
            value={stats.totalMeetings}
            icon={<CalendarDays className="text-white" />}
            glow="from-white/10 to-white/0"
          />
          <StatCard
            title="Decisions Extracted"
            value={stats.totalDecisions}
            icon={<CheckCircle2 className="text-white" />}
            glow="from-white/10 to-white/0"
          />
          <StatCard
            title="Action Items"
            value={stats.totalActions}
            icon={<Clock3 className="text-white" />}
            glow="from-white/10 to-white/0"
          />
          <StatCard
            title="Positive Meetings"
            value={stats.positiveCount}
            icon={<FolderKanban className="text-white" />}
            glow="from-white/10 to-white/0"
          />
        </div>

        {/* Global AI Chat */}
        <div className="premium-surface mb-10 rounded-3xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <MessageSquareText className="text-white" />
            <h2 className="text-2xl font-bold">Ask AI Across All Meetings</h2>
          </div>

          <p className="mb-5 text-[#98A2B3]">
            Ask cross-meeting questions and let AI search through all uploaded transcripts.
          </p>

          {/* Suggested prompts */}
          <div className="flex flex-wrap gap-3 mb-5">
            {[
              "Summarize all uploaded meetings",
              "What were the common blockers discussed?",
              "Why was the API launch delayed?",
              "What action items were repeated across meetings?",
            ].map((prompt) => (
              <button
                key={prompt}
                onClick={() => askGlobalAI(prompt)}
                className="premium-button-ghost rounded-full px-4 py-2 text-sm text-[#F8FAFC] transition"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Chat Window */}
          <div className="premium-panel mb-4 h-[360px] space-y-4 overflow-y-auto rounded-2xl p-4">
            {chat.length === 0 && !aiLoading && (
              <div className="text-sm leading-7 text-slate-400">
                Try asking:
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>What decisions were repeated across meetings?</li>
                  <li>What concerns came up most often?</li>
                  <li>Summarize all meetings in one paragraph.</li>
                  <li>Which topics caused the most disagreement?</li>
                </ul>
              </div>
            )}

            {chat.map((msg, index) => (
              <div
                key={`${msg.role}-${index}-${msg.text.slice(0, 20)}`}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-md ${
                    msg.role === "user"
                      ? "bg-white text-slate-900 rounded-br-sm"
                      : "bg-[#343741] text-slate-100 rounded-bl-sm"
                  }`}
                >
                  <p className="text-xs font-semibold mb-1 opacity-80">
                    {msg.role === "user" ? "You" : "Meetrix AI"}
                  </p>
                  <p className="whitespace-pre-wrap leading-7">{msg.text}</p>
                </div>
              </div>
            ))}

            {aiLoading && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-2xl rounded-bl-sm bg-[#343741] px-4 py-3 text-slate-100 shadow-md">
                  <p className="text-xs font-semibold mb-1 opacity-80">
                    Meetrix AI
                  </p>
                  <p className="inline-flex items-center gap-2">
                    <Loader2 size={16} className="animate-spin" />
                    Thinking across meetings...
                  </p>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <div className="flex gap-3">
            <input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") askGlobalAI();
              }}
              placeholder="Ask something across all meetings..."
              className="premium-input flex-1 rounded-2xl px-4 py-3 text-[#F8FAFC] placeholder:text-[#98A2B3] focus:outline-none"
            />

            <button
              onClick={() => askGlobalAI()}
              disabled={aiLoading}
              className="premium-button rounded-2xl px-5 py-3 font-semibold transition disabled:opacity-50"
            >
              Ask AI
            </button>
          </div>
        </div>

        {/* Projects & Meetings */}
        <div className="mb-6">
          <h2 className="text-2xl md:text-3xl font-bold">Projects & Meetings</h2>
          <p className="mt-1 text-[#98A2B3]">
            Meetings are grouped by project for easier navigation.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="premium-surface animate-pulse rounded-3xl p-6"
              >
                <div className="mb-4 h-6 w-1/2 rounded bg-white/10" />
                <div className="mb-3 h-4 w-1/3 rounded bg-white/10" />
                <div className="mb-6 h-4 w-2/3 rounded bg-white/10" />
                <div className="h-10 w-full rounded-2xl bg-white/10" />
              </div>
            ))}
          </div>
        ) : Object.keys(groupedMeetings).length === 0 ? (
          <div className="premium-surface rounded-3xl p-10 text-center">
            <h3 className="text-2xl font-semibold mb-2">No meetings found</h3>
            <p className="text-[#98A2B3]">
              Try a different search or upload more meeting transcripts.
            </p>
          </div>
        ) : (
          <div className="space-y-10">
            {Object.entries(groupedMeetings).map(([projectName, projectMeetings]) => (
              <div key={projectName}>
                {/* Project Header */}
                <div className="mb-5 flex items-center gap-3">
                  <div className="premium-panel flex h-12 w-12 items-center justify-center rounded-2xl">
                    <FolderOpen className="text-white" size={22} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">{projectName}</h3>
                    <p className="text-sm text-[#98A2B3]">
                      {projectMeetings.length} meeting{projectMeetings.length > 1 ? "s" : ""}
                    </p>
                  </div>
                </div>

                {/* Meetings under each project */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {projectMeetings.map((meeting) => (
                    <div
                      key={meeting.id}
                      className="premium-surface group rounded-3xl p-6 transition-all duration-300 hover:border-white/45 hover:shadow-2xl hover:shadow-black/20"
                    >
                      <div className="flex items-start justify-between gap-4 mb-5">
                        <div>
                          <h3 className="mb-2 text-2xl font-bold leading-tight transition group-hover:text-white">
                            {meeting.meeting_title || "Untitled Meeting"}
                          </h3>
                          <p className="text-sm text-[#98A2B3]">
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

                      <p className="mb-6 line-clamp-4 text-sm leading-7 text-[#C1C8D0] md:text-base">
                        {meeting.transcript || "No transcript available."}
                      </p>

                      <div className="flex items-center justify-between border-t border-white/10 pt-4">
                        <div className="text-sm text-[#98A2B3]">
                          {meeting.created_at
                            ? new Date(meeting.created_at).toLocaleString()
                            : "No date"}
                        </div>

                        <button
                          onClick={() => router.push(`/meetings/${meeting.id}`)}
                          className="premium-button inline-flex items-center gap-2 rounded-xl px-5 py-2.5 font-medium transition"
                        >
                          View Details
                          <ArrowRight size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
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
  glow,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  glow: string;
}) {
  return (
    <div
      className={`premium-surface rounded-3xl bg-gradient-to-br ${glow} p-6 shadow-lg`}
    >
      <div className="flex items-center justify-between mb-5">
        <div className="premium-panel flex h-12 w-12 items-center justify-center rounded-2xl">
          {icon}
        </div>
      </div>

      <h3 className="mb-2 text-sm text-[#98A2B3]">{title}</h3>
      <p className="text-4xl font-bold">{value}</p>
    </div>
  );
}