const fs = require('fs');
const { calcularSimilaridade } = require('./similarity');

// Converter uma string de gêneros em array, adicionado por ','
function parseGeneros(generoStr) {
    return generoStr.split(',').map(g => g.trim());
}

// Leitura e parse do CSV
function carregarFilmes(caminhoCSV) {
    const dados = fs.readFileSync(caminhoCSV, 'utf8');
    const linhas = dados.trim().split('\n');
    const cabecalho = linhas.shift().split(',');

    return linhas.map(linha => {
        const valores = linha.split(',');
        return {
            titulo: valores[0],
            genero: parseGeneros(valores[1] + (valores[2] ? ',' + valores[2] : '')), // Para lidar com gêneros compostos
            duracao: parseInt(valores[3]),
            ano: parseInt(valores[4]),
            nota: parseFloat(valores[5]),
            idioma: valores[6],
            faixaEtaria: valores[7]
        };
    });
}

// Exemplo de entrada
const entrada = {
    genero: ['Ação', 'Romance'],
    duracao: 119,
    ano: 1999,
    nota: 9.0,
    idioma: 'Inglês',
    faixaEtaria: 'Livre'
};

const pesos = {
    genero: 2,
    duracao: 1,
    ano: 1,
    nota: 2,
    idioma: 1,
    faixaEtaria: 1
};

const filmes = carregarFilmes('./data/filmes.csv');

const similares = filmes.map(filme => ({
    titulo: filme.titulo,
    ano: filme.ano,
    similaridade: calcularSimilaridade(filme, entrada, pesos)
})).sort((a, b) => b.similaridade - a.similaridade);

// Mostrar os 10 mais similares
console.log('Top 10 filmes similares:');
similares.slice(0, 10).forEach((filme, index) => {
    console.log(`${index + 1}. ${filme.titulo} (${filme.ano}) - Similaridade: ${(filme.similaridade*100).toFixed(2)}`);
});
