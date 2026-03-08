# Design v2 — GIF Weather Background + Mobile Carousel + Live Clock

## What this designs

An updated version of the main Varal screen with three improvements over v1:

1. **Animated GIF background** matching today's weather condition, replacing the
   CSS gradient sky and JS-animated rain drops.
2. **Mobile carousel** — the three day-cards scroll horizontally with snap
   behavior and dot indicators, instead of the previous grid where today spanned
   full width and tomorrow/day-after sat side by side.
3. **Live clock** in the app header, showing the current local time in HH:MM
   format.

## Design decisions

- **GIF layer sits at `z-index:0`, scrim at `z-index:1`, content at
  `z-index:10`**: The GIF fills the viewport but is dimmed by a semi-transparent
  overlay (`weather-scrim`) so glass cards always remain readable regardless of
  how busy the GIF is.

- **CSS fallback gradient always renders underneath the GIF**: The `::before`
  pseudo-element (keyed to `body[data-weather]`) provides an appropriate color
  backdrop. This means the design looks intentional even before the GIF loads,
  and works gracefully if the GIF file is missing.

- **GIF opacity is 0.58**: Blended with the fallback gradient rather than
  replacing it entirely. This keeps the atmosphere cohesive even if the GIF is
  bright or low-contrast.

- **`body[data-weather]` controls both the fallback gradient and the scrim
  opacity**: A single attribute is the source of truth for the weather state.
  Set it server-side (SSR) so there's no flash on load.

- **Carousel uses CSS scroll-snap** (`scroll-snap-type: x mandatory` /
  `scroll-snap-align: start`): Native, no JavaScript library required. Smooth on
  iOS/Android with `-webkit-overflow-scrolling: touch`.

- **Cards are `min(88vw, 320px)` wide on mobile**: Leaves ~6% of the next card
  peeking at the right edge, hinting that the list is scrollable without
  obscuring content.

- **Dots have 44×44px tap targets** (the `<button>` element) but visually render
  as small pills via `::after`. This meets WCAG 2.5.5 touch target guidance.

- **Clock renders `—:—` on SSR** to avoid hydration mismatch; the client-side
  `setInterval` replaces it on first tick (< 1 second).

- **Header is not sticky**: The header scrolls with content. On mobile the card
  carousel is the primary interaction, and a sticky header would eat vertical
  space.

## Weather state mapping

| `body[data-weather]` | GIF file              | Trigger condition                                                 |
| -------------------- | --------------------- | ----------------------------------------------------------------- |
| `"rainy"`            | `/weather/rain.gif`   | `precipitationProbabilityMax ≥ 40` OR `precipitationSum ≥ 1mm`    |
| `"cloudy"`           | `/weather/cloudy.gif` | `precipitationProbabilityMax` 20–39%                              |
| `"sunny"`            | `/weather/sunny.gif`  | `precipitationProbabilityMax < 20` AND `precipitationSum < 0.5mm` |

## Sourcing the GIFs

Place royalty-free looping animated GIFs at `/public/weather/`:

- `rain.gif` — search "rain loop background" on
  [giphy.com/explore](https://giphy.com/explore) or
  [tenor.com](https://tenor.com). Look for a full-frame rain/storm loop with
  neutral lighting (the scrim handles darkening).
- `cloudy.gif` — search "overcast sky timelapse loop". Grey tones, moving
  clouds.
- `sunny.gif` — search "blue sky sunny timelapse loop". Bright, fast-moving
  clouds.

Recommended size: 1280×720px minimum, ≤ 4 MB. Use Gifski or ezgif.com to
optimize.

## Screens / files

| File         | Describes                                                                                                    |
| ------------ | ------------------------------------------------------------------------------------------------------------ |
| `index.html` | Full page — rainy state by default. Use the demo switcher (bottom-right) to preview cloudy and sunny states. |

## Open questions for implementation

- [ ] Which reverse geocoding API to use for the city label?
      (nominatim.openstreetmap.org is free; may need rate-limiting proxy)
- [ ] Should the weather GIF state be determined server-side (via API route) or
      client-side after geolocation? Currently domain logic lives in
      `domain/wash-decision.ts` — a new `determineWeatherState()` helper would
      be needed.
- [ ] Should the clock show seconds on desktop where there's more space?
- [ ] What is the fallback if the user's browser denies geolocation — should the
      weather state default to a neutral (cloudy) GIF?

## Next version ideas

- Add a subtle Ken-Burns-style CSS animation on the fallback gradient so it
  doesn't look completely static when the GIF is missing.
- Explore using `<video loop muted autoplay playsinline>` instead of GIF for
  better compression and performance (WebM format, ~80% smaller than GIF).
- Add a swipe-left/right gesture hint (animated arrow or "swipe" label) on first
  visit to teach the carousel pattern.
