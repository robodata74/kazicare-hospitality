import PageHeader from "@/components/PageHeader";
import { employees } from "@/lib/data";

const statusColor: Record<string, string> = {
  Present: "bg-emerald-100 text-emerald-700",
  Late: "bg-amber-100 text-amber-700",
  Absent: "bg-rose-100 text-rose-700",
  "On Leave": "bg-sky-100 text-sky-700",
  "Off Today": "bg-neutral-100 text-neutral-500",
};

export default function EmployeesPage() {
  return (
    <>
      <PageHeader title="Employees" subtitle={`${employees.length} people across 5 departments`} />
      <div className="p-6">
        <div className="rounded-xl border border-neutral-200 bg-white overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-200 text-left text-xs text-neutral-500">
                <th className="px-5 py-3 font-medium">Employee</th>
                <th className="px-5 py-3 font-medium">Role</th>
                <th className="px-5 py-3 font-medium">Department</th>
                <th className="px-5 py-3 font-medium">Type</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {employees.map((e) => (
                <tr key={e.id} className="hover:bg-neutral-50">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-700 text-xs flex items-center justify-center font-medium">
                        {e.photoInitials}
                      </div>
                      <div>
                        <p className="font-medium">{e.name}</p>
                        <p className="text-xs text-neutral-400">{e.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-neutral-600">{e.role}</td>
                  <td className="px-5 py-3 text-neutral-600">{e.department}</td>
                  <td className="px-5 py-3 text-neutral-600">{e.employmentType}</td>
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
      </div>
    </>
  );
}
