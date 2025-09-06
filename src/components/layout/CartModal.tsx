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
                        <Card key={i} className="p-4 relative flex-row gap-6">
                            {/* Image */}
                            <div className="relative w-28 h-40">
                                <Image
                                    src={"/next.svg"}
                                    alt={`Meme ${i}`}
                                    fill
                                    className="object-cover rounded"
                                    sizes="(max-width: 768px) 100vw, 200px"
                                    priority
                                />
                            </div>

                            {/* Info Section */}
                            <div className="flex flex-col justify-between flex-1">
                                <div>
                                    <h2 className="text-lg font-semibold">
                                        Meme Poster #1
                                    </h2>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        Qty 1 • Matte • M 45 × 32cm
                                    </p>
                                    <button className="flex items-center text-sm text-blue-600 mt-2 hover:underline">
                                        <Pencil className="w-4 h-4 mr-1" />
                                        Edit
                                    </button>
                                </div>

                                <p className="text-lg font-semibold mt-4">
                                    $54.99
                                </p>
                            </div>

                            {/* Trash Icon */}
                            <button className="absolute top-4 right-4 text-muted-foreground hover:text-destructive transition">
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </Card>
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
