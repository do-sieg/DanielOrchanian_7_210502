import { decodeToken, getToken } from "./token";

export const ROLE_USER = 0;
export const ROLE_ADMIN = 1;

function isPostOwner(postUserId) {
    const decoded = decodeToken(getToken());
    if (decoded.id === postUserId) {
        return true;
    }
    return false;
}

function isAdmin() {
    const decoded = decodeToken(getToken());
    if (decoded.role === ROLE_ADMIN) {
        return true;
    }
    return false;
}

export function canEditPost(postUserId) {
    if (isPostOwner(postUserId)) return true;
    return false;
}

export function canDeletePost(postUserId) {
    if (isPostOwner(postUserId)) return true;
    if (isAdmin()) return true;
    return false;
}