
---

## 3. Runtime Environment

### 3.1 Required Execution Contexts

The app must work identically in:

- Desktop browsers (Chromium, Firefox, Safari)
- Mobile browsers (iOS, Android)
- Offline mode
- `file://` protocol
- Static hosting (e.g. Vercel)

No assumptions may be made about:

- Network availability
- Clock accuracy
- Persistent sessions
- User identity

---

### 3.2 Explicitly Unsupported Features

The following are **not allowed** unless this document is updated:

- Server-side rendering
- API endpoints
- Background sync
- Push notifications
- WebSockets
- Service workers
- Browser extensions
- Native wrappers

---

## 4. Layered Responsibility Model

### 4.1 Presentation Layer

Responsibilities:

- Render content
- Display user-entered data
- Display calculated insights
- Provide clear affordances for actions

Constraints:

- No business logic
- No direct storage access
- No implicit side effects

---

### 4.2 Interaction Layer

Responsibilities:

- Handle user input
- Validate input locally
- Trigger state transitions

Constraints:

- No persistence
- No network access
- No mutation without explicit user action

---

### 4.3 State Engine

Responsibilities:

- Hold in-memory application state
- Apply CBT / TEAM-CBT logic
- Perform calculations and transformations
- Enforce schema rules

Constraints:

- Pure functions where possible
- Predictable state transitions
- No direct DOM access
- No direct storage access

---

### 4.4 Storage Layer

Responsibilities:

- Persist user data locally
- Retrieve user data on load
- Support full export and import

Allowed mechanisms:

- `localStorage`
- `IndexedDB`

Constraints:

- No encryption assumptions
- No background writes
- No silent migration
- All schema changes must be explicit

---

## 5. Data Flow Rules

### 5.1 Write Rules

Data may only be written when:

- The user performs a visible action
- The action has an immediate, understandable effect
- The user can undo or delete the data

### 5.2 Read Rules

- Reads may occur on app load
- Reads must not trigger writes
- Reads must not mutate state

---

## 6. Import / Export Architecture

### 6.1 Export

Exports must:

- Be user-initiated
- Include all user data
- Be human-readable (JSON)
- Be deterministic
- Contain version metadata

No automatic export. No cloud backup.

---

### 6.2 Import

Imports must:

- Be explicit
- Be previewable
- Validate schema and version
- Never overwrite without confirmation

Partial imports may be supported later but are not assumed.

---

## 7. Versioning Strategy

- App version ≠ data version
- Data schema versions must be embedded in exports
- Breaking changes require migration logic
- No silent migrations

If migration fails:
- Data remains untouched
- User is informed clearly

---

## 8. Dependency Policy

Default position:

> Zero dependencies.

Any dependency must justify:

- Why native browser features are insufficient
- Its long-term maintenance viability
- Its privacy impact
- Its offline behaviour

---

## 9. Security Posture

Threat model assumes:

- Curious user
- Shared device
- Local inspection
- Accidental exposure

Architecture defends against:

- Accidental uploads
- Silent data leaks
- Hidden persistence

Architecture does **not** attempt to defend against:

- Device compromise
- Malicious browser extensions
- OS-level threats

---

## 10. Observability (Intentional Absence)

There is:

- No logging beyond local debugging
- No remote error reporting
- No usage metrics

Failures must be visible to the user, not reported elsewhere.

---

## 11. Accessibility & Longevity

Architecture must support:

- Long-term use without updates
- Data survival across browser upgrades
- Graceful degradation

No feature should require constant maintenance to remain usable.

---

## 12. Change Discipline

Any change that:

- Expands surface area
- Adds implicit behaviour
- Introduces automation

**must be documented here first**.

Architecture is a constraint, not a suggestion.

---

## 13. Final Rule

If an architectural choice introduces ambiguity about where data lives or how it moves:

**The choice is invalid.**
