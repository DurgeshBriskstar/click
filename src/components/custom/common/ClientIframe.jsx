"use client";

import { useEffect, useState } from "react";

export default function ClientIframe({ html }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted || !html) return null;

    return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
