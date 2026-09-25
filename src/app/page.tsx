export default function Home() {
  return (
    <main className="min-h-screen bg-[#0b0b0b] px-5 py-20 text-white sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-[#ccff00]">
          Workout Library
        </p>

        <h1 className="max-w-4xl text-4xl font-black uppercase leading-[0.95] tracking-[-0.04em] sm:text-6xl lg:text-7xl">
          Train with intent.
          <br />
          Log every set.
        </h1>

        <p className="mt-6 max-w-2xl text-base leading-7 text-[#8a8a8a] sm:text-lg">
          Plan your workouts, track your training, and build your progress.
        </p>
      </div>
    </main>
  );
}