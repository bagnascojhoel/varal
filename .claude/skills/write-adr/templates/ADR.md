# ADR-{{feature-description}} — {{Feature Title}}

> **File naming convention**: `ADR-<feature-description>.md`
> Use kebab-case for the feature description, e.g. `ADR-start-drying-session.md`.

## 1. Title and Metadata

**Title**: {{Short descriptive title}}
**Status**: 🔄 Draft | ✅ Approved | ❌ Rejected
**Date**: {{YYYY-MM-DD}}
**File**: `ADR-{{feature-description}}.md`
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

### 5.3 BDD Test Scenarios

```gherkin
Feature: {{Feature Name}}

  Scenario: 1 - {{Happy path}}
    Given {{precondition}}
    When {{action}}
    Then {{outcome}}

  Scenario: 2 - {{Validation / edge case}}
    Given {{precondition}}
    When {{action}}
    Then {{outcome}}

  Scenario: 3 - {{Error / conflict case}}
    Given {{precondition}}
    When {{action}}
    Then {{outcome}}
```

### 5.4 E2E API Tests (Playwright)

**Spec file**: `e2e/tests/{{feature-description}}.spec.ts`
**Client helper**: `e2e/tests/helpers/{{feature-description}}-client.ts`

Create a typed client class (modelled after `RestClientService`) that wraps the Playwright `APIRequestContext`. The client encapsulates all requests and response parsing for the endpoint, keeping test bodies focused on assertions.

```typescript
// e2e/tests/helpers/{{feature-description}}-client.ts
export class {{Feature}}ApiClient {
  constructor(private readonly request: APIRequestContext) {}

  async {{action}}(payload: {{PayloadType}}): Promise<{ status: number; body: {{ResponseType}} }> {
    const res = await this.request.{{method}}('/api/{{endpoint}}', { data: payload });
    return { status: res.status(), body: await res.json() };
  }

  // Add a cleanup method if the endpoint persists data (test-only, env-guarded)
  async deleteAll(): Promise<void> {
    await this.request.delete('/api/{{endpoint}}');
  }
}
```

> Note any test infrastructure requirements: DB cleanup strategy, env guards, time-seeding limitations.

#### Test Scenarios

| # | Scenario name | Expected status |
| - | ------------- | --------------- |
| 1 | {{Scenario 1}} | {{status}} |
| 2 | {{Scenario 2}} | {{status}} |

> **Note**: Document any BDD scenario that cannot be exercised through the API alone (e.g. time-based or DB-seeded preconditions) and defer it with a clear explanation.

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
