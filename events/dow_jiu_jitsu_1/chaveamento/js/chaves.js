
const ordemSexo = ["FEMININO", "MASCULINO"];
const ordemIdade = [
  "PRÉ-MIRIM",
  "MIRIM A",
  "MIRIM B",
  "INFANTIL A",
  "INFANTIL B",
  "INFANTO JUVENIL",
  "JUVENIL",
  "ADULTO",
  "MASTER 1",
  "MASTER 2",
  "MASTER 3",
  "MASTER 4",
  "MASTER 5",
  "MASTER 6",
];
const ordemFaixa = [
  "INICIANTE",
  "AZUL",
  "ROXA",
  "MARROM",
  "PRETA",
  "CORAL",
];
const ordemPeso = [
  "GALO",
  "PLUMA",
  "PENA",
  "LEVE",
  "MÉDIO",
  "MEIO-PESADO",
  "PESADO",
  "SUPER PESADO",
  "PESADÍSSIMO",
  "SUPER PESADÍSSIMO",
];

function normalizarFaixa(faixa) {
  const faixasIniciantes = [
    "BRANCA",
    "VERDE",
    "CINZA",
    "LARANJA",
    "AMARELA",
  ];
  faixa = faixa.toUpperCase();
  if (faixasIniciantes.includes(faixa)) {
    return "INICIANTE";
  }
  return faixa;
}

function compararGrupos(chaveA, chaveB) {
  const [sexoA, idadeA, faixaA, pesoA] = chaveA.split(" - ");
  const [sexoB, idadeB, faixaB, pesoB] = chaveB.split(" - ");

  const indexSexoA = ordemSexo.indexOf(sexoA);
  const indexSexoB = ordemSexo.indexOf(sexoB);
  if (indexSexoA !== indexSexoB) return indexSexoA - indexSexoB;

  const indexIdadeA = ordemIdade.indexOf(idadeA);
  const indexIdadeB = ordemIdade.indexOf(idadeB);
  if (indexIdadeA !== indexIdadeB) return indexIdadeA - indexIdadeB;

  const indexFaixaA = ordemFaixa.indexOf(faixaA);
  const indexFaixaB = ordemFaixa.indexOf(faixaB);
  if (indexFaixaA !== indexFaixaB) return indexFaixaA - indexFaixaB;

  const indexPesoA = ordemPeso.indexOf(pesoA);
  const indexPesoB = ordemPeso.indexOf(pesoB);
  if (indexPesoA !== indexPesoB) return indexPesoA - indexPesoB;

  return 0;
}

