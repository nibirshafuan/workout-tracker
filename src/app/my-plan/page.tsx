"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, useSyncExternalStore } from "react";

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

const PLAN_KEY = "fitlog-plan";
const SAVED_KEY = "fitlog-saved";
const DONE_KEY = "fitlog-done";
const STORAGE_EVENT = "fitlog-storage";

function normalizeWorkout(item: unknown): Workout | null {
  if (!item || typeof item !== "object") {
    return null;
  }

  const data = item as Partial<Workout>;

  if (data.id === undefined || data.name === undefined) {
    return null;
  }

  return {
    id: Number(data.id),
    name: String(data.name || "Unnamed Workout"),
    image: String(data.image || "/banner.png"),
    muscleGroups: Array.isArray(data.muscleGroups)
      ? data.muscleGroups.map(String)
      : [],
    equipment: String(data.equipment || "No equipment"),
    difficulty: String(data.difficulty || "Beginner"),
    duration: Number(data.duration || 0),
    caloriesBurned: Number(data.caloriesBurned || 0),
    sets: Number(data.sets || 0),
    reps: String(data.reps || "N/A"),
    rating: Number(data.rating || 0),
    description: String(data.description || ""),
    instructions: Array.isArray(data.instructions)
      ? data.instructions.map(String)
      : [],
  };
}

function getStorageSnapshot(key: string) {
  if (typeof window === "undefined") {
    return "[]";
  }

  return localStorage.getItem(key) || "[]";
}

function getServerSnapshot() {
  return "[]";
}

function useStoredWorkouts(key: string) {
  const snapshot = useSyncExternalStore(
    (callback) => {
      const handleStorage = () => callback();

      window.addEventListener("storage", handleStorage);
      window.addEventListener(STORAGE_EVENT, handleStorage);

      return () => {
        window.removeEventListener("storage", handleStorage);
        window.removeEventListener(STORAGE_EVENT, handleStorage);
      };
    },
    () => getStorageSnapshot(key),
    getServerSnapshot
  );

  try {
    const parsed = JSON.parse(snapshot);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .map(normalizeWorkout)
      .filter((workout): workout is Workout => workout !== null);
  } catch {
    return [];
  }
}

function useDoneWorkouts() {
  const snapshot = useSyncExternalStore(
    (callback) => {
      const handleStorage = () => callback();

      window.addEventListener("storage", handleStorage);
      window.addEventListener(STORAGE_EVENT, handleStorage);

      return () => {
        window.removeEventListener("storage", handleStorage);
        window.removeEventListener(STORAGE_EVENT, handleStorage);
      };
    },
    () => getStorageSnapshot(DONE_KEY),
    getServerSnapshot
  );

  try {
    const parsed = JSON.parse(snapshot);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.map(Number);
  } catch {
    return [];
  }
}

