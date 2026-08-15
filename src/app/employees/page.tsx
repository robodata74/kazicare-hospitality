"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import PageHeader from "@/components/PageHeader";
import { AlertTriangle, RefreshCw, Search, Users } from "lucide-react";

const ORGANIZATION_ID = "cmsu5ut2m0000agxbj2pfr1w0";
type EmploymentType = "FULL_TIME" | "PART_TIME" | "CASUAL" | "CONTRACT" | "INTERN";
type EmployeeStatus = "ACTIVE" | "INACTIVE" | "ON_LEAVE" | "TERMINATED";
type Employee = { id: string; employeeNumber: string; firstName: string; lastName: string; jobTitle: string; employmentType: EmploymentType; status: EmployeeStatus; department: { id: string; name: string } | null };
type Response = { status: string; count?: number; data?: Employee[]; message?: string };

const typeLabel: Record<EmploymentType, string> = { FULL_TIME: "Full-time", PART_TIME: "Part-time", CASUAL: "Casual", CONTRACT: "Contract", INTERN: "Intern" };
const statusLabel: Record<EmployeeStatus, string> = { ACTIVE: "Active", INACTIVE: "Inactive", ON_LEAVE: "On leave", TERMINATED: "Terminated" };
const statusClass: Record<EmployeeStatus, string> = {
  ACTIVE: "border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
  INACTIVE: "border-slate-500/20 bg-slate-500/10 text-slate-300",
  ON_LEAVE: "border-amber-500/20 bg-amber-500/10 text-amber-300",
  TERMINATED: "border-rose-500/20 bg-rose-500/10 text-rose-300",
};

