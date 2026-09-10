// Pequenos ajudantes de interface.

export function el(tag, props = {}, filhos = []) {
  const n = document.createElement(tag);
  for (const [k, v] of Object.entries(props)) {
    if (k === "class") n.className = v;
    else if (k === "html") n.innerHTML = v;
    else if (k === "texto") n.textContent = v;
    else if (k.startsWith("on") && typeof v === "function") n.addEventListener(k.slice(2).toLowerCase(), v);
    else if (v !== null && v !== undefined && v !== false) n.setAttribute(k, v === true ? "" : v);
  }
  for (const f of [].concat(filhos)) {
    if (f === null || f === undefined || f === false) continue;
    n.appendChild(typeof f === "string" ? document.createTextNode(f) : f);
  }
  return n;
}

export function limpar(n) { while (n.firstChild) n.removeChild(n.firstChild); return n; }

export function mmss(segundos) {
  const s = Math.max(0, Math.round(segundos));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

export function minutosBonitos(segundos) {
  const m = Math.floor(Math.max(0, segundos) / 60);
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  return `${h}h${String(m % 60).padStart(2, "0")}`;
}

export function baralhar(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function escolher(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

// "1 grupos já de cor" fica mal a um miúdo que está a aprender a ler.
export function plural(n, um, muitos) {
  return `${n} ${n === 1 ? um : muitos}`;
}

// Sons curtos gerados na hora — evita ter de distribuir ficheiros de áudio.
let ctx = null;
function contexto() {
  if (!ctx) {
    const C = window.AudioContext || window.webkitAudioContext;
    if (C) ctx = new C();
  }
  if (ctx && ctx.state === "suspended") ctx.resume();
  return ctx;
}

export function som(tipo) {
  const c = contexto();
  if (!c) return;
  const notas = {
    certo: [[660, 0], [880, .09]],
    errado: [[220, 0], [175, .12]],
    fim: [[523, 0], [659, .1], [784, .2]],
    toque: [[440, 0]],
    aviso: [[880, 0], [880, .18]]
  }[tipo] || [[440, 0]];
  for (const [freq, atraso] of notas) {
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = "sine"; o.frequency.value = freq;
    o.connect(g); g.connect(c.destination);
    const t = c.currentTime + atraso;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.18, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.16);
    o.start(t); o.stop(t + 0.18);
  }
}

export function vibrar(ms = 20) {
  if (navigator.vibrate) navigator.vibrate(ms);
}

export function cabecalho(titulo, subtitulo, aoVoltar) {
  return el("div", { class: "voltar" }, [
    aoVoltar ? el("button", { class: "btn btn-fantasma", onClick: aoVoltar }, "‹ Voltar") : null,
    el("h1", { texto: titulo, style: "margin-top:8px" }),
    subtitulo ? el("p", { class: "ajuda", texto: subtitulo, style: "margin-top:-6px" }) : null
  ]);
}

export function confirmar(pergunta) { return window.confirm(pergunta); }
