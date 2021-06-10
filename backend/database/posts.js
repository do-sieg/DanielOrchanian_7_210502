import { sqlEscape, sqlQuery } from "../utils/mysql";

// Table name
const TABLE_NAME = "posts";
// Table field aliases
const SELECT_FIELDS = [
    "post_id AS id",
    "post_parent_id AS parentId",
    "post_user_id AS userId",
    "post_title AS title",
    "post_text AS text",
    "post_image_path AS imagePath",
    "post_creation_date AS creationDate",
];

// Initialize posts table
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

// Get single post
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

// Get posts belonging to a parent (0 = posts with no parent)
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

// Get all posts who have no parent (root posts)
export async function getAllParentPosts(fields = SELECT_FIELDS) {
    try {
        const rows = await getPostsByParentId(0, fields, "desc");
        return rows;
    } catch (err) {
        throw err;
    }
}

// Get replies to a post
export async function getReplies(parentId, fields = SELECT_FIELDS) {
    return await getPostsByParentId(parentId, fields, "asc");
}

// Get a post with its replies
export async function getPostWithReplies(postId, fields = SELECT_FIELDS) {
    try {
        const post = await getPostById(postId, fields);
        if (post !== null) {
            // Load replies and add them to the post
            const replies = await getReplies(postId, fields);
            post.replies = replies;
        }
        return post;
    } catch (err) {
        throw err;
    }
}

// Create post
export async function createPost(parentId, userId, title, text, imagePath = "") {
    try {
        const result = await sqlQuery(`
            INSERT INTO ${TABLE_NAME} (post_parent_id, post_user_id, post_title, post_text, post_image_path)
            VALUES (${parentId}, '${userId}', ${sqlEscape(title)}, ${sqlEscape(text)}, '${imagePath}')
        `);
        return result.insertId;
    } catch (err) {
        throw err;
    }
}

// Edit post
export async function editPost(postId, title, text, imagePath = "") {
    try {
        await sqlQuery(`
            UPDATE ${TABLE_NAME} SET
            post_title = ${sqlEscape(title)},
            post_text = ${sqlEscape(text)},
            post_image_path = '${imagePath}'
            WHERE post_id = ${postId}
        `);
        return true;
    } catch (err) {
        throw err;
    }
}

// Delete single post
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

// Delete posts from a user
export async function deletePostsByUserId(userId) {
    try {
        // Find user posts
        const rows = await sqlQuery(`
            SELECT post_id FROM ${TABLE_NAME} WHERE post_user_id = ${userId}
        `);
        const userPostsIds = rows.map(post => post.post_id);
        // Delete user posts (and all replies)
        for (const postId of userPostsIds) {
            await deletePost(postId);
        }
        // Delete user account
        await sqlQuery(`
            DELETE FROM ${TABLE_NAME}
            WHERE post_user_id = ${userId}
        `);
        return true;
    } catch (err) {
        throw err;
    }
}
