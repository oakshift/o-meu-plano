// Estado da aplicação. Tudo vive no localStorage do próprio iPad:
// nada é enviado para lado nenhum, não há contas nem servidor.

const CHAVE = "plano.v1";

const INICIAL = {
  versao: 1,
  perfil: { nome: "", criadoEm: null },
  config: {
    pin: "2468",
    minutosSemana: 45,
    minutosFimDeSemana: 75,
    nivelLeitura: 1,
    letraGrande: false,
    espacamentoAmplo: false,
    missoes: { leitura: true, matematica: true, silabas: true },
    diaAvaliacao: 6 // sábado
  },
  leitura: { sessoes: [], avaliacoes: [] },
  math: { cartoes: {}, sessoes: [] },
  silabas: { sessoes: [] },
  tempo: { dias: {} },
  textosProprios: [],
  medalhas: [],
  dias: {}
};

function fundir(base, guardado) {
  if (guardado === null || guardado === undefined) return base;
  if (Array.isArray(base)) return Array.isArray(guardado) ? guardado : base;
  if (typeof base === "object" && base !== null) {
    if (typeof guardado !== "object") return base;
    const out = {};
    for (const k of new Set([...Object.keys(base), ...Object.keys(guardado)])) {
      out[k] = k in base ? fundir(base[k], guardado[k]) : guardado[k];
    }
    return out;
  }
  return guardado;
}

let estado = carregar();

function carregar() {
  try {
    const bruto = localStorage.getItem(CHAVE);
    if (!bruto) return structuredClone(INICIAL);
    return fundir(structuredClone(INICIAL), JSON.parse(bruto));
  } catch (e) {
    console.warn("Não foi possível ler os dados guardados:", e);
    return structuredClone(INICIAL);
  }
}

let guardarPendente = null;
export function guardar() {
  // Agrupa escritas seguidas numa só — o localStorage do Safari é lento.
  if (guardarPendente) clearTimeout(guardarPendente);
  guardarPendente = setTimeout(() => {
    try {
      localStorage.setItem(CHAVE, JSON.stringify(estado));
    } catch (e) {
      console.warn("Não foi possível guardar:", e);
    }
    guardarPendente = null;
  }, 120);
}

export function guardarJa() {
  if (guardarPendente) { clearTimeout(guardarPendente); guardarPendente = null; }
  try { localStorage.setItem(CHAVE, JSON.stringify(estado)); } catch (e) { console.warn(e); }
}

export function obter() { return estado; }

export function alterar(fn) {
  fn(estado);
  guardar();
  return estado;
}

export function reiniciarTudo() {
  estado = structuredClone(INICIAL);
  guardarJa();
}

// ---------- datas ----------

export function hojeISO(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function ehFimDeSemana(d = new Date()) {
  const dia = d.getDay();
  return dia === 0 || dia === 6;
}

export function ultimosDias(n) {
  const out = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    out.push(hojeISO(d));
  }
  return out;
}

export const NOMES_DIA = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

// ---------- missões do dia ----------

export function diaAtual() {
  const k = hojeISO();
  if (!estado.dias[k]) estado.dias[k] = { leitura: false, matematica: false, silabas: false };
  return estado.dias[k];
}

export function marcarMissao(nome) {
  alterar(s => {
    const k = hojeISO();
    if (!s.dias[k]) s.dias[k] = { leitura: false, matematica: false, silabas: false };
    s.dias[k][nome] = true;
  });
}

export function missoesAtivas() {
  const m = estado.config.missoes;
  return ["leitura", "matematica", "silabas"].filter(x => m[x]);
}

export function missoesFeitasHoje() {
  const d = diaAtual();
  return missoesAtivas().filter(m => d[m]).length;
}

export function tudoFeitoHoje() {
  return missoesFeitasHoje() === missoesAtivas().length && missoesAtivas().length > 0;
}

// ---------- exportação ----------

export function exportarJSON() {
  return JSON.stringify(estado, null, 2);
}

export function importarJSON(txt) {
  const dados = JSON.parse(txt);
  if (!dados || typeof dados !== "object" || !("versao" in dados)) {
    throw new Error("Ficheiro não reconhecido.");
  }
  estado = fundir(structuredClone(INICIAL), dados);
  guardarJa();
}
