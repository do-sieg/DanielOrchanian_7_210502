import axios from 'axios';
import { getToken } from './token';

export async function uploadFile(method, url, file, body) {
    try {
        const formData = new FormData();
        formData.append('image', file);
        formData.append('data', JSON.stringify(body));
        const options = { headers : {} };

        if (getToken()) {
            options.headers.authorization = 'Bearer ' + getToken();
        }

        let response;
        if (method === "post") {
            response = await axios.post('http://localhost:5000' + url, formData, options);
        } else if (method === "put") {
            response = await axios.put('http://localhost:5000' + url, formData, options);
        }
        if (response) {
            const responseData = response.data;
            responseData.status = response.status;
            return responseData;
        } else {
            throw new Error("Bad request method");
        }
    } catch (err) {
        throw err;
    }
}