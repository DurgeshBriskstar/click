import { loginSchema, updateUserSchema, forgotPasswordSchema, resetPasswordSchema } from "../validations/auth.schema";
import { findUserByEmail, updateUserService, validatePassword, generateResetToken, saveResetToken, findUserByResetToken, updateUserPassword, hashPassword } from "../services/auth.service";
import { success, error } from "../utils/response";
import { signToken, verifyToken } from "../utils/jwt";
import { userStatus } from "utils/constants";
import { toJson } from "server/utils/convertBigInt";
import { sendPasswordResetEmail } from "../utils/email.service";
import { saveBase64File } from "../utils/saveBase64File";

export const AuthController = {
    // LOGIN
    login: async (req) => {
        try {
            const body = await req.json();
            await loginSchema.validate(body);

            const { email, password } = body;

            const user = await findUserByEmail(email);
            if (!user) return error("Invalid email or password", 400);

            if (user.status !== userStatus.active)
                return error("Your account is inactive. Please contact support.", 403);

            const passOK = await validatePassword(password, user.password);
            if (!passOK) return error("Entered password is incorrect!", 400);

            const token = signToken({
                id: user.id.toString(),
                email: user.email,
                role: user.role,
                store_id: user.store_id ? user.store_id.toString() : null,
            });

            const res = success({
                message: "Login successful",
                data: {
                    id: user.id.toString(),
                    email: user.email,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    phone: user.phone,
                    role: user.role,
                    image: user.image,
                    store_id: user.store_id,
                }
            });

            // Set secure flag - only true if explicitly set AND using HTTPS
            // Check if request is HTTPS
            const protocol = req.headers.get('x-forwarded-proto') ||
                (req.url?.startsWith('https') ? 'https' : 'http');
            const isHttps = protocol === 'https';

            // Only set secure if HTTPS is being used AND explicitly enabled
            const isSecure = isHttps && (process.env.SECURE_COOKIE === 'true' ||
                (process.env.NODE_ENV === 'production' && isHttps));

            res.cookies.set("token", token, {
                httpOnly: true,
                secure: isSecure, // false for HTTP, true only for HTTPS
                sameSite: "lax", // Changed from "strict" to "lax" to allow OAuth redirects
                path: "/",
                maxAge: 60 * 60 * 24,
            });

            return res;

        } catch (err) {
            return error(err.message || "Login failed", 500);
        }
    },

    // LOGOUT
    logout: async () => {
        const res = success({ message: "Logged out" });
        res.cookies.set("token", "", {
            httpOnly: true,
            expires: new Date(0),
            path: "/",
        });
        return res;
    },

    // ME (GET CURRENT USER)
    userInfo: async (req) => {
        try {
            const token = req.cookies.get("token")?.value;
            if (!token) return error("Unauthorized", 401);

            const decoded = await verifyToken(token);
            if (!decoded) return error("Unauthorized", 401);

            const user = await findUserByEmail(decoded.email);
            if (!user) return error("User not found", 404);

            // Check if user is active
            if (user.status !== userStatus.active) {
                // Clear the token cookie
                const res = error("Your account has been deactivated. Please contact support.", 403);
                
                // Set secure flag - only true if explicitly set AND using HTTPS
                const protocol = req.headers.get('x-forwarded-proto') ||
                    (req.url?.startsWith('https') ? 'https' : 'http');
                const isHttps = protocol === 'https';
                const isSecure = isHttps && (process.env.SECURE_COOKIE === 'true' ||
                    (process.env.NODE_ENV === 'production' && isHttps));

                res.cookies.set("token", "", {
                    httpOnly: true,
                    secure: isSecure,
                    sameSite: "lax",
                    path: "/",
                    expires: new Date(0),
                });

                return res;
            }

            return success({
                message: "User info retrived successfully!",
                data: {
                    id: user.id.toString(),
                    email: user.email,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    phone: user.phone,
                    role: user.role,
                    highlevel_franchise_access_token: user.highlevel_franchise_access_token,
                    highlevel_franchise_form_id: user.highlevel_franchise_form_id,
                    image: user.image,
                    store_id: user.store_id,
                }
            });

        } catch (err) {
            return error("Could not load user", 500);
        }
    },

    // --- Update User ---
    updateUser: async (req) => {
        try {
            const token = req.cookies.get("token")?.value;
            if (!token) return error("Unauthorized", 401);

            const user = await verifyToken(token);
            if (!user) return error("Invalid or expired session", 401);

            const body = await req.json();
            await updateUserSchema.validate(body);

            const { email, ...processedBody } = body;

            if (body.image?.base64) {
                const fileName = await saveBase64File(
                    body.image.base64,
                    "users",
                    "profile"
                );
                processedBody.image = `/backend-assets/users/${fileName}`;
            } else if (body.image === null) {
                processedBody.image = null;
            } else if (typeof body.image === "string" && body.image.startsWith("/")) {
                processedBody.image = body.image;
            } else {
                delete processedBody.image;
            }

            const updated = await updateUserService(user.id, processedBody);

            return success({
                message: "Profile updated successfully!",
                data: toJson(updated)
            });

        } catch (err) {
            const status = err.name === "ValidationError" ? 400 : 500;
            return error(err.message, status);
        }
    },

    // --- Forgot Password ---
    forgotPassword: async (req) => {
        try {
            const body = await req.json();
            await forgotPasswordSchema.validate(body);

            const { email } = body;

            const user = await findUserByEmail(email);

            if (!user) {
                return success({
                    message: "If an account with that email exists, we've sent a password reset link."
                });
            }

            if (user.status !== userStatus.active) {
                return error("Your account is inactive. Please contact support.", 403);
            }

            const resetToken = generateResetToken();

            const resetTokenExpiry = new Date();
            resetTokenExpiry.setHours(resetTokenExpiry.getHours() + 1);

            await saveResetToken(user.id, resetToken, resetTokenExpiry);

            const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://127.0.0.1:3007';
            const resetUrl = `${baseUrl}/reset-password?token=${resetToken}`;

            await sendPasswordResetEmail(user.email, resetToken, resetUrl);

            return success({
                message: "If an account with that email exists, we've sent a password reset link."
            });

        } catch (err) {
            return error(err.message || "Failed to process password reset request", 500);
        }
    },

    // --- Verify Reset Token ---
    verifyResetToken: async (req) => {
        try {
            const { searchParams } = new URL(req.url);
            const token = searchParams.get("token");

            if (!token) {
                return error("Reset token is required", 400);
            }

            const user = await findUserByResetToken(token);

            if (!user) {
                return error("Invalid or expired reset token", 400);
            }

            return success({
                message: "Reset token is valid",
                data: {
                    email: user.email,
                    valid: true
                }
            });

        } catch (err) {
            return error(err.message || "Failed to verify reset token", 500);
        }
    },

    // --- Reset Password ---
    resetPassword: async (req) => {
        try {
            const body = await req.json();
            await resetPasswordSchema.validate(body);

            const { token, password } = body;

            const user = await findUserByResetToken(token);

            if (!user) {
                return error("Invalid or expired reset token", 400);
            }

            const hashedPassword = await hashPassword(password);

            await updateUserPassword(user.id, hashedPassword);

            return success({
                message: "Password reset successfully! You can now login with your new password."
            });

        } catch (err) {
            const status = err.name === "ValidationError" ? 400 : 500;
            return error(err.message || "Failed to reset password", status);
        }
    },
};
