// Factos numéricos com repetição espaçada (sistema de caixas).
//
// Duas ideias governam este módulo:
//
// 1. Acertar não chega. Um facto só está aprendido quando sai depressa e sem
//    contar pelos dedos. Por isso um acerto lento mantém o cartão onde está —
//    e a exigência de rapidez aperta à medida que o facto sobe de caixa.
//
// 2. O que ele falha volta depressa; o que domina desaparece do caminho.
//    É isto que permite sessões de cinco minutos em vez de fichas de 40 contas.

import { COMPETENCIAS, PROBLEMAS, competenciaPorId } from "../data/matematica.js";
import { obter, alterar, hojeISO, marcarMissao } from "./store.js";
import { el, limpar, som, vibrar, cabecalho, baralhar, escolher } from "./ui.js";
import * as audio from "./audio.js";

const ITENS_POR_SESSAO = 18;
const NOVOS_POR_SESSAO = 6;
const DIAS_POR_CAIXA = [0, 1, 2, 4, 7, 14];
// Quanto mais alta a caixa, mais depressa tem de responder para subir.
const SEGUNDOS_LIMITE = [12, 10, 8, 6, 5, 5];

function cartao(id) {
  return obter().math.cartoes[id] || null;
}

function diasDesde(iso) {
  if (!iso) return 999;
  const [a, m, d] = iso.split("-").map(Number);
  return Math.floor((Date.now() - new Date(a, m - 1, d).getTime()) / 86400000);
}

export function competenciasDesbloqueadas() {
  const ordenadas = [...COMPETENCIAS].sort((a, b) => a.ordem - b.ordem);
  const abertas = [];
  for (const c of ordenadas) {
    abertas.push(c);
    if (!dominada(c, 0.6)) break; // abre a seguinte só quando esta já anda bem
  }
  return abertas;
}

export function dominada(comp, limiar = 0.85) {
  const itens = comp.itens();
  const fortes = itens.filter(i => { const c = cartao(i.id); return c && c.caixa >= 3; });
  return fortes.length / itens.length >= limiar;
}

export function progressoCompetencia(comp) {
  const itens = comp.itens();
  const c = itens.map(i => cartao(i.id)).filter(Boolean);
  const fortes = c.filter(x => x.caixa >= 3).length;
  const vistos = c.length;
  const errosRecentes = c.reduce((t, x) => t + (x.erros || 0), 0);
  const acertos = c.reduce((t, x) => t + (x.acertos || 0), 0);
  return {
    total: itens.length, vistos, fortes,
    percentagem: Math.round((fortes / itens.length) * 100),
    precisao: acertos + errosRecentes ? Math.round((acertos / (acertos + errosRecentes)) * 100) : null
  };
}

function montarSessao() {
  const abertas = competenciasDesbloqueadas();
  const todos = abertas.flatMap(c => c.itens());
  const emAtraso = [], novos = [];

  for (const it of todos) {
    const c = cartao(it.id);
    if (!c) novos.push(it);
    else if (diasDesde(c.ultimaVez) >= DIAS_POR_CAIXA[Math.min(c.caixa, 5)]) emAtraso.push({ it, c });
  }

  // Primeiro o que está mais fraco e há mais tempo à espera.
  emAtraso.sort((a, b) => (a.c.caixa - b.c.caixa) || (diasDesde(b.c.ultimaVez) - diasDesde(a.c.ultimaVez)));

  const escolhidos = emAtraso.slice(0, ITENS_POR_SESSAO - NOVOS_POR_SESSAO).map(x => x.it);
  const faltam = ITENS_POR_SESSAO - escolhidos.length;
  escolhidos.push(...baralhar(novos).slice(0, faltam));
  if (escolhidos.length < ITENS_POR_SESSAO) {
    // Já não há atrasados nem novos: repesca os mais fracos, para não parar a meio.
    const extra = baralhar(emAtraso.slice(ITENS_POR_SESSAO - NOVOS_POR_SESSAO).map(x => x.it));
    escolhidos.push(...extra.slice(0, ITENS_POR_SESSAO - escolhidos.length));
  }
  return baralhar(escolhidos);
}

function registar(item, acertou, segundos) {
  alterar(s => {
    const c = s.math.cartoes[item.id] || { caixa: 0, ultimaVez: null, erros: 0, acertos: 0, tempos: [] };
    if (acertou) {
      c.acertos++;
      const limite = SEGUNDOS_LIMITE[Math.min(c.caixa, 5)];
      if (segundos <= limite) c.caixa = Math.min(5, c.caixa + 1);
    } else {
      c.erros++;
      c.caixa = 0;
    }
    c.ultimaVez = hojeISO();
    c.tempos = [...(c.tempos || []), Math.round(segundos * 10) / 10].slice(-8);
    s.math.cartoes[item.id] = c;
  });
}

// ---------- ecrã ----------

