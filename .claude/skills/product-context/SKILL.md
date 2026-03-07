# Product Context — Varal

Core product knowledge for making aligned decisions.

## One-Liner

**"Should I wash my clothes today?"** — a web app that gives a clear YES/NO recommendation based on weather data.

## Target Audience

- People who wash their own clothes at home and air-dry them
- Primarily urban, living in apartments with limited drying space
- Budget-conscious — prefer to avoid dryer costs
- Located in regions with unpredictable weather (especially Brazilian coast/south)
- Non-technical users who want a quick, zero-effort answer

## Core Values

| Value | Meaning |
|-------|---------|
| **Clarity** | One question, one answer, no clutter |
| **Trust** | Decisions backed by real weather data |
| **Accessibility** | Works for non-technical users; GPS or Brazilian CEP |
| **Delight** | Small moments of personality make it memorable |

## Scope Boundaries

### In scope
- Wash forecast (rain, humidity, wind → YES/NO recommendation)
- Label decoder (clothing care symbols → plain language)
- Laundry knowledge base (sorting, products, temperatures, stain removal)

### Out of scope
- Generic weather app features
- E-commerce / product recommendations
- Social features

## Feature Validation Filters

Before approving any feature, check:
1. **Audience fit**: Would a typical Varal user understand and benefit?
2. **Scope fit**: Does it stay within laundry-day decisions?
3. **Simplicity**: Does the UI stay clean, user journey ≤3 interactions?
4. **Data integrity**: Does it respect existing data sources (Open-Meteo, Nominatim, ViaCEP)?

## Revenue Model

- **Free tier (ad-supported)**: Core recommendation with ads
- **Paid plans**: Ad-free + premium features (multi-day forecast, fabric-specific advice, alerts)

## Prioritization (MoSCoW)

- **Must Have**: Core to value proposition; app fails without it
- **Should Have**: Significantly improves UX; high ROI
- **Could Have**: Nice to have; implement if capacity allows
- **Won't Have (now)**: Out of scope for current iteration

## PRD Template

When writing a new Product Requirements Document, use the template at `templates/PRD.md` (relative to this skill folder).
