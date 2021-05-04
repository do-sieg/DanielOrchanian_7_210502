import dotenv from "dotenv";
import jwt from "jsonwebtoken";

// Environment variables
dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET_KEY;

export function createToken(payload) {
    const token = jwt.sign(payload, SECRET_KEY);
    return token;
}

export function verifyToken(token) {
    const result = jwt.verify(token, SECRET_KEY);
    return result;
}

export function decodeToken(token) {
    const result = jwt.decode(token);
    return result;
}

export function storeToken(token) {
    localStorage.setItem('accessToken', token);
}

export function getToken() {
    return localStorage.getItem('accessToken');
}

export function deleteToken() {
    localStorage.removeItem('accessToken');
}
