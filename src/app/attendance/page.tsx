import PageHeader from "@/components/PageHeader";
import { employees } from "@/lib/data";

const statusColor: Record<string, string> = {
  Present: "bg-emerald-100 text-emerald-700",
  Late: "bg-amber-100 text-amber-700",
  Absent: "bg-rose-100 text-rose-700",
  "On Leave": "bg-sky-100 text-sky-700",
  "Off Today": "bg-neutral-100 text-neutral-500",
};

const clockTimes: Record<string, string> = {
  "E-1001": "6:02 AM",
  "E-1002": "2:24 PM",
  "E-1003": "6:05 AM",
  "E-1004": "10:58 AM",
  "E-1005": "—",
  "E-1006": "11:03 AM",
  "E-1007": "8:00 AM",
  "E-1008": "3:55 PM",
  "E-1009": "—",
  "E-1010": "9:01 AM",
  "E-1011": "—",
  "E-1012": "10:59 AM",
};

export default function AttendancePage() {
  return (
    <>
      <PageHeader title="Attendance" subtitle="Scheduled vs. actual — today" />
      <div className="p-6">
        <div className="rounded-xl border border-neutral-200 bg-white overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-200 text-left text-xs text-neutral-500">
                <th className="px-5 py-3 font-medium">Employee</th>
                <th className="px-5 py-3 font-medium">Department</th>
                <th className="px-5 py-3 font-medium">Clock-in</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {employees.map((e) => (
                <tr key={e.id} className="hover:bg-neutral-50">
                  <td className="px-5 py-3 font-medium">{e.name}</td>
                  <td className="px-5 py-3 text-neutral-600">{e.department}</td>
                  <td className="px-5 py-3 text-neutral-600">{clockTimes[e.id]}</td>
                  <td className="px-5 py-3">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusColor[e.status]}`}>
                      {e.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-neutral-400 mt-3">
          Manager corrections to attendance records are logged with an audit trail in the production build.
        </p>
      </div>
    </>
  );
}
