import { DatabaseModel } from './DatabaseModel.js';
import type CategoriaDTO from '../dto/CategoriaDTO.js';

const database = new DatabaseModel().pool;

class Categoria {
    static async listar(): Promise<CategoriaDTO[]> {
        const result = await database.query('SELECT id_categoria, nome FROM categoria ORDER BY nome');
        return result.rows as CategoriaDTO[];
    }

    static async cadastrar(categoria: CategoriaDTO): Promise<CategoriaDTO> {
        const result = await database.query(
            'INSERT INTO categoria (nome) VALUES ($1) RETURNING id_categoria, nome',
            [categoria.nome]
        );
        return result.rows[0] as CategoriaDTO;
    }

    static async atualizar(id: number, categoria: CategoriaDTO): Promise<CategoriaDTO | null> {
        const result = await database.query(
            `UPDATE categoria
             SET nome = $1
             WHERE id_categoria = $2
             RETURNING id_categoria, nome`,
            [categoria.nome, id]
        );
        return (result.rows[0] as CategoriaDTO | undefined) ?? null;
    }

    static async remover(id: number): Promise<boolean> {
        const result = await database.query(
            'DELETE FROM categoria WHERE id_categoria = $1',
            [id]
        );
        return (result.rowCount ?? 0) > 0;
    }
}

export default Categoria;
