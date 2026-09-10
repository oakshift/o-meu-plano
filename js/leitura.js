// Treino de fluência por leitura repetida.
//
// O ciclo é sempre o mesmo: ouvir um modelo fluente → ler → ler outra vez →
// ler uma terceira vez, sempre o MESMO texto. O que sobe não é a nota: é a
// velocidade dele contra ele próprio. É o método com melhor evidência para
// leitores que descodificam com esforço, e tem a vantagem de a criança ver
// o progresso dentro da própria sessão, em cinco minutos.

import { TEXTOS, contarPalavras } from "../data/textos.js";
import { HISTORIAS_AAZ, AAZ_FONTE } from "../data/aaz.js";
import { obter, alterar, hojeISO, marcarMissao } from "./store.js";
import { el, limpar, mmss, som, vibrar, cabecalho, escolher } from "./ui.js";
import * as audio from "./audio.js";

const TENTATIVAS = 3;

export function ppm(palavras, segundos) {
  if (!segundos || segundos < 1) return 0;
  return Math.round(palavras / (segundos / 60));
}

export function melhorPPM(textoId) {
  const s = obter().leitura.sessoes.filter(x => x.textoId === textoId);
  let melhor = 0;
  for (const ses of s) for (const t of ses.tentativas || []) melhor = Math.max(melhor, t.ppm);
  return melhor;
}

export function melhorPPMGeral() {
  let melhor = 0;
  for (const ses of obter().leitura.sessoes) for (const t of ses.tentativas || []) melhor = Math.max(melhor, t.ppm);
  return melhor;
}

function textosDisponiveis() {
  const s = obter();
  const nivel = s.config.nivelLeitura;
  const proprios = s.textosProprios.map(t => ({ ...t, fonte: "proprio", nivel: t.nivel || nivel }));
  const daApp = TEXTOS.filter(t => t.nivel === nivel).map(t => ({ ...t, fonte: "app" }));
  return [...daApp, ...proprios];
}

function contarLidos(textoId) {
  return obter().leitura.sessoes.filter(x => x.textoId === textoId).length;
}

function sugerirTexto() {
  const lista = textosDisponiveis();
  if (!lista.length) return null;
  const min = Math.min(...lista.map(t => contarLidos(t.id)));
  return escolher(lista.filter(t => contarLidos(t.id) === min));
}

// ---------- ecrã principal ----------

