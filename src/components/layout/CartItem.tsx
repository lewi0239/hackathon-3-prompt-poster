"use client";

import Image from "next/image";
import { Pencil, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";

type CartItemProps = {
    imageSrc: string;
    posterName: string;
    quantity: number;
    finish: string;
    dimensions: string;
    price: number;
};

export function CartItem({
    imageSrc,
    posterName,
    quantity,
    finish,
    dimensions,
    price,
}: CartItemProps) {
    return (
        <Card className="p-4 relative flex-row gap-6">
            {/* Image */}
            <div className="relative w-28 h-40 shrink-0">
                <Image
                    src={imageSrc}
                    alt={posterName}
                    fill
                    className="object-cover rounded"
                    sizes="(max-width: 768px) 100vw, 200px"
                    priority
                />
            </div>

            {/* Info Section */}
            <div className="flex flex-col justify-between flex-1">
                <div>
                    <h2 className="text-lg font-semibold">{posterName}</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                        Qty {quantity} • {finish} • {dimensions}
                    </p>
                    <button className="flex items-center text-sm text-blue-600 mt-2 hover:underline">
                        <Pencil className="w-4 h-4 mr-1" />
                        Edit
                    </button>
                </div>

                <p className="text-lg font-semibold mt-4">
                    ${price.toFixed(2)}
                </p>
            </div>

            {/* Trash Icon */}
            <button className="absolute top-4 right-4 text-muted-foreground hover:text-destructive transition">
                <Trash2 className="w-5 h-5" />
            </button>
        </Card>
    );
}
