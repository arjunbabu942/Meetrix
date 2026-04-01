import StatsCard from "../components/dashboard/StatsCard";
import MeetingCard from "../components/dashboard/MeetingCard";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-white">
          Dashboard
        </h2>
        <p className="mt-1 text-slate-400">
          Overview of uploaded meetings and insights
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          title="Total Meetings"
          value="24"
          change="+3 this week"
          icon="calendar"
        />
        <StatsCard
          title="Transcripts Uploaded"
          value="31"
          change="+5 this week"
          icon="file"
        />
        <StatsCard
          title="Action Items"
          value="58"
          change="12 pending"
          icon="task"
        />
        <StatsCard
          title="Avg. Sentiment"
          value="78%"
          change="Mostly positive"
          icon="sentiment"
        />
      </div>

      {/* Recent Meetings */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-semibold text-white">
              Recent Meetings
            </h3>
            <p className="text-sm text-slate-400">
              Latest uploaded meetings and quick insights
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <MeetingCard
            title="Product Strategy Sync"
            date="March 28, 2026"
            actionItems={6}
            sentiment="Mostly positive"
            status="Completed"
          />
          <MeetingCard
            title="API Launch Review"
            date="March 26, 2026"
            actionItems={9}
            sentiment="Some concerns"
            status="Flagged"
          />
          <MeetingCard
            title="Finance Planning Meeting"
            date="March 24, 2026"
            actionItems={4}
            sentiment="Neutral"
            status="Completed"
          />
          <MeetingCard
            title="Client Feedback Discussion"
            date="March 22, 2026"
            actionItems={7}
            sentiment="Mixed reactions"
            status="Review"
          />
        </div>
      </div>
    </div>
  );
}