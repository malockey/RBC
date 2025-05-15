# 🎬 Sistema de Recomendação de Filmes

Este projeto é um sistema de recomendação de filmes baseado em similaridade, onde o usuário insere preferências (como gênero, duração, ano, nota, idioma e faixa etária) e define pesos para cada critério. O sistema retorna os 10 filmes mais similares a partir de um arquivo CSV.

## 📦 Requisitos

- [Node.js](https://nodejs.org/) instalado na máquina

## ▶️ Como Executar

1. Clone o repositório ou baixe os arquivos:

```bash
git clone https://github.com/seu-usuario/nome-do-repo.git
cd nome-do-repo
```

2. Certifique-se de que o arquivo filmes.csv está dentro da pasta data/ e tem o seguinte formato:
titulo,genero1,genero2,duracao,ano,nota,idioma,faixaEtaria
Matrix,Ação,Ficção,136,1999,8.7,Inglês,Livre
Titanic,Romance,Drama,195,1997,7.8,Inglês,Livre

Obs.: A coluna de gênero permite dois gêneros separados em colunas (genero1 e genero2).

3. Execute o projeto:

```bash
node index.js
```
