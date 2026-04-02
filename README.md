# Code Complexity Estimator

A premium, localized tool for analyzing code structure and complexity without external AI dependencies. Built with Next.js (App Router), TypeScript, and SQLite.

## 🚀 Key Features

*   **Offline Complexity Profiling:** Analyze loops, conditionals, recursion, and nesting depth using local regex/string parsing.
*   **Privacy First:** No AI APIs. All analysis logic runs on your local server.
*   **Persistent Session History:** Track your past analyses via a local SQLite database.
*   **Identity Management:** Browser-level user identification (UID) with customizable display names.
*   **Premium Dark Aesthetic:** Modern UI featuring glassmorphism, gradients, and a responsive layout.

## 🛠️ Tech Stack

*   **Frontend:** Next.js 15 (App Router), React 19, Tailwind CSS 4.
*   **Backend:** Next.js Route Handlers.
*   **Database:** SQLite via `better-sqlite3`.
*   **Logic:** Native Regex and lexical string parsing.

## ⚙️ Setup Instructions

1.  **Clone or Download** the repository.
2.  **Install Dependencies:**
    ```bash
    npm install
    ```
3.  **Run Development Server:**
    ```bash
    npm run dev
    ```
4.  **Access App:** Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📊 Complexity Logic

The estimator uses a weighted scoring system:
*   **Loops (`for`, `while`):** +2 per instance.
*   **Conditionals (`if`, `switch`):** +1 per instance.
*   **Recursion:** +3 if function patterns repeat within the scope.
*   **Nesting Factor:** Maximum bracket depth (`{ }`) acts as a multiplier for the base score.

**Levels:**
*   **Low:** Score < 10
*   **Medium:** 10 ≤ Score < 30
*   **High:** Score ≥ 30

## 📁 Folder Structure

*   `/src/app`: App Router pages and API routes.
*   `/src/components`: Shared React components (Navbar, etc.).
*   `/src/lib`: Core logic (Complexity analyzer, Database setup, Auth helpers).
*   `/src/types`: TypeScript interfaces.
*   `estimator.db`: Local SQLite database (created on first run).
