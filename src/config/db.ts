import mysql from 'mysql2/promise';
import 'dotenv/config';
import * as url from 'url';
import { create } from 'domain';

// const dbUrl = process.env.JAWSDB_URL || '';

// const connectionParams = url.parse(dbUrl);
// const [user, password] = (connectionParams.auth || '').split(':');
// const [host, port] = (connectionParams.host || '').split(':');
// const database = (connectionParams.pathname || '').substring(1);
// const port2 = parseInt(port || '3306');

const user = process.env.STACKHERO_MYSQL_USER;
const password = process.env.STACKHERO_MYSQL_PASSWORD;
const host = process.env.STACKHERO_MYSQL_HOST;
const database = process.env.STACKHERO_MYSQL_NAME;
const port2 = Number(process.env.STACKHERO_MYSQL_PORT);


const pool = mysql.createPool({
    host: host,
    user: user,
    password: password,
    database: database,
    port: port2,
    waitForConnections: true,
    connectionLimit: 100,
    connectTimeout: 10000,
    queueLimit: 0,
});

export default pool;
