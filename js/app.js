import { obter, alterar, hojeISO } from "./store.js";
import { el, limpar, som } from "./ui.js";
import * as audio from "./audio.js";
import * as leitura from "./leitura.js";
import * as matematica from "./matematica.js";
import * as silabas from "./silabas.js";
import * as tempo from "./tempo.js";
import * as progresso from "./progresso.js";
import * as pais from "./pais.js";
import * as casa from "./casa.js";

const raiz = document.getElementById("app");
let limpezaEcra = null;
let ecraAtual = null;

function ir(nome) {
  // Enquanto não houver perfil, "casa" ainda não faz sentido: volta ao início.
  if (nome === "casa" && !obter().perfil.criadoEm) { boasVindas(); return; }
  ecraAtual = nome;
  if (limpezaEcra) { limpezaEcra(); limpezaEcra = null; }
  limpar(raiz);
  raiz.className = "ecra";
  // reinicia a animação
  void raiz.offsetWidth;
  const ecras = {
    casa: casa.render, leitura: leitura.render, matematica: matematica.render,
    silabas: silabas.render, tempo: tempo.render,
    progresso: progresso.render, pais: pais.render
  };
  const fn = ecras[nome] || casa.render;
  limpezaEcra = fn(raiz, ir) || null;
  window.scrollTo(0, 0);
}

// ---------- primeira utilização ----------

function boasVindas() {
  limpar(raiz);
  const campo = el("input", { type: "text", placeholder: "O teu nome", autocomplete: "off" });
  raiz.appendChild(el("div", { class: "painel", style: "margin-top:40px" }, [
    el("h1", { texto: "Olá!" }),
    el("p", {}, "Isto é o teu plano. Todos os dias tens duas ou três missões curtas — e o teu tempo de ecrã para gerires como quiseres."),
    el("div", { class: "campo", style: "margin-top:20px" }, [el("label", { texto: "Como te chamas?" }), campo]),
    el("button", {
      class: "btn btn-grande btn-principal",
      onClick: () => {
        alterar(s => { s.perfil.nome = campo.value.trim(); s.perfil.criadoEm = hojeISO(); });
        som("fim");
        ir("casa");
      }
    }, "Começar")
  ]));
  raiz.appendChild(el("button", {
    class: "btn", style: "width:100%;margin-top:18px", onClick: () => ir("pais")
  }, "👤  Sou o pai ou a mãe"));
  raiz.appendChild(el("p", { class: "ajuda", style: "text-align:center;margin-top:10px" }, "O painel dos pais abre com o PIN 2468."));
}

// ---------- arranque ----------

audio.prepararVozes();
pais.aplicarPreferencias();

// O iPad suspende a página quando ele sai para ver bonecos: ao voltar,
// redesenha para os números do tempo ficarem certos.
document.addEventListener("visibilitychange", () => {
  if (!document.hidden && ecraAtual === "casa") ir("casa");
});

if (!obter().perfil.criadoEm) boasVindas();
else ir("casa");

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch(() => { /* offline é um extra, não um requisito */ });
  });
}
