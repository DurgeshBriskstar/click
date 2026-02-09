import { prisma } from "lib/prismaClient";
import { ensureModel } from "server/utils/modelGuard";

const quickbooksModel = prisma?.quickbooks_connections;
const userModel = prisma?.users;

const QUICKBOOKS_BASE_URL = {
    sandbox: "https://sandbox-quickbooks.api.intuit.com",
    production: "https://quickbooks.api.intuit.com"
};

const OAUTH_BASE_URL = {
    sandbox: "https://appcenter.intuit.com",
    production: "https://appcenter.intuit.com"
};

const TOKEN_URL = "https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer";

/**
 * Get QuickBooks connection for a user
 */
export async function getQuickBooksConnection(userId) {
    const mdl = ensureModel(quickbooksModel, "quickbooks_connections");
    return await mdl.findUnique({
        where: { user_id: Number(userId) }
    });
}

/**
 * Save or update QuickBooks connection
 */
export async function saveQuickBooksConnection({ userId, realmId, accessToken, refreshToken, expiresIn, environment = "sandbox" }) {
    const mdl = ensureModel(quickbooksModel, "quickbooks_connections");

    // Calculate expiration time (expiresIn is in seconds)
    const accessTokenExpires = new Date(Date.now() + (expiresIn * 1000));

    return await mdl.upsert({
        where: { user_id: Number(userId) },
        create: {
            user_id: Number(userId),
            realm_id: realmId,
            access_token: accessToken,
            refresh_token: refreshToken,
            access_token_expires: accessTokenExpires,
            environment: environment
        },
        update: {
            realm_id: realmId,
            access_token: accessToken,
            refresh_token: refreshToken,
            access_token_expires: accessTokenExpires,
            environment: environment,
            updated_at: new Date()
        }
    });
}

/**
 * Exchange authorization code for access token
 */
