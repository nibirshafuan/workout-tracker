"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";

const PLAN_KEY = "fitlog-plan";
const SAVED_KEY = "fitlog-saved";
const STORAGE_EVENT = "fitlog-storage";

function getCount(key: string) {
  if (typeof window === "undefined") {
    return 0;
  }

  try {
    const data = JSON.parse(localStorage.getItem(key) || "[]");

    return Array.isArray(data) ? data.length : 0;
  } catch {
    return 0;
  }
}

function getServerSnapshot() {
  return 0;
}

function useStorageCount(key: string) {
  return useSyncExternalStore(
    (callback) => {
      const handleStorage = () => callback();

      window.addEventListener("storage", handleStorage);
      window.addEventListener(STORAGE_EVENT, handleStorage);

      return () => {
        window.removeEventListener("storage", handleStorage);
        window.removeEventListener(STORAGE_EVENT, handleStorage);
      };
    },
    () => getCount(key),
    getServerSnapshot
  );
}

export default function Navbar() {
  const pathname = usePathname();

  const planCount = useStorageCount(PLAN_KEY);
  const savedCount = useStorageCount(SAVED_KEY);

  const isPlanPage = pathname === "/my-plan";

  return (
    <nav className="sticky top-0 z-50 border-b border-[#202227] bg-[#090a0c]">
      <div className="mx-auto flex h-[72px] w-full max-w-[1400px] items-center justify-between px-3 sm:px-5 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2"
        >
          <Image
            src="/logo.png"
            alt="FitLog"
            width={28}
            height={28}
            className="h-7 w-7"
          />

          <span className="text-lg font-black sm:text-xl">
            FITLOG
          </span>
        </Link>

        {/* Navigation */}
        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <Link
            href="/"
            className={`rounded-full px-3 py-2.5 text-xs font-bold transition sm:px-6 sm:py-3 sm:text-sm ${!isPlanPage
                ? "bg-[#142500] text-white"
                : "text-gray-400 hover:text-white"
              }`}
          >
            Workouts
          </Link>

          <Link
            href="/my-plan"
            className={`whitespace-nowrap rounded-full px-3 py-2.5 text-xs font-bold transition sm:px-6 sm:py-3 sm:text-sm ${isPlanPage
                ? "bg-[#142500] text-white"
                : "text-gray-400 hover:text-white"
              }`}
          >
            My Plan
          </Link>
        </div>

        {/* Counters */}
        <div className="flex shrink-0 items-center gap-2 text-xs sm:gap-5 sm:text-sm">
          <Link
            href="/my-plan?tab=plan"
            className="flex items-center gap-1.5 whitespace-nowrap sm:gap-2"
          >
            <span>Plan</span>

            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#ccff00] px-1 text-[11px] font-bold text-black">
              {planCount}
            </span>
          </Link>

          <Link
            href="/my-plan?tab=saved"
            className="flex items-center gap-1.5 whitespace-nowrap text-gray-300 sm:gap-2"
          >
            <span>Saved</span>

            <span className="flex h-5 min-w-5 items-center justify-center rounded-full border border-[#363940] px-1 text-[11px] text-gray-400">
              {savedCount}
            </span>
          </Link>
        </div>
      </div>
    </nav>
  );
}