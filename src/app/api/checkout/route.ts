import { NextResponse } from "next/server";
import { createCheckoutSession } from "@/lib/createStripeCheckoutSession";

export async function POST(req: Request) {
    const body = await req.json();

    try {
        const session = await createCheckoutSession(
            body.cartItems,
            req.headers.get("origin") || "",
        );

        return NextResponse.json({ id: session.id });
    } catch (error) {
        console.error("Stripe checkout session error:", error);
        return NextResponse.json({ error: "Checkout failed" }, { status: 500 });
    }
}
