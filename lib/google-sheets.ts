import { JWT } from "google-auth-library";
import { GoogleSpreadsheet } from "google-spreadsheet";

/**
 * Initialize authenticated Google Sheets document
 */
export async function getGoogleSheet() {
    const sheetId = process.env.GOOGLE_SHEET_ID;
    const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const privateKey = (process.env.GOOGLE_PRIVATE_KEY || "").replace(/\\n/g, "\n");

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
