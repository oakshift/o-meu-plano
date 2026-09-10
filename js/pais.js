// Painel dos pais.
//
// Inclui a medição semanal "a sério": um texto novo, um minuto a contar, o
// adulto toca nas palavras lidas com erro e no ponto onde a criança chegou.
// É o procedimento habitual de medição de fluência, e é o único número
// destas contas que serve para acompanhar evolução ao longo de meses — as
// leituras repetidas do dia a dia medem esforço, não nível.

import { TEXTOS, contarPalavras } from "../data/textos.js";
import { HISTORIAS_AAZ } from "../data/aaz.js";
import { obter, alterar, hojeISO, ultimosDias, exportarJSON, importarJSON, reiniciarTudo, missoesAtivas } from "./store.js";
import { el, limpar, mmss, som, cabecalho, confirmar, baralhar } from "./ui.js";
import { COMPETENCIAS, progressoCompetencia, dominada } from "./matematica.js";
import { melhorPPMGeral } from "./leitura.js";
import * as audio from "./audio.js";

// Orientação, não diagnóstico: valores de referência aproximados de palavras
// corretas por minuto ao longo do 3.º ano, para leitura em voz alta.
const REFERENCIA_3ANO = { inicio: 65, meio: 85, fim: 100 };

export function render(raiz, ir) {
  let limpeza = null;
  const trocar = fn => { if (limpeza) limpeza(); limpeza = fn || null; };

  function pedirPin() {
    trocar(null);
    limpar(raiz);
    raiz.appendChild(cabecalho("Painel dos pais", null, () => ir("casa")));
    const campo = el("input", { type: "password", inputmode: "numeric", placeholder: "PIN", maxlength: "6" });
    const erro = el("p", { class: "ajuda", style: "color:var(--erro)" });
    raiz.appendChild(el("div", { class: "painel" }, [
      el("div", { class: "campo" }, [el("label", { texto: "Introduza o PIN" }), campo]),
      erro,
      el("button", {
        class: "btn btn-grande btn-principal",
        onClick: () => {
          if (campo.value === obter().config.pin) menu();
          else { erro.textContent = "PIN errado."; campo.value = ""; }
        }
      }, "Entrar")
    ]));
    campo.addEventListener("keydown", e => { if (e.key === "Enter") { if (campo.value === obter().config.pin) menu(); else erro.textContent = "PIN errado."; } });
    setTimeout(() => campo.focus(), 100);
  }

  function menu() {
    trocar(null);
    limpar(raiz);
    raiz.appendChild(cabecalho("Painel dos pais", null, () => ir("casa")));
    raiz.appendChild(resumo());
    raiz.appendChild(sinais());
    const opcoes = [
      ["📏", "Avaliação da semana", "Medir palavras corretas por minuto", avaliacao],
      ["📈", "Relatório detalhado", "Leitura, matemática e tempo de ecrã", relatorio],
      ["🎧", "Ouvir as gravações", "As leituras dele, guardadas no iPad", gravacoes],
      ["✏️", "Textos", "Acrescentar textos vossos", textos],
      ["⚙️", "Definições", "Tempo de ecrã, nível, missões, PIN", definicoes]
    ];
    const grelha = el("div", { class: "missoes" });
    for (const [icone, titulo, detalhe, fn] of opcoes) {
      grelha.appendChild(el("button", { class: "missao", onClick: fn }, [
        el("div", { class: "icone", style: "background:var(--superficie-2)", texto: icone }),
        el("div", { class: "texto" }, [
          el("div", { class: "titulo", texto: titulo }),
          el("div", { class: "detalhe", texto: detalhe })
        ])
      ]));
    }
    raiz.appendChild(grelha);
  }

  // ---------- resumo ----------

  function resumo() {
    const s = obter();
    const dias = ultimosDias(7);
    const ativas = missoesAtivas();
    const completos = dias.filter(d => { const x = s.dias[d] || {}; return ativas.length && ativas.every(m => x[m]); }).length;
    const leiturasSemana = s.leitura.sessoes.filter(x => dias.includes(x.data)).length;
    const matSemana = s.math.sessoes.filter(x => dias.includes(x.data)).length;
    const tempoSemana = dias.reduce((t, d) => t + ((s.tempo.dias[d] || {}).gastoSeg || 0), 0);
    const ultimaAval = s.leitura.avaliacoes[s.leitura.avaliacoes.length - 1];

    return el("div", { class: "painel" }, [
      el("div", { class: "rotulo", texto: "Últimos 7 dias" }),
      el("div", { class: "linha", style: "margin-top:12px;gap:24px" }, [
        bloco(String(completos), "dias completos"),
        bloco(String(leiturasSemana), "leituras"),
        bloco(String(matSemana), "treinos de contas"),
        bloco(Math.round(tempoSemana / 60) + "m", "de ecrã")
      ]),
      ultimaAval
        ? el("p", { class: "ajuda", style: "margin-top:14px" }, `Última medição oficial: ${ultimaAval.ppmCorreto} palavras corretas por minuto (${ultimaAval.data}).`)
        : el("p", { class: "ajuda", style: "margin-top:14px" }, "Ainda não há nenhuma medição oficial. Faça a primeira esta semana — é o ponto de partida.")
    ]);
  }

  function bloco(valor, rotulo) {
    return el("div", {}, [
      el("div", { style: "font-size:30px;font-weight:800", texto: valor }),
      el("div", { class: "ajuda", texto: rotulo })
    ]);
  }

  // ---------- sinais ----------

  function sinais() {
    const s = obter();
    const caixa = el("div");
    const avals = s.leitura.avaliacoes;

    if (avals.length >= 2) {
      const ultimas = avals.slice(-3);
      const media = Math.round(ultimas.reduce((t, a) => t + a.ppmCorreto, 0) / ultimas.length);
      const primeira = avals[0].ppmCorreto;
      const delta = ultimas[ultimas.length - 1].ppmCorreto - primeira;
      if (media < REFERENCIA_3ANO.inicio) {
        caixa.appendChild(el("div", { class: "aviso" }, [
          el("strong", { texto: "Fluência abaixo do esperado para o 3.º ano." }),
          el("p", { style: "margin:6px 0 0" }, `Média das últimas medições: ${media} palavras corretas por minuto (referência aproximada no início do 3.º ano: ${REFERENCIA_3ANO.inicio}). Se isto se mantiver ao longo de alguns meses apesar do treino diário, vale a pena falar com a professora sobre uma avaliação de leitura.`)
        ]));
      } else if (delta > 0) {
        caixa.appendChild(el("div", { class: "aviso bom" }, [
          el("strong", { texto: `Subiu ${delta} palavras por minuto desde a primeira medição.` }),
          el("p", { style: "margin:6px 0 0" }, "É o número que interessa. Mostre-lhe o gráfico.")
        ]));
      }
    }

    // Erro persistente numa competência não se resolve treinando mais depressa.
    for (const c of COMPETENCIAS) {
      const p = progressoCompetencia(c);
      if (p.vistos >= 8 && p.precisao !== null && p.precisao < 55) {
        caixa.appendChild(el("div", { class: "aviso" }, [
          el("strong", { texto: `"${c.nome}" está a falhar de forma persistente (${p.precisao}% de acerto).` }),
          el("p", { style: "margin:6px 0 4px" }, "Isto não parece falta de treino, parece o conceito não estar montado. Treinar mais rápido não resolve — convém rever com ele."),
          el("a", { href: c.khan, target: "_blank", rel: "noopener", class: "btn", style: "margin-top:6px" }, "Ver na Khan Academy ↗")
        ]));
        break;
      }
    }
    return caixa;
  }

  // ---------- avaliação semanal ----------

  function avaliacao() {
    trocar(null);
    limpar(raiz);
    raiz.appendChild(cabecalho("Avaliação da semana", "Um texto que ele não treinou. Um minuto. Sente-se ao lado dele.", menu));

    const jaUsados = new Set(obter().leitura.avaliacoes.map(a => a.textoId));
    const candidatos = TEXTOS.filter(t => t.nivel === obter().config.nivelLeitura && !jaUsados.has(t.id));
    const lista = candidatos.length ? candidatos : TEXTOS.filter(t => t.nivel === obter().config.nivelLeitura);

    raiz.appendChild(el("div", { class: "aviso info" }, [
      el("p", { style: "margin:0 0 6px" }, "Como funciona:"),
      el("p", { style: "margin:0" }, "1. Ele lê em voz alta. 2. Toque em cada palavra que ele leia mal, troque ou salte. 3. Ao fim de um minuto, toque na última palavra que ele leu.")
    ]));

    const grelha = el("div", { class: "missoes" });
    for (const t of baralhar(lista).slice(0, 6)) {
      grelha.appendChild(el("button", { class: "missao m-leitura", onClick: () => correr(t) }, [
        el("div", { class: "icone", texto: "📏" }),
        el("div", { class: "texto" }, [
          el("div", { class: "titulo", texto: t.titulo }),
          el("div", { class: "detalhe", texto: `${contarPalavras(t.texto)} palavras${jaUsados.has(t.id) ? " · já usado antes" : ""}` })
        ])
      ]));
    }
    raiz.appendChild(grelha);
  }

  function correr(texto) {
    trocar(null);
    limpar(raiz);
    const palavras = texto.texto.split(/(\s+)/);
    const erros = new Set();
    let fase = "parado"; // parado → a-ler → marcar-fim → feito
    let inicio = null, cron = null, ultimaPalavra = null;

    raiz.appendChild(cabecalho(texto.titulo, null, menu));
    const relogio = el("div", { class: "numero-medio centrado", texto: "1:00" });
    const instrucao = el("p", { class: "ajuda centrado" }, "Carregue em Começar quando ele iniciar a leitura.");
    raiz.appendChild(el("div", { class: "painel" }, [relogio, instrucao]));

    const corpo = el("p", { class: "texto-leitura" });
    let indicePalavra = 0;
    for (const parte of palavras) {
      if (/^\s+$/.test(parte)) { corpo.appendChild(document.createTextNode(parte)); continue; }
      const i = indicePalavra++;
      const span = el("span", { class: "palavra", texto: parte });
      span.addEventListener("click", () => {
        if (fase === "a-ler") {
          if (erros.has(i)) { erros.delete(i); span.classList.remove("errada"); }
          else { erros.add(i); span.classList.add("errada"); som("toque"); }
        } else if (fase === "marcar-fim") {
          ultimaPalavra = i;
          concluir();
        }
      });
      corpo.appendChild(span);
    }
    raiz.appendChild(el("div", { class: "painel" }, [corpo]));

    const botao = el("button", { class: "btn btn-grande btn-principal" }, "Começar o minuto");
    raiz.appendChild(botao);

    botao.addEventListener("click", () => {
      if (fase === "parado") {
        fase = "a-ler"; inicio = Date.now(); som("toque");
        botao.textContent = "Parar agora";
        instrucao.textContent = "Toque nas palavras lidas com erro.";
        cron = setInterval(() => {
          const falta = 60 - (Date.now() - inicio) / 1000;
          relogio.textContent = mmss(Math.max(0, falta));
          if (falta <= 0) { clearInterval(cron); cron = null; pedirFim(); }
        }, 200);
      } else if (fase === "a-ler") {
        if (cron) clearInterval(cron);
        pedirFim();
      }
    });

    function pedirFim() {
      fase = "marcar-fim";
      som("aviso");
      const decorrido = Math.min(60, (Date.now() - inicio) / 1000);
      botao.style.display = "none";
      instrucao.innerHTML = "<strong>Toque agora na última palavra que ele leu.</strong>";
      relogio.textContent = mmss(decorrido);
      raiz.scrollIntoView({ behavior: "smooth" });
      correr.decorrido = decorrido;
    }

    function concluir() {
      fase = "feito";
      const decorrido = correr.decorrido || 60;
      const lidas = ultimaPalavra + 1;
      const errosDentro = [...erros].filter(i => i <= ultimaPalavra).length;
      const corretas = Math.max(0, lidas - errosDentro);
      const ppmCorreto = Math.round(corretas / (decorrido / 60));
      const precisao = lidas ? Math.round((corretas / lidas) * 100) : 0;

      alterar(s => {
        s.leitura.avaliacoes.push({
          data: hojeISO(), textoId: texto.id, titulo: texto.titulo,
          palavrasLidas: lidas, erros: errosDentro, segundos: Math.round(decorrido),
          ppmCorreto, precisao
        });
      });
      som("fim");

      limpar(raiz);
      raiz.appendChild(cabecalho("Medição feita", null, menu));
      const anteriores = obter().leitura.avaliacoes;
      const anterior = anteriores.length > 1 ? anteriores[anteriores.length - 2] : null;
      raiz.appendChild(el("div", { class: "painel centrado" }, [
        el("div", { class: "rotulo", texto: "Palavras corretas por minuto" }),
        el("div", { class: "numero-grande", texto: String(ppmCorreto) }),
        el("p", { class: "ajuda", texto: `${lidas} palavras lidas · ${errosDentro} erros · ${precisao}% de precisão` }),
        anterior
          ? el("p", { style: `font-weight:700;color:${ppmCorreto >= anterior.ppmCorreto ? "var(--tempo)" : "var(--texto-suave)"}` },
              ppmCorreto >= anterior.ppmCorreto
                ? `+${ppmCorreto - anterior.ppmCorreto} desde a medição anterior.`
                : `${ppmCorreto - anterior.ppmCorreto} face à medição anterior — uma semana isolada diz pouco.`)
          : null
      ]));

      if (precisao < 90) {
        raiz.appendChild(el("div", { class: "aviso" }, [
          el("strong", { texto: "Precisão abaixo de 90%." }),
          el("p", { style: "margin:6px 0 0" }, "Com esta taxa de erro o texto está difícil de mais para treinar sozinho. Convém descer um nível nas Definições — ler com esforço constante não constrói fluência, constrói aversão.")
        ]));
      }
      raiz.appendChild(el("button", { class: "btn btn-grande btn-principal", onClick: menu }, "Voltar"));
    }

    trocar(() => { if (cron) clearInterval(cron); });
  }

  // ---------- relatório ----------

  function relatorio() {
    trocar(null);
    limpar(raiz);
    const s = obter();
    raiz.appendChild(cabecalho("Relatório", null, menu));

    // leitura — medições oficiais
    const avals = s.leitura.avaliacoes;
    if (avals.length) {
      const topo = Math.max(...avals.map(a => a.ppmCorreto), 10);
      raiz.appendChild(el("div", { class: "painel" }, [
        el("div", { class: "rotulo", texto: "Medições oficiais (palavras corretas por minuto)" }),
        el("div", { class: "grafico" }, avals.slice(-10).map(a => el("div", { class: "col" }, [
          el("div", { class: "val", style: `height:${Math.round((a.ppmCorreto / topo) * 100)}%` }),
          el("div", { class: "dia", texto: String(a.ppmCorreto) })
        ]))),
        el("p", { class: "ajuda", texto: `Referência aproximada no 3.º ano: ${REFERENCIA_3ANO.inicio} (início) → ${REFERENCIA_3ANO.fim} (fim do ano).` }),
        el("div", { class: "tabela-rolavel", style: "margin-top:12px" }, [
          el("table", {}, [
            el("thead", {}, [el("tr", {}, [el("th", {}, "Data"), el("th", {}, "Texto"), el("th", {}, "PPM"), el("th", {}, "Precisão")])]),
            el("tbody", {}, avals.slice(-8).reverse().map(a => el("tr", {}, [
              el("td", { texto: a.data }), el("td", { texto: a.titulo }),
              el("td", { texto: String(a.ppmCorreto) }), el("td", { texto: a.precisao + "%" })
            ])))
          ])
        ])
      ]));
    }

    // treino diário
    raiz.appendChild(el("div", { class: "painel" }, [
      el("div", { class: "rotulo", texto: "Treino diário de leitura" }),
      el("p", { class: "ajuda", style: "margin-top:8px" }, `${s.leitura.sessoes.length === 1 ? "1 sessão" : s.leitura.sessoes.length + " sessões"} · melhor velocidade em treino: ${melhorPPMGeral()} ppm (as leituras repetidas dão sempre valores mais altos do que a medição oficial — é normal e é esse o objetivo).`)
    ]));

    // matemática
    raiz.appendChild(el("div", { class: "painel" }, [
      el("div", { class: "rotulo", texto: "Matemática" }),
      el("div", { class: "tabela-rolavel", style: "margin-top:10px" }, [
        el("table", {}, [
          el("thead", {}, [el("tr", {}, [el("th", {}, "Competência"), el("th", {}, "De cor"), el("th", {}, "Acerto")])]),
          el("tbody", {}, COMPETENCIAS.map(c => {
            const p = progressoCompetencia(c);
            return el("tr", {}, [
              el("td", {}, [c.nome, dominada(c) ? " ⭐️" : ""]),
              el("td", { texto: `${p.fortes}/${p.total}` }),
              el("td", { texto: p.precisao === null ? "—" : p.precisao + "%" })
            ]);
          }))
        ])
      ])
    ]));

    // tempo de ecrã
    const dias = ultimosDias(14);
    const gastos = dias.map(d => Math.round(((s.tempo.dias[d] || {}).gastoSeg || 0) / 60));
    const topoT = Math.max(...gastos, 10);
    raiz.appendChild(el("div", { class: "painel" }, [
      el("div", { class: "rotulo", texto: "Tempo de ecrã registado (minutos/dia)" }),
      el("div", { class: "grafico" }, gastos.map(g => el("div", { class: "col" }, [
        el("div", { class: "val", style: `height:${Math.round((g / topoT) * 100)}%;background:var(--tempo)` }),
        el("div", { class: "dia", texto: String(g) })
      ]))),
      el("p", { class: "ajuda" }, "Só conta o que ele marcou na app. O corte real tem de vir do Tempo de Ecrã do iOS.")
    ]));

    raiz.appendChild(el("button", { class: "btn btn-grande", onClick: exportar }, "Exportar tudo (cópia de segurança)"));
  }

  // ---------- gravações ----------

  function gravacoes() {
    trocar(null);
    limpar(raiz);
    raiz.appendChild(cabecalho("Gravações", "As últimas 12 leituras dele. Ficam só neste iPad.", menu));
    const zona = el("div");
    raiz.appendChild(zona);
    audio.listarGravacoes().then(lista => {
      if (!lista.length) {
        zona.appendChild(el("div", { class: "painel plano" }, "Ainda não há gravações. Aparecem aqui depois de ele fazer uma leitura com o microfone autorizado."));
        return;
      }
      for (const g of lista) {
        const url = URL.createObjectURL(g.blob);
        zona.appendChild(el("div", { class: "painel" }, [
          el("div", { style: "font-weight:700", texto: g.titulo || "Leitura" }),
          el("div", { class: "ajuda", texto: `${new Date(g.quando).toLocaleString("pt-PT")}${g.ppm ? ` · ${g.ppm} ppm` : ""}${g.tentativa ? ` · leitura ${g.tentativa}` : ""}` }),
          el("audio", { controls: true, src: url, style: "width:100%;margin-top:10px" })
        ]));
      }
      zona.appendChild(el("button", {
        class: "btn btn-grande", onClick: () => {
          if (confirmar("Apagar todas as gravações?")) audio.apagarGravacoes().then(gravacoes);
        }
      }, "Apagar todas as gravações"));
    });
  }

  // ---------- textos ----------

  function textos() {
    trocar(null);
    limpar(raiz);
    raiz.appendChild(cabecalho("Textos", "Acrescente textos vossos. Ficam guardados só neste iPad.", menu));

    const titulo = el("input", { type: "text", placeholder: "Título" });
    const corpo = el("textarea", { placeholder: "Cole aqui o texto…" });
    const nivel = el("select", {}, [
      el("option", { value: "1" }, "Nível 1 — frases curtas"),
      el("option", { value: "2" }, "Nível 2 — médio"),
      el("option", { value: "3" }, "Nível 3 — mais difícil")
    ]);
    nivel.value = String(obter().config.nivelLeitura);

    // Associar o texto a uma história AaZ faz com que ela deixe de precisar
    // do site: o vídeo é o modelo e o texto fica aqui, no dispositivo.
    const jaAssociadas = new Set(obter().textosProprios.map(t => t.aazSlug).filter(Boolean));
    const aaz = el("select", {}, [
      el("option", { value: "" }, "Não — é um texto vosso"),
      ...HISTORIAS_AAZ.filter(h => !jaAssociadas.has(h.slug))
        .map(h => el("option", { value: h.slug }, `${h.titulo}${h.autor ? " — " + h.autor : ""} (${h.palavras} palavras)`))
    ]);
    aaz.addEventListener("change", () => {
      const h = HISTORIAS_AAZ.find(x => x.slug === aaz.value);
      if (h && !titulo.value.trim()) titulo.value = h.titulo;
    });

    raiz.appendChild(el("div", { class: "painel" }, [
      el("div", { class: "campo" }, [
        el("label", { texto: "É o texto de uma história AaZ?" }), aaz,
        el("p", { class: "ajuda" }, "Se sim, a história passa a ler-se toda dentro da app: o vídeo faz de modelo e ele lê o texto três vezes, sem sair para o site.")
      ]),
      el("div", { class: "campo" }, [el("label", { texto: "Título" }), titulo]),
      el("div", { class: "campo" }, [el("label", { texto: "Texto" }), corpo]),
      el("div", { class: "campo" }, [el("label", { texto: "Nível" }), nivel]),
      el("button", {
        class: "btn btn-grande btn-principal",
        onClick: () => {
          if (!titulo.value.trim() || !corpo.value.trim()) return;
          alterar(s => {
            s.textosProprios.push({
              id: "p" + Date.now(), titulo: titulo.value.trim(),
              texto: corpo.value.trim(), nivel: Number(nivel.value),
              aazSlug: aaz.value || null, perguntas: []
            });
          });
          som("certo");
          textos();
        }
      }, "Guardar texto"),
      el("p", { class: "ajuda" }, "Estes textos ficam guardados apenas neste dispositivo e nunca são publicados — é uso familiar. Não os copiem para o repositório.")
    ]));

    const meus = obter().textosProprios;
    if (meus.length) {
      raiz.appendChild(el("div", { class: "painel" }, [
        el("div", { class: "rotulo", texto: `Os vossos textos (${meus.length})` }),
        ...meus.map(t => el("div", { class: "linha", style: "border-bottom:1px solid var(--borda);padding:10px 0" }, [
          el("div", { style: "flex:1" }, [
            el("div", { style: "font-weight:600", texto: t.titulo }),
            el("div", { class: "ajuda", texto: `${contarPalavras(t.texto)} palavras · nível ${t.nivel}${t.aazSlug ? " · história AaZ" : ""}` })
          ]),
          el("button", {
            class: "btn btn-fantasma", onClick: () => {
              if (!confirmar(`Apagar "${t.titulo}"?`)) return;
              alterar(s => { s.textosProprios = s.textosProprios.filter(x => x.id !== t.id); });
              textos();
            }
          }, "Apagar")
        ]))
      ]));
    }
  }

  // ---------- definições ----------

  function definicoes() {
    trocar(null);
    limpar(raiz);
    const c = obter().config;
    raiz.appendChild(cabecalho("Definições", null, menu));

    const nome = el("input", { type: "text", value: obter().perfil.nome || "" });
    const semana = el("input", { type: "number", min: "0", max: "240", step: "5", value: String(c.minutosSemana) });
    const fds = el("input", { type: "number", min: "0", max: "300", step: "5", value: String(c.minutosFimDeSemana) });
    const nivel = el("select", {}, [1, 2, 3].map(n => el("option", { value: String(n) }, `Nível ${n}`)));
    nivel.value = String(c.nivelLeitura);
    const pin = el("input", { type: "text", inputmode: "numeric", value: c.pin, maxlength: "6" });
    const letraGrande = el("input", { type: "checkbox" }); letraGrande.checked = c.letraGrande;
    const espacado = el("input", { type: "checkbox" }); espacado.checked = c.espacamentoAmplo;
    const mLeitura = el("input", { type: "checkbox" }); mLeitura.checked = c.missoes.leitura;
    const mMat = el("input", { type: "checkbox" }); mMat.checked = c.missoes.matematica;
    const mSil = el("input", { type: "checkbox" }); mSil.checked = c.missoes.silabas;

    raiz.appendChild(el("div", { class: "painel" }, [
      el("div", { class: "campo" }, [el("label", { texto: "Nome dele" }), nome]),
      el("div", { class: "campo" }, [
        el("label", { texto: "Minutos de ecrã · dias de semana" }), semana,
        el("p", { class: "ajuda" }, "Orçamento fixo. Não aumenta com o treino, de propósito.")
      ]),
      el("div", { class: "campo" }, [el("label", { texto: "Minutos de ecrã · fim de semana" }), fds]),
      el("div", { class: "campo" }, [
        el("label", { texto: "Nível de leitura" }), nivel,
        el("p", { class: "ajuda" }, "Se a precisão na medição semanal descer abaixo de 90%, desça um nível.")
      ])
    ]));

    raiz.appendChild(el("div", { class: "painel" }, [
      el("div", { class: "rotulo", texto: "Missões diárias" }),
      el("div", { class: "interruptor" }, [el("label", { texto: "Leitura" }), mLeitura]),
      el("div", { class: "interruptor" }, [el("label", { texto: "Matemática" }), mMat]),
      el("div", { class: "interruptor" }, [el("label", { texto: "Sílabas e ritmo" }), mSil])
    ]));

    raiz.appendChild(el("div", { class: "painel" }, [
      el("div", { class: "rotulo", texto: "Leitura no ecrã" }),
      el("div", { class: "interruptor" }, [el("label", { texto: "Letra maior" }), letraGrande]),
      el("div", { class: "interruptor" }, [el("label", { texto: "Letras e palavras mais espaçadas" }), espacado]),
      el("p", { class: "ajuda", style: "margin-top:10px" }, "Aumentar o espaçamento entre letras costuma ajudar quem descodifica com esforço. Experimente com ele e pergunte qual prefere.")
    ]));

    raiz.appendChild(el("div", { class: "painel" }, [
      el("div", { class: "campo" }, [el("label", { texto: "PIN do painel" }), pin])
    ]));

    raiz.appendChild(el("button", {
      class: "btn btn-grande btn-principal",
      onClick: () => {
        alterar(s => {
          s.perfil.nome = nome.value.trim();
          s.config.minutosSemana = Math.max(0, Number(semana.value) || 0);
          s.config.minutosFimDeSemana = Math.max(0, Number(fds.value) || 0);
          s.config.nivelLeitura = Number(nivel.value);
          s.config.pin = pin.value.trim() || "2468";
          s.config.letraGrande = letraGrande.checked;
          s.config.espacamentoAmplo = espacado.checked;
          s.config.missoes = { leitura: mLeitura.checked, matematica: mMat.checked, silabas: mSil.checked };
        });
        aplicarPreferencias();
        som("certo");
        menu();
      }
    }, "Guardar"));

    raiz.appendChild(el("div", { class: "painel plano", style: "margin-top:20px" }, [
      el("div", { class: "rotulo", texto: "Dados" }),
      el("p", { class: "ajuda", style: "margin-top:8px" }, "Tudo o que a app guarda está neste iPad. Nada é enviado para lado nenhum."),
      el("div", { class: "linha-botoes", style: "margin-top:10px" }, [
        el("button", { class: "btn", onClick: exportar }, "Exportar"),
        el("button", { class: "btn", onClick: importar }, "Importar"),
        el("button", { class: "btn", style: "color:var(--erro)", onClick: apagarTudo }, "Apagar tudo")
      ])
    ]));
  }

  function exportar() {
    const txt = exportarJSON();
    const blob = new Blob([txt], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = el("a", { href: url, download: `plano-${hojeISO()}.json` });
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
  }

  function importar() {
    const inp = el("input", { type: "file", accept: "application/json,.json", style: "display:none" });
    inp.addEventListener("change", () => {
      const f = inp.files[0];
      if (!f) return;
      const leitor = new FileReader();
      leitor.onload = () => {
        try { importarJSON(leitor.result); aplicarPreferencias(); alert("Dados importados."); menu(); }
        catch (e) { alert("Não foi possível ler esse ficheiro."); }
      };
      leitor.readAsText(f);
    });
    document.body.appendChild(inp); inp.click(); inp.remove();
  }

  function apagarTudo() {
    if (!confirmar("Apagar todo o progresso, definições e textos? Isto não se desfaz.")) return;
    if (!confirmar("Tem mesmo a certeza?")) return;
    reiniciarTudo();
    audio.apagarGravacoes();
    location.reload();
  }

  pedirPin();
  return () => trocar(null);
}

export function aplicarPreferencias() {
  const c = obter().config;
  document.body.classList.toggle("letra-grande", !!c.letraGrande);
  document.body.classList.toggle("espacado", !!c.espacamentoAmplo);
}
