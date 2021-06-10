import { decodeToken, getToken } from "./token";

export const ROLE_USER = 0;
export const ROLE_ADMIN = 1;

export function isPostOwner(postUserId) {

    const decoded = decodeToken(getToken());
    if (decoded.id === postUserId) {
        return true;
    }
    if (decoded.role === ROLE_ADMIN) {
        return true;
    }

    return false;
}