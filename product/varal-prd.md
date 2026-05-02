# PRD: Varal

> **Status:** Em Revisão **Autor:** Jhoel Bagnasco **Data:** 2026-04-21
> **Versão:** 0.1

---

## 1. Visão / Proposta de Valor

O Varal responde em segundos a pergunta mais importante antes de lavar roupa:
**"O que posso lavar hoje?"**

O usuário abre o app, informa onde está, e recebe imediatamente uma lista de
categorias de roupa com recomendação clara — lavar agora, esperar ou evitar.
Sem adivinhar, sem consultar vários apps de tempo.

## 2. Vantagem Injusta

- Responde **uma pergunta específica** ("O que posso lavar hoje?"), não clima genérico.
- Leva em conta o **tipo de roupa** — jeans e edredons precisam de condições melhores que meias e camisetas.
- Zero fricção — sem cadastro, sem chave de API, resposta instantânea.

---

## 3. Declaração do Problema

A maioria das pessoas lava suas próprias roupas em casa e quer que elas durem
mantendo qualidade. Elas já consultam a previsão do tempo antes de lavar, mas a
probabilidade de chuva sozinha não é suficiente para tomar uma boa decisão.

**Dores centrais:**

- Probabilidade de chuva não diz se as roupas vão realmente secar — precipitação,
  vento e umidade também importam.
- Diferentes tecidos e tipos de peça exigem condições e tempos de secagem
  distintos.
- O tempo disponível durante a semana é limitado; perder um dia bom é frustrante.
- Usar secadora custa dinheiro; secar ao ar é grátis mas depende do clima.
- As condições de secagem variam muito: varanda de apartamento vs. quintal,
  clima ensolarado vs. úmido.
- Dúvidas sobre como lavar corretamente: separação de peças, temperatura da
  água, produtos adequados por tecido, remoção de manchas, símbolos de etiqueta.

**Consequência de não resolver:** As pessoas continuam lavando em dias errados
(roupas ficam no varal sob chuva, não secam a tempo, adquirem odor de mofo) e
danificando peças por falta de informação sobre cuidados.

---

## 4. Usuários-alvo / Personas

### Persona 1: Lavador(a) Urbano(a)

- **Contexto:** Mora em apartamento, tem varanda pequena ou área de serviço com
  espaço limitado. Lava roupas 1–2 vezes por semana, geralmente no fim de semana
  ou em dias de folga. Não tem secadora ou evita usá-la por custo.
- **Motivação:** Quer saber se vale a pena lavar hoje, levando em conta o tempo
  disponível para colocar e recolher as roupas.
- **Restrições:** Pouco tempo disponível; clima imprevisível na região (sul/sudeste
  do Brasil); sem espaço externo exposto ao sol direto.

### Persona 2: Lavador(a) com Quintal

- **Contexto:** Mora em casa com quintal ou área aberta. Tem mais espaço e
  ventilação, mas também mais exposição a chuvas repentinas.
- **Motivação:** Aproveitar ao máximo dias ensolarados para lavar várias cargas,
  incluindo peças pesadas como edredons e jeans.
- **Restrições:** Não consegue monitorar o tempo o dia todo; quer uma recomendação
  confiável de manhã para decidir antes de sair.

### Persona 3: Especialista em Lavanderia (Backoffice)

- **Contexto:** Usuário interno (equipe Varal) que conduz sessões reais de
  secagem para coletar dados e calibrar o algoritmo de recomendação.
- **Motivação:** Registrar com precisão o tempo de secagem por categoria de roupa
  e as condições climáticas durante cada sessão.
- **Restrições:** Precisa de uma ferramenta simples que sobreviva a recarregamentos
  de página e capture dados climáticos automaticamente.

---

## 5. Escopo

### Dentro do Escopo (MVP — Previsão de Lavagem)

- Detecção de localização por GPS ou CEP.
- Recomendação SIM/NÃO por tipo de roupa (categoria de peso: extra leve a extra
  pesado) com base em dados climáticos do dia.
