/* ======================================================================
   CONFIGURAÇÃO DO SITE
   ----------------------------------------------------------------------
   IMAGENS REAIS (as 5 que você vai fornecer)
   Hoje cada uma aparece como PLACEHOLDER, sempre com a etiqueta
   "Imagem real a fornecer" visível. Para trocar:
     1. Salve o arquivo em assets/media/ com EXATAMENTE o nome indicado.
     2. Mude o flag correspondente abaixo de false para true.
     3. Recarregue: o placeholder e a etiqueta somem sozinhos.
   Enquanto o flag for false, o arquivo nem é pedido (sem 404 no console).

   | flag               | arquivo (assets/media/)  | tamanho    | onde aparece          |
   |--------------------|--------------------------|------------|-----------------------|
   | hero-dashboard     | hero-dashboard.png       | 1901x1032  | Bloco 1 (Hero)        |
   | seletor-funil      | seletor-funil.png        | 1803x930   | Bloco 5 (Diferencial) |
   | retrato-fundador   | retrato-fundador.jpg     | retrato    | Bloco 10 (Prova real) |
   | painel-prova       | painel-prova.png         | 1920x1032  | Bloco 10 (Prova real) |
   | demo-funil         | demo-funil.png           | 1920x1032  | Bloco 10 (Demo)       |

   LINKS DOS CTAs
   whatsapp: número com DDI (ex.: "258840000000"). Vazio = CTAs levam a #planos.
   checkoutUrl: se preenchido, tem prioridade sobre o WhatsApp.
   ====================================================================== */
window.DRS = window.DRS || {};
window.DRS.config = {
  whatsapp: "",
  checkoutUrl: "",
  images: {
    "hero-dashboard": true,
    "seletor-funil": false,
    "retrato-fundador": false,
    "painel-prova": false,
    "demo-funil": false,
        "problema-2": true,
    "problema-4": true
  }
};
