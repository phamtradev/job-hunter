import { useEffect, useMemo, useState } from "react";

const SnowOverlay = () => {
    const [visible, setVisible] = useState<boolean>(false);

    const flakes = useMemo(() => {
        return Array.from({ length: 60 }).map((_, idx) => ({
            id: idx,
            left: Math.random() * 100,
            delay: Math.random() * 4,              // 0-4s delay
            duration: 8 + Math.random() * 6,       // 8-14s fall time
            size: 10 + Math.random() * 8,
        }));
    }, []);

    useEffect(() => {
        setVisible(true);
        const longest = Math.max(...flakes.map(f => f.delay + f.duration));
        const buffer = 1.5; // seconds
        const timer = setTimeout(() => setVisible(false), (longest + buffer) * 1000);
        return () => clearTimeout(timer);
    }, [flakes]);

    if (!visible) return null;

    return (
        <div className="snow-overlay pointer-events-none fixed inset-0 z-[60]">
            {flakes.map(flake => (
                <span
                    key={flake.id}
                    className="snow-flake"
                    style={{
                        left: `${flake.left}%`,
                        animationDelay: `${flake.delay}s`,
                        animationDuration: `${flake.duration}s`,
                        width: `${flake.size}px`,
                        height: `${flake.size}px`,
                        fontSize: `${flake.size}px`,
                    }}
                >
                    ✻
                </span>
            ))}
        </div>
    );
};

export default SnowOverlay;

