"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  CalendarClock,
  Clock,
  FileText,
  BarChart3,
  Building2,
} from "lucide-react";

const nav = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/employees", label: "Employees", icon: Users },
  { href: "/shifts", label: "Shifts", icon: CalendarClock },
  { href: "/attendance", label: "Attendance", icon: Clock },
  { href: "/leave", label: "Leave", icon: FileText },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex w-64 shrink-0 flex-col border-r border-neutral-200 bg-white">
      <div className="flex items-center gap-2 px-5 h-16 border-b border-neutral-200">
        <div className="w-8 h-8 rounded-lg bg-rose-700 flex items-center justify-center">
          <Building2 className="w-4.5 h-4.5 text-white" size={18} />
        </div>
        <div>
          <p className="text-sm font-semibold leading-tight">KaziCare</p>
          <p className="text-[11px] text-neutral-500 leading-tight">Hospitality</p>
        </div>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {nav.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                active
                  ? "bg-rose-50 text-rose-700 font-medium"
                  : "text-neutral-600 hover:bg-neutral-100"
              }`}
            >
              <Icon size={17} />
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-neutral-200">
        <div className="flex items-center gap-2 rounded-lg bg-neutral-50 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-emerald-700 text-white text-xs flex items-center justify-center font-medium">
            GA
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium truncate">Grace Adhiambo</p>
            <p className="text-[11px] text-neutral-500 truncate">Restaurant Manager</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
