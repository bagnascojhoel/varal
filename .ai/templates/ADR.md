# ADR {{YYYY-MM-DD}} — {{Feature Title}}

## 1. Title and Metadata

**Title**: {{Short descriptive title}}
**Status**: 🔄 Draft | ✅ Approved | ❌ Rejected
**Date**: {{YYYY-MM-DD}}
**Decision Makers**: {{@handle}}
**Related Features**: {{List of related domain entities, services, or components}}

---

## 📋 FEATURE ANALYSIS

**Story**: {{One sentence describing the user-facing goal}}
**Type**: {{New Feature | Refactor | Bug Fix | Architecture Change}} — {{Domain | UI | Infrastructure | Full-stack}}

**Functional Requirements**:

- ✅ {{Requirement 1}}
- ✅ {{Requirement 2}}
- ✅ {{Requirement 3}}

**UI/UX Requirements Identified** _(if applicable)_:

- {{Interaction behavior, animations, accessibility, touch targets, etc.}}

---

## 2. Context

### 2.1 Business Context & Problem Statement

**Problem**: {{What problem exists today and why it matters}}

**User Journey**:

1. {{Step 1}}
2. {{Step 2}}
3. {{Step 3}}

**Acceptance Criteria**:

- [ ] {{Criterion 1}}
- [ ] {{Criterion 2}}
- [ ] {{Criterion 3}}

---

## 3. Decision

### What Was Decided

**{{Brief name of chosen approach}}**

### Why This Approach Was Chosen

**{{Approach A}}** (vs. {{Alternative B}} / {{Alternative C}}):

✅ {{Advantage 1}}
✅ {{Advantage 2}}
✅ {{Advantage 3}}

### {{Additional sub-decision title, e.g. "Server vs Client Component Strategy"}}

- {{Decision and rationale}}

---

## 4. Architectural Design

### 4.1 Component Architecture

```
{{ASCII diagram of component tree / service graph}}
```

### 4.2 Data Flow

```
{{ASCII diagram or prose describing how data moves through the system}}
```

### 4.3 UI States _(if applicable)_

```
{{ASCII wireframes or state descriptions}}
```

---

## 5. Implementation Details

### 5.1 File Structure

```
{{List of files to create (NEW) or modify (MODIFY), grouped by concern}}
```

### 5.2 {{Additional implementation note, e.g. "ID / Key Format"}}

{{Prose explaining any non-obvious implementation constraint}}

---

## 6. Consequences

### 6.1 Positive

✅ {{Benefit 1}}
✅ {{Benefit 2}}

### 6.2 Negative

⚠️ {{Trade-off or limitation 1}}
⚠️ {{Trade-off or limitation 2}}

### 6.3 Risks

| Risk | Mitigation |
|------|------------|
| {{Risk 1}} | {{Mitigation 1}} |
| {{Risk 2}} | {{Mitigation 2}} |

---

## 7. References

- [{{Related file or doc}}]({{relative path}}) — {{one-line description}}
- [{{External doc}}]({{URL}}) — {{one-line description}}
