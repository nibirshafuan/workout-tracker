"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useSyncExternalStore } from "react";

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
const DONE_KEY = "fitlog-done-v2";
const STORAGE_EVENT = "fitlog-storage";

function getStorageValue(key: string) {
  if (typeof window === "undefined") {
    return "[]";
  }

  return localStorage.getItem(key) || "[]";
}

function getServerSnapshot() {
  return "[]";
}

function parseWorkouts(value: string): Workout[] {
  try {
    const data = JSON.parse(value);

    if (!Array.isArray(data)) {
      return [];
    }

    return data.filter(
      (item): item is Workout =>
        item &&
        typeof item === "object" &&
        item.id !== undefined &&
        item.name !== undefined
    );
  } catch {
    return [];
  }
}

function parseDone(value: string): number[] {
  try {
    const data = JSON.parse(value);

    if (!Array.isArray(data)) {
      return [];
    }

    return data.map(Number);
  } catch {
    return [];
  }
}

function useStoredValue(key: string) {
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
    () => getStorageValue(key),
    getServerSnapshot
  );
}

export default function MyPlanPage() {
  const planStorage = useStoredValue(PLAN_KEY);
  const savedStorage = useStoredValue(SAVED_KEY);
  const doneStorage = useStoredValue(DONE_KEY);

  const plan = parseWorkouts(planStorage);
  const saved = parseWorkouts(savedStorage);
  const done = parseDone(doneStorage);

  const [activeTab, setActiveTab] = useState<"plan" | "saved">("plan");

  const [sortBy, setSortBy] = useState<
    "duration" | "calories" | "rating"
  >("duration");

  const totalMinutes = plan.reduce(
    (total, workout) => total + Number(workout.duration || 0),
    0
  );

  const totalCalories = plan.reduce(
    (total, workout) => total + Number(workout.caloriesBurned || 0),
    0
  );

  const baseList = activeTab === "plan" ? plan : saved;

  const currentList = [...baseList].sort((a, b) => {
    if (sortBy === "calories") {
      return (
        Number(b.caloriesBurned || 0) -
        Number(a.caloriesBurned || 0)
      );
    }

    if (sortBy === "rating") {
      return Number(b.rating || 0) - Number(a.rating || 0);
    }

    return Number(a.duration || 0) - Number(b.duration || 0);
  });

  const removeFromPlan = (id: number) => {
    const updatedPlan = plan.filter(
      (workout) => Number(workout.id) !== Number(id)
    );

    const updatedDone = done.filter(
      (item) => Number(item) !== Number(id)
    );

    localStorage.setItem(PLAN_KEY, JSON.stringify(updatedPlan));
    localStorage.setItem(DONE_KEY, JSON.stringify(updatedDone));

    window.dispatchEvent(new Event(STORAGE_EVENT));
  };

  const removeFromSaved = (id: number) => {
    const updatedSaved = saved.filter(
      (workout) => Number(workout.id) !== Number(id)
    );

    localStorage.setItem(SAVED_KEY, JSON.stringify(updatedSaved));

    window.dispatchEvent(new Event(STORAGE_EVENT));
  };

  const markAsDone = (id: number) => {
    const alreadyDone = done.includes(Number(id));

    const updatedDone = alreadyDone
      ? done.filter((item) => Number(item) !== Number(id))
      : [...done, Number(id)];

    localStorage.setItem(DONE_KEY, JSON.stringify(updatedDone));

    window.dispatchEvent(new Event(STORAGE_EVENT));
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#090a0c] text-white">
      <section className="px-5 pb-16 pt-8 sm:px-8 lg:px-10">
        <div className="mx-auto w-full max-w-[1400px]">

          <div className="mb-9">
            <h1 className="text-[36px] font-black uppercase leading-none tracking-tight sm:text-[42px] lg:text-[48px]">
              My Plan
            </h1>

            <p className="mt-4 text-[14px] text-[#7d8ba3] sm:text-[15px]">
              Cap of five lifts for today. Finish them, then load more.
            </p>
          </div>

          <div className="mb-8 grid w-full grid-cols-1 overflow-hidden rounded-[17px] border border-[#292d35] bg-[#15171c] sm:grid-cols-3">
            <div className="px-7 py-7 sm:border-r sm:border-[#292d35]">
              <p className="text-[11px] font-medium uppercase tracking-wide text-[#697386]">
                Exercises
              </p>

              <p className="mt-3 text-[38px] font-black leading-none text-[#ccff00]">
                {plan.length}
              </p>
            </div>

            <div className="border-t border-[#292d35] px-7 py-7 sm:border-t-0 sm:border-r">
              <p className="text-[11px] font-medium uppercase tracking-wide text-[#697386]">
                Minutes
              </p>

              <p className="mt-3 text-[38px] font-black leading-none">
                {totalMinutes}
              </p>
            </div>

            <div className="border-t border-[#292d35] px-7 py-7 sm:border-t-0">
              <p className="text-[11px] font-medium uppercase tracking-wide text-[#697386]">
                Calories
              </p>

              <p className="mt-3 text-[38px] font-black leading-none">
                {totalCalories}
              </p>
            </div>
          </div>

          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="inline-flex w-fit rounded-[11px] border border-[#292d35] bg-[#15171c] p-1">
              <button
                type="button"
                onClick={() => setActiveTab("plan")}
                className={`rounded-[8px] px-7 py-3 text-[11px] font-black transition ${
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
                className={`rounded-[8px] px-7 py-3 text-[11px] font-black transition ${
                  activeTab === "saved"
                    ? "bg-[#22262d] text-white"
                    : "text-[#697386] hover:text-white"
                }`}
              >
                Saved
              </button>
            </div>

            <div className="flex items-center gap-3">
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
                className="cursor-pointer rounded-[10px] border border-[#292d35] bg-[#15171c] px-5 py-2.5 text-[11px] font-bold text-white outline-none focus:border-[#ccff00]"
              >
                <option value="duration">Duration</option>
                <option value="calories">Calories</option>
                <option value="rating">Rating</option>
              </select>
            </div>
          </div>

          {currentList.length === 0 ? (
            <div className="flex min-h-[310px] flex-col items-center justify-center rounded-[17px] border border-dashed border-[#343943] bg-[#111318] px-6 text-center">
              <p className="text-[16px] font-black uppercase text-[#aab2c0]">
                {activeTab === "plan"
                  ? "Nothing here yet"
                  : "No saved workouts"}
              </p>

              <p className="mt-2 max-w-[420px] text-[12px] leading-5 text-[#697386]">
                {activeTab === "plan"
                  ? "Browse the library and add a lift to get today moving."
                  : "Save workouts from their details page for later."}
              </p>

              <Link
                href="/"
                className="mt-6 rounded-full bg-[#ccff00] px-6 py-3 text-[11px] font-black uppercase text-black transition hover:bg-[#b9eb00]"
              >
                Go to workouts
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {currentList.map((workout) => {
                const isDone = done.includes(Number(workout.id));

                return (
                  <div
                    key={workout.id}
                    className="w-full overflow-hidden rounded-[17px] border border-[#292d35] bg-[#15171c] p-3 transition hover:border-[#3a404b]"
                  >
                    <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-center">

                      <div className="relative h-[190px] w-full shrink-0 overflow-hidden rounded-[11px] sm:h-[88px] sm:w-[145px]">
                        <Image
                          src={workout.image}
                          alt={workout.name}
                          fill
                          sizes="145px"
                          className="object-cover"
                        />
                      </div>

                      <div className="min-w-0 flex-1 px-1">
                        <div className="flex items-center gap-2">
                          <h3
                            className={`truncate text-[15px] font-black uppercase tracking-wide ${
                              isDone
                                ? "text-[#8c95a5]"
                                : "text-white"
                            }`}
                          >
                            {workout.name}
                          </h3>

                          {isDone && (
                            <span className="shrink-0 rounded-full border border-[#ccff00] px-2 py-1 text-[8px] font-black uppercase text-[#ccff00]">
                              Done
                            </span>
                          )}
                        </div>

                        <p className="mt-1 truncate text-[11px] text-[#697386]">
                          {workout.equipment}
                        </p>

                        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] text-[#9aa5b7]">
                          <span>◷ {workout.duration} min</span>
                          <span>♨ {workout.caloriesBurned} kcal</span>
                          <span>★ {workout.rating}</span>
                        </div>
                      </div>

                      <div className="flex shrink-0 flex-wrap items-center gap-2 sm:justify-end">
                        <Link
                          href={`/workout/${workout.id}`}
                          className="rounded-full border border-[#343943] px-5 py-3 text-[10px] font-black uppercase whitespace-nowrap transition hover:border-[#ccff00] hover:text-[#ccff00]"
                        >
                          View Details
                        </Link>

                        {activeTab === "plan" && (
                          <button
                            type="button"
                            onClick={() => markAsDone(workout.id)}
                            className={`rounded-full px-5 py-3 text-[10px] font-black uppercase whitespace-nowrap transition ${
                              isDone
                                ? "border border-[#343943] bg-transparent text-[#9aa5b7] hover:border-[#ccff00] hover:text-[#ccff00]"
                                : "bg-[#ccff00] text-black hover:bg-[#b9eb00]"
                            }`}
                          >
                            {isDone ? "✓ Done" : "✓ Mark as Done"}
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
                          className="px-2 text-[18px] leading-none text-[#697386] transition hover:text-red-400"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}