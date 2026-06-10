# Repo Visualizer

A monorepo tool for visualizing repository structure and dependency graphs of TypeScript/JavaScript projects.

## Features

- 📁 **Repository Tree** — Explore your project's file structure in a VS Code-style tree view
- 🔗 **Dependency Graph** — Visualize file dependencies as an interactive node graph
- 🔄 **Cycle Detection** — Automatically detect circular dependencies in your codebase
- 📊 **Stats Overview** — See total files, directories, dependencies, and cycle count at a glance

## Tech Stack

**Frontend**
- React + TypeScript
- ReactFlow (dependency graph)
- rc-tree (file tree)
- Tailwind CSS
- Vite

**Backend**
- NestJS
- TypeScript

**Packages**
- `@myapp/analyzer` — Core analysis logic (tree generation, dependency analysis, cycle detection)

## Project Structure

repo-visualizer/
├── apps/
│   ├── frontend/        # React app
│   └── backend/         # NestJS API
├── packages/
│   └── analyzer/        # Shared analysis library
├── package.json
└── pnpm-workspace.yaml

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm

### Installation

```bash
pnpm install
```

### Running the app

```bash
# Run backend
cd apps/backend
pnpm start:dev

# Run frontend (in a separate terminal)
cd apps/frontend
pnpm dev
```

The frontend will be available at `http://localhost:5173` and the backend at `http://localhost:3000`.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/repository/tree` | Get file tree for a given path |
| POST | `/repository/dependencies` | Get dependency graph for a given path |

### Request Body

```json
{
  "path": "C:/Users/your/project/path"
}
```

## Usage

1. Enter the absolute path to any TypeScript/JavaScript project
2. Click **Analyze**
3. Explore the file tree and dependency graph
4. Click any node in the graph to see its imports and dependents