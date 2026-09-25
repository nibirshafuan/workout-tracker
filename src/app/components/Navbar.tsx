import Link from "next/link";

export default function Navbar() {
  return (
    <header className="border-b border-[#292929] bg-[#0b0b0b]">
      <div className="mx-auto flex min-h-[76px] max-w-7xl items-center justify-between gap-6 px-5 sm:px-8 lg:px-10">
        <Link
          href="/"
          className="shrink-0 text-xl font-black tracking-[-0.04em] text-white sm:text-2xl"
        >
          WORKOUT
          <span className="text-[#ccff00]">.</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link
            href="/"
            className="relative py-2 text-sm font-bold uppercase tracking-[0.12em] text-[#ccff00]"
          >
            Workout
            <span className="absolute bottom-0 left-0 h-[2px] w-full bg-[#ccff00]" />
          </Link>

          <Link
            href="/my-plan"
            className="py-2 text-sm font-bold uppercase tracking-[0.12em] text-[#8a8a8a] transition-colors hover:text-white"
          >
            My Plan
          </Link>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/my-plan"
            className="flex items-center gap-2 rounded-full bg-[#ccff00] px-3 py-2 text-xs font-black uppercase tracking-[0.08em] text-black transition-transform hover:scale-105 sm:px-4"
          >
            <span>Plan</span>
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-black px-1 text-[10px] text-[#ccff00]">
              0
            </span>
          </Link>

          <Link
            href="/my-plan"
            className="flex items-center gap-2 rounded-full border border-[#555] px-3 py-2 text-xs font-black uppercase tracking-[0.08em] text-white transition-colors hover:border-[#ccff00] sm:px-4"
          >
            <span>Saved</span>
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full border border-[#555] px-1 text-[10px]">
              0
            </span>
          </Link>
        </div>
      </div>

      <nav className="flex border-t border-[#1c1c1c] md:hidden">
        <Link
          href="/"
          className="flex flex-1 items-center justify-center border-r border-[#1c1c1c] py-3 text-xs font-bold uppercase tracking-[0.12em] text-[#ccff00]"
        >
          Workout
        </Link>

        <Link
          href="/my-plan"
          className="flex flex-1 items-center justify-center py-3 text-xs font-bold uppercase tracking-[0.12em] text-[#8a8a8a] transition-colors hover:text-white"
        >
          My Plan
        </Link>
      </nav>
    </header>
  );
}