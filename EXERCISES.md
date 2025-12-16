# EXERCISES.md — CBT & TEAM-CBT Exercise Specifications

## 1. Purpose

This document defines the **canonical exercise primitives** supported by the app.

Exercises are:
- Structured self-reflection tools
- User-initiated
- Non-prescriptive
- Fully local
- Data-first, UI-agnostic

This file specifies **what an exercise is**, not how it is presented.

---

## 2. Core Exercise Principles

All exercises must satisfy the following:

- Voluntary: no forced flow or sequencing
- Non-evaluative: no “good” or “bad” outcomes
- Transparent: inputs and outputs are visible
- Reversible: entries can be edited or deleted
- Standalone: exercises do not depend on completion of others

No exercise may:
- Diagnose
- Prescribe
- Judge
- Score success or failure

---

## 3. Exercise Taxonomy

Exercises are grouped by **intent**, not severity.

### 3.1 Awareness
- Mood tracking
- Emotional labeling

### 3.2 Cognitive Insight
- Thought records
- Cognitive distortion identification
- Reframing

### 3.3 Behavioural Change
- Fear hierarchies
- Exposure logs

### 3.4 Belief Evaluation
- Cost–benefit analyses
- Assumption testing

### 3.5 Resilience
- Relapse awareness
- Pattern recognition

---

## 4. Exercise Lifecycle

Every exercise instance follows the same lifecycle:

1. User creates an entry
2. User enters data
3. User optionally revisits or edits
4. User optionally deletes

There is **no concept of completion**.

---

## 5. Exercise Definitions

### 5.1 Brief Mood Survey

**Intent:** Snapshot of current emotional state.

**User Inputs:**
- Anxiety (feelings)
- Anxiety (physical)
- Depression
- Suicidal urges

**Scale:**
- 0–4 per item

**Output:**
- Raw item scores
- Category totals

**Rules:**
- No interpretation or thresholds
- No alerts or escalation
- Historical comparison optional and user-driven

---

### 5.2 Thought Record

**Intent:** Capture and examine a distressing thought.

**User Inputs:**
- Situation / trigger (optional)
- Automatic thought
- Emotional response
- Belief strength (0–100)

**Optional Extensions:**
- Distortion tagging
- Reframed thought
- Belief strength after reframing

**Rules:**
- Multiple distortions allowed
- Reframing is optional
- Original thought is never overwritten

---

### 5.3 Cognitive Distortion Identification

**Intent:** Increase awareness of thinking patterns.

**User Inputs:**
- Thought text
- Selected distortions

**Reference Set:**
- Fixed list of cognitive distortions
- Read-only definitions

**Rules:**
- Distortions are descriptive, not labels
- No “correct” number of distortions
- User interpretation prevails

---

### 5.4 Cost–Benefit Analysis

**Intent:** Evaluate the usefulness of a belief, habit, or attitude.

**User Inputs:**
- Target belief or behaviour
- Advantages
- Disadvantages

**Rules:**
- Lists are unordered
- No scoring or weighting required
- Contradictions are allowed

---

### 5.5 Fear Hierarchy

**Intent:** Externalise feared situations on a gradient.

**User Inputs:**
- Description of fear
- Ordered list of fear levels (1–10 recommended)

**Rules:**
- Ordering is user-defined
- Levels may be added, removed, or reordered
- No requirement to reach highest level

---

### 5.6 Exposure Log

**Intent:** Observe anxiety response during exposure.

**User Inputs (per session):**
- Date/time
- Anxiety level at intervals (0–100)
- Frightening thoughts or images

**Optional Links:**
- Reference to a fear hierarchy

**Rules:**
- No required duration
- No expectation of anxiety reduction
- Observational, not corrective

---

### 5.7 Phobia Log (Session Summary)

**Intent:** Summarise an exposure attempt.

**User Inputs:**
- Exposure type
- Time spent
- Anxiety at start
- Anxiety at end
- Notable thoughts

**Rules:**
- Start/end values are informational
- No trend assumptions
- Single session stands alone

---

### 5.8 Relapse Awareness Log

**Intent:** Normalize and examine mood setbacks.

**User Inputs:**
- Upsetting event
- Emotions before
- Emotions after
- Negative thoughts
- Helpful responses or reflections

**Rules:**
- Relapse is framed as expected, not failure
- Emotional vocabulary is user-defined
- No comparison to prior “baseline”

---

## 6. TEAM-CBT Alignment (Conceptual)

The app **supports**, but does not enforce, TEAM-CBT concepts:

- **Testing:** Mood surveys and belief strength ratings
- **Empathy:** Non-judgmental recording of experience
- **Agenda-setting:** User chooses what to work on
- **Methods:** Exercises are tools, not directives

The app does **not**:
- Sequence TEAM steps
- Measure therapeutic progress
- Replace therapist guidance

---

## 7. Exercise Independence

Exercises must not:

- Unlock other exercises
- Depend on prior completion
- Enforce linear workflows

Users may:
- Use one exercise exclusively
- Ignore others entirely
- Combine exercises freely

---

## 8. Language & Tone Constraints

Exercise copy must be:

- Neutral
- Plain-language
- Non-clinical where possible
- Free of urgency or moral framing

Avoid:
- “Should”
- “Must”
- “Correct”
- “Healthy / unhealthy”

---

## 9. Extensibility Rules

New exercises may be added if they:

- Fit one of the intent categories
- Use explicit, inspectable data
- Do not introduce hidden state
- Do not require network access

Each new exercise requires:
- A data schema
- A clear intent statement
- A justification for inclusion

---

## 10. Final Rule

If an exercise pressures the user toward a specific outcome:

**It violates the purpose of this app.**
