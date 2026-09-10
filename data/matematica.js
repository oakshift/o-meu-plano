// Motor de factos numéricos — 3.º ano.
// Cada competência gera uma lista FINITA de itens, para que a repetição
// espaçada (Leitner) possa seguir cada facto individualmente: "7x8" tem
// a sua própria história, separada de "2x3".
//
// Regra de fluência: acertar não chega. Um facto só sobe de caixa se for
// respondido com segurança (ver LIMITE_FLUENCIA em js/matematica.js).

const r = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);

function item(id, pergunta, resposta, skill) {
  return { id, pergunta, resposta, skill };
}

export const COMPETENCIAS = [
  {
    id: "fazer10",
    nome: "Fazer 10",
    desc: "Quanto falta para 10",
    ordem: 1,
    khan: "https://pt.khanacademy.org/math/early-math/cc-early-math-add-sub-basics",
    itens() {
      return r(1, 9).map(n => item(`f10-${n}`, `${n} + ? = 10`, 10 - n, this.id));
    }
  },
  {
    id: "soma20",
    nome: "Somas até 20",
    desc: "Somar passando o 10",
    ordem: 2,
    khan: "https://pt.khanacademy.org/math/early-math/cc-early-math-add-sub-basics",
    itens() {
      const out = [];
      for (const a of r(2, 9)) for (const b of r(2, 9)) {
        if (a + b > 10 && a <= b) out.push(item(`s20-${a}-${b}`, `${a} + ${b}`, a + b, this.id));
      }
      return out;
    }
  },
  {
    id: "sub20",
    nome: "Subtrações até 20",
    desc: "Tirar passando o 10",
    ordem: 3,
    khan: "https://pt.khanacademy.org/math/early-math/cc-early-math-add-sub-basics",
    itens() {
      const out = [];
      for (const t of r(11, 18)) for (const b of r(2, 9)) {
        if (t - b >= 2 && t - b <= 9) out.push(item(`b20-${t}-${b}`, `${t} − ${b}`, t - b, this.id));
      }
      return out;
    }
  },
  {
    id: "dobros",
    nome: "Dobros e metades",
    desc: "O dobro e a metade",
    ordem: 4,
    khan: "https://pt.khanacademy.org/math/arithmetic-home/multiply-divide",
    itens() {
      const out = [];
      for (const n of r(2, 20)) out.push(item(`db-${n}`, `dobro de ${n}`, n * 2, this.id));
      for (const n of r(2, 20)) out.push(item(`mt-${n}`, `metade de ${n * 2}`, n, this.id));
      return out;
    }
  },
  {
    id: "tab2510",
    nome: "Tabuadas 2, 5 e 10",
    desc: "As tabuadas de base",
    ordem: 5,
    khan: "https://pt.khanacademy.org/math/arithmetic-home/multiply-divide/mult-facts",
    itens() {
      const out = [];
      for (const a of [2, 5, 10]) for (const b of r(2, 10)) {
        out.push(item(`m-${a}-${b}`, `${a} × ${b}`, a * b, this.id));
      }
      return out;
    }
  },
  {
    id: "tab34",
    nome: "Tabuadas 3 e 4",
    desc: "Multiplicar por 3 e por 4",
    ordem: 6,
    khan: "https://pt.khanacademy.org/math/arithmetic-home/multiply-divide/mult-facts",
    itens() {
      const out = [];
      for (const a of [3, 4]) for (const b of r(2, 10)) {
        out.push(item(`m-${a}-${b}`, `${a} × ${b}`, a * b, this.id));
      }
      return out;
    }
  },
  {
    id: "tab6789",
    nome: "Tabuadas 6, 7, 8 e 9",
    desc: "As mais difíceis de todas",
    ordem: 7,
    khan: "https://pt.khanacademy.org/math/arithmetic-home/multiply-divide/mult-facts",
    itens() {
      const out = [];
      for (const a of [6, 7, 8, 9]) for (const b of r(2, 10)) {
        out.push(item(`m-${a}-${b}`, `${a} × ${b}`, a * b, this.id));
      }
      return out;
    }
  },
  {
    id: "x10x100",
    nome: "Vezes 10 e 100",
    desc: "Multiplicar por 10 e por 100",
    ordem: 8,
    khan: "https://pt.khanacademy.org/math/arithmetic-home/multiply-divide",
    itens() {
      const out = [];
      for (const n of r(2, 20)) out.push(item(`x10-${n}`, `${n} × 10`, n * 10, this.id));
      for (const n of r(2, 12)) out.push(item(`x100-${n}`, `${n} × 100`, n * 100, this.id));
      return out;
    }
  },
  {
    id: "divisao",
    nome: "Divisões certas",
    desc: "Dividir sem sobrar nada",
    ordem: 9,
    khan: "https://pt.khanacademy.org/math/arithmetic-home/multiply-divide/div-facts",
    itens() {
      const out = [];
      for (const a of r(2, 10)) for (const b of r(2, 10)) {
        out.push(item(`d-${a}-${b}`, `${a * b} : ${a}`, b, this.id));
      }
      return out;
    }
  },
  {
    id: "fazer100",
    nome: "Fazer 100",
    desc: "Quanto falta para 100",
    ordem: 10,
    khan: "https://pt.khanacademy.org/math/arithmetic-home/addition-subtraction",
    itens() {
      const out = [];
      for (const n of r(1, 9)) out.push(item(`f100-${n * 10}`, `${n * 10} + ? = 100`, 100 - n * 10, this.id));
      for (const n of [5, 15, 25, 35, 45, 55, 65, 75, 85, 95, 12, 28, 34, 47, 63, 71, 86, 99]) {
        out.push(item(`f100-${n}`, `${n} + ? = 100`, 100 - n, this.id));
      }
      return out;
    }
  },
  {
    id: "calc100",
    nome: "Contas até 100",
    desc: "Somar e tirar de cabeça",
    ordem: 11,
    khan: "https://pt.khanacademy.org/math/arithmetic-home/addition-subtraction",
    itens() {
      const out = [];
      const pares = [[23,8],[35,7],[47,6],[56,9],[68,5],[74,8],[85,7],[38,9],[26,7],[59,6],
                     [17,25],[34,28],[46,37],[52,19],[63,29],[45,35],[27,48],[38,24],[56,26],[19,47]];
      for (const [a, b] of pares) {
        out.push(item(`c+-${a}-${b}`, `${a} + ${b}`, a + b, this.id));
        out.push(item(`c--${a + b}-${b}`, `${a + b} − ${b}`, a, this.id));
      }
      return out;
    }
  }
];

