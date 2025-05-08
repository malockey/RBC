function normalizeString(str) {
    return str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();
}

function simNumero(a, b, intervaloMax) {
    if (isNaN(a) || isNaN(b)) return 0;
    return Math.max(0, 1 - Math.abs(a - b) / intervaloMax);
}

function simCategoria(a, b) {
    if (!a || !b) return 0;
    return normalizeString(a) === normalizeString(b) ? 1 : 0;
}

function simGenero(g1, g2) {
    if (!Array.isArray(g1) || !Array.isArray(g2)) return 0;
    const set1 = new Set(g1.map(normalizeString));
    const set2 = new Set(g2.map(normalizeString));
    const intersecao = [...set1].filter(e => set2.has(e));
    const uniao = new Set([...set1, ...set2]);
    return uniao.size === 0 ? 0 : intersecao.length / uniao.size;
}

function calcularSimilaridade(filme, entrada, pesos) {
    const sGenero = simGenero(filme.genero, entrada.genero) * pesos.genero;
    const sDuracao = simNumero(filme.duracao, entrada.duracao, 120) * pesos.duracao;
    const sAno = simNumero(filme.ano, entrada.ano, 30) * pesos.ano;
    const sNota = simNumero(filme.nota, entrada.nota, 10) * pesos.nota;
    const sIdioma = simCategoria(filme.idioma, entrada.idioma) * pesos.idioma;
    const sFaixa = simCategoria(filme.faixaEtaria, entrada.faixaEtaria) * pesos.faixaEtaria;

    const totalSim = sGenero + sDuracao + sAno + sNota + sIdioma + sFaixa;
    const totalPesos = Object.values(pesos).reduce((acc, val) => acc + val, 0);

    return totalPesos > 0 ? totalSim / totalPesos : 0;
}

module.exports = {
    simNumero,
    simCategoria,
    simGenero,
    calcularSimilaridade
};
