import DecisionCard from "../../components/meeting/DecisionCard";
import ActionItemsTable from "../../components/meeting/ActionItemsTable";
import ChatPanel from "../../components/meeting/ChatPanel";
import SentimentSummary from "../../components/meeting/SentimentSummary";

interface MeetingDetailPageProps {
  params: {
    id: string;
  };
}

export default function MeetingDetailPage({
  params,
}: MeetingDetailPageProps) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-white">
          API Launch Review
        </h2>
        <p className="mt-1 text-slate-400">
          Meeting #{params.id} • Decisions, action items, sentiment, and
          chatbot
        </p>
      </div>

      {/* Decisions */}
      <div className="space-y-4">
        <div>
          <h3 className="text-2xl font-semibold text-white">Key Decisions</h3>
          <p className="text-sm text-slate-400">
            Important agreements identified from the transcript
          </p>
        </div>

        <div className="grid gap-4">
          <DecisionCard text="The API launch will be delayed by two weeks due to unresolved integration blockers." />
          <DecisionCard text="Finance team will review the cost impact before the revised release timeline is finalized." />
          <DecisionCard text="Frontend and backend teams will coordinate on blocker resolution before next review." />
        </div>
      </div>

      {/* Action Items */}
      <div className="space-y-4">
        <div>
          <h3 className="text-2xl font-semibold text-white">Action Items</h3>
          <p className="text-sm text-slate-400">
            Structured tasks extracted from the meeting
          </p>
        </div>

        <ActionItemsTable />
      </div>

      {/* Sentiment + Chat */}
      <div className="grid gap-6 xl:grid-cols-2">
        <SentimentSummary />
        <ChatPanel />
      </div>
    </div>
  );
}