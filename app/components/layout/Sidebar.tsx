"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Upload, FolderKanban } from "lucide-react";
import clsx from "clsx";

const links = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Upload", href: "/upload", icon: Upload },
  { name: "Meetings", href: "/meetings/1", icon: FolderKanban },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-72 border-r border-slate-800 bg-[#020617] md:flex md:flex-col">
      
      {/* Logo Section */}
      <div className="border-b border-slate-800 px-6 py-7">
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Meetrix
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Meeting Intelligence Hub
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-3 p-4">
        {links.map((link) => {
          const Icon = link.icon;
          const active = pathname === link.href;

          return (
            <Link
              key={link.name}
              href={link.href}
              className={clsx(
                "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all",
                active
                  ? "bg-violet-600 text-white shadow-md shadow-violet-600/20"
                  : "text-slate-400 hover:bg-[#0B1220] hover:text-white"
              )}
            >
              <Icon size={18} />
              {link.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}