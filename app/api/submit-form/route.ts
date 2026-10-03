import { NextRequest, NextResponse } from "next/server";
import { getGoogleSheet } from "@/lib/google-sheets";
import { mapFormDataToSheetRow } from "@/lib/form-mapping";

// In-memory sliding-window rate limiter per IP: max 5 requests per 10 minutes
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 5;

function isRateLimited(ip: string): boolean {
    if (ip === "unknown") return false;
    const now = Date.now();
    const timestamps = rateLimitMap.get(ip) || [];
    const recent = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);

    if (recent.length >= MAX_REQUESTS_PER_WINDOW) {
        return true;
    }

    recent.push(now);
    rateLimitMap.set(ip, recent);

    // Periodically prune stale entries if map grows large
    if (rateLimitMap.size > 500) {
        for (const [key, times] of rateLimitMap.entries()) {
            const valid = times.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
            if (valid.length === 0) rateLimitMap.delete(key);
            else rateLimitMap.set(key, valid);
        }
    }

    return false;
}

export async function POST(request: NextRequest) {
    try {
        // 1. Guard: check if recruitment is currently open
        if (process.env.NEXT_PUBLIC_RECRUITMENT_OPEN === "false") {
            return NextResponse.json(
                { success: false, error: "The recruitment form is currently closed." },
                { status: 403 },
            );
        }

        // 2. Rate limiting check
        const forwarded = request.headers.get("x-forwarded-for");
        const clientIp = forwarded
            ? forwarded.split(",")[0].trim()
            : request.headers.get("x-real-ip") || "unknown";

        if (isRateLimited(clientIp)) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Too many submissions from this connection. Please try again in a few minutes.",
                },
                { status: 429 },
            );
        }

        const formData = await request.json();

        // 3. Honeypot check: If the hidden honeypot field has a value, silently drop
        if (formData.website_url) {
            console.warn("Honeypot triggered, dropping submission quietly.");
            return NextResponse.json({ success: true }, { status: 200 });
        }

        // 4. Server-side validation of required fields
        const missingFields: string[] = [];
        if (!formData.fullname || typeof formData.fullname !== "string" || formData.fullname.trim().length < 2) {
            missingFields.push("fullname");
        }
        if (!formData.email || typeof formData.email !== "string" || !/\S+@\S+\.\S+/.test(formData.email)) {
            missingFields.push("email");
        }
        if (!formData.phone || typeof formData.phone !== "string" || formData.phone.trim().length < 6) {
            missingFields.push("phone");
        }
        if (!formData.facebookLink || typeof formData.facebookLink !== "string" || !formData.facebookLink.trim()) {
            missingFields.push("facebookLink");
        }
        if (!formData.region || typeof formData.region !== "string" || !formData.region.trim()) {
            missingFields.push("region");
        }
        if (!formData.university || typeof formData.university !== "string" || !formData.university.trim()) {
            missingFields.push("university");
        }
        if (!formData.studyLevel || typeof formData.studyLevel !== "string" || !formData.studyLevel.trim()) {
            missingFields.push("studyLevel");
        }
        if (!formData.clubExperience || (formData.clubExperience !== "yes" && formData.clubExperience !== "no")) {
            missingFields.push("clubExperience");
        }
        if (!formData.desiredPosition || typeof formData.desiredPosition !== "string" || !formData.desiredPosition.trim()) {
            missingFields.push("desiredPosition");
        }
        if (!formData.sosVillageKnowledge || typeof formData.sosVillageKnowledge !== "string" || !formData.sosVillageKnowledge.trim()) {
            missingFields.push("sosVillageKnowledge");
        }
        if (!formData.inPersonMeeting || typeof formData.inPersonMeeting !== "string" || !formData.inPersonMeeting.trim()) {
            missingFields.push("inPersonMeeting");
        }

        if (missingFields.length > 0) {
            return NextResponse.json(
                {
                    success: false,
                    error: `Missing or invalid required fields: ${missingFields.join(", ")}`,
                },
                { status: 400 },
            );
        }

        // 5. Connect to Google Sheet
        const sheet = await getGoogleSheet();

        // 6. Map the submitted form data flexibly to the sheet columns
        const rowData = mapFormDataToSheetRow(formData, sheet.headerValues);

        // 7. Append row to Google Sheets
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
