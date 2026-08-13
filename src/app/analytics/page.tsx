import PageHeader from "@/components/PageHeader";
import { shiftCoverage, employees } from "@/lib/data";

export default function AnalyticsPage() {
  const totalHeadcount = employees.length;
  const onLeaveNow = employees.filter((e) => e.status === "On Leave").length;
  const avgCoverage = Math.round(
    (shiftCoverage.reduce((sum, d) => sum + d.present / d.scheduled, 0) / shiftCoverage.length) * 100
  );

  return (
    <>
      <PageHeader title="Analytics" subtitle="Workforce metrics — demo data" />
      <div className="p-6 space-y-6">
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="rounded-xl border border-neutral-200 bg-white p-5">
            <p className="text-2xl font-semibold">{totalHeadcount}</p>
            <p className="text-xs text-neutral-500 mt-1">Active headcount</p>
          </div>
          <div className="rounded-xl border border-neutral-200 bg-white p-5">
            <p className="text-2xl font-semibold">{avgCoverage}%</p>
            <p className="text-xs text-neutral-500 mt-1">Average shift coverage today</p>
          </div>
          <div className="rounded-xl border border-neutral-200 bg-white p-5">
            <p className="text-2xl font-semibold">{onLeaveNow}</p>
            <p className="text-xs text-neutral-500 mt-1">Currently on leave</p>
          </div>
        </div>

        <div className="rounded-xl border border-neutral-200 bg-white p-5">
          <h2 className="text-sm font-semibold mb-4">Coverage by department</h2>
          <div className="space-y-3">
            {shiftCoverage.map((d) => {
              const pct = Math.round((d.present / d.scheduled) * 100);
              return (
                <div key={d.department}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium">{d.department}</span>
                    <span className="text-neutral-500">{pct}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-neutral-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${pct < 70 ? "bg-rose-500" : "bg-emerald-500"}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-xl border border-dashed border-neutral-300 bg-white p-5 text-sm text-neutral-500">
          Trend charts, date-range filtering, drill-down, and PDF/CSV export connect here once the
          platform is wired to a live database and analytics API — see FINAL-BUILD-REPORT.md.
        </div>
      </div>
    </>
  );
}
