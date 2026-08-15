"use client";

import { useEffect, useMemo, useState } from "react";
import PageHeader from "@/components/PageHeader";
import {
  Users,
  Building2,
  CalendarClock,
  ClipboardCheck,
  ArrowUpRight,
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Activity,
} from "lucide-react";

const ORGANIZATION_ID = "cmsu5ut2m0000agxbj2pfr1w0";

type Employee = {
  id: string;
  employeeNumber: string;
  firstName: string;
  lastName: string;
  position: string;
  employmentType: string;
  status: string;
  department?: {
    id: string;
    name: string;
  } | null;
};

type Department = {
  id: string;
  name: string;
  isActive: boolean;
  _count?: {
    employees: number;
    shifts: number;
  };
};

type EmployeesResponse = {
  status: string;
  count: number;
  data: Employee[];
};

type DepartmentsResponse = {
  status: string;
  count: number;
  data: Department[];
};

const statCards = [
  {
    key: "employees",
    label: "Employees",
    icon: Users,
    description: "Active workforce records",
    accent: "crimson",
  },
  {
    key: "departments",
    label: "Departments",
    icon: Building2,
    description: "Operational departments",
    accent: "blue",
  },
  {
    key: "shifts",
    label: "Scheduled Shifts",
    icon: CalendarClock,
    description: "Currently scheduled",
    accent: "slate",
  },
  {
    key: "attendance",
    label: "Attendance",
    icon: ClipboardCheck,
    description: "Records available",
    accent: "slate",
  },
] as const;

function StatIcon({
  icon: Icon,
  accent,
}: {
  icon: typeof Users;
  accent: "crimson" | "blue" | "slate";
}) {
  const classes = {
    crimson:
      "bg-[var(--kc-crimson-soft)] text-[var(--kc-crimson-hover)]",
    blue: "bg-sky-500/10 text-sky-300",
    slate: "bg-slate-500/10 text-slate-300",
  };

  return (
    <div
      className={`flex h-10 w-10 items-center justify-center rounded-xl ${classes[accent]}`}
    >
      <Icon size={19} strokeWidth={1.9} />
    </div>
  );
}

