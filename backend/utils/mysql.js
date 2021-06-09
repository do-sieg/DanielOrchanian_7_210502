// import dotenv from 'dotenv';
import mysql from 'mysql';

// Environment variables
// dotenv.config();

const config = {
    // host: process.env.DB_HOST || 'localhost',
    // user: process.env.DB_USER || 'root',
    // password: process.env.DB_PASSWORD || '',
    // database: process.env.DB_DATABASE || 'groupomania',
    // connectionLimit: process.env.DB_CONNECTIONLIMIT || 20,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'groupomania',
    connectionLimit: 20,
};

const pool = mysql.createPool(config);

export function sqlQuery(queryString) {
    return new Promise(async (resolve, reject) => {
        pool.query(queryString, (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
}

export function sqlEscape(str) {
    return mysql.escape(str);
}
