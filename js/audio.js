// Voz e gravação.
// Duas armadilhas do Safari no iPad, tratadas aqui:
//  1. as vozes só aparecem depois do evento voiceschanged, e a primeira
//     fala tem de nascer de um toque do utilizador;
//  2. o MediaRecorder grava em audio/mp4, não em webm.
//
// E uma armadilha dos computadores: no Linux, o Brave em snap não tem vozes
// nenhumas, e as do sistema são robóticas. Por isso os textos da app têm
// áudio próprio em audio/, gerado por ferramentas/gerar-audio.py. A voz do
// browser fica só para o que não tem áudio (os textos que os pais acrescentam).

import { FALAS } from "../data/falas.js";

// A mesma conta que ferramentas/gerar-audio.py faz para dar nome ao ficheiro.
export function impressao(texto) {
  let h = 0x811c9dc5;
  for (const b of new TextEncoder().encode(String(texto).trim().replace(/\s+/g, " "))) {
    h ^= b;
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h.toString(16).padStart(8, "0");
}

function temAudio(texto) {
  return FALAS.has(impressao(texto));
}

let tocador = null;

// O play() tem de acontecer logo no toque (sem esperas pelo meio), senão o
// Safari recusa-se a tocar.
function tocar(texto, aoTerminar) {
  const a = new Audio(`audio/${impressao(texto)}.mp3`);
  tocador = a;
  a.onended = () => { if (tocador === a) tocador = null; if (aoTerminar) aoTerminar(); };
  a.onerror = () => {
    if (tocador !== a) return;
    tocador = null;
    // Sem rede e sem o ficheiro em cache: tenta a voz do browser.
    if (vozDoBrowser()) falarComVoz(texto, {}, aoTerminar);
    else if (aoTerminar) aoTerminar();
  };
  a.play().catch(() => { /* o onerror trata do resto */ });
}

let vozPT = null;
let vozesProntas = false;

function escolherVoz() {
  const vozes = speechSynthesis.getVoices();
  if (!vozes.length) return null;
  return vozes.find(v => v.lang === "pt-PT")
      || vozes.find(v => v.lang && v.lang.startsWith("pt-PT"))
      || vozes.find(v => v.lang && v.lang.startsWith("pt"))
      || null;
}

export function prepararVozes() {
  if (!("speechSynthesis" in window)) return;
  vozPT = escolherVoz();
  if (vozPT) vozesProntas = true;
  speechSynthesis.addEventListener("voiceschanged", () => {
    vozPT = escolherVoz();
    vozesProntas = !!vozPT;
  });
}

function vozDoBrowser() {
  return "speechSynthesis" in window && speechSynthesis.getVoices().length > 0;
}

// Há maneira de ler este texto em voz alta?
export function temVoz(texto) {
  return temAudio(texto) || vozDoBrowser();
}

export function falar(texto, { velocidade = 0.92, aoTerminar = null } = {}) {
  pararDeFalar();
  if (temAudio(texto)) { tocar(texto, aoTerminar); return true; }
  if (!vozDoBrowser()) { if (aoTerminar) aoTerminar(); return null; }
  return falarComVoz(texto, { velocidade }, aoTerminar);
}

function falarComVoz(texto, { velocidade = 0.92 }, aoTerminar) {
  speechSynthesis.cancel();
  if (!vozPT) vozPT = escolherVoz();
  const frases = String(texto).split(/\n{2,}/).filter(t => t.trim());
  let restantes = frases.length;
  const emissores = [];
  for (const f of frases) {
    const u = new SpeechSynthesisUtterance(f.trim());
    u.lang = "pt-PT";
    if (vozPT) u.voice = vozPT;
    u.rate = velocidade;
    u.pitch = 1;
    u.onend = () => { if (--restantes <= 0 && aoTerminar) aoTerminar(); };
    u.onerror = () => { if (--restantes <= 0 && aoTerminar) aoTerminar(); };
    emissores.push(u);
    speechSynthesis.speak(u);
  }
  return emissores;
}

export function pararDeFalar() {
  if (tocador) { const a = tocador; tocador = null; a.pause(); }
  if ("speechSynthesis" in window) speechSynthesis.cancel();
}

export function estaAFalar() {
  return !!tocador || ("speechSynthesis" in window && speechSynthesis.speaking);
}

// ---------- gravação ----------

let gravador = null;
let pedacos = [];
let stream = null;

export function podeGravar() {
  return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia && window.MediaRecorder);
}