export default function DashboardPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadDashboard() {
      try {
        setLoading(true);
        setError("");

        const [employeesResponse, departmentsResponse] = await Promise.all([
          fetch(
            `/api/employees?organizationId=${ORGANIZATION_ID}`,
            { cache: "no-store" },
          ),
          fetch(
            `/api/departments?organizationId=${ORGANIZATION_ID}`,
            { cache: "no-store" },
          ),
        ]);

        if (!employeesResponse.ok || !departmentsResponse.ok) {
          throw new Error("Unable to load workforce data.");
        }

        const employeesData =
          (await employeesResponse.json()) as EmployeesResponse;

        const departmentsData =
          (await departmentsResponse.json()) as DepartmentsResponse;

        if (!cancelled) {
          setEmployees(employeesData.data ?? []);
          setDepartments(departmentsData.data ?? []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load workforce data.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      cancelled = true;
    };
  }, []);

  const activeEmployees = useMemo(
    () => employees.filter((employee) => employee.status === "ACTIVE"),
    [employees],
  );

  const activeDepartments = useMemo(
    () => departments.filter((department) => department.isActive),
    [departments],
  );

  const departmentCoverage = useMemo(
    () =>
      [...departments]
        .sort(
          (a, b) =>
            (b._count?.employees ?? 0) - (a._count?.employees ?? 0),
        )
        .map((department) => ({
          name: department.name,
          employees: department._count?.employees ?? 0,
          shifts: department._count?.shifts ?? 0,
        })),
    [departments],
  );

  return (
    <>
      <PageHeader
        title="Dashboard"
        subtitle="Your hospitality workforce at a glance"
      />

      <div className="space-y-6 p-4 sm:p-6 lg:p-8">
        {/* Welcome / overview */}
        <section className="relative overflow-hidden rounded-2xl border border-[var(--kc-border)] bg-[var(--kc-surface)] p-5 sm:p-6">
          <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-[var(--kc-crimson)] opacity-[0.06] blur-3xl" />

          <div className="relative">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[var(--kc-crimson)]" />
                  <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--kc-muted)]">
                    Operations Overview
                  </span>
                </div>

                <h2 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">
                  KaziCare Hospitality
                </h2>

                <p className="mt-1 max-w-2xl text-sm leading-6 text-[var(--kc-muted)]">
                  Know your workforce. Know your operation. Run your
                  hospitality business better.
                </p>
              </div>

              <div className="shrink-0 rounded-xl border border-[var(--kc-border)] bg-white/[0.025] px-4 py-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-600">
                  Workspace
                </p>
                <p className="mt-1 text-sm font-medium text-white">
                  Kenya <span className="text-slate-600">•</span> KES
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Error */}
        {error && (
          <div
            role="alert"
            className="flex items-start gap-3 rounded-xl border border-rose-500/20 bg-rose-500/10 p-4"
          >
            <AlertTriangle
              size={18}
              className="mt-0.5 shrink-0 text-rose-400"
            />

            <div>
              <p className="text-sm font-medium text-white">
                Workforce data unavailable
              </p>
              <p className="mt-1 text-xs text-rose-200/70">{error}</p>
            </div>
          </div>
        )}

        {/* KPI cards */}
        <section
          aria-label="Workforce summary"
          className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4"
        >
          {statCards.map((card) => {
            const value =
              card.key === "employees"
                ? activeEmployees.length
                : card.key === "departments"
                  ? activeDepartments.length
                  : "—";

            const Icon = card.icon;

            return (
              <article
                key={card.key}
                className="rounded-2xl border border-[var(--kc-border)] bg-[var(--kc-surface)] p-4 transition-colors hover:border-slate-700 sm:p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <StatIcon icon={Icon} accent={card.accent} />

                  <ArrowUpRight
                    size={16}
                    className="text-slate-700"
                    aria-hidden="true"
                  />
                </div>

                <div className="mt-5">
                  <p className="text-3xl font-semibold tracking-tight text-white">
                    {loading ? "—" : value}
                  </p>

                  <p className="mt-1 text-sm font-medium text-slate-300">
                    {card.label}
                  </p>

                  <p className="mt-1 text-xs text-slate-600">
                    {card.description}
                  </p>
                </div>
              </article>
            );
          })}
        </section>

        {/* Operational status */}
        <div className="grid gap-6 lg:grid-cols-3">
          <section className="rounded-2xl border border-[var(--kc-border)] bg-[var(--kc-surface)] lg:col-span-2">
            <div className="flex items-center justify-between border-b border-[var(--kc-border)] px-5 py-4">
              <div>
                <h2 className="text-sm font-semibold text-white">
                  Department Coverage
                </h2>
                <p className="mt-1 text-xs text-[var(--kc-muted)]">
                  Current workforce distribution
                </p>
              </div>

              <span className="rounded-full border border-[var(--kc-border)] px-2.5 py-1 text-[10px] font-medium text-slate-500">
                Live data
              </span>
            </div>

            <div className="divide-y divide-white/[0.05]">
              {loading ? (
                <div className="space-y-4 p-5">
                  {[1, 2, 3, 4, 5].map((item) => (
                    <div key={item} className="animate-pulse">
                      <div className="h-4 w-32 rounded bg-white/[0.06]" />
                      <div className="mt-2 h-2 w-full rounded bg-white/[0.04]" />
                    </div>
                  ))}
                </div>
              ) : departmentCoverage.length === 0 ? (
                <div className="p-8 text-center">
                  <Building2
                    size={22}
                    className="mx-auto text-slate-700"
                  />
                  <p className="mt-3 text-sm font-medium text-slate-300">
                    No departments found
                  </p>
                  <p className="mt-1 text-xs text-slate-600">
                    Department data will appear here once available.
                  </p>
                </div>
              ) : (
                departmentCoverage.map((department) => {
                  const total = activeEmployees.length || 1;
                  const percentage = Math.round(
                    (department.employees / total) * 100,
                  );

                  return (
                    <div
                      key={department.name}
                      className="px-5 py-4"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-white">
                            {department.name}
                          </p>

                          <p className="mt-0.5 text-xs text-slate-600">
                            {department.employees} employee
                            {department.employees === 1 ? "" : "s"}
                          </p>
                        </div>

                        <span className="shrink-0 text-xs font-medium text-slate-400">
                          {percentage}%
                        </span>
                      </div>

                      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                        <div
                          className="h-full rounded-full bg-[var(--kc-crimson)] transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </section>

          {/* System status */}
          <section className="rounded-2xl border border-[var(--kc-border)] bg-[var(--kc-surface)]">
            <div className="border-b border-[var(--kc-border)] px-5 py-4">
              <h2 className="text-sm font-semibold text-white">
                Operational Status
              </h2>

              <p className="mt-1 text-xs text-[var(--kc-muted)]">
                Platform readiness
              </p>
            </div>

            <div className="space-y-1 p-3">
              <StatusRow
                icon={Activity}
                label="Database"
                value="Connected"
                positive
              />

              <StatusRow
                icon={Users}
                label="Employee data"
                value={loading ? "Loading" : "Available"}
                positive={!loading}
              />

              <StatusRow
                icon={Building2}
                label="Departments"
                value={loading ? "Loading" : `${departments.length} loaded`}
                positive={!loading}
              />

              <StatusRow
                icon={CalendarClock}
                label="Shift planning"
                value="Not configured"
              />

              <StatusRow
                icon={ClipboardCheck}
                label="Attendance"
                value="No records yet"
              />
            </div>

            <div className="m-4 rounded-xl border border-[var(--kc-border)] bg-white/[0.02] p-4">
              <div className="flex items-start gap-3">
                <Clock3
                  size={17}
                  className="mt-0.5 shrink-0 text-[var(--kc-crimson-hover)]"
                />

                <div>
                  <p className="text-xs font-semibold text-white">
                    Workforce intelligence
                  </p>

                  <p className="mt-1 text-[11px] leading-5 text-slate-600">
                    Attendance, shift coverage and workforce health metrics
                    will become active as operational records are added.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Attention / next actions */}
        <section className="rounded-2xl border border-[var(--kc-border)] bg-[var(--kc-surface)]">
          <div className="border-b border-[var(--kc-border)] px-5 py-4">
            <div>
              <h2 className="text-sm font-semibold text-white">
                What Requires Attention
              </h2>

              <p className="mt-1 text-xs text-[var(--kc-muted)]">
                Operational signals from your workspace
              </p>
            </div>
          </div>

          <div className="grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-3">
            <AttentionCard
              icon={CheckCircle2}
              title="Workforce records connected"
              description={`${activeEmployees.length} active employee records are available.`}
              tone="positive"
            />

            <AttentionCard
              icon={Building2}
              title="Department structure ready"
              description={`${activeDepartments.length} active departments are configured.`}
              tone="neutral"
            />

            <AttentionCard
              icon={CalendarClock}
              title="Shift planning next"
              description="Create shift schedules to activate operational coverage insights."
              tone="attention"
            />
          </div>
        </section>
      </div>
    </>
  );
}

function StatusRow({
  icon: Icon,
  label,
  value,
  positive = false,
}: {
  icon: typeof Activity;
  label: string;
  value: string;
  positive?: boolean;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl px-3 py-3 hover:bg-white/[0.02]">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.035]">
        <Icon size={15} className="text-slate-500" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-slate-300">{label}</p>
        <p
          className={`mt-0.5 text-[11px] ${
            positive ? "text-emerald-400" : "text-slate-600"
          }`}
        >
          {value}
        </p>
      </div>

      {positive && (
        <span
          className="h-1.5 w-1.5 rounded-full bg-emerald-400"
          aria-label="Operational"
        />
      )}
    </div>
  );
}

function AttentionCard({
  icon: Icon,
  title,
  description,
  tone,
}: {
  icon: typeof CheckCircle2;
  title: string;
  description: string;
  tone: "positive" | "neutral" | "attention";
}) {
  const toneClasses = {
    positive:
      "bg-emerald-500/10 text-emerald-400 border-emerald-500/15",
    neutral:
      "bg-slate-500/10 text-slate-300 border-slate-500/15",
    attention:
      "bg-[var(--kc-crimson-soft)] text-[var(--kc-crimson-hover)] border-[var(--kc-crimson)]/20",
  };

  return (
    <div className="rounded-xl border border-[var(--kc-border)] bg-white/[0.015] p-4">
      <div
        className={`flex h-9 w-9 items-center justify-center rounded-lg border ${toneClasses[tone]}`}
      >
        <Icon size={17} />
      </div>

      <h3 className="mt-4 text-sm font-semibold text-white">{title}</h3>

      <p className="mt-1 text-xs leading-5 text-slate-600">
        {description}
      </p>
    </div>
  );
}