"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

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

export default function Home() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error("Failed to fetch workouts");
        }

        const data = await response.json();
        setWorkouts(data);
      } catch (error) {
        console.error("Failed to load workouts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkouts();
  }, []);

  return (
    <main className="min-h-screen bg-[#090a0c] text-white">
      <section id="library" className="px-5 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1800px]">
          <div className="mb-8">
            <h2 className="text-[32px] font-black uppercase leading-none tracking-tight sm:text-[36px]">
              THE LIBRARY
            </h2>

            <p className="mt-2 text-[15px] text-[#7d8ba3]">
              Twelve lifts covering every major muscle group.
            </p>
          </div>

          {loading ? (
            <div className="flex min-h-[300px] items-center justify-center">
              <div className="flex items-center gap-3 text-[#ccff00]">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#ccff00] border-t-transparent" />
                <span className="text-sm">Loading workouts…</span>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {workouts.map((workout) => (
                <Link
                  key={workout.id}
                  href={`/workout/${workout.id}`}
                  className="group flex h-full flex-col overflow-hidden rounded-[18px] border border-[#292d35] bg-[#15171c] transition-all duration-200 hover:-translate-y-1 hover:border-[#3a3f49]"
                >
                  <div className="relative h-[250px] w-full shrink-0 overflow-hidden bg-[#15171c]">
                    <Image
  src={workout.image}
  alt={workout.name}
  fill
  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
  className="object-cover object-top"
/>
                  </div>

                  <div className="flex flex-1 flex-col px-5 py-4">
                    <div className="mb-4 flex flex-wrap gap-2">
                      {workout.muscleGroups.map((muscle) => (
                        <span
                          key={muscle}
                          className="rounded-full bg-[#ccff00] px-3 py-[5px] text-[10px] font-bold uppercase leading-none text-black"
                        >
                          {muscle}
                        </span>
                      ))}
                    </div>

                    <h3 className="text-[19px] font-black uppercase leading-tight tracking-tight">
                      {workout.name}
                    </h3>

                    <p className="mt-1 text-[13px] text-[#7d8798]">
                      {workout.equipment}
                    </p>

                    <div className="my-4 h-px bg-[#272b32]" />

                    <div className="mt-auto flex items-center gap-5 text-[13px] text-[#9aa5b7]">
                      <span className="flex items-center gap-1.5">
                        <span>◷</span>
                        {workout.duration} min
                      </span>

                      <span className="flex items-center gap-1.5">
                        <span className="text-[9px]">●</span>
                        {workout.caloriesBurned} kcal
                      </span>

                      <span className="flex items-center gap-1.5">
                        <span>☆</span>
                        {workout.rating}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}