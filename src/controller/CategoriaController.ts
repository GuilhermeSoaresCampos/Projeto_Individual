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
}

export default CategoriaController;
