/* Chat do Wolf no site.
   O botão flutuante do WhatsApp (a.wn-wa) abre este pop-up em vez de ir direto para o WhatsApp.
   Duas camadas: (1) o Wolf responde a perguntas; (2) o botão "Preciso de falar com alguém" (fixo) e o botão "Falar com alguém" (dentro das mensagens) levam ao WhatsApp.

   LIGAÇÃO À BASE DE CONHECIMENTO (fica para depois):
   - A chave de API NUNCA vai para este ficheiro. Ela fica num servidor (por exemplo uma função /api/chat na Vercel),
     que recebe a pergunta, consulta a base de conhecimento e devolve a resposta.
   - O servidor é api/chat.js; a chave está na variável WOLF_AI_API_KEY da Vercel e a base de conhecimento em knowledge/base.md.
   - Contrato:
       pedido   POST  { "message": "texto da pergunta", "history": [ { "role": "user"|"assistant", "content": "..." } ] }
       resposta 200   { "reply": "texto da resposta", "handoff": true|false }   (handoff: mostra o botão do WhatsApp no chat)
       resposta 429   { "reply": "...", "handoff": true, "limited": true }      (limite de perguntas atingido)
     Qualquer outro resultado (erro, tempo esgotado) mostra a mensagem de falha com o botão do WhatsApp.
   - Se CONFIG.endpoint ficar vazio, o chat funciona em modo de demonstração (resposta fixa). */
