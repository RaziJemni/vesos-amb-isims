import { JWT } from "google-auth-library";
import { GoogleSpreadsheet } from "google-spreadsheet";

/**
 * Format and sanitize the private key to handle Vercel / environment variable
 * edge cases (surrounding quotes, double-escaped newlines, carriage returns).
 */
function formatPrivateKey(key?: string): string {
    if (!key) return "";
    let formatted = key.trim();

    // Strip wrapping quotes (single or double)
    while (
        (formatted.startsWith('"') && formatted.endsWith('"')) ||
        (formatted.startsWith("'") && formatted.endsWith("'"))
    ) {
        formatted = formatted.slice(1, -1).trim();
    }

    // Replace literal escaped newlines (\n) with actual newlines
    formatted = formatted.replace(/\\n/g, "\n");

    // Remove any carriage returns (\r)
    formatted = formatted.replace(/\r/g, "");

    // Strip again in case quotes were nested
    while (
        (formatted.startsWith('"') && formatted.endsWith('"')) ||
        (formatted.startsWith("'") && formatted.endsWith("'"))
    ) {
        formatted = formatted.slice(1, -1).trim();
    }

    return formatted;
}

/**
 * Initialize authenticated Google Sheets document
 */
export async function getGoogleSheet() {
    const sheetId = process.env.GOOGLE_SHEET_ID;
    const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const privateKey = formatPrivateKey(process.env.GOOGLE_PRIVATE_KEY);

    if (!sheetId || !clientEmail || !privateKey) {
        throw new Error(
            "Missing Google Sheets credentials in environment variables (GOOGLE_SHEET_ID, GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY)"
        );
    }

    const auth = new JWT({
        email: clientEmail,
        key: privateKey,
        scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const doc = new GoogleSpreadsheet(sheetId, auth);
    await doc.loadInfo();

    // Use the first sheet (default "Form Responses 1")
    const sheet = doc.sheetsByIndex[0];
    await sheet.loadHeaderRow();

    return sheet;
}
