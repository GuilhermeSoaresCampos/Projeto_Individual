import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { type Request, type Response, type NextFunction } from 'express';
import { DatabaseModel } from '../model/DatabaseModel.js';

// Carrega o arquivo .env que está na raiz do projeto
dotenv.config({
    path: path.resolve(
        path.dirname(fileURLToPath(import.meta.url)),
        '../../.env'
    )
});

const SECRET = process.env.JWT_SECRET;

interface JwtPayload {
    id: number;
    nome: string;
    email: string;
    exp?: number;
}

const database = new DatabaseModel();

export class Auth {

    static async validacaoUsuario(
        req: Request,
        res: Response
    ): Promise<Response> {

        const { email, senha } = req.body;

        try {

            // Verifica se e-mail e senha foram enviados
            if (typeof email !== 'string' || typeof senha !== 'string') {
                return res.status(400).json({
                    auth: false,
                    token: null,
                    mensagem: 'Informe e-mail e senha.'
                });
            }

            // Verifica se o JWT_SECRET está configurado
            if (!SECRET) {
                return res.status(500).json({
                    auth: false,
                    token: null,
                    mensagem: 'JWT_SECRET não configurado no ambiente.'
                });
            }

            // Procura o usuário pelo e-mail no PostgreSQL
            const resultado = await database.pool.query(
                `
                SELECT
                    id_usuario,
                    nome,
                    email,
                    senha
                FROM usuario
                WHERE email = $1
                `,
                [email.trim()]
            );

            // Usuário não encontrado
            if (resultado.rows.length === 0) {
                return res.status(401).json({
                    auth: false,
                    token: null,
                    mensagem: 'Usuário e/ou senha incorretos.'
                });
            }

            const usuarioBanco = resultado.rows[0];

            // Verifica a senha
            if (senha !== usuarioBanco.senha) {
                return res.status(401).json({
                    auth: false,
                    token: null,
                    mensagem: 'Usuário e/ou senha incorretos.'
                });
            }

            // Dados do usuário que serão enviados para o frontend
            const usuario = {
                id_usuario: usuarioBanco.id_usuario,
                nome: usuarioBanco.nome,
                email: usuarioBanco.email
            };

            // Gera o token JWT
            const tokenUsuario = Auth.generateToken(
                usuario.id_usuario,
                usuario.nome,
                usuario.email
            );

            // Retorna os dados para o frontend
            return res.status(200).json({
                auth: true,
                token: tokenUsuario,
                usuario
            });

        } catch (error) {

            console.error('Erro na autenticação:', error);

            return res.status(500).json({
                auth: false,
                token: null,
                mensagem: 'Erro interno do servidor.'
            });
        }
    }

    static generateToken(
        id: number,
        nome: string,
        email: string
    ) {

        if (!SECRET) {
            throw new Error(
                'JWT_SECRET não configurado no ambiente.'
            );
        }

        return jwt.sign(
            {
                id,
                nome,
                email
            },
            SECRET,
            {
                expiresIn: '1h'
            }
        );
    }

    static verifyToken(
        req: Request,
        res: Response,
        next: NextFunction
    ) {

        // Verifica se o JWT_SECRET está configurado
        if (!SECRET) {
            return res.status(500).json({
                mensagem: 'JWT_SECRET não configurado no ambiente.',
                auth: false
            });
        }

        const authorization = req.headers.authorization;

        // Aceita o token pelo x-access-token
        // ou pelo Authorization: Bearer TOKEN
        const token =
            (req.headers['x-access-token'] as string | undefined)
            ??
            (
                authorization?.startsWith('Bearer ')
                    ? authorization.slice(7)
                    : undefined
            );

        // Token não enviado
        if (!token) {
            return res.status(401).json({
                mensagem: 'Token não informado.',
                auth: false
            });
        }

        // Valida o token
        jwt.verify(token, SECRET, (err, decoded) => {

            if (err) {

                if (err.name === 'TokenExpiredError') {
                    return res.status(401).json({
                        mensagem: 'Token expirado, faça o login novamente.',
                        auth: false
                    });
                }

                return res.status(401).json({
                    mensagem: 'Token inválido, faça o login novamente.',
                    auth: false
                });
            }

            if (!decoded) {
                return res.status(401).json({
                    mensagem: 'Token inválido.',
                    auth: false
                });
            }

            const { exp, id } = decoded as JwtPayload;

            // Verifica se existe o ID do usuário
            if (!id) {
                return res.status(401).json({
                    mensagem: 'ID não encontrado no token.',
                    auth: false
                });
            }

            // Verifica manualmente a expiração
            const currentTime = Math.floor(Date.now() / 1000);

            if (exp && currentTime > exp) {
                return res.status(401).json({
                    mensagem: 'Token expirado, faça o login novamente.',
                    auth: false
                });
            }

            // Disponibiliza o ID do usuário para as próximas rotas
            req.headers['userId'] = String(id);

            next();
        });
    }
}