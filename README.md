# Voice Agent Call Analytics Dashboard

A real-time analytics dashboard for modern voice interfaces. Monitor call duration, detect hostile interactions, and optimize agent performance with visual data representation.

## Features

- **Duration Monitoring**: Visualize call length distribution across time slots.
- **Sad Path Analysis**: Track and categorize negative call outcomes (e.g., aggression, language issues).
- **Interactive Configuration**: Customize thresholds and color coding for different metrics.
- **Email Integration**: (In Progress) Submit configurations and data to a persistent backend.

## Run Locally

**Prerequisites:** Node.js, PostgreSQL (optional for full features)

1.  **Install dependencies**:
    ```bash
    npm install
    ```

2.  **Environment Setup**:
    - Copy `.env.example` to `.env.local`
    - Add your PostgreSQL credentials if connecting to a database.

3.  **Run the app**:
    ```bash
    npm run dev
    ```
    This will start the Vite frontend.
