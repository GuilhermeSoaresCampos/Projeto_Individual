import { DatabaseModel } from './DatabaseModel.js';
import type { CorrecaoMovimentacaoDTO, MovimentacaoDTO } from '../dto/MovimentacaoDTO.js';

const database = new DatabaseModel().pool;

class Movimentacao {
    static async listar(): Promise<MovimentacaoDTO[]> {
        const result = await database.query(
            `SELECT m.*, p.codigo, p.nome AS produto
             FROM movimentacao m INNER JOIN produto p ON p.id_produto = m.id_produto
             ORDER BY m.data_movimentacao DESC, m.id_movimentacao DESC`
        );
        return result.rows as MovimentacaoDTO[];
    }

    static async cadastrar(movimentacao: MovimentacaoDTO): Promise<MovimentacaoDTO> {
        const result = await database.query(
            `INSERT INTO movimentacao
                (id_produto, id_movimentacao_origem, tipo, motivo, quantidade,
                 preco_unitario_praticado, valor_total, observacao)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
             RETURNING *`,
            [movimentacao.id_produto, movimentacao.id_movimentacao_origem ?? null,
                movimentacao.tipo, movimentacao.motivo, movimentacao.quantidade,
                movimentacao.preco_unitario_praticado ?? null,
                movimentacao.valor_total ?? null, movimentacao.observacao]
        );
        return result.rows[0] as MovimentacaoDTO;
    }

    static async corrigir(id: number, correcao: CorrecaoMovimentacaoDTO): Promise<MovimentacaoDTO | null> {
        const result = await database.query(
            `INSERT INTO movimentacao
                (id_produto, id_movimentacao_origem, tipo, motivo, quantidade,
                 preco_unitario_praticado, valor_total, observacao)
             SELECT id_produto, id_movimentacao, $2, 'CORRECAO', $3, NULL, NULL, $4
             FROM movimentacao
             WHERE id_movimentacao = $1
             RETURNING *`,
            [id, correcao.tipo, correcao.quantidade, correcao.observacao]
        );

        return (result.rows[0] as MovimentacaoDTO | undefined) ?? null;
    }
}

export default Movimentacao;
