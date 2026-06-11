# Architecture

## High-Level Design

```text
React Frontend
      ↓
NestJS Backend
      ↓
Analyzer Engine
      ↓
Repository Filesystem
```

---

## Frontend Layer

Responsibilities:

- Repository Input
- Visualization
- Graph Rendering
- Dashboard

Technologies:

- React
- React Flow
- Tailwind

---

## Backend Layer

Responsibilities:

- API Endpoints
- Analysis Coordination
- AI Integration

Technologies:

- NestJS
- TypeScript

---

## Analyzer Engine

Core analysis package.

Modules:

- Tree Analysis
- Dependency Analysis
- Cycle Detection
- Complexity Analysis
- Health Scoring

---

## AI Layer

Responsibilities:

- Repository Summary
- Architectural Insights
- Refactoring Suggestions

Provider:

- OpenAI

---

## Data Flow

```text
Repository Path
      ↓
Filesystem Scan
      ↓
Tree Analysis
      ↓
Dependency Analysis
      ↓
Complexity Analysis
      ↓
Health Score
      ↓
AI Summary
      ↓
Frontend Dashboard
```