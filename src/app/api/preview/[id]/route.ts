import { readPreview } from "@/lib/preview-store";

// Optional: prevent static optimization/caching
export const dynamic = "force-dynamic";

export async function GET(
    _: Request,
    context: { params: Promise<{ id: string }> },
) {
    const { id } = await context.params;
    const rec = readPreview(id);

    if (!rec) return new Response("Not found", { status: 404 });

    return new Response(new Uint8Array(rec.buf), {
        headers: {
            "Content-Type": rec.type,
            "Cache-Control": "no-store",
        },
    });
}
