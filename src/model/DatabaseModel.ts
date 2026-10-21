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
     * Pool de conexões com o banco de dados
     */
    private _pool: pg.Pool;

    /**
     * Construtor da classe DatabaseModel.
     */
    constructor() {
        const databaseUrl = process.env.DATABASE_URL;

        if (databaseUrl) {
            const url = new URL(databaseUrl);
            const host = url.hostname;
            const port = Number(url.port || 5432);

            console.log(
                "[DB] Host:",
                host,
                "Port:",
                port,
                "Pooler?",
                host.includes("pooler.supabase.com")
            );

            this._pool = new pg.Pool({
                host,
                port,
                database: decodeURIComponent(url.pathname.replace(/^\/+/, "")),
                user: decodeURIComponent(url.username),
                password: decodeURIComponent(url.password),
                ssl: { rejectUnauthorized: false },
                max: 10,
                idleTimeoutMillis: 10_000
            });
            return;
        }

        this._pool = new pg.Pool({
            user: process.env.DB_USER,
            host: process.env.DB_HOST,
            database: process.env.DB_NAME,
            password: process.env.DB_PASSWORD,
            port: Number(process.env.DB_PORT) || 5432,
            ...(process.env.NODE_ENV === "production"
                ? { ssl: { rejectUnauthorized: false } }
                : {}),
            max: 10,
            idleTimeoutMillis: 10_000
        });
    }

    /**
     * Método para testar a conexão com o banco de dados.
     */
    public async testeConexao(): Promise<boolean> {
        try {
            const { rows } = await this._pool.query("select now()");
            console.log("Database connected!", rows[0].now);
            return true;
        } catch (error) {
            console.error("Error to connect database X(", error);
            console.error("Não foi possível conectar ao banco de dados");
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