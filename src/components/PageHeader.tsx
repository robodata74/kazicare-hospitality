"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, X, LayoutDashboard, Users, CalendarClock, Clock, FileText, BarChart3, Building2 } from "lucide-react";
import { useState } from "react";
import { usePathname } from "next/navigation";

const mobileItems = [
  ["/", "Dashboard", LayoutDashboard], ["/employees", "Employees", Users],
  ["/shifts", "Shifts", CalendarClock], ["/attendance", "Attendance", Clock],
  ["/leave", "Leave", FileText], ["/analytics", "Analytics", BarChart3],
  ["/departments", "Departments", Building2],
] as const;

export default function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-[var(--kc-border)] bg-[var(--kc-background)]/95 backdrop-blur-xl">
        <div className="flex min-h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <div className="md:hidden"><Image src="/branding/kazicare-mark.svg" alt="KaziCare" width={36} height={36} className="h-9 w-9 object-contain" /></div>
            <div className="min-w-0">
              <p className="hidden text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--kc-crimson-hover)] sm:block">KaziCare Hospitality</p>
              <h1 className="truncate text-base font-semibold tracking-tight text-white sm:text-lg">{title}</h1>
              {subtitle && <p className="mt-0.5 truncate text-xs text-[var(--kc-muted)]">{subtitle}</p>}
            </div>
          </div>

          <div className="hidden items-center gap-3 sm:flex">
            <div className="text-right"><p className="text-xs font-medium text-slate-300">Kenya</p><p className="text-[11px] text-slate-600">KES • Africa/Nairobi</p></div>
            <div aria-hidden="true" className="h-8 w-px bg-[var(--kc-border)]" />
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--kc-border)] bg-[var(--kc-surface)] text-xs font-semibold text-white">KC</div>
          </div>

          <button type="button" onClick={() => setOpen(true)} aria-label="Open navigation" aria-expanded={open}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--kc-border)] text-[var(--kc-muted)] hover:bg-white/[0.04] hover:text-white md:hidden">
            <Menu size={19} />
          </button>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true" aria-label="Mobile navigation">
          <button aria-label="Close navigation" className="absolute inset-0 bg-black/70" onClick={() => setOpen(false)} />
          <aside className="absolute right-0 top-0 h-full w-[min(86vw,340px)] border-l border-[var(--kc-border)] bg-[var(--kc-surface)] p-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[var(--kc-border)] pb-5">
              <Link href="/" onClick={() => setOpen(false)}><Image src="/branding/kazicare-logo-dark.svg" alt="KaziCare Hospitality" width={185} height={52} className="h-auto w-[185px]" /></Link>
              <button onClick={() => setOpen(false)} aria-label="Close navigation" className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--kc-border)] text-[var(--kc-muted)]"><X size={19} /></button>
            </div>
            <nav className="mt-6 space-y-1" aria-label="Mobile navigation">
              {mobileItems.map(([href, label, Icon]) => {
                const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
                return <Link key={href} href={href} onClick={() => setOpen(false)} aria-current={active ? "page" : undefined}
                  className={["flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm", active ? "bg-[var(--kc-crimson-soft)] font-semibold text-white" : "text-[var(--kc-muted)] hover:bg-white/[0.04] hover:text-white"].join(" ")}>
                  <Icon size={18} className={active ? "text-[var(--kc-crimson-hover)]" : "text-slate-500"} />{label}
                </Link>;
              })}
            </nav>
            <div className="mt-8 rounded-xl border border-[var(--kc-border)] bg-white/[0.025] p-4 text-xs text-[var(--kc-muted)]">Kenya • KES<br />Africa/Nairobi</div>
          </aside>
        </div>
      )}
    </>
  );
}
