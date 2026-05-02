## 1. Install and configure Storybook

- [x] 1.1 Install Storybook 8 with `npx storybook@latest init` using the
      `@storybook/nextjs` framework (accept defaults, then adjust)
- [x] 1.2 Verify `.storybook/main.ts` uses `@storybook/nextjs` as framework
- [x] 1.3 Add `@tailwindcss/vite` plugin to the `viteFinal` config in
      `.storybook/main.ts` so Tailwind v4 styles are applied in stories
- [x] 1.4 Verify the `@/*` path alias resolves correctly (it should come from
      `tsconfig.json` automatically via `@storybook/nextjs`)
- [x] 1.5 Add `storybook` and `build-storybook` scripts to `package.json` if not
      added by init
- [x] 1.6 Run `npm run storybook` and confirm Storybook opens in the browser
      without errors

## 2. Create src/ui/ structure

- [x] 2.1 Create `src/ui/` directory
- [x] 2.2 Add a barrel file `src/ui/index.ts` (empty for now; will export
      components as they are added)
- [x] 2.3 Update `CLAUDE.md` to document the `src/ui/` layer rule: pure
      presentational components with no Next.js routing or data dependencies

## 3. Migrate and add components to src/ui/

- [x] 3.1 Extract `DayCard` presentational rendering into
      `src/ui/DayCard/DayCard.tsx` accepting plain props (no `DayForecast` class
      instances)
- [x] 3.2 Update `app/_components/DayCard.tsx` to import and delegate to
      `src/ui/DayCard/DayCard.tsx`
- [x] 3.3 Run `npm run typecheck` to confirm no regressions

## 4. Write stories

- [x] 4.1 Create `src/ui/DayCard/DayCard.stories.tsx` with a Default story and
      stories for each wash decision state
- [x] 4.2 Verify the story appears under `UI/DayCard` in the Storybook sidebar
- [x] 4.3 Verify Tailwind styles render correctly in the Storybook canvas for
      the DayCard story

## 5. Verification

- [x] 5.1 Run `npm run build-storybook` and confirm a static build is produced
      in `storybook-static/` without errors
- [x] 5.2 Run `npm run typecheck` — zero type errors
- [x] 5.3 Run `cd e2e && npm test` — all E2E tests pass
