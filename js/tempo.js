// O tempo de ecrã dele.
//
// Regra desta app: o tempo NÃO se ganha com o treino. É um orçamento fixo,
// definido pelos pais, que ele gere sozinho. O que o treino desbloqueia são
// outras coisas (níveis, medalhas). Assim a leitura não vira moeda de troca.
//
// A app não bloqueia nada — o Safari não consegue. Quem corta é o Tempo de
// Ecrã do iOS. O que a app faz é dar-lhe a decisão e a hora de regresso:
// "acaba às 17:35" funciona melhor com uma criança do que um alarme que ela
// não vai ouvir por estar noutra aplicação.

import { obter, alterar, hojeISO, ehFimDeSemana } from "./store.js";
import { el, limpar, mmss, som, vibrar, cabecalho } from "./ui.js";

export function orcamentoDeHojeSeg() {
  const c = obter().config;
  return (ehFimDeSemana() ? c.minutosFimDeSemana : c.minutosSemana) * 60;
}

export function diaDeTempo(data = hojeISO()) {
  const s = obter();
  if (!s.tempo.dias[data]) {
    alterar(x => { x.tempo.dias[data] = { gastoSeg: 0, blocos: [], blocoAtivo: null }; });
  }
  return obter().tempo.dias[data];
}

export function gastoHojeSeg() {
  const d = diaDeTempo();
  return d.gastoSeg + (d.blocoAtivo ? decorridoSeg(d.blocoAtivo) : 0);
}

export function restanteHojeSeg() {
  return Math.max(0, orcamentoDeHojeSeg() - gastoHojeSeg());
}

function decorridoSeg(bloco) {
  return Math.max(0, Math.round((Date.now() - bloco.inicio) / 1000));
}

export function blocoAtivo() {
  return diaDeTempo().blocoAtivo;
}

function iniciarBloco(planeadoSeg) {
  alterar(s => {
    const d = s.tempo.dias[hojeISO()];
    d.blocoAtivo = { inicio: Date.now(), planeadoSeg };
  });
}

function terminarBloco() {
  const d = diaDeTempo();
  if (!d.blocoAtivo) return null;
  const real = decorridoSeg(d.blocoAtivo);
  const planeado = d.blocoAtivo.planeadoSeg;
  const resultado = { real, planeado, excedeu: real > planeado + 60 };
  alterar(s => {
    const dia = s.tempo.dias[hojeISO()];
    dia.blocos.push({ inicio: dia.blocoAtivo.inicio, fim: Date.now(), planeadoSeg: planeado, realSeg: real });
    // Nunca desconta mais do que o orçamento do dia: passar do limite tem
    // consequência na conversa, não numa dívida que se arrasta.
    const restante = Math.max(0, orcamentoDeHojeSeg() - dia.gastoSeg);
    dia.gastoSeg += Math.min(real, restante);
    dia.blocoAtivo = null;
  });
  return resultado;
}

