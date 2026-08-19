import { Router, type Request, type Response } from 'express';
import CategoriaController from './controller/CategoriaController.js';
import ProdutoController from './controller/ProdutoController.js';
import MovimentacaoController from './controller/MovimentacaoController.js';
import { Auth } from './middlewares/Auth.js';

const router = Router();

router.post('/api/login', Auth.validacaoUsuario);
router.get('/', (req: Request, res: Response) => {
    return res.status(200).json(`Aplicacao online. Timestamp: ${new Date()}`);
});

router.get('/api/categorias', CategoriaController.todos);
router.post('/api/categorias', CategoriaController.cadastrar);

router.get('/api/produtos', ProdutoController.todos);
router.get('/api/produtos/reposicao', ProdutoController.reposicao);
router.get('/api/produtos/valor-estoque', ProdutoController.valorEstoque);
router.get('/api/produtos/valor-total-estoque', ProdutoController.valorTotal);
router.get('/api/produtos/:id', ProdutoController.produto);
router.post('/api/produtos', ProdutoController.cadastrar);
router.put('/api/produtos/:id', ProdutoController.atualizar);
router.delete('/api/produtos/:id', ProdutoController.remover);

router.get('/api/movimentacoes', MovimentacaoController.todos);
router.post('/api/movimentacoes', MovimentacaoController.cadastrar);

export { router };
