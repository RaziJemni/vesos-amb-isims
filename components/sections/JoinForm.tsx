"use client";

import { useState, useRef, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import type { Language, Translations } from "@/lib/translations";
import type { JoinFormData, FormStatus } from "@/lib/types";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import {
    User,
    Briefcase,
    HeartHandshake,
    ChevronRight,
    ChevronLeft,
    AlertCircle,
} from "lucide-react";
import { JoinStepper, type WizardStep, type StepDefinition } from "./join/JoinStepper";
import { JoinStep1 } from "./join/JoinStep1";
import { JoinStep2 } from "./join/JoinStep2";
import { JoinStep3 } from "./join/JoinStep3";
import { JoinSuccess } from "./join/JoinSuccess";

interface JoinFormProps {
    t: Translations;
    language: Language;
}

const INITIAL_FORM_DATA: JoinFormData = {
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
};

export function JoinForm({ t, language }: JoinFormProps) {
    const [currentStep, setCurrentStep] = useState<WizardStep>(1);
    const [formData, setFormData] = useState<JoinFormData>(INITIAL_FORM_DATA);
    const [otherUniversity, setOtherUniversity] = useState("");
    const [honeypot, setHoneypot] = useState("");
    const [status, setStatus] = useState<FormStatus>("idle");
    const [errors, setErrors] = useState<Partial<Record<keyof JoinFormData, boolean>>>({});
    const [stepErrorMsg, setStepErrorMsg] = useState<string | null>(null);
    const [stepTransitionTime, setStepTransitionTime] = useState<number>(0);

    const ref = useScrollAnimation();
    const cardRef = useRef<HTMLDivElement>(null);
    const formConfigured = true;
    const formToggler = process.env.NEXT_PUBLIC_RECRUITMENT_OPEN !== "false";
    const isRtl = language === "ar";

    const steps: StepDefinition[] = [
        {
            number: 1,
            title: t.join.form.step1Title || "Personal & Studies",
            desc: t.join.form.step1Desc || "Your contact and academic details",
            icon: User,
        },
        {
            number: 2,
            title: t.join.form.step2Title || "Experience & Position",
            desc: t.join.form.step2Desc || "Your past activities and preferred role",
            icon: Briefcase,
        },
        {
            number: 3,
            title: t.join.form.step3Title || "SOS & Availability",
            desc: t.join.form.step3Desc || "Knowledge of SOS Village and availability",
            icon: HeartHandshake,
        },
    ];

    const scrollToForm = () => {
        if (cardRef.current) {
            cardRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    const updateFormData = (updates: Partial<JoinFormData>) => {
        setFormData((prev) => ({ ...prev, ...updates }));
    };

    const clearError = (field: keyof JoinFormData) => {
        setErrors((prev) => ({ ...prev, [field]: false }));
    };

    const resetForm = () => {
        setStatus("idle");
        setCurrentStep(1);
        setErrors({});
        setStepErrorMsg(null);
        setOtherUniversity("");
        setHoneypot("");
        setFormData(INITIAL_FORM_DATA);
    };

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
        } else if (step === 2) {
            if (!formData.clubExperience) newErrors.clubExperience = true;
            if (!formData.desiredPosition) newErrors.desiredPosition = true;
        } else if (step === 3) {
            if (!formData.sosVillageKnowledge) newErrors.sosVillageKnowledge = true;
            if (!formData.inPersonMeeting) newErrors.inPersonMeeting = true;
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
            const nextStep = (currentStep + 1) as WizardStep;
            setCurrentStep(nextStep);
            setStepTransitionTime(Date.now());
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
            if (validateStep(currentStep)) {
                setCurrentStep(targetStep);
                setStepTransitionTime(Date.now());
                scrollToForm();
            }
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (currentStep !== 3) {
            handleNext();
            return;
        }

        if (Date.now() - stepTransitionTime < 450) {
            return;
        }

        if (!validateStep(1)) {
            setCurrentStep(1);
            scrollToForm();
            return;
        }
        if (!validateStep(2)) {
            setCurrentStep(2);
            scrollToForm();
            return;
        }
        if (!validateStep(3)) {
            scrollToForm();
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
                        {status === "success" ? (
                            <JoinSuccess t={t} onReset={resetForm} />
                        ) : (
                            <div>
                                <JoinStepper
                                    steps={steps}
                                    currentStep={currentStep}
                                    progressPercentage={progressPercentage}
                                    t={t}
                                    onStepClick={handleStepClick}
                                />

                                {stepErrorMsg && (
                                    <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-center gap-3 text-sm animate-fade-in">
                                        <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-500" />
                                        <span>{stepErrorMsg}</span>
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-6">
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

                                    {currentStep === 1 && (
                                        <JoinStep1
                                            t={t}
                                            title={steps[0].title}
                                            desc={steps[0].desc}
                                            formData={formData}
                                            otherUniversity={otherUniversity}
                                            errors={errors}
                                            onChange={updateFormData}
                                            onOtherUniversityChange={setOtherUniversity}
                                            clearError={clearError}
                                        />
                                    )}

                                    {currentStep === 2 && (
                                        <JoinStep2
                                            t={t}
                                            title={steps[1].title}
                                            desc={steps[1].desc}
                                            formData={formData}
                                            errors={errors}
                                            onChange={updateFormData}
                                            clearError={clearError}
                                        />
                                    )}

                                    {currentStep === 3 && (
                                        <JoinStep3
                                            t={t}
                                            title={steps[2].title}
                                            desc={steps[2].desc}
                                            formData={formData}
                                            errors={errors}
                                            onChange={updateFormData}
                                            clearError={clearError}
                                        />
                                    )}

                                    {/* Navigation Controls */}
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
                                                    key="wizard-next-step-btn"
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        handleNext();
                                                    }}
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
                                                    key="wizard-submit-final-btn"
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
