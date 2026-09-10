// O progresso, contado para ele.
//
// Deliberadamente sem "sequências de dias" infinitas: uma corrente de 30 dias
// que se parte num dia de febre desmotiva mais do que ajuda. Aqui conta-se
// por semana, que recomeça sempre.

import { obter, ultimosDias, NOMES_DIA, hojeISO, missoesAtivas } from "./store.js";
import { el, limpar, cabecalho, plural } from "./ui.js";
import { melhorPPMGeral } from "./leitura.js";
import { COMPETENCIAS, dominada } from "./matematica.js";

export function medalhasGanhas() {
  const s = obter();
  const leituras = s.leitura.sessoes.length;
  const ppmMax = melhorPPMGeral();
  const tabuadas = COMPETENCIAS.filter(c => dominada(c)).length;
  const sessoesMat = s.math.sessoes.length;
  const diasComTudo = Object.entries(s.dias).filter(([, d]) => missoesAtivas().every(m => d[m])).length;
  const blocosATempo = Object.values(s.tempo.dias)
    .flatMap(d => d.blocos || [])
    .filter(b => b.realSeg <= b.planeadoSeg + 60).length;

  const todas = [
    { id: "primeira", emoji: "📖", nome: "Primeira leitura", ganha: leituras >= 1 },
    { id: "cinco", emoji: "📚", nome: "5 leituras", ganha: leituras >= 5 },
    { id: "vinte", emoji: "🏛️", nome: "20 leituras", ganha: leituras >= 20 },
    { id: "ppm60", emoji: "🚶", nome: "60 palavras por minuto", ganha: ppmMax >= 60 },
    { id: "ppm90", emoji: "🏃", nome: "90 palavras por minuto", ganha: ppmMax >= 90 },
    { id: "ppm120", emoji: "🚀", nome: "120 palavras por minuto", ganha: ppmMax >= 120 },
    { id: "mat5", emoji: "🔢", nome: "5 treinos de contas", ganha: sessoesMat >= 5 },
    { id: "tab1", emoji: "⭐️", nome: "Primeira tabuada de cor", ganha: tabuadas >= 1 },
    { id: "tab3", emoji: "🌟", nome: "Três grupos de cor", ganha: tabuadas >= 3 },
    { id: "dia1", emoji: "✅", nome: "Um dia completo", ganha: diasComTudo >= 1 },
    { id: "dia10", emoji: "🎯", nome: "10 dias completos", ganha: diasComTudo >= 10 },
    { id: "tempo5", emoji: "⏱️", nome: "Voltaste a horas 5 vezes", ganha: blocosATempo >= 5 },
    { id: "tempo20", emoji: "🧭", nome: "Voltaste a horas 20 vezes", ganha: blocosATempo >= 20 }
  ];
  return todas;
}

export function render(raiz, ir) {
  limpar(raiz);
  const s = obter();
  raiz.appendChild(cabecalho("O meu progresso", null, () => ir("casa")));

  // ---- semana ----
  const dias = ultimosDias(7);
  const ativas = missoesAtivas();
  raiz.appendChild(el("div", { class: "painel" }, [
    el("div", { class: "rotulo", texto: "Esta semana" }),
    el("div", { class: "linha", style: "margin-top:12px;justify-content:space-between" },
      dias.map(d => {
        const dia = s.dias[d] || {};
        const feitas = ativas.filter(m => dia[m]).length;
        const completo = ativas.length && feitas === ativas.length;
        const nome = NOMES_DIA[new Date(d + "T12:00:00").getDay()];
        return el("div", { class: "centrado" }, [
          el("div", {
            class: "ponto" + (completo ? " cheio" : ""),
            style: !completo && feitas ? "background:var(--tempo-clara);border-color:var(--tempo)" : ""
          }, completo ? "✓" : (feitas ? String(feitas) : "")),
          el("div", { class: "dia", style: "font-size:12px;color:var(--texto-suave);margin-top:4px", texto: nome })
        ]);
      })
    ),
    el("p", { class: "ajuda", style: "margin-top:12px", texto: `${plural(dias.filter(d => { const x = s.dias[d] || {}; return ativas.length && ativas.every(m => x[m]); }).length, "dia completo", "dias completos")} nos últimos 7.` })
  ]));

  // ---- leitura ----
  const sessoes = s.leitura.sessoes.slice(-10);
  if (sessoes.length) {
    const valores = sessoes.map(x => Math.max(...(x.tentativas || [{ ppm: 0 }]).map(t => t.ppm)));
    const topo = Math.max(...valores, 10);
    raiz.appendChild(el("div", { class: "painel" }, [
      el("div", { class: "rotulo", texto: "Leitura · palavras por minuto" }),
      el("div", { class: "grafico" }, valores.map(v => el("div", { class: "col" }, [
        el("div", { class: "val", style: `height:${Math.round((v / topo) * 100)}%`, title: String(v) }),
        el("div", { class: "dia", texto: String(v) })
      ]))),
      el("p", { class: "ajuda", texto: `O teu melhor de sempre: ${melhorPPMGeral()} palavras por minuto.` })
    ]));
  }

  // ---- matemática ----
  const feitas = COMPETENCIAS.filter(c => dominada(c));
  if (s.math.sessoes.length) {
    raiz.appendChild(el("div", { class: "painel" }, [
      el("div", { class: "rotulo", texto: "Matemática" }),
      el("p", { style: "margin-top:8px" }, `${plural(s.math.sessoes.length, "treino feito", "treinos feitos")} · ${plural(feitas.length, "grupo já de cor", "grupos já de cor")}.`),
      ...COMPETENCIAS.slice(0, 6).map(c => {
        const itens = c.itens();
        const fortes = itens.filter(i => { const k = s.math.cartoes[i.id]; return k && k.caixa >= 3; }).length;
        return el("div", { style: "margin-top:10px" }, [
          el("div", { class: "linha", style: "justify-content:space-between" }, [
            el("span", { texto: c.nome, style: "font-weight:600" }),
            el("span", { class: "ajuda", texto: `${fortes}/${itens.length}` })
          ]),
          el("div", { class: "barra matematica", style: "margin-top:4px" }, [el("span", { style: `width:${Math.round((fortes / itens.length) * 100)}%` })])
        ]);
      })
    ]));
  }

  // ---- medalhas ----
  const medalhas = medalhasGanhas();
  const ganhas = medalhas.filter(m => m.ganha);
  const proxima = medalhas.find(m => !m.ganha);
  raiz.appendChild(el("div", { class: "painel" }, [
    el("div", { class: "rotulo", texto: `Medalhas · ${ganhas.length} de ${medalhas.length}` }),
    ganhas.length
      ? el("div", { class: "medalhas", style: "margin-top:12px" },
          ganhas.map(m => el("div", { class: "medalha" }, [el("span", { class: "emoji" }, m.emoji), m.nome])))
      : el("p", { class: "ajuda", style: "margin-top:8px" }, "Ainda nenhuma. A primeira chega hoje se fizeres uma leitura."),
    proxima ? el("p", { class: "ajuda", style: "margin-top:12px" }, `A seguir: ${proxima.emoji} ${proxima.nome}`) : null
  ]));
}
