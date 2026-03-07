# Implementation Plan: [Feature Name]

## Instructions for AI Agents

This template guides you in creating comprehensive implementation plans for new features or
architectural changes in the Next.js portfolio website project. Each section serves a specific
purpose and should be filled with thorough analysis and actionable details.

**Key Principles:**

- Be explicit about file paths, interfaces, and implementation details
- Validate against project standards (`.ai/ui-ux-rules.md`,
  `.github/instructions/*.instructions.md`)
- Reference concrete examples from the existing codebase
- Focus on what changes are needed and why, not how to implement them

**When to Create an Implementation Plan:**

- New features requiring multiple file changes
- Architectural changes affecting domain/application/infrastructure layers
- Breaking changes to existing interfaces
- Complex UI/UX implementations requiring design system compliance
- Features with significant testing requirements

---

## 📋 Summary

[Provide a 3-5 sentence overview of what this implementation achieves]

**Key Architectural Principles:**

- [Principle 1: e.g., "Mandatory locale parameters for all repository methods"]
- [Principle 2: e.g., "Domain layer handles fallback logic"]
- [Principle 3: e.g., "Infrastructure is strict, domain is graceful"]

---

## 🔍 Analysis

### Current State

[Describe the current implementation, including:]

- **Existing Files/Interfaces**: Link to relevant files (e.g.,
  `[ArticleRepository](../../src/core/domain/ArticleRepository.ts)`)
- **Current Behavior**: What the system does today
- **Limitations**: What problems exist or features are missing
- **Dependencies**: What external libraries or services are involved

**Example:**

```
- **Repository Interfaces**: [ArticleRepository](../../src/core/domain/ArticleRepository.ts) has simple `fetch*()` methods without locale parameters
- **JSON Adapters**: [ArticleRepositoryJsonAdapter](../../src/core/infrastructure/ArticleRepositoryJsonAdapter.ts) hardcodes file imports
```

### Impact Analysis

[Create a table showing affected components:]

| Layer                    | Components Affected         | Change Type               |
| ------------------------ | --------------------------- | ------------------------- |
| **Domain**               | [List interfaces, entities] | [Breaking/Non-breaking]   |
| **Application Services** | [List services]             | [Signature change/etc.]   |
| **Infrastructure**       | [List adapters]             | [Implementation change]   |
| **UI**                   | [List pages/components]     | [Pass new parameter/etc.] |
| **Tests**                | [List test files]           | [Update mocks/etc.]       |

---

## 💡 Proposed Solution

### Overview

[High-level description of the solution approach]

### 1. Domain Layer Changes

#### 1.1 [Specific Change - e.g., "Update Repository Interfaces"]

**Files to modify:**

- `path/to/file1.ts`
- `path/to/file2.ts`

**Changes:**

[Describe the interface or type changes needed. Specify:]

- Method signatures (parameters, return types)
- New properties or fields
- Breaking vs non-breaking changes
- How existing code will be affected

**Rationale:**

- [Explain why this change is necessary]
- [How it aligns with hexagonal architecture]
- [What benefits it provides]

#### 1.2 [Next Change]

[Repeat pattern for each significant change]

---

### 2. Infrastructure Layer Changes

#### 2.1 [Adapter Name - e.g., "ArticleRepositoryJsonAdapter"]

**File:** `path/to/adapter.ts`

**Implementation Strategy:**

[Describe the implementation approach. Include:]

- High-level logic flow
- Error handling approach
- Key algorithms or patterns to use
- External dependencies or APIs to call
- Edge cases to handle

**Key Points:**

- ✅ [Positive aspect]
- ✅ [Compliance with architecture]
- ⚠️ [Warning or consideration]

---

### 3. Application Services Changes

[Describe changes to application services, including:]

- Method signature updates
- Caching strategies
- Error handling patterns
- Orchestration logic

---

### 4. UI Layer Changes

[Describe changes to React components, including:]

- Server vs Client component decisions
- Props interfaces
- Event handlers
- Next.js App Router integration

---

### 5. Testing Strategy

[Describe the testing approach:]

#### 5.1 Unit Tests to Update/Create

**Files:**

- `tests/path/to/test1.test.ts` [NEW/UPDATE]
- `tests/path/to/test2.test.ts` [NEW/UPDATE]

**Test Cases:**

[List the test scenarios to cover:]

- Happy path: [describe expected behavior]
- Edge cases: [list specific edge cases]
- Error scenarios: [what errors should be tested]
- Integration points: [what interactions to verify]

#### 5.2 Integration Tests

[Describe end-to-end test scenarios]

---

### 6. Data/Configuration Changes

[If applicable, describe:]

- New data files or formats
- Configuration updates
- Environment variables
- Naming conventions

**Example Table:**

| File Type | English (Default)  | Portuguese            |
| --------- | ------------------ | --------------------- |
| Articles  | `articles_en.json` | `articles_pt-br.json` |

**Rules:**

- [Rule 1]
- [Rule 2]

---

## ✅ Validation

**Automated Checks:**

1. Run all tests: `npm test`
2. Run linter/formatter: `npm run lint` and `npm run format`
3. Build succeeds: `npm run build`

**Manual Verification:**

- [ ] [Manual check 1 - e.g., "UI displays correct content for each locale"]
- [ ] [Manual check 2 - e.g., "Error states show appropriate fallback behavior"]

---

## 📚 References

[Link to relevant documentation and standards]

- [Related Feature/ADR](path/to/related-doc.md)
- [Domain Entity](path/to/entity.ts)
- [UI/UX Standards](../../.ai/ui-ux-rules.md)
- [TypeScript Guidelines](../../.github/instructions/typescript.instructions.md)
- [External Documentation](https://example.com)

---

## 📝 Notes for AI Agents

**Before starting implementation:**

1. Run semantic search to find similar patterns in the codebase
2. Validate against `.ai/ui-ux-rules.md` and `.github/instructions/*.instructions.md`
3. Check existing tests for patterns to follow
4. Use MCP tools (Context7) for library-specific documentation

**During implementation:**

1. Follow the solution section order (Domain → Infrastructure → Application → UI → Tests)
2. Run tests after completing each layer
3. Update this document if scope changes

**After implementation:**

1. Verify all validation checks pass (automated and manual)
2. Update references to point to actual implemented files
3. Document any deviations from the plan
