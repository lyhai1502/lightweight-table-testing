import { useEffect } from "react";

export const useInfiniteScroll = (callback: () => void, triggerRef: React.RefObject<HTMLElement>) => {
    useEffect(() => {
        if (!triggerRef.current) return;
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) callback();
        });
        observer.observe(triggerRef.current);
        return () => observer.disconnect();
    }, [triggerRef, callback]);
};
