import { Bell, Search, UserCircle2 } from "lucide-react";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-[#0B1120]/60 backdrop-blur-xl">
      <div className="flex items-center justify-between px-6 py-4 md:px-8">
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-slate-400 w-[300px]">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search meetings..."
            className="w-full bg-transparent text-sm outline-none placeholder:text-slate-500"
          />
        </div>

        <div className="flex items-center gap-4">
          <button className="rounded-2xl border border-white/10 bg-white/5 p-3 text-slate-300 hover:bg-white/10">
            <Bell size={18} />
          </button>
          <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5">
            <UserCircle2 size={22} className="text-slate-300" />
            <span className="text-sm text-slate-200">Arjun</span>
          </div>
        </div>
      </div>
    </header>
  );
}