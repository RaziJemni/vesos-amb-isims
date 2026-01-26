import { NextRequest, NextResponse } from "next/server";

const APPS_SCRIPT_URL =
    process.env.NEXT_PUBLIC_APPS_SCRIPT_URL ||
    "https://script.google.com/macros/s/AKfycbwAckSAOVpA-95T47jbomhXWSIXfR0ReBOmpB5i7IS1vJQm7rbzwBiNQrogo_uLcdq2Hw/exec";

export async function POST(request: NextRequest) {
    try {
        const formData = await request.json();
        console.log("API received form data:", formData);

        // Forward to Apps Script
        const response = await fetch(APPS_SCRIPT_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        });

        console.log("Apps Script response status:", response.status);
        const result = await response.json();
        console.log("Apps Script response:", result);

        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        console.error("API error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to submit form" },
            { status: 500 },
        );
    }
}
