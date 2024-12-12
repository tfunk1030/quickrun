# QuickRun App

QuickRun is a simple app designed to take GitHub repositories and make them runnable in minutes. The app automates the installation, dependency setup, and build processes, providing a streamlined experience for developers.

## Overview

QuickRun is divided into two main parts: the frontend and the backend.

- **Frontend**: A Vite-based React application located in the `client/` folder. It runs on port 5173.
- **Backend**: An Express application located in the `server/` folder. It runs on port 3000.

The application uses Docker containers for sandboxed execution, ensuring that dependencies and builds do not interfere with the user's system. The frontend communicates with the backend through API endpoints, and data mocking is managed within the `client/src/api/` folder.

### Project Structure

```
quickrun/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/
│   │   │   ├── Layout.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Sidebar.tsx
│   │   ├── lib/
│   │   │   └── utils.ts
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
└── README.md
```

## Features

1. **GitHub Repository Fetching**:
   - Accepts a GitHub repository URL or allows searching for a repository by name.
   - Clones the repository into a sandboxed environment.

2. **Dependency Detection**:
   - Scans the repository to identify:
     - Programming language.
     - Dependency files (e.g., `package.json`, `requirements.txt`, `Makefile`).
     - Required build tools.

3. **One-Click Setup**:
   - Installs dependencies using package managers (e.g., `npm install`, `pip install`, `apt-get`).
   - Sets up environment variables based on `.env` or inferred configuration.
   - Handles version management (e.g., `nvm` for Node.js or `pyenv` for Python).

4. **Build Automation**:
   - Executes build commands like `npm run build` or `make` based on detected tools.
   - Provides real-time feedback for build errors.

5. **Run Environment**:
   - Offers a 'Run' button to execute apps or scripts.
   - Displays logs and outputs in a terminal-like interface.

6. **Error Handling and Suggestions**:
   - Analyzes build errors and provides actionable suggestions.
   - Links to relevant documentation or GitHub Issues.

7. **Sandboxed Execution**:
   - Utilizes Docker containers for isolated builds.
   - Ensures dependencies and builds do not interfere with the user's system.

8. **Settings and Customization**:
   - Allows users to customize commands or add pre-build steps via a simple configuration editor.

## Getting Started

### Requirements

- Node.js (>=14.x)
- Docker
- Git
- A modern web browser (for frontend testing)

### Quickstart

1. **Clone the repository**:
   ```sh
   git clone <repository-url>
   cd quickrun
   ```

2. **Set up environment variables**:
   Create a `.env` file in the `server/` folder with the following content:
   ```
   DATABASE_URL=<your-database-url>
   SESSION_SECRET=<your-session-secret>
   GITHUB_ACCESS_TOKEN=<your-github-access-token>
   ```

3. **Install dependencies**:
   ```sh
   # In the project root directory
   npm install
   ```

4. **Run the application**:
   ```sh
   npm run start
   ```

   This command uses `concurrently` to run both the frontend and backend servers.

5. **Access the application**:
   Open your browser and navigate to `http://localhost:5173` for the frontend.

### License

The project is proprietary (not open source). 

```
Copyright (c) 2024.
```
