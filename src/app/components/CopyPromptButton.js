'use client';

import { useState } from 'react';

export default function CopyPromptButton({ prompt }) {
    const [copied, setCopied] = useState(false);

    async function copyPrompt() {
        try {
            await navigator.clipboard.writeText(prompt);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1600);
        } catch {
            setCopied(false);
        }
    }

    return (
        <button
            type="button"
            className="agent-prompt-copy"
            onClick={copyPrompt}
            aria-label="Copy agent prompt"
        >
            {copied ? 'Copied' : 'Copy prompt'}
        </button>
    );
}
