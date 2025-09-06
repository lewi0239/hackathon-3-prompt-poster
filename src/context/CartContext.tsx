"use client";

import { createContext, useContext, useEffect, useState } from "react";

const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2, 8);
};

type CartItem = {
    id: string;
    imageSrc: string;
    posterName: string;
    quantity: number;
    finish: string;
    dimensions: string;
    price: number;
};

type CartItemInput = Omit<CartItem, "id">;

type CartContextType = {
    cartItems: CartItem[];
    addToCart: (item: CartItemInput) => void;
    removeFromCart: (id: string) => void;
    clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);

    useEffect(() => {
        setCartItems([
            {
                id: "1",
                imageSrc: "/next.svg",
                posterName: "Meme Poster #1",
                quantity: 1,
                finish: "Glossy",
                dimensions: "M 45 × 32cm",
                price: 54.99,
            },
            {
                id: "2",
                imageSrc: "/next.svg",
                posterName: "Elden Ring Art",
                quantity: 2,
                finish: "Matte",
                dimensions: "L 60 × 40cm",
                price: 74.99,
            },
            {
                id: "3",
                imageSrc: "/next.svg",
                posterName: "Anime Collage",
                quantity: 1,
                finish: "Matte",
                dimensions: "S 30 × 20cm",
                price: 39.99,
            },
        ]);
    }, []);

    const addToCart = (item: CartItemInput) => {
        setCartItems((prev) => [...prev, { ...item, id: generateId() }]);
    };

    const removeFromCart = (id: string) => {
        setCartItems((prev) => prev.filter((item) => item.id !== id));
    };

    const clearCart = () => {
        setCartItems([]);
    };

    return (
        <CartContext.Provider
            value={{ cartItems, addToCart, removeFromCart, clearCart }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within CartProvider");
    }
    return context;
};