export function render(raiz, ir) {
  let limpeza = null;

  function inicio() {
    if (limpeza) { limpeza(); limpeza = null; }
    limpar(raiz);
    raiz.appendChild(cabecalho("Matemática", "Cinco minutos de contas de cabeça. Rápido é melhor do que perfeito.", () => ir("casa")));

    const abertas = competenciasDesbloqueadas();
    const atual = abertas[abertas.length - 1];
    raiz.appendChild(el("div", { class: "painel" }, [
      el("div", { class: "rotulo", texto: "Estás a trabalhar em" }),
      el("h2", { texto: atual.nome, style: "margin:6px 0 4px" }),
      el("p", { class: "ajuda", texto: atual.desc }),
      barraDe(atual)
    ]));

    raiz.appendChild(el("button", { class: "btn btn-grande btn-matematica", onClick: () => sessao() }, "Começar"));
    raiz.appendChild(el("button", { class: "btn btn-grande", style: "margin-top:10px", onClick: problemas }, "Problemas para pensar"));

    const feitas = abertas.filter(c => dominada(c));
    if (feitas.length) {
      raiz.appendChild(el("div", { class: "painel plano", style: "margin-top:16px" }, [
        el("div", { class: "rotulo", texto: "Já dominas" }),
        el("div", { class: "medalhas", style: "margin-top:10px" },
          feitas.map(c => el("div", { class: "medalha" }, [el("span", { class: "emoji" }, "⭐️"), c.nome])))
      ]));
    }
  }

  function barraDe(comp) {
    const p = progressoCompetencia(comp);
    return el("div", {}, [
      el("div", { class: "barra matematica", style: "margin:10px 0 6px" }, [el("span", { style: `width:${p.percentagem}%` })]),
      el("p", { class: "ajuda", texto: p.fortes === 1 ? `1 de ${p.total} contas já te sai de cor.` : `${p.fortes} de ${p.total} contas já te saem de cor.` })
    ]);
  }

  // ---------- treino ----------

  function sessao() {
    const itens = montarSessao();
    let indice = 0, certas = 0;
    const tempos = [];

    const zona = el("div");
    limpar(raiz);
    raiz.appendChild(cabecalho("", null, inicio));
    raiz.appendChild(zona);

    function proxima() {
      if (indice >= itens.length) return fim();
      const item = itens[indice];
      const inicioMs = Date.now();
      let resposta = "";
      let bloqueado = false;

      limpar(zona);
      const progresso = el("div", { class: "rotulo centrado", texto: `${indice + 1} de ${itens.length}` });
      const conta = el("div", { class: "conta", texto: item.pergunta });
      const caixa = el("div", { class: "resposta-caixa", texto: "?" });
      zona.appendChild(el("div", { class: "painel" }, [progresso, conta, caixa]));

      function mostrar() { caixa.textContent = resposta === "" ? "?" : resposta; }

      function validar() {
        if (bloqueado || resposta === "") return;
        bloqueado = true;
        const segundos = (Date.now() - inicioMs) / 1000;
        const acertou = Number(resposta) === item.resposta;
        registar(item, acertou, segundos);
        tempos.push(segundos);
        if (acertou) {
          certas++; som("certo"); vibrar(15);
          caixa.classList.add("certa");
          setTimeout(() => { indice++; proxima(); }, 420);
        } else {
          som("errado"); vibrar(60);
          caixa.classList.add("errada");
          caixa.textContent = resposta;
          const certo = el("div", { class: "painel centrado", style: "border-color:var(--tempo)" }, [
            el("div", { class: "rotulo", texto: "A resposta certa é" }),
            el("div", { class: "numero-medio", texto: String(item.resposta) }),
            el("button", { class: "btn btn-grande btn-principal", style: "margin-top:12px", onClick: () => { indice++; proxima(); } }, "Continuar")
          ]);
          zona.appendChild(certo);
          [...teclado.querySelectorAll("button")].forEach(b => b.disabled = true);
        }
      }

      const teclado = el("div", { class: "teclado" });
      for (const t of ["1", "2", "3", "4", "5", "6", "7", "8", "9"]) {
        teclado.appendChild(el("button", { class: "tecla", onClick: () => { if (!bloqueado && resposta.length < 4) { resposta += t; mostrar(); } } }, t));
      }
      teclado.appendChild(el("button", { class: "tecla", onClick: () => { if (!bloqueado) { resposta = resposta.slice(0, -1); mostrar(); } } }, "←"));
      teclado.appendChild(el("button", { class: "tecla", onClick: () => { if (!bloqueado && resposta.length < 4) { resposta += "0"; mostrar(); } } }, "0"));
      teclado.appendChild(el("button", { class: "tecla acao", onClick: validar }, "✓"));
      zona.appendChild(teclado);
    }

    function fim() {
      marcarMissao("matematica");
      const medio = tempos.reduce((a, b) => a + b, 0) / (tempos.length || 1);
      alterar(s => {
        s.math.sessoes.push({ data: hojeISO(), total: itens.length, certas, tempoMedio: Math.round(medio * 10) / 10 });
      });
      som("fim");
      limpar(raiz);
      raiz.appendChild(cabecalho("Missão de matemática feita ✅", null, null));
      raiz.appendChild(el("div", { class: "painel centrado" }, [
        el("div", { class: "rotulo", texto: "Acertaste" }),
        el("div", { class: "numero-grande", texto: `${certas}/${itens.length}` }),
        el("p", { class: "ajuda", texto: `Cerca de ${medio.toFixed(1)} segundos por conta.` }),
        certas === itens.length
          ? el("p", { style: "color:var(--tempo);font-weight:700" }, "Tudo certo. As que já sabes bem vão aparecer menos vezes.")
          : el("p", { class: "ajuda" }, "As que falhaste voltam amanhã. É assim que ficam na cabeça.")
      ]));
      raiz.appendChild(el("button", { class: "btn btn-grande btn-principal", onClick: () => ir("casa") }, "Voltar ao início"));
    }

    proxima();
  }

  // ---------- problemas ----------

  function problemas() {
    const lista = baralhar(PROBLEMAS).slice(0, 3);
    let indice = 0, certas = 0;
    limpar(raiz);
    const zona = el("div");
    raiz.appendChild(cabecalho("Problemas", "Lê com calma. Podes pedir para ouvir.", inicio));
    raiz.appendChild(zona);

    function proximo() {
      if (indice >= lista.length) return fim();
      const p = lista[indice];
      let resposta = "", bloqueado = false;

      limpar(zona);
      const caixa = el("div", { class: "resposta-caixa", texto: "?" });
      const painel = el("div", { class: "painel" }, [
        el("div", { class: "rotulo", texto: `Problema ${indice + 1} de ${lista.length}` }),
        el("p", { class: "texto-leitura", texto: p.texto, style: "margin:12px 0" }),
        audio.temVoz() ? el("button", { class: "btn", onClick: () => audio.falar(p.texto, { velocidade: 0.85 }) }, "🔊  Ouvir o problema") : null,
        p.dica ? el("p", { class: "ajuda", style: "margin-top:10px", texto: "Dica: " + p.dica }) : null,
        caixa
      ]);
      zona.appendChild(painel);

      function mostrar() { caixa.textContent = resposta === "" ? "?" : resposta; }
      function validar() {
        if (bloqueado || resposta === "") return;
        bloqueado = true;
        const acertou = Number(resposta) === p.resposta;
        if (acertou) { certas++; som("certo"); caixa.classList.add("certa"); setTimeout(() => { indice++; proximo(); }, 600); }
        else {
          som("errado"); caixa.classList.add("errada");
          zona.appendChild(el("div", { class: "painel centrado", style: "border-color:var(--tempo)" }, [
            el("div", { class: "rotulo", texto: "A resposta certa é" }),
            el("div", { class: "numero-medio", texto: String(p.resposta) }),
            el("button", { class: "btn btn-grande btn-principal", style: "margin-top:12px", onClick: () => { indice++; proximo(); } }, "Continuar")
          ]));
          [...teclado.querySelectorAll("button")].forEach(b => b.disabled = true);
        }
      }

      const teclado = el("div", { class: "teclado" });
      for (const t of ["1", "2", "3", "4", "5", "6", "7", "8", "9"]) {
        teclado.appendChild(el("button", { class: "tecla", onClick: () => { if (!bloqueado && resposta.length < 4) { resposta += t; mostrar(); } } }, t));
      }
      teclado.appendChild(el("button", { class: "tecla", onClick: () => { if (!bloqueado) { resposta = resposta.slice(0, -1); mostrar(); } } }, "←"));
      teclado.appendChild(el("button", { class: "tecla", onClick: () => { if (!bloqueado && resposta.length < 4) { resposta += "0"; mostrar(); } } }, "0"));
      teclado.appendChild(el("button", { class: "tecla acao", onClick: validar }, "✓"));
      zona.appendChild(teclado);
    }

    function fim() {
      som("fim");
      audio.pararDeFalar();
      limpar(raiz);
      raiz.appendChild(cabecalho("Problemas feitos 👏", null, null));
      raiz.appendChild(el("div", { class: "painel centrado" }, [
        el("div", { class: "numero-grande", texto: `${certas}/${lista.length}` })
      ]));
      raiz.appendChild(el("button", { class: "btn btn-grande btn-principal", onClick: inicio }, "Voltar"));
    }

    limpeza = () => audio.pararDeFalar();
    proximo();
  }

  inicio();
  return () => { if (limpeza) limpeza(); };
}

export { COMPETENCIAS, competenciaPorId };
