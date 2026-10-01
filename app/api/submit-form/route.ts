import { NextRequest, NextResponse } from "next/server";
import { getGoogleSheet } from "@/lib/google-sheets";
import { mapFormDataToSheetRow } from "@/lib/form-mapping";

export async function POST(request: NextRequest) {
    try {
        const formData = await request.json();

        // 1. Honeypot check: If the hidden honeypot field has a value, it's a bot
        if (formData.website_url) {
            console.warn("Honeypot triggered, dropping submission quietly.");
            return NextResponse.json({ success: true }, { status: 200 });
        }

        // 2. Basic validation for essential contact info
        if (!formData.fullname || !formData.email || !formData.phone) {
            return NextResponse.json(
                { success: false, error: "Missing required contact fields." },
                { status: 400 },
            );
        }

        // 3. Connect to Google Sheet
        const sheet = await getGoogleSheet();

        // 4. Map the submitted form data flexibly to the sheet columns
        const rowData = mapFormDataToSheetRow(formData, sheet.headerValues);

        // 5. Append row to Google Sheets (insert: true ensures new rows are inserted sequentially rather than overwriting)
        await sheet.addRow(rowData, { insert: true });

        console.log("Successfully appended row to Google Sheet for:", formData.fullname);

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error: any) {
        console.error("API submit-form error:", error);
        return NextResponse.json(
            {
                success: false,
                error: error.message || "Failed to submit form to Google Sheets",
            },
            { status: 500 },
        );
    }
}
