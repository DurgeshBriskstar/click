import { verifyToken } from "server/utils/jwt";
import { SUPER_ADMIN_ROLE, STORE_ADMIN_ROLE } from "utils/constants";

export async function getAuthenticatedUser(req) {
    try {
        const token = req.cookies.get("token")?.value;
        if (!token) return null;

        const decoded = await verifyToken(token);
        return decoded;
    } catch (error) {
        return null;
    }
}

export function hasRole(user, allowedRoles) {
    if (!user || !user.role) return false;
    return allowedRoles.includes(user.role);
}

/**
 * Check if user is super admin
 */
export function isSuperAdmin(user) {
    return hasRole(user, [SUPER_ADMIN_ROLE]);
}

/**
 * Check if user is store admin
 */
export function isStoreAdmin(user) {
    return hasRole(user, [STORE_ADMIN_ROLE]);
}

export function canAccessStore(user, storeId) {
    if (!user) return false;

    if (isSuperAdmin(user)) return true;

    if (isStoreAdmin(user)) {
        const userStoreId = user.store_id ? (typeof user.store_id === 'string' ? parseInt(user.store_id, 10) : user.store_id) : null;
        return userStoreId === storeId;
    }

    return false;
}

