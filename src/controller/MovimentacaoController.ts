import { type Request, type Response } from 'express';
import Movimentacao from '../model/Movimentacao.js';
import type { MovimentacaoDTO } from '../dto/MovimentacaoDTO.js';

class MovimentacaoController {
    static async todos(req: Request, res: Response) {
        try {
            return res.status(200).json(await Movimentacao.listar());
        } catch (error) {
            console.error(error);
            return res.status(500).json({ mensagem: 'Erro ao listar movimentacoes.' });
        }
    }

    static async cadastrar(req: Request, res: Response) {
        try {
            return res.status(201).json(await Movimentacao.cadastrar(req.body as MovimentacaoDTO));
        } catch (error) {
            console.error(error);
            return res.status(400).json({ mensagem: 'Movimentacao invalida ou estoque insuficiente.' });
        }
    }
}

export default MovimentacaoController;
