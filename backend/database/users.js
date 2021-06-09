import { sqlQuery } from "../utils/mysql";
import { deletePostsByUserId } from "./posts";

const TABLE_NAME = "users";
const SELECT_FIELDS = [
    "user_id AS id",
    "user_first_name AS firstName",
    "user_last_name AS lastName",
    "user_email AS email",
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
                user_creation_date DATETIME DEFAULT CURRENT_TIMESTAMP,
                user_active BOOL NOT NULL DEFAULT true
            )
        `);
        return result.warningCount === 0;
    } catch (err) {
        throw err;
    }
}


export async function getUserByEmail(email, fields = SELECT_FIELDS) {
    try {
        const rows = await sqlQuery(`SELECT ${fields} FROM ${TABLE_NAME} WHERE user_email='${email}' AND user_active = ${1}`);
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

export async function createUser(firstName, lastName, email, password) {
    try {
        const result = await sqlQuery(`
            INSERT INTO ${TABLE_NAME} (user_first_name, user_last_name, user_email, user_password)
            VALUES ('${firstName}', '${lastName}', '${email}', '${password}')
        `);
        return result.insertId;
    } catch (err) {
        throw err;
    }
}

export async function updateUser(id, firstName, lastName) {
    try {
        await sqlQuery(`
            UPDATE ${TABLE_NAME} SET
            user_first_name = '${firstName}',
            user_last_name = '${lastName}'
            WHERE user_id = ${id}
        `);
        return true;
    } catch (err) {
        throw err;
    }
}


export async function deleteUser(id) {
    try {
        // await sqlQuery(`
        //     DELETE FROM ${TABLE_NAME}
        //     WHERE user_id = ${id}
        // `);
        await deletePostsByUserId(id);
        return true;
    } catch (err) {
        throw err;
    }
}