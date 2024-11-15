import mysql from 'mysql2/promise';
import 'dotenv/config';
import * as url from 'url';
import { create } from 'domain';

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

    const createImagesTable = `
        CREATE TABLE IF NOT EXISTS images (
            id int unsigned NOT NULL AUTO_INCREMENT,
            user_id int unsigned NOT NULL,
            url varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
            PRIMARY KEY (id)
        )
    `

    const createAchievementsTable = `
        CREATE TABLE IF NOT EXISTS achievements (
            id int unsigned NOT NULL AUTO_INCREMENT,
            name VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
            description varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
            condition_query varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
            PRIMARY KEY (id)
        )
    `

    const createUserAchievementsTable = `
    CREATE TABLE IF NOT EXISTS user_achievements (
        user_id int unsigned NOT NULL,
        achievement_id int unsigned NOT NULL,
        date_achieved DATETIME NOT NULL,
        PRIMARY KEY (user_id, achievement_id),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (achievement_id) REFERENCES achievements(id) ON DELETE CASCADE
    )
`

    const createUserMetricsTable = `
        CREATE TABLE IF NOT EXISTS user_metrics (
            id int unsigned NOT NULL AUTO_INCREMENT,
            user_id int unsigned NOT NULL,
            total_points int unsigned NOT NULL,
            games_played int unsigned NOT NULL,
            average_score int unsigned NOT NULL,
            perfect_guesses int unsigned NOT NULL,
            highest_streak int unsigned NOT NULL,
            PRIMARY KEY (id),
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
    `

    await pool.query(createUsersTable);
    await pool.query(createAchievementsTable);
    await pool.query(createUserAchievementsTable);
    await pool.query(createUserMetricsTable);
    await pool.query(createTokenBlacklist);
    await pool.query(createImagesTable);

    console.log('Tables created');
}

export default pool;