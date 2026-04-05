import { Bell, Search, UserCircle2 } from "lucide-react";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-20 border-b border-[#434C58] bg-[rgba(28,31,36,0.95)] backdrop-blur">
      <div className="flex items-center justify-between px-6 py-4 md:px-8">
        
        {/* Search */}
        <div className="premium-panel flex w-[340px] items-center gap-3 rounded-2xl px-4 py-2.5 text-slate-300">
          <Search size={18} className="text-slate-300" />
          <input
            type="text"
            placeholder="Search meetings..."
            className="w-full bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-300/90"
          />
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          <button className="premium-button-ghost rounded-2xl p-3 text-slate-200 transition">
            <Bell size={18} />
          </button>

          <div className="premium-button-ghost flex items-center gap-2 rounded-2xl px-4 py-2.5">
            <UserCircle2 size={22} className="text-slate-200" />
            <span className="text-sm text-slate-100">Arjun</span>
          </div>
        </div>
      </div>
    </header>
  );
}