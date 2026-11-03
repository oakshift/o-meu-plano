# O Meu Plano

Treino diário de leitura e de matemática para uma criança do 3.º ano, com o
tempo de ecrã gerido pela própria.

Página web sem servidor, sem contas e sem recolha de dados: tudo o que a app
guarda fica no dispositivo onde é usada. Começou por ser feita para o iPad;
hoje é usada num computador, no Brave (ou no Firefox), com ecrã tátil, rato
e teclado — e continua a funcionar em tablets.

**→ [Guia para os pais](GUIA.md)** — o método, a rotina e como interpretar
os números. É o documento a ler primeiro.

---

## O que faz

| Missão | Duração | O que treina |
|---|---|---|
| **Leitura** | ~5 min | Fluência por leitura repetida com as Histórias AaZ: ouvir o vídeo, depois ler o mesmo texto três vezes, medindo palavras por minuto |
| **Matemática** | ~5 min | Factos numéricos com repetição espaçada, com a velocidade de resposta a contar para a progressão |
| **Sílabas e ritmo** | ~4 min | Descodificação dos padrões difíceis do português, com entrada rítmica |
| **O meu tempo** | — | Orçamento diário de ecrã que a criança gere sozinha |

E, no painel dos pais: medição semanal de palavras corretas por minuto,
relatório de evolução, gravações das leituras dele, um editor para
acrescentar textos próprios e a gravação da vossa voz a lê-los.

## Duas decisões de desenho

**O treino não dá minutos de ecrã.** O orçamento é fixo e incondicional. Se
ler passar a valer desenhos animados, ensina-se que ler é o trabalho e os
bonecos são o pagamento — e o hábito morre com a recompensa. O treino
desbloqueia níveis, medalhas e recordes, não tempo.

**A app não bloqueia nada.** Uma página web não consegue impedir o YouTube
de abrir; quem corta é o controlo parental do computador (Family Safety no
Windows, Tempo de Ecrã no Mac, Family Link no Chromebook). A app dá a
decisão, a hora de regresso e o registo. O sistema é a cerca, a app é o
volante.

## Conteúdos

- **21 problemas** de um e dois passos.
- **11 competências** de cálculo, do "fazer 10" às tabuadas do 6 ao 9 e às
  divisões, com ligação à Khan Academy quando o erro parece conceptual.
- **90 palavras** em 9 famílias de padrões difíceis, com divisão silábica.
- **As 24 Histórias AaZ** (Iniciativa Educação) são os textos de leitura —
  a app sugere uma por dia, do tamanho do nível dele. O vídeo oficial de cada
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
     audio.js       gravações (pais e criança)
     leitura.js  matematica.js  silabas.js  tempo.js  progresso.js  pais.js
data/ matematica.js  palavras.js  aaz.js
_teste.html         42 testes — abrir num servidor local
```

Sem dependências, sem build, sem passo de compilação. JavaScript com módulos
ES nativos.

## Voz

Não há voz sintética: as vozes do browser e as geradas por programa (Piper)
foram experimentadas e soavam robóticas e com falhas, e no Linux o Brave em
snap nem tem vozes. O modelo de leitura é o vídeo das Histórias AaZ ou a voz
dos pais, gravada no painel em *Gravar as leituras* (IndexedDB,
`plano-modelos`, uma gravação por texto).

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
alterar ficheiros, subir o número da versão em `sw.js` para que os browsers
recebam a versão nova em vez da que têm em cache.

## Privacidade

Não há servidor, contas nem análise de utilização. Progresso, definições,
textos próprios e gravações ficam no armazenamento local do dispositivo e
nunca saem dele. O reverso da medalha: apagar os dados do browser apaga tudo.
Há exportação para ficheiro no painel dos pais.
