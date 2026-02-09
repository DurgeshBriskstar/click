import { prisma } from "lib/prismaClient";
import bcrypt from "bcryptjs";
import crypto from "crypto";

export async function findUserByEmail(email) {
    return prisma.users.findFirst({ where: { email } });
}

export async function validatePassword(password, hash) {
    return bcrypt.compare(password, hash);
}

export const updateUserService = async (id, payload) => {
    const data = { ...payload };

    if (payload.password) {
        data.password = await bcrypt.hash(payload.password, 10);
    }

    const updatedUser = await prisma.users.update({
        where: { id: parseInt(id) },
        data,
        select: {
            id: true,
            email: true,
            first_name: true,
            last_name: true,
            phone: true,
            role: true,
            highlevel_franchise_access_token: true,
            highlevel_franchise_form_id: true,
            image: true
        }
    });

    return updatedUser;
};

// Password Reset Functions

/**
 * Generate a secure random reset token
 */
export function generateResetToken() {
    return crypto.randomBytes(32).toString('hex');
}

/**
 * Hash password using bcrypt
 */
export async function hashPassword(password) {
    return bcrypt.hash(password, 10);
}

/**
 * Save reset token to user record
 */
export async function saveResetToken(userId, token, expiryDate) {
    return prisma.users.update({
        where: { id: userId },
        data: {
            reset_token: token,
            reset_token_expiry: expiryDate
        }
    });
}

/**
 * Find user by reset token
 */
export async function findUserByResetToken(token) {
    return prisma.users.findFirst({
        where: {
            reset_token: token,
            reset_token_expiry: {
                gt: new Date() // Token must not be expired
            }
        }
    });
}

/**
 * Clear reset token after successful password reset
 */
export async function clearResetToken(userId) {
    return prisma.users.update({
        where: { id: userId },
        data: {
            reset_token: null,
            reset_token_expiry: null
        }
    });
}

/**
 * Update user password
 */
export async function updateUserPassword(userId, hashedPassword) {
    return prisma.users.update({
        where: { id: userId },
        data: {
            password: hashedPassword,
            reset_token: null,
            reset_token_expiry: null
        },
        select: {
            id: true,
            email: true,
            first_name: true,
            last_name: true,
            phone: true,
            role: true,
            highlevel_franchise_access_token: true,
            highlevel_franchise_form_id: true,
            image: true
        }
    });
}
