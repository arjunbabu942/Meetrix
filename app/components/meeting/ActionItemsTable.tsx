"use client";

import Card from "../ui/Card";

const actionItems = [
  {
    owner: "Ravi",
    task: "Prepare revised API launch timeline",
    due: "April 2, 2026",
  },
  {
    owner: "Ananya",
    task: "Coordinate with frontend team on integration blockers",
    due: "April 3, 2026",
  },
  {
    owner: "Finance Lead",
    task: "Review budget impact of delayed launch",
    due: "April 5, 2026",
  },
];

export default function ActionItemsTable() {
  return (
    <Card className="overflow-hidden p-0">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-white/10 bg-white/5 text-slate-400">
            <tr>
              <th className="px-6 py-4 font-medium">Owner</th>
              <th className="px-6 py-4 font-medium">Task</th>
              <th className="px-6 py-4 font-medium">Due Date</th>
            </tr>
          </thead>
          <tbody>
            {actionItems.map((item, index) => (
              <tr
                key={index}
                className="border-b border-white/5 text-slate-200 last:border-none"
              >
                <td className="px-6 py-4">{item.owner}</td>
                <td className="px-6 py-4">{item.task}</td>
                <td className="px-6 py-4">{item.due}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}