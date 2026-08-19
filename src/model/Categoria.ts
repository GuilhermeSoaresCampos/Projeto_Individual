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
}

export default Categoria;
