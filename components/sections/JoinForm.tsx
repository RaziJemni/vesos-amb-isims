"use client";

import { useState, useRef, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Language, Translations } from "@/lib/translations";
import type { JoinFormData, FormStatus } from "@/lib/types";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import {
    User,
    Briefcase,
    HeartHandshake,
    ChevronRight,
    ChevronLeft,
    Check,
    CheckCircle2,
    AlertCircle,
    RotateCcw,
} from "lucide-react";

interface JoinFormProps {
    t: Translations;
    language: Language;
}

type WizardStep = 1 | 2 | 3;

export function JoinForm({ t, language }: JoinFormProps) {
    const [currentStep, setCurrentStep] = useState<WizardStep>(1);
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
    const [honeypot, setHoneypot] = useState("");
    const [status, setStatus] = useState<FormStatus>("idle");
    const [errors, setErrors] = useState<
        Partial<Record<keyof JoinFormData, boolean>>
    >({});
    const [stepErrorMsg, setStepErrorMsg] = useState<string | null>(null);

    const ref = useScrollAnimation();
    const cardRef = useRef<HTMLDivElement>(null);
    const formConfigured = true;
    const formToggler = process.env.NEXT_PUBLIC_RECRUITMENT_OPEN !== "false";
    const isRtl = language === "ar";

    // Step definitions
    const steps = [
        {
            number: 1 as WizardStep,
            title: t.join.form.step1Title || "Personal & Studies",
            desc: t.join.form.step1Desc || "Your contact and academic details",
            icon: User,
        },
        {
            number: 2 as WizardStep,
            title: t.join.form.step2Title || "Experience & Position",
            desc: t.join.form.step2Desc || "Your past activities and preferred role",
            icon: Briefcase,
        },
        {
            number: 3 as WizardStep,
            title: t.join.form.step3Title || "SOS & Availability",
            desc:
                t.join.form.step3Desc ||
                "Knowledge of SOS Village and availability",
            icon: HeartHandshake,
        },
    ];

    const scrollToForm = () => {
        if (cardRef.current) {
            cardRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    // Validate specific step
    const validateStep = (step: WizardStep): boolean => {
        const newErrors: Partial<Record<keyof JoinFormData, boolean>> = {};

        if (step === 1) {
            if (!formData.fullname.trim()) newErrors.fullname = true;
            if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email))
                newErrors.email = true;
            if (!formData.phone.trim()) newErrors.phone = true;
            if (!formData.facebookLink.trim()) newErrors.facebookLink = true;
            if (!formData.region.trim()) newErrors.region = true;
            if (!formData.university) newErrors.university = true;
            if (formData.university === "Autre" && !otherUniversity.trim())
                newErrors.university = true;
            if (!formData.studyLevel) newErrors.studyLevel = true;
            // specialty is optional
        } else if (step === 2) {
            if (!formData.clubExperience) newErrors.clubExperience = true;
            if (!formData.desiredPosition) newErrors.desiredPosition = true;
            // department is optional
        } else if (step === 3) {
            if (!formData.sosVillageKnowledge) newErrors.sosVillageKnowledge = true;
            if (!formData.inPersonMeeting) newErrors.inPersonMeeting = true;
            // additionalInfo is optional
        }

        setErrors((prev) => ({ ...prev, ...newErrors }));

        const hasErrors = Object.keys(newErrors).length > 0;
        if (hasErrors) {
            setStepErrorMsg(
                t.join.form.fillRequired ||
                    "Please complete all required fields on this step."
            );
            const firstKey = Object.keys(newErrors)[0];
            const el = document.getElementById(firstKey);
            if (el) {
                el.scrollIntoView({ behavior: "smooth", block: "center" });
                el.focus();
            }
            return false;
        }

        setStepErrorMsg(null);
        return true;
    };

    const handleNext = () => {
        if (!validateStep(currentStep)) return;
        if (currentStep < 3) {
            setCurrentStep((prev) => (prev + 1) as WizardStep);
            scrollToForm();
        }
    };

    const handlePrev = () => {
        setStepErrorMsg(null);
        if (currentStep > 1) {
            setCurrentStep((prev) => (prev - 1) as WizardStep);
            scrollToForm();
        }
    };

    const handleStepClick = (targetStep: WizardStep) => {
        if (targetStep < currentStep) {
            setStepErrorMsg(null);
            setCurrentStep(targetStep);
            scrollToForm();
        } else if (targetStep > currentStep) {
            // Only allow jumping forward if current step is valid
            if (validateStep(currentStep)) {
                setCurrentStep(targetStep);
                scrollToForm();
            }
        }
    };

    const resetForm = () => {
        setStatus("idle");
        setCurrentStep(1);
        setErrors({});
        setStepErrorMsg(null);
        setOtherUniversity("");
        setHoneypot("");
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
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!validateStep(1) || !validateStep(2) || !validateStep(3)) {
            setStatus("error");
            return;
        }

        if (!formConfigured || !formToggler) {
            setStatus("error");
            return;
        }

        setStatus("loading");
        setStepErrorMsg(null);

        try {
            const submissionData = {
                ...formData,
                university:
                    formData.university === "Autre"
                        ? otherUniversity
                        : formData.university,
                website_url: honeypot,
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
                scrollToForm();
            } else {
                console.error("Submission failed:", result.error);
                setStatus("error");
                setStepErrorMsg(
                    result.error ||
                    t.join.form.error ||
                    "Submission failed. Please try again."
                );
            }
        } catch (error: any) {
            console.error("Form submission error:", error);
            setStatus("error");
            setStepErrorMsg(
                error?.message ||
                t.join.form.error ||
                "Submission failed. Please try again."
            );
        }
    };

    const progressPercentage =
        currentStep === 1 ? 33 : currentStep === 2 ? 66 : 100;

    return (
        <section
            id="join"
            className="relative min-h-screen flex items-center justify-center py-20 md:py-32 bg-white"
        >
            <div className="container px-4">
                <div className="max-w-3xl mx-auto text-center mb-10">
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-3 text-balance text-primary-dark animate-fade-in-up animate-in">
                        {t.join.title}
                    </h2>
                    <p className="text-primary-dark/80 text-base md:text-lg font-medium">
                        {t.join.subtitle}
                    </p>
                </div>

                {!formToggler && (
                    <div className="max-w-2xl mx-auto mb-8 rounded-xl border border-amber-300 bg-amber-50 text-amber-800 px-5 py-4 text-sm font-medium text-center shadow-sm">
                        {t.join.form.closedAlert || "The join form is currently closed."}
                    </div>
                )}

                <div className="mx-auto max-w-4xl" ref={cardRef}>
                    <div
                        ref={ref}
                        className="bg-white shadow-xl rounded-3xl p-6 sm:p-10 border border-primary/10 animate-fade-in-up"
                    >
                        {/* SUCCESS SCREEN */}
                        {status === "success" ? (
                            <div className="py-12 px-4 text-center space-y-6 animate-fade-in">
                                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                                    <CheckCircle2 className="w-12 h-12" />
                                </div>
                                <div className="space-y-2 max-w-lg mx-auto">
                                    <h3 className="text-2xl sm:text-3xl font-bold text-primary-dark">
                                        {t.join.form.successTitle ||
                                            "Application Submitted Successfully!"}
                                    </h3>
                                    <p className="text-primary-dark/80 text-base">
                                        {t.join.form.success}
                                    </p>
                                    <p className="text-sm text-gray-500 pt-2">
                                        {t.join.form.successSubtitle ||
                                            "Our HR team will review your application and get in touch to schedule an interview."}
                                    </p>
                                </div>
                                <div className="pt-4">
                                    <Button
                                        onClick={resetForm}
                                        variant="outline"
                                        className="gap-2 border-primary/30 text-primary hover:bg-primary/5"
                                    >
                                        <RotateCcw className="w-4 h-4" />
                                        {t.join.form.submitAnother ||
                                            "Submit another response"}
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div>
                                {/* WIZARD STEPPER HEADER */}
                                <div className="mb-8">
                                    {/* Progress Bar Track */}
                                    <div className="relative w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-6">
                                        <div
                                            className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500 ease-out"
                                            style={{
                                                width: `${progressPercentage}%`,
                                            }}
                                        />
                                    </div>

                                    {/* Stepper Nodes */}
                                    <div className="grid grid-cols-3 gap-2 sm:gap-4">
                                        {steps.map((s) => {
                                            const isDone = currentStep > s.number;
                                            const isActive = currentStep === s.number;
                                            const Icon = s.icon;

                                            return (
                                                <button
                                                    key={s.number}
                                                    type="button"
                                                    onClick={() =>
                                                        handleStepClick(s.number)
                                                    }
                                                    className={`flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-2 sm:gap-3 p-2 rounded-xl transition-all ${
                                                        isActive
                                                            ? "bg-primary/10 border border-primary/30"
                                                            : isDone
                                                            ? "hover:bg-gray-50 cursor-pointer"
                                                            : "opacity-60 cursor-default"
                                                    }`}
                                                >
                                                    <div
                                                        className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 transition-colors ${
                                                            isDone
                                                                ? "bg-green-600 text-white shadow-sm"
                                                                : isActive
                                                                ? "bg-primary text-white shadow-md ring-4 ring-primary/20"
                                                                : "bg-gray-200 text-gray-600"
                                                        }`}
                                                    >
                                                        {isDone ? (
                                                            <Check className="w-5 h-5 stroke-[2.5]" />
                                                        ) : (
                                                            <Icon className="w-5 h-5" />
                                                        )}
                                                    </div>
                                                    <div className="hidden sm:block min-w-0">
                                                        <span className="block text-xs font-semibold text-primary uppercase tracking-wider">
                                                            {t.join.form.step || "Step"}{" "}
                                                            {s.number}{" "}
                                                            {t.join.form.of || "of"} 3
                                                        </span>
                                                        <span
                                                            className={`block text-sm font-semibold truncate ${
                                                                isActive
                                                                    ? "text-primary-dark"
                                                                    : "text-gray-600"
                                                            }`}
                                                        >
                                                            {s.title}
                                                        </span>
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {/* Active Step Subtitle for Mobile */}
                                    <div className="mt-4 sm:hidden text-center bg-primary/5 py-2 px-3 rounded-lg">
                                        <p className="text-xs font-semibold text-primary uppercase tracking-wider">
                                            {t.join.form.step || "Step"}{" "}
                                            {currentStep} {t.join.form.of || "of"} 3:{" "}
                                            {steps[currentStep - 1].title}
                                        </p>
                                    </div>
                                </div>

                                {/* Step Error Banner */}
                                {stepErrorMsg && (
                                    <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-center gap-3 text-sm animate-fade-in">
                                        <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-500" />
                                        <span>{stepErrorMsg}</span>
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Invisible Honeypot */}
                                    <input
                                        type="text"
                                        name="website_url"
                                        value={honeypot}
                                        onChange={(e) => setHoneypot(e.target.value)}
                                        tabIndex={-1}
                                        autoComplete="off"
                                        style={{
                                            position: "absolute",
                                            left: "-9999px",
                                            opacity: 0,
                                            pointerEvents: "none",
                                        }}
                                        aria-hidden="true"
                                    />

                                    {/* ======================================================== */}
                                    {/* STEP 1: PERSONAL & ACADEMIC INFO */}
                                    {/* ======================================================== */}
                                    {currentStep === 1 && (
                                        <div className="space-y-6 animate-fade-in">
                                            <div className="border-b pb-4">
                                                <h3 className="text-xl font-bold text-primary-dark">
                                                    {steps[0].title}
                                                </h3>
                                                <p className="text-sm text-gray-500">
                                                    {steps[0].desc}
                                                </p>
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
                                                        placeholder={
                                                            t.join.form
                                                                .fullnamePlaceholder
                                                        }
                                                        value={formData.fullname}
                                                        onChange={(e) => {
                                                            setFormData({
                                                                ...formData,
                                                                fullname:
                                                                    e.target.value,
                                                            });
                                                            if (errors.fullname)
                                                                setErrors({
                                                                    ...errors,
                                                                    fullname: false,
                                                                });
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
                                                        placeholder={
                                                            t.join.form
                                                                .emailPlaceholder
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
                                                        placeholder={
                                                            t.join.form
                                                                .phonePlaceholder
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
                                                        placeholder={
                                                            t.join.form
                                                                .facebookLinkPlaceholder
                                                        }
                                                        value={
                                                            formData.facebookLink
                                                        }
                                                        onChange={(e) => {
                                                            setFormData({
                                                                ...formData,
                                                                facebookLink:
                                                                    e.target.value,
                                                            });
                                                            if (
                                                                errors.facebookLink
                                                            )
                                                                setErrors({
                                                                    ...errors,
                                                                    facebookLink: false,
                                                                });
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
                                                        placeholder={
                                                            t.join.form
                                                                .regionPlaceholder
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
                                                        className={`h-11 bg-white text-primary-dark ${
                                                            errors.region
                                                                ? "border-red-500 focus:ring-red-500"
                                                                : ""
                                                        }`}
                                                    />
                                                </div>

                                                <div
                                                    className="space-y-2"
                                                    id="university"
                                                >
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
                                                                checked={
                                                                    formData.university ===
                                                                    "ISIMS"
                                                                }
                                                                onChange={(e) => {
                                                                    setFormData({
                                                                        ...formData,
                                                                        university:
                                                                            e.target
                                                                                .value,
                                                                    });
                                                                    setOtherUniversity(
                                                                        ""
                                                                    );
                                                                    if (
                                                                        errors.university
                                                                    )
                                                                        setErrors({
                                                                            ...errors,
                                                                            university: false,
                                                                        });
                                                                }}
                                                                className="w-4 h-4 text-primary"
                                                            />
                                                            <span className="text-primary-dark font-medium text-sm">
                                                                {
                                                                    t.join.form
                                                                        .universityISIMS
                                                                }
                                                            </span>
                                                        </label>
                                                        <label className="flex items-center gap-2 cursor-pointer bg-gray-50 hover:bg-gray-100 p-2.5 rounded-lg border flex-1">
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
                                                                            e.target
                                                                                .value,
                                                                    });
                                                                    if (
                                                                        errors.university
                                                                    )
                                                                        setErrors({
                                                                            ...errors,
                                                                            university: false,
                                                                        });
                                                                }}
                                                                className="w-4 h-4 text-primary"
                                                            />
                                                            <span className="text-primary-dark font-medium text-sm">
                                                                {
                                                                    t.join.form
                                                                        .universityOther
                                                                }
                                                            </span>
                                                        </label>
                                                    </div>

                                                    {formData.university ===
                                                        "Autre" && (
                                                        <div className="mt-2 animate-fade-in">
                                                            <Input
                                                                id="otherUniversity"
                                                                type="text"
                                                                placeholder={
                                                                    t.join.form
                                                                        .otherUniversityPlaceholder ||
                                                                    "Your university name"
                                                                }
                                                                value={
                                                                    otherUniversity
                                                                }
                                                                onChange={(e) => {
                                                                    setOtherUniversity(
                                                                        e.target
                                                                            .value
                                                                    );
                                                                    if (
                                                                        errors.university
                                                                    )
                                                                        setErrors({
                                                                            ...errors,
                                                                            university: false,
                                                                        });
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
                                                <div
                                                    className="space-y-2"
                                                    id="studyLevel"
                                                >
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
                                                                label: t.join.form
                                                                    .studyLevelOther,
                                                            },
                                                        ].map((option) => (
                                                            <label
                                                                key={option.value}
                                                                className="flex items-center gap-2 cursor-pointer bg-gray-50 hover:bg-gray-100 p-2.5 rounded-lg border text-sm"
                                                            >
                                                                <input
                                                                    type="radio"
                                                                    name="studyLevel"
                                                                    value={
                                                                        option.value
                                                                    }
                                                                    checked={
                                                                        formData.studyLevel ===
                                                                        option.value
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) => {
                                                                        setFormData({
                                                                            ...formData,
                                                                            studyLevel:
                                                                                e
                                                                                    .target
                                                                                    .value,
                                                                        });
                                                                        if (
                                                                            errors.studyLevel
                                                                        )
                                                                            setErrors({
                                                                                ...errors,
                                                                                studyLevel: false,
                                                                            });
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
                                                        placeholder={
                                                            t.join.form
                                                                .specialtyPlaceholder
                                                        }
                                                        value={formData.specialty}
                                                        onChange={(e) => {
                                                            setFormData({
                                                                ...formData,
                                                                specialty:
                                                                    e.target.value,
                                                            });
                                                        }}
                                                        className="h-11 bg-white text-primary-dark"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* ======================================================== */}
                                    {/* STEP 2: EXPERIENCE & DESIRED POSITION */}
                                    {/* ======================================================== */}
                                    {currentStep === 2 && (
                                        <div className="space-y-6 animate-fade-in">
                                            <div className="border-b pb-4">
                                                <h3 className="text-xl font-bold text-primary-dark">
                                                    {steps[1].title}
                                                </h3>
                                                <p className="text-sm text-gray-500">
                                                    {steps[1].desc}
                                                </p>
                                            </div>

                                            {/* Club Experience */}
                                            <div
                                                className="space-y-2"
                                                id="clubExperience"
                                            >
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
                                                    {[
                                                        {
                                                            value: "yes",
                                                            label: t.join.form.yes,
                                                        },
                                                        {
                                                            value: "no",
                                                            label: t.join.form.no,
                                                        },
                                                    ].map((option) => (
                                                        <label
                                                            key={option.value}
                                                            className="flex items-center gap-2 cursor-pointer bg-gray-50 hover:bg-gray-100 px-6 py-3 rounded-lg border flex-1"
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
                                                                            e.target
                                                                                .value,
                                                                    });
                                                                    if (
                                                                        errors.clubExperience
                                                                    )
                                                                        setErrors({
                                                                            ...errors,
                                                                            clubExperience: false,
                                                                        });
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
                                            <div
                                                className="space-y-2"
                                                id="desiredPosition"
                                            >
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
                                                    {[
                                                        {
                                                            value: "treasurer",
                                                            label: t.join.form
                                                                .positionTreasurer,
                                                        },
                                                        {
                                                            value: "secretary-general",
                                                            label: t.join.form
                                                                .positionSecretaryGeneral,
                                                        },
                                                        {
                                                            value: "partnership-manager",
                                                            label: t.join.form
                                                                .positionPartnershipManager,
                                                        },
                                                        {
                                                            value: "partnership-assistant",
                                                            label: t.join.form
                                                                .positionPartnershipAssistant,
                                                        },
                                                        {
                                                            value: "comm-manager",
                                                            label: t.join.form
                                                                .positionCommManager,
                                                        },
                                                        {
                                                            value: "comm-assistant",
                                                            label: t.join.form
                                                                .positionCommAssistant,
                                                        },
                                                        {
                                                            value: "hr-manager",
                                                            label: t.join.form
                                                                .positionHRManager,
                                                        },
                                                        {
                                                            value: "hr-assistant",
                                                            label: t.join.form
                                                                .positionHRAssistant,
                                                        },
                                                        {
                                                            value: "events-assistant",
                                                            label: t.join.form
                                                                .positionEventsAssistant,
                                                        },
                                                        {
                                                            value: "member",
                                                            label: t.join.form
                                                                .positionMember,
                                                        },
                                                    ].map((option) => (
                                                        <label
                                                            key={option.value}
                                                            className={`flex items-center gap-3 cursor-pointer p-4 rounded-xl border transition-all ${
                                                                formData.desiredPosition ===
                                                                option.value
                                                                    ? "border-primary bg-primary/5 shadow-sm"
                                                                    : "border-gray-200 bg-gray-50 hover:bg-gray-100"
                                                            }`}
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
                                                                            e.target
                                                                                .value,
                                                                    });
                                                                    if (
                                                                        errors.desiredPosition
                                                                    )
                                                                        setErrors({
                                                                            ...errors,
                                                                            desiredPosition: false,
                                                                        });
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
                                            {formData.desiredPosition ===
                                                "member" && (
                                                <div
                                                    className="space-y-2 pt-2 animate-fade-in"
                                                    id="department"
                                                >
                                                    <Label className="text-primary-dark">
                                                        {t.join.form.department}
                                                    </Label>
                                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2">
                                                        {[
                                                            {
                                                                value: "hr",
                                                                label: t.join.form
                                                                    .departmentHR,
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
                                                                className={`flex items-center gap-3 cursor-pointer p-3.5 rounded-xl border transition-all ${
                                                                    formData.department ===
                                                                    option.value
                                                                        ? "border-accent bg-accent/5 shadow-sm"
                                                                        : "border-gray-200 bg-gray-50 hover:bg-gray-100"
                                                                }`}
                                                            >
                                                                <input
                                                                    type="radio"
                                                                    name="department"
                                                                    value={
                                                                        option.value
                                                                    }
                                                                    checked={
                                                                        formData.department ===
                                                                        option.value
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) => {
                                                                        setFormData({
                                                                            ...formData,
                                                                            department:
                                                                                e
                                                                                    .target
                                                                                    .value,
                                                                        });
                                                                    }}
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
                                    )}

                                    {/* ======================================================== */}
                                    {/* STEP 3: SOS VILLAGE & AVAILABILITY */}
                                    {/* ======================================================== */}
                                    {currentStep === 3 && (
                                        <div className="space-y-6 animate-fade-in">
                                            <div className="border-b pb-4">
                                                <h3 className="text-xl font-bold text-primary-dark">
                                                    {steps[2].title}
                                                </h3>
                                                <p className="text-sm text-gray-500">
                                                    {steps[2].desc}
                                                </p>
                                            </div>

                                            {/* SOS Village Knowledge */}
                                            <div
                                                className="space-y-2"
                                                id="sosVillageKnowledge"
                                            >
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
                                                            className={`flex items-start gap-3 cursor-pointer p-3.5 rounded-xl border transition-all ${
                                                                formData.sosVillageKnowledge ===
                                                                option.value
                                                                    ? "border-primary bg-primary/5"
                                                                    : "border-gray-200 bg-gray-50 hover:bg-gray-100"
                                                            }`}
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
                                                                            e.target
                                                                                .value,
                                                                    });
                                                                    if (
                                                                        errors.sosVillageKnowledge
                                                                    )
                                                                        setErrors({
                                                                            ...errors,
                                                                            sosVillageKnowledge: false,
                                                                        });
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
                                            <div
                                                className="space-y-2"
                                                id="inPersonMeeting"
                                            >
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
                                                            className={`flex items-center gap-2.5 cursor-pointer p-3 rounded-xl border text-sm transition-all ${
                                                                formData.inPersonMeeting ===
                                                                option.value
                                                                    ? "border-primary bg-primary/5"
                                                                    : "border-gray-200 bg-gray-50 hover:bg-gray-100"
                                                            }`}
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
                                                                            e.target
                                                                                .value,
                                                                    });
                                                                    if (
                                                                        errors.inPersonMeeting
                                                                    )
                                                                        setErrors({
                                                                            ...errors,
                                                                            inPersonMeeting: false,
                                                                        });
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
                                                    placeholder={
                                                        t.join.form
                                                            .additionalInfoPlaceholder
                                                    }
                                                    value={formData.additionalInfo}
                                                    onChange={(e) =>
                                                        setFormData({
                                                            ...formData,
                                                            additionalInfo:
                                                                e.target.value,
                                                        })
                                                    }
                                                    rows={3}
                                                    className="resize-none bg-white text-primary-dark"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* ======================================================== */}
                                    {/* WIZARD NAVIGATION CONTROLS */}
                                    {/* ======================================================== */}
                                    <div className="pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-3">
                                        <div>
                                            {currentStep > 1 && (
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={handlePrev}
                                                    className="w-full sm:w-auto gap-2 border-gray-300 text-primary-dark hover:bg-gray-50"
                                                >
                                                    {isRtl ? (
                                                        <ChevronRight className="w-4 h-4" />
                                                    ) : (
                                                        <ChevronLeft className="w-4 h-4" />
                                                    )}
                                                    {t.join.form.prev || "Previous Step"}
                                                </Button>
                                            )}
                                        </div>

                                        <div className="w-full sm:w-auto flex items-center gap-3">
                                            {currentStep < 3 ? (
                                                <Button
                                                    type="button"
                                                    onClick={handleNext}
                                                    className="w-full sm:w-auto gap-2 bg-primary hover:bg-primary/90 text-white font-bold px-8 shadow-md"
                                                >
                                                    {t.join.form.next || "Next Step"}
                                                    {isRtl ? (
                                                        <ChevronLeft className="w-4 h-4" />
                                                    ) : (
                                                        <ChevronRight className="w-4 h-4" />
                                                    )}
                                                </Button>
                                            ) : (
                                                <Button
                                                    type="submit"
                                                    size="lg"
                                                    className="w-full sm:w-auto bg-secondary hover:bg-secondary/90 text-white font-bold px-10 shadow-lg"
                                                    disabled={
                                                        status === "loading" ||
                                                        !formConfigured ||
                                                        !formToggler
                                                    }
                                                >
                                                    {status === "loading" ? (
                                                        <span className="flex items-center gap-2">
                                                            <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                            {t.join.form.submitting ||
                                                                "Submitting..."}
                                                        </span>
                                                    ) : (
                                                        t.join.form.submit
                                                    )}
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
