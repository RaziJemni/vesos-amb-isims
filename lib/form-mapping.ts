/**
 * Flexible field mapping for the Recruitment Form -> Google Sheets.
 *
 * This handles converting internal form IDs into readable French strings for HR,
 * and matches each field dynamically to the sheet's column headers.
 */

// Readable option labels for HR
export const OPTION_LABELS: Record<string, Record<string, string>> = {
    studyLevel: {
        "1st-year": "Première année",
        "2nd-year": "Deuxième année",
        "3rd-year": "Troisième année",
        other: "Autre",
    },
    clubExperience: {
        yes: "Oui",
        no: "Non",
    },
    desiredPosition: {
        treasurer: "Trésorier / Trésorière",
        "secretary-general": "Secrétaire Général(e)",
        "partnership-manager": "Responsable Partenariats",
        "partnership-assistant": "Assistant(e) Partenariats",
        "comm-manager": "Responsable Communication Digitale",
        "comm-assistant": "Assistant(e) Communication Digitale",
        "hr-manager": "Responsable RH",
        "hr-assistant": "Assistant(e) RH",
        "events-assistant": "Assistant(e) Événements",
        member: "Membre",
    },
    department: {
        hr: "Département ressources humaines",
        events: "Département événementiel",
        "digital-comm": "Département communication digitale",
    },
    sosVillageKnowledge: {
        know: "Oui, je suis les nouvelles de l'association et ses missions",
        partial:
            "J'ai une connaissance générale de l'association, mais je voudrais en savoir plus",
        "dont-know":
            "Non, je ne connais pas encore l'association, mais je suis intéressé(e) à en apprendre davantage",
    },
    inPersonMeeting: {
        yes: "Oui",
        "not-sure": "Pas sure",
        no: "Non",
    },
};

/**
 * Maps form values into a row object matching the Google Sheet's exact headers.
 */
export function mapFormDataToSheetRow(
    formData: Record<string, any>,
    headerValues: string[]
): Record<string, any> {
    // Current timestamp in Tunisia timezone
    const now = new Date();
    const formattedTimestamp = now.toLocaleString("fr-FR", {
        timeZone: "Africa/Tunis",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });

    const values: Record<string, string> = {
        fullname: formData.fullname || "",
        email: formData.email || "",
        phone: formData.phone || "",
        facebookLink: formData.facebookLink || "",
        region: formData.region || "",
        university: formData.university || "",
        studyLevel:
            OPTION_LABELS.studyLevel[formData.studyLevel] ||
            formData.studyLevel ||
            "",
        specialty: formData.specialty || "",
        clubExperience:
            OPTION_LABELS.clubExperience[formData.clubExperience] ||
            formData.clubExperience ||
            "",
        desiredPosition:
            OPTION_LABELS.desiredPosition[formData.desiredPosition] ||
            formData.desiredPosition ||
            "",
        department:
            OPTION_LABELS.department[formData.department] ||
            formData.department ||
            "",
        sosVillageKnowledge:
            OPTION_LABELS.sosVillageKnowledge[formData.sosVillageKnowledge] ||
            formData.sosVillageKnowledge ||
            "",
        inPersonMeeting:
            OPTION_LABELS.inPersonMeeting[formData.inPersonMeeting] ||
            formData.inPersonMeeting ||
            "",
        additionalInfo: formData.additionalInfo || "",
    };

    const row: Record<string, any> = {};

    for (const header of headerValues) {
        const clean = header.trim().toLowerCase();

        if (clean.includes("timestamp") || clean.includes("horodateur")) {
            row[header] = formattedTimestamp;
        } else if (clean.includes("facebook")) {
            row[header] = values.facebookLink;
        } else if (
            clean.includes("nom et pr") ||
            clean.includes("full name") ||
            clean.startsWith("nom") ||
            clean.includes("prénom") ||
            clean.includes("prenom")
        ) {
            row[header] = values.fullname;
        } else if (clean.includes("mail") || clean.includes("email")) {
            row[header] = values.email;
        } else if (clean.includes("phone") || clean.includes("téléphone") || clean.includes("telephone")) {
            row[header] = values.phone;
        } else if (clean.includes("r") && clean.includes("gion")) {
            row[header] = values.region;
        } else if (
            clean.includes("universitaire") ||
            clean.includes("etablissement") ||
            clean.includes("universit")
        ) {
            row[header] = values.university;
        } else if (clean.includes("niveau") || clean.includes("study")) {
            row[header] = values.studyLevel;
        } else if (clean.includes("sp") && clean.includes("cialit")) {
            row[header] = values.specialty;
        } else if (
            clean.includes("exp") &&
            (clean.includes("club") || clean.includes("bénévolat") || clean.includes("benevolat"))
        ) {
            row[header] = values.clubExperience;
        } else if (clean.includes("poste") || clean.includes("position")) {
            row[header] = values.desiredPosition;
        } else if (clean.includes("d") && clean.includes("partement")) {
            row[header] = values.department;
        } else if (clean.includes("connaissance") && clean.includes("sos")) {
            row[header] = values.sosVillageKnowledge;
        } else if (
            clean.includes("entretien") &&
            clean.includes("pr") &&
            clean.includes("sentiel")
        ) {
            row[header] = values.inPersonMeeting;
        } else if (
            clean.includes("feel free") ||
            clean.includes("remarque") ||
            clean.includes("additional") ||
            clean.includes("autre")
        ) {
            row[header] = values.additionalInfo;
        } else if (formData[header] !== undefined) {
            // Flexible fallback: direct match on field name
            row[header] = formData[header];
        } else {
            row[header] = "";
        }
    }

    return row;
}
