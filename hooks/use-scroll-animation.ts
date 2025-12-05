"use client";

import { useEffect, useRef } from "react";

export function useScrollAnimation() {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("animate-in");
                } else {
                    entry.target.classList.remove("animate-in");
                }
            },
            { threshold: 0.05 }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, []);

    return ref;
}
