// imports
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import { type Request, type Response, type NextFunction } from 'express';

const SECRET = process.env.JWT_SECRET;
const AUTH_EMAIL = process.env.AUTH_EMAIL;
const AUTH_PASSWORD = process.env.AUTH_PASSWORD;

/**
 * Interface para representar um Payload do JWT
 * (Não obrigatório, mas recomendado)
 */
interface JwtPayload {
    id: number;
    nome: string;
    email: string;
    role: string;
    exp?: number;
}

/**
 * Gera e trata um token de autenticação para o sistema
 */
export class Auth {

    /**
     * Valida as credenciais do usuário no banco de dados
     * @param req Requisição com as informações do usuário
     * @param res Resposta enviada a quem requisitou o login
     * @returns Token de autenticação caso o usuário seja válido, mensagem de login não autorizado caso negativo
     */
    static async validacaoUsuario(req: Request, res: Response): Promise<Response> {
        const { email, senha } = req.body;

        try {
            if (!SECRET || !AUTH_EMAIL || !AUTH_PASSWORD) {
                return res.status(500).json({ message: 'Autenticacao nao configurada no ambiente.' });
            }

            if (email !== AUTH_EMAIL || senha !== AUTH_PASSWORD) {
                return res.status(401).json({ auth: false, token: null, message: 'Usuario e/ou senha incorretos.' });
            }

            const usuario = { id_usuario: 1, nome: 'Administrador', email: AUTH_EMAIL, role: 'ADMIN' };
            const tokenUsuario = Auth.generateToken(usuario.id_usuario, usuario.nome, usuario.email, usuario.role);
            return res.status(200).json({ auth: true, token: tokenUsuario, usuario });
        } catch (error) {
            console.error(`Erro na autenticacao: ${error}`);
            return res.status(500).json({ message: 'Erro interno do servidor.' });
        }
    }

    /**
     * Gera token de validação do usuário
     * 
     * @param id ID do usuário no banco de dados
     * @param nome Nome do usuário no banco de dados
     * @param email Email do usuário no banco de dados
     * @returns Token de autenticação do usuário
     */
    static generateToken(id: number, nome: string, email: string, role: string) {
        if (!SECRET) {
            throw new Error('JWT_SECRET nao configurado no ambiente.');
        }
        return jwt.sign({ id, nome, email, role }, SECRET, { expiresIn: '1h' });
    }

    /**
     * Verifica o token do usuário para saber se ele é válido
     * 
     * @param req Requisição
     * @param res Resposta
     * @param next Próximo middleware
     * @returns Token validado ou erro
     */
    static verifyToken(req: Request, res: Response, next: NextFunction) {
        if (!SECRET) {
            return res.status(500).json({ message: 'JWT_SECRET nao configurado no ambiente.', auth: false });
        }

        const authorization = req.headers.authorization;
        const token = (req.headers['x-access-token'] as string | undefined)
            ?? (authorization?.startsWith('Bearer ') ? authorization.slice(7) : undefined);

        if (!token) {
            console.log('Token não informado');
            return res.status(401).json({ message: "Token não informado", auth: false }).end();
        }

        jwt.verify(token, SECRET, (err, decoded) => {
            // verifica se ocorreu algum erro na validação do token
            if (err) {
                // verifica se o token já expirou
                if (err.name === 'TokenExpiredError') {
                    console.log('Token expirado');
                    return res.status(401).json({ message: "Token expirado, faça o login novamente", auth: false }).end();
                } else {
                    console.log('Token inválido.');
                    return res.status(401).json({ message: "Token inválido, faça o login", auth: false }).end();
                }
            }

            // garante que o decoded não é undefined antes de continuar
            if (!decoded) {
                console.log('Token não pôde ser decodificado');
                return res.status(401).json({ message: "Token inválido, faça o login", auth: false }).end();
            }

            // desestrutura o objeto JwtPayload e armazena as informações exp e id em variáveis
            const { exp, id } = decoded as JwtPayload;

            // verifica se existe data de expiração ou o id no token que foi recebido pelo cliente
            if (!id) {
                console.log('ID nao encontrado no token');
                return res.status(401).json({ message: 'Token invalido, faca o login.', auth: false }).end();
            }

            // verifica se o tempo de validade do token foi expirado
            const currentTime = Math.floor(Date.now() / 1000);
            if (exp && currentTime > exp) {
                console.log('Token expirado');
                return res.status(401).json({ message: "Token expirado, faça o login novamente", auth: false }).end();
            }

            req.headers['userId'] = String(id);
            next();
        });
    }
}