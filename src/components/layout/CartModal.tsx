"use client";

import Image from "next/image";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Pencil, Trash2 } from "lucide-react";
import { CartItem } from "@/components/layout/CartItem";

export default function CartDialog() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">View Cart</Button>
            </DialogTrigger>

            <DialogContent className="w-[90vw] max-w-5xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Your Cart</DialogTitle>
                </DialogHeader>

                {/* Cart Items */}
                <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-1">
                    {[1, 2, 3].map((i) => (
                        <CartItem
                            key={i}
                            imageSrc="/next.svg"
                            posterName={`Meme Poster #${i}`}
                            quantity={1}
                            finish="Matte"
                            dimensions="M 45 × 32cm"
                            price={54.99}
                        />
                    ))}
                </div>

                {/* Subtotal + Total */}
                <div className="text-right mt-6 space-y-2">
                    <p className="text-base">Subtotal: $164.97</p>
                    <p className="text-lg font-semibold">Total: $164.97</p>
                    <div className="flex gap-4 justify-end mt-4">
                        <Button variant="outline">Clear Cart</Button>
                        <Button>Checkout</Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
