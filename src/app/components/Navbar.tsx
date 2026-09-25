import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-[#202227] bg-[#090a0c]">
      <div className="mx-auto flex h-[72px] max-w-[1400px] items-center justify-between px-5 sm:px-8">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="FitLog"
            width={28}
            height={28}
            className="h-7 w-auto"
          />

          <span className="text-xl font-black">
            FITLOG
          </span>
        </Link>

        {/* Navigation */}
        <div className="absolute left-1/2 flex -translate-x-1/2 items-center gap-2">
          <Link
            href="/"
            className="rounded-full bg-[#142500] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#1d3500]"
          >
            Workouts
          </Link>

          <Link
            href="/my-plan"
            className="px-4 py-3 text-sm font-bold text-gray-400 transition hover:text-white"
          >
            My Plan
          </Link>
        </div>

        {/* Counters */}
        <div className="flex items-center gap-5 text-sm">
          <Link href="/my-plan" className="flex items-center gap-2">
            <span>Plan</span>

            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#ccff00] px-1 text-xs font-bold text-black">
              0
            </span>
          </Link>

          <Link
            href="/my-plan"
            className="flex items-center gap-2 text-gray-300"
          >
            <span>Saved</span>

            <span className="flex h-5 min-w-5 items-center justify-center rounded-full border border-[#363940] px-1 text-xs text-gray-400">
              0
            </span>
          </Link>
        </div>

      </div>
    </nav>
  );
}