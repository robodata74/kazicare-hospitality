"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import PageHeader from "@/components/PageHeader";
import { Activity, AlertTriangle, Building2, CheckCircle2, Users, BriefcaseBusiness, Info, RefreshCw } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const ORGANIZATION_ID = "cmsu5ut2m0000agxbj2pfr1w0";

type Employee = { id: string; firstName: string; lastName: string; employmentType: string; status: string; department?: { name: string } | null };
type Department = { id: string; name: string; isActive: boolean; _count?: { employees: number; shifts: number } };
type ApiResponse<T> = { status: string; data?: T[]; count?: number; message?: string };

const employmentLabels: Record<string, string> = { FULL_TIME: "Full-time", PART_TIME: "Part-time", CASUAL: "Casual", CONTRACT: "Contract", INTERN: "Intern" };

export default function AnalyticsPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      setLoading(true); setError("");
      const [e, d] = await Promise.all([
        fetch(`/api/employees?organizationId=${ORGANIZATION_ID}`, { cache: "no-store" }),
        fetch(`/api/departments?organizationId=${ORGANIZATION_ID}`, { cache: "no-store" }),
      ]);
      const [er, dr] = await Promise.all([e.json() as Promise<ApiResponse<Employee>>, d.json() as Promise<ApiResponse<Department>>]);
      if (!e.ok || !d.ok || er.status !== "ok" || dr.status !== "ok") throw new Error("Live workforce data could not be loaded.");
      setEmployees(er.data ?? []); setDepartments(dr.data ?? []);
    } catch (err) { setError(err instanceof Error ? err.message : "Unable to load analytics."); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { void load(); }, [load]);

  const activeEmployees = employees.filter((e) => e.status === "ACTIVE");
  const departmentRows = useMemo(() => [...departments].sort((a,b) => (b._count?.employees ?? 0) - (a._count?.employees ?? 0)).map(d => ({ ...d, employees: d._count?.employees ?? 0 })), [departments]);
  const typeRows = useMemo(() => Object.entries(employees.reduce<Record<string, number>>((acc, e) => { acc[e.employmentType] = (acc[e.employmentType] ?? 0) + 1; return acc; }, {})).sort((a,b) => b[1]-a[1]), [employees]);
  const coverageTotal = employees.length ? Math.round((activeEmployees.length / employees.length) * 100) : 0;
  const readinessCards: { label: string; state: string; icon: LucideIcon; note: string }[] = [
    { label: "Workforce composition", state: "Live", icon: CheckCircle2, note: "Employee + department APIs" },
    { label: "Attendance trends", state: "Not connected", icon: Info, note: "Requires attendance API" },
    { label: "Shift coverage", state: "Not connected", icon: Info, note: "Requires shift API" },
    { label: "Leave intelligence", state: "Not connected", icon: Info, note: "Requires leave API" },
  ];

  const metricCards = [
    { icon: Users, label: "Headcount", value: loading ? "—" : String(employees.length), note: "Live employee records", tone: "crimson" },
    { icon: CheckCircle2, label: "Active workforce", value: loading ? "—" : String(activeEmployees.length), note: "Live status = ACTIVE", tone: "green" },
    { icon: Building2, label: "Departments", value: loading ? "—" : String(departments.length), note: "Live department records", tone: "slate" },
    { icon: Activity, label: "Active workforce rate", value: loading ? "—" : `${coverageTotal}%`, note: "Calculated from employee status", tone: "crimson" },
  ] as const;

  return <>
    <PageHeader title="Analytics" subtitle="Workforce intelligence from the live KaziCare dataset" />
    <main className="space-y-6 p-4 sm:p-6 lg:p-8">
      <section className="kc-panel overflow-hidden p-5 sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="kc-label text-[var(--kc-crimson-hover)]">Executive workforce summary</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">See the workforce. Understand the operation.</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--kc-muted)]">This view uses the live employee and department APIs. Operational metrics that require attendance, shift or leave records are intentionally not presented as invented numbers.</p>
          </div>
          <button type="button" onClick={() => void load()} disabled={loading} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-[var(--kc-border)] bg-white/[0.025] px-4 text-sm font-medium text-white hover:bg-white/[0.05] disabled:opacity-50"><RefreshCw size={16} className={loading ? "animate-spin" : ""}/>Refresh</button>
        </div>
      </section>

      {error && <div role="alert" className="flex gap-3 rounded-xl border border-rose-500/20 bg-rose-500/10 p-4"><AlertTriangle size={18} className="mt-0.5 text-rose-300"/><div><p className="text-sm font-medium text-white">Analytics unavailable</p><p className="mt-1 text-xs text-rose-200/70">{error}</p></div></div>}

      <section aria-label="Workforce metrics" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {metricCards.map(({ icon: Icon, label, value, note, tone }) => (
          <article key={label} className="kc-panel p-5">
            <div className="flex items-center justify-between">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${tone === "crimson" ? "bg-[var(--kc-crimson-soft)] text-[var(--kc-crimson-hover)]" : tone === "green" ? "bg-emerald-500/10 text-emerald-300" : "bg-white/[0.05] text-slate-300"}`}><Icon size={18}/></div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-600">{tone === "slate" ? "Live" : "Live / calc."}</span>
            </div>
            <p className="mt-5 text-3xl font-semibold text-white">{value}</p>
            <p className="mt-1 text-sm font-medium text-slate-300">{label}</p>
            <p className="mt-1 text-xs text-[var(--kc-muted)]">{note}</p>
          </article>
        ))}
      </section>

      <div className="grid gap-6 xl:grid-cols-3">
        <section className="kc-panel xl:col-span-2">
          <div className="border-b border-[var(--kc-border)] px-5 py-4"><p className="text-sm font-semibold text-white">Department distribution</p><p className="mt-1 text-xs text-[var(--kc-muted)]">Employee allocation by live department count</p></div>
          <div className="space-y-5 p-5">
            {loading ? <div className="space-y-5">{[1,2,3,4,5].map(i => <div key={i} className="animate-pulse"><div className="h-3 w-28 rounded bg-white/[0.06]"/><div className="mt-2 h-2 rounded bg-white/[0.04]"/></div>)}</div> : departmentRows.length ? departmentRows.map(d => { const pct = employees.length ? Math.round((d.employees / employees.length) * 100) : 0; return <div key={d.id}><div className="mb-2 flex items-center justify-between gap-4 text-xs"><span className="font-medium text-slate-200">{d.name}</span><span className="text-[var(--kc-muted)]">{d.employees} • {pct}%</span></div><div className="h-2 overflow-hidden rounded-full bg-white/[0.05]"><div className="h-full rounded-full bg-[var(--kc-crimson)]" style={{ width: `${pct}%` }} /></div></div>; }) : <p className="text-sm text-[var(--kc-muted)]">No department data available.</p>}
          </div>
        </section>

        <section className="kc-panel">
          <div className="border-b border-[var(--kc-border)] px-5 py-4"><p className="text-sm font-semibold text-white">Employment mix</p><p className="mt-1 text-xs text-[var(--kc-muted)]">Live employee records</p></div>
          <div className="space-y-4 p-5">
            {typeRows.map(([type, count]) => <div key={type} className="flex items-center justify-between rounded-xl border border-[var(--kc-border)] bg-white/[0.02] p-3"><div className="flex items-center gap-3"><BriefcaseBusiness size={16} className="text-[var(--kc-crimson-hover)]"/><span className="text-sm text-slate-200">{employmentLabels[type] ?? type}</span></div><span className="text-sm font-semibold text-white">{count}</span></div>)}
            {!loading && !typeRows.length && <p className="text-sm text-[var(--kc-muted)]">No employment-type data available.</p>}
          </div>
        </section>
      </div>

      <section className="kc-panel">
        <div className="border-b border-[var(--kc-border)] px-5 py-4"><p className="text-sm font-semibold text-white">Operational intelligence readiness</p><p className="mt-1 text-xs text-[var(--kc-muted)]">What can be trusted today</p></div>
        <div className="grid gap-3 p-5 sm:grid-cols-2 lg:grid-cols-4">
          {readinessCards.map(({ label, state, icon: Icon, note }) => <div key={label} className="rounded-xl border border-[var(--kc-border)] bg-white/[0.02] p-4"><div className="flex items-center justify-between gap-2"><p className="text-sm font-medium text-white">{label}</p><Icon size={16} className={state === "Live" ? "text-emerald-300" : "text-slate-500"}/></div><p className="mt-2 text-[11px] font-semibold uppercase tracking-wider text-[var(--kc-muted)]">{state}</p><p className="mt-1 text-xs leading-5 text-slate-600">{note}</p></div>)}
        </div>
      </section>

      <section className="rounded-2xl border border-[var(--kc-crimson)]/20 bg-[var(--kc-crimson-soft)] p-5 sm:p-6">
        <div className="flex gap-3"><Activity size={19} className="mt-0.5 shrink-0 text-[var(--kc-crimson-hover)]"/><div><p className="text-sm font-semibold text-white">KEZIAH insight foundation</p><p className="mt-1 max-w-3xl text-sm leading-6 text-slate-300">KEZIAH will turn these verified metrics into concise manager summaries: what happened, why it matters and what requires attention. Until operational APIs are connected, she will explicitly identify unavailable data rather than inventing a conclusion.</p></div></div>
      </section>
    </main>
  </>;
}
