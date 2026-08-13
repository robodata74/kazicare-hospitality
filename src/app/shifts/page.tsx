import PageHeader from "@/components/PageHeader";
import { shifts } from "@/lib/data";

const statusColor: Record<string, string> = {
  "Fully Staffed": "bg-emerald-100 text-emerald-700",
  Understaffed: "bg-rose-100 text-rose-700",
  Open: "bg-amber-100 text-amber-700",
  Completed: "bg-neutral-100 text-neutral-500",
};

export default function ShiftsPage() {
  return (
    <>
      <PageHeader title="Shifts" subtitle="Monday shift board — Downtown Bistro" />
      <div className="p-6">
        <div className="rounded-xl border border-neutral-200 bg-white overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-200 text-left text-xs text-neutral-500">
                <th className="px-5 py-3 font-medium">Employee</th>
                <th className="px-5 py-3 font-medium">Department</th>
                <th className="px-5 py-3 font-medium">Day</th>
                <th className="px-5 py-3 font-medium">Time</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {shifts.map((s) => (
                <tr key={s.id} className="hover:bg-neutral-50">
                  <td className="px-5 py-3 font-medium">{s.employee}</td>
                  <td className="px-5 py-3 text-neutral-600">{s.department}</td>
                  <td className="px-5 py-3 text-neutral-600">{s.day}</td>
                  <td className="px-5 py-3 text-neutral-600">{s.time}</td>
                  <td className="px-5 py-3">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusColor[s.status]}`}>
                      {s.status}
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
