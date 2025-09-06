"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import CartModal from "@/components/layout/CartModal";
import { toast } from "sonner";

export default function Home() {
    const [prompt, setPrompt] = useState("");
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState<string | null>(null);

    const router = useRouter();
    const searchParams = useSearchParams();
    const cartOpen = searchParams.get("cart") === "open";
    const success = searchParams.get("success") === "true";

    useEffect(() => {
        if (success) {
            toast.success("Payment successful!", {
                description: "Your order has been placed 🎉",
            });

            // Clean the URL after showing the toast
            const newParams = new URLSearchParams(searchParams.toString());
            newParams.delete("success");

            router.replace(`/?${newParams.toString()}`, { scroll: false });
        }
    }, [success, searchParams, router]);

    async function handleGenerate(e: React.FormEvent) {
        e.preventDefault();
        if (!prompt.trim()) return;
        setLoading(true);
        setErr(null);
        setImageUrl(null);

        try {
            const res = await fetch("/api/llm", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data?.error || "Failed to generate");
            setImageUrl(data.url as string); // your API returns { url: "/api/preview/:id" }
        } catch (e: any) {
            setErr(e.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="font-sans min-h-screen flex flex-col">
            {/* Navbar */}
            <nav className="w-full border-b">
                <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
                    <Link href="/" className="font-semibold tracking-tight">
                        AI-to-Print
                    </Link>

                    <NavigationMenu>
                        <NavigationMenuList>
                            <NavigationMenuItem>
                                <NavigationMenuLink
                                    asChild
                                    className={navigationMenuTriggerStyle()}
                                >
                                    <Link href="/">Home</Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>

                            <NavigationMenuItem>
                                <NavigationMenuLink
                                    asChild
                                    className={navigationMenuTriggerStyle()}
                                >
                                    <Link href="/about">About</Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>

                            <NavigationMenuItem>
                                <CartModal defaultOpen={cartOpen} />
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>
            </nav>

            {/* Hero / CTA */}
            <header className="mx-auto w-full max-w-6xl px-4 py-10 sm:py-16 grid gap-6 sm:grid-cols-2 items-center">
                <div className="space-y-4">
                    <h1 className="text-3xl sm:text-5xl font-bold leading-tight">
                        Turn any idea into a poster — instantly.
                    </h1>
                    <p className="text-muted-foreground">
                        Type a prompt. We generate the art. Pick a size and
                        print.
                    </p>

                    <form onSubmit={handleGenerate} className="flex gap-2">
                        <input
                            id="prompt"
                            type="text"
                            placeholder="e.g., retro sci-fi cityscape in neon dusk"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none"
                        />
                        <button
                            type="submit"
                            disabled={loading || !prompt.trim()}
                            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors disabled:opacity-50"
                        >
                            {loading ? "Generating..." : "Generate"}
                        </button>
                    </form>

                    {err && <p className="text-sm text-red-600">{err}</p>}
                </div>

                {/* Preview */}
                <div className="border rounded-md overflow-hidden aspect-[4/3] bg-muted grid place-items-center">
                    {imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={imageUrl} alt="Generated poster" className="h-full w-full object-cover" />
                    ) : (
                        <div className="text-muted-foreground text-sm">
                            Your generated poster will appear here.
                        </div>
                    )}
                </div>
            </header>

            {/* Pricing */}
            <section className="mx-auto w-full max-w-6xl px-4 pb-12">
                <h2 className="text-2xl font-semibold mb-6">Pricing</h2>
                <div className="grid gap-4 sm:grid-cols-3">
                    <div className="border rounded-md p-4 flex flex-col">
                        <div className="text-lg font-medium">12×18</div>
                        <div className="text-muted-foreground mb-4">
                            Matte or Glossy
                        </div>
                        <div className="text-2xl font-bold mb-4">$24.99</div>
                        <button
                            type="button"
                            className="mt-auto rounded-md border px-3 py-2 text-sm"
                        >
                            Add to Cart
                        </button>
                    </div>

                    <div className="border rounded-md p-4 flex flex-col">
                        <div className="text-lg font-medium">18×24</div>
                        <div className="text-muted-foreground mb-4">
                            Matte or Glossy
                        </div>
                        <div className="text-2xl font-bold mb-4">$39.99</div>
                        <button
                            type="button"
                            className="mt-auto rounded-md border px-3 py-2 text-sm"
                        >
                            Add to Cart
                        </button>
                    </div>

                    <div className="border rounded-md p-4 flex flex-col">
                        <div className="text-lg font-medium">24×36</div>
                        <div className="text-muted-foreground mb-4">
                            Matte or Glossy
                        </div>
                        <div className="text-2xl font-bold mb-4">$59.99</div>
                        <button
                            type="button"
                            className="mt-auto rounded-md border px-3 py-2 text-sm"
                        >
                            Add to Cart
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="mt-auto w-full border-t">
                <div className="mx-auto max-w-6xl px-4 py-6 text-sm text-muted-foreground flex items-center justify-between">
                    <span>© {new Date().getFullYear()} AI-to-Print</span>
                    <div className="flex gap-4">
                        <Link href="/about">About</Link>
                        <Link href="#">Terms</Link>
                        <Link href="#">Contact</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}