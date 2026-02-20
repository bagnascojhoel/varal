# UI/UX Rules

## Core Principles

### Mobile-First Design

- All layouts and components must be designed for mobile devices first (320px width minimum).
- Use responsive breakpoints: 768px (tablet), 1024px (desktop).
- Ensure touch-friendly elements (minimum 44px tap targets).

### Accessibility (WCAG 2.1)

- Use semantic HTML5 elements.
- Provide alt text for images.
- Ensure sufficient color contrast (4.5:1 for normal text, 3:1 for large text).
- Support keyboard navigation.
- Use ARIA labels where necessary.
- Test with screen readers.

### Typography — Minimum Sizes

- **Minimum body/label font size: 0.75rem (12px).** Smaller text fails legibility on mobile and violates platform guidelines (iOS HIG, Material Design both set 12sp/12px as the floor).
- Decorative micro-labels (e.g., chart axis ticks) may go as low as 0.625rem (10px) only when they are purely supplementary and not required for comprehension.
- Prefer 0.875rem (14px) or larger for any interactive label.

### Touch Targets

- Minimum **44×44px** tap target for all interactive elements (buttons, links, icons).
- When a visual element is intentionally smaller (e.g., an icon-only edit button), expand the tap area with padding or a transparent pseudo-element while keeping the visual size small.
- Never rely on padding alone if it would break surrounding layout — use negative margin to compensate.

### Performance

- Optimize images and assets.
- Minimize CSS/JS bundle sizes.
- Use system fonts for faster loading.
- Avoid heavy frameworks unless necessary.
- Aim for <3s load times on mobile.

### User Experience

- Keep navigation simple and intuitive.
- Use consistent spacing and typography.
- Provide clear visual hierarchy.
- Include loading states and feedback for interactions.
- Ensure content is scannable with headings and lists.
