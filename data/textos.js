// Textos para treino de fluência leitora (leitura repetida).
// Nível 1: frases curtas, vocabulário comum (~60-85 palavras)
// Nível 2: frases médias, alguma subordinação (~95-125 palavras)
// Nível 3: frases longas, vocabulário mais rico (~135-170 palavras)
// As perguntas servem para garantir que a velocidade não anda sem compreensão.

export const TEXTOS = [
  {
    id: "t01", nivel: 1, tema: "ténis",
    titulo: "A primeira raquete",
    texto: `A raquete do Simão era grande de mais.
Cada vez que ele batia na bola, a raquete rodava na mão.
A bola voava para todo o lado menos para o outro campo.
O treinador riu-se e foi buscar outra raquete, mais pequena e mais leve.
Desta vez, o Simão bateu com força.
A bola passou por cima da rede e caiu bem dentro das linhas.
— Viste? — gritou ele. — Eu sabia que a culpa não era minha!`,
    perguntas: [
      { p: "Porque é que a bola voava para todo o lado?", opcoes: ["A raquete era grande de mais", "O Simão estava cansado", "A rede era muito alta"], correta: 0 },
      { p: "O que fez o treinador?", opcoes: ["Mandou-o parar", "Foi buscar uma raquete mais pequena", "Baixou a rede"], correta: 1 }
    ]
  },
  {
    id: "t02", nivel: 1, tema: "animais",
    titulo: "O gato que não gostava de água",
    texto: `O Bigodes era um gato preto com uma pata branca.
Gostava de dormir ao sol, de caçar moscas e de comer peixe.
De água, não gostava nada.
Quando chovia, ficava à janela a olhar para a rua com cara de zangado.
Um dia, caiu um vaso na varanda e partiu-se.
O Bigodes deu um salto e foi parar dentro do balde de lavar o chão.
Saiu de lá a pingar, muito ofendido, e passou a tarde toda a lamber-se.`,
    perguntas: [
      { p: "Como era o Bigodes?", opcoes: ["Branco com pata preta", "Preto com uma pata branca", "Todo preto"], correta: 1 },
      { p: "Como é que o gato se molhou?", opcoes: ["Caiu num balde", "Foi apanhado pela chuva", "Caiu à piscina"], correta: 0 }
    ]
  },
  {
    id: "t03", nivel: 1, tema: "música",
    titulo: "O tambor do avô",
    texto: `No sótão do avô havia um tambor velho.
A pele estava gasta e a madeira tinha riscos por todo o lado.
— Este tambor é mais velho do que eu — disse o avô.
A Rita bateu uma vez. O som encheu a casa toda.
Bateu outra vez, mais devagar, e depois mais depressa.
O avô começou a bater o pé no chão, no mesmo ritmo.
A avó apareceu à porta a rir-se e disse que já não se ouvia a televisão.`,
    perguntas: [
      { p: "Onde estava o tambor?", opcoes: ["Na garagem", "No sótão", "Na sala"], correta: 1 },
      { p: "O que fez o avô enquanto a Rita tocava?", opcoes: ["Bateu o pé no ritmo", "Foi ver televisão", "Tapou os ouvidos"], correta: 0 }
    ]
  },
  {
    id: "t04", nivel: 1, tema: "dia a dia",
    titulo: "O pão quente",
    texto: `Aos sábados de manhã, o pai e o Tomás iam à padaria.
Iam sempre a pé, mesmo quando estava frio.
O cheiro do pão chegava à rua antes de eles chegarem à porta.
A senhora da padaria já sabia o que eles queriam.
Punha o pão num saco de papel e dobrava a ponta duas vezes.
No caminho de volta, o Tomás abria o saco e comia um bocado.
Chegava a casa com o pão quente e com a barriga já meia cheia.`,
    perguntas: [
      { p: "Quando é que iam à padaria?", opcoes: ["Todos os dias", "Aos sábados de manhã", "Ao domingo à tarde"], correta: 1 },
      { p: "O que fazia o Tomás no caminho de volta?", opcoes: ["Corria à frente", "Comia um bocado de pão", "Levava o saco ao ombro"], correta: 1 }
    ]
  },
  {
    id: "t05", nivel: 1, tema: "humor",
    titulo: "A sopa desaparecida",
    texto: `A mãe pôs a sopa na mesa e foi atender o telefone.
Quando voltou, o prato do Martim estava vazio.
— Já comeste tudo? — perguntou ela, muito admirada.
— Já — respondeu o Martim, com um sorriso enorme.
A mãe olhou para o chão. O cão estava debaixo da mesa, a lamber os bigodes.
Tinha uma cenoura presa numa orelha.
— Pois — disse a mãe. — E o cão também jantou sopa hoje.`,
    perguntas: [
      { p: "Quem comeu mesmo a sopa?", opcoes: ["O Martim", "O cão", "A mãe"], correta: 1 },
      { p: "O que denunciou o cão?", opcoes: ["Uma cenoura na orelha", "Um ladrar alto", "O prato partido"], correta: 0 }
    ]
  },

  {
    id: "t06", nivel: 2, tema: "ténis",
    titulo: "O saque secreto",
    texto: `Durante semanas, o Afonso treinou o mesmo movimento à frente do espelho do quarto.
Atirava uma bola imaginária ao ar, dobrava os joelhos e estendia o braço bem alto.
A mãe passava no corredor, via aquilo e não dizia nada.
No sábado, no primeiro jogo do torneio, chegou a vez de ele servir.
Sentiu o coração a bater com força na garganta.
Atirou a bola ao ar, dobrou os joelhos, estendeu o braço.
A bola bateu na rede e caiu do lado dele.
O Afonso respirou fundo, pegou na segunda bola e repetiu tudo outra vez.
Desta vez, o saque passou tão depressa que o adversário nem se mexeu.`,
    perguntas: [
      { p: "Onde é que o Afonso treinava o saque?", opcoes: ["No court do clube", "À frente do espelho do quarto", "No jardim"], correta: 1 },
      { p: "O que aconteceu ao primeiro saque no torneio?", opcoes: ["Bateu na rede", "Passou muito depressa", "Saiu fora das linhas"], correta: 0 },
      { p: "O que mostra que o Afonso não desistiu?", opcoes: ["Pediu para trocar de raquete", "Respirou fundo e serviu outra vez", "Foi falar com o treinador"], correta: 1 }
    ]
  },
  {
    id: "t07", nivel: 2, tema: "música",
    titulo: "Uma manhã na orquestra",
    texto: `Antes do concerto começar, a orquestra afina os instrumentos.
Durante alguns minutos, aquilo parece uma grande confusão.
Os violinos tocam notas soltas, os trompetes sopram, alguém experimenta os pratos e faz um estrondo.
Depois, o oboé toca uma única nota, comprida e clara.
Todos os músicos param e afinam o seu instrumento por aquela nota.
Aos poucos, a confusão transforma-se num som só.
Quando o maestro levanta os braços, faz-se um silêncio tão grande
que se ouve alguém a tossir na última fila.
E então, ao mesmo tempo, cem pessoas começam a tocar a mesma música.`,
    perguntas: [
      { p: "Qual é o instrumento que dá a nota para afinar?", opcoes: ["O violino", "O oboé", "O trompete"], correta: 1 },
      { p: "O que acontece quando o maestro levanta os braços?", opcoes: ["Faz-se silêncio", "Todos aplaudem", "Os músicos saem"], correta: 0 },
      { p: "Porque é que o início parece uma confusão?", opcoes: ["Estão a afinar os instrumentos", "Estão zangados uns com os outros", "Estão a aquecer as mãos"], correta: 0 }
    ]
  },
  {
    id: "t08", nivel: 2, tema: "animais",
    titulo: "O polvo mais esperto do mar",
    texto: `O polvo é um dos animais mais espantosos do oceano.
Não tem ossos, por isso consegue passar por buracos do tamanho de uma moeda.
Tem três corações e sangue azul, o que já é bastante estranho por si só.
Mas o mais impressionante é a pele.
Em menos de um segundo, o polvo muda de cor e de textura
para ficar igual à rocha, à areia ou às algas onde está pousado.
Há polvos que aprendem a abrir frascos com a tampa enroscada
só de ver alguém fazer o mesmo do outro lado do vidro.
Quem os estuda diz que cada polvo tem a sua própria personalidade.`,
    perguntas: [
      { p: "Porque é que o polvo passa por buracos pequenos?", opcoes: ["Porque não tem ossos", "Porque é muito magro", "Porque encolhe a pele"], correta: 0 },
      { p: "Quantos corações tem um polvo?", opcoes: ["Um", "Dois", "Três"], correta: 2 },
      { p: "Para que serve mudar de cor?", opcoes: ["Para nadar mais depressa", "Para se confundir com o que está à volta", "Para avisar os outros polvos"], correta: 1 }
    ]
  },
  {
    id: "t09", nivel: 2, tema: "espaço",
    titulo: "A noite em que a Lua desapareceu",
    texto: `Naquela noite, o pai acordou a Beatriz às onze horas.
Levou-a para a varanda com uma manta pelos ombros e apontou para o céu.
A Lua estava a ficar escura, como se alguém lhe estivesse a passar uma sombra por cima.
— É a sombra da Terra — explicou o pai. — Estamos mesmo no meio, entre o Sol e a Lua.
Aos poucos, a Lua ficou de um vermelho estranho, cor de ferrugem.
A Beatriz não disse nada durante muito tempo.
Ficou só ali, encostada ao pai, a olhar para uma coisa
que só volta a acontecer daqui a muitos anos.`,
    perguntas: [
      { p: "Porque é que a Lua ficou escura?", opcoes: ["Estava muito nublado", "A sombra da Terra passou por cima dela", "A Lua afastou-se"], correta: 1 },
      { p: "De que cor ficou a Lua?", opcoes: ["Vermelha, cor de ferrugem", "Azul-escura", "Cinzenta"], correta: 0 },
      { p: "O que estava no meio, entre o Sol e a Lua?", opcoes: ["Uma nuvem", "A Terra", "Um planeta"], correta: 1 }
    ]
  },
  {
    id: "t10", nivel: 2, tema: "humor",
    titulo: "O cão que fugiu da trela",
    texto: `Bastou o pai baixar-se para apanhar as chaves.
Num segundo, a trela escapou-lhe da mão e o Bolota desatou a correr pelo parque fora.
Ia com as orelhas ao vento e a língua de fora, feliz como nunca.
Atrás dele ia o pai, de chinelos, a gritar o nome do cão.
Atrás do pai iam duas crianças que acharam aquilo muito divertido.
E atrás das crianças ia um senhor de bicicleta, que só queria passar.
O Bolota deu três voltas ao lago, parou de repente
e voltou para trás a abanar a cauda, muito satisfeito consigo próprio.
Só lhe faltava dizer: outra vez!`,
    perguntas: [
      { p: "Como é que o cão se soltou?", opcoes: ["Mordeu a trela", "O pai baixou-se para apanhar as chaves", "A trela partiu-se"], correta: 1 },
      { p: "Quantas voltas deu o Bolota ao lago?", opcoes: ["Duas", "Três", "Cinco"], correta: 1 },
      { p: "Como estava o cão no fim?", opcoes: ["Cansado e assustado", "Satisfeito consigo próprio", "Zangado com o pai"], correta: 1 }
    ]
  },

  {
    id: "t11", nivel: 3, tema: "ténis",
    titulo: "O ponto mais longo do torneio",
    texto: `Estavam empatados e faltava um ponto para acabar o jogo.
O Rodrigo serviu, o adversário devolveu, e a bola começou a atravessar a rede
uma vez, duas vezes, dez vezes, sem que nenhum dos dois falhasse.
As pessoas que estavam nos bancos deixaram de falar.
Ouvia-se apenas o som seco da bola a bater nas cordas e o chiar das sapatilhas no piso.
O Rodrigo sentia as pernas pesadas, mas não conseguia parar de pensar
naquilo que o treinador lhe dizia sempre: uma bola de cada vez.
Ao vigésimo terceiro toque, o adversário tentou um remate arriscado
e a bola bateu na fita da rede, hesitou durante um instante que pareceu eterno,
e caiu do lado de lá.
O Rodrigo não gritou. Ficou apenas parado no meio do court,
a perceber devagar que tinha ganho.`,
    perguntas: [
      { p: "Quantos toques teve o ponto?", opcoes: ["Dez", "Vinte e três", "Trinta"], correta: 1 },
      { p: "O que dizia sempre o treinador?", opcoes: ["Uma bola de cada vez", "Joga com força", "Não olhes para o público"], correta: 0 },
      { p: "Como reagiu o Rodrigo quando ganhou?", opcoes: ["Gritou de alegria", "Ficou parado a perceber o que tinha acontecido", "Correu para o treinador"], correta: 1 }
    ]
  },
  {
    id: "t12", nivel: 3, tema: "música",
    titulo: "O rapaz que colecionava sons",
    texto: `O Vasco não colecionava cromos nem berlindes. Colecionava sons.
Andava sempre com um gravador pequeno no bolso do casaco
e, quando ouvia alguma coisa de que gostava, carregava no botão vermelho.
Tinha o som da porta do quintal, que rangia sempre na mesma nota.
Tinha a chuva a bater no telhado de zinco da garagem.
Tinha o avô a assobiar enquanto arranjava a bicicleta,
e tinha os passos da irmã a subir as escadas a correr, sempre três degraus de cada vez.
Uma tarde, juntou tudo no computador e pôs os sons a tocar uns por cima dos outros,
cada um a entrar no seu momento certo.
Quando a mãe entrou no quarto e ouviu aquilo, ficou calada à porta.
Não era barulho nenhum. Era música, feita com a casa inteira.`,
    perguntas: [
      { p: "O que colecionava o Vasco?", opcoes: ["Cromos", "Berlindes", "Sons"], correta: 2 },
      { p: "O que fazia o avô no som gravado?", opcoes: ["Assobiava enquanto arranjava a bicicleta", "Cantava na cozinha", "Tocava viola"], correta: 0 },
      { p: "Porque é que a mãe ficou calada à porta?", opcoes: ["Estava zangada com o barulho", "Percebeu que aquilo era música", "Não conseguia ouvir bem"], correta: 1 }
    ]
  },
  {
    id: "t13", nivel: 3, tema: "espaço",
    titulo: "Um dia inteiro em Marte",
    texto: `Se um dia fores viver para Marte, vais ter de mudar algumas contas.
Um dia em Marte dura vinte e quatro horas e trinta e sete minutos,
por isso terias sempre mais meia hora do que tens agora, o que não é mau.
O ano, esse, é bem mais complicado: dura seiscentos e oitenta e sete dias.
Isso quer dizer que só farias anos de dois em dois anos terrestres,
e que passarias muito tempo à espera do bolo.
O céu de Marte não é azul como o nosso.
Durante o dia é acastanhado, cheio de poeira,
mas ao pôr do sol fica azulado à volta do sol, exatamente ao contrário do que acontece aqui.
E, como a gravidade é quase três vezes mais fraca,
um salto teu no recreio levar-te-ia muito mais alto e far-te-ia descer muito mais devagar.`,
    perguntas: [
      { p: "Quanto dura um dia em Marte?", opcoes: ["Vinte e quatro horas certas", "Vinte e quatro horas e trinta e sete minutos", "Seiscentos e oitenta e sete horas"], correta: 1 },
      { p: "De quanto em quanto tempo farias anos?", opcoes: ["Todos os anos", "De dois em dois anos terrestres", "De cinco em cinco anos"], correta: 1 },
      { p: "Como é o céu de Marte ao pôr do sol?", opcoes: ["Azulado à volta do sol", "Vermelho vivo", "Igual ao nosso"], correta: 0 }
    ]
  },
  {
    id: "t14", nivel: 3, tema: "animais",
    titulo: "A memória dos elefantes",
    texto: `Diz-se muitas vezes que os elefantes nunca se esquecem de nada, e há razões para isso.
Nas manadas, quem manda é quase sempre a fêmea mais velha.
Não é por ser a maior nem a mais forte, mas por ser aquela que se lembra dos caminhos.
Numa seca, quando os poços à volta secam todos,
é ela que conduz o grupo durante dias até um lugar onde havia água há vinte anos.
Os elefantes reconhecem também as vozes umas das outras
e sabem distinguir a voz de alguém que já lhes fez mal.
Quando um elefante da manada morre,
os outros ficam à volta do corpo durante horas, em silêncio,
e voltam a passar naquele sítio muitos anos depois,
tocando os ossos com a tromba, devagar, como quem se lembra de uma coisa importante.`,
    perguntas: [
      { p: "Quem lidera a manada?", opcoes: ["O macho mais forte", "A fêmea mais velha", "O elefante mais rápido"], correta: 1 },
      { p: "Porque é que ela lidera?", opcoes: ["Porque se lembra dos caminhos", "Porque é a maior", "Porque tem mais crias"], correta: 0 },
      { p: "O que fazem os elefantes quando um deles morre?", opcoes: ["Afastam-se logo", "Ficam à volta do corpo durante horas", "Chamam outras manadas"], correta: 1 }
    ]
  },
  {
    id: "t15", nivel: 3, tema: "dia a dia",
    titulo: "A biblioteca da esquina",
    texto: `A biblioteca da nossa rua é pequena e tem o chão de madeira que range.
A senhora que lá trabalha chama-se Dona Alice e conhece toda a gente pelo nome.
Quando entramos, ela levanta os olhos por cima dos óculos e diz logo:
tenho aqui uma coisa para ti.
Nunca se engana. Sabe quem gosta de histórias de medo,
quem só lê livros com desenhos e quem finge que gosta de ler para agradar aos pais.
A esses, dá sempre um livro fino e muito engraçado, para começar por algum lado.
Há uma regra escrita à mão num papel colado na parede, ao lado da porta:
aqui não é preciso acabar os livros de que não gostamos.
Foi por causa dessa regra, dizia o meu irmão,
que ele acabou por ler todos os livros da prateleira de baixo.`,
    perguntas: [
      { p: "Como sabe a Dona Alice o que dar a cada pessoa?", opcoes: ["Pergunta sempre", "Conhece as pessoas e o que gostam", "Dá sempre o mesmo livro"], correta: 1 },
      { p: "Qual é a regra escrita na parede?", opcoes: ["Não é preciso acabar os livros de que não gostamos", "É proibido falar alto", "Só se pode levar um livro"], correta: 0 },
      { p: "O que aconteceu ao irmão por causa da regra?", opcoes: ["Deixou de ir à biblioteca", "Leu todos os livros da prateleira de baixo", "Passou a ler só livros finos"], correta: 1 }
    ]
  },

  {
    id: "t16", nivel: 1, tema: "natureza",
    titulo: "A cabana",
    texto: `Levámos a manhã inteira a arrastar paus para debaixo do sobreiro.
Os mais compridos ficaram encostados ao tronco, como um telhado.
Por cima, pusemos ramos com folhas para tapar os buracos.
No chão, espalhámos caruma seca, que é macia e cheira bem.
Quando entrámos, coube toda a gente, mas ninguém se podia pôr de pé.
Ficámos ali sentados, muito calados, a ouvir a chuva a bater lá fora.
Não entrou uma única gota.`,
    perguntas: [
      { p: "O que puseram no chão da cabana?", opcoes: ["Caruma seca", "Folhas molhadas", "Pedras"], correta: 0 },
      { p: "Como souberam que a cabana era boa?", opcoes: ["Cabiam todos de pé", "Não entrou chuva nenhuma", "Era a maior de todas"], correta: 1 }
    ]
  },
  {
    id: "t17", nivel: 2, tema: "arqueologia",
    titulo: "O que está debaixo dos nossos pés",
    texto: `Os arqueólogos não escavam à pressa. É essa a primeira coisa que se aprende.
Trabalham com pincéis e colheres pequenas, a limpar a terra grão a grão,
porque uma pancada mal dada pode partir uma coisa que esteve inteira dois mil anos.
Antes de tirar seja o que for do sítio onde está, fotografam tudo e desenham tudo.
A posição de um objeto conta tanto como o próprio objeto:
um prato ao lado de uma lareira diz que ali se comia;
o mesmo prato dentro de uma sepultura conta uma história completamente diferente.
Por isso é que um arqueólogo passa mais tempo a escrever do que a cavar.`,
    perguntas: [
      { p: "Com que trabalham os arqueólogos?", opcoes: ["Pás grandes", "Pincéis e colheres pequenas", "Máquinas"], correta: 1 },
      { p: "Porque é que fotografam tudo antes de tirar?", opcoes: ["Para pôr na internet", "Porque a posição do objeto conta uma história", "Para não se perderem"], correta: 1 },
      { p: "O que faz um arqueólogo durante mais tempo?", opcoes: ["Cavar", "Escrever", "Viajar"], correta: 1 }
    ]
  },
  {
    id: "t18", nivel: 2, tema: "corrida",
    titulo: "Os últimos duzentos metros",
    texto: `Até meio da corrida, o Gabriel ia bem. Depois começou a doer-lhe tudo.
As pernas pesavam, o ar não chegava e havia uma voz na cabeça dele
a dizer que podia parar, que ninguém ia achar mal.
Foi então que se lembrou do que o treinador dizia:
não olhes para a meta, olha para as costas de quem vai à tua frente.
Escolheu um rapaz de camisola azul e decidiu só não o deixar fugir.
Passou uma curva, passou outra, e quando deu por si já ouvia as pessoas a gritar.
Não ganhou. Chegou em sétimo, de boca aberta e com as pernas a tremer.
Mas foi dos dias em que ficou mais orgulhoso de si próprio.`,
    perguntas: [
      { p: "O que dizia o treinador?", opcoes: ["Corre sempre à frente", "Olha para as costas de quem vai à tua frente", "Nunca olhes para trás"], correta: 1 },
      { p: "Em que lugar chegou o Gabriel?", opcoes: ["Primeiro", "Sétimo", "Último"], correta: 1 },
      { p: "Porque é que ficou orgulhoso?", opcoes: ["Porque ganhou", "Porque não desistiu quando quis parar", "Porque bateu o recorde"], correta: 1 }
    ]
  },
  {
    id: "t19", nivel: 3, tema: "arqueologia",
    titulo: "A cidade que ficou debaixo das cinzas",
    texto: `Numa manhã de agosto do ano 79, o vulcão Vesúvio acordou
e cobriu a cidade de Pompeia com uma camada de cinza de vários metros de altura.
Durante mil e seiscentos anos ninguém se lembrou de que aquela cidade existia.
Quando finalmente começaram a escavar, encontraram uma coisa que ninguém esperava:
a cinza tinha guardado tudo exatamente como estava naquele dia.
Havia pão dentro dos fornos, ainda com a marca do padeiro.
Havia frases escritas nas paredes por gente que já morreu há dois mil anos,
a gozar com os vizinhos e a dizer quem devia ganhar as eleições.
Um arqueólogo percebeu que os buracos que apareciam na cinza endurecida
tinham a forma exata das pessoas que ali ficaram.
Encheu-os com gesso e devolveu-lhes o corpo, a roupa e a posição em que estavam.`,
    perguntas: [
      { p: "O que aconteceu a Pompeia no ano 79?", opcoes: ["Foi coberta por cinza do Vesúvio", "Foi destruída por um terramoto", "Foi abandonada pelos habitantes"], correta: 0 },
      { p: "O que encontraram escrito nas paredes?", opcoes: ["Receitas de cozinha", "Frases a gozar com os vizinhos e sobre eleições", "Mapas da cidade"], correta: 1 },
      { p: "Como é que devolveram a forma às pessoas?", opcoes: ["Encheram os buracos da cinza com gesso", "Desenharam a partir de ossos", "Usaram fotografias antigas"], correta: 0 }
    ]
  },
  {
    id: "t20", nivel: 3, tema: "natureza",
    titulo: "A regra da cabana",
    texto: `Tínhamos uma regra só, e ninguém se lembra de quem a inventou:
a cabana não se faz com nada que ainda esteja vivo.
Paus caídos, sim. Ramos partidos pelo vento, sim. Cortar uma árvore, nunca.
Isso obrigava-nos a andar mais tempo pelo mato à procura de material,
e a olhar para o chão de outra maneira, como quem faz compras.
Aprendemos depressa que os paus de eucalipto são direitos mas escorregam,
que os de pinheiro seguram melhor, e que os de silva não servem para nada
a não ser para nos arranharem os braços todos.
No fim do verão, a cabana estava tão bem feita que decidimos deixá-la lá.
Voltámos na Páscoa seguinte. Continuava de pé,
com um ninho lá dentro que já não era nosso.`,
    perguntas: [
      { p: "Qual era a regra da cabana?", opcoes: ["Não usar nada que estivesse vivo", "Só entrar quem ajudou", "Fazer tudo num dia"], correta: 0 },
      { p: "Que paus seguravam melhor?", opcoes: ["Os de eucalipto", "Os de pinheiro", "Os de silva"], correta: 1 },
      { p: "O que encontraram na Páscoa seguinte?", opcoes: ["A cabana caída", "Um ninho dentro da cabana", "Outra cabana maior"], correta: 1 }
    ]
  },

  {
    id: "t21", nivel: 1, tema: "planeta",
    titulo: "As abelhas do quintal",
    texto: `O avô nunca corta as flores amarelas que nascem sozinhas no quintal.
Diz que aquilo não são ervas daninhas, são o pequeno-almoço das abelhas.
No princípio da primavera, quando ainda não há mais nada aberto,
são as únicas flores que elas encontram.
Uma abelha sozinha faz muito pouco mel em toda a vida.
Mas sem elas não havia maçãs, nem morangos, nem amêndoas, nem quase nada.
Por isso, no quintal do avô, quem manda são as flores amarelas.`,
    perguntas: [
      { p: "Porque é que o avô não corta as flores amarelas?", opcoes: ["São o alimento das abelhas na primavera", "São bonitas", "Custam dinheiro"], correta: 0 },
      { p: "O que aconteceria sem as abelhas?", opcoes: ["Havia mais flores", "Não havia maçãs nem morangos", "Não fazia diferença"], correta: 1 }
    ]
  },
  {
    id: "t22", nivel: 2, tema: "planeta",
    titulo: "Para onde vai o que deitamos fora",
    texto: `Quando pomos alguma coisa no caixote do lixo, dizemos que a deitámos fora.
Mas fora não é sítio nenhum. Aquilo vai parar a algum lado.
Uma casca de banana desaparece em poucas semanas, comida por bichos e por fungos.
Uma lata de refrigerante demora cerca de cinquenta anos.
Uma garrafa de plástico pode ficar quatrocentos anos no mesmo sítio,
partindo-se em bocados cada vez mais pequenos, até virar um pó
que os peixes engolem sem saber o que é.
A parte estranha desta história é que o plástico foi inventado
exatamente por ser resistente e durar muito tempo.
Fizemos com que durasse para sempre coisas que usamos durante cinco minutos.`,
    perguntas: [
      { p: "Quanto tempo pode demorar uma garrafa de plástico?", opcoes: ["Cinquenta anos", "Quatrocentos anos", "Poucas semanas"], correta: 1 },
      { p: "O que acontece ao plástico com o tempo?", opcoes: ["Desaparece", "Parte-se em bocados muito pequenos", "Transforma-se em terra"], correta: 1 },
      { p: "Qual é a parte estranha da história?", opcoes: ["Ninguém sabe fazer plástico", "Fizemos durar para sempre coisas que usamos 5 minutos", "O plástico é barato"], correta: 1 }
    ]
  },
  {
    id: "t23", nivel: 3, tema: "planeta",
    titulo: "Os lobos que mudaram um rio",
    texto: `Durante setenta anos não houve um único lobo no parque de Yellowstone,
nos Estados Unidos, porque os tinham caçado a todos.
Sem lobos, os veados multiplicaram-se e passaram a comer sossegados
os rebentos das árvores que nasciam junto às margens dos rios.
Sem árvores novas, as margens ficaram nuas e a terra começou a desmoronar-se.
Em 1995 alguém teve a ideia de voltar a soltar catorze lobos no parque.
Os veados deixaram de poder parar durante horas no mesmo sítio.
As árvores das margens voltaram a crescer, e com elas apareceram
castores, aves e peixes que ali não se viam há décadas.
As raízes seguraram a terra e, ao fim de alguns anos,
os rios mudaram de forma e passaram a correr por caminhos diferentes.
Catorze lobos alteraram a maneira como a água corria numa região inteira.`,
    perguntas: [
      { p: "O que aconteceu quando não havia lobos?", opcoes: ["Os veados comeram as árvores novas das margens", "O rio secou", "Nasceram mais árvores"], correta: 0 },
      { p: "Quantos lobos foram soltos em 1995?", opcoes: ["Setenta", "Catorze", "Cem"], correta: 1 },
      { p: "Qual foi o efeito mais surpreendente?", opcoes: ["Os rios mudaram de forma", "Os veados desapareceram", "O parque ficou maior"], correta: 0 }
    ]
  }
];

export function contarPalavras(txt) {
  return txt.trim().split(/\s+/).filter(Boolean).length;
}
