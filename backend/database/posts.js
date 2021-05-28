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


// export async function getUserByEmail(email, fields = SELECT_FIELDS) {
//     try {
//         const rows = await sqlQuery(`SELECT ${fields} FROM ${TABLE_NAME} WHERE user_email='${email}'`);
//         return rows.length > 0 ? rows[0] : null;
//     } catch (err) {
//         throw err;
//     }
// }


export async function getParentPostById(postId, fields = SELECT_FIELDS) {
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
            AND post_parent_id = 0
        `);
        return rows.length > 0 ? rows[0] : null;
    } catch (err) {
        throw err;
    }
}

async function getPostsByParentId(parentId, fields) {
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
        `);
        return rows;
    } catch (err) {
        throw err;
    }
}

export async function getAllParentPosts(fields = SELECT_FIELDS) {
    try {
        const rows = await getPostsByParentId(0, fields);
        // for (const row of rows) {
        //     const replies = await getReplies(row.id);
        //     row.replies = replies;
        // }
        return rows;
    } catch (err) {
        throw err;
    }
}

export async function getPostWithReplies(postId, fields = SELECT_FIELDS) {
    try {
        const post = await getParentPostById(postId, fields);
        if (post !== null) {
            const replies = await getReplies(postId, fields);
            post.replies = replies;
        }
        return post;
    } catch (err) {
        throw err;
    }
}

export async function getReplies(parentId, fields = SELECT_FIELDS) {
    return await getPostsByParentId(parentId, fields);
}

export async function createPost(userId, title, text) {
    try {
        const result = await sqlQuery(`
            INSERT INTO ${TABLE_NAME} (post_user_id, post_title, post_text)
            VALUES ('${userId}', '${title}', '${text}')
        `);
        return result.insertId;
    } catch (err) {
        throw err;
    }
}

// export async function updateUser(id, firstName, lastName) {
//     try {
//         await sqlQuery(`
//             UPDATE ${TABLE_NAME} SET
//             user_first_name = '${firstName}',
//             user_last_name = '${lastName}'
//             WHERE user_id = ${id}
//         `);
//         return true;
//     } catch (err) {
//         throw err;
//     }
// }
