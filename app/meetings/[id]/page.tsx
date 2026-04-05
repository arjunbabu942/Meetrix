"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import jsPDF from "jspdf";

type ActionItem = {
  task: string;
  owner: string;
  deadline?: string;
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

      const rawText = await res.text();

      let data: any = null;

      try {
        data = rawText ? JSON.parse(rawText) : null;
      } catch {
        // fallback to raw text
      }

      const aiText =
        data?.answer ||
        data?.output ||
        data?.text ||
        rawText ||
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

  const getSentimentMeta = (sentiment?: string | null) => {
    const value = sentiment?.toLowerCase();

    if (value === "positive") {
      return {
        label: "Positive",
        color: "bg-[#BBF7D0]",
        text: "text-[#BBF7D0]",
        width: "80%",
        description:
          "This meeting had a generally positive tone with agreement and alignment.",
      };
    }

    if (value === "negative") {
      return {
        label: "Negative",
        color: "bg-[#FCA5A5]",
        text: "text-[#FCA5A5]",
        width: "30%",
        description:
          "This meeting showed tension, blockers, or disagreement in discussion.",
      };
    }

    return {
      label: "Neutral",
      color: "bg-[#FDE68A]",
      text: "text-[#FDE68A]",
      width: "50%",
      description:
        "This meeting stayed balanced without strong positive or negative tone.",
    };
  };

  const exportCSV = () => {
    if (!meeting) return;

    const decisions = parseDecisions().join(" | ");
    const actions = parseActions()
      .map(
        (a) =>
          `${a.task} (Owner: ${a.owner}, Deadline: ${
            a.deadline || "Not specified"
          })`
      )
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

      if (y > 270) {
        doc.addPage();
        y = 15;
      }
    };

    addText("Project Name:", meeting.project_name || "Untitled Project");
    addText("Meeting Title:", meeting.meeting_title || "Untitled Meeting");
    addText("Sentiment:", meeting.sentiment || "Unknown");
    addText("Summary:", getSummary());
    addText("Decisions:", parseDecisions().join("\n- "));
    addText(
      "Action Items:",
      parseActions()
        .map(
          (a) =>
            `${a.task} (Owner: ${a.owner}, Deadline: ${
              a.deadline || "Not specified"
            })`
        )
        .join("\n")
    );
    addText("Transcript:", meeting.transcript || "No transcript");

    doc.save(`${meeting.meeting_title || "meeting"}.pdf`);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#1C1F24] text-[#F8FAFC] p-6">
        Loading meeting...
      </main>
    );
  }

  if (!meeting) {
    return (
      <main className="min-h-screen bg-[#1C1F24] text-[#F8FAFC] p-6">
        Meeting not found
      </main>
    );
  }

  const decisions = parseDecisions();
  const actions = parseActions();
  const sentiment = getSentimentMeta(meeting.sentiment);

  return (
    <main className="min-h-screen bg-[#1C1F24] text-[#F8FAFC] p-6">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <button
            onClick={() => router.push("/dashboard")}
            className="premium-button-ghost rounded-lg px-4 py-2 text-sm transition"
          >
            Back to Dashboard
          </button>

          <div className="flex gap-3">
            <button
              onClick={exportCSV}
              className="premium-button rounded-lg px-4 py-2 transition"
            >
              Export CSV
            </button>

            <button
              onClick={exportPDF}
              className="premium-button rounded-lg px-4 py-2 transition"
            >
              Export PDF
            </button>
          </div>
        </div>

        {/* Header */}
        <div className="premium-surface mb-6 rounded-2xl p-6 shadow-xl">
          <h1 className="mb-2 text-3xl font-bold">
            {meeting.meeting_title || "Untitled Meeting"}
          </h1>
          <p className="mb-1 text-[#C1C8D0]">
            <span className="font-semibold text-white">Project:</span>{" "}
            {meeting.project_name || "Untitled Project"}
          </p>
          <p className="mb-1 text-[#C1C8D0]">
            <span className="font-semibold text-white">Sentiment:</span>{" "}
            {meeting.sentiment || "Unknown"}
          </p>
          <p className="text-sm text-[#98A2B3]">
            {new Date(meeting.created_at).toLocaleString()}
          </p>
        </div>

        {/* Summary */}
        <div className="premium-surface mb-6 rounded-2xl p-6 shadow-xl">
          <h2 className="text-2xl font-bold mb-3 text-white">AI Summary</h2>
          <p className="text-[15px] leading-8 text-[#C1C8D0]">{getSummary()}</p>
        </div>

        {/* Sentiment Visualization */}
        <div className="premium-surface mb-6 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Meeting Sentiment</h2>
            <span
              className={`text-sm font-semibold px-3 py-1 rounded-full border border-white/15 bg-white/5 ${sentiment.text}`}
            >
              {sentiment.label}
            </span>
          </div>

          <div className="mb-4 h-4 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className={`h-full ${sentiment.color} transition-all duration-700`}
              style={{ width: sentiment.width }}
            />
          </div>

          <p className="leading-7 text-[#C1C8D0]">{sentiment.description}</p>
        </div>

        {/* Top Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* AI Chat */}
          <div className="premium-surface rounded-2xl p-6 shadow-xl">
            <h2 className="text-2xl font-bold mb-4">Ask AI About This Meeting</h2>

            <div className="premium-panel mb-4 h-[420px] space-y-4 overflow-y-auto rounded-xl p-4">
              {chat.length === 0 && !aiLoading && (
                <div className="text-sm leading-7 text-[#98A2B3]">
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
                        ? "bg-white text-slate-900 rounded-br-sm"
                        : "premium-panel text-[#F8FAFC] rounded-bl-sm"
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
                  <div className="premium-panel max-w-[80%] rounded-2xl rounded-bl-sm px-4 py-3 text-[#F8FAFC] shadow-md">
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
                className="premium-input flex-1 rounded-xl p-3 outline-none"
              />

              <button
                onClick={askAI}
                disabled={aiLoading}
                className="premium-button rounded-xl px-5 py-3 font-semibold transition disabled:opacity-50"
              >
                {aiLoading ? "..." : "Ask AI"}
              </button>
            </div>
          </div>

          {/* Insights */}
          <div className="space-y-6">
            {/* Decisions Table */}
            <div className="premium-surface rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">Decisions</h2>
                <span className="rounded-full border border-[#434C58] bg-white/10 px-3 py-1 text-xs text-white">
                  {decisions.length} Found
                </span>
              </div>

              {decisions.length > 0 ? (
                <div className="overflow-x-auto rounded-xl border border-white/10">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-white/5 text-[#C1C8D0] uppercase tracking-wide text-xs">
                      <tr>
                        <th className="px-4 py-3 border-b border-white/10 w-16">#</th>
                        <th className="px-4 py-3 border-b border-white/10">Decision</th>
                      </tr>
                    </thead>
                    <tbody>
                      {decisions.map((decision, index) => (
                        <tr
                          key={`${decision}-${index}`}
                          className="hover:bg-white/5 transition"
                        >
                          <td className="border-b border-white/5 px-4 py-4 font-medium text-[#98A2B3]">
                            {index + 1}
                          </td>
                          <td className="border-b border-white/5 px-4 py-4 text-[#C1C8D0]">
                            {decision}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-white/10 bg-white/5 px-4 py-6 text-center text-[#98A2B3]">
                  No decisions extracted.
                </div>
              )}
            </div>

            {/* Action Items Table */}
            <div className="premium-surface rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">Action Items</h2>
                <span className="rounded-full border border-[#434C58] bg-white/10 px-3 py-1 text-xs text-white">
                  {actions.length} Tasks
                </span>
              </div>

              {actions.length > 0 ? (
                <div className="overflow-x-auto rounded-xl border border-white/10">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-white/5 text-[#C1C8D0] uppercase tracking-wide text-xs">
                      <tr>
                        <th className="px-4 py-3 border-b border-white/10 w-16">#</th>
                        <th className="px-4 py-3 border-b border-white/10">Task</th>
                        <th className="px-4 py-3 border-b border-white/10">Owner</th>
                        <th className="px-4 py-3 border-b border-white/10">Deadline</th>
                      </tr>
                    </thead>
                    <tbody>
                      {actions.map((item, index) => (
                        <tr
                          key={`${item.task}-${item.owner}-${index}`}
                          className="hover:bg-white/5 transition"
                        >
                          <td className="border-b border-white/5 px-4 py-4 font-medium text-[#98A2B3]">
                            {index + 1}
                          </td>
                          <td className="border-b border-white/5 px-4 py-4 font-medium text-[#C1C8D0]">
                            {item.task || "No task found"}
                          </td>
                          <td className="border-b border-white/5 px-4 py-4 text-[#C1C8D0]">
                            {item.owner || "Unassigned"}
                          </td>
                          <td className="border-b border-white/5 px-4 py-4 text-[#98A2B3]">
                            {item.deadline || "Not specified"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-white/10 bg-white/5 px-4 py-6 text-center text-[#98A2B3]">
                  No action items extracted.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Transcript */}
        <div className="premium-surface rounded-2xl p-6 shadow-xl">
          <h2 className="text-2xl font-bold mb-4">Transcript</h2>
          <div className="premium-panel max-h-[500px] overflow-y-auto rounded-xl p-4">
            <p className="whitespace-pre-wrap leading-8 text-[#C1C8D0]">
              {meeting.transcript || "No transcript available."}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}