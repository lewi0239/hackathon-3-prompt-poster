import { stripe } from "./stripe";

type CartItem = {
    posterName: string;
    price: number;
    quantity: number;
};

export async function createCheckoutSession(
    cartItems: CartItem[],
    origin: string,
) {
    return await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        line_items: cartItems.map((item) => ({
            price_data: {
                currency: "usd",
                product_data: {
                    name: item.posterName,
                },
                unit_amount: Math.round(item.price * 100), // Stripe uses cents
            },
            quantity: item.quantity,
        })),
        success_url: `${origin}/success`,
        cancel_url: `${origin}/cancel`,
    });
}
