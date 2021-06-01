import axios from 'axios';
import { getToken } from './token';

export async function uploadFile(url, file, body) {
    try {
        const formData = new FormData();
        formData.append('image', file);
        formData.append('data', JSON.stringify(body));
        const options = { headers : {} };

        if (getToken()) {
            options.headers.authorization = 'Bearer ' + getToken();
        }

        const response = await axios.post('http://localhost:5000' + url, formData, options);
        const responseData = response.data;
        responseData.status = response.status;
        return responseData;
    } catch (err) {
        throw err;
    }
}