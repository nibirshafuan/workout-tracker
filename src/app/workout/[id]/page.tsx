"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type Workout = {
  id: number;
  name: string;
  image: string;
  muscleGroups: string[];
  equipment: string;
  difficulty: string;
  duration: number;
  caloriesBurned: number;
  sets: number;
  reps: string;
  rating: number;
  description: string;
  instructions: string[];
};

const API_URL = "https://api.abcz.workers.dev/api/fitlog";

export default function WorkoutDetailsPage() {
  const params = useParams();
  const id = params.id as string;

  const [workout, setWorkout] = useState<Workout | null>(null);
  const [loading, setLoading] = useState(true);
  const [addedToPlan, setAddedToPlan] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const fetchWorkout = async () => {
      try {
        const response = await fetch(`${API_URL}/${id}`);

        if (!response.ok) {
          throw new Error("Failed to fetch workout");
        }

        const data: Workout = await response.json();
        setWorkout(data);
      } catch (error) {
        console.error("Failed to load workout:", error);
        setWorkout(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchWorkout();
    }
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#090a0c] text-white">
        <div className="flex min-h-[70vh] items-center justify-center">
          <div className="flex items-center gap-3 text-[#ccff00]">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#ccff00] border-t-transparent" />
            <span className="text-sm">Loading workout...</span>
          </div>
        </div>
      </main>
    );
  }

  if (!workout) {
    return (
      <main className="min-h-screen bg-[#090a0c] px-5 py-16 text-white">
        <div className="mx-auto max-w-[1100px]">
          <h1 className="text-3xl font-black uppercase">
            Workout not found
          </h1>

          <Link
            href="/"
            className="mt-6 inline-block rounded-lg bg-[#ccff00] px-5 py-3 text-sm font-bold text-black"
          >
            Back to Library
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#090a0c] text-white">
      <section className="px-5 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1100px]">
          <Link
            href="/"
            className="mb-5 inline-block text-sm font-semibold text-[#7d8ba3] hover:text-white"
          >
            ← Back to Library
          </Link>

          <div className="overflow-hidden rounded-[18px] border border-[#292d35] bg-[#101216]">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="relative min-h-[420px] bg-[#15171c] lg:min-h-[560px]">
                <Image
                  src={workout.image}
                  alt={workout.name}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover object-center"
                />
              </div>

              <div className="p-6 sm:p-8">
                <h1 className="text-[28px] font-black uppercase leading-tight tracking-tight sm:text-[34px]">
                  {workout.name}
                </h1>

                <p className="mt-3 text-[14px] leading-6 text-[#7d8798]">
                  {workout.description}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {workout.muscleGroups.map((muscle) => (
                    <span
                      key={muscle}
                      className="rounded-full bg-[#ccff00] px-3 py-1.5 text-[10px] font-bold uppercase text-black"
                    >
                      {muscle}
                    </span>
                  ))}
                </div>

                <div className="mt-5 overflow-hidden rounded-[12px] border border-[#272b32] bg-[#15171c]">
                  <div className="grid grid-cols-2">
                    <Info label="Equipment" value={workout.equipment} />
                    <Info label="Difficulty" value={workout.difficulty} />
                    <Info label="Sets" value={String(workout.sets)} />
                    <Info label="Reps" value={workout.reps} />
                    <Info label="Duration" value={`${workout.duration} min`} />
                    <Info
                      label="Calories"
                      value={`${workout.caloriesBurned} kcal`}
                    />
                    <div className="col-span-2 px-4 py-3">
                      <p className="text-[9px] font-bold uppercase text-[#697386]">
                        Rating
                      </p>
                      <p className="mt-1 text-[12px] text-[#d5d9e0]">
                        ☆ {workout.rating}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h2 className="text-[13px] font-black uppercase">
                    Instructions
                  </h2>

                  <ol className="mt-3 space-y-2">
                    {workout.instructions.map((instruction, index) => (
                      <li
                        key={index}
                        className="flex gap-3 text-[12px] leading-5 text-[#929baa]"
                      >
                        <span className="min-w-[14px] font-bold text-[#7d8798]">
                          {index + 1}.
                        </span>
                        <span>{instruction}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => setAddedToPlan(!addedToPlan)}
                    className="rounded-lg bg-[#ccff00] px-5 py-3 text-[11px] font-bold uppercase text-black transition-all duration-200 hover:-translate-y-1"
                  >
                    {addedToPlan
                      ? "Added to today's plan"
                      : "Add to today's plan"}
                  </button>

                  <button
                    type="button"
                    onClick={() => setSaved(!saved)}
                    className={`rounded-lg border px-5 py-3 text-[11px] font-bold uppercase transition-all duration-200 hover:-translate-y-1 ${
                      saved
                        ? "border-[#ccff00] text-[#ccff00]"
                        : "border-[#343943] text-[#b5bdca]"
                    }`}
                  >
                    {saved ? "Saved" : "Save for later"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-[#272b32] px-4 py-3">
      <p className="text-[9px] font-bold uppercase text-[#697386]">
        {label}
      </p>

      <p className="mt-1 text-[12px] text-[#d5d9e0]">{value}</p>
    </div>
  );
}