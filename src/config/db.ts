import mysql from 'mysql2/promise';
import 'dotenv/config';
import * as url from 'url';

const dbUrl = process.env.JAWSDB_URL || '';

const connectionParams = url.parse(dbUrl);
const [user, password] = (connectionParams.auth || '').split(':');
const [host, port] = (connectionParams.host || '').split(':');
const database = (connectionParams.pathname || '').substring(1); 
const port2: number = parseInt(port || '3306');

const pool = mysql.createPool({
    host: host,
    user: user,
    password: password,
    database: database,
    port: port2,
    waitForConnections: true,
    connectionLimit: 10,
    connectTimeout: 10000,
    queueLimit: 0,
});

export const createTables = async () => {
    const createUsersTable = `
        CREATE TABLE IF NOT EXISTS users (
            id int unsigned NOT NULL AUTO_INCREMENT,
            username varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
            password varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
            PRIMARY KEY (id)
        )
    `
    const createTokenBlacklist = `
        CREATE TABLE IF NOT EXISTS blacklist (
        id int unsigned NOT NULL AUTO_INCREMENT,
        token varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
        expiration_date int NOT NULL,
        PRIMARY KEY (id)
        )
    `

    await pool.query(createUsersTable);
    await pool.query(createTokenBlacklist);

    console.log('Tables created');
}

export default pool;