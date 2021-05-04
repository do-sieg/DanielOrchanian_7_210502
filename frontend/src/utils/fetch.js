import { deleteToken, getToken } from "./token";

export async function appFetch(method, url, body = {}) {
    try {
        const options = {
            method,
            headers: {
                'content-type': 'application/json',
            }
        }
        if (getToken()) {
            options.headers.authorization = 'Bearer ' + getToken();
        }
        if (method.toLowerCase() !== 'get') {
            options.body = JSON.stringify(body);
        }
        const response = await fetch('http://localhost:5000' + url, options);

        if (response.status === 404) {
            return { status: 404, data: null, message: "Server not found" };
        }

        const responseJSON = await response.json();
        if (response.status) {
            responseJSON.status = response.status;
        }
        if (responseJSON.status === 401) {
            deleteToken();
        }
        return responseJSON;
    } catch (err) {
        console.warn(err);
        throw err;
    }
}