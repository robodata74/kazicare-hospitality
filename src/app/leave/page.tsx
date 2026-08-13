import PageHeader from "@/components/PageHeader";
import { leaveRequests } from "@/lib/data";
import { AlertTriangle } from "lucide-react";

const statusColor: Record<string, string> = {
  Approved: "bg-emerald-100 text-emerald-700",
  Pending: "bg-amber-100 text-amber-700",
  Rejected: "bg-rose-100 text-rose-700",
};

export default function LeavePage() {
  return (
    <>
      <PageHeader title="Leave" subtitle="Requests, approvals and schedule conflicts" />
      <div className="p-6">
        <div className="rounded-xl border border-neutral-200 bg-white overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-200 text-left text-xs text-neutral-500">
                <th className="px-5 py-3 font-medium">Employee</th>
                <th className="px-5 py-3 font-medium">Type</th>
                <th className="px-5 py-3 font-medium">Dates</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {leaveRequests.map((l) => (
                <tr key={l.id} className="hover:bg-neutral-50">
                  <td className="px-5 py-3">
                    <p className="font-medium">{l.employee}</p>
                    <p className="text-xs text-neutral-400">{l.department}</p>
                  </td>
                  <td className="px-5 py-3 text-neutral-600">{l.type}</td>
                  <td className="px-5 py-3 text-neutral-600">
                    {l.from === l.to ? l.from : `${l.from} – ${l.to}`}
                    {l.conflict && (
                      <span className="flex items-center gap-1 text-[11px] text-rose-600 mt-1">
                        <AlertTriangle size={11} /> Conflicts with a scheduled shift
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusColor[l.status]}`}>
                      {l.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
