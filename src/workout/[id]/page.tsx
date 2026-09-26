import Link from "next/link";

export default async function WorkoutDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <main className="min-h-screen bg-[#090a0c] px-6 py-20 text-white">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-4xl font-black uppercase">
          Workout Details
        </h1>

        <p className="mt-5 text-xl text-[#ccff00]">
          Workout ID: {id}
        </p>

        <Link
          href="/"
          className="mt-8 inline-block rounded-lg bg-[#ccff00] px-5 py-3 font-bold text-black"
        >
          Back to Library
        </Link>
      </div>
    </main>
  );
}