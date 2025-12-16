````md
# DATA_MODEL.md — Canonical Local Data Schemas

## 1. Purpose

This document defines the **authoritative data model** for the application.

It exists to ensure that:

- All stored data is **predictable**
- All data is **portable**
- All data is **user-owned**
- All data is **future-migratable**

This is **not** an implementation document.  
It defines **what exists**, not how it is rendered.

---

## 2. Core Principles

### 2.1 User Sovereignty

- All records belong to the user
- No derived data is irreversible
- Nothing is hidden or implicit

### 2.2 Explicitness Over Convenience

- No inferred fields
- No magic defaults
- No background mutation

If a value exists, it was explicitly created.

---

## 3. Global Data Container

All persisted data lives inside **one root object**.

```json
{
  "meta": {},
  "profile": {},
  "entries": {},
  "exercises": {},
  "settings": {}
}
````

This object is what is exported and imported.

---

## 4. Meta Block

System-level metadata.

```json
{
  "schemaVersion": "1.0.0",
  "createdAt": "ISO-8601",
  "lastUpdatedAt": "ISO-8601",
  "appVersion": "optional",
  "notes": "optional free text"
}
```

Rules:

* `schemaVersion` is mandatory
* Timestamps are informational only
* No automated updates without user action

---

## 5. Profile Block (Optional)

The user is **not required** to identify themselves.

```json
{
  "displayName": "optional",
  "timezone": "optional",
  "locale": "optional",
  "preferences": {}
}
```

Rules:

* Entire block may be empty
* No assumptions are made about identity
* No profile data is required for functionality

---

## 6. Entry Model (Base Primitive)

Most user-created items extend this base shape.

```json
{
  "id": "uuid",
  "type": "string",
  "createdAt": "ISO-8601",
  "updatedAt": "ISO-8601",
  "deleted": false,
  "tags": [],
  "notes": "optional"
}
```

Rules:

* `id` is immutable
* Soft deletion preferred over removal
* `type` determines schema interpretation

---

## 7. Mood Tracking Entries

### 7.1 Brief Mood Survey

Represents a single mood snapshot.

```json
{
  "id": "uuid",
  "type": "mood_survey",
  "createdAt": "ISO-8601",
  "scores": {
    "anxiety_feelings": [0,1,2,3,4],
    "anxiety_physical": [0,1,2,3,4],
    "depression": [0,1,2,3,4],
    "suicidal_urges": [0,1,2,3,4]
  },
  "totals": {
    "anxiety_feelings": 0,
    "anxiety_physical": 0,
    "depression": 0,
    "suicidal_urges": 0
  }
}
```

Rules:

* Raw scores are preserved
* Totals are derived but stored for transparency
* No interpretation is imposed

---

## 8. Cognitive Distortions

### 8.1 Distortion Reference Set

Stored as static definitions.

```json
{
  "id": "distortion_id",
  "label": "All-or-Nothing Thinking",
  "description": "..."
}
```

This list is **read-only**.

---

### 8.2 Distortion Tagging Entry

```json
{
  "id": "uuid",
  "type": "distortion_log",
  "thought": "free text",
  "distortions": ["AON", "OG"],
  "beliefStrength": 0,
  "reframedThought": "optional",
  "beliefStrengthAfter": 0
}
```

Rules:

* Multiple distortions allowed
* Belief strength uses a 0–100 scale
* Reframing is optional

---

## 9. Cost–Benefit Analysis

```json
{
  "id": "uuid",
  "type": "cost_benefit",
  "targetBelief": "string",
  "advantages": ["string"],
  "disadvantages": ["string"]
}
```

Rules:

* No scoring required
* Ordering preserved
* User language retained verbatim

---

## 10. Fear Hierarchy

```json
{
  "id": "uuid",
  "type": "fear_hierarchy",
  "description": "string",
  "levels": [
    {
      "level": 1,
      "fear": "string"
    }
  ]
}
```

Rules:

* Levels are explicit
* No auto-sorting
* User controls structure

---

## 11. Exposure Logs

```json
{
  "id": "uuid",
  "type": "exposure_log",
  "hierarchyId": "optional",
  "entries": [
    {
      "timestamp": "ISO-8601",
      "anxiety": 0,
      "thoughts": "optional"
    }
  ]
}
```

Rules:

* Anxiety uses a 0–100 scale
* Logs are sequential, not averaged
* No interpretation applied

---

## 12. Relapse Logs

```json
{
  "id": "uuid",
  "type": "relapse_log",
  "event": "string",
  "emotionsBefore": {},
  "emotionsAfter": {},
  "thoughts": [],
  "responses": []
}
```

Rules:

* Free-form emotional descriptors allowed
* Before/after preserved independently
* No enforced taxonomy

---

## 13. Settings Block

```json
{
  "dataRetention": "indefinite",
  "confirmDeletions": true,
  "exportFormat": "json"
}
```

Rules:

* Settings never alter stored data
* Settings are local preferences only

---

## 14. Deletion Model

Deletion is **logical**, not physical.

```json
{
  "deleted": true,
  "deletedAt": "ISO-8601"
}
```

Rules:

* Deleted data must still export
* User controls permanent purge explicitly

---

## 15. Migration Guarantees

* Every schema change increments `schemaVersion`
* Older exports must never be auto-modified
* Migration must be previewable
* Failure must be non-destructive

---

## 16. Forbidden Patterns

The following are not allowed:

* Implicit joins
* Cross-record mutation
* Hidden derived state
* Time-based recalculation
* Aggregation without raw preservation

---

## 17. Final Rule

If data cannot be clearly explained to the user in plain language:

**The data structure is invalid.**

```

---

### Next recommended file

- `EXERCISES.md` — formal definitions of CBT / TEAM-CBT workflows  
- `EXPORT_FORMAT.md` — portable, versioned data contract  

Say **which one next** and we continue.
```