function horaDe(ms) {
  const d = new Date(ms);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

// ---------- ecrã ----------

export function render(raiz, ir) {
  let temporizador = null;

  function desenhar() {
    limpar(raiz);
    if (temporizador) { clearInterval(temporizador); temporizador = null; }

    const ativo = blocoAtivo();
    raiz.appendChild(cabecalho("O meu tempo", null, () => ir("casa")));

    if (ativo) return desenharACorrer(ativo);
    return desenharEscolha();
  }

  function desenharEscolha() {
    const restante = restanteHojeSeg();
    const orcamento = orcamentoDeHojeSeg();
    const usadoPct = Math.min(100, Math.round((gastoHojeSeg() / orcamento) * 100));

    const p = el("div", { class: "painel centrado" }, [
      el("div", { class: "rotulo", texto: "Ainda tens hoje" }),
      el("div", { class: "numero-grande", texto: restante >= 60 ? `${Math.round(restante / 60)} min` : `${restante} s` }),
      el("div", { class: "barra", style: "margin:16px 0 8px" }, [
        el("span", { style: `width:${usadoPct}%${restante <= 0 ? ";background:var(--matematica)" : ""}` })
      ]),
      el("p", { class: "ajuda", texto: `Já usaste ${Math.round(gastoHojeSeg() / 60)} dos teus ${Math.round(orcamento / 60)} minutos de hoje.` })
    ]);
    raiz.appendChild(p);

    if (restante <= 0) {
      raiz.appendChild(el("div", { class: "aviso" }, [
        el("strong", { texto: "O tempo de hoje acabou." }),
        el("p", { style: "margin:6px 0 0" }, "Amanhã tens tudo outra vez. Podes ir fazer outra coisa — ou treinar, se te apetecer.")
      ]));
      raiz.appendChild(el("button", { class: "btn btn-grande btn-principal", onClick: () => ir("casa") }, "Voltar ao início"));
      return;
    }

    raiz.appendChild(el("div", { class: "painel" }, [
      el("h2", { texto: "Quanto queres usar agora?" }),
      el("p", { class: "ajuda", texto: "Tu decides. O que não gastares agora fica para logo — mas não passa para amanhã." }),
      el("div", { class: "pilha", style: "margin-top:14px" },
        [10, 15, 20, 30]
          .filter(m => m * 60 <= restante)
          .map(m => botaoBloco(m * 60, `${m} minutos`))
          .concat(restante < 10 * 60 || restante % (5 * 60) !== 0
            ? [botaoBloco(restante, `Tudo o que resta (${Math.round(restante / 60)} min)`)]
            : (restante > 30 * 60 ? [botaoBloco(restante, `Tudo o que resta (${Math.round(restante / 60)} min)`)] : []))
      )
    ]));
  }

  function botaoBloco(seg, rotulo) {
    const acaba = horaDe(Date.now() + seg * 1000);
    return el("button", {
      class: "btn btn-grande btn-tempo",
      onClick: () => { som("toque"); iniciarBloco(seg); desenhar(); }
    }, `${rotulo}  ·  até às ${acaba}`);
  }

  function desenharACorrer(ativo) {
    const alvo = ativo.inicio + ativo.planeadoSeg * 1000;
    let jaAvisou = false;

    const numero = el("div", { class: "numero-grande" });
    const estado = el("p", { class: "ajuda" });
    const painel = el("div", { class: "painel centrado" }, [
      el("div", { class: "rotulo", texto: "Volta a esta app às" }),
      el("div", { class: "numero-medio", texto: horaDe(alvo), style: "margin:6px 0 18px" }),
      el("div", { class: "rotulo", texto: "Falta" }),
      numero,
      estado
    ]);
    raiz.appendChild(painel);

    raiz.appendChild(el("div", { class: "aviso info" }, [
      el("strong", { texto: "Podes ir." }),
      el("p", { style: "margin:6px 0 0" }, "Quando voltares, carrega em Terminar para o tempo parar de contar.")
    ]));

    raiz.appendChild(el("button", {
      class: "btn btn-grande btn-principal", style: "margin-top:8px",
      onClick: () => {
        const r = terminarBloco();
        som(r && r.excedeu ? "aviso" : "fim");
        vibrar(30);
        desenhar();
        if (r) mostrarResultado(r);
      }
    }, "Terminar agora"));

    function tique() {
      const falta = Math.round((alvo - Date.now()) / 1000);
      if (falta >= 0) {
        numero.textContent = mmss(falta);
        estado.textContent = "";
        if (falta <= 300 && !jaAvisou) { jaAvisou = true; som("aviso"); painel.classList.add("pulsar"); }
      } else {
        numero.textContent = "0:00";
        numero.style.color = "var(--erro)";
        estado.textContent = `Passaste ${mmss(-falta)} do combinado.`;
      }
    }
    tique();
    temporizador = setInterval(tique, 1000);
  }

  function mostrarResultado(r) {
    const caixa = r.excedeu
      ? el("div", { class: "aviso" }, [
          el("strong", { texto: "Passaste do combinado." }),
          el("p", { style: "margin:6px 0 0" }, `Tinhas marcado ${Math.round(r.planeado / 60)} min e usaste ${Math.round(r.real / 60)}. Da próxima, tenta voltar à hora.`)
        ])
      : el("div", { class: "aviso bom" }, [
          el("strong", { texto: "Voltaste a tempo. Bem jogado." }),
          el("p", { style: "margin:6px 0 0" }, "Isto é dos mais difíceis que há — e tu conseguiste.")
        ]);
    raiz.insertBefore(caixa, raiz.children[1]);
  }

  desenhar();
  return () => { if (temporizador) clearInterval(temporizador); };
}
