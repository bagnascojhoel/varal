# Personas — Varal

Varal serves two distinct user groups. Each has a separate entry point into the
product: the **Washer** uses the public-facing app; the **Laundry Expert** uses
the backoffice.

---

## Washer

> _"I just want to know if today is a good day to do laundry."_

### Profile

- **Type**: Primary persona
- **Target market**: Brazil (initial focus); general urban/suburban households.
- **Technical literacy**: Low to moderate. Uses a smartphone daily but does not
  engage with weather data or meteorological concepts.
- **Typical context**: Checking the app first thing in the morning, possibly
  while still in bed or having breakfast. Mobile-first.

### Goals

- Get an instant, confident recommendation without reading any data.
- Know whether today (or upcoming days) are safe to hang clothes outside.
- Optionally refine the answer based on their drying setup or garment type.

### Frustrations

- Weather apps show too many numbers, not a clear action.
- Recommendations that don't account for local conditions (e.g. covered balcony
  vs. open yard).
- Having to repeat setup every time they visit the app.

### Behaviours

- Visits the app seasonally or whenever they are about to do laundry.
- Will not read instructions; must understand the UI in seconds.
- Shares recommendations with family members or roommates.

---

## Laundry Expert

> _"I'm tracking how long my clothes really take to dry under different conditions."_

### Profile

- **Type**: Secondary persona
- **Access**: Backoffice only (not the public app UI).
- **Domain knowledge**: High. Understands fabrics, drying conditions, and the
  relationship between weather variables and drying time.
- **Technical literacy**: Moderate. Comfortable with forms and dashboards;
  does not need a developer-level interface.

### Goals

- Register real-world drying sessions with accurate environmental data.
- Contribute empirical training data that can improve the app's recommendations
  over time.
- _(Future)_ Adjust classification thresholds based on observed patterns.

### Frustrations

- Manual logging is tedious — data capture should be as automated as possible.
- Losing session data due to accidental page reloads.
- Ambiguity about when a drying category was actually finished.

### Behaviours

- Uses the backoffice on a desktop or tablet, usually at home.
- Runs sessions in parallel with actual laundry days.
- Expects timers, reminders, and structured data capture — not a free-form note
  field.

### Relationship to the Washer

The Laundry Expert's sessions generate training data that will eventually refine
the thresholds used to produce the Washer's recommendation. Their work is
invisible to the Washer today, but directly improves recommendation accuracy
over time.

---

## Persona-to-Feature Mapping

| Feature area              | Washer | Laundry Expert |
|---------------------------|:------:|:--------------:|
| Wash Forecast             | ✓      |                |
| Fabric & Garment Awareness| ✓      |                |
| Label Decoder             | ✓      |                |
| Laundry Knowledge Base    | ✓      |                |
| Drying Session Tracker    |        | ✓              |
| Threshold Management      |        | ✓ _(future)_   |
