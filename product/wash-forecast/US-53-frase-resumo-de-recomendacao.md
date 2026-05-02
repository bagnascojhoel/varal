# US-53 — Frase Resumo de Recomendação

## História

Como Lavador(a), quero ver uma frase de recomendação em cada card de dia
informando se vale lavar e quais tipos de roupas estão incluídas, para que eu
possa decidir rapidamente sem ler toda a previsão.

## Contexto

<!-- TODO: Add context before explore session -->

## Questões em Aberto

- Phrase template: "Good for [categories], avoid [categories]" or "Wash lightly;
  avoid heavy items"?
- How to handle mixed recommendations (some RECOMMEND, some AVOID)?
- Should the phrase summarize the best window, or just the day overall?
- Language: always Portuguese, or respect user locale?

## Restrições

- Phrase must fit on the day card without wrapping (mobile width constraint)
- No hardcoded text (use i18n messages)

## Relacionados

US-01 (clothing recommendations), US-09 (factor details for context)
