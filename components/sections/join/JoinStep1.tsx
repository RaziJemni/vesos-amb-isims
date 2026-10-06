"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Translations } from "@/lib/translations";
import type { JoinFormData } from "@/lib/types";

interface JoinStep1Props {
    t: Translations;
    title: string;
    desc: string;
    formData: JoinFormData;
    otherUniversity: string;
    errors: Partial<Record<keyof JoinFormData, boolean>>;
    onChange: (updates: Partial<JoinFormData>) => void;
    onOtherUniversityChange: (value: string) => void;
    clearError: (field: keyof JoinFormData) => void;
}

export function JoinStep1({
    t,
    title,
    desc,
    formData,
    otherUniversity,
    errors,
    onChange,
    onOtherUniversityChange,
    clearError,
}: JoinStep1Props) {
    const studyLevelOptions = [
        { value: "1st-year", label: t.join.form.studyLevelFirstYear },
        { value: "2nd-year", label: t.join.form.studyLevelSecondYear },
        { value: "3rd-year", label: t.join.form.studyLevelThirdYear },
        { value: "other", label: t.join.form.studyLevelOther },
    ];

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="border-b pb-4">
                <h3 className="text-xl font-bold text-primary-dark">{title}</h3>
                <p className="text-sm text-gray-500">{desc}</p>
            </div>

            {/* Row 1: Full Name and Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label
                        htmlFor="fullname"
                        className={
                            errors.fullname
                                ? "text-red-500"
                                : "text-primary-dark"
                        }
                    >
                        {t.join.form.fullname} *
                    </Label>
                    <Input
                        id="fullname"
                        type="text"
                        autoComplete="name"
                        autoCapitalize="words"
                        placeholder={t.join.form.fullnamePlaceholder}
                        value={formData.fullname}
                        onChange={(e) => {
                            onChange({ fullname: e.target.value });
                            if (errors.fullname) clearError("fullname");
                        }}
                        className={`h-11 bg-white text-primary-dark ${
                            errors.fullname
                                ? "border-red-500 focus:ring-red-500"
                                : ""
                        }`}
                    />
                </div>

                <div className="space-y-2">
                    <Label
                        htmlFor="email"
                        className={
                            errors.email
                                ? "text-red-500"
                                : "text-primary-dark"
                        }
                    >
                        {t.join.form.email} *
                    </Label>
                    <Input
                        id="email"
                        type="email"
                        autoComplete="email"
                        placeholder={t.join.form.emailPlaceholder}
                        value={formData.email}
                        onChange={(e) => {
                            onChange({ email: e.target.value });
                            if (errors.email) clearError("email");
                        }}
                        className={`h-11 bg-white text-primary-dark ${
                            errors.email
                                ? "border-red-500 focus:ring-red-500"
                                : ""
                        }`}
                    />
                </div>
            </div>

            {/* Row 2: Phone and Facebook Link */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label
                        htmlFor="phone"
                        className={
                            errors.phone
                                ? "text-red-500"
                                : "text-primary-dark"
                        }
                    >
                        {t.join.form.phone} *
                    </Label>
                    <Input
                        id="phone"
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel"
                        placeholder={t.join.form.phonePlaceholder}
                        value={formData.phone}
                        onChange={(e) => {
                            onChange({ phone: e.target.value });
                            if (errors.phone) clearError("phone");
                        }}
                        className={`h-11 bg-white text-primary-dark ${
                            errors.phone
                                ? "border-red-500 focus:ring-red-500"
                                : ""
                        }`}
                    />
                </div>

                <div className="space-y-2">
                    <Label
                        htmlFor="facebookLink"
                        className={
                            errors.facebookLink
                                ? "text-red-500"
                                : "text-primary-dark"
                        }
                    >
                        {t.join.form.facebookLink} *
                    </Label>
                    <Input
                        id="facebookLink"
                        type="text"
                        placeholder={t.join.form.facebookLinkPlaceholder}
                        value={formData.facebookLink}
                        onChange={(e) => {
                            onChange({ facebookLink: e.target.value });
                            if (errors.facebookLink) clearError("facebookLink");
                        }}
                        className={`h-11 bg-white text-primary-dark ${
                            errors.facebookLink
                                ? "border-red-500 focus:ring-red-500"
                                : ""
                        }`}
                    />
                </div>
            </div>

            {/* Row 3: Region and University */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label
                        htmlFor="region"
                        className={
                            errors.region
                                ? "text-red-500"
                                : "text-primary-dark"
                        }
                    >
                        {t.join.form.region} *
                    </Label>
                    <Input
                        id="region"
                        type="text"
                        placeholder={t.join.form.regionPlaceholder}
                        value={formData.region}
                        onChange={(e) => {
                            onChange({ region: e.target.value });
                            if (errors.region) clearError("region");
                        }}
                        className={`h-11 bg-white text-primary-dark ${
                            errors.region
                                ? "border-red-500 focus:ring-red-500"
                                : ""
                        }`}
                    />
                </div>

                <div className="space-y-2" id="university">
                    <Label
                        className={
                            errors.university
                                ? "text-red-500"
                                : "text-primary-dark"
                        }
                    >
                        {t.join.form.university} *
                    </Label>
                    <div className="flex gap-4 mt-2">
                        <label className="flex items-center gap-2 cursor-pointer bg-gray-50 hover:bg-gray-100 p-2.5 rounded-lg border flex-1">
                            <input
                                type="radio"
                                name="university"
                                value="ISIMS"
                                checked={formData.university === "ISIMS"}
                                onChange={(e) => {
                                    onChange({ university: e.target.value });
                                    onOtherUniversityChange("");
                                    if (errors.university) clearError("university");
                                }}
                                className="w-4 h-4 text-primary"
                            />
                            <span className="text-primary-dark font-medium text-sm">
                                {t.join.form.universityISIMS}
                            </span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer bg-gray-50 hover:bg-gray-100 p-2.5 rounded-lg border flex-1">
                            <input
                                type="radio"
                                name="university"
                                value="Autre"
                                checked={formData.university === "Autre"}
                                onChange={(e) => {
                                    onChange({ university: e.target.value });
                                    if (errors.university) clearError("university");
                                }}
                                className="w-4 h-4 text-primary"
                            />
                            <span className="text-primary-dark font-medium text-sm">
                                {t.join.form.universityOther}
                            </span>
                        </label>
                    </div>

                    {formData.university === "Autre" && (
                        <div className="mt-2 animate-fade-in">
                            <Input
                                id="otherUniversity"
                                type="text"
                                placeholder={
                                    t.join.form.otherUniversityPlaceholder ||
                                    "Your university name"
                                }
                                value={otherUniversity}
                                onChange={(e) => {
                                    onOtherUniversityChange(e.target.value);
                                    if (errors.university) clearError("university");
                                }}
                                className={`h-11 bg-white text-primary-dark ${
                                    errors.university
                                        ? "border-red-500 focus:ring-red-500"
                                        : ""
                                }`}
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Row 4: Study Level and Specialty */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2" id="studyLevel">
                    <Label
                        className={
                            errors.studyLevel
                                ? "text-red-500"
                                : "text-primary-dark"
                        }
                    >
                        {t.join.form.studyLevel} *
                    </Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                        {studyLevelOptions.map((option) => (
                            <label
                                key={option.value}
                                className="flex items-center gap-2 cursor-pointer bg-gray-50 hover:bg-gray-100 p-2.5 rounded-lg border text-sm"
                            >
                                <input
                                    type="radio"
                                    name="studyLevel"
                                    value={option.value}
                                    checked={formData.studyLevel === option.value}
                                    onChange={(e) => {
                                        onChange({ studyLevel: e.target.value });
                                        if (errors.studyLevel) clearError("studyLevel");
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

                <div className="space-y-2">
                    <Label
                        htmlFor="specialty"
                        className="text-primary-dark"
                    >
                        {t.join.form.specialty}{" "}
                        <span className="text-gray-400 font-normal">
                            ({t.join.form.optional || "optional"})
                        </span>
                    </Label>
                    <Input
                        id="specialty"
                        type="text"
                        placeholder={t.join.form.specialtyPlaceholder}
                        value={formData.specialty}
                        onChange={(e) => onChange({ specialty: e.target.value })}
                        className="h-11 bg-white text-primary-dark"
                    />
                </div>
            </div>
        </div>
    );
}
