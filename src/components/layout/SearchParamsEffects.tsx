"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export default function SearchParamEffects() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const success = searchParams.get("success") === "true";

    useEffect(() => {
        if (success) {
            toast.success("Payment successful!", {
                description: "Your order has been placed 🎉",
            });

            const newParams = new URLSearchParams(searchParams.toString());
            newParams.delete("success");
            router.replace(`/?${newParams.toString()}`, { scroll: false });
        }
    }, [success, searchParams, router]);

    return null;
}
