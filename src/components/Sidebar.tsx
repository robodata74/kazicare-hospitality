"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Users, CalendarClock, Clock, FileText, BarChart3,
  Building2, BriefcaseBusiness, FileBarChart, Settings, HelpCircle,
} from "lucide-react";

const sections = [
  { label: "MAIN", items: [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/employees", label: "Employees", icon: Users },
    { href: "/shifts", label: "Shifts", icon: CalendarClock },
    { href: "/attendance", label: "Attendance", icon: Clock },
    { href: "/leave", label: "Leave", icon: FileText },
    { href: "/analytics", label: "Analytics", icon: BarChart3 },
  ]},
  { label: "MANAGEMENT", items: [
    { href: "/departments", label: "Departments", icon: Building2 },
    { href: "/workforce", label: "Workforce", icon: BriefcaseBusiness },
    { href: "/reports", label: "Reports", icon: FileBarChart },
  ]},
  { label: "SYSTEM", items: [
    { href: "/settings", label: "Settings", icon: Settings },
    { href: "/help", label: "Help & Support", icon: HelpCircle },
  ]},
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-[var(--kc-border)] bg-[var(--kc-surface)] md:flex">
      <div className="flex h-20 items-center border-b border-[var(--kc-border)] px-5">
        <Link href="/" aria-label="KaziCare Hospitality dashboard" className="block rounded-lg">
          <Image src="/branding/kazicare-logo-dark.svg" alt="KaziCare Hospitality" width={205} height={58} priority className="h-auto max-h-12 w-auto object-contain object-left" />
        </Link>
      </div>

      <nav aria-label="Primary navigation" className="flex-1 overflow-y-auto px-3 py-5">
        {sections.map((section, sectionIndex) => (
          <div key={section.label} className={sectionIndex > 0 ? "mt-7" : ""}>
            <p className="mb-2 px-3 text-[10px] font-semibold tracking-[0.18em] text-slate-600">{section.label}</p>
            <div className="space-y-1">
              {section.items.map(({ href, label, icon: Icon }) => {
                const active = href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
                return (
                  <Link key={href} href={href} aria-current={active ? "page" : undefined}
                    className={["group flex min-h-10 items-center gap-3 rounded-xl border px-3 text-sm transition-colors duration-150",
                      active ? "border-[var(--kc-crimson)]/20 bg-[var(--kc-crimson-soft)] font-semibold text-white" : "border-transparent text-[var(--kc-muted)] hover:border-white/[0.04] hover:bg-white/[0.035] hover:text-white"].join(" ")}>
                    <Icon size={17} strokeWidth={active ? 2.2 : 1.8} className={active ? "text-[var(--kc-crimson-hover)]" : "text-slate-500 group-hover:text-slate-300"} />
                    <span>{label}</span>
                    {active && <span aria-hidden="true" className="ml-auto h-5 w-0.5 rounded-full bg-[var(--kc-crimson)]" />}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-[var(--kc-border)] p-4">
        <div className="rounded-xl border border-[var(--kc-border)] bg-white/[0.025] p-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--kc-crimson-soft)] text-xs font-bold text-[var(--kc-crimson-hover)]">KC</div>
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold text-white">KaziCare Hospitality</p>
              <p className="mt-0.5 truncate text-[11px] text-[var(--kc-muted)]">Kenya • KES</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
