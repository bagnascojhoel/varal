# US-10 — Confiança da Recomendação

## História

Como Lavador(a), quero ver o grau de confiança da recomendação, para que eu
possa decidir se vale arriscar nos dias com condições incertas.

## Contexto

<!-- TODO: Add context before explore session -->

## Questões em Aberto

- How to calculate confidence? (variance of forecasts, data quality, algorithm
  certainty?)
- Display as percentage, stars, or qualitative label (high/medium/low)?
- Is this per-day or per-category?
- What triggers a low-confidence recommendation?

## Restrições

- Confidence metric must be explainable to users (no black-box ML scores)
- Should be based on data quality, not user feedback (which comes later in
  US-38)

## Relacionados

US-09, US-38