export async function exchangeCodeForToken(code, redirectUri, environment = "sandbox") {
    try {
        const clientId = process.env.QUICKBOOKS_CLIENT_ID;
        const clientSecret = process.env.QUICKBOOKS_CLIENT_SECRET;

        if (!clientId || !clientSecret) {
            throw new Error("QuickBooks client credentials not configured");
        }

        const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

        const response = await fetch(TOKEN_URL, {
            method: "POST",
            headers: {
                "Authorization": `Basic ${credentials}`,
                "Content-Type": "application/x-www-form-urlencoded",
                "Accept": "application/json"
            },
            body: new URLSearchParams({
                grant_type: "authorization_code",
                code: code,
                redirect_uri: redirectUri
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`QuickBooks token exchange error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        return data;
    } catch (err) {
        console.error("Error exchanging code for token:", err);
        throw err;
    }
}

/**
 * Refresh access token using refresh token
 */
export async function refreshAccessToken(refreshToken, environment = "sandbox") {
    try {
        const clientId = process.env.QUICKBOOKS_CLIENT_ID;
        const clientSecret = process.env.QUICKBOOKS_CLIENT_SECRET;

        if (!clientId || !clientSecret) {
            throw new Error("QuickBooks client credentials not configured");
        }

        const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

        const response = await fetch(TOKEN_URL, {
            method: "POST",
            headers: {
                "Authorization": `Basic ${credentials}`,
                "Content-Type": "application/x-www-form-urlencoded",
                "Accept": "application/json"
            },
            body: new URLSearchParams({
                grant_type: "refresh_token",
                refresh_token: refreshToken
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`QuickBooks token refresh error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        return data;
    } catch (err) {
        console.error("Error refreshing access token:", err);
        throw err;
    }
}

/**
 * Get valid access token (refresh if needed)
 */
export async function getValidAccessToken(userId) {
    const connection = await getQuickBooksConnection(userId);

    if (!connection) {
        throw new Error("QuickBooks connection not found");
    }

    // Check if token is expired (with 5 minute buffer)
    const expiresAt = new Date(connection.access_token_expires);
    const now = new Date();
    const bufferTime = 5 * 60 * 1000; // 5 minutes

    if (expiresAt.getTime() - now.getTime() < bufferTime) {
        // Token is expired or about to expire, refresh it
        const tokenData = await refreshAccessToken(connection.refresh_token, connection.environment);

        // Update connection with new tokens
        await saveQuickBooksConnection({
            userId,
            realmId: connection.realm_id,
            accessToken: tokenData.access_token,
            refreshToken: tokenData.refresh_token || connection.refresh_token,
            expiresIn: tokenData.expires_in,
            environment: connection.environment
        });

        return tokenData.access_token;
    }

    return connection.access_token;
}

/**
 * Fetch QuickBooks report
 */
export async function fetchQuickBooksReport(userId, reportType, params = {}) {
    try {
        const connection = await getQuickBooksConnection(userId);

        if (!connection) {
            throw new Error("QuickBooks connection not found");
        }

        const accessToken = await getValidAccessToken(userId);
        const baseUrl = QUICKBOOKS_BASE_URL[connection.environment] || QUICKBOOKS_BASE_URL.sandbox;

        // Build query string
        const queryParams = new URLSearchParams();
        if (params.startDate) queryParams.append("start_date", params.startDate);
        if (params.endDate) queryParams.append("end_date", params.endDate);
        if (params.minorversion) queryParams.append("minorversion", params.minorversion);

        const queryString = queryParams.toString();
        const url = `${baseUrl}/v3/company/${connection.realm_id}/reports/${reportType}${queryString ? `?${queryString}` : ''}`;

        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                "Accept": "application/json"
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`QuickBooks API error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        return data;
    } catch (err) {
        console.error("Error fetching QuickBooks report:", err);
        throw err;
    }
}

/**
 * Execute QuickBooks query (e.g. select * from Customer, select * from Item)
 */
export async function fetchQuickBooksQuery(userId, query, params = {}) {
    try {
        const connection = await getQuickBooksConnection(userId);

        if (!connection) {
            throw new Error("QuickBooks connection not found");
        }

        const accessToken = await getValidAccessToken(userId);
        const baseUrl = QUICKBOOKS_BASE_URL[connection.environment] || QUICKBOOKS_BASE_URL.sandbox;

        const queryParams = new URLSearchParams();
        queryParams.append("query", query);
        if (params.minorversion) queryParams.append("minorversion", params.minorversion);

        const url = `${baseUrl}/v3/company/${connection.realm_id}/query?${queryParams.toString()}`;

        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                "Accept": "application/json"
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`QuickBooks API error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        return data;
    } catch (err) {
        console.error("Error executing QuickBooks query:", err);
        throw err;
    }
}

/**
 * Delete QuickBooks connection
 */
export async function deleteQuickBooksConnection(userId) {
    const mdl = ensureModel(quickbooksModel, "quickbooks_connections");
    return await mdl.delete({
        where: { user_id: Number(userId) }
    });
}

/**
 * Get OAuth authorization URL
 * According to QuickBooks OAuth 2.0 documentation:
 * https://developer.intuit.com/app/developer/qbo/docs/develop/authentication-and-authorization/oauth-2.0#authorization-request
 */
export function getOAuthUrl(redirectUri, state, environment = "sandbox") {
    const clientId = process.env.QUICKBOOKS_CLIENT_ID;

    if (!clientId) {
        throw new Error("QuickBooks client ID not configured");
    }

    // Remove trailing slash from redirect URI if present (must match exactly)
    const cleanRedirectUri = redirectUri.replace(/\/$/, '');

    const baseUrl = OAUTH_BASE_URL[environment] || OAUTH_BASE_URL.sandbox;
    const scope = "com.intuit.quickbooks.accounting openid profile email";

    // Build query parameters - URLSearchParams automatically URL encodes
    const params = new URLSearchParams({
        client_id: clientId,
        response_type: "code",
        scope: scope,
        redirect_uri: cleanRedirectUri,
        state: state,
        environment: environment
    });

    return `${baseUrl}/connect/oauth2?${params.toString()}`;
}

