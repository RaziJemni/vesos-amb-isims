"use client";

import { Label } from "@/components/ui/label";
import type { Translations } from "@/lib/translations";
import type { JoinFormData } from "@/lib/types";

interface JoinStep2Props {
    t: Translations;
    title: string;
    desc: string;
    formData: JoinFormData;
    errors: Partial<Record<keyof JoinFormData, boolean>>;
    onChange: (updates: Partial<JoinFormData>) => void;
    clearError: (field: keyof JoinFormData) => void;
}

export function JoinStep2({
    t,
    title,
    desc,
    formData,
    errors,
    onChange,
    clearError,
}: JoinStep2Props) {
    const experienceOptions = [
        { value: "yes", label: t.join.form.yes },
        { value: "no", label: t.join.form.no },
    ];

    const positionOptions = [
        { value: "treasurer", label: t.join.form.positionTreasurer },
        { value: "secretary-general", label: t.join.form.positionSecretaryGeneral },
        { value: "partnership-manager", label: t.join.form.positionPartnershipManager },
        { value: "partnership-assistant", label: t.join.form.positionPartnershipAssistant },
        { value: "comm-manager", label: t.join.form.positionCommManager },
        { value: "comm-assistant", label: t.join.form.positionCommAssistant },
        { value: "hr-manager", label: t.join.form.positionHRManager },
        { value: "hr-assistant", label: t.join.form.positionHRAssistant },
        { value: "events-assistant", label: t.join.form.positionEventsAssistant },
        { value: "fundraising-manager", label: t.join.form.positionFundraisingManager },
        { value: "member", label: t.join.form.positionMember },
    ];

    const departmentOptions = [
        { value: "hr", label: t.join.form.departmentHR },
        { value: "events", label: t.join.form.departmentEvents },
        { value: "digital-comm", label: t.join.form.departmentDigitalComm },
    ];

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="border-b pb-4">
                <h3 className="text-xl font-bold text-primary-dark">{title}</h3>
                <p className="text-sm text-gray-500">{desc}</p>
            </div>

            {/* Club Experience */}
            <div className="space-y-2" id="clubExperience">
                <Label
                    className={
                        errors.clubExperience
                            ? "text-red-500"
                            : "text-primary-dark"
                    }
                >
                    {t.join.form.clubExperience} *
                </Label>
                <div className="flex gap-4 mt-2">
                    {experienceOptions.map((option) => (
                        <label
                            key={option.value}
                            className="flex items-center gap-2 cursor-pointer bg-gray-50 hover:bg-gray-100 px-6 py-3 rounded-lg border flex-1"
                        >
                            <input
                                type="radio"
                                name="clubExperience"
                                value={option.value}
                                checked={formData.clubExperience === option.value}
                                onChange={(e) => {
                                    onChange({ clubExperience: e.target.value });
                                    if (errors.clubExperience) clearError("clubExperience");
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

            {/* Desired Position */}
            <div className="space-y-2" id="desiredPosition">
                <Label
                    className={
                        errors.desiredPosition
                            ? "text-red-500"
                            : "text-primary-dark"
                    }
                >
                    {t.join.form.desiredPosition} *
                </Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                    {positionOptions.map((option) => (
                        <label
                            key={option.value}
                            className={`flex items-center gap-3 cursor-pointer p-4 rounded-xl border transition-all ${
                                formData.desiredPosition === option.value
                                    ? "border-primary bg-primary/5 shadow-sm"
                                    : "border-gray-200 bg-gray-50 hover:bg-gray-100"
                            }`}
                        >
                            <input
                                type="radio"
                                name="desiredPosition"
                                value={option.value}
                                checked={formData.desiredPosition === option.value}
                                onChange={(e) => {
                                    onChange({ desiredPosition: e.target.value });
                                    if (errors.desiredPosition) clearError("desiredPosition");
                                }}
                                className="w-4 h-4 text-primary"
                            />
                            <span className="text-primary-dark font-semibold text-sm">
                                {option.label}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Department (shown if member selected) */}
            {formData.desiredPosition === "member" && (
                <div className="space-y-2 pt-2 animate-fade-in" id="department">
                    <Label className="text-primary-dark">
                        {t.join.form.department}
                    </Label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2">
                        {departmentOptions.map((option) => (
                            <label
                                key={option.value}
                                className={`flex items-center gap-3 cursor-pointer p-3.5 rounded-xl border transition-all ${
                                    formData.department === option.value
                                        ? "border-accent bg-accent/5 shadow-sm"
                                        : "border-gray-200 bg-gray-50 hover:bg-gray-100"
                                }`}
                            >
                                <input
                                    type="radio"
                                    name="department"
                                    value={option.value}
                                    checked={formData.department === option.value}
                                    onChange={(e) => onChange({ department: e.target.value })}
                                    className="w-4 h-4 text-accent"
                                />
                                <span className="text-primary-dark font-medium text-sm">
                                    {option.label}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
