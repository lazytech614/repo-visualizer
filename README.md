# 🗂️ Repo Visualizer

> A monorepo tool for **visualizing repository structure** and **dependency graphs** of TypeScript/JavaScript projects — built with React, NestJS, and a shared analyzer library.

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Architecture](#-project-architecture)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the App](#running-the-app)
- [API Reference](#-api-reference)
  - [Endpoints](#endpoints)
  - [Request & Response Format](#request--response-format)
- [How It Works](#-how-it-works)
  - [The Analyzer Package](#the-analyzer-package)
  - [The Backend (NestJS)](#the-backend-nestjs)
  - [The Frontend (React)](#the-frontend-react)
- [Usage Guide](#-usage-guide)
- [Monorepo Setup](#-monorepo-setup)
- [Development Workflow](#-development-workflow)
- [Configuration](#-configuration)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🔍 Overview

**Repo Visualizer** is a full-stack developer tool that analyzes any TypeScript or JavaScript project on your local machine and presents its internals in two powerful ways:

1. **A file tree view** — a VS Code-style collapsible explorer of every file and folder in your project.
2. **An interactive dependency graph** — a node-link diagram showing how files import each other, with cycle detection highlighted.

This is particularly useful for:
- Onboarding to an unfamiliar codebase
- Identifying tightly coupled modules
- Finding circular dependencies that might be causing bugs or slow builds
- Getting a quick structural overview before refactoring

---

## ✨ Features

| Feature | Description |
|---|---|
| 📁 **Repository Tree** | Explore your project's file structure in a VS Code-style collapsible tree view |
| 🔗 **Dependency Graph** | Visualize file-to-file import relationships as an interactive node graph powered by ReactFlow |
| 🔄 **Cycle Detection** | Automatically detect and highlight circular dependencies in your codebase |
| 📊 **Stats Overview** | See at a glance: total files, directories, number of dependencies, and cycle count |
| ⚡ **Interactive Graph** | Click any node in the dependency graph to see which files it imports and which files import it |
| 🖥️ **Local Analysis** | Analyzes any project on your local machine by absolute path — no Git required |

---

## 🛠️ Tech Stack

### Frontend (`apps/frontend`)
| Technology | Purpose |
|---|---|
| **React** | UI framework |
| **TypeScript** | Type-safe JavaScript |
| **ReactFlow** | Interactive dependency graph rendering |
| **rc-tree** | VS Code-style collapsible file tree |
| **Tailwind CSS** | Utility-first styling |
| **Vite** | Fast dev server and build tool |

### Backend (`apps/backend`)
| Technology | Purpose |
|---|---|
| **NestJS** | Opinionated Node.js framework for REST APIs |
| **TypeScript** | Type-safe JavaScript |

### Shared Package (`packages/analyzer`)
| Technology | Purpose |
|---|---|
| **TypeScript** | Core analysis library |
| **`@myapp/analyzer`** | Tree generation, dependency resolution, cycle detection |

### Monorepo Tooling
| Tool | Purpose |
|---|---|
| **pnpm** | Fast, disk-efficient package manager with workspace support |
| **pnpm workspaces** | Links packages together without publishing to npm |

---

## 🏗️ Project Architecture

```
┌─────────────────────────────────────────────────────────┐
│                        User Browser                       │
│                                                           │
│   ┌─────────────────────────────────────────────────┐    │
│   │              React Frontend (Vite)               │    │
│   │  ┌───────────────┐  ┌────────────────────────┐  │    │
│   │  │  File Tree     │  │   Dependency Graph     │  │    │
│   │  │  (rc-tree)     │  │   (ReactFlow)          │  │    │
│   │  └───────────────┘  └────────────────────────┘  │    │
│   │         │  Stats Overview  │                     │    │
│   └─────────┼──────────────────┼─────────────────────┘    │
└─────────────┼──────────────────┼───────────────────────────┘
              │   HTTP POST       │
              ▼                  ▼
┌─────────────────────────────────────────────────────────┐
│               NestJS Backend (:3000)                      │
│                                                           │
│  POST /repository/tree         POST /repository/deps      │
│         │                               │                 │
└─────────┼───────────────────────────────┼─────────────────┘
          │                               │
          ▼                               ▼
┌─────────────────────────────────────────────────────────┐
│            @myapp/analyzer (Shared Package)               │
│                                                           │
│  ┌──────────────────┐    ┌──────────────────────────┐    │
│  │  Tree Generator   │    │  Dependency Analyzer     │    │
│  │  (walks FS)       │    │  (parses imports)        │    │
│  └──────────────────┘    └──────────────────────────┘    │
│                           ┌──────────────────────────┐    │
│                           │  Cycle Detector (DFS)    │    │
│                           └──────────────────────────┘    │
└───────────────────────────────────────────────────────────┘
              │
              ▼
      Your Local Project Files
```

The architecture is deliberately simple:

- The **frontend** collects a local path from the user and fires two API requests (one for the tree, one for dependencies).
- The **backend** receives those requests, delegates analysis to the shared `@myapp/analyzer` package, and returns structured JSON.
- The **analyzer** does all the heavy lifting: it walks the file system, parses TypeScript/JavaScript `import` statements, builds a dependency graph, and runs a depth-first search to find cycles.

---

## 📁 Project Structure

```
repo-visualizer/
│
├── apps/
│   ├── frontend/               # React + Vite application
│   │   ├── src/
│   │   │   ├── components/     # UI components (tree, graph, stats)
│   │   │   ├── hooks/          # Custom React hooks
│   │   │   ├── types/          # TypeScript type definitions
│   │   │   ├── App.tsx         # Root component
│   │   │   └── main.tsx        # Vite entry point
│   │   ├── index.html
│   │   ├── tailwind.config.js
│   │   ├── vite.config.ts
│   │   └── package.json
│   │
│   └── backend/                # NestJS REST API
│       ├── src/
│       │   ├── repository/     # Feature module
│       │   │   ├── repository.controller.ts   # Route handlers
│       │   │   ├── repository.service.ts      # Business logic
│       │   │   └── repository.module.ts       # NestJS module
│       │   ├── app.module.ts   # Root module
│       │   └── main.ts         # Bootstrap entry point
│       ├── nest-cli.json
│       └── package.json
│
├── packages/
│   └── analyzer/               # Shared analysis library
│       ├── src/
│       │   ├── tree.ts         # File system tree builder
│       │   ├── dependencies.ts # Import parser & graph builder
│       │   ├── cycles.ts       # Cycle detection (DFS)
│       │   └── index.ts        # Public exports
│       ├── tsconfig.json
│       └── package.json        # name: "@myapp/analyzer"
│
├── test.ts                     # Root-level test/scratch file
├── package.json                # Root workspace package.json
├── pnpm-workspace.yaml         # Declares workspace packages
├── pnpm-lock.yaml              # Lockfile
└── .gitignore
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- **Node.js** `18.x` or higher — [Download](https://nodejs.org/)
- **pnpm** `8.x` or higher — Install with:
  ```bash
  npm install -g pnpm
  ```

Verify your versions:
```bash
node --version   # should be >= 18.0.0
pnpm --version   # should be >= 8.0.0
```

### Installation

Clone the repository and install all dependencies from the root:

```bash
# Clone the repo
git clone https://github.com/lazytech614/repo-visualizer.git
cd repo-visualizer

# Install all workspace dependencies in one command
pnpm install
```

pnpm will install dependencies for all three workspaces (`frontend`, `backend`, `analyzer`) and link the `@myapp/analyzer` package locally so it's available to the backend without publishing to npm.

### Running the App

You need two terminals — one for the backend and one for the frontend.

**Terminal 1 — Start the Backend:**
```bash
cd apps/backend
pnpm start:dev
```

The NestJS server starts at **`http://localhost:3000`** with hot-reload enabled.

**Terminal 2 — Start the Frontend:**
```bash
cd apps/frontend
pnpm dev
```

The Vite dev server starts at **`http://localhost:5173`** with Hot Module Replacement.

> **Note:** Make sure the backend is running before you try to analyze a project from the UI, as the frontend depends on it for all analysis.

---

## 📡 API Reference

The backend exposes a `RepositoryModule` under the `/repository` prefix.

### Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/repository/tree` | Returns the file system tree for a given project path |
| `POST` | `/repository/dependencies` | Returns the dependency graph and cycle information for a given path |

### Request & Response Format

Both endpoints accept the same request body:

**Request Body:**
```json
{
  "path": "C:/Users/you/projects/my-app"
}
```

- `path` — An **absolute path** to any TypeScript or JavaScript project on your machine.

---

**`POST /repository/tree` — Response:**

Returns a recursive tree structure representing the project's file system.

```json
{
  "tree": {
    "name": "my-app",
    "type": "directory",
    "children": [
      {
        "name": "src",
        "type": "directory",
        "children": [
          { "name": "index.ts", "type": "file" },
          { "name": "utils.ts", "type": "file" }
        ]
      },
      { "name": "package.json", "type": "file" }
    ]
  }
}
```

---

**`POST /repository/dependencies` — Response:**

Returns a flat list of nodes and edges for the dependency graph, along with any detected cycles.

```json
{
  "nodes": [
    { "id": "src/index.ts" },
    { "id": "src/utils.ts" }
  ],
  "edges": [
    { "source": "src/index.ts", "target": "src/utils.ts" }
  ],
  "cycles": [
    ["src/a.ts", "src/b.ts", "src/a.ts"]
  ],
  "stats": {
    "totalFiles": 12,
    "totalDirectories": 4,
    "totalDependencies": 18,
    "cycleCount": 1
  }
}
```

---

## ⚙️ How It Works

### The Analyzer Package

The `@myapp/analyzer` package (`packages/analyzer`) is the brain of the tool. It contains three core modules:

#### 1. Tree Generator (`tree.ts`)

Walks the file system recursively starting from the given path, skipping common non-source directories (`node_modules`, `.git`, `dist`, `build`, etc.). Returns a nested JSON tree compatible with `rc-tree`'s data format.

```
Project Root
├── src/
│   ├── index.ts         ← File node
│   └── components/
│       └── Button.tsx   ← File node
└── package.json         ← File node
```

#### 2. Dependency Analyzer (`dependencies.ts`)

For each TypeScript/JavaScript file it finds, it reads the file content and uses a regular expression (or a light AST parse) to extract all `import` statements. It resolves relative imports to their absolute paths within the project, then builds a directed graph:

- **Node** = a file
- **Edge** = an import statement (`source` imports from `target`)

#### 3. Cycle Detector (`cycles.ts`)

Runs a **Depth-First Search (DFS)** on the directed dependency graph. It maintains a "visited" set and a "recursion stack". When DFS encounters a node already on the recursion stack, a cycle has been found. The cycle is traced back and returned as an ordered path of file names.

```
a.ts → b.ts → c.ts → a.ts   ← CYCLE DETECTED
```

---

### The Backend (NestJS)

The backend is a minimal NestJS application with a single feature module: `RepositoryModule`.

**`repository.controller.ts`** — Defines two `@Post()` routes that extract the `path` from the request body and delegate to the service.

**`repository.service.ts`** — Calls the appropriate functions from `@myapp/analyzer` and returns the results. This is where the analyzer package is wired into the HTTP layer.

**`main.ts`** — Bootstraps the NestJS app and enables CORS so the frontend (running on port 5173) can make requests to the backend (port 3000).

```typescript
// CORS is required because frontend and backend run on different ports
app.enableCors();
await app.listen(3000);
```

---

### The Frontend (React)

The frontend is a Vite + React app with three main UI areas:

**Path Input** — A text field where the user enters the absolute path to the project they want to analyze, and an **Analyze** button that triggers both API calls simultaneously.

**File Tree Panel** — Uses the `rc-tree` library to render the tree returned by `/repository/tree` as a collapsible, VS Code-style explorer. Folders can be expanded/collapsed; files are leaf nodes.

**Dependency Graph Panel** — Uses `ReactFlow` to render the dependency graph returned by `/repository/dependencies`. Each file is a draggable node; each import is a directed edge (arrow). Nodes can be clicked to highlight their direct imports and their importers. Cycles are visually distinguished (e.g., highlighted edges or node colors).

**Stats Bar** — Displays summary statistics at the top: total files, total directories, total dependency edges, and number of cycles.

---

## 📖 Usage Guide

1. **Start both servers** as described in [Running the App](#running-the-app).

2. **Open the app** at `http://localhost:5173`.

3. **Enter an absolute path** to any TypeScript or JavaScript project on your machine in the input field. Examples:
   - Windows: `C:\Users\you\projects\my-react-app`
   - macOS/Linux: `/home/you/projects/my-express-api`

4. **Click Analyze.** The app will call both API endpoints and populate:
   - The file tree on the left/top panel
   - The dependency graph on the right/bottom panel
   - The stats bar at the top

5. **Explore the file tree** by expanding and collapsing folders.

6. **Explore the graph:**
   - **Pan** by clicking and dragging the background
   - **Zoom** with the scroll wheel or pinch gesture
   - **Move nodes** by dragging them
   - **Click a node** to highlight all edges connected to it (its imports and importers)

7. **Review cycles** — any circular dependencies detected will be highlighted in the graph and counted in the stats bar.

---

## 📦 Monorepo Setup

This project uses **pnpm workspaces**. The workspace configuration is in `pnpm-workspace.yaml`:

```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

This tells pnpm to treat every folder inside `apps/` and `packages/` as a separate package. The root `package.json` contains shared dev tooling scripts.

The backend references the analyzer as a local dependency:

```json
// apps/backend/package.json
{
  "dependencies": {
    "@myapp/analyzer": "workspace:*"
  }
}
```

The `workspace:*` protocol tells pnpm to resolve this package from the local `packages/analyzer` directory instead of npm — so changes to the analyzer are instantly available to the backend without a publish step.

---

## 🔧 Development Workflow

### Running tests

```bash
# From the root (if test scripts are configured)
pnpm test

# Or from individual workspaces
cd packages/analyzer && pnpm test
```

### Building for production

```bash
# Build the analyzer package first
cd packages/analyzer && pnpm build

# Build the backend
cd apps/backend && pnpm build

# Build the frontend
cd apps/frontend && pnpm build
```

The frontend build output lands in `apps/frontend/dist/` and can be served by any static file server or CDN.

### Adding a new dependency

Always use `pnpm` from the correct workspace directory:

```bash
# Add a dependency to the frontend only
cd apps/frontend && pnpm add some-library

# Add a dependency to the backend only
cd apps/backend && pnpm add some-library

# Add a dev dependency to the root (shared tooling)
pnpm add -Dw some-dev-tool
```

---

## ⚙️ Configuration

### Backend port

The NestJS server defaults to port `3000`. To change it, edit `apps/backend/src/main.ts`:

```typescript
await app.listen(3000); // change this number
```

### Frontend API base URL

The frontend points to `http://localhost:3000` by default. If you change the backend port, update the API base URL in the frontend's environment or config. With Vite, you can use an `.env` file:

```bash
# apps/frontend/.env
VITE_API_BASE_URL=http://localhost:3000
```

Then reference it in your code as `import.meta.env.VITE_API_BASE_URL`.

### Analyzer ignore list

By default the analyzer ignores `node_modules`, `.git`, `dist`, `build`, and similar directories. These exclusions live in `packages/analyzer/src/tree.ts` and can be extended if needed.

---

## 🐛 Troubleshooting

**"CORS error" in the browser console**

Make sure the NestJS backend has CORS enabled (`app.enableCors()` in `main.ts`) and that both servers are running.

**"Cannot find module '@myapp/analyzer'"**

Run `pnpm install` from the repo root to ensure workspace symlinks are created.

**The graph is empty but the tree loads**

Check that the analyzed project contains TypeScript or JavaScript files with `import` statements. The analyzer only parses `.ts`, `.tsx`, `.js`, and `.jsx` files.

**"ENOENT: no such file or directory"**

Double-check the path you entered. It must be an absolute path and the directory must exist on the machine running the backend server.

**Port already in use**

If port `3000` or `5173` is occupied, kill the conflicting process or change the ports in the respective config files.

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-new-feature`
3. Make your changes and commit: `git commit -m 'feat: add my new feature'`
4. Push to your fork: `git push origin feature/my-new-feature`
5. Open a Pull Request against `main`

Please keep PRs focused — one feature or fix per PR makes reviewing much easier.

### Ideas for contributions

- Export the dependency graph as SVG or PNG
- Filter nodes by file type or directory
- Show import counts as node sizes (weighted graph)
- Add a search bar to the file tree
- Dark/light theme toggle

---

<div align="center">

Built by [lazytech614](https://github.com/lazytech614)

</div>