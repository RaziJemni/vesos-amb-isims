"use client";

import { useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import type { Language, Translations } from "@/lib/translations";
import type { JoinFormData, FormStatus } from "@/lib/types";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

interface JoinFormProps {
    t: Translations;
    language: Language;
}

// Replace with your actual Google Form endpoint URL or set via env var
const GOOGLE_FORM_ACTION_URL =
    process.env.NEXT_PUBLIC_GOOGLE_FORM_ACTION_URL ||
    "https://docs.google.com/forms/d/e/YOUR_FORM_ID/formResponse";

// Replace with your actual Google Form field IDs
const FORM_FIELD_IDS = {
    fullname:
        process.env.NEXT_PUBLIC_GOOGLE_FORM_FULLNAME_FIELD || "entry.123456789",
    email: process.env.NEXT_PUBLIC_GOOGLE_FORM_EMAIL_FIELD || "entry.987654321",
    phone: process.env.NEXT_PUBLIC_GOOGLE_FORM_PHONE_FIELD || "entry.456789012",
    facebookLink:
        process.env.NEXT_PUBLIC_GOOGLE_FORM_FACEBOOK_FIELD || "entry.111111111",
    region:
        process.env.NEXT_PUBLIC_GOOGLE_FORM_REGION_FIELD || "entry.222222222",
    university:
        process.env.NEXT_PUBLIC_GOOGLE_FORM_UNIVERSITY_FIELD ||
        "entry.345678901",
    studyLevel:
        process.env.NEXT_PUBLIC_GOOGLE_FORM_STUDY_LEVEL_FIELD ||
        "entry.333333333",
    specialty:
        process.env.NEXT_PUBLIC_GOOGLE_FORM_SPECIALTY_FIELD ||
        "entry.444444444",
    clubExperience:
        process.env.NEXT_PUBLIC_GOOGLE_FORM_CLUB_EXP_FIELD || "entry.555555555",
    desiredPosition:
        process.env.NEXT_PUBLIC_GOOGLE_FORM_POSITION_FIELD || "entry.666666666",
    department:
        process.env.NEXT_PUBLIC_GOOGLE_FORM_DEPARTMENT_FIELD ||
        "entry.777777777",
    sosVillageKnowledge:
        process.env.NEXT_PUBLIC_GOOGLE_FORM_SOS_KNOWLEDGE_FIELD ||
        "entry.888888888",
    inPersonMeeting:
        process.env.NEXT_PUBLIC_GOOGLE_FORM_IN_PERSON_FIELD ||
        "entry.999999999",
    additionalInfo:
        process.env.NEXT_PUBLIC_GOOGLE_FORM_ADDITIONAL_INFO_FIELD ||
        "entry.121212121",
};

export function JoinForm({ t, language }: JoinFormProps) {
    const [formData, setFormData] = useState<JoinFormData>({
        fullname: "",
        email: "",
        phone: "",
        facebookLink: "",
        region: "",
        university: "",
        studyLevel: "",
        specialty: "",
        clubExperience: "",
        desiredPosition: "",
        department: "",
        sosVillageKnowledge: "",
        inPersonMeeting: "",
        additionalInfo: "",
    });
    const [status, setStatus] = useState<FormStatus>("idle");
    const [errors, setErrors] = useState<
        Partial<Record<keyof JoinFormData, boolean>>
    >({});
    const ref = useScrollAnimation();
    const formConfigured = !GOOGLE_FORM_ACTION_URL.includes("YOUR_FORM_ID");

    const validateForm = (): boolean => {
        const newErrors: Partial<Record<keyof JoinFormData, boolean>> = {};

        if (!formData.fullname.trim()) newErrors.fullname = true;
        if (!formData.email.trim()) newErrors.email = true;
        if (!formData.phone.trim()) newErrors.phone = true;
        if (!formData.region.trim()) newErrors.region = true;
        if (!formData.university) newErrors.university = true;
        if (!formData.studyLevel) newErrors.studyLevel = true;
        if (!formData.specialty.trim()) newErrors.specialty = true;
        if (!formData.clubExperience) newErrors.clubExperience = true;
        if (!formData.desiredPosition) newErrors.desiredPosition = true;
        if (formData.desiredPosition === "member" && !formData.department)
            newErrors.department = true;
        if (!formData.sosVillageKnowledge) newErrors.sosVillageKnowledge = true;
        if (!formData.inPersonMeeting) newErrors.inPersonMeeting = true;

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            setStatus("error");
            setTimeout(() => setStatus("idle"), 5000);
            return;
        }

        if (!formConfigured) {
            setStatus("error");
            return;
        }
        setStatus("loading");

        try {
            const googleFormData = new FormData();
            googleFormData.append(FORM_FIELD_IDS.fullname, formData.fullname);
            googleFormData.append(FORM_FIELD_IDS.email, formData.email);
            googleFormData.append(FORM_FIELD_IDS.phone, formData.phone);
            googleFormData.append(
                FORM_FIELD_IDS.facebookLink,
                formData.facebookLink,
            );
            googleFormData.append(FORM_FIELD_IDS.region, formData.region);
            googleFormData.append(
                FORM_FIELD_IDS.university,
                formData.university,
            );
            googleFormData.append(
                FORM_FIELD_IDS.studyLevel,
                formData.studyLevel,
            );
            googleFormData.append(FORM_FIELD_IDS.specialty, formData.specialty);
            googleFormData.append(
                FORM_FIELD_IDS.clubExperience,
                formData.clubExperience,
            );
            googleFormData.append(
                FORM_FIELD_IDS.desiredPosition,
                formData.desiredPosition,
            );
            googleFormData.append(
                FORM_FIELD_IDS.department,
                formData.department,
            );
            googleFormData.append(
                FORM_FIELD_IDS.sosVillageKnowledge,
                formData.sosVillageKnowledge,
            );
            googleFormData.append(
                FORM_FIELD_IDS.inPersonMeeting,
                formData.inPersonMeeting,
            );
            googleFormData.append(
                FORM_FIELD_IDS.additionalInfo,
                formData.additionalInfo,
            );

            await fetch(GOOGLE_FORM_ACTION_URL, {
                method: "POST",
                body: googleFormData,
                mode: "no-cors",
            });

            setStatus("success");
            setErrors({});
            setFormData({
                fullname: "",
                email: "",
                phone: "",
                facebookLink: "",
                region: "",
                university: "",
                studyLevel: "",
                specialty: "",
                clubExperience: "",
                desiredPosition: "",
                department: "",
                sosVillageKnowledge: "",
                inPersonMeeting: "",
                additionalInfo: "",
            });

            setTimeout(() => setStatus("idle"), 5000);
        } catch (error) {
            console.error("Form submission error:", error);
            setStatus("error");
            setTimeout(() => setStatus("idle"), 5000);
        }
    };

    return (
        <section
            id="join"
            className="relative min-h-screen flex items-center justify-center py-20 md:py-32 bg-white"
        >
            <div className="container px-4">
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-center mb-3 text-balance text-primary-dark animate-fade-in-up animate-in">
                    {t.join.title}
                </h2>
                {/* small subtitle under the main title */}
                <p className="text-center text-primary-dark/90 mb-8 max-w-2xl mx-auto text-base md:text-lg font-medium">
                    {t.join.subtitle}
                </p>
                {!formConfigured && (
                    <div className="max-w-2xl mx-auto mb-6 rounded-xl border border-amber-300 bg-amber-50 text-amber-800 px-4 py-3 text-sm font-medium text-center">
                        The join form is curreently unavailable. Please wait
                        until its back online.
                    </div>
                )}

                <div className="mx-auto max-w-4xl">
                    <div
                        ref={ref}
                        className="bg-primary/5 shadow rounded-2xl p-8 border border-gray-100 animate-fade-in-up animate-stagger"
                    >
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Row 1: Full Name and Email */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="fullname"
                                        className="text-primary-dark"
                                    >
                                        {t.join.form.fullname}
                                    </Label>
                                    <Input
                                        id="fullname"
                                        type="text"
                                        placeholder={
                                            t.join.form.fullnamePlaceholder
                                        }
                                        value={formData.fullname}
                                        onChange={(e) => {
                                            setFormData({
                                                ...formData,
                                                fullname: e.target.value,
                                            });
                                            if (errors.fullname)
                                                setErrors({
                                                    ...errors,
                                                    fullname: false,
                                                });
                                        }}
                                        className={`h-11 bg-white text-primary-dark ${errors.fullname ? "border-red-500" : ""}`}
                                    />
                                    {errors.fullname && (
                                        <p className="text-xs text-red-500">
                                            This field is required
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label
                                        htmlFor="email"
                                        className="text-primary-dark"
                                    >
                                        {t.join.form.email}
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder={
                                            t.join.form.emailPlaceholder
                                        }
                                        value={formData.email}
                                        onChange={(e) => {
                                            setFormData({
                                                ...formData,
                                                email: e.target.value,
                                            });
                                            if (errors.email)
                                                setErrors({
                                                    ...errors,
                                                    email: false,
                                                });
                                        }}
                                        className={`h-11 bg-white text-primary-dark ${errors.email ? "border-red-500" : ""}`}
                                    />
                                    {errors.email && (
                                        <p className="text-xs text-red-500">
                                            This field is required
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Row 2: Phone and Facebook Link */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="phone"
                                        className="text-primary-dark"
                                    >
                                        {t.join.form.phone}
                                    </Label>
                                    <Input
                                        id="phone"
                                        type="tel"
                                        placeholder={
                                            t.join.form.phonePlaceholder
                                        }
                                        value={formData.phone}
                                        onChange={(e) => {
                                            setFormData({
                                                ...formData,
                                                phone: e.target.value,
                                            });
                                            if (errors.phone)
                                                setErrors({
                                                    ...errors,
                                                    phone: false,
                                                });
                                        }}
                                        className={`h-11 bg-white text-primary-dark ${errors.phone ? "border-red-500" : ""}`}
                                    />
                                    {errors.phone && (
                                        <p className="text-xs text-red-500">
                                            This field is required
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label
                                        htmlFor="facebookLink"
                                        className="text-primary-dark"
                                    >
                                        {t.join.form.facebookLink}
                                    </Label>
                                    <Input
                                        id="facebookLink"
                                        type="text"
                                        placeholder={
                                            t.join.form.facebookLinkPlaceholder
                                        }
                                        value={formData.facebookLink}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                facebookLink: e.target.value,
                                            })
                                        }
                                        className="h-11 bg-white text-primary-dark"
                                    />
                                </div>
                            </div>

                            {/* Row 3: Region and University */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="region"
                                        className="text-primary-dark"
                                    >
                                        {t.join.form.region}
                                    </Label>
                                    <Input
                                        id="region"
                                        type="text"
                                        placeholder={
                                            t.join.form.regionPlaceholder
                                        }
                                        value={formData.region}
                                        onChange={(e) => {
                                            setFormData({
                                                ...formData,
                                                region: e.target.value,
                                            });
                                            if (errors.region)
                                                setErrors({
                                                    ...errors,
                                                    region: false,
                                                });
                                        }}
                                        className={`h-11 bg-white text-primary-dark ${errors.region ? "border-red-500" : ""}`}
                                    />
                                    {errors.region && (
                                        <p className="text-xs text-red-500">
                                            This field is required
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label
                                        className={`text-primary-dark ${errors.university ? "text-red-500" : ""}`}
                                    >
                                        {t.join.form.university}
                                    </Label>
                                    <div className="flex gap-4 mt-3">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="university"
                                                value="ISIMS"
                                                checked={
                                                    formData.university ===
                                                    "ISIMS"
                                                }
                                                onChange={(e) => {
                                                    setFormData({
                                                        ...formData,
                                                        university:
                                                            e.target.value,
                                                    });
                                                    if (errors.university)
                                                        setErrors({
                                                            ...errors,
                                                            university: false,
                                                        });
                                                }}
                                                className="w-4 h-4"
                                            />
                                            <span className="text-primary-dark">
                                                {t.join.form.universityISIMS}
                                            </span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="university"
                                                value="Autre"
                                                checked={
                                                    formData.university ===
                                                    "Autre"
                                                }
                                                onChange={(e) => {
                                                    setFormData({
                                                        ...formData,
                                                        university:
                                                            e.target.value,
                                                    });
                                                    if (errors.university)
                                                        setErrors({
                                                            ...errors,
                                                            university: false,
                                                        });
                                                }}
                                                className="w-4 h-4"
                                            />
                                            <span className="text-primary-dark">
                                                {t.join.form.universityOther}
                                            </span>
                                        </label>
                                    </div>
                                    {errors.university && (
                                        <p className="text-xs text-red-500">
                                            This field is required
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Row 4: Study Level and Specialty */}
                            <div className="space-y-2">
                                <Label
                                    className={`text-primary-dark ${errors.studyLevel ? "text-red-500" : ""}`}
                                >
                                    {t.join.form.studyLevel}
                                </Label>
                                <div className="flex flex-wrap gap-4 mt-3">
                                    {[
                                        {
                                            value: "1st-year",
                                            label: t.join.form
                                                .studyLevelFirstYear,
                                        },
                                        {
                                            value: "2nd-year",
                                            label: t.join.form
                                                .studyLevelSecondYear,
                                        },
                                        {
                                            value: "3rd-year",
                                            label: t.join.form
                                                .studyLevelThirdYear,
                                        },
                                        {
                                            value: "other",
                                            label: t.join.form.studyLevelOther,
                                        },
                                    ].map((option) => (
                                        <label
                                            key={option.value}
                                            className="flex items-center gap-2 cursor-pointer"
                                        >
                                            <input
                                                type="radio"
                                                name="studyLevel"
                                                value={option.value}
                                                checked={
                                                    formData.studyLevel ===
                                                    option.value
                                                }
                                                onChange={(e) => {
                                                    setFormData({
                                                        ...formData,
                                                        studyLevel:
                                                            e.target.value,
                                                    });
                                                    if (errors.studyLevel)
                                                        setErrors({
                                                            ...errors,
                                                            studyLevel: false,
                                                        });
                                                }}
                                                className="w-4 h-4"
                                            />
                                            <span className="text-primary-dark">
                                                {option.label}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                                {errors.studyLevel && (
                                    <p className="text-xs text-red-500">
                                        This field is required
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="specialty"
                                    className="text-primary-dark"
                                >
                                    {t.join.form.specialty}
                                </Label>
                                <Input
                                    id="specialty"
                                    type="text"
                                    placeholder={
                                        t.join.form.specialtyPlaceholder
                                    }
                                    value={formData.specialty}
                                    onChange={(e) => {
                                        setFormData({
                                            ...formData,
                                            specialty: e.target.value,
                                        });
                                        if (errors.specialty)
                                            setErrors({
                                                ...errors,
                                                specialty: false,
                                            });
                                    }}
                                    className={`h-11 bg-white text-primary-dark ${errors.specialty ? "border-red-500" : ""}`}
                                />
                                {errors.specialty && (
                                    <p className="text-xs text-red-500">
                                        This field is required
                                    </p>
                                )}
                            </div>

                            {/* Row 5: Club Experience */}
                            <div className="space-y-2">
                                <Label
                                    className={`text-primary-dark ${errors.clubExperience ? "text-red-500" : ""}`}
                                >
                                    {t.join.form.clubExperience}
                                </Label>
                                <div className="flex gap-6 mt-3">
                                    {[
                                        {
                                            value: "yes",
                                            label: t.join.form.yes,
                                        },
                                        { value: "no", label: t.join.form.no },
                                    ].map((option) => (
                                        <label
                                            key={option.value}
                                            className="flex items-center gap-2 cursor-pointer"
                                        >
                                            <input
                                                type="radio"
                                                name="clubExperience"
                                                value={option.value}
                                                checked={
                                                    formData.clubExperience ===
                                                    option.value
                                                }
                                                onChange={(e) => {
                                                    setFormData({
                                                        ...formData,
                                                        clubExperience:
                                                            e.target.value,
                                                    });
                                                    if (errors.clubExperience)
                                                        setErrors({
                                                            ...errors,
                                                            clubExperience: false,
                                                        });
                                                }}
                                                className="w-4 h-4"
                                            />
                                            <span className="text-primary-dark">
                                                {option.label}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                                {errors.clubExperience && (
                                    <p className="text-xs text-red-500">
                                        This field is required
                                    </p>
                                )}
                            </div>

                            {/* Row 6: Desired Position */}
                            <div className="space-y-2">
                                <Label
                                    className={`text-primary-dark ${errors.desiredPosition ? "text-red-500" : ""}`}
                                >
                                    {t.join.form.desiredPosition}
                                </Label>
                                <div className="flex flex-col gap-3 mt-3">
                                    {[
                                        {
                                            value: "treasurer",
                                            label: t.join.form
                                                .positionTreasurer,
                                        },
                                        {
                                            value: "event-manager",
                                            label: t.join.form
                                                .positionEventManager,
                                        },
                                        {
                                            value: "digital-assistant",
                                            label: t.join.form
                                                .positionDigitalCommunicationAssistant,
                                        },
                                        {
                                            value: "member",
                                            label: t.join.form.positionMember,
                                        },
                                    ].map((option) => (
                                        <label
                                            key={option.value}
                                            className="flex items-center gap-2 cursor-pointer"
                                        >
                                            <input
                                                type="radio"
                                                name="desiredPosition"
                                                value={option.value}
                                                checked={
                                                    formData.desiredPosition ===
                                                    option.value
                                                }
                                                onChange={(e) => {
                                                    setFormData({
                                                        ...formData,
                                                        desiredPosition:
                                                            e.target.value,
                                                    });
                                                    if (errors.desiredPosition)
                                                        setErrors({
                                                            ...errors,
                                                            desiredPosition: false,
                                                        });
                                                }}
                                                className="w-4 h-4"
                                            />
                                            <span className="text-primary-dark text-sm">
                                                {option.label}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                                {errors.desiredPosition && (
                                    <p className="text-xs text-red-500">
                                        This field is required
                                    </p>
                                )}
                            </div>

                            {/* Row 7: Department (shown if member selected) */}
                            {formData.desiredPosition === "member" && (
                                <div className="space-y-2">
                                    <Label
                                        className={`text-primary-dark ${errors.department ? "text-red-500" : ""}`}
                                    >
                                        {t.join.form.department}
                                    </Label>
                                    <div className="flex flex-col gap-3 mt-3">
                                        {[
                                            {
                                                value: "hr",
                                                label: t.join.form.departmentHR,
                                            },
                                            {
                                                value: "events",
                                                label: t.join.form
                                                    .departmentEvents,
                                            },
                                            {
                                                value: "digital-comm",
                                                label: t.join.form
                                                    .departmentDigitalComm,
                                            },
                                        ].map((option) => (
                                            <label
                                                key={option.value}
                                                className="flex items-center gap-2 cursor-pointer"
                                            >
                                                <input
                                                    type="radio"
                                                    name="department"
                                                    value={option.value}
                                                    checked={
                                                        formData.department ===
                                                        option.value
                                                    }
                                                    onChange={(e) => {
                                                        setFormData({
                                                            ...formData,
                                                            department:
                                                                e.target.value,
                                                        });
                                                        if (errors.department)
                                                            setErrors({
                                                                ...errors,
                                                                department: false,
                                                            });
                                                    }}
                                                    className="w-4 h-4"
                                                />
                                                <span className="text-primary-dark text-sm">
                                                    {option.label}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                    {errors.department && (
                                        <p className="text-xs text-red-500">
                                            This field is required
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* Row 8: SOS Village Knowledge */}
                            <div className="space-y-2">
                                <Label
                                    className={`text-primary-dark ${errors.sosVillageKnowledge ? "text-red-500" : ""}`}
                                >
                                    {t.join.form.sosVillageKnowledge}
                                </Label>
                                <div className="flex flex-col gap-3 mt-3">
                                    {[
                                        {
                                            value: "know",
                                            label: t.join.form
                                                .sosVillageKnowledgeOption1,
                                        },
                                        {
                                            value: "partial",
                                            label: t.join.form
                                                .sosVillageKnowledgeOption2,
                                        },
                                        {
                                            value: "dont-know",
                                            label: t.join.form
                                                .sosVillageKnowledgeOption3,
                                        },
                                    ].map((option) => (
                                        <label
                                            key={option.value}
                                            className="flex items-center gap-2 cursor-pointer"
                                        >
                                            <input
                                                type="radio"
                                                name="sosVillageKnowledge"
                                                value={option.value}
                                                checked={
                                                    formData.sosVillageKnowledge ===
                                                    option.value
                                                }
                                                onChange={(e) => {
                                                    setFormData({
                                                        ...formData,
                                                        sosVillageKnowledge:
                                                            e.target.value,
                                                    });
                                                    if (
                                                        errors.sosVillageKnowledge
                                                    )
                                                        setErrors({
                                                            ...errors,
                                                            sosVillageKnowledge: false,
                                                        });
                                                }}
                                                className="w-4 h-4"
                                            />
                                            <span className="text-primary-dark text-sm">
                                                {option.label}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                                {errors.sosVillageKnowledge && (
                                    <p className="text-xs text-red-500">
                                        This field is required
                                    </p>
                                )}
                            </div>

                            {/* Row 9: In-Person Meeting */}
                            <div className="space-y-2">
                                <Label
                                    className={`text-primary-dark ${errors.inPersonMeeting ? "text-red-500" : ""}`}
                                >
                                    {t.join.form.inPersonMeeting}
                                </Label>
                                <div className="flex gap-6 mt-3">
                                    {[
                                        {
                                            value: "yes",
                                            label: t.join.form
                                                .inPersonMeetingYes,
                                        },
                                        {
                                            value: "not-sure",
                                            label: t.join.form
                                                .inPersonMeetingNotSure,
                                        },
                                        {
                                            value: "no",
                                            label: t.join.form
                                                .inPersonMeetingNo,
                                        },
                                    ].map((option) => (
                                        <label
                                            key={option.value}
                                            className="flex items-center gap-2 cursor-pointer"
                                        >
                                            <input
                                                type="radio"
                                                name="inPersonMeeting"
                                                value={option.value}
                                                checked={
                                                    formData.inPersonMeeting ===
                                                    option.value
                                                }
                                                onChange={(e) => {
                                                    setFormData({
                                                        ...formData,
                                                        inPersonMeeting:
                                                            e.target.value,
                                                    });
                                                    if (errors.inPersonMeeting)
                                                        setErrors({
                                                            ...errors,
                                                            inPersonMeeting: false,
                                                        });
                                                }}
                                                className="w-4 h-4"
                                            />
                                            <span className="text-primary-dark">
                                                {option.label}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                                {errors.inPersonMeeting && (
                                    <p className="text-xs text-red-500">
                                        This field is required
                                    </p>
                                )}
                            </div>

                            {/* Row 10: Additional Info */}
                            <div className="space-y-2">
                                <Label
                                    htmlFor="additionalInfo"
                                    className="text-primary-dark"
                                >
                                    {t.join.form.additionalInfo}
                                </Label>
                                <Textarea
                                    id="additionalInfo"
                                    placeholder={
                                        t.join.form.additionalInfoPlaceholder
                                    }
                                    value={formData.additionalInfo}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            additionalInfo: e.target.value,
                                        })
                                    }
                                    rows={4}
                                    className="resize-none bg-white text-primary-dark"
                                />
                            </div>

                            <Button
                                type="submit"
                                size="lg"
                                className="w-full bg-secondary hover:bg-secondary/90 text-white font-bold"
                                disabled={
                                    status === "loading" || !formConfigured
                                }
                            >
                                {status === "loading"
                                    ? "Submitting..."
                                    : t.join.form.submit}
                            </Button>

                            {status === "success" && (
                                <p className="text-center text-sm text-green-600 font-medium">
                                    {t.join.form.success}
                                </p>
                            )}

                            {status === "error" && (
                                <p className="text-center text-sm text-red-600 font-medium">
                                    Please fill in all required fields to
                                    complete your registration.
                                </p>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}