function initials(a: string, b: string) { return `${a[0] ?? ""}${b[0] ?? ""}`.toUpperCase(); }

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("all");
  const [employmentType, setEmploymentType] = useState("all");
  const [status, setStatus] = useState("all");

  const load = useCallback(async () => {
    try {
      setLoading(true); setError("");
      const response = await fetch(`/api/employees?organizationId=${encodeURIComponent(ORGANIZATION_ID)}`, { cache: "no-store" });
      const result = (await response.json()) as Response;
      if (!response.ok || result.status !== "ok") throw new Error(result.message ?? "Unable to retrieve employees.");
      setEmployees(result.data ?? []);
    } catch (err) { setError(err instanceof Error ? err.message : "Unable to retrieve employees."); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { void load(); }, [load]);
  const departments = useMemo(() => Array.from(new Set(employees.map(e => e.department?.name).filter(Boolean) as string[])).sort(), [employees]);
  const filtered = useMemo(() => { const q = search.trim().toLowerCase(); return employees.filter(e => {
    const haystack = `${e.firstName} ${e.lastName} ${e.employeeNumber} ${e.jobTitle} ${e.department?.name ?? ""}`.toLowerCase();
    return (!q || haystack.includes(q)) && (department === "all" || e.department?.name === department) && (employmentType === "all" || e.employmentType === employmentType) && (status === "all" || e.status === status);
  }); }, [employees, search, department, employmentType, status]);
  const active = employees.filter(e => e.status === "ACTIVE").length;

  return <>
    <PageHeader title="Employees" subtitle={`${employees.length} people across ${departments.length} departments`} />
    <main className="space-y-4 p-4 sm:p-6 lg:p-8">
      <section className="kc-panel p-4 sm:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-md"><Search size={17} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-600"/><input type="search" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name, role or employee number" aria-label="Search employees" className="min-h-11 w-full rounded-xl border border-[var(--kc-border)] bg-black/10 pl-10 pr-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-[var(--kc-crimson)]" /></div>
          <div className="flex flex-wrap gap-2">
            <select value={department} onChange={e => setDepartment(e.target.value)} aria-label="Filter by department" className="min-h-10 rounded-xl border border-[var(--kc-border)] bg-[var(--kc-surface)] px-3 text-sm text-slate-200 outline-none focus:border-[var(--kc-crimson)]"><option value="all">All departments</option>{departments.map(d => <option key={d}>{d}</option>)}</select>
            <select value={employmentType} onChange={e => setEmploymentType(e.target.value)} aria-label="Filter by employment type" className="min-h-10 rounded-xl border border-[var(--kc-border)] bg-[var(--kc-surface)] px-3 text-sm text-slate-200 outline-none focus:border-[var(--kc-crimson)]"><option value="all">All types</option>{Object.entries(typeLabel).map(([v,l]) => <option key={v} value={v}>{l}</option>)}</select>
            <select value={status} onChange={e => setStatus(e.target.value)} aria-label="Filter by employee status" className="min-h-10 rounded-xl border border-[var(--kc-border)] bg-[var(--kc-surface)] px-3 text-sm text-slate-200 outline-none focus:border-[var(--kc-crimson)]"><option value="all">All statuses</option>{Object.entries(statusLabel).map(([v,l]) => <option key={v} value={v}>{l}</option>)}</select>
            <button type="button" onClick={() => void load()} disabled={loading} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-[var(--kc-border)] px-3 text-sm font-medium text-white hover:bg-white/[0.04] disabled:opacity-50"><RefreshCw size={15} className={loading ? "animate-spin" : ""}/>Refresh</button>
          </div>
        </div>
      </section>

      {!loading && !error && <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--kc-muted)]"><span>Showing <strong className="text-white">{filtered.length}</strong> of <strong className="text-white">{employees.length}</strong></span><span className="h-4 w-px bg-[var(--kc-border)]"/><span><strong className="text-emerald-300">{active}</strong> active</span><span className="ml-auto rounded-full border border-[var(--kc-border)] px-2.5 py-1">Live database</span></div>}

      {loading && <div className="kc-panel p-8"><div className="space-y-4 animate-pulse">{[1,2,3,4,5].map(i => <div key={i} className="h-12 rounded-xl bg-white/[0.04]" />)}</div></div>}
      {!loading && error && <div role="alert" className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-5"><div className="flex gap-3"><AlertTriangle size={18} className="mt-0.5 text-rose-300"/><div><p className="text-sm font-semibold text-white">Unable to load employees</p><p className="mt-1 text-xs text-rose-200/70">{error}</p><button type="button" onClick={() => void load()} className="mt-4 rounded-lg bg-[var(--kc-crimson)] px-3 py-2 text-xs font-semibold text-white hover:bg-[var(--kc-crimson-hover)]">Try again</button></div></div></div>}

      {!loading && !error && <section className="kc-panel overflow-hidden" aria-label="Employee directory">
        <div className="hidden overflow-x-auto md:block"><table className="w-full text-sm"><thead><tr className="border-b border-[var(--kc-border)] text-left text-[11px] uppercase tracking-wider text-slate-600"><th scope="col" className="px-5 py-3.5">Employee</th><th scope="col" className="px-5 py-3.5">Role</th><th scope="col" className="px-5 py-3.5">Department</th><th scope="col" className="px-5 py-3.5">Type</th><th scope="col" className="px-5 py-3.5">Status</th></tr></thead><tbody className="divide-y divide-white/[0.05]">{filtered.map(e => <tr key={e.id} className="transition-colors hover:bg-white/[0.02]"><td className="px-5 py-3.5"><div className="flex items-center gap-3"><div aria-hidden="true" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--kc-crimson-soft)] text-xs font-semibold text-[var(--kc-crimson-hover)]">{initials(e.firstName,e.lastName)}</div><div><p className="font-medium text-white">{e.firstName} {e.lastName}</p><p className="text-xs text-slate-600">{e.employeeNumber}</p></div></div></td><td className="px-5 py-3.5 text-slate-300">{e.jobTitle}</td><td className="px-5 py-3.5 text-slate-300">{e.department?.name ?? "Unassigned"}</td><td className="px-5 py-3.5 text-slate-400">{typeLabel[e.employmentType] ?? e.employmentType}</td><td className="px-5 py-3.5"><span className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-medium ${statusClass[e.status]}`}>{statusLabel[e.status]}</span></td></tr>)}</tbody></table></div>
        <div className="divide-y divide-white/[0.05] md:hidden">{filtered.map(e => <article key={e.id} className="p-4"><div className="flex items-start gap-3"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--kc-crimson-soft)] text-xs font-semibold text-[var(--kc-crimson-hover)]">{initials(e.firstName,e.lastName)}</div><div className="min-w-0 flex-1"><div className="flex items-start justify-between gap-2"><div><p className="font-medium text-white">{e.firstName} {e.lastName}</p><p className="mt-0.5 text-xs text-slate-600">{e.employeeNumber}</p></div><span className={`shrink-0 rounded-full border px-2 py-1 text-[10px] font-medium ${statusClass[e.status]}`}>{statusLabel[e.status]}</span></div><p className="mt-3 text-sm text-slate-300">{e.jobTitle}</p><p className="mt-1 text-xs text-[var(--kc-muted)]">{e.department?.name ?? "Unassigned"} • {typeLabel[e.employmentType] ?? e.employmentType}</p></div></div></article>)}{filtered.length === 0 && <div className="p-8 text-center"><Users size={22} className="mx-auto text-slate-700"/><p className="mt-3 text-sm text-slate-300">No employees match your filters.</p></div>}</div>
        {filtered.length === 0 && <div className="hidden p-10 text-center md:block"><Users size={22} className="mx-auto text-slate-700"/><p className="mt-3 text-sm text-slate-300">No employees match your filters.</p></div>}
      </section>}
    </main>
  </>;
}