function criarChaveamento(atletas) {
  const numAtletas = atletas.length;
  const chave = document.createElement("div");
  chave.classList.add("chave");

  if (numAtletas <= 1) {
    const lutaDiv = document.createElement("div");
    lutaDiv.classList.add("luta");

    const atletaDiv = document.createElement("div");
    atletaDiv.classList.add("atleta");
    atletaDiv.innerHTML = `
      <div class="nome">${atletas[0].nome}</div>
      <div class="equipe">${atletas[0].equipe}</div>
    `;

    lutaDiv.appendChild(atletaDiv);
    chave.appendChild(lutaDiv);
    return chave;
  }

  const numRounds = Math.ceil(Math.log2(numAtletas));
  const numeroIdeal = Math.pow(2, numRounds);

  let atletasComByes = [...atletas];
  while (atletasComByes.length < numeroIdeal) {
    atletasComByes.push({ nome: "BYE", equipe: "-" });
  }

  let lutas = [];
  const atletasUsados = new Set();

  // Primeiro, tentar combinar atletas de equipes diferentes
  for (let i = 0; i < atletasComByes.length; i++) {
    if (atletasUsados.has(i)) continue;
    const atleta1 = atletasComByes[i];

    for (let j = i + 1; j < atletasComByes.length; j++) {
      if (atletasUsados.has(j)) continue;
      const atleta2 = atletasComByes[j];

      if (atleta1.equipe !== atleta2.equipe) {
        lutas.push([atleta1, atleta2]);
        atletasUsados.add(i);
        atletasUsados.add(j);
        break;
      }
    }
  }

  // Depois, combinar os atletas restantes
  for (let i = 0; i < atletasComByes.length; i++) {
    if (atletasUsados.has(i)) continue;
    for (let j = i + 1; j < atletasComByes.length; j++) {
      if (atletasUsados.has(j)) continue;
      lutas.push([atletasComByes[i], atletasComByes[j]]);
      atletasUsados.add(i);
      atletasUsados.add(j);
      break;
    }
  }

  let rodadaAtual = lutas;
  for (let i = 0; i < numRounds; i++) {
    const rodadaDiv = document.createElement("div");
    rodadaDiv.classList.add("rodada");

    rodadaAtual.forEach((luta, index) => {
      const lutaDiv = document.createElement("div");
      lutaDiv.classList.add("luta");

      // Primeiro atleta
      const atleta1Div = document.createElement("div");
      atleta1Div.classList.add("atleta");
      if (luta[0].nome === "BYE") atleta1Div.classList.add("bye");
      atleta1Div.innerHTML = `
        <div class="nome">${luta[0].nome}</div>
        <div class="equipe">${luta[0].equipe}</div>
      `;

      // Segundo atleta
      const atleta2Div = document.createElement("div");
      atleta2Div.classList.add("atleta");
      if (luta[1].nome === "BYE") atleta2Div.classList.add("bye");
      atleta2Div.innerHTML = `
        <div class="nome">${luta[1].nome}</div>
        <div class="equipe">${luta[1].equipe}</div>
      `;

      lutaDiv.appendChild(atleta1Div);
      lutaDiv.appendChild(atleta2Div);
      rodadaDiv.appendChild(lutaDiv);
    });

    chave.appendChild(rodadaDiv);

    rodadaAtual = Array.from(
      { length: Math.ceil(rodadaAtual.length / 2) },
      (_, i) => [
        { nome: `Vencedor ${i * 2 + 1}`, equipe: "-" },
        { nome: `Vencedor ${i * 2 + 2}`, equipe: "-" },
      ]
    );
  }

  return chave;
}

fetch(
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQGkceBQyWRfzzlCOB4fdC9AtI5qKCT8CJFMlX81t8GuUObzE0KAA3aZvfGPdkL9i_uTpmHE-Nuqd84/pub?gid=387003481&single=true&output=csv"
)
  .then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.text();
  })
  .then((csvData) => {
    const atletas = csvData
      .split("\n")
      .slice(1)
      .map((row) => {
        const cols = row.split(",");
        return {
          nome: cols[0]?.trim() || "Não informado",
          equipe: cols[1]?.trim() || "Não informado",
          sexo: (cols[2]?.trim() || "Não informado").toUpperCase(),
          faixa: normalizarFaixa(cols[3]?.trim() || "Não informado"),
          idade: (cols[4]?.trim() || "Não informado").toUpperCase(),
          peso: cols[5]?.trim() || "Não informado",
          absoluto: cols[6]?.trim() || "Não informado",
        };
      });

    const grupos = {};

    atletas.forEach((atleta) => {
      const chave = `${atleta.sexo} - ${atleta.idade} - ${atleta.faixa} - ${atleta.peso}`;
      if (!grupos[chave]) {
        grupos[chave] = [];
      }
      grupos[chave].push(atleta);
    });

    const gruposDiv = document.getElementById("grupos");
    const chavesOrdenadas = Object.keys(grupos).sort(compararGrupos);

    chavesOrdenadas.forEach((chave) => {
      const grupoDiv = document.createElement("div");
      grupoDiv.classList.add("grupo");
      grupoDiv.innerHTML = `<h2>${chave}</h2>`;

      const atletasGrupo = grupos[chave];
      const chaveamento = criarChaveamento(atletasGrupo);
      grupoDiv.appendChild(chaveamento);
      gruposDiv.appendChild(grupoDiv);
    });
  })
  .catch((error) => {
    console.error("Erro ao carregar dados:", error);
    const gruposDiv = document.getElementById("grupos");
    gruposDiv.innerHTML =
      "<p>Erro ao carregar os dados. Verifique o console para mais detalhes.</p>";
  });