export async function comecarAGravar() {
  if (!podeGravar()) throw new Error("Este dispositivo não permite gravar som.");
  stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const tipos = ["audio/mp4", "audio/webm;codecs=opus", "audio/webm", ""];
  const tipo = tipos.find(t => t === "" || MediaRecorder.isTypeSupported(t));
  gravador = new MediaRecorder(stream, tipo ? { mimeType: tipo } : undefined);
  pedacos = [];
  gravador.ondataavailable = e => { if (e.data && e.data.size) pedacos.push(e.data); };
  gravador.start();
}

export function pararDeGravar() {
  return new Promise(resolve => {
    if (!gravador || gravador.state === "inactive") return resolve(null);
    gravador.onstop = () => {
      const blob = new Blob(pedacos, { type: gravador.mimeType || "audio/mp4" });
      if (stream) stream.getTracks().forEach(t => t.stop());
      stream = null; gravador = null; pedacos = [];
      resolve(blob);
    };
    gravador.stop();
  });
}

export function aGravar() {
  return !!gravador && gravador.state === "recording";
}

// ---------- guardar gravações (IndexedDB, últimas 12) ----------

const DB_NOME = "plano-gravacoes";
const LOJA = "gravacoes";
const MAXIMO = 12;

function abrirDB() {
  return new Promise((resolve, reject) => {
    const pedido = indexedDB.open(DB_NOME, 1);
    pedido.onupgradeneeded = () => {
      const db = pedido.result;
      if (!db.objectStoreNames.contains(LOJA)) {
        db.createObjectStore(LOJA, { keyPath: "id", autoIncrement: true });
      }
    };
    pedido.onsuccess = () => resolve(pedido.result);
    pedido.onerror = () => reject(pedido.error);
  });
}

export async function guardarGravacao(blob, meta) {
  try {
    const db = await abrirDB();
    await new Promise((res, rej) => {
      const tx = db.transaction(LOJA, "readwrite");
      tx.objectStore(LOJA).add({ blob, ...meta, quando: Date.now() });
      tx.oncomplete = res; tx.onerror = () => rej(tx.error);
    });
    await limitarGravacoes(db);
    db.close();
    return true;
  } catch (e) {
    console.warn("Não foi possível guardar a gravação:", e);
    return false;
  }
}

async function limitarGravacoes(db) {
  const todas = await new Promise((res, rej) => {
    const tx = db.transaction(LOJA, "readonly");
    const p = tx.objectStore(LOJA).getAll();
    p.onsuccess = () => res(p.result); p.onerror = () => rej(p.error);
  });
  if (todas.length <= MAXIMO) return;
  const aRemover = todas.sort((a, b) => a.quando - b.quando).slice(0, todas.length - MAXIMO);
  await new Promise((res) => {
    const tx = db.transaction(LOJA, "readwrite");
    for (const g of aRemover) tx.objectStore(LOJA).delete(g.id);
    tx.oncomplete = res; tx.onerror = res;
  });
}

export async function listarGravacoes() {
  try {
    const db = await abrirDB();
    const todas = await new Promise((res, rej) => {
      const tx = db.transaction(LOJA, "readonly");
      const p = tx.objectStore(LOJA).getAll();
      p.onsuccess = () => res(p.result); p.onerror = () => rej(p.error);
    });
    db.close();
    return todas.sort((a, b) => b.quando - a.quando);
  } catch (e) {
    return [];
  }
}

export async function apagarGravacoes() {
  try {
    const db = await abrirDB();
    await new Promise(res => {
      const tx = db.transaction(LOJA, "readwrite");
      tx.objectStore(LOJA).clear();
      tx.oncomplete = res; tx.onerror = res;
    });
    db.close();
  } catch (e) { /* não faz mal */ }
}
