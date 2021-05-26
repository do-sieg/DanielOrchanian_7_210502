import { sqlQuery } from "../utils/mysql";

const TABLE_NAME = "users";
const SELECT_FIELDS = [
    "user_id AS id",
    "user_first_name AS firstName",
    "user_last_name AS lastName",
    "user_email AS email",
    "user_image_path AS imagePath",
    "user_creation_date AS creationDate",
    "user_active AS active",
];


export async function initUsersTable() {
    try {
        const result = await sqlQuery(`
            CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (
                user_id INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
                user_first_name VARCHAR(255) NOT NULL,
                user_last_name VARCHAR(255) NOT NULL,
                user_email VARCHAR(255) NOT NULL,
                user_password VARCHAR(255) NOT NULL,
                user_image_path VARCHAR(255),
                user_creation_date DATETIME DEFAULT CURRENT_TIMESTAMP,
                user_active BOOL NOT NULL DEFAULT false
            )
        `);
        return result.warningCount === 0;
    } catch (err) {
        throw err;
    }
}


export async function getUserByEmail(email, fields = SELECT_FIELDS) {
    try {
        const rows = await sqlQuery(`SELECT ${fields} FROM ${TABLE_NAME} WHERE user_email='${email}'`);
        return rows.length > 0 ? rows[0] : null;
    } catch (err) {
        throw err;
    }
}


export async function getUserById(userId, fields = SELECT_FIELDS) {
    try {
        const rows = await sqlQuery(`SELECT ${fields} FROM ${TABLE_NAME} WHERE user_id='${userId}'`);
        return rows.length > 0 ? rows[0] : null;
    } catch (err) {
        throw err;
    }
}

export async function createUser(firstName, lastName, email, password, imagePath) {
    try {
        const result = await sqlQuery(`
            INSERT INTO ${TABLE_NAME} (user_first_name, user_last_name, user_email, user_password, user_image_path)
            VALUES ('${firstName}', '${lastName}', '${email}', '${password}', '${imagePath}')
        `);
        return result.insertId;
    } catch (err) {
        throw err;
    }
}
