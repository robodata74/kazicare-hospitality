"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import PageHeader from "@/components/PageHeader";
import {
  Building2,
  Users,
  CalendarClock,
  Search,
  Plus,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";

const ORGANIZATION_ID = "cmsu5ut2m0000agxbj2pfr1w0";

type Department = {
  id: string;
  organizationId: string;
  name: string;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  _count: {
    employees: number;
    shifts: number;
  };
};

type DepartmentsResponse = {
  status: string;
  count: number;
  data: Department[];
};

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDepartments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `/api/departments?organizationId=${encodeURIComponent(
          ORGANIZATION_ID
        )}`,
        {
          cache: "no-store",
        }
      );

      if (!response.ok) {
        throw new Error(
          `Unable to load departments (${response.status})`
        );
      }

      const result: DepartmentsResponse = await response.json();

      if (result.status !== "ok" || !Array.isArray(result.data)) {
        throw new Error("The departments API returned an unexpected response.");
      }

      setDepartments(result.data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load departments."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  const filteredDepartments = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return departments;
    }

    return departments.filter((department) => {
      return (
        department.name.toLowerCase().includes(query) ||
        department.description?.toLowerCase().includes(query)
      );
    });
  }, [departments, search]);

  const totalEmployees = departments.reduce(
    (total, department) => total + department._count.employees,
    0
  );

  const activeDepartments = departments.filter(
    (department) => department.isActive
  ).length;

  return (
    <>
      <PageHeader
        title="Departments"
        subtitle="Organize your hospitality workforce by operational area"
      />

      <div className="space-y-6 p-4 sm:p-6 lg:p-8">
        {/* Page introduction */}
        <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-[var(--kc-crimson-hover)]">
              Workforce structure
            </p>

            <h2 className="mt-1 text-xl font-semibold tracking-tight text-white">
              Department management
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--kc-muted)]">
              Manage the operational departments that make up your
              hospitality workforce and monitor their current staffing
              levels.
            </p>
          </div>

          <button
            type="button"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[var(--kc-crimson)] px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[var(--kc-crimson-hover)] focus-visible:outline-none"
          >
            <Plus size={17} />
            Add Department
          </button>
        </section>

        {/* Summary cards */}
        <section
          aria-label="Department summary"
          className="grid grid-cols-1 gap-3 sm:grid-cols-3"
        >
          <div className="rounded-2xl border border-[var(--kc-border)] bg-[var(--kc-surface)] p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--kc-crimson-soft)] text-[var(--kc-crimson-hover)]">
                <Building2 size={18} />
              </div>

              <div>
                <p className="text-2xl font-semibold text-white">
                  {loading ? "—" : departments.length}
                </p>
                <p className="text-xs text-[var(--kc-muted)]">
                  Total departments
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--kc-border)] bg-[var(--kc-surface)] p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/10 text-sky-400">
                <Users size={18} />
              </div>

              <div>
                <p className="text-2xl font-semibold text-white">
                  {loading ? "—" : totalEmployees}
                </p>
                <p className="text-xs text-[var(--kc-muted)]">
                  Assigned employees
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--kc-border)] bg-[var(--kc-surface)] p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                <CheckCircle2 size={18} />
              </div>

              <div>
                <p className="text-2xl font-semibold text-white">
                  {loading ? "—" : activeDepartments}
                </p>
                <p className="text-xs text-[var(--kc-muted)]">
                  Active departments
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Search + refresh */}
        <section className="rounded-2xl border border-[var(--kc-border)] bg-[var(--kc-surface)]">
          <div className="flex flex-col gap-3 border-b border-[var(--kc-border)] p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative min-w-0 flex-1 sm:max-w-md">
              <Search
                size={17}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
              />

              <label htmlFor="department-search" className="sr-only">
                Search departments
              </label>

              <input
                id="department-search"
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search departments..."
                className="h-11 w-full rounded-xl border border-[var(--kc-border)] bg-white/[0.025] pl-10 pr-4 text-sm text-white placeholder:text-slate-600 focus:border-[var(--kc-crimson)] focus:outline-none"
              />
            </div>

            <button
              type="button"
              onClick={fetchDepartments}
              disabled={loading}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[var(--kc-border)] px-4 text-sm font-medium text-[var(--kc-muted)] transition-colors hover:bg-white/[0.04] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw
                size={16}
                className={loading ? "animate-spin" : ""}
              />
              Refresh
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="m-4 rounded-xl border border-red-500/20 bg-red-500/10 p-4">
              <div className="flex items-start gap-3">
                <AlertCircle
                  size={18}
                  className="mt-0.5 shrink-0 text-red-400"
                />

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-red-300">
                    Unable to load departments
                  </p>

                  <p className="mt-1 text-xs leading-5 text-red-300/70">
                    {error}
                  </p>

                  <button
                    type="button"
                    onClick={fetchDepartments}
                    className="mt-3 text-xs font-semibold text-red-300 underline underline-offset-2 hover:text-white"
                  >
                    Try again
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Loading */}
          {loading && !error && (
            <div className="divide-y divide-white/[0.06]">
              {Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className="flex animate-pulse items-center gap-4 p-5"
                >
                  <div className="h-10 w-10 rounded-xl bg-white/[0.06]" />

                  <div className="min-w-0 flex-1">
                    <div className="h-4 w-32 rounded bg-white/[0.06]" />
                    <div className="mt-2 h-3 w-48 rounded bg-white/[0.04]" />
                  </div>

                  <div className="hidden h-8 w-20 rounded-lg bg-white/[0.04] sm:block" />
                </div>
              ))}
            </div>
          )}

          {/* Empty */}
          {!loading && !error && filteredDepartments.length === 0 && (
            <div className="px-5 py-16 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.04] text-[var(--kc-muted)]">
                <Building2 size={21} />
              </div>

              <h3 className="mt-4 text-sm font-semibold text-white">
                {search
                  ? "No departments found"
                  : "No departments yet"}
              </h3>

              <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-[var(--kc-muted)]">
                {search
                  ? "Try a different search term."
                  : "Create your first department to begin organizing your workforce."}
              </p>
            </div>
          )}

          {/* Desktop table */}
          {!loading && !error && filteredDepartments.length > 0 && (
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[700px]">
                <caption className="sr-only">
                  KaziCare Hospitality departments
                </caption>

                <thead>
                  <tr className="border-b border-[var(--kc-border)] text-left">
                    <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                      Department
                    </th>

                    <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                      Employees
                    </th>

                    <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                      Shifts
                    </th>

                    <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                      Status
                    </th>

                    <th className="px-5 py-3">
                      <span className="sr-only">Action</span>
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-white/[0.06]">
                  {filteredDepartments.map((department) => (
                    <tr
                      key={department.id}
                      className="group transition-colors hover:bg-white/[0.025]"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--kc-crimson-soft)] text-[var(--kc-crimson-hover)]">
                            <Building2 size={17} />
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-white">
                              {department.name}
                            </p>

                            <p className="mt-0.5 truncate text-xs text-[var(--kc-muted)]">
                              {department.description ||
                                "Hospitality operations department"}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2 text-sm text-slate-200">
                          <Users
                            size={15}
                            className="text-[var(--kc-muted)]"
                          />
                          {department._count.employees}
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2 text-sm text-slate-200">
                          <CalendarClock
                            size={15}
                            className="text-[var(--kc-muted)]"
                          />
                          {department._count.shifts}
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={[
                            "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium",
                            department.isActive
                              ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                              : "border-slate-500/20 bg-slate-500/10 text-slate-400",
                          ].join(" ")}
                        >
                          <span
                            className={[
                              "h-1.5 w-1.5 rounded-full",
                              department.isActive
                                ? "bg-emerald-400"
                                : "bg-slate-500",
                            ].join(" ")}
                          />
                          {department.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-right">
                        <button
                          type="button"
                          aria-label={`Open ${department.name}`}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-white/[0.05] hover:text-white"
                        >
                          <ChevronRight size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Mobile cards */}
          {!loading && !error && filteredDepartments.length > 0 && (
            <div className="divide-y divide-white/[0.06] md:hidden">
              {filteredDepartments.map((department) => (
                <article
                  key={department.id}
                  className="p-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--kc-crimson-soft)] text-[var(--kc-crimson-hover)]">
                      <Building2 size={17} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="text-sm font-medium text-white">
                            {department.name}
                          </h3>

                          <p className="mt-1 text-xs text-[var(--kc-muted)]">
                            {department.description ||
                              "Hospitality operations department"}
                          </p>
                        </div>

                        <span
                          className={[
                            "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2 py-1 text-[10px] font-medium",
                            department.isActive
                              ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                              : "border-slate-500/20 bg-slate-500/10 text-slate-400",
                          ].join(" ")}
                        >
                          <span
                            className={[
                              "h-1.5 w-1.5 rounded-full",
                              department.isActive
                                ? "bg-emerald-400"
                                : "bg-slate-500",
                            ].join(" ")}
                          />
                          {department.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-2">
                        <div className="rounded-lg bg-white/[0.025] p-2.5">
                          <p className="text-[10px] uppercase tracking-wide text-slate-600">
                            Employees
                          </p>

                          <p className="mt-1 text-sm font-semibold text-white">
                            {department._count.employees}
                          </p>
                        </div>

                        <div className="rounded-lg bg-white/[0.025] p-2.5">
                          <p className="text-[10px] uppercase tracking-wide text-slate-600">
                            Shifts
                          </p>

                          <p className="mt-1 text-sm font-semibold text-white">
                            {department._count.shifts}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {!loading && !error && filteredDepartments.length > 0 && (
            <div className="border-t border-[var(--kc-border)] px-5 py-3">
              <p className="text-xs text-[var(--kc-muted)]">
                Showing{" "}
                <span className="font-medium text-slate-300">
                  {filteredDepartments.length}
                </span>{" "}
                of{" "}
                <span className="font-medium text-slate-300">
                  {departments.length}
                </span>{" "}
                departments
              </p>
            </div>
          )}
        </section>
      </div>
    </>
  );
}