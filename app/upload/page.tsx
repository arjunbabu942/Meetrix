import UploadDropzone from "../components/upload/UploadDropzone";
import UploadedFileCard from "../components/upload/UploadedFileCard";

export default function UploadPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-white">
          Upload Transcripts
        </h2>
        <p className="mt-1 text-slate-400">
          Upload .txt or .vtt transcript files for analysis
        </p>
      </div>

      <UploadDropzone />

      <div className="space-y-4">
        <div>
          <h3 className="text-2xl font-semibold text-white">
            Recently Uploaded
          </h3>
          <p className="text-sm text-slate-400">
            Preview transcript metadata before processing
          </p>
        </div>

        <div className="grid gap-6">
          <UploadedFileCard
            fileName="product-strategy-sync.txt"
            meetingDate="March 28, 2026"
            speakers={5}
            words={3240}
          />
          <UploadedFileCard
            fileName="api-launch-review.vtt"
            meetingDate="March 26, 2026"
            speakers={4}
            words={2875}
          />
        </div>
      </div>
    </div>
  );
}