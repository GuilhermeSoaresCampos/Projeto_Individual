import { type Request, type Response } from 'express';
import Produto from '../model/Produto.js';
import type ProdutoDTO from '../dto/ProdutoDTO.js';
import { DatabaseModel } from '../model/DatabaseModel.js';

const database = new DatabaseModel().pool;

class ProdutoController {
    static async todos(req: Request, res: Response) {
        try {
            return res.status(200).json(await Produto.listar());
        } catch (error) {
            console.error(error);
            return res.status(500).json({ mensagem: 'Erro ao listar produtos.' });
        }
    }

    static async produto(req: Request, res: Response) {
        try {
            const produto = await Produto.buscar(Number(req.params.id));
            return produto
                ? res.status(200).json(produto)
                : res.status(404).json({ mensagem: 'Produto nao encontrado.' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ mensagem: 'Erro ao buscar produto.' });
        }
    }

    static async cadastrar(req: Request, res: Response) {
        try {
            const cadastrado = await Produto.cadastrar(req.body as ProdutoDTO);
            return cadastrado
                ? res.status(201).json({ mensagem: 'Produto cadastrado com sucesso.' })
                : res.status(400).json({ mensagem: 'Nao foi possivel cadastrar o produto.' });
        } catch (error) {
            console.error(error);
            return res.status(400).json({ mensagem: 'Nao foi possivel cadastrar o produto.' });
        }
    }

    static async atualizar(req: Request, res: Response) {
        try {
            const produto = await Produto.atualizar(Number(req.params.id), req.body as ProdutoDTO);
            return produto
                ? res.status(200).json(produto)
                : res.status(404).json({ mensagem: 'Produto nao encontrado.' });
        } catch (error) {
            console.error(error);
            return res.status(400).json({ mensagem: 'Nao foi possivel atualizar o produto.' });
        }
    }

    static async remover(req: Request, res: Response) {
        try {
            const removido = await Produto.desativar(Number(req.params.id));
            return removido
                ? res.status(200).json({ mensagem: 'Produto desativado com sucesso.' })
                : res.status(404).json({ mensagem: 'Produto nao encontrado.' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ mensagem: 'Erro ao desativar produto.' });
        }
    }

    static async reposicao(req: Request, res: Response) {
        try {
            const result = await database.query('SELECT * FROM vw_produtos_reposicao ORDER BY nome');
            return res.status(200).json(result.rows);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ mensagem: 'Erro ao consultar reposicao.' });
        }
    }

    static async valorEstoque(req: Request, res: Response) {
        try {
            const result = await database.query('SELECT * FROM vw_valor_produto_estoque ORDER BY nome');
            return res.status(200).json(result.rows);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ mensagem: 'Erro ao consultar valor do estoque.' });
        }
    }

    static async valorTotal(req: Request, res: Response) {
        try {
            const result = await database.query('SELECT * FROM vw_valor_total_estoque');
            return res.status(200).json(result.rows[0]);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ mensagem: 'Erro ao consultar valor total do estoque.' });
        }
    }
}

export default ProdutoController;
