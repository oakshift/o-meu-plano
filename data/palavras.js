// Descodificação ao nível da palavra.
// Ler textos treina fluência, mas quem tropeça na descodificação precisa
// também de trabalho direto nos padrões que travam a leitura em português.
// Cada palavra traz a divisão silábica, usada no exercício de ritmo.

export const FAMILIAS = [
  {
    id: "lh_nh_ch",
    nome: "lh · nh · ch",
    dica: "Estas três letras juntas fazem um som só. Nunca se separam.",
    palavras: [
      { p: "filho", s: ["fi", "lho"] },
      { p: "trabalho", s: ["tra", "ba", "lho"] },
      { p: "orelha", s: ["o", "re", "lha"] },
      { p: "molhado", s: ["mo", "lha", "do"] },
      { p: "ninho", s: ["ni", "nho"] },
      { p: "sonho", s: ["so", "nho"] },
      { p: "caminho", s: ["ca", "mi", "nho"] },
      { p: "chave", s: ["cha", "ve"] },
      { p: "chuva", s: ["chu", "va"] },
      { p: "fechado", s: ["fe", "cha", "do"] }
    ]
  },
  {
    id: "consoante_r",
    nome: "br · cr · dr · fr · gr · pr · tr",
    dica: "Duas consoantes agarradas, com o r a seguir. Lê-as coladas.",
    palavras: [
      { p: "braço", s: ["bra", "ço"] },
      { p: "livro", s: ["li", "vro"] },
      { p: "cravo", s: ["cra", "vo"] },
      { p: "pedra", s: ["pe", "dra"] },
      { p: "fruta", s: ["fru", "ta"] },
      { p: "grande", s: ["gran", "de"] },
      { p: "prato", s: ["pra", "to"] },
      { p: "trabalho", s: ["tra", "ba", "lho"] },
      { p: "quadro", s: ["qua", "dro"] },
      { p: "sombrinha", s: ["som", "bri", "nha"] }
    ]
  },
  {
    id: "consoante_l",
    nome: "bl · cl · fl · gl · pl",
    dica: "Outra vez duas consoantes juntas, agora com o l.",
    palavras: [
      { p: "bloco", s: ["blo", "co"] },
      { p: "problema", s: ["pro", "ble", "ma"] },
      { p: "classe", s: ["clas", "se"] },
      { p: "bicicleta", s: ["bi", "ci", "cle", "ta"] },
      { p: "flor", s: ["flor"] },
      { p: "flauta", s: ["flau", "ta"] },
      { p: "globo", s: ["glo", "bo"] },
      { p: "planta", s: ["plan", "ta"] },
      { p: "plástico", s: ["plás", "ti", "co"] },
      { p: "aplaudir", s: ["a", "plau", "dir"] }
    ]
  },
  {
    id: "nasais",
    nome: "ão · ãe · õe",
    dica: "O til manda o ar pelo nariz. Experimenta tapar o nariz e dizer 'pão'.",
    palavras: [
      { p: "pão", s: ["pão"] },
      { p: "irmão", s: ["ir", "mão"] },
      { p: "coração", s: ["co", "ra", "ção"] },
      { p: "canção", s: ["can", "ção"] },
      { p: "mãe", s: ["mãe"] },
      { p: "cães", s: ["cães"] },
      { p: "pães", s: ["pães"] },
      { p: "limões", s: ["li", "mões"] },
      { p: "botões", s: ["bo", "tões"] },
      { p: "lições", s: ["li", "ções"] }
    ]
  },
  {
    id: "rr_ss",
    nome: "rr · ss",
    dica: "Aqui as duas letras separam-se, uma para cada sílaba: car-ro, pas-sa.",
    palavras: [
      { p: "carro", s: ["car", "ro"] },
      { p: "barriga", s: ["bar", "ri", "ga"] },
      { p: "terra", s: ["ter", "ra"] },
      { p: "guitarra", s: ["gui", "tar", "ra"] },
      { p: "socorro", s: ["so", "cor", "ro"] },
      { p: "passo", s: ["pas", "so"] },
      { p: "massa", s: ["mas", "sa"] },
      { p: "pássaro", s: ["pás", "sa", "ro"] },
      { p: "assobiar", s: ["as", "so", "bi", "ar"] },
      { p: "professora", s: ["pro", "fes", "so", "ra"] }
    ]
  },
  {
    id: "s_entre_vogais",
    nome: "s entre vogais faz zzz",
    dica: "Entre duas vogais, o s zumbe como um z: casa, mesa.",
    palavras: [
      { p: "casa", s: ["ca", "sa"] },
      { p: "mesa", s: ["me", "sa"] },
      { p: "camisa", s: ["ca", "mi", "sa"] },
      { p: "brasa", s: ["bra", "sa"] },
      { p: "asa", s: ["a", "sa"] },
      { p: "piso", s: ["pi", "so"] },
      { p: "risada", s: ["ri", "sa", "da"] },
      { p: "raposa", s: ["ra", "po", "sa"] },
      { p: "guloso", s: ["gu", "lo", "so"] },
      { p: "surpresa", s: ["sur", "pre", "sa"] }
    ]
  },
  {
    id: "r_travado",
    nome: "r no fim da sílaba",
    dica: "Quando o r fecha a sílaba, arrasta: por-ta, car-ta.",
    palavras: [
      { p: "porta", s: ["por", "ta"] },
      { p: "carta", s: ["car", "ta"] },
      { p: "forte", s: ["for", "te"] },
      { p: "verde", s: ["ver", "de"] },
      { p: "árvore", s: ["ár", "vo", "re"] },
      { p: "curto", s: ["cur", "to"] },
      { p: "esperto", s: ["es", "per", "to"] },
      { p: "surdo", s: ["sur", "do"] },
      { p: "cortar", s: ["cor", "tar"] },
      { p: "morder", s: ["mor", "der"] }
    ]
  },
  {
    id: "qu_gu",
    nome: "qu · gu",
    dica: "Antes de e e i, o u fica calado: quente, guitarra.",
    palavras: [
      { p: "queijo", s: ["quei", "jo"] },
      { p: "quente", s: ["quen", "te"] },
      { p: "quinze", s: ["quin", "ze"] },
      { p: "esquina", s: ["es", "qui", "na"] },
      { p: "guitarra", s: ["gui", "tar", "ra"] },
      { p: "guerra", s: ["guer", "ra"] },
      { p: "foguete", s: ["fo", "gue", "te"] },
      { p: "quadro", s: ["qua", "dro"] },
      { p: "quatro", s: ["qua", "tro"] },
      { p: "aguentar", s: ["a", "guen", "tar"] }
    ]
  },
  {
    id: "compridas",
    nome: "Palavras compridas",
    dica: "Parte a palavra aos bocados e junta-os no fim.",
    palavras: [
      { p: "computador", s: ["com", "pu", "ta", "dor"] },
      { p: "bibliotecária", s: ["bi", "bli", "o", "te", "cá", "ria"] },
      { p: "extraordinário", s: ["ex", "tra", "or", "di", "ná", "rio"] },
      { p: "chocolate", s: ["cho", "co", "la", "te"] },
      { p: "instrumento", s: ["ins", "tru", "men", "to"] },
      { p: "campeonato", s: ["cam", "pe", "o", "na", "to"] },
      { p: "escorregadio", s: ["es", "cor", "re", "ga", "di", "o"] },
      { p: "responsável", s: ["res", "pon", "sá", "vel"] },
      { p: "trovoada", s: ["tro", "vo", "a", "da"] },
      { p: "aniversário", s: ["a", "ni", "ver", "sá", "rio"] }
    ]
  }
];

export function familiaPorId(id) {
  return FAMILIAS.find(f => f.id === id);
}
