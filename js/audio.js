// Gravações: as dos pais (o modelo que ele ouve antes de ler) e as dele.
//
// Não há voz sintética. As vozes do browser e as geradas por programas
// soavam robóticas e com falhas — mau modelo para quem aprende a ler. Quem
// lê para ele é o vídeo das histórias AaZ ou a voz da mãe ou do pai.
//
// Uma armadilha do Safari no iPad: o MediaRecorder grava em audio/mp4, não
// em webm. E o play() tem de acontecer logo no toque, sem esperas pelo meio.

let tocador = null;

export function ouvirModelo(id, aoTerminar = null) {
  pararDeTocar();
  if (!temModelo(id)) { if (aoTerminar) aoTerminar(); return; }
  const a = new Audio(modelos.get(id));
  tocador = a;
  const fim = () => { if (tocador !== a) return; tocador = null; if (aoTerminar) aoTerminar(); };
  a.onended = fim;
  a.onerror = fim;
  a.play().catch(fim);
}

export function pararDeTocar() {
  if (tocador) { const a = tocador; tocador = null; a.pause(); }
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

function abrirDB(nome = DB_NOME, loja = LOJA, chave = { keyPath: "id", autoIncrement: true }) {
  return new Promise((resolve, reject) => {
    const pedido = indexedDB.open(nome, 1);
    pedido.onupgradeneeded = () => {
      const db = pedido.result;
      if (!db.objectStoreNames.contains(loja)) {
        db.createObjectStore(loja, chave);
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

// ---------- leituras modelo, gravadas pelos pais ----------
//
// A voz da mãe ou do pai a ler o texto é o melhor modelo que ele pode ouvir.
// Uma gravação por texto, guardada à parte das leituras dele e sem limite:
// fica até alguém a apagar ou a substituir. Carregam-se todas no arranque
// para o botão de ouvir poder tocar logo no toque.

const DB_MODELOS = "plano-modelos";
const LOJA_MODELOS = "modelos";
const modelos = new Map(); // id do texto → URL da gravação

const abrirModelos = () => abrirDB(DB_MODELOS, LOJA_MODELOS, { keyPath: "id" });

export function temModelo(id) {
  return !!id && modelos.has(id);
}

export function urlModelo(id) {
  return modelos.get(id) || null;
}

export async function carregarModelos() {
  try {
    const db = await abrirModelos();
    const todos = await new Promise((res, rej) => {
      const p = db.transaction(LOJA_MODELOS, "readonly").objectStore(LOJA_MODELOS).getAll();
      p.onsuccess = () => res(p.result); p.onerror = () => rej(p.error);
    });
    db.close();
    for (const m of todos) modelos.set(m.id, URL.createObjectURL(m.blob));
  } catch (e) {
    console.warn("Não foi possível ler as gravações dos pais:", e);
  }
}

export async function guardarModelo(id, blob) {
  const db = await abrirModelos();
  await new Promise((res, rej) => {
    const tx = db.transaction(LOJA_MODELOS, "readwrite");
    tx.objectStore(LOJA_MODELOS).put({ id, blob, quando: Date.now() });
    tx.oncomplete = res; tx.onerror = () => rej(tx.error);
  });
  db.close();
  if (modelos.has(id)) URL.revokeObjectURL(modelos.get(id));
  modelos.set(id, URL.createObjectURL(blob));
  // Pede ao browser que não apague isto sozinho quando lhe faltar espaço.
  if (navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(() => {});
}

export async function apagarModelo(id) {
  const db = await abrirModelos();
  await new Promise(res => {
    const tx = db.transaction(LOJA_MODELOS, "readwrite");
    tx.objectStore(LOJA_MODELOS).delete(id);
    tx.oncomplete = res; tx.onerror = res;
  });
  db.close();
  if (modelos.has(id)) { URL.revokeObjectURL(modelos.get(id)); modelos.delete(id); }
}

export async function apagarModelos() {
  try {
    const db = await abrirModelos();
    await new Promise(res => {
      const tx = db.transaction(LOJA_MODELOS, "readwrite");
      tx.objectStore(LOJA_MODELOS).clear();
      tx.oncomplete = res; tx.onerror = res;
    });
    db.close();
  } catch (e) { /* não faz mal */ }
  for (const url of modelos.values()) URL.revokeObjectURL(url);
  modelos.clear();
}
