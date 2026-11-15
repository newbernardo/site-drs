/* Demonstração do painel do Wolf: abas com exemplos de atendimento.
   Monta-se sozinha dentro de <div id="wolf-demo">. Todos os nomes, moradas e valores são fictícios. */
(function () {
  'use strict';

  var OPT_UMIDADE = ['Parte de baixo da parede', 'No teto, quando chove', 'À volta das janelas'];

  var CONTACTS = [
    { n: 'Nelson', s: 'Podemos marcar a visita sábado de manhã, com a família toda?' },
    { n: 'Alberto', s: 'Tenho visita disponível quinta às 9:00 ou sábado às 10:00. Qual fica melhor para si?' },
    { n: 'Ricardo', s: 'Feito! 🛍️ Kit de 2 meses, com entrega em Maputo amanhã. Envio-lhe já os dados de pagamento.' },
    { n: 'Marta', s: 'Pagamento completo, Marta! ✅ Bem-vinda ao Programa 12 Semanas.' },
    { n: 'Ana', s: 'Dá, sim. No sábado tenho de manhã às 8:30, 9:00 e 11:00.' }
  ];

  var TABS = [
    {
      name: 'Recepção', niche: 'Imobiliária', who: 'Nelson', stage: 'Recepção', result: 'Respondido em 3 segundos', t0: '22:15',
      did: 'respondeu às 22:15 a um áudio, na hora, e percebeu tudo o que o cliente disse.',
      m: [
        { k: 'cv', d: '0:24', tr: 'Boa noite, vi aquele anúncio do apartamento na Sommerschield, aquele de 3 quartos, ainda está disponível? E aceitam crédito?' },
        { k: 'w', t: 'Boa noite! Está disponível, sim: o T3 na Sommerschield, com vista para a baía. E aceitamos crédito bancário; ajudamos no processo com o banco.' },
        { k: 'w', t: 'Para lhe fazer um bom atendimento, pode dizer-me o seu nome, por gentileza?' }
      ]
    },
    {
      name: 'Reengajamento', niche: 'Impermeabilização', who: 'Alberto', stage: 'Recepção → Qualificação', result: '', t0: '14:02',
      did: 'o cliente parou a meio; 10 minutos depois o Wolf voltou com uma pergunta de um toque.',
      m: [
        { k: 'w', t: 'Alberto, a humidade aparece mais onde?', opts: OPT_UMIDADE },
        { k: 's', t: '10 minutos sem resposta', add: 10 },
        { k: 'w', t: 'Alberto, sei que o dia é corrido. Para eu lhe dizer se o seu caso se resolve por dentro ou por fora, basta tocar numa opção:', btns: ['Como funciona?', 'Serve para mim?'] },
        { k: 'c', t: 'Serve para mim?' },
        { k: 'w', t: 'Serve, sim, se a humidade volta sempre depois da chuva: é sinal de que a água entra pela laje ou pelo telhado, e é isso que tratamos. A parte de baixo ou o teto?' }
      ]
    },
    {
      name: 'Qualificação', niche: 'Impermeabilização', who: 'Alberto', stage: 'Qualificação', result: 'Visita técnica a marcar', t0: '15:30',
      did: 'fez as perguntas de um técnico antes de falar em preço e marcou a visita.',
      m: [
        { k: 'c', t: 'Boa tarde, quanto cobram para tratar humidade na parede?' },
        { k: 'w', t: 'Boa tarde, Alberto! O valor depende do tipo de humidade, e para lhe dar um preço justo preciso de perceber duas coisas. A humidade aparece mais onde?', opts: ['Na parte de baixo da parede', 'No teto, quando chove', 'À volta das janelas'] },
        { k: 'c', t: 'No teto. E já tem bolor no quarto das crianças' },
        { k: 'w', t: 'Percebo a preocupação, ainda mais no quarto das crianças. O bolor no teto, quando chove, quase sempre vem da laje ou do telhado, e tratar só a pintura por dentro não resolve: volta na próxima chuva.' },
        { k: 'w', t: 'O certo é tratar por cima, na origem. Fazemos uma visita técnica grátis: medimos a área, vemos de onde entra a água e deixamos o orçamento fechado, sem surpresas.' },
        { k: 'w', t: 'Tenho visita disponível quinta às 9:00 ou sábado às 10:00. Qual fica melhor para si?' }
      ]
    },
    {
      name: 'Qualificação de alto valor', niche: 'Imobiliária', who: 'Nelson', stage: 'Apresentação', result: 'Visita: sábado', t0: '10:05',
      did: 'descobriu o orçamento, o crédito e a família, e só mostrou a casa certa.',
      m: [
        { k: 'c', t: 'Olá, tem casas para vender na Matola?' },
        { k: 'w', t: 'Olá, Nelson! Temos, sim. Para lhe mostrar só as que fazem sentido, diga-me: até que valor pensa investir?', opts: ['Até 3 milhões MT', 'De 3 a 6 milhões MT', 'Mais de 6 milhões MT'] },
        { k: 'c', t: '2. Mas preciso de crédito, não tenho tudo' },
        { k: 'w', t: 'Perfeito, a maioria dos nossos clientes compra com crédito bancário, e ajudamos nesse processo.' },
        { k: 'w', t: 'Com essa faixa, tenho 3 moradias T3 na Matola-Rio, com quintal, entre 4,2 e 5,8 milhões MT, todas com documentação em dia para o banco aprovar. Antes de lhe enviar as fotos: é para viver com a família ou para investir?' },
        { k: 'c', t: 'Para viver. Tenho 2 filhos' },
        { k: 'w', t: 'Então a mais indicada é a de 4,8 milhões MT: fica a 5 minutos da escola primária e tem 3 quartos com suite. Envio já as fotos.', photos: 3 },
        { k: 'w', t: 'Podemos marcar a visita sábado de manhã, com a família toda?' }
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
      name: '«Quando o salário cair»', niche: 'Programa de emagrecimento', who: 'Marta', stage: 'Objeções', result: 'Lembrete: dia 25', t0: '16:40',
      did: 'em vez de insistir ou desaparecer, fixou a data, deu valor até lá e voltou no dia certo.',
      m: [
        { k: 'c', t: 'Gostei muito, mas agora não tenho. Quando o salário cair dou sinal' },
        { k: 'w', t: 'Combinado, Marta, e obrigado pela sinceridade. Só para eu perceber: tirando a questão do momento, o programa é o que procura para perder os 8 kg antes do casamento da sua irmã?' },
        { k: 'c', t: 'É sim, só falta mesmo o dinheiro' },
        { k: 'w', t: 'Então vamos fazer assim: o salário cai em que dia?' },
        { k: 'c', t: 'Dia 25' },
        { k: 'w', t: 'Fica marcado. No dia 25 envio-lhe aqui os dados para garantir a sua vaga. E para não perder tempo até lá, posso já mandar-lhe o plano alimentar da primeira semana. Quer?' },
        { k: 'c', t: 'Quero sim 😍' },
        { k: 's', t: 'dia 25, 10:12', set: '10:12' },
        { k: 'w', t: 'Bom dia, Marta! Hoje é dia 25, como combinámos. 😊 Como correu a primeira semana com o plano? Quando quiser, aqui estão os dados para garantir a sua vaga no programa.' }
      ]
    },
    {
      name: '«Vou falar com o meu marido»', niche: 'Programa de emagrecimento', who: 'Marta', stage: 'Objeções', result: 'Decisão partilhada', t0: '17:10',
      did: 'deu à cliente o que ela precisava para convencer o marido.',
      m: [
        { k: 'c', t: 'Gostei, mas tenho de falar com o meu marido primeiro' },
        { k: 'w', t: 'Claro, Marta, é uma decisão a dois. Posso ajudar? Aqui está um resumo curto para lhe mostrar: o que inclui, quanto custa por semana e os resultados de outras mães como a Marta.', doc: 'Programa 12 Semanas: resumo.pdf' },
        { k: 'w', t: 'Que dúvida acha que ele vai ter? Assim já leva a resposta.' },
        { k: 'c', t: 'Vai dizer que é caro' },
        { k: 'w', t: 'Então diga-lhe isto: são 2.400 MT por mês, menos do que um jantar fora por semana, e inclui o acompanhamento diário da nutricionista no WhatsApp. Amanhã à tarde pergunto-lhe como correu. 😊' }
      ]
    },
    {
      name: 'Encomenda', niche: 'Suplementos capilares', who: 'Ricardo', stage: 'Encomenda e pagamento', result: 'Pedido: 5.250 MT', t0: '12:30',
      did: 'recolheu a morada, a referência e o contacto, e calculou o total com a entrega.',
      m: [
        { k: 'c', t: 'Quero o kit de 3 meses' },
        { k: 'w', t: 'Ótima escolha! Em que cidade e bairro está?' },
        { k: 'c', t: 'Matola, Liberdade' },
        { k: 'w', t: 'Matola, perfeito! A entrega para lá custa 150 MT. Tem algum ponto de referência perto de si?' },
        { k: 'c', t: 'Ao lado da bomba de combustível' },
        { k: 'w', t: 'Só para confirmar o seu pedido:\n🛍️ Kit capilar de 3 meses\n📍 Matola, Liberdade, ao lado da bomba de combustível\n📞 Este número\n💰 Total: 5.250 MT (5.100 + 150 de entrega)\nEstá tudo certo?' }
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
      name: 'Marcação', niche: 'Clínica dentária', who: 'Ana', stage: 'Marcação', result: 'Marcação: sábado 9:00', t0: '09:12',
      did: 'desmarcou e remarcou sozinho, só com horas livres, sem ninguém da clínica pegar no telefone.',
      m: [
        { k: 'c', t: 'Preciso de remarcar a minha limpeza de amanhã, surgiu um imprevisto no trabalho' },
        { k: 'w', t: 'Sem problema, Ana! A sua limpeza de amanhã às 10:30 fica desmarcada. Para que dia prefere?', btns: ['Quarta, 19/11', 'Quinta, 20/11', 'Sábado, 22/11'] },
        { k: 'c', t: 'Sábado de manhã dá?' },
        { k: 'w', t: 'Dá, sim. No sábado tenho de manhã às 8:30, 9:00 e 11:00.' },
        { k: 'c', t: '9' },
        { k: 'w', t: 'Marcação confirmada, Ana! ✅\n🦷 Limpeza (30 min)\n📅 Sábado, 22/11, às 9:00\n📍 Av. Julius Nyerere\n💰 1.500 MT, a pagar na clínica.\nNa sexta envio-lhe um lembrete. Bom trabalho amanhã!' }
      ]
    },
    {
      name: 'Pós-venda e recompra', niche: 'Transplante capilar e suplementos', who: 'Ricardo', stage: 'Pós-venda', result: 'Recompra: 3.400 MT', t0: '10:15',
      did: 'voltou aos 30 dias, acompanhou o resultado e fez a recompra com naturalidade.',
      m: [
        { k: 's', t: '30 dias depois da compra' },
        { k: 'w', t: 'Olá, Ricardo! Já faz um mês que começou o suplemento capilar. Como tem notado o cabelo? Está a cair menos no banho?' },
        { k: 'c', t: 'Sim! Já caem bem menos fios. Até a minha esposa reparou' },
        { k: 'w', t: 'Que bom, Ricardo! É exatamente o resultado esperado no primeiro mês. 🙌 O seu frasco deve estar a acabar por estes dias, e o tratamento dá o melhor resultado com 3 meses seguidos. Quer que lhe envie já o próximo, para não interromper? Levando o kit de 2 meses, fica por 3.400 MT em vez de 3.800.' },
        { k: 'c', t: 'Manda o kit de 2' },
        { k: 'w', t: 'Feito! 🛍️ Kit de 2 meses, com entrega em Maputo amanhã. Envio-lhe já os dados de pagamento.' }
      ]
    }
  ];

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
  var HOUSE = '<svg viewBox="0 0 24 24" fill="none" stroke="#A59DB0" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11 12 4l9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/></svg>';

  function init(root) {
    var active = 0, token = 0, timers = [], played = false;
    var lastTime = '';

    root.innerHTML = '';
    var wd = h('div', 'wd');

    var head = h('div', 'wd-head');
    head.appendChild(h('h2', '', 'Veja o <em>Wolf</em> a vender em cada momento da conversa'));
    head.appendChild(h('p', '', 'Do primeiro olá à recompra: o que um robô responde mal e uma equipa não consegue fazer a todos, a toda a hora.'));
    wd.appendChild(head);

    var tabs = h('div', 'wd-tabs');
    tabs.setAttribute('role', 'tablist');
    tabs.setAttribute('aria-label', 'Momentos do funil de vendas');
    var tabEls = TABS.map(function (t, i) {
      var b = h('button', 'wd-tab', '<b>' + esc(t.name) + '</b><small>' + esc(t.niche) + '</small>');
      b.type = 'button';
      b.id = 'wd-tab-' + i;
      b.setAttribute('role', 'tab');
      b.setAttribute('aria-controls', 'wd-panel');
      b.addEventListener('click', function () { select(i, true); });
      tabs.appendChild(b);
      return b;
    });
    tabs.addEventListener('keydown', function (e) {
      var k = e.key, n = TABS.length, i = active;
      if (k === 'ArrowRight' || k === 'ArrowDown') i = (active + 1) % n;
      else if (k === 'ArrowLeft' || k === 'ArrowUp') i = (active - 1 + n) % n;
      else if (k === 'Home') i = 0;
      else if (k === 'End') i = n - 1;
      else return;
      e.preventDefault();
      select(i, true);
      tabEls[i].focus();
    });
    wd.appendChild(tabs);

    var frame = h('div', 'wd-frame');
    frame.id = 'wd-panel';
    frame.setAttribute('role', 'tabpanel');
    var bar = h('div', 'wd-bar',
      '<div class="wd-dots" aria-hidden="true"><i></i><i></i><i></i></div>' +
      '<div class="wd-bar-t"><img src="assets/mascote-cabeca.png" alt="" width="20" height="20"><span>Painel · The Wolf Seller</span></div>' +
      '<div class="wd-live"><i></i>AO VIVO · EXEMPLO</div>');
    frame.appendChild(bar);

    var body = h('div', 'wd-body');
    var list = h('div', 'wd-list');
    list.appendChild(h('div', 'wd-lab', 'Conversas'));
    var itemEls = CONTACTS.map(function (c) {
      var it = h('div', 'wd-item',
        '<div class="wd-ini" aria-hidden="true">' + esc(c.n.charAt(0)) + '</div>' +
        '<div class="wd-it"><b>' + esc(c.n) + '</b><span class="s"></span><em>Atendida pelo assistente</em></div>');
      it.querySelector('.s').textContent = c.s;
      list.appendChild(it);
      return it;
    });
    body.appendChild(list);

    var main = h('div', 'wd-main');
    var did = h('div', 'wd-did');
    main.appendChild(did);
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

    var cta = h('div', 'wd-cta',
      '<a class="p" href="#precos">Quero o Wolf a vender no meu WhatsApp</a><a class="s" href="#precos">Ver os planos</a>');
    wd.appendChild(cta);
    root.appendChild(wd);

    function clearTimers() {
      timers.forEach(clearTimeout);
      timers = [];
    }
    function later(fn, ms, tk) {
      timers.push(setTimeout(function () { if (tk === token) fn(); }, ms));
    }
    function scrollDown() {
      msgs.scrollTop = msgs.scrollHeight;
    }

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
        var g = h('div', 'wd-opts' + (m.btns && m.btns.length < 4 && m.btns !== m.opts ? ' row' : ''));
        btns.forEach(function (b) { g.appendChild(h('span', 'wd-btn', esc(b))); });
        col.appendChild(g);
      }
      row.appendChild(col);
      if (isWolf) {
        var av = h('img', 'wd-av');
        av.src = 'assets/mascote-cabeca.png';
        av.alt = 'Wolf';
        av.width = 28; av.height = 28;
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
      av.src = 'assets/mascote-cabeca.png'; av.alt = ''; av.width = 28; av.height = 28;
      row.appendChild(av);
      return row;
    }

    function renderStatic(i) {
      var t = TABS[i], time = t.t0;
      msgs.innerHTML = '';
      t.m.forEach(function (m, idx) {
        if (m.k === 's') {
          if (m.set) time = m.set; else if (m.add) time = addMin(time, m.add);
          msgs.appendChild(buildRow(m, time));
        } else {
          msgs.appendChild(buildRow(m, time));
          time = addMin(time, 1);
        }
      });
      msgs.querySelectorAll('.wd-row').forEach(function (r) { r.style.animation = 'none'; });
      scrollDown();
    }

    function play(i) {
      var tk = ++token;
      clearTimers();
      var t = TABS[i], time = t.t0, idx = 0;
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
        var isWolf = m.k === 'w';
        var len = (m.t || '').length;
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

    function fill(i) {
      var t = TABS[i];
      tabEls.forEach(function (b, j) {
        var on = j === i;
        b.setAttribute('aria-selected', on ? 'true' : 'false');
        b.tabIndex = on ? 0 : -1;
      });
      frame.setAttribute('aria-labelledby', 'wd-tab-' + i);
      CONTACTS.forEach(function (c, j) {
        var on = c.n === t.who;
        itemEls[j].classList.toggle('on', on);
        itemEls[j].querySelector('.s').textContent = on ? lastWolfText(t) : c.s;
      });
      did.innerHTML = '<b>O que o Wolf fez aqui:</b> ' + esc(t.did);
      chead.innerHTML = '<div class="wd-ini" aria-hidden="true">' + esc(t.who.charAt(0)) + '</div><b>' + esc(t.who) + '</b><span>WHATSAPP</span>';
      card.innerHTML =
        '<div class="wd-lab" style="padding:0">Ficha do cliente</div>' +
        '<div class="wd-who"><div class="wd-ini" aria-hidden="true">' + esc(t.who.charAt(0)) + '</div><div><b>' + esc(t.who) + '</b><span>Cliente · WhatsApp</span></div></div>' +
        '<span class="wd-stage">' + esc(t.stage) + '</span>' +
        (t.result ? '<div class="wd-res"><small>Resultado</small><strong>' + esc(t.result) + '</strong></div>' : '') +
        '<div class="wd-kv"><div><span>Canal</span><b>WhatsApp</b></div><div><span>Atendido por</span><b>Wolf</b></div><div><span>Mensagens</span><b>' + t.m.filter(function (m) { return m.k !== 's'; }).length + '</b></div></div>';
    }

    function select(i, user) {
      active = i;
      fill(i);
      if (reduce) { renderStatic(i); return; }
      if (user) played = true;
      if (played) play(i); else renderStatic(i);
    }

    select(0, false);

    if (!reduce && 'IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (es) {
        if (es[0].isIntersecting && !played) {
          played = true;
          play(active);
          io.disconnect();
        }
      }, { threshold: 0.3 });
      io.observe(frame);
    } else if (!reduce) {
      played = true;
      play(active);
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
