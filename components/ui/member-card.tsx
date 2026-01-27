"use client";

import { Mail, Instagram, Linkedin } from "lucide-react";
import type { ReactNode } from "react";
import type { Language } from "@/lib/translations";

interface Member {
    name: string;
    role?: string;
    roleFr?: string;
    email?: string;
    instagram?: string;
    linkedin?: string;
    image?: string;
    isMascot?: boolean;
}

interface MemberCardProps {
    member: Member;
    language?: Language;
    className?: string;
    children?: ReactNode;
}

export default function MemberCard({
    member,
    language = "en",
    className = "",
    children,
}: MemberCardProps) {
    const role = language === "fr" ? member.roleFr || member.role : member.role;

    return (
        <div
            className={`bg-white rounded-lg shadow-sm overflow-hidden ${member.isMascot ? "col-span-2 row-span-2" : ""} ${className}`}
        >
            <div
                className={`w-full ${member.isMascot ? "h-96" : "h-40"} bg-primary relative`}
            >
                {member.image ? (
                    // keep plain img fallback if Image isn't available in some environments
                    <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div
                        className={`w-full h-full flex items-center justify-center ${member.isMascot ? "bg-primary" : "bg-primary"} text-white`}
                    >
                        <span
                            className={`${member.isMascot ? "text-5xl" : "text-lg"} font-medium`}
                        >
                            {member.name.split(" ")[0]}
                        </span>
                    </div>
                )}
            </div>

            <div className={`p-4 ${member.isMascot ? "py-8 text-center" : ""}`}>
                <h3
                    className={`font-semibold ${member.isMascot ? "text-4xl text-primary" : "text-lg"}`}
                >
                    {member.name}
                </h3>
                {role && (
                    <p
                        className={`text-muted-foreground mb-3 ${member.isMascot ? "text-xl" : "text-sm"}`}
                    >
                        {role}
                    </p>
                )}

                <div className="flex items-center gap-2">
                    {!member.isMascot && member.email && (
                        <a
                            href={`mailto:${member.email}`}
                            className="text-sm text-primary flex items-center gap-1 hover:underline"
                        >
                            <Mail className="w-4 h-4" />
                            <span className="sr-only">Email</span>
                            <span className="truncate max-w-[8rem]">
                                {member.email}
                            </span>
                        </a>
                    )}

                    {!member.isMascot && member.instagram && (
                        <a
                            href={member.instagram}
                            target="_blank"
                            rel="noreferrer"
                            aria-label="Instagram"
                            className="text-muted-foreground hover:text-primary"
                        >
                            <Instagram className="w-5 h-5" />
                        </a>
                    )}

                    {!member.isMascot && member.linkedin && (
                        <a
                            href={member.linkedin}
                            target="_blank"
                            rel="noreferrer"
                            aria-label="LinkedIn"
                            className="text-muted-foreground hover:text-primary"
                        >
                            <Linkedin className="w-5 h-5" />
                        </a>
                    )}
                </div>

                {children}
            </div>
        </div>
    );
}
