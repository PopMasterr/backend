import mysql from 'mysql2/promise';
import 'dotenv/config';
import * as url from 'url';
import { create } from 'domain';

const dbUrl = process.env.JAWSDB_URL || '';

const connectionParams = url.parse(dbUrl);
const [user, password] = (connectionParams.auth || '').split(':');
const [host, port] = (connectionParams.host || '').split(':');
const database = (connectionParams.pathname || '').substring(1);
const port2 = parseInt(port || '3306');

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

export default pool;
