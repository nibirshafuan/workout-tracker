# FitLog — Workout Library

FitLog is a simple workout library and daily workout planning web application.  
It helps users discover different exercises, check workout details, save workouts for later, and create a daily workout plan.

The main goal of this project was to build a clean and responsive fitness website using Next.js while practicing React concepts, API integration, localStorage, routing, and responsive UI design.

## Live Project

Live Demo: 
https://workout-tracker-henna-iota.vercel.app/

GitHub Repository:  
https://github.com/nibirshafuan/workout-tracker

---

## About The Project

FitLog was created as a workout companion where users can browse exercises and organize the workouts they want to complete.

The workout information is loaded dynamically from an API. Users can open any workout to see its details, add it to their daily plan, or save it for later.

The project also keeps the plan and saved workouts in the browser using localStorage, so the information remains available even after refreshing the page.

---

## Features

### 1. Workout Library

The home page displays a collection of workouts fetched from the API.

Each workout card includes:

- Workout image
- Muscle group/category
- Workout name
- Equipment
- Duration
- Calories
- Rating

Users can click on any workout card to view its full details.

### 2. Workout Details

Every workout has its own details page.

The details page includes:

- Workout image
- Workout name
- Description
- Muscle groups
- Equipment
- Difficulty
- Sets
- Reps
- Duration
- Calories
- Rating
- Step-by-step instructions

Users can also add the workout to their daily plan or save it for later.

### 3. Today's Workout Plan

Users can create their own daily workout plan.

A maximum of five workouts can be added to the plan.

The My Plan page shows:

- Number of exercises
- Total workout time
- Total calories
- Today's planned workouts
- Saved workouts

Users can also view workout details, mark workouts as completed, or remove them from the plan.

### 4. Save Workouts

Users can save workouts that they want to come back to later.

The saved workout count is displayed in the navbar and saved workouts can be viewed from the My Plan page.

### 5. Toast Notifications

The application provides toast notifications when users perform important actions, such as:

- Adding a workout to the plan
- Saving a workout
- Removing a workout
- Marking a workout as completed

This gives users immediate feedback when an action is completed.

### 6. Responsive Design

FitLog is designed to work on different screen sizes.

The layout adapts for:

- Mobile phones
- Tablets
- Laptops
- Desktop computers

The workout grid, navigation, hero section, workout details, and My Plan page are all responsive.

### 7. Workout Sorting

The workout library includes sorting options that allow users to organize workouts based on:

- Duration
- Calories
- Rating

---

## Technologies Used

The project was built using the following technologies:

- **Next.js** — React framework for building the application
- **React** — For creating UI components
- **TypeScript** — For type-safe JavaScript
- **Tailwind CSS** — For styling and responsive layouts
- **React Toastify** — For toast notifications
- **Next.js App Router** — For page routing
- **LocalStorage** — For saving plan and saved workout data
- **REST API** — For fetching workout information
- **Git & GitHub** — For version control

---

## Project Structure

```text
workout-tracker/
│
├── public/
│   ├── logo.png
│   └── ...
│
├── src/
│   └── app/
│       ├── components/
│       │   ├── Navbar.tsx
│       │   └── Footer.tsx
│       │
│       ├── my-plan/
│       │   └── page.tsx
│       │
│       ├── workout/
│       │   └── [id]/
│       │       └── page.tsx
│       │
│       ├── globals.css
│       ├── layout.tsx
│       ├── not-found.tsx
│       └── page.tsx
│
├── package.json
├── README.md
├── tsconfig.json
└── ...