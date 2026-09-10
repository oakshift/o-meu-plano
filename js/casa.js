// O ecrã inicial: o que ele vê quando abre a app.

import { obter, diaAtual, missoesAtivas, missoesFeitasHoje, tudoFeitoHoje } from "./store.js";
import { el, som, minutosBonitos } from "./ui.js";
import * as tempo from "./tempo.js";

function saudacao() {
  const h = new Date().getHours();
  if (h < 12) return "Bom dia";
  if (h < 20) return "Boa tarde";
  return "Boa noite";
}

export function render(raiz, ir) {
  const s = obter();
  const dia = diaAtual();
  const ativas = missoesAtivas();
  const feitas = missoesFeitasHoje();
  const nome = s.perfil.nome;

  raiz.appendChild(el("div", { class: "topo" }, [
    el("div", {}, [
      el("h1", { class: "ola", texto: `${saudacao()}${nome ? ", " + nome : ""}` }),
      el("p", { class: "sub", texto: ativas.length === 0 ? "Hoje não há missões." : (tudoFeitoHoje() ? "Missões todas feitas. O dia é teu." : `${feitas} de ${ativas.length} ${ativas.length === 1 ? "missão feita" : "missões feitas"} hoje`) })
    ]),
    el("button", { class: "btn btn-fantasma", style: "min-height:44px;padding:8px 12px", onClick: () => ir("pais") }, "👤")
  ]));

  if (tudoFeitoHoje()) {
    raiz.appendChild(el("div", { class: "aviso bom" }, [
      el("strong", { texto: "Está tudo feito." }),
      el("p", { style: "margin:6px 0 0" }, "Podes treinar mais se te apetecer, mas não é preciso. Amanhã há mais.")
    ]));
  }

  const missoes = el("div", { class: "missoes" });

  if (s.config.missoes.leitura) {
    missoes.appendChild(cartao("m-leitura", "📖", "Leitura", dia.leitura ? "Feita hoje ✓" : "Cerca de 5 minutos", dia.leitura, () => ir("leitura")));
  }
  if (s.config.missoes.matematica) {
    missoes.appendChild(cartao("m-matematica", "🔢", "Matemática", dia.matematica ? "Feita hoje ✓" : "Cerca de 5 minutos", dia.matematica, () => ir("matematica")));
  }
  if (s.config.missoes.silabas) {
    missoes.appendChild(cartao("m-silabas", "🥁", "Sílabas e ritmo", dia.silabas ? "Feita hoje ✓" : "Cerca de 4 minutos", dia.silabas, () => ir("silabas")));
  }

  const restante = tempo.restanteHojeSeg();
  const ativo = tempo.blocoAtivo();
  missoes.appendChild(cartao(
    "m-tempo larga", ativo ? "⏳" : "📺", "O meu tempo",
    ativo ? "Tens um tempo a contar — toca aqui" : (restante > 0 ? `Ainda tens ${minutosBonitos(restante)} hoje` : "O tempo de hoje acabou"),
    false, () => ir("tempo")
  ));

  raiz.appendChild(missoes);

  raiz.appendChild(el("button", {
    class: "btn btn-grande", style: "margin-top:16px", onClick: () => ir("progresso")
  }, "📈  O meu progresso"));
}

function cartao(classe, icone, titulo, detalhe, feita, aoTocar) {
  return el("button", { class: `missao ${classe}${feita ? " feita" : ""}`, onClick: () => { som("toque"); aoTocar(); } }, [
    el("div", { class: "icone", texto: icone }),
    el("div", { class: "texto" }, [
      el("div", { class: "titulo", texto: titulo }),
      el("div", { class: "detalhe", texto: detalhe })
    ]),
    el("div", { class: "marca", texto: feita ? "✅" : "›" })
  ]);
}