export default function MyPlanPage() {
  const plan = useStoredWorkouts(PLAN_KEY);
  const saved = useStoredWorkouts(SAVED_KEY);
  const done = useDoneWorkouts();

  const [activeTab, setActiveTab] = useState<"plan" | "saved">("plan");

  const [sortBy, setSortBy] = useState<
    "duration" | "calories" | "rating"
  >("duration");

  const totalMinutes = plan.reduce(
    (total, workout) => total + workout.duration,
    0
  );

  const totalCalories = plan.reduce(
    (total, workout) => total + workout.caloriesBurned,
    0
  );

  const sortedPlan = useMemo(() => {
    return [...plan].sort((a, b) => {
      if (sortBy === "calories") {
        return b.caloriesBurned - a.caloriesBurned;
      }

      if (sortBy === "rating") {
        return b.rating - a.rating;
      }

      return a.duration - b.duration;
    });
  }, [plan, sortBy]);

  const sortedSaved = useMemo(() => {
    return [...saved].sort((a, b) => {
      if (sortBy === "calories") {
        return b.caloriesBurned - a.caloriesBurned;
      }

      if (sortBy === "rating") {
        return b.rating - a.rating;
      }

      return a.duration - b.duration;
    });
  }, [saved, sortBy]);

  const removeFromPlan = (id: number) => {
    const updatedPlan = plan.filter(
      (workout) => Number(workout.id) !== Number(id)
    );

    localStorage.setItem(PLAN_KEY, JSON.stringify(updatedPlan));
    window.dispatchEvent(new Event(STORAGE_EVENT));
  };

  const markAsDone = (id: number) => {
    const updatedDone = done.includes(id) ? done : [...done, id];

    localStorage.setItem(DONE_KEY, JSON.stringify(updatedDone));

    const updatedPlan = plan.filter(
      (workout) => Number(workout.id) !== Number(id)
    );

    localStorage.setItem(PLAN_KEY, JSON.stringify(updatedPlan));

    window.dispatchEvent(new Event(STORAGE_EVENT));
  };

  const removeFromSaved = (id: number) => {
    const updatedSaved = saved.filter(
      (workout) => Number(workout.id) !== Number(id)
    );

    localStorage.setItem(SAVED_KEY, JSON.stringify(updatedSaved));
    window.dispatchEvent(new Event(STORAGE_EVENT));
  };

  const currentList =
    activeTab === "plan" ? sortedPlan : sortedSaved;

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#090a0c] text-white">
      <section className="px-5 py-8 sm:px-8 lg:px-10">
        <div className="mx-auto w-full max-w-[1180px]">

          {/* HEADER */}
          <div className="mb-8">
            <h1 className="text-[32px] font-black uppercase leading-none tracking-tight sm:text-[38px]">
              MY PLAN
            </h1>

            <p className="mt-3 text-[14px] text-[#7d8ba3]">
              Cap of five lifts for today. Finish them, then load more.
            </p>
          </div>

          {/* STATS */}
          <div className="mb-7 grid grid-cols-1 overflow-hidden rounded-[16px] border border-[#292d35] bg-[#15171c] sm:grid-cols-3">

            <div className="border-b border-[#292d35] px-6 py-5 sm:border-b-0 sm:border-r">
              <p className="text-[10px] font-bold uppercase tracking-wide text-[#697386]">
                Exercises
              </p>

              <p className="mt-1 text-[30px] font-black text-[#ccff00]">
                {plan.length}
              </p>
            </div>

            <div className="border-b border-[#292d35] px-6 py-5 sm:border-b-0 sm:border-r">
              <p className="text-[10px] font-bold uppercase tracking-wide text-[#697386]">
                Minutes
              </p>

              <p className="mt-1 text-[30px] font-black">
                {totalMinutes}
              </p>
            </div>

            <div className="px-6 py-5">
              <p className="text-[10px] font-bold uppercase tracking-wide text-[#697386]">
                Calories
              </p>

              <p className="mt-1 text-[30px] font-black">
                {totalCalories}
              </p>
            </div>
          </div>

          {/* TABS + SORT */}
          <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div className="inline-flex w-fit rounded-[10px] border border-[#292d35] bg-[#15171c] p-1">

              <button
                type="button"
                onClick={() => setActiveTab("plan")}
                className={`rounded-[8px] px-5 py-2.5 text-[11px] font-black transition ${
                  activeTab === "plan"
                    ? "bg-[#22262d] text-white"
                    : "text-[#697386] hover:text-white"
                }`}
              >
                Today&apos;s Plan
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("saved")}
                className={`rounded-[8px] px-5 py-2.5 text-[11px] font-black transition ${
                  activeTab === "saved"
                    ? "bg-[#22262d] text-white"
                    : "text-[#697386] hover:text-white"
                }`}
              >
                Saved
              </button>

            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] text-[#697386]">
                Sort By
              </span>

              <select
                value={sortBy}
                onChange={(event) =>
                  setSortBy(
                    event.target.value as
                      | "duration"
                      | "calories"
                      | "rating"
                  )
                }
                className="rounded-[9px] border border-[#292d35] bg-[#15171c] px-3 py-2 text-[11px] font-bold text-white outline-none"
              >
                <option value="duration">Duration</option>
                <option value="calories">Calories</option>
                <option value="rating">Rating</option>
              </select>
            </div>
          </div>

          {/* EMPTY STATE */}
          {currentList.length === 0 ? (
            <div className="flex min-h-[310px] flex-col items-center justify-center rounded-[16px] border border-dashed border-[#343943] bg-[#111318] px-6 text-center">

              <p className="text-[16px] font-black uppercase text-[#aab2c0]">
                {activeTab === "plan"
                  ? "Nothing here yet"
                  : "No saved workouts"}
              </p>

              <p className="mt-2 text-[12px] text-[#697386]">
                {activeTab === "plan"
                  ? "Browse the library and add a lift to get today moving."
                  : "Save workouts from their details page for later."}
              </p>

              <Link
                href="/"
                className="mt-6 rounded-full bg-[#ccff00] px-6 py-3 text-[11px] font-black uppercase text-black transition hover:-translate-y-0.5"
              >
                Go to workouts
              </Link>
            </div>
          ) : (
            <div className="space-y-3">

              {currentList.map((workout) => (
                <div
                  key={workout.id}
                  className="w-full rounded-[16px] border border-[#292d35] bg-[#15171c] p-3 transition hover:border-[#3a404c]"
                >

                  {/* CARD */}
                  <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center">

                    {/* THUMBNAIL */}
                    <div className="relative h-[82px] w-full shrink-0 overflow-hidden rounded-[10px] bg-[#0f1115] sm:h-[74px] sm:w-[120px]">
                      <Image
                        src={workout.image}
                        alt={workout.name}
                        fill
                        sizes="120px"
                        className="object-cover"
                      />
                    </div>

                    {/* INFORMATION */}
                    <div className="min-w-0 flex-1">

                      <h3 className="truncate text-[14px] font-black uppercase text-white">
                        {workout.name}
                      </h3>

                      <p className="mt-1 truncate text-[10px] text-[#697386]">
                        {workout.equipment}
                      </p>

                      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] text-[#9aa5b7]">

                        <span>
                          ◷ {workout.duration} min
                        </span>

                        <span>
                          ♨ {workout.caloriesBurned} kcal
                        </span>

                        <span>
                          ★ {workout.rating}
                        </span>

                      </div>
                    </div>

                    {/* ACTIONS */}
                    <div className="flex shrink-0 items-center gap-2">

                      <Link
                        href={`/workout/${workout.id}`}
                        className="rounded-full border border-[#343943] px-4 py-2.5 text-[10px] font-black uppercase whitespace-nowrap text-white transition hover:border-[#ccff00]"
                      >
                        View Details
                      </Link>

                      {activeTab === "plan" && (
                        <button
                          type="button"
                          onClick={() => markAsDone(workout.id)}
                          className="rounded-full bg-[#ccff00] px-4 py-2.5 text-[10px] font-black uppercase whitespace-nowrap text-black transition hover:bg-[#b9eb00]"
                        >
                          ✓ Mark as Done
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() =>
                          activeTab === "plan"
                            ? removeFromPlan(workout.id)
                            : removeFromSaved(workout.id)
                        }
                        aria-label={`Remove ${workout.name}`}
                        className="px-2 text-[18px] text-[#697386] transition hover:text-red-400"
                      >
                        ×
                      </button>

                    </div>
                  </div>
                </div>
              ))}

            </div>
          )}

        </div>
      </section>
    </main>
  );
}