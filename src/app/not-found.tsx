import Link from "next/link";

export default function NotFound() {
    return (
        <main className="flex min-h-[calc(100vh-72px)] items-center justify-center bg-[#090a0c] px-5 text-white">
            <div className="w-full max-w-[600px] text-center">
                <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#ccff00]">
                    FitLog
                </p>

                <h1 className="mt-4 text-[80px] font-black leading-none sm:text-[120px]">
                    404
                </h1>

                <h2 className="mt-5 text-2xl font-black uppercase sm:text-3xl">
                    Workout Not Found
                </h2>

                <p className="mx-auto mt-3 max-w-[450px] text-sm leading-6 text-[#7d8ba3]">
                    The page or workout you are looking for does not exist.
                    Head back to the workout library and choose another lift.
                </p>

                <Link
                    href="/"
                    className="mt-7 inline-flex rounded-full bg-[#ccff00] px-7 py-3 text-xs font-black uppercase text-black transition hover:bg-[#b9eb00]"
                >
                    Back to Workouts
                </Link>
            </div>
        </main>
    );
}