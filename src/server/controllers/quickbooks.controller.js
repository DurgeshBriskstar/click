import { error, success } from "server/utils/response";
import { getAuthenticatedUser } from "server/utils/auth";
import { getOAuthUrl, exchangeCodeForToken, saveQuickBooksConnection, getQuickBooksConnection, fetchQuickBooksReport, fetchQuickBooksQuery, deleteQuickBooksConnection } from "server/services/quickbooks.service";

export const QuickBooksController = {
    async initiateOAuth(req) {
        try {
            const user = await getAuthenticatedUser(req);
            if (!user) {
                return error("Unauthorized", 401);
            }

            const { searchParams } = new URL(req.url);
            const environment = searchParams.get("environment") || "sandbox";

            // Generate state token with user_id for security
            const timestamp = Date.now();
            const random = Math.random().toString(36).substring(7);
            const state = `qb_${user.id}_${timestamp}_${random}`;

            let redirectUri;
            if (process.env.QUICKBOOKS_REDIRECT_URI) {
                redirectUri = process.env.QUICKBOOKS_REDIRECT_URI.trim();
            } else {
                const protocol = req.headers.get('x-forwarded-proto') || 'http';
                const host = req.headers.get('host');
                // Ensure no trailing slash - QuickBooks is strict about exact matches
                redirectUri = `${protocol}://${host}/api/quickbooks/callback`.replace(/\/$/, '');
            }

            const authUrl = getOAuthUrl(redirectUri, state, environment);

            // Redirect to QuickBooks
            return Response.redirect(authUrl);
        } catch (err) {
            return error(err.message || "Failed to initiate OAuth", 500);
        }
    },

    /**
     * Handle OAuth callback
     */
    async handleCallback(req) {
        try {
            const { searchParams } = new URL(req.url);
            const code = searchParams.get("code");
            const state = searchParams.get("state");
            const realmId = searchParams.get("realmId");
            const errorParam = searchParams.get("error");

            if (errorParam) {
                return Response.redirect(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://127.0.0.1:3007'}/login?quickbooks_error=${encodeURIComponent(errorParam)}`);
            }

            if (!code || !realmId) {
                return Response.redirect(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://127.0.0.1:3007'}/login?quickbooks_error=missing_params`);
            }

            // Extract user_id from state (format: qb_userId_timestamp_random)
            let userId = null;
            if (state && state.startsWith('qb_')) {
                const parts = state.split('_');
                if (parts.length >= 2) {
                    userId = parseInt(parts[1]);
                }
            }

            // If we couldn't get user_id from state, try to get from authenticated session
            if (!userId) {
                const user = await getAuthenticatedUser(req);
                if (user) {
                    userId = parseInt(user.id);
                }
            }

            if (!userId) {
                return Response.redirect(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://127.0.0.1:3007'}/login?quickbooks_error=unauthorized`);
            }

            let redirectUri;
            if (process.env.QUICKBOOKS_REDIRECT_URI) {
                redirectUri = process.env.QUICKBOOKS_REDIRECT_URI.trim();
            } else {
                const protocol = req.headers.get('x-forwarded-proto') || 'http';
                const host = req.headers.get('host');
                // Ensure no trailing slash - must match exactly with authorization request
                redirectUri = `${protocol}://${host}/api/quickbooks/callback`.replace(/\/$/, '');
            }

            const tokenData = await exchangeCodeForToken(code, redirectUri);

            const environment = "sandbox"; // You can determine this from the request

            // Save connection
            await saveQuickBooksConnection({
                userId: userId,
                realmId: realmId,
                accessToken: tokenData.access_token,
                refreshToken: tokenData.refresh_token,
                expiresIn: tokenData.expires_in || 3600,
                environment: environment
            });

            const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://127.0.0.1:3007';
            return Response.redirect(`${baseUrl}/admin/dashboard?quickbooks_success=connected`);
        } catch (err) {
            console.error("QuickBooks callback error:", err);
            return Response.redirect(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://127.0.0.1:3007'}/login?quickbooks_error=${encodeURIComponent(err.message)}`);
        }
    },

    /**
     * Get connection status
     */
    async getConnectionStatus(req) {
        try {
            const user = await getAuthenticatedUser(req);
            if (!user) {
                return error("Unauthorized", 401);
            }

            // Ensure userId is a number
            const userId = typeof user.id === 'string' ? parseInt(user.id, 10) : user.id;

            const connection = await getQuickBooksConnection(userId);

            if (!connection) {
                return success({
                    data: {
                        connected: false,
                        message: "Not connected to QuickBooks"
                    }
                });
            }

            return success({
                data: {
                    connected: true,
                    realmId: connection.realm_id,
                    environment: connection.environment,
                    expiresAt: connection.access_token_expires
                }
            });
        } catch (err) {
            console.error("QuickBooks getConnectionStatus error:", err);
            return error(err.message || "Failed to get connection status", 500);
        }
    },

    /**
     * Get Profit and Loss report
     */
    async getProfitAndLoss(req) {
        try {
            const user = await getAuthenticatedUser(req);
            if (!user) {
                return error("Unauthorized", 401);
            }

            // Ensure userId is a number
            const userId = typeof user.id === 'string' ? parseInt(user.id, 10) : user.id;

            const { searchParams } = new URL(req.url);
            const startDate = searchParams.get("startDate");
            const endDate = searchParams.get("endDate");
            const minorversion = searchParams.get("minorversion") || "65";

            const params = {};
            if (startDate) params.startDate = startDate;
            if (endDate) params.endDate = endDate;
            params.minorversion = minorversion;

            const report = await fetchQuickBooksReport(userId, "ProfitAndLoss", params);

            return success({
                data: {
                    report: report
                }
            });
        } catch (err) {
            console.error("QuickBooks getProfitAndLoss error:", err);
            return error(err.message || "Failed to fetch Profit and Loss report", 500);
        }
    },

    /**
     * Get QuickBooks Customers (query select * from Customer)
     */
    async getCustomers(req) {
        try {
            const user = await getAuthenticatedUser(req);
            if (!user) {
                return error("Unauthorized", 401);
            }

            const userId = typeof user.id === "string" ? parseInt(user.id, 10) : user.id;
            const { searchParams } = new URL(req.url);
            const minorversion = searchParams.get("minorversion") || "65";

            const result = await fetchQuickBooksQuery(userId, "select * from Customer", { minorversion });
            const customers = result?.QueryResponse?.Customer || [];
            const totalCount = result?.QueryResponse?.totalCount ?? customers.length;

            return success({
                data: customers,
                count: totalCount
            });
        } catch (err) {
            console.error("QuickBooks getCustomers error:", err);
            return error(err.message || "Failed to fetch QuickBooks customers", 500);
        }
    },

    /**
     * Get QuickBooks Products/Items (query select * from Item)
     */
    async getProducts(req) {
        try {
            const user = await getAuthenticatedUser(req);
            if (!user) {
                return error("Unauthorized", 401);
            }

            const userId = typeof user.id === "string" ? parseInt(user.id, 10) : user.id;
            const { searchParams } = new URL(req.url);
            const minorversion = searchParams.get("minorversion") || "65";

            const result = await fetchQuickBooksQuery(userId, "select * from Item", { minorversion });
            const items = result?.QueryResponse?.Item || [];
            const totalCount = result?.QueryResponse?.totalCount ?? items.length;

            return success({
                data: items,
                count: totalCount
            });
        } catch (err) {
            console.error("QuickBooks getProducts error:", err);
            return error(err.message || "Failed to fetch QuickBooks products", 500);
        }
    },

    /**
     * Disconnect QuickBooks
     */
    async disconnect(req) {
        try {
            const user = await getAuthenticatedUser(req);
            if (!user) {
                return error("Unauthorized", 401);
            }

            // Ensure userId is a number
            const userId = typeof user.id === 'string' ? parseInt(user.id, 10) : user.id;

            await deleteQuickBooksConnection(userId);

            return success({
                message: "QuickBooks disconnected successfully",
                data: null
            });
        } catch (err) {
            console.error("QuickBooks disconnect error:", err);
            return error(err.message || "Failed to disconnect QuickBooks", 500);
        }
    }
};

