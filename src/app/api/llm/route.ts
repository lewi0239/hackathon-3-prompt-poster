import { NextResponse } from "next/server";
import { generatePosterDataUrl } from "@/lib/llm";
import { saveDataUrl } from "@/lib/preview-store";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
    const { prompt } = await req.json().catch(() => ({}));
    if (!prompt?.trim()) {
        return NextResponse.json({ error: "Missing prompt" }, { status: 400 });
    }

    const { data, error } = await generatePosterDataUrl(prompt);
    if (error || !data) {
        return NextResponse.json(
            { error: error || "Generation failed" },
            { status: 500 },
        );
    }

    // convert data URL -> ephemeral preview URL
    const id = saveDataUrl(data.dataUrl);
    const url = `/api/preview/${id}`;

    return NextResponse.json(
        { url },
        { headers: { "Cache-Control": "no-store" } },
    );
}
