'use client';

import { useEffect, useRef, useState } from 'react';

export default function AudioPlayer() {
    const audioRef = useRef(null);
    const [isMuted, setIsMuted] = useState(true);

    useEffect(() => {
        const handleScroll = () => {
            if (!audioRef.current) return;

            const audio = audioRef.current;

            // Unmute on first scroll
            audio.muted = false;
            setIsMuted(false);

            // Ensure playback (in case browser paused it)
            audio.play().catch(() => { });

            console.log('[Audio] triggered by scroll');
        };

        window.addEventListener('scroll', handleScroll, { once: true });

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const toggleMute = () => {
        if (!audioRef.current) return;

        const audio = audioRef.current;
        audio.muted = !audio.muted;
        setIsMuted(audio.muted);

        audio.play().catch(() => { });
    };

    return (
        <>
            <audio
                ref={audioRef}
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
            >
                <source src="/audio/carnyx.mp3" type="audio/mpeg" />
            </audio>

            {/* Optional control */}
            <button
                onClick={toggleMute}
                style={{
                    position: 'fixed',
                    bottom: 20,
                    right: 20,
                    zIndex: 9999,
                    padding: '10px 14px',
                    background: '#000',
                    color: '#fff',
                    border: '1px solid #444',
                    cursor: 'pointer'
                }}
            >
                {isMuted ? 'UNMUTE' : 'MUTE'}
            </button>
        </>
    );
}