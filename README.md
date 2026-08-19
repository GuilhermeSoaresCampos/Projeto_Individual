# API de Estoque

API REST em Node.js, TypeScript, Express e PostgreSQL para controle de produtos e movimentacoes de estoque.

## Estrutura

- `categoria`: categorias unicas para organizar os produtos.
- `produto`: cadastro, preco, estoque atual, estoque minimo e status ativo.
- `movimentacao`: entradas e saidas imutaveis, com validacao de estoque.

O estoque e alterado automaticamente pelo trigger `fn_atualizar_estoque`. Movimentacoes confirmadas nao podem ser atualizadas ou excluidas; use uma movimentacao de `CORRECAO` quando necessario.

## Rotas principais

- `GET/POST /api/categorias`
- `GET/POST/PUT/DELETE /api/produtos`
- `GET /api/produtos/reposicao`
- `GET /api/produtos/valor-estoque`
- `GET /api/produtos/valor-total-estoque`
- `GET/POST /api/movimentacoes`

Os exemplos para uso no REST Client do VS Code ficam em `infra/requests`.

## Banco de dados

Execute `infra/init.sql` em um PostgreSQL configurado pelas variaveis de ambiente usadas em `src/model/DatabaseModel.ts`. O script cria as tabelas, restricoes, triggers, views e dados iniciais.

Para habilitar o login, configure tambem `JWT_SECRET`, `AUTH_EMAIL` e `AUTH_PASSWORD` no arquivo `.env`. A rota `POST /api/login` recebe `email` e `senha` e retorna um token JWT.

## Execucao

```bash
npm install
npx ts-node src/server.ts
```
