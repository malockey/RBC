const fs = require('fs');
const { calcularSimilaridade } = require('./similarity');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Converter uma string de gêneros em array
function parseGeneros(generoStr) {
    return generoStr.split(',').map(g => g.trim());
}

// Leitura e parse do CSV
function carregarFilmes(caminhoCSV) {
    const dados = fs.readFileSync(caminhoCSV, 'utf8');
    const linhas = dados.trim().split('\n');
    linhas.shift(); // Remove cabeçalho

    return linhas.map(linha => {
        const valores = linha.split(',');
        return {
            titulo: valores[0],
            genero: parseGeneros(valores[1] + (valores[2] ? ',' + valores[2] : '')),
            duracao: parseInt(valores[3]),
            ano: parseInt(valores[4]),
            nota: parseFloat(valores[5]),
            idioma: valores[6],
            faixaEtaria: valores[7]
        };
    });
}

// Obter peso com fallback para 1
function obterPeso(categoria) {
    return new Promise(resolve => {
        rl.question(`Digite o peso para ${categoria} (ex: 1): `, input => {
            const peso = parseFloat(input);
            resolve(isNaN(peso) ? 1 : peso);
        });
    });
}

// Obter entrada com tratamento e valor padrão se vazio
function obterEntrada(campo) {
    return new Promise(resolve => {
        rl.question(`Digite o valor para ${campo}: `, input => {
            let valor;

            if (!input.trim()) {
                // Valor padrão se vazio
                switch (campo) {
                    case 'genero':
                        valor = ['acao', 'comedia'];
                        break;
                    case 'duracao':
                        valor = 120;
                        break;
                    case 'ano':
                        valor = 2000;
                        break;
                    case 'nota':
                        valor = 8.0;
                        break;
                    case 'idioma':
                        valor = 'ingles';
                        break;
                    case 'faixa etaria':
                        valor = 'livre';
                        break;
                }
            } else {
                // Conversão apropriada
                switch (campo) {
                    case 'genero':
                        valor = input.split(',').map(g => g.trim().toLowerCase());
                        break;
                    case 'duracao':
                    case 'ano':
                        valor = parseInt(input);
                        break;
                    case 'nota':
                        valor = parseFloat(input);
                        break;
                    case 'idioma':
                    case 'faixa etaria':
                        valor = input.trim().toLowerCase();
                        break;
                    default:
                        valor = input;
                }
            }

            resolve(valor);
        });
    });
}

// Função principal
async function main() {
    const entrada = {};
    const pesos = {};

    entrada.genero = await obterEntrada('genero');
    entrada.duracao = await obterEntrada('duracao');
    entrada.ano = await obterEntrada('ano');
    entrada.nota = await obterEntrada('nota');
    entrada.idioma = await obterEntrada('idioma');
    entrada.faixaEtaria = await obterEntrada('faixa etaria');

    pesos.genero = await obterPeso('genero');
    pesos.duracao = await obterPeso('duracao');
    pesos.ano = await obterPeso('ano');
    pesos.nota = await obterPeso('nota');
    pesos.idioma = await obterPeso('idioma');
    pesos.faixaEtaria = await obterPeso('faixa etaria');

    console.log('\nPesos definidos:', pesos);

    const filmes = carregarFilmes('./data/filmes.csv');

    const similares = filmes.map(filme => ({
        titulo: filme.titulo,
        ano: filme.ano,
        similaridade: calcularSimilaridade(filme, entrada, pesos)
    })).sort((a, b) => b.similaridade - a.similaridade);

    console.log('\nTop 10 filmes similares:');
    similares.slice(0, 10).forEach((filme, index) => {
        console.log(`${index + 1}. ${filme.titulo} (${filme.ano}) - Similaridade: ${(filme.similaridade*100).toFixed(2)}%`);
    });

    rl.close();
}

main();
