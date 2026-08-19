import { DatabaseModel } from './DatabaseModel.js';
import type ProdutoDTO from '../dto/ProdutoDTO.js';

const database = new DatabaseModel().pool;

class Produto {
    static async listar(): Promise<ProdutoDTO[]> {
        const result = await database.query(
            'SELECT * FROM produto WHERE ativo = TRUE ORDER BY nome'
        );
        return result.rows as ProdutoDTO[];
    }

    static async buscar(id: number): Promise<ProdutoDTO | null> {
        const result = await database.query(
            'SELECT * FROM produto WHERE id_produto = $1 AND ativo = TRUE',
            [id]
        );
        return (result.rows[0] as ProdutoDTO | undefined) ?? null;
    }

    static async cadastrar(produto: ProdutoDTO): Promise<boolean> {
        try {
            const result = await database.query(
                `INSERT INTO produto (id_categoria, codigo, nome, descricao, preco_unitario,
                                      quantidade_disponivel, quantidade_minima)
                 VALUES ($1, $2, $3, $4, $5, $6, $7)
                 RETURNING id_produto`,
                [produto.id_categoria, produto.codigo.toUpperCase(), produto.nome.toUpperCase(),
                    produto.descricao ?? null, produto.preco_unitario,
                    produto.quantidade_disponivel ?? 0, produto.quantidade_minima ?? 0]
            );

            if (result.rows.length > 0) {
                console.log(`Produto cadastrado com sucesso. ID: ${result.rows[0].id_produto}`);
                return true;
            }

            return false;
        } catch (error) {
            console.error(`Erro ao cadastrar produto: ${error}`);
            return false;
        }
    }

    static async atualizar(id: number, produto: ProdutoDTO): Promise<ProdutoDTO | null> {
        const result = await database.query(
            `UPDATE produto
             SET id_categoria = $1, codigo = $2, nome = $3, descricao = $4,
                 preco_unitario = $5, quantidade_minima = $6
             WHERE id_produto = $7 AND ativo = TRUE
             RETURNING *`,
            [produto.id_categoria, produto.codigo, produto.nome, produto.descricao ?? null,
                produto.preco_unitario, produto.quantidade_minima ?? 0, id]
        );
        return (result.rows[0] as ProdutoDTO | undefined) ?? null;
    }

    static async desativar(id: number): Promise<boolean> {
        const result = await database.query(
            'UPDATE produto SET ativo = FALSE WHERE id_produto = $1 AND ativo = TRUE',
            [id]
        );
        return (result.rowCount ?? 0) > 0;
    }
}

export default Produto;
