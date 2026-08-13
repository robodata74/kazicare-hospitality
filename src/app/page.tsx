import PageHeader from "@/components/PageHeader";
import { kpi, shiftCoverage, attentionItems, workforceHealthScore } from "@/lib/data";
import { AlertTriangle, AlertCircle, Info, ChevronRight } from "lucide-react";

const kpiCards = [
  { label: "Scheduled", value: kpi.scheduled, tone: "neutral" },
  { label: "Present", value: kpi.present, tone: "good" },
  { label: "Late", value: kpi.late, tone: "warn" },
  { label: "Absent", value: kpi.absent, tone: "bad" },
  { label: "On Leave", value: kpi.onLeave, tone: "neutral" },
  { label: "Critical Issues", value: kpi.criticalIssues, tone: "bad" },
];

const toneClasses: Record<string, string> = {
  good: "text-emerald-700",
  warn: "text-amber-600",
  bad: "text-rose-700",
  neutral: "text-neutral-900",
};

const severityStyle = {
  critical: { icon: AlertTriangle, className: "border-rose-200 bg-rose-50 text-rose-700" },
  warning: { icon: AlertCircle, className: "border-amber-200 bg-amber-50 text-amber-700" },
  info: { icon: Info, className: "border-sky-200 bg-sky-50 text-sky-700" },
} as const;

export default function DashboardPage() {
  return (
    <>
      <PageHeader title="Dashboard" subtitle="Today's workforce at a glance" />
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {kpiCards.map((c) => (
            <div key={c.label} className="rounded-xl border border-neutral-200 bg-white p-4">
              <p className={`text-2xl font-semibold ${toneClasses[c.tone]}`}>{c.value}</p>
              <p className="text-xs text-neutral-500 mt-1">{c.label}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-xl border border-neutral-200 bg-white">
            <div className="px-5 py-4 border-b border-neutral-200 flex items-center justify-between">
              <h2 className="text-sm font-semibold">Attention Required</h2>
              <span className="text-xs text-neutral-400">{attentionItems.length} items</span>
            </div>
            <ul className="divide-y divide-neutral-100">
              {attentionItems.map((item) => {
                const s = severityStyle[item.severity];
                const Icon = s.icon;
                return (
                  <li key={item.id} className="px-5 py-4 flex gap-3">
                    <div className={`shrink-0 w-8 h-8 rounded-full border flex items-center justify-center ${s.className}`}>
                      <Icon size={15} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">{item.title}</p>
                      <p className="text-xs text-neutral-500 mt-0.5">{item.detail}</p>
                    </div>
                    <button className="shrink-0 self-center text-xs font-medium text-rose-700 flex items-center gap-1 hover:underline">
                      {item.action}
                      <ChevronRight size={14} />
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="rounded-xl border border-neutral-200 bg-white p-5">
            <h2 className="text-sm font-semibold mb-1">Workforce Health Score</h2>
            <p className="text-xs text-neutral-500 mb-4">Explainable, not a black box</p>
            <div className="flex items-end gap-2 mb-4">
              <span className="text-4xl font-bold text-emerald-700">{workforceHealthScore.score}</span>
              <span className="text-neutral-400 text-sm mb-1">/ 100</span>
            </div>
            <div className="space-y-3">
              {workforceHealthScore.factors.map((f) => (
                <div key={f.label}>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium">{f.label}</span>
                    <span className="text-neutral-400">{f.weight}</span>
                  </div>
                  <p className="text-[11px] text-neutral-500">{f.note}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-neutral-200 bg-white">
          <div className="px-5 py-4 border-b border-neutral-200">
            <h2 className="text-sm font-semibold">Shift Coverage by Department</h2>
          </div>
          <div className="p-5 grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {shiftCoverage.map((d) => {
              const pct = Math.round((d.present / d.scheduled) * 100);
              const short = pct < 70;
              return (
                <div key={d.department} className="rounded-lg border border-neutral-200 p-4">
                  <p className="text-sm font-medium">{d.department}</p>
                  <p className="text-xs text-neutral-500 mb-2">
                    {d.present} / {d.scheduled} present
                  </p>
                  <div className="h-1.5 w-full rounded-full bg-neutral-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${short ? "bg-rose-500" : "bg-emerald-500"}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
