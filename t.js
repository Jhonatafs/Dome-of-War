function normalizarFaixa(faixa) {
  const faixasIniciantes = ["BRANCA", "VERDE", "CINZA", "LARANJA", "AMARELA"];
  faixa = faixa.toUpperCase();
  return faixasIniciantes.includes(faixa) ? "INICIANTE" : faixa;
}

function organizarLista(atletas) {
  // Ordena a lista de atletas por ordem alfabética de equipe
  atletas.sort((a, b) => {
    const equipeA = a.equipe.toUpperCase(); // Converte para maiúsculas para ordenação
    const equipeB = b.equipe.toUpperCase();
    if (equipeA < equipeB) {
      return -1; // Equipe A vem antes
    }
    if (equipeA > equipeB) {
      return 1; // Equipe B vem antes
    }
    return 0; // Equipes iguais
  });
  return atletas;
}

// Carregar dados da planilha CSV
fetch(
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQGkceBQyWRfzzlCOB4fdC9AtI5qKCT8CJFMlX81t8GuUObzE0KAA3aZvfGPdkL9i_uTpmHE-Nuqd84/pub?gid=387003481&single=true&output=csv"
)
  .then((response) => response.text()) // Converte a resposta para texto
  .then((csvData) => {
    // Divide os dados CSV em linhas, remove a primeira linha (cabeçalho) e mapeia cada linha para um objeto atleta
    const atletas = csvData
      .split("\n")
      .slice(1)
      .map((row) => {
        // Divide a linha em colunas
        const cols = row.split(",");
        // Retorna um objeto atleta com os dados das colunas, tratando valores vazios e normalizando alguns campos
        return {
          nome: cols[0]?.trim() || "", // Nome do atleta
          equipe: cols[1]?.trim() || "", // Equipe do atleta
          sexo: (cols[2]?.trim() || "").toUpperCase(), // Sexo do atleta (em maiúsculas)
          faixa: normalizarFaixa(cols[3]?.trim() || ""), // Faixa do atleta (normalizada)
          idade: (cols[4]?.trim() || "").toUpperCase(), // Idade do atleta (em maiúsculas)
          peso: cols[5]?.trim() || "", // Peso do atleta
          absoluto: cols[6]?.trim() || "", // Absoluto
          peso: cols[7]?.trim() || "", // Luta 1
          peso: cols[8]?.trim() || "", // Luta 2
          peso: cols[9]?.trim() || "", // Luta 3
          peso: cols[10]?.trim() || "", // Luta 4
          peso: cols[11]?.trim() || "", // Luta 5
          peso: cols[12]?.trim() || "", // Luta 6
          peso: cols[13]?.trim() || "", // Luta 7
          peso: cols[14]?.trim() || "", // Luta 8
          peso: cols[15]?.trim() || "", // Luta 9
        };
      });

    // Cria um objeto para armazenar os atletas agrupados
    const grupos = {};
    // Itera sobre a lista de atletas
    atletas.forEach((atleta) => {
      const chave = `${atleta.sexo} - ${atleta.idade} - ${atleta.faixa} - ${atleta.peso}`;
      if (!grupos[chave]) grupos[chave] = [];
      grupos[chave].push(atleta);

      console.log(chave); // Exibe a chave do grupo

      // Ordena a lista de atletas do grupo
      const atletasOrdenados = organizarLista(grupos[chave]);

      // Itera sobre os atletas ordenados e exibe suas informações
      atletasOrdenados.forEach((atletaGrupo) => {
        // Itera sobre cada atleta do grupo
        console.log(atletaGrupo.nome, atletaGrupo.equipe); // Acessa as propriedades de cada atleta
      });


  // Itera sobre os atletas ordenados e exibe suas informações
  atletasOrdenados.forEach((atletaGrupo) => { // Itera sobre cada atleta do grupo
    console.log(atletaGrupo.nome, atletaGrupo.equipe); // Acessa as propriedades de cada atleta
  });

      console.log(); // Linha em branco para separar os grupos
    });
  })
  .catch((error) => {
    // Em caso de erro na requisição ou processamento dos dados, exibe uma mensagem de erro no console e na página
    console.error("Erro ao carregar dados:", error);
  });
