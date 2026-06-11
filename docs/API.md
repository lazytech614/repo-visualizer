# API Documentation

## POST /repository/analyze

Analyze repository structure.

### Request

```json
{
  "path": "/Users/demo/project"
}
```

### Response

```json
{
  "tree": {}
}
```

---

## POST /repository/dependencies

Returns dependency graph.

---

## POST /repository/cycles

Returns circular dependencies.

---

## POST /repository/dead-files

Returns dead files.

---

## POST /repository/hotspots

Returns hotspot files.

---

## POST /repository/complexity

Returns complexity analysis.

---

## POST /repository/health

Returns repository health score.

---

## POST /repository/summary

Returns AI-generated summary.

---

## POST /repository/report

Returns exported report.