"use client";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Translations } from "@/lib/translations";
import type { JoinFormData } from "@/lib/types";

interface JoinStep3Props {
    t: Translations;
    title: string;
    desc: string;
    formData: JoinFormData;
    errors: Partial<Record<keyof JoinFormData, boolean>>;
    onChange: (updates: Partial<JoinFormData>) => void;
    clearError: (field: keyof JoinFormData) => void;
}

export function JoinStep3({
    t,
    title,
    desc,
    formData,
    errors,
    onChange,
    clearError,
}: JoinStep3Props) {
    const knowledgeOptions = [
        { value: "know", label: t.join.form.sosVillageKnowledgeOption1 },
        { value: "partial", label: t.join.form.sosVillageKnowledgeOption2 },
        { value: "dont-know", label: t.join.form.sosVillageKnowledgeOption3 },
    ];

    const meetingOptions = [
        { value: "yes", label: t.join.form.inPersonMeetingYes },
        { value: "not-sure", label: t.join.form.inPersonMeetingNotSure },
        { value: "no", label: t.join.form.inPersonMeetingNo },
    ];

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="border-b pb-4">
                <h3 className="text-xl font-bold text-primary-dark">{title}</h3>
                <p className="text-sm text-gray-500">{desc}</p>
            </div>

            {/* SOS Village Knowledge */}
            <div className="space-y-2" id="sosVillageKnowledge">
                <Label
                    className={
                        errors.sosVillageKnowledge
                            ? "text-red-500"
                            : "text-primary-dark"
                    }
                >
                    {t.join.form.sosVillageKnowledge} *
                </Label>
                <div className="flex flex-col gap-2.5 mt-2">
                    {knowledgeOptions.map((option) => (
                        <label
                            key={option.value}
                            className={`flex items-start gap-3 cursor-pointer p-3.5 rounded-xl border transition-all ${
                                formData.sosVillageKnowledge === option.value
                                    ? "border-primary bg-primary/5"
                                    : "border-gray-200 bg-gray-50 hover:bg-gray-100"
                            }`}
                        >
                            <input
                                type="radio"
                                name="sosVillageKnowledge"
                                value={option.value}
                                checked={formData.sosVillageKnowledge === option.value}
                                onChange={(e) => {
                                    onChange({ sosVillageKnowledge: e.target.value });
                                    if (errors.sosVillageKnowledge) {
                                        clearError("sosVillageKnowledge");
                                    }
                                }}
                                className="w-4 h-4 mt-0.5 text-primary flex-shrink-0"
                            />
                            <span className="text-primary-dark text-sm leading-relaxed">
                                {option.label}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            {/* In-Person Meeting */}
            <div className="space-y-2" id="inPersonMeeting">
                <Label
                    className={
                        errors.inPersonMeeting
                            ? "text-red-500"
                            : "text-primary-dark"
                    }
                >
                    {t.join.form.inPersonMeeting} *
                </Label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2">
                    {meetingOptions.map((option) => (
                        <label
                            key={option.value}
                            className={`flex items-center gap-2.5 cursor-pointer p-3 rounded-xl border text-sm transition-all ${
                                formData.inPersonMeeting === option.value
                                    ? "border-primary bg-primary/5"
                                    : "border-gray-200 bg-gray-50 hover:bg-gray-100"
                            }`}
                        >
                            <input
                                type="radio"
                                name="inPersonMeeting"
                                value={option.value}
                                checked={formData.inPersonMeeting === option.value}
                                onChange={(e) => {
                                    onChange({ inPersonMeeting: e.target.value });
                                    if (errors.inPersonMeeting) {
                                        clearError("inPersonMeeting");
                                    }
                                }}
                                className="w-4 h-4 text-primary"
                            />
                            <span className="text-primary-dark font-medium">
                                {option.label}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Additional Info */}
            <div className="space-y-2">
                <Label
                    htmlFor="additionalInfo"
                    className="text-primary-dark"
                >
                    {t.join.form.additionalInfo}{" "}
                    <span className="text-gray-400 font-normal">
                        ({t.join.form.optional || "optional"})
                    </span>
                </Label>
                <Textarea
                    id="additionalInfo"
                    placeholder={t.join.form.additionalInfoPlaceholder}
                    value={formData.additionalInfo}
                    onChange={(e) => onChange({ additionalInfo: e.target.value })}
                    rows={3}
                    className="resize-none bg-white text-primary-dark"
                />
            </div>
        </div>
    );
}
