"use client";

import { useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Language, Translations } from "@/lib/translations";
import type { JoinFormData, FormStatus } from "@/lib/types";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

interface JoinFormProps {
    t: Translations;
    language: Language;
}

// Replace with your Google Apps Script Web App URL
const APPS_SCRIPT_URL =
    process.env.NEXT_PUBLIC_APPS_SCRIPT_URL ||
    "https://script.google.com/macros/s/AKfycbwAckSAOVpA-95T47jbomhXWSIXfR0ReBOmpB5i7IS1vJQm7rbzwBiNQrogo_uLcdq2Hw/exec";

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
    const [otherUniversity, setOtherUniversity] = useState("");
    const [status, setStatus] = useState<FormStatus>("idle");
    const [errors, setErrors] = useState<
        Partial<Record<keyof JoinFormData, boolean>>
    >({});
    const ref = useScrollAnimation();
    const formConfigured = !APPS_SCRIPT_URL.includes("YOUR_APPS_SCRIPT_URL");
    const formToggler = true; // Set to false to disable the form

    const validateForm = (): boolean => {
        const newErrors: Partial<Record<keyof JoinFormData, boolean>> = {};

        if (!formData.fullname.trim()) newErrors.fullname = true;
        if (!formData.email.trim()) newErrors.email = true;
        if (!formData.phone.trim()) newErrors.phone = true;
        if (!formData.facebookLink.trim()) newErrors.facebookLink = true;
        if (!formData.region.trim()) newErrors.region = true;
        if (!formData.university) newErrors.university = true;
        if (formData.university === "Autre" && !otherUniversity.trim())
            newErrors.university = true;
        if (!formData.studyLevel) newErrors.studyLevel = true;
        // specialty is optional
        if (!formData.clubExperience) newErrors.clubExperience = true;
        if (!formData.desiredPosition) newErrors.desiredPosition = true;
        // department is optional (only for members)
        if (!formData.sosVillageKnowledge) newErrors.sosVillageKnowledge = true;
        if (!formData.inPersonMeeting) newErrors.inPersonMeeting = true;
        // additionalInfo is optional

        setErrors(newErrors);

        // Scroll to first error field
        if (Object.keys(newErrors).length > 0) {
            const firstErrorKey = Object.keys(newErrors)[0];
            const element = document.getElementById(firstErrorKey);
            if (element) {
                element.scrollIntoView({ behavior: "smooth", block: "center" });
                element.focus();
            }
        }

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
            // Prepare data with actual university value
            const submissionData = {
                ...formData,
                university:
                    formData.university === "Autre"
                        ? otherUniversity
                        : formData.university,
            };

            const response = await fetch("/api/submit-form", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(submissionData),
            });

            const result = await response.json();

            if (result.success) {
                setStatus("success");
                setErrors({});
                setOtherUniversity("");
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
            } else {
                console.error("Submission failed:", result.error);
                setStatus("error");
                setTimeout(() => setStatus("idle"), 5000);
            }
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
                <p className="text-center text-primary-dark/90 mb-8 max-w-2xl mx-auto text-base md:text-lg font-medium">
                    {t.join.subtitle}
                </p>
                {!formConfigured && (
                    <div className="max-w-2xl mx-auto mb-6 rounded-xl border border-amber-300 bg-amber-50 text-amber-800 px-4 py-3 text-sm font-medium text-center">
                        The join form is curreently unavailable. Please wait
                        until its back online.
                    </div>
                )}
                {!formToggler && (
                    <div className="max-w-2xl mx-auto mb-6 rounded-xl border border-amber-300 bg-amber-50 text-amber-800 px-4 py-3 text-sm font-medium text-center">
                        Form is disabled for now
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
                                        className={
                                            errors.fullname
                                                ? "text-red-500"
                                                : "text-primary-dark"
                                        }
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
                                        className={`h-11 bg-white text-primary-dark ${errors.fullname ? "border-red-500 focus:ring-red-500" : ""}`}
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
                                        className={`h-11 bg-white text-primary-dark ${errors.email ? "border-red-500 focus:ring-red-500" : ""}`}
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
                                        className={`h-11 bg-white text-primary-dark ${errors.phone ? "border-red-500 focus:ring-red-500" : ""}`}
                                    />
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
                                        className={
                                            errors.region
                                                ? "text-red-500"
                                                : "text-primary-dark"
                                        }
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
                                        className={`h-11 bg-white text-primary-dark ${errors.region ? "border-red-500 focus:ring-red-500" : ""}`}
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
                                                    setOtherUniversity("");
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
                                    {formData.university === "Autre" && (
                                        <div className="mt-3">
                                            <Input
                                                id="otherUniversity"
                                                type="text"
                                                placeholder={
                                                    language === "fr"
                                                        ? "Nom de votre université"
                                                        : "Your university name"
                                                }
                                                value={otherUniversity}
                                                onChange={(e) => {
                                                    setOtherUniversity(
                                                        e.target.value,
                                                    );
                                                    if (errors.university)
                                                        setErrors({
                                                            ...errors,
                                                            university: false,
                                                        });
                                                }}
                                                className={`h-11 bg-white text-primary-dark ${errors.university ? "border-red-500 focus:ring-red-500" : ""}`}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Row 4: Study Level and Specialty */}
                            <div className="space-y-2" id="studyLevel">
                                <Label
                                    className={
                                        errors.studyLevel
                                            ? "text-red-500"
                                            : "text-primary-dark"
                                    }
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
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="specialty"
                                    className={
                                        errors.specialty
                                            ? "text-red-500"
                                            : "text-primary-dark"
                                    }
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
                                    className={`h-11 bg-white text-primary-dark ${errors.specialty ? "border-red-500 focus:ring-red-500" : ""}`}
                                />
                            </div>

                            {/* Row 5: Club Experience */}
                            <div className="space-y-2" id="clubExperience">
                                <Label
                                    className={
                                        errors.clubExperience
                                            ? "text-red-500"
                                            : "text-primary-dark"
                                    }
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
                            </div>

                            {/* Row 6: Desired Position */}
                            <div className="space-y-2" id="desiredPosition">
                                <Label
                                    className={
                                        errors.desiredPosition
                                            ? "text-red-500"
                                            : "text-primary-dark"
                                    }
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
                                            value: "partnership-manager",
                                            label: t.join.form
                                                .positionPartnership,
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
                            </div>

                            {/* Row 7: Department (shown if member selected) */}
                            {formData.desiredPosition === "member" && (
                                <div className="space-y-2" id="department">
                                    <Label
                                        className={
                                            errors.department
                                                ? "text-red-500"
                                                : "text-primary-dark"
                                        }
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
                                </div>
                            )}

                            {/* Row 8: SOS Village Knowledge */}
                            <div className="space-y-2" id="sosVillageKnowledge">
                                <Label
                                    className={
                                        errors.sosVillageKnowledge
                                            ? "text-red-500"
                                            : "text-primary-dark"
                                    }
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
                            </div>

                            {/* Row 9: In-Person Meeting */}
                            <div className="space-y-2" id="inPersonMeeting">
                                <Label
                                    className={
                                        errors.inPersonMeeting
                                            ? "text-red-500"
                                            : "text-primary-dark"
                                    }
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
                                    status === "loading" ||
                                    !formConfigured ||
                                    !formToggler
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
