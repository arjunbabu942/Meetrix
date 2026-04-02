"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import jsPDF from "jspdf";

type ActionItem = {
  task: string;
  owner: string;
};

type Meeting = {
  id: string;
  project_name: string;
  meeting_title: string;
  transcript: string;
  decisions?: string[] | string | null;
  action_items?: ActionItem[] | string | null;
  sentiment?: string | null;
  summary?: string | null;
  created_at: string;
};

type ChatMessage = {
  role: "user" | "ai";
  text: string;
};

export default function MeetingDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [loading, setLoading] = useState(true);

  const [question, setQuestion] = useState("");
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [aiLoading, setAiLoading] = useState(false);

  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchMeeting = async () => {
      try {
        const response = await fetch(
          "https://arjunbabu.app.n8n.cloud/webhook/7971f148-6a0b-4e4e-9d5f-acb9437b6b51"
        );

        const data = await response.json();
        const meetings: Meeting[] = data.meetings || [];

        const foundMeeting = meetings.find((m) => m.id === id);
        setMeeting(foundMeeting || null);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchMeeting();
  }, [id]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, aiLoading]);

  const askAI = async () => {
    if (!question.trim() || !meeting || aiLoading) return;

    const currentQuestion = question.trim();

    const userMessage: ChatMessage = {
      role: "user",
      text: currentQuestion,
    };

    setChat((prev) => [...prev, userMessage]);
    setQuestion("");
    setAiLoading(true);

    try {
      const res = await fetch(
        "https://arjunbabu.app.n8n.cloud/webhook/llm-chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            transcript: meeting.transcript,
            question: currentQuestion,
          }),
        }
      );

      const data = await res.json();

      const aiText =
        data?.answer ||
        data?.output ||
        data?.text ||
        "I couldn't find a valid answer in this meeting transcript.";

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

  const parseDecisions = (): string[] => {
    if (!meeting?.decisions) return [];
    if (Array.isArray(meeting.decisions)) return meeting.decisions;
    try {
      return JSON.parse(meeting.decisions);
    } catch {
      return [];
    }
  };

  const parseActions = (): ActionItem[] => {
    if (!meeting?.action_items) return [];
    if (Array.isArray(meeting.action_items)) return meeting.action_items;
    try {
      return JSON.parse(meeting.action_items);
    } catch {
      return [];
    }
  };

  const getSummary = () => {
    if (meeting?.summary && meeting.summary.trim() !== "") {
      return meeting.summary;
    }

    if (!meeting?.transcript) return "No summary available.";

    const cleanTranscript = meeting.transcript
      .replace(/\n/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    return cleanTranscript.length > 260
      ? cleanTranscript.slice(0, 260) + "..."
      : cleanTranscript;
  };

  const exportCSV = () => {
    if (!meeting) return;

    const decisions = parseDecisions().join(" | ");
    const actions = parseActions()
      .map((a) => `${a.task} (Owner: ${a.owner})`)
      .join(" | ");

    const csvContent = [
      ["Project Name", meeting.project_name],
      ["Meeting Title", meeting.meeting_title],
      ["Sentiment", meeting.sentiment || "Unknown"],
      ["Summary", getSummary()],
      ["Decisions", decisions],
      ["Action Items", actions],
      ["Transcript", meeting.transcript],
    ]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${meeting.meeting_title || "meeting"}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportPDF = () => {
    if (!meeting) return;

    const doc = new jsPDF();
    let y = 15;

    const addText = (label: string, value: string) => {
      doc.setFont("helvetica", "bold");
      doc.text(label, 10, y);
      y += 7;

      doc.setFont("helvetica", "normal");
      const lines = doc.splitTextToSize(value || "-", 180);
      doc.text(lines, 10, y);
      y += lines.length * 7 + 5;
    };

    addText("Project Name:", meeting.project_name || "Untitled Project");
    addText("Meeting Title:", meeting.meeting_title || "Untitled Meeting");
    addText("Sentiment:", meeting.sentiment || "Unknown");
    addText("Summary:", getSummary());
    addText("Decisions:", parseDecisions().join("\n- "));
    addText(
      "Action Items:",
      parseActions()
        .map((a) => `${a.task} (Owner: ${a.owner})`)
        .join("\n")
    );
    addText("Transcript:", meeting.transcript || "No transcript");

    doc.save(`${meeting.meeting_title || "meeting"}.pdf`);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#020617] text-white p-6">
        Loading meeting...
      </main>
    );
  }

  if (!meeting) {
    return (
      <main className="min-h-screen bg-[#020617] text-white p-6">
        Meeting not found
      </main>
    );
  }

  const decisions = parseDecisions();
  const actions = parseActions();

  return (
    <main className="min-h-screen bg-[#020617] text-white p-6">
      <div className="max-w-6xl mx-auto">

        {/* Back Button */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <button
            onClick={() => router.push("/dashboard")}
            className="text-sm px-4 py-2 rounded-lg bg-[#111827] border border-slate-700 hover:bg-[#1F2937] transition"
          >
            ← Back to Dashboard
          </button>

          <div className="flex gap-3">
            <button
              onClick={exportCSV}
              className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 transition"
            >
              Export CSV
            </button>

            <button
              onClick={exportPDF}
              className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 transition"
            >
              Export PDF
            </button>
          </div>
        </div>

        {/* Header */}
        <div className="bg-[#0B1220] border border-slate-700/70 p-6 rounded-2xl mb-6 shadow-lg">
          <h1 className="text-3xl font-bold mb-2 text-slate-100">
            {meeting.meeting_title || "Untitled Meeting"}
          </h1>
          <p className="text-slate-300 mb-1">
            <span className="font-semibold text-white">Project:</span>{" "}
            {meeting.project_name || "Untitled Project"}
          </p>
          <p className="text-slate-300 mb-1">
            <span className="font-semibold text-white">Sentiment:</span>{" "}
            {meeting.sentiment || "Unknown"}
          </p>
          <p className="text-slate-400 text-sm">
            {new Date(meeting.created_at).toLocaleString()}
          </p>
        </div>

        {/* Summary */}
        <div className="bg-[#0B1220] border border-slate-700/70 rounded-2xl p-6 shadow-lg mb-6">
          <h2 className="text-2xl font-bold mb-3 text-violet-300">
            AI Summary
          </h2>
          <p className="text-slate-200 leading-8 text-[15px]">
            {getSummary()}
          </p>
        </div>

        {/* Top Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

          {/* AI Chat */}
          <div className="bg-[#0B1220] border border-slate-700/70 rounded-2xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-slate-100">
              Ask AI About This Meeting
            </h2>

            <div className="h-[420px] overflow-y-auto bg-[#111827] rounded-xl border border-slate-700 p-4 space-y-4 mb-4">
              {chat.length === 0 && !aiLoading && (
                <div className="text-slate-400 text-sm leading-7">
                  Try asking:
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>What were the main decisions?</li>
                    <li>What was discussed about launch?</li>
                    <li>Who is responsible for the homepage?</li>
                    <li>What concerns were raised?</li>
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
                        ? "bg-violet-600 text-white rounded-br-sm"
                        : "bg-slate-800 text-slate-100 rounded-bl-sm"
                    }`}
                  >
                    <p className="text-xs font-semibold mb-1 opacity-80">
                      {msg.role === "user" ? "You" : "AI Assistant"}
                    </p>
                    <p className="whitespace-pre-wrap leading-7">{msg.text}</p>
                  </div>
                </div>
              ))}

              {aiLoading && (
                <div className="flex justify-start">
                  <div className="bg-slate-800 text-slate-100 rounded-2xl rounded-bl-sm px-4 py-3 max-w-[80%] shadow-md">
                    <p className="text-xs font-semibold mb-1 opacity-80">
                      AI Assistant
                    </p>
                    <p className="animate-pulse">Thinking...</p>
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            <div className="flex gap-3">
              <input
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") askAI();
                }}
                placeholder="Ask something about this meeting..."
                className="flex-1 p-3 rounded-xl bg-[#111827] border border-slate-700 outline-none focus:ring-2 focus:ring-violet-500 text-white placeholder:text-slate-500"
              />

              <button
                onClick={askAI}
                disabled={aiLoading}
                className="bg-violet-600 px-5 py-3 rounded-xl font-semibold hover:bg-violet-500 transition disabled:opacity-50"
              >
                {aiLoading ? "..." : "Ask AI"}
              </button>
            </div>
          </div>

          {/* Insights */}
          <div className="space-y-6">

            {/* Decisions */}
            <div className="bg-[#0B1220] border border-slate-700/70 rounded-2xl p-6 shadow-lg">
              <h2 className="text-xl font-bold mb-4 text-slate-100">Decisions</h2>
              {decisions.length > 0 ? (
                <ul className="space-y-3">
                  {decisions.map((decision, index) => (
                    <li
                      key={`${decision}-${index}`}
                      className="bg-[#111827] rounded-xl p-3 text-slate-200 border border-slate-700/50"
                    >
                      • {decision}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-slate-400">No decisions extracted.</p>
              )}
            </div>

            {/* Action Items */}
            <div className="bg-[#0B1220] border border-slate-700/70 rounded-2xl p-6 shadow-lg">
              <h2 className="text-xl font-bold mb-4 text-slate-100">Action Items</h2>
              {actions.length > 0 ? (
                <div className="space-y-3">
                  {actions.map((item, index) => (
                    <div
                      key={`${item.task}-${item.owner}-${index}`}
                      className="bg-[#111827] rounded-xl p-4 border border-slate-700/50"
                    >
                      <p className="font-medium text-white">{item.task}</p>
                      <p className="text-sm text-slate-400 mt-1">
                        Owner: {item.owner || "Unassigned"}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-400">No action items extracted.</p>
              )}
            </div>
          </div>
        </div>

        {/* Transcript */}
        <div className="bg-[#0B1220] border border-slate-700/70 rounded-2xl p-6 shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-slate-100">Transcript</h2>
          <div className="bg-[#111827] border border-slate-700 rounded-xl p-4 max-h-[500px] overflow-y-auto">
            <p className="text-slate-300 whitespace-pre-wrap leading-8">
              {meeting.transcript || "No transcript available."}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}