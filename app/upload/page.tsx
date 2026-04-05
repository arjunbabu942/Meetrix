"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  XCircle,
  Loader2,
  Sparkles,
  CalendarDays,
  Users,
  FileBarChart2,
} from "lucide-react";

type UploadFileStatus = {
  file: File;
  transcript: string;
  status: "pending" | "uploading" | "success" | "error";
  error?: string;
  wordCount: number;
  speakerCount: number;
  detectedDate: string;
};

export default function UploadPage() {
  const router = useRouter();

  const [projectName, setProjectName] = useState("");
  const [meetingTitle, setMeetingTitle] = useState("");
  const [files, setFiles] = useState<UploadFileStatus[]>([]);
  const [loading, setLoading] = useState(false);

  const allowedExtensions = [".txt", ".vtt"];

  const isValidFile = (file: File) => {
    const lower = file.name.toLowerCase();
    return allowedExtensions.some((ext) => lower.endsWith(ext));
  };

  const getWordCount = (text: string) => {
    return text.trim() ? text.trim().split(/\s+/).length : 0;
  };

  const getSpeakerCount = (text: string) => {
    const speakerMatches = text.match(/([A-Z][a-zA-Z]+):/g) || [];
    const uniqueSpeakers = new Set(speakerMatches.map((s) => s.replace(":", "")));
    return uniqueSpeakers.size;
  };

  const detectMeetingDate = (text: string, fileName: string) => {
    const combined = `${fileName} ${text}`;

    const datePatterns = [
      /\b\d{1,2}[/-]\d{1,2}[/-]\d{2,4}\b/,
      /\b\d{4}[/-]\d{1,2}[/-]\d{1,2}\b/,
      /\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]* \d{1,2},? \d{4}\b/i,
    ];

    for (const pattern of datePatterns) {
      const match = combined.match(pattern);
      if (match) return match[0];
    }

    return "Not detected";
  };

  const handleFiles = async (selectedFiles: FileList | File[]) => {
    const fileArray = Array.from(selectedFiles);

    const processedFiles = await Promise.all(
      fileArray.map(async (file) => {
        if (!isValidFile(file)) {
          return {
            file,
            transcript: "",
            status: "error" as const,
            error: "Unsupported file type. Only .txt and .vtt allowed.",
            wordCount: 0,
            speakerCount: 0,
            detectedDate: "Not detected",
          };
        }

        try {
          const text = await file.text();

          return {
            file,
            transcript: text,
            status: "pending" as const,
            wordCount: getWordCount(text),
            speakerCount: getSpeakerCount(text),
            detectedDate: detectMeetingDate(text, file.name),
          };
        } catch {
          return {
            file,
            transcript: "",
            status: "error" as const,
            error: "Could not read file.",
            wordCount: 0,
            speakerCount: 0,
            detectedDate: "Not detected",
          };
        }
      })
    );

    setFiles((prev) => [...prev, ...processedFiles]);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (!projectName.trim()) {
      alert("Please enter project name");
      return;
    }

    if (files.length === 0) {
      alert("Please select at least one file");
      return;
    }

    setLoading(true);

    const updatedFiles = [...files];

    for (let i = 0; i < updatedFiles.length; i++) {
      const current = updatedFiles[i];

      if (current.status === "error") continue;

      updatedFiles[i] = { ...current, status: "uploading" };
      setFiles([...updatedFiles]);

      try {
        const formData = new FormData();

        formData.append("projectName", projectName);
        formData.append(
          "meetingTitle",
          meetingTitle.trim() || current.file.name.replace(/\.[^/.]+$/, "")
        );
        formData.append("transcript", current.transcript);
        formData.append("file", current.file);

        const res = await fetch(
          "https://arjunbabu.app.n8n.cloud/webhook/a18a5c58-75c9-4d3b-806e-0f6aa0ef2bec",
          {
            method: "POST",
            body: formData,
          }
        );

        if (!res.ok) {
          throw new Error("Upload failed");
        }

        updatedFiles[i] = { ...current, status: "success" };
        setFiles([...updatedFiles]);
      } catch (err) {
        console.error(err);

        updatedFiles[i] = {
          ...current,
          status: "error",
          error: "Upload failed",
        };
        setFiles([...updatedFiles]);
      }
    }

    setLoading(false);
    alert("All uploads finished 🚀");
    router.push("/dashboard");
  };

  const totalFiles = files.length;
  const successCount = files.filter((f) => f.status === "success").length;
  const pendingCount = files.filter((f) => f.status === "pending").length;

  return (
    <main className="min-h-screen bg-[#1C1F24] px-4 py-10 text-[#F8FAFC] md:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="premium-label mb-4 inline-flex items-center gap-2 px-4 py-2 text-sm text-white">
            <Sparkles size={16} />
            Upload Meeting Transcripts
          </div>

          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">
            Add Multiple Meeting Files
          </h1>
          <p className="max-w-2xl leading-7 text-[#98A2B3]">
            Upload one or more transcript files and let Meetrix automatically
            extract decisions, action items, summaries, and sentiment insights.
          </p>
        </div>

        {/* Form */}
        <div className="premium-surface space-y-6 rounded-3xl p-6 shadow-2xl shadow-black/20 backdrop-blur-xl md:p-8">
          {/* Project Name */}
          <div>
            <label className="mb-2 block text-sm font-medium text-[#C1C8D0]">
              Project Name
            </label>
            <input
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="e.g. Smart Hiring Platform"
              className="premium-input w-full rounded-2xl px-4 py-3 text-[#F8FAFC] placeholder:text-[#98A2B3] focus:outline-none"
            />
          </div>

          {/* Meeting Title */}
          <div>
            <label className="mb-2 block text-sm font-medium text-[#C1C8D0]">
              Default Meeting Title (Optional)
            </label>
            <input
              value={meetingTitle}
              onChange={(e) => setMeetingTitle(e.target.value)}
              placeholder="e.g. Sprint Review / Leave empty to use file name"
              className="premium-input w-full rounded-2xl px-4 py-3 text-[#F8FAFC] placeholder:text-[#98A2B3] focus:outline-none"
            />
          </div>

          {/* Drag & Drop */}
          <div
            onDrop={(e) => {
              e.preventDefault();
              handleFiles(e.dataTransfer.files);
            }}
            onDragOver={(e) => e.preventDefault()}
            className="premium-panel rounded-3xl border-2 border-dashed px-6 py-12 text-center transition hover:border-white/35"
          >
            <UploadCloud className="mx-auto mb-4 text-white" size={42} />
            <h2 className="text-xl font-semibold mb-2">
              Drag & drop transcript files here
            </h2>
            <p className="text-[#98A2B3] text-sm mb-5">
              Supports multiple <span className="text-white">.txt</span> and{" "}
              <span className="text-white">.vtt</span> files
            </p>

            <input
              type="file"
              accept=".txt,.vtt"
              multiple
              onChange={(e) => {
                if (e.target.files) handleFiles(e.target.files);
              }}
              className="hidden"
              id="fileUpload"
            />

            <label
              htmlFor="fileUpload"
              className="premium-button inline-flex cursor-pointer items-center gap-2 rounded-2xl px-5 py-3 font-medium transition"
            >
              <UploadCloud size={18} />
              Browse Files
            </label>
          </div>

          {/* File Summary */}
          {files.length > 0 && (
            <div className="premium-panel rounded-3xl p-5">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <h3 className="text-xl font-semibold">Selected Files</h3>

                <div className="flex gap-3 text-sm">
                  <span className="rounded-full bg-white/10 px-3 py-1 text-slate-200">
                    Total: {totalFiles}
                  </span>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-white">
                    Uploaded: {successCount}
                  </span>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-white">
                    Pending: {pendingCount}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                {files.map((item, index) => (
                  <div
                    key={`${item.file.name}-${index}`}
                    className="premium-panel rounded-2xl p-5"
                  >
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                      <div className="flex items-start gap-3">
                        <div className="mt-1">
                          <FileText className="text-slate-200" size={20} />
                        </div>

                        <div>
                          <p className="font-medium text-white text-lg">
                            {item.file.name}
                          </p>
                          <p className="text-sm text-slate-400">
                            {(item.file.size / 1024).toFixed(1)} KB
                          </p>

                          {item.error && (
                            <p className="text-sm text-red-400 mt-1">
                              {item.error}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {item.status === "pending" && (
                          <span className="text-sm rounded-full bg-white/10 px-3 py-1 text-white">
                            Pending
                          </span>
                        )}

                        {item.status === "uploading" && (
                          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm text-white">
                            <Loader2 size={14} className="animate-spin" />
                            Uploading
                          </span>
                        )}

                        {item.status === "success" && (
                          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm text-white">
                            <CheckCircle2 size={14} />
                            Success
                          </span>
                        )}

                        {item.status === "error" && (
                          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm text-white">
                            <XCircle size={14} />
                            Error
                          </span>
                        )}

                        <button
                          onClick={() => removeFile(index)}
                          className="rounded-xl border border-white/10 px-3 py-1.5 text-sm text-slate-200 transition hover:bg-white/10"
                        >
                          Remove
                        </button>
                      </div>
                    </div>

                    {/* File Insights */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="premium-panel rounded-2xl p-4">
                        <div className="mb-2 flex items-center gap-2 text-sm text-slate-400">
                          <FileBarChart2 size={16} />
                          Word Count
                        </div>
                        <p className="text-xl font-bold text-white">
                          {item.wordCount}
                        </p>
                      </div>

                      <div className="premium-panel rounded-2xl p-4">
                        <div className="mb-2 flex items-center gap-2 text-sm text-slate-400">
                          <Users size={16} />
                          Speakers
                        </div>
                        <p className="text-xl font-bold text-white">
                          {item.speakerCount}
                        </p>
                      </div>

                      <div className="premium-panel rounded-2xl p-4">
                        <div className="mb-2 flex items-center gap-2 text-sm text-slate-400">
                          <CalendarDays size={16} />
                          Detected Date
                        </div>
                        <p className="text-xl font-bold text-white">
                          {item.detectedDate}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upload Button */}
          <button
            onClick={handleUpload}
            disabled={loading || files.length === 0}
            className="premium-button w-full rounded-2xl py-4 font-semibold transition disabled:opacity-50"
          >
            {loading ? "Uploading Files..." : "Upload & Analyze All Files"}
          </button>
        </div>
      </div>
    </main>
  );
}