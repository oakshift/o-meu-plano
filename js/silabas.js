// Sílabas e ritmo.
//
// Quem lê com esforço não precisa só de textos: precisa de trabalho direto
// nos padrões que fazem tropeçar (lh/nh, br/cr/pr, ão/ãe/õe, r travado).
//
// A entrada é rítmica de propósito. Bater a sílaba com a mão antes de a ler
// é consciência fonológica pela via do corpo — e numa casa onde há música
// isso é terreno conhecido, não mais um exercício de escola.

import { FAMILIAS } from "../data/palavras.js";
import { obter, alterar, hojeISO, marcarMissao } from "./store.js";
import { el, limpar, som, vibrar, cabecalho, baralhar, temTeclado, temToque } from "./ui.js";
import * as audio from "./audio.js";

const PALAVRAS_POR_SESSAO = 8;

function feitasPorFamilia(id) {
  return obter().silabas.sessoes.filter(s => s.familia === id).length;
}

function sugerirFamilia() {
  const min = Math.min(...FAMILIAS.map(f => feitasPorFamilia(f.id)));
  const candidatas = FAMILIAS.filter(f => feitasPorFamilia(f.id) === min);
  return candidatas[Math.floor(Math.random() * candidatas.length)];
}

export function render(raiz, ir) {
  let temporizador = null;
  const parar = () => { if (temporizador) { clearTimeout(temporizador); temporizador = null; } audio.pararDeFalar(); };
  // No computador o tambor é a barra de espaço.
  let aoTeclar = null;
  const ouvirTeclado = e => { if (aoTeclar) aoTeclar(e); };
  document.addEventListener("keydown", ouvirTeclado);

  function inicio() {
    parar();
    aoTeclar = null;
    limpar(raiz);
    const comoBater = !temTeclado() ? "Bate as sílabas com o dedo, como se fosse um tambor."
      : temToque() ? "Bate as sílabas com o dedo ou na barra de espaço, como se fosse um tambor."
      : "Bate as sílabas na barra de espaço, como se fosse um tambor.";
    raiz.appendChild(cabecalho("Sílabas e ritmo", `${comoBater} Depois lê a palavra.`, () => ir("casa")));

    const sugerida = sugerirFamilia();
    raiz.appendChild(el("div", { class: "painel" }, [
      el("div", { class: "rotulo", texto: "Hoje" }),
      el("h2", { texto: sugerida.nome, style: "margin:6px 0" }),
      el("p", { class: "ajuda", texto: sugerida.dica }),
      el("button", { class: "btn btn-grande btn-silabas", style: "margin-top:10px", onClick: () => sessao(sugerida) }, "Começar")
    ]));

    raiz.appendChild(el("button", { class: "btn btn-grande", onClick: escolher }, "Escolher outro grupo"));
  }

  function escolher() {
    parar();
    aoTeclar = null;
    limpar(raiz);
    raiz.appendChild(cabecalho("Escolhe um grupo", null, inicio));
    const grelha = el("div", { class: "missoes" });
    for (const f of FAMILIAS) {
      const n = feitasPorFamilia(f.id);
      grelha.appendChild(el("button", { class: "missao m-silabas", onClick: () => sessao(f) }, [
        el("div", { class: "icone", texto: "🥁" }),
        el("div", { class: "texto" }, [
          el("div", { class: "titulo", texto: f.nome }),
          el("div", { class: "detalhe", texto: n ? `treinado ${n}×` : "ainda não treinaste" })
        ])
      ]));
    }
    raiz.appendChild(grelha);
  }

  function sessao(familia) {
    const palavras = baralhar(familia.palavras).slice(0, PALAVRAS_POR_SESSAO);
    let indice = 0, certasRitmo = 0;

    const zona = el("div");
    limpar(raiz);
    raiz.appendChild(cabecalho(familia.nome, familia.dica, inicio));
    raiz.appendChild(zona);

    function proxima() {
      parar();
      if (indice >= palavras.length) return fim();
      const alvo = palavras[indice];
      let batidas = 0;

      limpar(zona);
      const contador = el("div", { class: "numero-medio centrado", texto: "0", style: "margin-top:8px" });
      const botao = el("button", { class: "batida" }, temTeclado() ? "Bate uma vez por sílaba — aqui ou no espaço" : "Bate uma vez por sílaba");
      zona.appendChild(el("div", { class: "painel" }, [
        el("div", { class: "rotulo centrado", texto: `${indice + 1} de ${palavras.length}` }),
        el("div", { class: "palavra-grande", texto: alvo.p }),
        botao,
        contador
      ]));

      botao.addEventListener("click", () => {
        batidas++;
        contador.textContent = String(batidas);
        som("toque"); vibrar(12);
        // A contagem fecha sozinha quando ele pára de bater.
        if (temporizador) clearTimeout(temporizador);
        temporizador = setTimeout(() => verificar(batidas), 1400);
      });
      // Se o botão tiver o foco (depois de um clique), o próprio browser já
      // transforma o espaço num clique — não contar duas vezes.
      aoTeclar = e => {
        if (e.key !== " " || e.target === botao) return;
        e.preventDefault();
        if (!e.repeat) botao.click();
      };

      function verificar(n) {
        aoTeclar = null;
        const certo = n === alvo.s.length;
        if (certo) { certasRitmo++; som("certo"); } else { som("errado"); }
        mostrarSilabas(certo, n);
      }

      function mostrarSilabas(certo, n) {
        limpar(zona);
        const tira = el("div", { class: "silabas-tira" }, alvo.s.map(s => el("div", { class: "silaba", texto: s })));
        zona.appendChild(el("div", { class: "painel" }, [
          el("div", { class: "palavra-grande", texto: alvo.p }),
          tira,
          el("p", {
            class: certo ? "" : "ajuda",
            style: certo ? "color:var(--tempo);font-weight:700;text-align:center" : "text-align:center",
            texto: certo ? `Certo: ${alvo.s.length} sílabas.` : `Bateste ${n}. São ${alvo.s.length}: ouve.`
          })
        ]));

        // Acende sílaba a sílaba, ao ritmo da leitura.
        let i = 0;
        function acender() {
          [...tira.children].forEach(c => c.classList.remove("acesa"));
          if (i < alvo.s.length) {
            tira.children[i].classList.add("acesa");
            if (audio.temVoz(alvo.s[i])) audio.falar(alvo.s[i], { velocidade: 0.8 });
            som("toque");
            i++;
            temporizador = setTimeout(acender, 700);
          } else {
            if (audio.temVoz(alvo.p)) audio.falar(alvo.p, { velocidade: 0.85 });
          }
        }
        temporizador = setTimeout(acender, 400);

        zona.appendChild(el("div", { class: "linha-botoes", style: "margin-top:12px" }, [
          audio.temVoz(alvo.p) ? el("button", { class: "btn", onClick: () => { parar(); audio.falar(alvo.p, { velocidade: 0.8 }); } }, "🔊  Ouvir") : null,
          el("button", { class: "btn btn-grande btn-silabas", onClick: () => { indice++; proxima(); } }, "Já li — seguinte")
        ]));
        // Só o Enter avança: o espaço podia ser uma batida a mais.
        aoTeclar = e => { if (e.key === "Enter") { e.preventDefault(); indice++; proxima(); } };
      }
    }

    function fim() {
      parar();
      aoTeclar = null;
      marcarMissao("silabas");
      alterar(s => {
        s.silabas.sessoes.push({ data: hojeISO(), familia: familia.id, total: palavras.length, certasRitmo });
      });
      som("fim");
      limpar(raiz);
      raiz.appendChild(cabecalho("Sílabas feitas ✅", null, null));
      raiz.appendChild(el("div", { class: "painel centrado" }, [
        el("div", { class: "rotulo", texto: "Ritmo certo em" }),
        el("div", { class: "numero-grande", texto: `${certasRitmo}/${palavras.length}` }),
        el("p", { class: "ajuda", texto: familia.nome })
      ]));
      raiz.appendChild(el("button", { class: "btn btn-grande btn-principal", onClick: () => ir("casa") }, "Voltar ao início"));
    }

    proxima();
  }

  inicio();
  return () => { parar(); document.removeEventListener("keydown", ouvirTeclado); };
}
