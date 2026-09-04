import { type Request, type Response } from 'express';
import Categoria from '../model/Categoria.js';
import type CategoriaDTO from '../dto/CategoriaDTO.js';

class CategoriaController {
    static async todos(req: Request, res: Response) {
        try {
            return res.status(200).json(await Categoria.listar());
        } catch (error) {
            console.error(error);
            return res.status(500).json({ mensagem: 'Erro ao listar categorias.' });
        }
    }

    static async cadastrar(req: Request, res: Response) {
        try {
            const categoria = await Categoria.cadastrar(req.body as CategoriaDTO);
            return res.status(201).json(categoria);
        } catch (error) {
            console.error(error);
            return res.status(400).json({ mensagem: 'Nao foi possivel cadastrar a categoria.' });
        }
    }

    static async atualizar(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            if (!Number.isInteger(id) || id <= 0) {
                return res.status(400).json({ mensagem: 'Identificador da categoria invalido.' });
            }

            const categoria = await Categoria.atualizar(id, req.body as CategoriaDTO);
            return categoria
                ? res.status(200).json(categoria)
                : res.status(404).json({ mensagem: 'Categoria nao encontrada.' });
        } catch (error) {
            console.error(error);
            return res.status(400).json({
                mensagem: error instanceof Error ? error.message : 'Nao foi possivel atualizar a categoria.'
            });
        }
    }

    static async remover(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            if (!Number.isInteger(id) || id <= 0) {
                return res.status(400).json({ mensagem: 'Identificador da categoria invalido.' });
            }

            const removida = await Categoria.remover(id);
            return removida
                ? res.status(200).json({ mensagem: 'Categoria removida com sucesso.' })
                : res.status(404).json({ mensagem: 'Categoria nao encontrada.' });
        } catch (error) {
            console.error(error);
            return res.status(400).json({
                mensagem: error instanceof Error
                    ? error.message
                    : 'Nao foi possivel remover a categoria.'
            });
        }
    }
}

export default CategoriaController;
