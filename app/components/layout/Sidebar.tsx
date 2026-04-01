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
    <aside className="hidden w-72 border-r border-white/10 bg-black/20 backdrop-blur-xl md:flex md:flex-col">
      <div className="border-b border-white/10 px-6 py-7">
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Meetrix
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Meeting Intelligence Hub
        </p>
      </div>

      <nav className="flex flex-1 flex-col gap-3 p-4">
        {links.map((link) => {
          const Icon = link.icon;
          const active = pathname === link.href;

          return (
            <Link
              key={link.name}
              href={link.href}
              className={clsx(
                "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all",
                active
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                  : "text-slate-300 hover:bg-white/10 hover:text-white"
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