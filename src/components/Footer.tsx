export default function Footer() {
  return (
    <footer className="border-t border-[#202227] bg-[#090a0c]">
      <div className="mx-auto flex min-h-[90px] max-w-[1400px] flex-col items-center justify-center gap-2 px-5 text-center sm:flex-row sm:justify-between sm:px-8">
        <div>
          <p className="text-sm font-black tracking-wide text-white">
            FITLOG
          </p>
          <p className="mt-1 text-xs text-[#697386]">
            Workout Library. Train hard, log honest.
          </p>
        </div>

        <p className="text-xs text-[#697386]">
          © 2026 FitLog — Workout Library.
        </p>
      </div>
    </footer>
  );
}