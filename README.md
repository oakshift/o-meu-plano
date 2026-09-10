# O Meu Plano

Treino diário de leitura e de matemática para uma criança do 3.º ano, com o
tempo de ecrã gerido pela própria.

Página web sem servidor, sem contas e sem recolha de dados: tudo o que a app
guarda fica no dispositivo onde é usada. Feita para correr no Safari de um
iPad, adicionada ao ecrã principal como app.

**→ [Guia para os pais](GUIA.md)** — o método, a rotina e como interpretar
os números. É o documento a ler primeiro.

---

## O que faz

| Missão | Duração | O que treina |
|---|---|---|
| **Leitura** | ~5 min | Fluência por leitura repetida: ouvir um modelo, depois ler o mesmo texto três vezes, medindo palavras por minuto |
| **Matemática** | ~5 min | Factos numéricos com repetição espaçada, com a velocidade de resposta a contar para a progressão |
| **Sílabas e ritmo** | ~4 min | Descodificação dos padrões difíceis do português, com entrada rítmica |
| **O meu tempo** | — | Orçamento diário de ecrã que a criança gere sozinha |

E, no painel dos pais: medição semanal de palavras corretas por minuto,
relatório de evolução, gravações das leituras, e um editor para acrescentar
textos próprios.

## Duas decisões de desenho

**O treino não dá minutos de ecrã.** O orçamento é fixo e incondicional. Se
ler passar a valer desenhos animados, ensina-se que ler é o trabalho e os
bonecos são o pagamento — e o hábito morre com a recompensa. O treino
desbloqueia níveis, medalhas e recordes, não tempo.

**A app não bloqueia nada.** Uma página web no iPad não consegue impedir o
YouTube de abrir; quem corta é o Tempo de Ecrã do iOS. A app dá a decisão, a
hora de regresso e o registo. O iOS é a cerca, a app é o volante.

## Conteúdos

- **23 textos originais** em português europeu, em três níveis, com perguntas
  de compreensão. Temas puxados aos interesses do miúdo a que se destina:
  ténis, música, arqueologia, cabanas, corrida, animais, espaço, planeta.
- **21 problemas** de um e dois passos, que a app lê em voz alta a pedido — para
  que a dificuldade de leitura não se disfarce de dificuldade de matemática.
- **11 competências** de cálculo, do "fazer 10" às tabuadas do 6 ao 9 e às
  divisões, com ligação à Khan Academy quando o erro parece conceptual.
- **90 palavras** em 9 famílias de padrões difíceis, com divisão silábica.
- **As 24 Histórias AaZ** (Iniciativa Educação) — o vídeo oficial de cada
  história toca dentro da app, pelo player do YouTube. Os textos não são
  copiados: são obras protegidas, e abrem no site original. Quem quiser o
  ciclo completo sem sair da app cola o texto no painel dos pais e associa-o
  à história — fica guardado apenas no dispositivo.

## Estrutura

```
index.html          arranque
manifest.json       instalação como app
sw.js               funcionamento offline
css/style.css
js/  app.js         router
     casa.js        ecrã inicial
     store.js       estado (localStorage)
     ui.js          helpers e sons
     audio.js       voz (pt-PT) e gravação
     leitura.js  matematica.js  silabas.js  tempo.js  progresso.js  pais.js
data/ textos.js  matematica.js  palavras.js  aaz.js
_teste.html         38 testes — abrir num servidor local
```

Sem dependências, sem build, sem passo de compilação. JavaScript com módulos
ES nativos.

## Correr localmente

```sh
python3 -m http.server 8000
```

Depois abrir `http://localhost:8000` — e `http://localhost:8000/_teste.html`
para a bateria de testes. (Tem de ser por HTTP: os módulos ES não carregam a
partir de `file://`.)

## Publicar

Já está publicado por GitHub Pages a partir do ramo `main`. Qualquer alteração
enviada para o repositório fica online em cerca de um minuto. Depois de
alterar ficheiros, subir o número da versão em `sw.js` para que os iPads
recebam a versão nova em vez da que têm em cache.

## Privacidade

Não há servidor, contas nem análise de utilização. Progresso, definições,
textos próprios e gravações ficam no armazenamento local do dispositivo e
nunca saem dele. O reverso da medalha: apagar os dados do Safari apaga tudo.
Há exportação para ficheiro no painel dos pais.