- Linha do tempo de secagem por hora.
- Previsão para os próximos dias.
- Frase resumo de recomendação por card de dia.
- Janela de Recolhimento configurável pelo usuário.
- Seleção do ambiente de secagem (quintal aberto, varanda, interior, etc.).
- Zero fricção: sem cadastro obrigatório.

### Dentro do Escopo (Backoffice — Rastreador de Sessão de Secagem)

- Iniciar sessão por categorias de peso de roupa.
- Cronômetro por categoria, persistente entre recarregamentos.
- Captura automática de condições climáticas a cada 15 minutos.
- Notificações de lembrete a cada 30 minutos.
- Marcação de categorias como secas e encerramento de sessão.

### Fora do Escopo (por agora)

- Decodificador de etiqueta por foto (OCR/ML).
- Base de conhecimento de lavanderia.
- Monetização (anúncios, assinatura paga).
- Compartilhamento social de recomendações.
- Resumo gamificado de hábitos de lavagem.
- Suporte a idiomas além do português.

---

## 6. Modelo de Negócio

### Fluxos de Receita

- **Tier gratuito (com anúncios):** Recomendação principal com anúncios.
- **Planos pagos (mensal / anual / vitalício):** Experiência sem anúncios +
  funcionalidades premium (ex.: previsão de vários dias, dicas específicas de
  tecido, alertas personalizados).

### Estrutura de Custos

- Infraestrutura de hospedagem.
- API Open-Meteo (grátis, sem chave necessária).
- Integração de rede de anúncios.
- Taxas de processamento de pagamento.
- Tempo do desenvolvedor.

---

## 7. Métricas de Sucesso

- Usuários ativos diários.
- Precisão da recomendação (feedback do usuário: "isso estava certo?").
- Taxa de retorno (os usuários voltam nos dias de lavar roupas?).

---

## 8. Requisitos Funcionais

### 8.1 Detecção de Localização

- **Entrada:** Permissão de GPS do navegador ou CEP digitado pelo usuário.
- **Comportamento:** GPS é tentado primeiro; CEP é fallback manual. CEP é
  convertido em coordenadas via ViaCEP + Nominatim.
- **Saída:** Coordenadas `lat/lon` passadas ao serviço de previsão.
- **Casos extremos:** GPS negado → exibir campo de CEP. CEP inválido → mensagem
  de erro inline.

### 8.2 Recomendação de Lavagem por Categoria de Roupa

Esta é a funcionalidade central do Varal — responder "O que posso lavar hoje?".

- **Entrada:** Coordenadas, ambiente de secagem selecionado, categorias de roupa
  a lavar (Extra Leve a Extra Pesado), Janela de Recolhimento.
- **Comportamento:** Para cada categoria selecionada, compara a Janela de Secagem
  necessária (calculada pelo algoritmo com base na categoria e no clima) com as
  horas favoráveis disponíveis dentro da Janela de Recolhimento. Emite
  `RECOMENDAR`, `EVITAR` ou `CONDICIONAL`.
- **Saída:** A resposta principal deve ser imediata e legível: lista de categorias
  com decisão clara para o dia atual. Card por dia adicional com frase resumo.
- **Casos extremos:** Dados climáticos indisponíveis → exibir erro amigável.
  Janela de Recolhimento menor que qualquer Janela de Secagem → recomendar Evitar
  para todas as categorias.

### 8.3 Linha do Tempo de Secagem por Hora

- **Entrada:** Previsão horária do Open-Meteo, ambiente de secagem, categorias
  selecionadas, Janela de Recolhimento.
- **Comportamento:** Cada hora é classificada como favorável, parcial ou
  desfavorável por categoria.
- **Saída:** Visualização em linha do tempo hora a hora dentro da Janela de
  Recolhimento.

### 8.4 Previsão para Vários Dias

- **Entrada:** Coordenadas.
- **Comportamento:** Busca previsão dos próximos N dias e aplica a classificação
  de recomendação para cada um.
- **Saída:** Carrossel ou lista de cards por dia.

### 8.5 Rastreador de Sessão de Secagem (Backoffice)