export function render(raiz, ir) {
  let limpezaAtual = null;
  const trocar = fn => { if (limpezaAtual) limpezaAtual(); limpezaAtual = fn || null; };

  function menu() {
    trocar(null);
    limpar(raiz);
    raiz.appendChild(cabecalho("Leitura", "Cinco minutos. Lês o mesmo texto três vezes e tentas bater-te a ti próprio.", () => ir("casa")));

    const sugerido = sugerirTexto();
    if (sugerido) {
      const recorde = melhorPPM(sugerido.id);
      raiz.appendChild(el("div", { class: "painel" }, [
        el("div", { class: "rotulo", texto: "Texto de hoje" }),
        el("h2", { texto: sugerido.titulo, style: "margin:6px 0" }),
        el("p", { class: "ajuda", texto: `${contarPalavras(sugerido.texto)} palavras${recorde ? ` · o teu recorde aqui: ${recorde} palavras por minuto` : ""}` }),
        el("button", { class: "btn btn-grande btn-leitura", style: "margin-top:10px", onClick: () => sessao(sugerido) }, "Começar")
      ]));
    }

    raiz.appendChild(el("button", {
      class: "btn btn-grande", style: "margin-bottom:14px",
      onClick: escolherOutro
    }, "Escolher outro texto"));

    raiz.appendChild(el("button", {
      class: "btn btn-grande", onClick: menuAaz
    }, "Histórias AaZ · ler no site"));
  }

  function escolherOutro() {
    trocar(null);
    limpar(raiz);
    raiz.appendChild(cabecalho("Escolhe um texto", null, menu));
    const lista = textosDisponiveis();
    if (!lista.length) {
      raiz.appendChild(el("div", { class: "aviso" }, "Ainda não há textos para este nível. Os pais podem acrescentar textos no painel deles."));
      return;
    }
    const grelha = el("div", { class: "missoes" });
    for (const t of lista) {
      const recorde = melhorPPM(t.id);
      const vezes = contarLidos(t.id);
      grelha.appendChild(el("button", { class: "missao m-leitura", onClick: () => sessao(t) }, [
        el("div", { class: "icone", texto: t.fonte === "proprio" ? "✏️" : "📖" }),
        el("div", { class: "texto" }, [
          el("div", { class: "titulo", texto: t.titulo }),
          el("div", { class: "detalhe", texto: `${contarPalavras(t.texto)} palavras${recorde ? ` · recorde ${recorde} ppm` : ""}${vezes ? ` · lido ${vezes}×` : ""}` })
        ])
      ]));
    }
    raiz.appendChild(grelha);
  }

  function menuAaz() {
    trocar(null);
    limpar(raiz);
    raiz.appendChild(cabecalho("Histórias AaZ", "Histórias de escritores portugueses. Abres a história no site, lês, e voltas aqui.", menu));
    raiz.appendChild(el("div", { class: "aviso info" }, [
      el("p", { style: "margin:0" }, "Muitas destas páginas têm a história contada em vídeo. Ouve primeiro, depois lê tu.")
    ]));
    const grelha = el("div", { class: "missoes" });
    for (const h of HISTORIAS_AAZ) {
      const recorde = melhorPPM("aaz-" + h.slug);
      grelha.appendChild(el("button", { class: "missao m-leitura", onClick: () => sessaoAaz(h) }, [
        el("div", { class: "icone", texto: "🔗" }),
        el("div", { class: "texto" }, [
          el("div", { class: "titulo", texto: h.titulo }),
          el("div", { class: "detalhe", texto: `${h.autor ? h.autor + " · " : ""}${h.palavras} palavras${recorde ? ` · recorde ${recorde} ppm` : ""}` })
        ])
      ]));
    }
    raiz.appendChild(grelha);
    raiz.appendChild(el("p", { class: "ajuda", style: "margin-top:14px" }, [
      "Textos de ", el("a", { href: AAZ_FONTE, target: "_blank", rel: "noopener" }, "Histórias AaZ"),
      " — Iniciativa Educação. A app não guarda cópia dos textos."
    ]));
  }

  // ---------- sessão de leitura repetida (texto dentro da app) ----------

  function sessao(texto) {
    const palavras = contarPalavras(texto.texto);
    const tentativas = [];
    let tentativa = 0;

    function passoOuvir() {
      trocar(null);
      limpar(raiz);
      raiz.appendChild(cabecalho(texto.titulo, "Primeiro ouve. Segue com os olhos, sem ler em voz alta.", menu));

      const corpo = el("div", { class: "painel" }, [el("p", { class: "texto-leitura", texto: texto.texto })]);
      raiz.appendChild(corpo);

      const btnOuvir = el("button", { class: "btn btn-grande btn-leitura" }, "▶︎  Ouvir a história");
      const btnSaltar = el("button", { class: "btn btn-grande", style: "margin-top:10px" }, "Já ouvi — quero ler");
      let aFalar = false;

      btnOuvir.addEventListener("click", () => {
        if (aFalar) { audio.pararDeFalar(); aFalar = false; btnOuvir.textContent = "▶︎  Ouvir a história"; return; }
        aFalar = true; btnOuvir.textContent = "◼︎  Parar";
        audio.falar(texto.texto, { aoTerminar: () => { aFalar = false; btnOuvir.textContent = "▶︎  Ouvir outra vez"; } });
      });
      btnSaltar.addEventListener("click", () => { audio.pararDeFalar(); passoLer(); });

      if (audio.temVoz()) raiz.appendChild(btnOuvir);
      raiz.appendChild(btnSaltar);
      trocar(() => audio.pararDeFalar());
    }

    function passoLer() {
      trocar(null);
      limpar(raiz);
      tentativa++;
      const ordinal = ["primeira", "segunda", "terceira"][tentativa - 1] || `${tentativa}.ª`;
      raiz.appendChild(cabecalho(`Leitura ${ordinal}`, `Lê em voz alta, do princípio ao fim. Sem pressa de errar.`, menu));

      if (tentativas.length) {
        const ult = tentativas[tentativas.length - 1];
        raiz.appendChild(el("div", { class: "aviso info" }, `Da última vez: ${ult.ppm} palavras por minuto. Tenta bater isso.`));
      }

      raiz.appendChild(el("div", { class: "painel" }, [el("p", { class: "texto-leitura", texto: texto.texto })]));

      const relogio = el("div", { class: "numero-medio centrado", texto: "0:00", style: "margin:10px 0" });
      const btn = el("button", { class: "btn btn-grande btn-leitura" }, "Começar a ler");
      raiz.appendChild(relogio);
      raiz.appendChild(btn);

      let inicio = null, cron = null, gravando = false;

      btn.addEventListener("click", async () => {
        if (!inicio) {
          inicio = Date.now();
          som("toque");
          btn.textContent = "Acabei de ler";
          btn.className = "btn btn-grande btn-principal";
          cron = setInterval(() => { relogio.textContent = mmss((Date.now() - inicio) / 1000); }, 200);
          if (audio.podeGravar()) {
            try { await audio.comecarAGravar(); gravando = true; } catch (e) { /* segue sem gravar */ }
          }
        } else {
          const segundos = (Date.now() - inicio) / 1000;
          clearInterval(cron);
          if (gravando) {
            const blob = await audio.pararDeGravar();
            if (blob) await audio.guardarGravacao(blob, { textoId: texto.id, titulo: texto.titulo, tentativa, ppm: ppm(palavras, segundos) });
          }
          som("fim"); vibrar(25);
          tentativas.push({ ppm: ppm(palavras, segundos), segundos: Math.round(segundos), palavras });
          passoResultado();
        }
      });

      trocar(() => { if (cron) clearInterval(cron); if (gravando) audio.pararDeGravar(); });
    }

    function passoResultado() {
      trocar(null);
      limpar(raiz);
      const atual = tentativas[tentativas.length - 1];
      const anterior = tentativas.length > 1 ? tentativas[tentativas.length - 2] : null;
      const recordeAntigo = melhorPPM(texto.id);
      const bateuRecorde = atual.ppm > recordeAntigo && recordeAntigo > 0;

      raiz.appendChild(cabecalho("Resultado", null, menu));
      raiz.appendChild(el("div", { class: "painel centrado" }, [
        el("div", { class: "rotulo", texto: "Palavras por minuto" }),
        el("div", { class: "numero-grande", texto: String(atual.ppm) }),
        anterior
          ? el("p", {
              class: atual.ppm > anterior.ppm ? "" : "ajuda",
              style: atual.ppm > anterior.ppm ? "color:var(--tempo);font-weight:700;margin-top:8px" : "margin-top:8px"
            }, atual.ppm > anterior.ppm
                ? `Subiste ${atual.ppm - anterior.ppm} desde a leitura anterior.`
                : "Desta vez foi parecido. O corpo também se cansa — não faz mal.")
          : el("p", { class: "ajuda", style: "margin-top:8px" }, "Este é o teu ponto de partida neste texto."),
        bateuRecorde ? el("div", { class: "recorde", style: "margin-top:12px" }, "🏆 Novo recorde neste texto!") : null
      ]));

      if (tentativas.length < TENTATIVAS) {
        raiz.appendChild(el("button", { class: "btn btn-grande btn-leitura", onClick: passoLer }, `Ler outra vez (${tentativas.length + 1} de ${TENTATIVAS})`));
        raiz.appendChild(el("button", { class: "btn btn-grande btn-fantasma", style: "margin-top:8px", onClick: passoPerguntas }, "Chega por hoje"));
      } else {
        raiz.appendChild(el("button", { class: "btn btn-grande btn-principal", onClick: passoPerguntas }, "Continuar"));
      }
    }

    function passoPerguntas() {
      const perguntas = texto.perguntas || [];
      if (!perguntas.length) return terminar({ certas: 0, total: 0 });

      trocar(null);
      limpar(raiz);
      raiz.appendChild(cabecalho("Percebeste a história?", "Sem espreitar. Se não souberes, escolhe o que te parecer.", menu));

      let indice = 0, certas = 0;
      const zona = el("div");
      raiz.appendChild(zona);

      function pergunta() {
        limpar(zona);
        if (indice >= perguntas.length) return terminar({ certas, total: perguntas.length });
        const q = perguntas[indice];
        zona.appendChild(el("div", { class: "painel" }, [
          el("div", { class: "rotulo", texto: `Pergunta ${indice + 1} de ${perguntas.length}` }),
          el("h2", { texto: q.p, style: "margin-top:8px" })
        ]));
        const opcoes = el("div", { class: "pilha" });
        q.opcoes.forEach((o, i) => {
          const b = el("button", { class: "btn btn-grande" }, o);
          b.addEventListener("click", () => {
            const acertou = i === q.correta;
            if (acertou) { certas++; som("certo"); b.classList.add("btn-tempo"); }
            else {
              som("errado"); b.style.borderColor = "var(--erro)";
              [...opcoes.children][q.correta].classList.add("btn-tempo");
            }
            [...opcoes.children].forEach(c => c.disabled = true);
            setTimeout(() => { indice++; pergunta(); }, acertou ? 550 : 1500);
          });
          opcoes.appendChild(b);
        });
        zona.appendChild(opcoes);
      }
      pergunta();
    }

    function terminar(compreensao) {
      alterar(s => {
        s.leitura.sessoes.push({
          data: hojeISO(), textoId: texto.id, titulo: texto.titulo,
          fonte: texto.fonte || "app", tentativas, compreensao
        });
      });
      marcarMissao("leitura");
      trocar(null);
      limpar(raiz);
      som("fim");

      const melhor = Math.max(...tentativas.map(t => t.ppm));
      const primeira = tentativas[0].ppm;
      raiz.appendChild(cabecalho("Missão de leitura feita ✅", null, null));
      raiz.appendChild(el("div", { class: "painel centrado" }, [
        el("div", { class: "rotulo", texto: "O teu melhor de hoje" }),
        el("div", { class: "numero-grande", texto: String(melhor) }),
        el("p", { class: "ajuda", texto: "palavras por minuto" }),
        tentativas.length > 1 && melhor > primeira
          ? el("p", { style: "color:var(--tempo);font-weight:700" }, `Começaste em ${primeira} e acabaste em ${melhor}. Isso foi hoje, em cinco minutos.`)
          : null,
        compreensao.total
          ? el("p", { class: "ajuda", texto: `Perguntas: ${compreensao.certas} de ${compreensao.total} certas.` })
          : null
      ]));
      raiz.appendChild(el("button", { class: "btn btn-grande btn-principal", onClick: () => ir("casa") }, "Voltar ao início"));
    }

    passoOuvir();
  }

  // ---------- sessão AaZ (texto lido no site original) ----------

  function sessaoAaz(h) {
    trocar(null);
    limpar(raiz);
    const id = "aaz-" + h.slug;
    raiz.appendChild(cabecalho(h.titulo, h.autor || null, menuAaz));
    raiz.appendChild(el("div", { class: "painel" }, [
      el("p", {}, "1. Abre a história e ouve o vídeo, se houver."),
      el("p", {}, "2. Volta aqui e carrega em Começar."),
      el("p", { style: "margin-bottom:0" }, "3. Lê em voz alta no site. Quando acabares, volta e carrega em Acabei.")
    ]));
    raiz.appendChild(el("a", { class: "btn btn-grande", href: h.url, target: "_blank", rel: "noopener", style: "margin-bottom:12px" }, "Abrir a história ↗"));

    const relogio = el("div", { class: "numero-medio centrado", texto: "0:00", style: "margin:10px 0" });
    const btn = el("button", { class: "btn btn-grande btn-leitura" }, "Começar");
    raiz.appendChild(relogio);
    raiz.appendChild(btn);

    // O cronómetro conta pelo relógio real: ele vai sair da app para ler no
    // site e o Safari suspende a página enquanto isso acontece.
    let inicio = null, cron = null;
    btn.addEventListener("click", () => {
      if (!inicio) {
        inicio = Date.now(); som("toque");
        btn.textContent = "Acabei de ler";
        btn.className = "btn btn-grande btn-principal";
        cron = setInterval(() => { relogio.textContent = mmss((Date.now() - inicio) / 1000); }, 500);
      } else {
        clearInterval(cron);
        const segundos = (Date.now() - inicio) / 1000;
        const valor = ppm(h.palavras, segundos);
        const recordeAntigo = melhorPPM(id);
        alterar(s => {
          s.leitura.sessoes.push({
            data: hojeISO(), textoId: id, titulo: h.titulo, fonte: "aaz",
            tentativas: [{ ppm: valor, segundos: Math.round(segundos), palavras: h.palavras }],
            compreensao: { certas: 0, total: 0 }
          });
        });
        marcarMissao("leitura");
        som("fim");
        limpar(raiz);
        raiz.appendChild(cabecalho("Missão de leitura feita ✅", null, null));
        raiz.appendChild(el("div", { class: "painel centrado" }, [
          el("div", { class: "rotulo", texto: "Palavras por minuto" }),
          el("div", { class: "numero-grande", texto: String(valor) }),
          valor > recordeAntigo && recordeAntigo > 0 ? el("div", { class: "recorde", style: "margin-top:12px" }, "🏆 Novo recorde!") : null
        ]));
        raiz.appendChild(el("button", { class: "btn btn-grande btn-principal", onClick: () => ir("casa") }, "Voltar ao início"));
      }
    });
    trocar(() => { if (cron) clearInterval(cron); });
  }

  menu();
  return () => trocar(null);
}
