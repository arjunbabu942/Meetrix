"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UploadCloud, FileText, Sparkles } from "lucide-react";

export default function UploadPage() {
  const router = useRouter();

  const [projectName, setProjectName] = useState("");
  const [meetingTitle, setMeetingTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [transcriptText, setTranscriptText] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle file select
  const handleFile = async (selectedFile: File) => {
    setFile(selectedFile);
    const text = await selectedFile.text();
    setTranscriptText(text);
  };

  // Upload to n8n
  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("projectName", projectName);
      formData.append("meetingTitle", meetingTitle);
      formData.append("transcript", transcriptText);
      formData.append("file", file);

      await fetch(
        "https://arjunbabu.app.n8n.cloud/webhook/a18a5c58-75c9-4d3b-806e-0f6aa0ef2bec",
        {
          method: "POST",
          body: formData,
        }
      );

      alert("Upload successful ");
      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Upload failed ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-transparent text-white px-4 md:px-8 py-8">
      <div className="max-w-3xl mx-auto">
        {/* Top */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-400/20 text-violet-300 px-4 py-2 rounded-full text-sm mb-4">
            <Sparkles size={16} />
            Upload Meeting Transcript
          </div>

          <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
            Add a New Meeting
          </h1>
          <p className="text-slate-400 mt-3 text-base md:text-lg max-w-2xl">
            Upload your transcript file and let Meetrix extract decisions,
            action items, and AI insights automatically.
          </p>
        </div>

        {/* Card */}
        <div className="glass-card rounded-3xl p-6 md:p-8">
          {/* Project Name */}
          <div className="mb-5">
            <label className="block text-sm text-slate-400 mb-2">
              Project Name
            </label>
            <input
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="e.g. Smart Hiring Platform"
              className="w-full p-4 rounded-2xl bg-[#0B1220]/90 border border-slate-700/50"
            />
          </div>

          {/* Meeting Title */}
          <div className="mb-6">
            <label className="block text-sm text-slate-400 mb-2">
              Meeting Title
            </label>
            <input
              value={meetingTitle}
              onChange={(e) => setMeetingTitle(e.target.value)}
              placeholder="e.g. Homepage Planning"
              className="w-full p-4 rounded-2xl bg-[#0B1220]/90 border border-slate-700/50"
            />
          </div>

          {/* Drag & Drop */}
          <div
            onDrop={(e) => {
              e.preventDefault();
              const droppedFile = e.dataTransfer.files[0];
              if (droppedFile) handleFile(droppedFile);
            }}
            onDragOver={(e) => e.preventDefault()}
            className="border-2 border-dashed border-slate-700/70 rounded-3xl p-10 text-center mb-6 bg-[#0B1220]/60"
          >
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-2xl bg-violet-500/10 border border-violet-400/20 flex items-center justify-center">
                <UploadCloud className="text-violet-300" size={30} />
              </div>
            </div>

            <p className="text-xl font-semibold mb-2">
              Drag & Drop your transcript
            </p>
            <p className="text-slate-400 text-sm mb-6">
              Supported formats: <span className="text-slate-300">.txt</span> and{" "}
              <span className="text-slate-300">.vtt</span>
            </p>

            <input
              type="file"
              accept=".txt,.vtt"
              onChange={(e) => {
                const selected = e.target.files?.[0];
                if (selected) handleFile(selected);
              }}
              className="hidden"
              id="fileUpload"
            />

            <label
              htmlFor="fileUpload"
              className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-500 px-5 py-3 rounded-xl cursor-pointer font-medium transition"
            >
              <FileText size={18} />
              Choose File
            </label>

            {file && (
              <p className="mt-5 text-emerald-400 text-sm font-medium">
                Selected: {file.name}
              </p>
            )}
          </div>

          {/* Upload Button */}
          <button
            onClick={handleUpload}
            disabled={loading}
            className="w-full bg-violet-600 hover:bg-violet-500 py-4 rounded-2xl font-semibold text-lg transition disabled:opacity-50"
          >
            {loading ? "Uploading..." : "Upload & Analyze"}
          </button>
        </div>
      </div>
    </main>
  );
}