- **Entrada:** Seleção de categorias de peso; horário de início.
- **Comportamento:** Cronômetro independente por categoria; captura climática
  automática a cada 15 min; notificações a cada 30 min; estado persiste no
  `localStorage` entre recarregamentos.
- **Saída:** Sessão registrada com duração de secagem por categoria e dados
  climáticos associados.
- **Casos extremos:** Página recarregada → sessão restaurada do `localStorage`.

---

## 9. Requisitos Não-Funcionais

- **Performance:** Página carregada em menos de 2s em conexão 3G.
- **Acessibilidade:** WCAG 2.1 AA — utilizável com leitor de tela.
- **Suporte de navegador:** Últimas 2 versões de Chrome, Safari e Firefox mobile.
- **PWA:** Instalável na tela inicial; última recomendação disponível offline via
  cache.
- **Privacidade:** Localização processada apenas no momento da consulta; nenhum
  dado de localização armazenado no servidor sem consentimento explícito.
- **Zero cadastro:** A funcionalidade principal deve funcionar sem autenticação.

---

## 10. Design / UX

Referências visuais e mockups em `product/design/home/`.

Princípios:
- Mobile-first; tela inicial deve caber acima do fold em qualquer smartphone.
- Resposta imediata e clara: o usuário deve saber em menos de 3 segundos se vale
  lavar hoje.
- Visual contextual ao tempo: fundo e cores refletem as condições do dia.

---

## 11. Glossário de Domínio

| Termo | Definição |
|-------|-----------|
| **Janela de Secagem** | Tempo mínimo necessário para uma categoria de roupa secar nas condições do dia. Calculado pelo algoritmo com base na categoria de peso e nas condições climáticas (temperatura, umidade, precipitação, vento). |
| **Janela de Recolhimento** | Intervalo de horas que o usuário declara estar disponível para colocar e recolher as roupas. O Varal só avalia horas dentro desse intervalo. |
| **Categoria de Peso** | Classificação das roupas pelo peso e espessura do tecido. Determina a Janela de Secagem mínima. As cinco categorias, da mais leve à mais pesada: **Extra Leve** (meias, cuecas/calcinhas finas, lenços), **Leve** (camisetas, blusas leves, shorts finos, roupas íntimas), **Médio** (camisas sociais, vestidos, calças de tecido leve, agasalhos finos), **Pesado** (jeans, moletom, toalhas, calças de linho), **Extra Pesado** (edredons, colchas, cobertores, jaquetas de inverno, lençóis grossos). |
| **Ambiente de Secagem** | Onde o usuário estende as roupas: quintal aberto, varanda voltada para o norte, varanda coberta, interior com janela, sem espaço externo. Influencia a exposição ao sol, vento e ventilação disponíveis. |
| **Recomendação** | Decisão por categoria: `RECOMENDAR` (condições adequadas), `EVITAR` (condições inadequadas) ou `CONDICIONAL` (possível com ressalvas). |
| **Sessão de Secagem** | Registro backoffice de um ciclo real de secagem: início, fim, categorias, condições climáticas coletadas a cada 15 min. Usado para calibrar o algoritmo. |
| **Lavador(a)** | Persona principal do produto — qualquer pessoa que lava e seca roupas em casa. |
| **Especialista em Lavanderia** | Persona interna que usa o Rastreador de Sessão de Secagem para coletar dados de calibração. |

---

## 12. Riscos e Perguntas Abertas

| Risco / Pergunta | Mitigação / Resposta |
|------------------|----------------------|
| Precisão do Open-Meteo em microclimas urbanos | API gratuita com boa cobertura; aceitar margem de erro e expor grau de confiança ao usuário |
| Algoritmo de Janela de Secagem ainda experimental | Rastreador de Sessão coleta dados reais para calibração contínua |
| Limites de taxa do Open-Meteo | Tier gratuito generoso; sem chave de API necessária; adicionar cache no servidor se necessário |
| Privacidade da localização | Não armazenar coordenadas; processar apenas na requisição |
| Escopo cresce rápido (etiqueta, base de conhecimento) | Manter foco no MVP de Previsão de Lavagem; as demais funcionalidades são post-MVP explícito |
