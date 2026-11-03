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

**A app não bloqueia nada.** Uma página web não consegue impedir o YouTube
de abrir; quem corta é o controlo parental do computador (Family Safety no
Windows, Tempo de Ecrã no Mac, Family Link no Chromebook). A app dá a
decisão, a hora de regresso e o registo. O sistema é a cerca, a app é o
volante.

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
      falas.js      índice do áudio (gerado)
audio/              voz de cada texto, problema, palavra e sílaba (gerado)
ferramentas/gerar-audio.py   gera audio/ e data/falas.js
_teste.html         43 testes — abrir num servidor local
```

Sem dependências, sem build, sem passo de compilação. JavaScript com módulos
ES nativos.

## Áudio

As vozes do browser não são de confiança (no Linux, o Brave em snap não tem
nenhuma, e as do sistema são robóticas), por isso a app traz o seu próprio
áudio, gerado com o [Piper](https://github.com/rhasspy/piper) e a voz
portuguesa "tugão". **Depois de mudar ou acrescentar um texto, problema ou
palavra, é preciso voltar a gerar** — senão esse fica sem som:

```sh
# uma vez só: instalar o Piper e descarregar a voz
python3 -m venv ferramentas/.venv
ferramentas/.venv/bin/pip install piper-tts
cd ferramentas/vozes   # (criar a pasta)
curl -LO "https://huggingface.co/rhasspy/piper-voices/resolve/main/pt/pt_PT/tug%C3%A3o/medium/pt_PT-tug%C3%A3o-medium.onnx"
curl -LO "https://huggingface.co/rhasspy/piper-voices/resolve/main/pt/pt_PT/tug%C3%A3o/medium/pt_PT-tug%C3%A3o-medium.onnx.json"
cd ../..

# sempre que os conteúdos mudam
ferramentas/.venv/bin/python ferramentas/gerar-audio.py
```

O teste "todos os textos … têm ficheiro" falha se alguém se esquecer.
Os textos que os pais acrescentam no painel não têm áudio: usam a voz do
browser, quando existe.

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
