/* Demonstração do painel do Wolf: abas com exemplos de atendimento.
   Monta-se sozinha dentro de <div id="wolf-demo">. Todos os nomes, moradas e valores são fictícios. */
(function () {
  'use strict';

  var OPT_UMIDADE = ['Parte de baixo da parede', 'No teto, quando chove', 'À volta das janelas'];

  var TABS = [
    {
      name: 'Recepção', niche: 'Imobiliária', who: 'Nelson', stage: 'Recepção', result: 'Respondido em 3 segundos', t0: '22:15',
      did: 'respondeu às 22:15 a um áudio, na hora, percebeu tudo o que o cliente disse e recebeu-o como se estivesse na agência.',
      m: [
        { k: 'cv', d: '0:24', tr: 'Boa noite, vi aquele anúncio do apartamento na Sommerschield, aquele de 3 quartos, ainda está disponível? E aceitam crédito?' },
        { k: 'w', t: 'Boa noite! Que bom que se interessou pelo nosso T3 na Sommerschield, com vista para a baía. 🏡 Está disponível, sim, e aceitamos crédito bancário: a nossa equipa acompanha todo o processo com o banco. Já lhe passo os detalhes.' },
        { k: 'w', t: 'Para lhe fazer um bom atendimento, pode dizer-me o seu nome, por gentileza?' },
        { k: 'c', t: 'Nelson' },
        { k: 'w', t: 'Muito prazer, Nelson! Como você está?' }
      ]
    },
    {
      name: 'Reengajamento', niche: 'Impermeabilização', who: 'Alberto', stage: 'Recepção → Qualificação', result: '', t0: '14:02',
      did: 'o cliente parou de responder; 10 minutos depois, o Wolf voltou a ganhar a atenção dele com o benefício certo, sem repetir perguntas.',
      m: [
        { k: 'w', t: 'Muito prazer, Alberto! Como você está?' },
        { k: 's', t: '10 minutos sem resposta', add: 10 },
        { k: 'w', t: 'Olá! 😊 Sobre a humidade que volta a cada chuva: o nosso tratamento impermeabiliza a laje e acaba com o bolor de vez. Quer ver como funciona e se faz sentido para si?', btns: ['Como funciona?', 'Serve para mim?'] },
        { k: 'c', t: 'Serve para mim?' },
        { k: 'w', t: 'Ótima pergunta, Alberto! Para lhe responder com certeza, diga-me: onde aparece mais a humidade na sua casa?', opts: ['Na parte de baixo da parede', 'No teto, quando chove', 'À volta das janelas'] }
      ]
    },
    {
      name: 'Qualificação', niche: 'Impermeabilização', who: 'Alberto', stage: 'Qualificação → Apresentação', result: 'Visita técnica a marcar', t0: '15:30',
      did: 'percebeu a dor antes de falar em preço, acolheu a preocupação e apresentou a solução certa.',
      m: [
        { k: 'w', t: 'Alberto, para melhor lhe orientar, qual destas opções representa melhor a sua situação hoje?', opts: ['Humidade na parte de baixo da parede', 'Infiltração no teto quando chove', 'Bolor à volta das janelas'] },
        { k: 'c', t: 'No teto. E já tem bolor no quarto das crianças' },
        { k: 'w', t: 'Percebo a sua preocupação, Alberto, ainda mais sendo o quarto das crianças. O bolor no teto, quando chove, quase sempre vem da laje, e pintar por dentro só esconde o problema até à próxima chuva.' },
        { k: 'w', t: 'Para resolver de vez, tratamos na origem: impermeabilizamos a laje por cima, com manta e 5 anos de garantia. Antes, fazemos uma visita técnica grátis: medimos a área, vemos por onde entra a água e deixamos o orçamento fechado, sem surpresas.' },
        { k: 'w', t: 'Prefere que a nossa equipa vá na quinta às 9:00 ou no sábado às 10:00?' }
      ]
    },
    {
      name: 'Qualificação de alto valor', niche: 'Imobiliária', who: 'Nelson', stage: 'Apresentação', result: 'Visita a marcar', t0: '10:05',
      did: 'percebeu o orçamento, o crédito e a família, e mostrou só a casa que faz sentido.',
      m: [
        { k: 'w', t: 'Nelson, para lhe mostrar só as casas que fazem sentido para si, qual destas opções representa melhor o que procura?', opts: ['Até 3 milhões MT', 'De 3 a 6 milhões MT', 'Mais de 6 milhões MT'] },
        { k: 'c', t: '2. Mas preciso de crédito, não tenho tudo' },
        { k: 'w', t: 'Faz todo o sentido, Nelson: a maioria dos nossos clientes compra com crédito, e a nossa equipa trata do processo com o banco consigo. É para viver com a família ou para investir?' },
        { k: 'c', t: 'Para viver. Tenho 2 filhos' },
        { k: 'w', t: 'Então tenho a casa certa para a sua família: uma moradia T3 na Matola-Rio, com quintal para os miúdos brincarem, a 5 minutos da escola primária e com a documentação em dia para o banco aprovar. Custa 4,8 milhões MT.', photos: 3 },
        { k: 'w', t: 'Prefere visitá-la no sábado de manhã, com a família toda, ou num fim de tarde durante a semana?' }
      ]
    },
    {
      name: 'Objeção de confiança', niche: 'Suplementos capilares', who: 'Ricardo', stage: 'Objeções', result: 'Confiança', t0: '11:20',
      did: 'não se ofendeu nem prometeu milagres; usou provas e tirou o risco ao cliente.',
      m: [
        { k: 'c', t: 'Já fui enganado com produto para cabelo. Como sei que isso não é golpe?' },
        { k: 'w', t: 'Faz todo o sentido perguntar, Ricardo. Depois de uma má experiência, eu também perguntava.' },
        { k: 'w', t: 'Três coisas para ficar tranquilo:\n✅ Estamos na Av. 24 de Julho; pode vir buscar à loja.\n✅ Em Maputo, paga só quando receber, na entrega.\n✅ Aqui está o resultado de um cliente com o mesmo problema, ao fim de 3 meses:', before_after: true },
        { k: 'w', t: 'Prefere receber em casa e pagar na entrega, ou levantar na loja?' }
      ]
    },
    {
      name: '«Quando o salário cair»', niche: 'Programa de emagrecimento', who: 'Marta', stage: 'Apresentação', result: 'Lembrete: dia 25', t0: '16:40',
      did: 'respeitou o momento da cliente, recuperou a confiança dela e voltou no dia certo, com valor.',
      m: [
        { k: 'c', t: 'Gostei muito, mas agora não tenho. Quando o salário cair dou sinal' },
        { k: 'w', t: 'Combinado, Marta, e obrigado pela sinceridade. Só para eu perceber: tirando a questão do momento, o programa é o que procura para chegar ao casamento da sua irmã com menos 8 kg?' },
        { k: 'c', t: 'É sim, só falta mesmo o dinheiro' },
        { k: 'w', t: 'Então vamos garantir que chega lá. O salário cai em que dia?' },
        { k: 'c', t: 'Dia 25' },
        { k: 'w', t: 'Fica combinado: no dia 25 falo consigo aqui. E para não perder tempo até lá, vou enviar-lhe já o plano alimentar da primeira semana, para começar com o pé direito. 💪' },
        { k: 's', t: 'dia 25, 10:12', set: '10:12' },
        { k: 'w', t: 'Bom dia, Marta! Hoje é dia 25, como combinámos. 😊 Como correu a semana com o plano?' },
        { k: 'w', t: 'Posso avançar com os detalhes para garantir a sua vaga no programa, ou precisa de algum esclarecimento antes?' }
      ]
    },
    {
      name: '«Vou falar com o meu marido»', niche: 'Programa de emagrecimento', who: 'Marta', stage: 'Apresentação', result: 'Decisão partilhada', t0: '17:10',
      did: 'em vez de esperar, deu à cliente o que ela precisava para decidir a dois.',
      m: [
        { k: 'c', t: 'Gostei, mas tenho de falar com o meu marido primeiro' },
        { k: 'w', t: 'Claro, Marta, é uma decisão a dois, e faz bem em falar com ele. Para a ajudar nessa conversa, aqui está um resumo curto: o que inclui, quanto custa por semana e os resultados de outras mães como a Marta.', doc: 'Programa 12 Semanas: resumo.pdf' },
        { k: 'w', t: 'Na sua opinião, a dúvida dele vai ser mais o valor ou se o programa resulta mesmo?' },
        { k: 'c', t: 'O valor' },
        { k: 'w', t: 'Então diga-lhe isto: são 2.400 MT por mês, menos do que um jantar fora por semana, e inclui o acompanhamento diário da nutricionista aqui no WhatsApp. Amanhã à tarde falo consigo para saber o que decidiram. 😊' }
      ]
    },
    {
      name: 'Encomenda', niche: 'Suplementos capilares', who: 'Ricardo', stage: 'Encomenda e pagamento', result: 'Pedido: 5.250 MT', t0: '12:30',
      did: 'recolheu a morada, a referência e o contacto, e confirmou o total com a entrega, sem erros nem idas e voltas.',
      m: [
        { k: 'c', t: 'Quero o kit de 3 meses' },
        { k: 'w', t: 'Boa escolha: kit de 3 meses! Para registar o seu pedido, em que cidade e bairro está?' },
        { k: 'c', t: 'Matola, Liberdade' },
        { k: 'w', t: 'Matola, perfeito! A entrega para a Matola custa 150 MT. Tem algum ponto de referência perto de si? (ex.: ao lado do mercado, perto da escola)' },
        { k: 'c', t: 'Ao lado da bomba de combustível' },
        { k: 'w', t: 'E qual é o número de contacto de quem vai receber? Se for este mesmo do WhatsApp, diga “este número”.' },
        { k: 'c', t: 'este número' },
        { k: 'w', t: 'Só para confirmar o seu pedido:\n🛍️ Kit capilar de 3 meses\n📍 Matola, Liberdade\n🧭 Ao lado da bomba de combustível\n📞 Este número\n💰 Total: 5.250 MT (5.100 MT do produto + 150 MT de entrega)\nEstá tudo certo?' }
      ]
    },
    {
      name: 'Pagamento', niche: 'Programa de emagrecimento', who: 'Marta', stage: 'Pagamento', result: 'Pagamento completo ✅', t0: '18:05',
      did: 'leu o comprovativo, conferiu o valor e pediu o que faltava, sem constrangimento.',
      m: [
        { k: 'ci' },
        { k: 'w', t: 'Recebi o seu comprovativo, Marta! Vejo uma transferência de 2.000 MT, e o valor do programa é 2.400 MT. Faltam 400 MT. Quando os enviar, mande o comprovativo aqui e a sua vaga fica garantida. 😊' },
        { k: 'ci' },
        { k: 'w', t: 'Pagamento completo, Marta! ✅ Bem-vinda ao Programa 12 Semanas. Envio já o acesso ao grupo e o plano da primeira semana.' }
      ]
    },
    {
      name: 'Marcação', niche: 'Clínica dentária', who: 'Ana', stage: 'Marcação', result: 'Marcação: sábado 09:00', t0: '09:12',
      did: 'desmarcou e remarcou sozinho, só com horas livres, sem ninguém da clínica pegar no telefone.',
      m: [
        { k: 'c', t: 'Preciso de remarcar a minha limpeza de amanhã, surgiu um imprevisto no trabalho' },
        { k: 'w', t: 'Sem problema, Ana! Vamos encontrar outra hora.' },
        { k: 'w', t: 'Para que dia prefere?', btns: ['Quarta, 19/11', 'Quinta, 20/11', 'Sábado, 22/11'] },
        { k: 'c', t: 'Sábado de manhã dá?' },
        { k: 'w', t: 'Sábado, 22/11: temos estas horas livres. Qual prefere?', btns: ['08:30', '09:00', '11:00'] },
        { k: 'c', t: '9' },
        { k: 'w', t: 'Marcação confirmada, Ana! ✅\n🦷 Limpeza (30 min)\n📅 Sábado, 22/11, às 09:00\n📍 Av. Julius Nyerere\n💰 1.500 MT, a pagar no local.\nSe precisar de mudar, é só escrever aqui.' }
      ]
    },
    {
      name: 'Pós-venda e recompra', niche: 'Transplante capilar e suplementos', who: 'Ricardo', stage: 'Pós-venda', result: 'Recompra: 3.400 MT', t0: '10:15',
      did: 'voltou aos 30 dias, celebrou o resultado com o cliente e fez a recompra com naturalidade.',
      m: [
        { k: 's', t: '30 dias depois da compra' },
        { k: 'w', t: 'Olá, Ricardo! 😊 Já faz um mês que começou o suplemento capilar. Como tem notado o cabelo? Está a cair menos no banho?' },
        { k: 'c', t: 'Sim! Já caem bem menos fios. Até a minha esposa reparou' },
        { k: 'w', t: 'Que alegria ler isso, Ricardo! 🙌 É exatamente o resultado esperado no primeiro mês, e agora vem a melhor parte: é entre o 2.º e o 3.º mês que os fios novos ganham força.' },
        { k: 'w', t: 'O seu frasco deve estar a acabar por estes dias. Para não interromper o tratamento, prefere o frasco de 1 mês (1.900 MT) ou o kit de 2 meses (3.400 MT em vez de 3.800)?' },
        { k: 'c', t: 'Manda o kit de 2' },
        { k: 'w', t: 'Boa escolha: kit de 2 meses! Envio já os dados de pagamento, e amanhã está na sua porta. 📦' }
      ]
    }
  ];

  /* Nichos: cada aba é um nicho; dentro dele, os momentos são conversas diferentes.
     Os nomes da lista mudam de nicho para nicho. */
  var NICHES = [
    {
      name: 'Imobiliária', convs: [0, 3],
      list: [
        { n: 'Celeste', s: 'Obrigada, vou ver as fotos com o meu marido.', t: '21:48' },
        { n: 'Hélder', s: 'Pode ser terça às 15:00.', t: '19:20' },
        { n: 'Dulce', s: 'Qual é o valor do condomínio?', t: '17:05' },
        { n: 'Armando', s: 'Já enviei os documentos para o banco.', t: 'Ontem' }
      ]
    },
    {
      name: 'Impermeabilização', convs: [1, 2],
      list: [
        { n: 'Fátima', s: 'Pode vir na sexta de manhã.', t: '16:12' },
        { n: 'Joaquim', s: 'Obrigado pelo orçamento, vou ver.', t: '13:40' },
        { n: 'Lurdes', s: 'A mancha já está maior.', t: '11:02' },
        { n: 'Sérgio', s: 'Sim, é na laje.', t: 'Ontem' }
      ]
    },
    {
      name: 'Suplementos capilares', convs: [4, 7, 10],
      list: [
        { n: 'Neusa', s: 'Chegou tudo bem, obrigada!', t: '15:22' },
        { n: 'Tomás', s: 'Qual é o kit mais indicado para mim?', t: '12:48' },
        { n: 'Cláudia', s: 'Posso pagar quando receber?', t: '10:31' },
        { n: 'Eduardo', s: 'Quero o de 2 meses.', t: 'Ontem' }
      ]
    },
    {
      name: 'Emagrecimento', convs: [5, 6, 8],
      list: [
        { n: 'Graça', s: 'Já comecei o plano de hoje 😊', t: '18:30' },
        { n: 'Isabel', s: 'Quanto tempo dura o programa?', t: '14:15' },
        { n: 'Teresa', s: 'Enviei o comprovativo.', t: '09:58' },
        { n: 'Lídia', s: 'Perdi 2 kg esta semana!', t: 'Ontem' }
      ]
    },
    {
      name: 'Clínica dentária', convs: [9],
      list: [
        { n: 'Rui', s: 'Confirmado para quinta às 14:00.', t: '17:44' },
        { n: 'Benilde', s: 'Tem horário para clareamento?', t: '15:09' },
        { n: 'Paulo', s: 'Obrigado, até amanhã.', t: '11:36' },
        { n: 'Glória', s: 'Quanto custa a consulta?', t: 'Ontem' }
      ]
    }
  ];
  var MOMENT_LABEL = ['Recepção', 'Reengajamento', 'Qualificação', 'Qualificação de alto valor', 'Objeção de confiança', '«Quando o salário cair»', '«Vou falar com o meu marido»', 'Encomenda', 'Pagamento', 'Marcação', 'Pós-venda e recompra'];

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function h(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }
  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  function addMin(t, n) {
    var p = t.split(':'), total = parseInt(p[0], 10) * 60 + parseInt(p[1], 10) + n;
    total = ((total % 1440) + 1440) % 1440;
    return ('0' + Math.floor(total / 60)).slice(-2) + ':' + ('0' + (total % 60)).slice(-2);
  }
  var ARROW = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';
  var HOUSE = '<svg viewBox="0 0 24 24" fill="none" stroke="#6F6586" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11 12 4l9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/></svg>';

  function init(root) {
    var ni = 0, ci = 0, token = 0, timers = [], played = false;

    root.innerHTML = '';
    var wd = h('div', 'wd');

    var head = h('div', 'wd-head');
    head.appendChild(h('h2', '', 'Uma pequena demonstração do estilo de conversa do <em>Wolf</em>'));
    head.appendChild(h('p', '', 'Escolha o seu nicho e veja como ele atende: com calma, com contexto e com personalidade, como um vendedor profissional.'));
    wd.appendChild(head);

    var tabs = h('div', 'wd-tabs');
    tabs.setAttribute('role', 'tablist');
    tabs.setAttribute('aria-label', 'Nichos');
    var tabEls = NICHES.map(function (n, i) {
      var b = h('button', 'wd-tab', esc(n.name));
      b.type = 'button';
      b.id = 'wd-tab-' + i;
      b.setAttribute('role', 'tab');
      b.setAttribute('aria-controls', 'wd-panel');
      b.addEventListener('click', function () { selectNiche(i, true); });
      tabs.appendChild(b);
      return b;
    });
    tabs.addEventListener('keydown', function (e) {
      var k = e.key, n = NICHES.length, i = ni;
      if (k === 'ArrowRight' || k === 'ArrowDown') i = (ni + 1) % n;
      else if (k === 'ArrowLeft' || k === 'ArrowUp') i = (ni - 1 + n) % n;
      else if (k === 'Home') i = 0;
      else if (k === 'End') i = n - 1;
      else return;
      e.preventDefault();
      selectNiche(i, true);
      tabEls[i].focus();
    });
    wd.appendChild(tabs);

    var frame = h('div', 'wd-frame');
    frame.id = 'wd-panel';
    frame.setAttribute('role', 'tabpanel');
    frame.appendChild(h('div', 'wd-bar',
      '<div class="wd-dots" aria-hidden="true"><i></i><i></i><i></i></div>' +
      '<div class="wd-bar-t"><img src="assets/mascote-cabeca.png" alt="" width="18" height="18"><span>Painel · The Wolf Seller</span></div>' +
      '<div class="wd-live"><i></i>EXEMPLO</div>'));

    var body = h('div', 'wd-body');
    var list = h('div', 'wd-list');
    body.appendChild(list);

    var main = h('div', 'wd-main');
    var did = h('div', 'wd-did');
    main.appendChild(did);
    var moments = h('div', 'wd-moments');
    moments.setAttribute('role', 'group');
    moments.setAttribute('aria-label', 'Momentos da conversa');
    main.appendChild(moments);
    var chead = h('div', 'wd-chead');
    main.appendChild(chead);
    var msgs = h('div', 'wd-msgs');
    msgs.setAttribute('role', 'log');
    msgs.setAttribute('aria-live', 'off');
    msgs.tabIndex = 0;
    msgs.setAttribute('aria-label', 'Conversa de exemplo');
    main.appendChild(msgs);
    body.appendChild(main);

    var card = h('div', 'wd-card');
    body.appendChild(card);
    frame.appendChild(body);
    wd.appendChild(frame);

    wd.appendChild(h('div', 'wd-cta',
      '<a class="p" href="#precos">Quero o Wolf a vender no meu WhatsApp</a><a class="s" href="#precos">Ver os planos</a>'));
    root.appendChild(wd);

    function clearTimers() { timers.forEach(clearTimeout); timers = []; }
    function later(fn, ms, tk) { timers.push(setTimeout(function () { if (tk === token) fn(); }, ms)); }
    function scrollDown() { msgs.scrollTop = msgs.scrollHeight; }
    function conv() { return TABS[NICHES[ni].convs[ci]]; }

    function waveform() {
      var s = '', hs = [8, 14, 20, 12, 22, 16, 9, 18, 24, 13, 7, 19, 23, 11, 15, 21, 10, 17, 8, 14];
      for (var i = 0; i < hs.length; i++) s += '<i style="height:' + hs[i] + 'px"></i>';
      return s;
    }

    function bubbleHTML(m, time, isWolf) {
      var inner = '';
      if (m.k === 'cv') {
        inner += '<div class="wd-voice"><span class="wd-play" aria-hidden="true">' + ARROW + '</span><span class="wd-wave" aria-hidden="true">' + waveform() + '</span><span class="wd-dur">' + esc(m.d) + '</span></div>';
        inner += '<div class="wd-tr">' + esc(m.tr) + '</div>';
      } else if (m.k === 'ci') {
        inner += '<div class="wd-rcpt" role="img" aria-label="Comprovativo de pagamento (exemplo)"><div class="bl"><i></i><i></i><i></i><i></i></div><span class="wd-tag">Comprovativo · exemplo</span></div>';
      } else {
        inner += esc(m.t);
        if (m.doc) inner += '<div class="wd-doc"><b>PDF</b><span>' + esc(m.doc) + '</span></div>';
        if (m.photos) {
          inner += '<div class="wd-photos" role="img" aria-label="Fotografias de exemplo">';
          for (var i = 0; i < m.photos; i++) inner += '<span>' + HOUSE + '</span>';
          inner += '</div>';
        }
        if (m.before_after) {
          inner += '<div class="wd-img" role="img" aria-label="Imagem de antes e depois (exemplo)"><div class="bl"><i></i><i></i></div><span class="wd-tag">Exemplo</span><span class="wd-tag r">Antes · Depois</span></div>';
        }
      }
      inner += '<div class="wd-meta"><span>' + time + '</span>' + (isWolf ? '<span class="wd-ticks" aria-label="entregue e lida">✓✓</span>' : '') + '</div>';
      return inner;
    }

    function buildRow(m, time) {
      if (m.k === 's') return h('div', 'wd-sep', esc(m.t));
      var isWolf = m.k === 'w';
      var row = h('div', 'wd-row ' + (isWolf ? 'w' : 'c'));
      var col = h('div', 'wd-col');
      col.appendChild(h('div', 'wd-bub', bubbleHTML(m, time, isWolf)));
      var btns = m.opts || m.btns;
      if (btns) {
        var g = h('div', 'wd-opts' + (m.btns ? ' row' : ''));
        btns.forEach(function (b) { g.appendChild(h('span', 'wd-btn', esc(b))); });
        col.appendChild(g);
      }
      row.appendChild(col);
      if (isWolf) {
        var av = h('img', 'wd-av');
        av.src = 'assets/mascote-cabeca.png'; av.alt = 'Wolf'; av.width = 24; av.height = 24;
        row.appendChild(av);
      }
      return row;
    }

    function typingRow() {
      var row = h('div', 'wd-row w wd-typing');
      var col = h('div', 'wd-col');
      col.appendChild(h('div', 'wd-bub', '<span>Wolf a escrever…</span><i></i><i></i><i></i>'));
      row.appendChild(col);
      var av = h('img', 'wd-av');
      av.src = 'assets/mascote-cabeca.png'; av.alt = ''; av.width = 24; av.height = 24;
      row.appendChild(av);
      return row;
    }

    function renderStatic() {
      var t = conv(), time = t.t0;
      msgs.innerHTML = '';
      t.m.forEach(function (m) {
        if (m.k === 's') {
          if (m.set) time = m.set; else if (m.add) time = addMin(time, m.add);
          msgs.appendChild(buildRow(m, time));
        } else {
          msgs.appendChild(buildRow(m, time));
          time = addMin(time, 1);
        }
      });
      msgs.querySelectorAll('.wd-row').forEach(function (r) { r.style.animation = 'none'; });
      msgs.scrollTop = 0;
    }

    function play() {
      var tk = ++token;
      clearTimers();
      var t = conv(), time = t.t0, idx = 0;
      msgs.innerHTML = '';
      msgs.scrollTop = 0;
      function next() {
        if (tk !== token || idx >= t.m.length) return;
        var m = t.m[idx++];
        if (m.k === 's') {
          if (m.set) time = m.set; else if (m.add) time = addMin(time, m.add);
          msgs.appendChild(buildRow(m, time));
          scrollDown();
          later(next, 450, tk);
          return;
        }
        var isWolf = m.k === 'w', len = (m.t || '').length;
        if (isWolf) {
          var ty = typingRow();
          msgs.appendChild(ty);
          scrollDown();
          later(function () {
            if (ty.parentNode) ty.parentNode.removeChild(ty);
            msgs.appendChild(buildRow(m, time));
            time = addMin(time, 1);
            scrollDown();
            later(next, 280, tk);
          }, Math.min(600, 300 + len * 2), tk);
        } else {
          later(function () {
            msgs.appendChild(buildRow(m, time));
            time = addMin(time, 1);
            scrollDown();
            later(next, 220, tk);
          }, 300, tk);
        }
      }
      next();
    }

    function lastWolfText(t) {
      for (var i = t.m.length - 1; i >= 0; i--) {
        if (t.m[i].k === 'w' && t.m[i].t) return t.m[i].t.replace(/\n/g, ' ');
      }
      return '';
    }

    function fillNiche() {
      var n = NICHES[ni];
      tabEls.forEach(function (b, j) {
        var on = j === ni;
        b.setAttribute('aria-selected', on ? 'true' : 'false');
        b.tabIndex = on ? 0 : -1;
      });
      frame.setAttribute('aria-labelledby', 'wd-tab-' + ni);
      moments.innerHTML = '';
      moments.style.display = n.convs.length > 1 ? '' : 'none';
      n.convs.forEach(function (idx, j) {
        var b = h('button', 'wd-m', esc(MOMENT_LABEL[idx]));
        b.type = 'button';
        b.addEventListener('click', function () { selectConv(j, true); });
        moments.appendChild(b);
      });
    }

    function fillConv() {
      var t = conv(), n = NICHES[ni];
      Array.prototype.forEach.call(moments.children, function (b, j) {
        b.setAttribute('aria-pressed', j === ci ? 'true' : 'false');
      });
      list.innerHTML = '';
      list.appendChild(h('div', 'wd-lab', 'Conversas'));
      var rows = [{ n: t.who, s: lastWolfText(t), t: t.t0, on: true }].concat(n.list);
      rows.forEach(function (c) {
        var it = h('div', 'wd-item' + (c.on ? ' on' : ''),
          '<div class="wd-ini" aria-hidden="true">' + esc(c.n.charAt(0)) + '</div>' +
          '<div class="wd-it"><div class="top"><b>' + esc(c.n) + '</b><time>' + esc(c.t) + '</time></div><span class="s"></span><em>Atendida pelo assistente</em></div>');
        it.querySelector('.s').textContent = c.s;
        list.appendChild(it);
      });
      did.innerHTML = '<b>O que o Wolf fez aqui:</b> ' + esc(t.did);
      chead.innerHTML = '<div class="wd-ini" aria-hidden="true">' + esc(t.who.charAt(0)) + '</div><b>' + esc(t.who) + '</b><span>WHATSAPP</span>';
      card.innerHTML =
        '<div class="wd-lab">Ficha do cliente</div>' +
        '<div class="wd-who"><div class="wd-ini" aria-hidden="true">' + esc(t.who.charAt(0)) + '</div><div><b>' + esc(t.who) + '</b><span>Cliente · WhatsApp</span></div></div>' +
        '<span class="wd-stage">' + esc(t.stage) + '</span>' +
        (t.result ? '<div class="wd-res"><small>Resultado</small><strong>' + esc(t.result) + '</strong></div>' : '') +
        '<div class="wd-kv"><div><span>Nicho</span><b>' + esc(n.name) + '</b></div><div><span>Atendido por</span><b>Wolf</b></div></div>';
    }

    function show(user) {
      fillConv();
      if (reduce) { renderStatic(); return; }
      if (user) played = true;
      if (played) play(); else renderStatic();
    }
    function selectNiche(i, user) { ni = i; ci = 0; fillNiche(); show(user); }
    function selectConv(j, user) { ci = j; show(user); }

    fillNiche();
    show(false);

    if (!reduce && 'IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (es) {
        if (es[0].isIntersecting && !played) {
          played = true;
          play();
          io.disconnect();
        }
      }, { threshold: 0.3 });
      io.observe(frame);
    } else if (!reduce) {
      played = true;
      play();
    }
  }

  function tryInit() {
    var root = document.getElementById('wolf-demo');
    if (root && !root.getAttribute('data-wd')) {
      root.setAttribute('data-wd', '1');
      init(root);
    }
  }

  function boot() {
    tryInit();
    if ('MutationObserver' in window) {
      new MutationObserver(tryInit).observe(document.documentElement, { childList: true, subtree: true });
    } else {
      setInterval(tryInit, 500);
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
