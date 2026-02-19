# Atomic Design Standards

## Methodology Overview

Atomic Design is a methodology for creating design systems. Break down interfaces into fundamental
building blocks that can be reused across projects.

## Hierarchy Levels

### Atoms

- **Definition**: The smallest, indivisible elements (e.g., buttons, inputs, colors, fonts).
- **Implementation**: Define in CSS variables and base classes.
- **Examples**: `.btn`, global typography, color variables.
- **Rules**: Keep atoms context-agnostic; they should work anywhere.

### Molecules

- **Definition**: Groups of atoms that form a unit (e.g., search form, navigation item).
- **Implementation**: Combine atoms with specific relationships.
- **Examples**: `.nav__item`, `.project-card`.
- **Rules**: Molecules should be reusable and not tied to a specific page.

### Organisms

- **Definition**: Complex UI components made of molecules and atoms (e.g., header, footer).
- **Implementation**: Assemble molecules into functional sections.
- **Examples**: `.header`, `.hero`, `.projects`.
- **Rules**: Organisms can be page-specific but should be modular.

### Templates

- **Definition**: Page-level layouts that arrange organisms.
- **Implementation**: Wireframe-like structures with placeholder content.
- **Examples**: Single-page layout with header, main sections, footer.
- **Rules**: Focus on structure, not content.

### Pages

- **Definition**: Specific instances of templates with real content.
- **Implementation**: Populate templates with actual data.
- **Examples**: The portfolio homepage.
- **Rules**: Test for usability and responsiveness.

## Implementation Rules

- **Modularity**: Each level should be independent and reusable.
- **Naming**: Use BEM (Block\_\_Element--Modifier) for CSS classes.
- **Consistency**: Ensure atoms are used consistently across molecules and organisms.
- **Scalability**: Design for easy addition of new components.
- **Documentation**: Update this file when introducing new patterns.
