# Post-MVP Features Overview

This document summarizes features that are beyond the MVP (Wash Forecast + Drying Session Tracker). Most do not yet have individual story files. When ready for exploration, create individual files and move them to the appropriate parent folder.

---

## Fabric & Garment Awareness

| US # | Title | Summary |
|------|-------|---------|
| 15 | Diferenciação por Tipo de Tecido | Recommend different drying conditions per fabric type (cotton vs. wool vs. silk) |
| 16 | Comparação de Tecidos | Show which fabrics dry best in today's conditions |
| 17 | Aviso de Dano a Tecidos Delicados | Alert when conditions (strong wind, intense UV, high humidity) could damage delicate fabrics |

---

## Label Decoder

| US # | Title | Summary |
|------|-------|---------|
| 18 | Pesquisa de Símbolo de Cuidado | Search care symbols and see plain-language explanations |
| 19 | Referência Visual de Símbolos | Browse all common care symbols as a learning reference |
| 20 | Fotografar Etiqueta (OCR) | Take a photo of a garment tag and automatically identify care symbols |
| 21 | Instruções Completas de Cuidado | Display full care instructions after reading a tag |

---

## Laundry Knowledge Base

| US # | Title | Summary |
|------|-------|---------|
| 22 | Detergente em Pó vs. Líquido | Learn the difference and when to use each |
| 23 | Como Separar Roupas | Best practices for sorting before washing |
| 24 | Temperatura Correta por Tecido | Water temperature recommendations for each fabric type |
| 25 | Frequência de Lavagem | How often to wash different garment types |
| 26 | Remoção de Manchas Comuns | Tips for treating common stains (coffee, grease, wine) |
| 27 | Como Usar Sacola de Lavagem | When and why to use a wash bag for delicate items |
| 28 | Produtos a Evitar | Warnings about products that damage certain fabrics |
| 29 | Pesquisa na Base de Conhecimento | Search knowledge base by topic or keyword |
| 30 | Dicas Contextuais na Previsão | Show relevant laundry tips alongside the daily forecast |

---

## User Experience & Accessibility

| US # | Title | Summary |
|------|-------|---------|
| 31 | Performance em Conexão Móvel | Ensure app loads quickly on 3G connections |
| 32 | Instalar como PWA | Add to home screen as a native-like app |
| 33 | Uso sem Conta | Core functionality works without registration |
| 34 | Lembrar Última Localização e Preferências | Persist settings across sessions |
| 35 | Suporte a Idiomas | Localization (starting with Portuguese) |
| 36 | Acessibilidade (WCAG AA) | Screen reader support and full keyboard navigation |
| 37 | Uso Offline | Cache last forecast for offline access |

---

## Feedback & Accuracy

| US # | Title | Summary |
|------|-------|---------|
| 38 | Feedback de Precisão | "Was this recommendation accurate?" feedback |
| 39 | Pontuação de Precisão Geral | Show overall app accuracy score |

---

## Monetization

| US # | Title | Summary |
|------|-------|---------|
| 40 | Plano Gratuito com Anúncios | Free tier with ads |
| 41 | Plano Pago | Monthly / annual / lifetime subscription |
| 42 | Funcionalidades Premium | Ad-free + multi-day forecast + fabric tips + custom alerts (for paying users) |
| 43 | Gerenciar Assinatura | Easy subscription management and cancellation |

---

## Social & Sharing

| US # | Title | Summary |
|------|-------|---------|
| 44 | Compartilhar App | Share via simple link |
| 45 | Resumo de Hábitos de Lavagem | Fun, shareable summary of laundry habits (e.g., "You washed 12 times this month") |

---

## Next Steps

- **When exploring a feature**: Create a `US-XX.md` file in the appropriate parent folder (or create a new folder if needed).
- **At the beginning of explore**: Fill in `Contexto`, `Questões em Aberto`, and `Restrições`.
- **Include supporting assets**: Add mockups or diagrams to `assets/`.
- **After explore concludes**: Move the story file(s) into an openspec change and delete from here.
