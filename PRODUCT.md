# Product

<!-- impeccable:product-schema 1 -->

> Registro inferido do briefing do usuário (sessão sem entrevista; nenhuma pergunta adicional foi feita porque o briefing das Fases 1–2 já fixa público, copy e direção). Itens marcados *(inferido)* aguardam confirmação.

## Platform

web

## Stack
Static HTML/CSS/JS, sem build. GSAP 3.15 + ScrollTrigger servidos localmente (`vendor/`), CSS scroll-driven animations onde possível. Escolha do usuário (Fase 2: "SVG + GSAP", sem Lottie).

## Users
Vendedores de infoprodutos (e-books, cursos, mentorias) e de produtos físicos (nutras, beleza, roupas) em Moçambique/lusofonia que vendem por tráfego pago (Meta Ads) e fecham pelo WhatsApp. Já sentem o limite de responder mensagens manualmente. *(inferido da copy)*

## Product Purpose
WatSeller: agentes de IA especializados em vendas no WhatsApp, com funis prontos, follow-up, confirmação de pagamento e entrega automáticos. A landing deve fazer o visitante escolher um plano (CTA "Quero escalar sem limites").

## Positioning
Não é chatbot nem construtor de workflows: o funil já vem pronto e o agente conduz a conversa até a compra, inclusive pagamento e entrega.

## Capabilities and Constraints
Planos Start 2.500 / Scale 5.000 / Pro 8.500 MZN por mês; garantia de 14 dias; WhatsApp via API oficial (coexistência). Toda a copy vem de `copy-original.md` e `copy-legal.md` (aprovada, não reescrever). Português com "você".

## Brand Commitments
Nome "WatSeller" (domínio watseller.com). Um único tema visual: Editorial (`data-theme="editorial"`).

## Evidence on Hand
Não há imagens reais ainda. O usuário fornecerá 5: painel do hero, print do seletor de funil, retrato do fundador, painel da prova real, print do funil da demo. Até lá, placeholders marcados. Os números da prova real (114.682 MZN, 823 vendas, 7,2 %, 5 contas, 12 produtos) vêm da copy original; não inventar outros.

## Product Principles
1. A animação explica o produto (conversas, funis, fluxo de dinheiro); nunca decora.
2. Mostrar o sistema real; onde a imagem real não existe, o placeholder diz isso.
3. O conteúdo é legível sem JS e sem movimento.
4. Sem scroll-jacking: o scroll nativo nunca é sequestrado.

## Accessibility & Inclusion
`prefers-reduced-motion` com alternativa intencional; contraste AA; foco visível; alvos de toque ≥ 44 px; leitor de tela lê o texto real de toda animação.
