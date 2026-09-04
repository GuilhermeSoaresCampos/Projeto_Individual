import { type Request, type Response } from 'express';
import Movimentacao from '../model/Movimentacao.js';
import type { CorrecaoMovimentacaoDTO, MovimentacaoDTO } from '../dto/MovimentacaoDTO.js';

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
            return res.status(400).json({
                mensagem: error instanceof Error ? error.message : 'Movimentacao invalida ou estoque insuficiente.'
            });
        }
    }

    static async corrigir(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            if (!Number.isInteger(id) || id <= 0) {
                return res.status(400).json({ mensagem: 'Identificador da movimentacao invalido.' });
            }

            const correcao = req.body as CorrecaoMovimentacaoDTO;
            const movimentacao = await Movimentacao.corrigir(id, correcao);
            if (!movimentacao) {
                return res.status(404).json({ mensagem: 'Movimentacao original nao encontrada.' });
            }

            return res.status(201).json(movimentacao);
        } catch (error) {
            console.error(error);
            return res.status(400).json({
                mensagem: error instanceof Error ? error.message : 'Correcao invalida ou estoque insuficiente.'
            });
        }
    }
}

export default MovimentacaoController;
