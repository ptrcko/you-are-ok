# CODEX — Privacy-First CBT / TEAM-CBT Mental Health App

## 1. Purpose

This project is a **100% privacy-focused mental health self-tracking application** built on:

- **CBT (Cognitive Behavioural Therapy)**
- **TEAM-CBT (Testing, Empathy, Agenda-Setting, Methods)**

The application enables individuals to **privately track, reflect on, and interact with their own mental health patterns**, exercises, and progress.

This is **not** a social product, **not** a medical device, and **not** a data-collecting platform.

The user is the sole owner of their data.

---

## 2. Non-Negotiable Principles

These rules override all other concerns.

### 2.1 Absolute Privacy

- **No servers**
- **No databases**
- **No user accounts**
- **No telemetry**
- **No analytics**
- **No crash reporting**
- **No third-party SDKs**
- **No cookies**
- **No tracking pixels**

### 2.2 Zero Network Dependency

The application must function **fully offline**.

The following are explicitly forbidden:

- HTTP requests
- AJAX / XHR / Fetch
- WebSockets
- External APIs
- External fonts
- External images
- CDN dependencies

If the browser/network is disabled, the app must still work.

---

## 3. Data Model Philosophy

### 3.1 Local-Only Storage

All user data is stored **on the device only**, using:

- `localStorage`
- `IndexedDB`
- or browser-native equivalents

No sync. No background upload. No silent export.

### 3.2 User-Controlled Portability

The app **must** support:

- Explicit **export** of all data (human-readable + machine-readable)
- Explicit **import** of previously exported data
- Zero automation — the user initiates all transfers

Target formats (subject to refinement):

- JSON (primary)
- Optional encrypted bundle (future)

---

## 4. Application Architecture

### 4.1 Deployment Model

- **Static site only**
- No server-side logic
- No runtime backend

Hosting target for testing:
- **Vercel (static hosting mode only)**

The same build must work when served from:
- `file://`
- local static servers
- air-gapped environments

---

### 4.2 Runtime Constraints

- Deterministic behaviour
- No background tasks
- No hidden state
- No time-based side effects without user input

---

## 5. Therapeutic Scope

### 5.1 Core Methodologies

The app is structured around:

- CBT exercises
- TEAM-CBT workflow concepts
- Self-reflection, not diagnosis
- Insight generation, not treatment

The app **does not replace therapy** and must never claim to.

### 5.2 Example Exercise Categories

(Non-exhaustive, to be expanded later)

- Mood tracking
- Cognitive distortions identification
- Thought records
- Fear hierarchies
- Exposure logs
- Cost-benefit analyses
- Relapse awareness and prevention

Each exercise must be:

- Self-contained
- User-initiated
- Editable
- Deletable
- Fully local

---

## 6. UX & Interaction Principles

- Calm, neutral, non-judgmental language
- No gamification
- No streak pressure
- No notifications by default
- No urgency framing

The app should feel like:
> A private notebook with structure, not a productivity tool.

---

## 7. Safety & Ethics

### 7.1 Crisis Handling

- The app **does not intervene**
- The app **does not escalate**
- The app **does not contact anyone**

If crisis resources are referenced:
- They must be static
- They must be optional
- They must never collect data

### 7.2 Data Deletion

- One-action full data wipe
- Clear confirmation
- No recovery unless user has exported data

---

## 8. Technical Guardrails

The following require explicit justification and review:

- Any dependency
- Any build tooling
- Any framework
- Any storage abstraction
- Any encryption layer

Default stance:
> Prefer plain HTML, CSS, and JavaScript.

---

## 9. Development Posture

- This repository starts **empty by design**
- Structure emerges from constraints, not assumptions
- Features are added only when their privacy impact is fully understood

When in doubt:
> Choose the solution that exposes the least surface area.

---

## 10. What This App Is Not

- Not a SaaS
- Not a health data platform
- Not a tracker economy product
- Not a growth-driven app
- Not a replacement for professional care

---

## 11. Future Decisions

Anything not explicitly defined here is **intentionally undecided**.

Future sections may include:

- Data schemas
- Exercise definitions
- Export formats
- Optional encryption
- Accessibility standards

Those will be added **only when required**.

---

## 12. Final Rule

If a feature compromises privacy, autonomy, or user control:

**It does not ship.**
