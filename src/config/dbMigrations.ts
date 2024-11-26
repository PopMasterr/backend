import pool from "./db"

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

const createGameSessionsTable = `
CREATE TABLE IF NOT EXISTS game_sessions (
    id int unsigned NOT NULL AUTO_INCREMENT,
    code VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
    host_id int unsigned NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (host_id) REFERENCES users(id) ON DELETE CASCADE
)
`

const createGameRoundsTable = `
CREATE TABLE IF NOT EXISTS game_rounds (
    id int unsigned NOT NULL AUTO_INCREMENT,
    game_session_id int unsigned NOT NULL,
    game_id int unsigned NOT NULL,
    round_number int unsigned NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (game_session_id) REFERENCES game_sessions(id) ON DELETE CASCADE,
    FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE
)
`
const createStreakGameTable = `
CREATE TABLE IF NOT EXISTS streak_games (
    id int unsigned NOT NULL AUTO_INCREMENT,
    user_id int unsigned NOT NULL,
    game_id_1 int unsigned NOT NULL,
    game_id_2 int unsigned NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (game_id_1) REFERENCES games(id) ON DELETE CASCADE,
    FOREIGN KEY (game_id_2 ) REFERENCES games(id) ON DELETE CASCADE
)
`


const createGameScoresTable = `
CREATE TABLE IF NOT EXISTS game_scores (
    id int unsigned NOT NULL AUTO_INCREMENT,
    user_id int unsigned NOT NULL,
    game_round_id int unsigned NOT NULL,
    score int unsigned NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (game_round_id) REFERENCES game_rounds(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
)
`

const createClassicGamesTable = `
CREATE TABLE IF NOT EXISTS classic_games (
    id int unsigned NOT NULL AUTO_INCREMENT,
    user_id int unsigned NOT NULL,
    game_id int unsigned NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE
)
`
const createGamesTable = `
CREATE TABLE IF NOT EXISTS games (
    id int unsigned NOT NULL AUTO_INCREMENT,
    population bigint unsigned NOT NULL,
    x1 double NOT NULL,
    y1 double NOT NULL,
    x2 double NOT NULL,
    y2 double NOT NULL,
    PRIMARY KEY (id)
)
`


export const createTables = async () => {
    try {

    } catch (error) {
        console.error('Error creating tables:', error);
    }

    await pool.query(createUsersTable);
    await pool.query(createAchievementsTable);
    await pool.query(createUserAchievementsTable);
    await pool.query(createUserMetricsTable);
    await pool.query(createTokenBlacklist);
    await pool.query(createGamesTable);
    await pool.query(createGameSessionsTable);
    await pool.query(createGameRoundsTable);
    await pool.query(createGameScoresTable);
    await pool.query(createClassicGamesTable);
    await pool.query(createImagesTable);
    await pool.query(createStreakGameTable);

    console.log('Tables created');
}
