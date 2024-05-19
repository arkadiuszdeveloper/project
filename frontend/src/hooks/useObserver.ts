import { useEffect, useRef, useState } from "react";

export const useVisibilityObserver = (disable: boolean) => {
    const [isVisible, setIsVisible] = useState(false);
    const observedElementRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setIsVisible(true);

                    if (disable)
                        observer.unobserve(entry.target);
                } else {
                    setIsVisible(false);
                }
            });
        }, { threshold: 0.1 });

        const currentElement = observedElementRef.current;
        if (currentElement) {
            observer.observe(currentElement);
        }

        return () => {
            if (currentElement) {
                observer.disconnect();
            }
        };
    }, []);

    return { ref: observedElementRef, isVisible };
};