(function () {
  'use strict';

  var CONFIG = {
    endpoint: '/api/chat',              // deixe '' para o modo de demonstração
    timeoutMs: 20000,
    whatsapp: '258867372079',
    whatsappBase: 'Venho do site quero esclarecer uma dúvida',
    greeting: 'Olá! Eu sou o Wolf. 🐺\nPode fazer qualquer pergunta: estou aqui pronto para responder.',
    suggestions: ['Quanto custa?', 'Como funciona?', 'Funciona para o meu nicho?'],
    demoReply: 'Estou quase pronto para responder a tudo. Por agora, a nossa equipa responde-lhe no WhatsApp: toque no botão abaixo.',
    failReply: 'Não consegui responder agora. Para não o deixar sem resposta, fale diretamente com um agente da nossa equipa: toque no botão abaixo e atendemos no WhatsApp.',
    limitReply: 'Já respondi a várias perguntas por agora. Para continuar, fale diretamente com um agente da nossa equipa: toque no botão abaixo e atendemos no WhatsApp.',
    maxPerSession: 20,                  // limite do lado do visitante (o servidor tem os seus próprios limites)
    maxLen: 500
  };

  function isTouch() {
    return !!(window.matchMedia && (window.matchMedia('(max-width:760px)').matches || window.matchMedia('(pointer:coarse)').matches));
  }
  var WA_ICON = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91A9.84 9.84 0 0 0 12.04 2Zm0 18.15h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.24 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.38-1.72-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.15.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.42h-.48c-.17 0-.43.06-.66.31-.23.25-.87.85-.87 2.07s.89 2.4 1.01 2.56c.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.1-.23-.16-.48-.29Z"/></svg>';
  var SEND_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7"/></svg>';

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function h(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }

  var panel = null, backdrop = null, msgs, input, sendBtn, waLink, chips, trigger = null;
  var history = [], lastQuestion = '', busy = false, isOpen = false;

  function waHref() {
    var text = CONFIG.whatsappBase + (lastQuestion ? ': ' + lastQuestion : '');
    return 'https://wa.me/' + CONFIG.whatsapp + '?text=' + encodeURIComponent(text);
  }

  function scrollDown() { msgs.scrollTop = msgs.scrollHeight; }

  function addMsg(role, text, handoff) {
    var row = h('div', 'wc-row ' + (role === 'user' ? 'u' : 'w'));
    var col = h('div', 'wc-col');
    var b = h('div', 'wc-b');
    b.textContent = text;
    col.appendChild(b);
    if (handoff) {
      var a = h('a', 'wc-inline-wa', WA_ICON + '<span>Falar com alguém</span>');
      a.href = waHref();
      a.target = '_blank';
      a.rel = 'noopener';
      col.appendChild(a);
    }
    row.appendChild(col);
    msgs.appendChild(row);
    scrollDown();
    return row;
  }

  function typing() {
    var row = h('div', 'wc-row w wc-typing');
    row.setAttribute('aria-label', 'O Wolf está a escrever');
    row.appendChild(h('div', 'wc-b', '<i></i><i></i><i></i>'));
    msgs.appendChild(row);
    scrollDown();
    return row;
  }

  // Ponto único de ligação: devolve uma Promise com { reply, handoff }.
  function askWolf(question) {
    if (!CONFIG.endpoint) {
      return new Promise(function (resolve) { setTimeout(function () { resolve({ reply: CONFIG.demoReply, handoff: true }); }, reduce ? 0 : 700); });
    }
    var ctl = ('AbortController' in window) ? new AbortController() : null;
    var timer = setTimeout(function () { if (ctl) ctl.abort(); }, CONFIG.timeoutMs);
    return fetch(CONFIG.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: question, history: history.slice(-10) }),
      signal: ctl ? ctl.signal : undefined
    }).then(function (r) {
      clearTimeout(timer);
      return r.json().then(function (d) {
        if (!r.ok && r.status !== 429) throw new Error('http ' + r.status);
        if (!d || typeof d.reply !== 'string' || !d.reply.trim()) throw new Error('resposta vazia');
        return { reply: d.reply.trim(), handoff: !!d.handoff };
      });
    });
  }

  function sessionCount() {
    try { return parseInt(sessionStorage.getItem('wolfChatN') || '0', 10) || 0; } catch (e) { return 0; }
  }
  function sessionBump() {
    try { sessionStorage.setItem('wolfChatN', String(sessionCount() + 1)); } catch (e) { /* ignora */ }
  }

  function send(text) {
    text = (text || '').trim().slice(0, CONFIG.maxLen);
    if (!text || busy) return;
    if (chips && chips.parentNode) chips.parentNode.removeChild(chips);
    addMsg('user', text);
    lastQuestion = text;
    waLink.href = waHref();
    input.value = '';
    if (CONFIG.endpoint && sessionCount() >= CONFIG.maxPerSession) {
      addMsg('assistant', CONFIG.limitReply, true);
      sendBtn.disabled = true;
      return;
    }
    var wasTyping = document.activeElement === input;
    busy = true;
    sendBtn.disabled = true;
    sessionBump();
    var ty = typing();
    askWolf(text).then(function (r) { return r; }, function () { return { reply: CONFIG.failReply, handoff: true }; }).then(function (r) {
      if (ty.parentNode) ty.parentNode.removeChild(ty);
      addMsg('assistant', r.reply, r.handoff);
      history.push({ role: 'user', content: text }, { role: 'assistant', content: r.reply });
      busy = false;
      sendBtn.disabled = !input.value.trim();
      if (!isTouch() || wasTyping) input.focus();
    });
  }

  function build() {
    panel = h('div', 'wc');
    panel.id = 'wolf-chat';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', 'Chat com o Wolf');

    var head = h('div', 'wc-head',
      '<div class="wc-av"><img src="/assets/mascote-cabeca.png" alt="" width="34" height="34"></div>' +
      '<div class="wc-who"><b>Wolf</b><span><i></i>online · pronto a responder</span></div>');
    var x = h('button', 'wc-x', '×');
    x.type = 'button';
    x.setAttribute('aria-label', 'Fechar o chat');
    x.addEventListener('click', close);
    head.appendChild(x);
    panel.appendChild(head);

    msgs = h('div', 'wc-msgs');
    msgs.setAttribute('role', 'log');
    msgs.setAttribute('aria-live', 'polite');
    addMsg('assistant', CONFIG.greeting);
    chips = h('div', 'wc-chips');
    CONFIG.suggestions.forEach(function (s) {
      var c = h('button', 'wc-chip');
      c.type = 'button';
      c.textContent = s;
      c.addEventListener('click', function () { send(s); });
      chips.appendChild(c);
    });
    msgs.appendChild(chips);
    panel.appendChild(msgs);

    var form = h('form', 'wc-form');
    form.setAttribute('autocomplete', 'off');
    input = h('input', 'wc-in');
    input.type = 'text';
    input.placeholder = 'Escreva a sua pergunta…';
    input.maxLength = CONFIG.maxLen;
    input.setAttribute('aria-label', 'Escreva a sua pergunta');
    sendBtn = h('button', 'wc-send', SEND_ICON);
    sendBtn.type = 'submit';
    sendBtn.disabled = true;
    sendBtn.setAttribute('aria-label', 'Enviar');
    input.addEventListener('input', function () { sendBtn.disabled = busy || !input.value.trim(); });
    form.addEventListener('submit', function (e) { e.preventDefault(); send(input.value); });
    form.appendChild(input);
    form.appendChild(sendBtn);
    panel.appendChild(form);

    var wa = h('div', 'wc-wa');
    waLink = h('a', '', WA_ICON + '<span>Preciso de falar com alguém</span>' + '<svg class="wc-ext" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 4h6v6"/><path d="M20 4 10 14"/><path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/></svg>');
    waLink.href = waHref();
    waLink.target = '_blank';
    waLink.rel = 'noopener';
    wa.appendChild(waLink);
    wa.appendChild(h('small', '', 'Não encontrou a resposta? A nossa equipa atende-o no WhatsApp.'));
    panel.appendChild(wa);

    backdrop = h('div', 'wc-backdrop');
    backdrop.addEventListener('click', close);
    document.body.appendChild(backdrop);
    document.body.appendChild(panel);
  }

  function open() {
    if (!panel) build();
    isOpen = true;
    panel.classList.add('open');
    if (backdrop) backdrop.classList.add('open');
    if (trigger) {
      trigger.classList.add('open');
      trigger.setAttribute('aria-expanded', 'true');
      trigger.setAttribute('aria-controls', 'wolf-chat');
      trigger.setAttribute('aria-label', 'Fechar o chat com o Wolf');
    }
    if (!isTouch()) setTimeout(function () { input.focus(); }, reduce ? 0 : 230);
  }

  function close() {
    if (!panel) return;
    isOpen = false;
    panel.classList.remove('open');
    if (backdrop) backdrop.classList.remove('open');
    if (trigger) {
      trigger.classList.remove('open');
      trigger.setAttribute('aria-expanded', 'false');
      trigger.setAttribute('aria-label', 'Abrir o chat com o Wolf');
      trigger.focus();
    }
  }

  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a.wn-wa');
    if (!a) return;
    e.preventDefault();      // o endereço do WhatsApp fica no href como alternativa, sem JavaScript
    trigger = a;
    if (isOpen) close(); else open();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && isOpen) close();
  });

  // prepara o botão (React desenha-o depois do carregamento)
  function prepare() {
    var a = document.querySelector('a.wn-wa');
    if (a && !a.getAttribute('data-wc')) {
      a.setAttribute('data-wc', '1');
      a.setAttribute('aria-expanded', 'false');
      a.setAttribute('aria-label', 'Abrir o chat com o Wolf');
      trigger = a;
    }
  }
  function boot() {
    prepare();
    if ('MutationObserver' in window) new MutationObserver(prepare).observe(document.documentElement, { childList: true, subtree: true });
    else setInterval(prepare, 500);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
