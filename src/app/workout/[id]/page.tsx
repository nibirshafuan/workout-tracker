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
const PLAN_KEY = "fitlog-plan";
const SAVED_KEY = "fitlog-saved";
const DONE_KEY = "fitlog-done-v2";

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

        const plan = JSON.parse(
          localStorage.getItem(PLAN_KEY) || "[]"
        ) as Workout[];

        const savedWorkouts = JSON.parse(
          localStorage.getItem(SAVED_KEY) || "[]"
        ) as Workout[];

        setAddedToPlan(
          plan.some((item) => Number(item.id) === Number(data.id))
        );

        setSaved(
          savedWorkouts.some(
            (item) => Number(item.id) === Number(data.id)
          )
        );
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

  const addToPlan = () => {
    if (!workout) return;

    const plan = JSON.parse(
      localStorage.getItem(PLAN_KEY) || "[]"
    ) as Workout[];

    const alreadyAdded = plan.some(
      (item) => Number(item.id) === Number(workout.id)
    );

    if (alreadyAdded) {
      const updatedPlan = plan.filter(
        (item) => Number(item.id) !== Number(workout.id)
      );

      const done = JSON.parse(
        localStorage.getItem(DONE_KEY) || "[]"
      ) as number[];

      const updatedDone = done.filter(
        (item) => Number(item) !== Number(workout.id)
      );

      localStorage.setItem(PLAN_KEY, JSON.stringify(updatedPlan));
      localStorage.setItem(DONE_KEY, JSON.stringify(updatedDone));

      setAddedToPlan(false);
      window.dispatchEvent(new Event("fitlog-storage"));
      return;
    }

    if (plan.length >= 5) {
      alert("You can add a maximum of 5 workouts to today's plan.");
      return;
    }

    const updatedPlan = [...plan, workout];

    localStorage.setItem(PLAN_KEY, JSON.stringify(updatedPlan));
    setAddedToPlan(true);

    window.dispatchEvent(new Event("fitlog-storage"));
  };

  const saveWorkout = () => {
    if (!workout) return;

    const savedWorkouts = JSON.parse(
      localStorage.getItem(SAVED_KEY) || "[]"
    ) as Workout[];

    const alreadySaved = savedWorkouts.some(
      (item) => Number(item.id) === Number(workout.id)
    );

    if (alreadySaved) {
      const updatedSaved = savedWorkouts.filter(
        (item) => Number(item.id) !== Number(workout.id)
      );

      localStorage.setItem(SAVED_KEY, JSON.stringify(updatedSaved));
      setSaved(false);

      window.dispatchEvent(new Event("fitlog-storage"));
      return;
    }

    const updatedSaved = [...savedWorkouts, workout];

    localStorage.setItem(SAVED_KEY, JSON.stringify(updatedSaved));
    setSaved(true);

    window.dispatchEvent(new Event("fitlog-storage"));
  };

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

          <div className="overflow-hidden rounded-[18px] border border-[#292d35] bg-[#15171c]">
            <div className="relative h-[320px] w-full">
              <Image
                src={workout.image}
                alt={workout.name}
                fill
                sizes="(max-width: 768px) 100vw, 1100px"
                className="object-cover object-top"
              />
            </div>

            <div className="p-6 sm:p-8">
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

              <h1 className="text-[32px] font-black uppercase leading-tight sm:text-[42px]">
                {workout.name}
              </h1>

              <p className="mt-2 text-[14px] text-[#7d8ba3]">
                {workout.equipment}
              </p>

              <div className="my-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="rounded-xl border border-[#292d35] bg-[#111318] p-4">
                  <p className="text-[10px] uppercase text-[#697386]">
                    Duration
                  </p>
                  <p className="mt-2 text-xl font-black">
                    {workout.duration} min
                  </p>
                </div>

                <div className="rounded-xl border border-[#292d35] bg-[#111318] p-4">
                  <p className="text-[10px] uppercase text-[#697386]">
                    Calories
                  </p>
                  <p className="mt-2 text-xl font-black">
                    {workout.caloriesBurned}
                  </p>
                </div>

                <div className="rounded-xl border border-[#292d35] bg-[#111318] p-4">
                  <p className="text-[10px] uppercase text-[#697386]">
                    Sets
                  </p>
                  <p className="mt-2 text-xl font-black">
                    {workout.sets}
                  </p>
                </div>

                <div className="rounded-xl border border-[#292d35] bg-[#111318] p-4">
                  <p className="text-[10px] uppercase text-[#697386]">
                    Rating
                  </p>
                  <p className="mt-2 text-xl font-black">
                    ★ {workout.rating}
                  </p>
                </div>
              </div>

              <p className="text-[14px] leading-7 text-[#aab2c0]">
                {workout.description}
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={addToPlan}
                  className="rounded-full bg-[#ccff00] px-7 py-3 text-[11px] font-black uppercase text-black transition hover:bg-[#b9eb00]"
                >
                  {addedToPlan ? "Remove from Plan" : "Add to Plan"}
                </button>

                <button
                  type="button"
                  onClick={saveWorkout}
                  className="rounded-full border border-[#343943] px-7 py-3 text-[11px] font-black uppercase text-white transition hover:border-[#ccff00] hover:text-[#ccff00]"
                >
                  {saved ? "Saved" : "Save Workout"}
                </button>
              </div>

              {workout.instructions.length > 0 && (
                <div className="mt-8">
                  <h2 className="text-xl font-black uppercase">
                    Instructions
                  </h2>

                  <ol className="mt-4 space-y-3">
                    {workout.instructions.map((instruction, index) => (
                      <li
                        key={`${workout.id}-${index}`}
                        className="flex gap-3 text-[13px] leading-6 text-[#aab2c0]"
                      >
                        <span className="font-black text-[#ccff00]">
                          {index + 1}.
                        </span>
                        <span>{instruction}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}