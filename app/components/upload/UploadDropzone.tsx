"use client";

import { useState } from "react";
import Card from "../ui/Card";
import { FileText, Subtitles } from "lucide-react";
import { sendTranscriptToN8n } from "../../lib/api";

export default function UploadDropzone() {
  const [projectName, setProjectName] = useState("");
  const [meetingTitle, setMeetingTitle] = useState("");
  const [transcript, setTranscript] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    if (!projectName || !meetingTitle || !transcript) {
      setMessage("Please fill all fields.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      await sendTranscriptToN8n({
        projectName,
        meetingTitle,
        transcript,
      });

      setMessage("Transcript sent successfully!");
      setProjectName("");
      setMeetingTitle("");
      setTranscript("");
    } catch (error) {
      setMessage("Failed to send transcript.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="space-y-6 p-8">
      <div>
        <h3 className="text-2xl font-semibold text-white">
          Upload Transcript
        </h3>
        <p className="mt-2 text-sm text-slate-400">
          Submit transcript text to Meetrix for processing
        </p>
      </div>

      <div className="grid gap-4">
        <input
          type="text"
          placeholder="Project Name"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500"
        />

        <input
          type="text"
          placeholder="Meeting Title"
          value={meetingTitle}
          onChange={(e) => setMeetingTitle(e.target.value)}
          className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500"
        />

        <textarea
          placeholder="Paste transcript here..."
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          rows={10}
          className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500"
        />

        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-300">
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
            <FileText size={16} className="text-blue-400" />
            <span>.txt supported</span>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
            <Subtitles size={16} className="text-purple-400" />
            <span>.vtt supported</span>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="rounded-2xl bg-blue-600 px-6 py-3 text-sm font-medium text-white hover:bg-blue-500 transition-all disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send to Meetrix"}
        </button>

        {message && (
          <p className="text-sm text-slate-300">{message}</p>
        )}
      </div>
    </Card>
  );
}