import { sqlQuery } from "../utils/mysql";

const TABLE_NAME = "posts";
const SELECT_FIELDS = [
    "post_id AS id",
    "post_parent_id AS parentId",
    // "post_user_id AS userId",
    "post_title AS title",
    "post_text AS text",
    "post_image_path AS imagePath",
    "post_creation_date AS creationDate",
];


export async function initPostsTable() {
    try {
        const result = await sqlQuery(`
            CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (
                post_id INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
                post_parent_id INT(11) DEFAULT 0,
                post_user_id INT(11),
                post_title VARCHAR(255) NOT NULL,
                post_text TEXT,
                post_image_path VARCHAR(255),
                post_creation_date DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);
        return result.warningCount === 0;
    } catch (err) {
        throw err;
    }
}


export async function getPostById(postId, fields = SELECT_FIELDS) {
    try {
        const joinTableName = 'users';
        const rows = await sqlQuery(`
            SELECT
                ${TABLE_NAME}.${fields},
                ${joinTableName}.user_first_name AS userFirstName,
                ${joinTableName}.user_last_name AS userLastName
            FROM ${TABLE_NAME}
            JOIN ${joinTableName}
            ON ${TABLE_NAME}.post_user_id = ${joinTableName}.user_id
            WHERE post_id=${postId}
        `);
        return rows.length > 0 ? rows[0] : null;
    } catch (err) {
        throw err;
    }
}


async function getPostsByParentId(parentId, fields, order = "asc") {
    try {
        const joinTableName = 'users';
        const rows = await sqlQuery(`
            SELECT
                ${TABLE_NAME}.${fields},
                ${joinTableName}.user_first_name AS userFirstName,
                ${joinTableName}.user_last_name AS userLastName
            FROM ${TABLE_NAME}
            JOIN ${joinTableName}
            ON ${TABLE_NAME}.post_user_id = ${joinTableName}.user_id
            WHERE post_parent_id = ${parentId}
            ORDER BY post_creation_date ${order}
        `);
        return rows;
    } catch (err) {
        throw err;
    }
}


export async function getAllParentPosts(fields = SELECT_FIELDS) {
    try {
        const rows = await getPostsByParentId(0, fields, "desc");
        return rows;
    } catch (err) {
        throw err;
    }
}


export async function getReplies(parentId, fields = SELECT_FIELDS) {
    return await getPostsByParentId(parentId, fields, "asc");
}


export async function getPostWithReplies(postId, fields = SELECT_FIELDS) {
    try {
        const post = await getPostById(postId, fields);
        if (post !== null) {
            const replies = await getReplies(postId, fields);
            post.replies = replies;
        }
        return post;
    } catch (err) {
        throw err;
    }
}


export async function createPost(parentId, userId, title, text, imagePath = "") {
    try {
        const result = await sqlQuery(`
            INSERT INTO ${TABLE_NAME} (post_parent_id, post_user_id, post_title, post_text, post_image_path)
            VALUES (${parentId}, '${userId}', '${title}', '${text}', '${imagePath}')
        `);
        return result.insertId;
    } catch (err) {
        throw err;
    }
}


export async function editPost(postId, title, text, imagePath = "") {
    try {
        await sqlQuery(`
            UPDATE ${TABLE_NAME} SET
            post_title = '${title}',
            post_text = '${text}',
            post_image_path = '${imagePath}'
            WHERE post_id = ${postId}
        `);
        return true;
    } catch (err) {
        throw err;
    }
}


export async function deletePost(postId) {
    try {
        if (postId <= 0) {
            throw new Error("Invalid post id");
        }
        await sqlQuery(`
            DELETE FROM ${TABLE_NAME}
            WHERE post_id = ${postId} OR post_parent_id = ${postId}
        `);
        return true;
    } catch (err) {
        throw err;
    }
}
