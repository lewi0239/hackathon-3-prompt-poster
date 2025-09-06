"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CartItem } from "@/components/layout/CartItem";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function CartDialog() {
    const { cartItems, clearCart } = useCart();

    const handleCheckout = () => {
        console.log("Checkout clicked");
    };

    const isEmpty = cartItems.length === 0;

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">View Cart</Button>
            </DialogTrigger>

            <DialogContent className="w-[90vw] max-w-5xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Your Cart</DialogTitle>
                </DialogHeader>

                {isEmpty ? (
                    <div className="flex flex-col items-center justify-center py-12">
                        <ShoppingCart className="w-8 h-8 text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">
                            Your cart is empty.
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Cart Items */}
                        <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-1">
                            {cartItems.map((item) => (
                                <CartItem
                                    key={item.id}
                                    id={item.id}
                                    imageSrc={item.imageSrc}
                                    posterName={item.posterName}
                                    quantity={item.quantity}
                                    finish={item.finish}
                                    dimensions={item.dimensions}
                                    price={item.price}
                                />
                            ))}
                        </div>

                        {/* Subtotal + Total */}
                        <div className="text-right mt-6 space-y-2">
                            <p className="text-base">
                                Subtotal: $
                                {cartItems
                                    .reduce(
                                        (sum, item) =>
                                            sum + item.price * item.quantity,
                                        0,
                                    )
                                    .toFixed(2)}
                            </p>
                            <p className="text-lg font-semibold">
                                Total: $
                                {cartItems
                                    .reduce(
                                        (sum, item) =>
                                            sum + item.price * item.quantity,
                                        0,
                                    )
                                    .toFixed(2)}
                            </p>
                            <div className="flex gap-4 justify-end mt-4">
                                <Button variant="outline" onClick={clearCart}>
                                    Clear Cart
                                </Button>
                                <Button onClick={handleCheckout}>
                                    Checkout
                                </Button>
                            </div>
                        </div>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}