// Problemas de um e dois passos. A app lê-os em voz alta a pedido, para
// que a dificuldade de leitura não se disfarce de dificuldade de matemática.
export const PROBLEMAS = [
  { id: "p01", passos: 1, texto: "O Pedro tem 4 caixas de bolas de ténis. Cada caixa tem 3 bolas. Quantas bolas tem ao todo?", resposta: 12 },
  { id: "p02", passos: 1, texto: "Numa aula de música estão 24 alunos, sentados em 4 filas iguais. Quantos alunos há em cada fila?", resposta: 6 },
  { id: "p03", passos: 1, texto: "Um livro tem 90 páginas. A Rita já leu 37. Quantas páginas lhe faltam ler?", resposta: 53 },
  { id: "p04", passos: 1, texto: "Uma caixa de lápis custa 8 euros. Quanto custam 5 caixas?", resposta: 40 },
  { id: "p05", passos: 1, texto: "O treino de ténis começa às 17 horas e dura 45 minutos. A que horas acaba? Escreve só os minutos depois das 17.", resposta: 45 },
  { id: "p06", passos: 1, texto: "A avó fez 36 bolinhos e dividiu-os igualmente por 6 pratos. Quantos bolinhos ficaram em cada prato?", resposta: 6 },
  { id: "p07", passos: 2, texto: "O Tomás tinha 50 cromos. Deu 12 ao irmão e comprou mais 20. Com quantos cromos ficou?", resposta: 58 },
  { id: "p08", passos: 2, texto: "Numa sala há 5 mesas com 4 cadeiras cada uma e ainda 3 cadeiras encostadas à parede. Quantas cadeiras há na sala?", resposta: 23 },
  { id: "p09", passos: 2, texto: "A mãe comprou 3 pacotes de sumo a 2 euros cada e um pão de 1 euro. Quanto gastou?", resposta: 7 },
  { id: "p10", passos: 2, texto: "Uma orquestra tem 7 violinos, 4 flautas e o dobro de flautas em trompetes. Quantos músicos são ao todo?", resposta: 19 },
  { id: "p11", passos: 1, texto: "Num torneio há 8 grupos com 4 jogadores cada. Quantos jogadores estão no torneio?", resposta: 32 },
  { id: "p12", passos: 2, texto: "O Simão treinou 30 minutos na segunda, 45 na quarta e 30 na sexta. Quantos minutos treinou nessa semana?", resposta: 105 },
  { id: "p13", passos: 1, texto: "Um saco tem 100 berlindes. Tiraram-se 64. Quantos ficaram no saco?", resposta: 36 },
  { id: "p14", passos: 2, texto: "A Beatriz tem 6 euros. A irmã tem o dobro. Quanto têm as duas juntas?", resposta: 18 },
  { id: "p16", passos: 1, texto: "Numa escavação encontraram 48 moedas antigas, guardadas em 6 caixas iguais. Quantas moedas ficaram em cada caixa?", resposta: 8 },
  { id: "p17", passos: 2, texto: "Para fazer uma cabana o Pedro juntou 27 paus e o irmão juntou 18. Usaram 35. Quantos paus sobraram?", resposta: 10 },
  { id: "p18", passos: 1, texto: "Numa corrida, cada volta ao parque tem 400 metros. Quantos metros são 3 voltas?", resposta: 1200 },
  { id: "p19", passos: 2, texto: "Um arqueólogo escava 4 horas de manhã e 3 à tarde, durante 5 dias. Quantas horas escavou nessa semana?", resposta: 35 },
  { id: "p20", passos: 2, texto: "Uma turma juntou 35 garrafas de plástico numa semana e 47 na semana seguinte. Se cada 10 garrafas dão um pacote reciclado, quantos pacotes completos conseguem fazer?", resposta: 8 },
  { id: "p21", passos: 1, texto: "Um chuveiro gasta 9 litros de água por minuto. Quantos litros gasta um banho de 8 minutos?", resposta: 72 },
  { id: "p15", passos: 2, texto: "Numa caixa há 48 lápis para dividir por 6 alunos. Se um aluno faltar e os lápis forem divididos pelos que estão, quantos recebe cada um?", resposta: 9, dica: "Primeiro pensa quantos alunos ficaram." }
];

export function todosOsItens() {
  return COMPETENCIAS.flatMap(c => c.itens());
}

export function competenciaPorId(id) {
  return COMPETENCIAS.find(c => c.id === id);
}
