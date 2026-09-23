import pg from 'pg';
import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

// Carrega o .env que está na raiz do projeto
dotenv.config({
    path: path.resolve(
        path.dirname(fileURLToPath(import.meta.url)),
        '../../.env'
    )
});

/**
 * Classe que representa o modelo de banco de dados.
 */
export class DatabaseModel {

    /**
     * Configuração para conexão com o banco de dados
     */
    private _config: object;

    /**
     * Pool de conexões com o banco de dados
     */
    private _pool: pg.Pool;

    /**
     * Cliente de conexão com o banco de dados
     */
    private _client: pg.Client;

    /**
     * Construtor da classe DatabaseModel.
     */
    constructor() {

        this._config = {
            user: process.env.DB_USER,
            host: process.env.DB_HOST,
            database: process.env.DB_NAME,
            password: process.env.DB_PASSWORD,
            port: Number(process.env.DB_PORT),
            max: 10,
            idleTimeoutMillis: 10000
        };

        // Inicialização do pool de conexões
        this._pool = new pg.Pool(this._config);

        // Inicialização do cliente de conexão
        this._client = new pg.Client(this._config);
    }

    /**
     * Método para testar a conexão com o banco de dados.
     */
    public async testeConexao() {

        try {

            await this._client.connect();

            console.log('Database connected!');

            await this._client.end();

            return true;

        } catch (error) {

            console.log('Error to connect database X(');
            console.log(error);

            await this._client.end();

            return false;
        }
    }

    /**
     * Getter para o pool de conexões.
     */
    public get pool() {
        return this._pool;
    }
}