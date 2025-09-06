"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CancelPage() {
    const router = useRouter();

    useEffect(() => {
        router.push("/?cart=open");
    }, [router]);

    return null;
}
