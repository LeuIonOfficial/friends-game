"use client";

import { useEffect, useState } from "react";

interface TimerToastProps {
    timeLeft: number;
}

export default function TimerToast({ timeLeft }: TimerToastProps) {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        if (timeLeft === 0) {
            setVisible(false);
        }
    }, [timeLeft]);

    if (!visible) return null;

    return (
        <div
            className={`fixed top-5 right-5 bg-primary text-white px-6 py-3 rounded-lg shadow-xl text-lg font-semibold transition-all duration-500 ${timeLeft <= 10 ? "animate-bounce" : ""}`}
        >
            ⏳ Time Left: {timeLeft}s
        </div>
    );
}