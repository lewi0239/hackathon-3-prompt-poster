type Result<T> = { data: T; error: null } | { data: null; error: string };

function dbg(...args: unknown[]): void {
    if (process.env.DEBUG_HF === "1") console.log("[HF]", ...args);
}

export async function generatePosterDataUrl(
    prompt: string,
    {
        model = process.env.HF_MODEL || "stabilityai/sdxl-turbo",
        steps = 25,
        guidanceScale = 3.0,
        width,
        height,
        timeoutMs = Number(process.env.HF_TIMEOUT_MS ?? 45000), // 45s default
    }: {
        model?: string;
        steps?: number;
        guidanceScale?: number;
        width?: number;
        height?: number;
        timeoutMs?: number;
    } = {},
): Promise<Result<{ dataUrl: string }>> {
    if (!prompt?.trim()) return { data: null, error: "Missing prompt" };
    const token = process.env.HF_TOKEN || process.env.HUGGING_FACE_TOKEN;
    if (!token)
        return {
            data: null,
            error: "Missing HF_TOKEN/HUGGING_FACE_TOKEN in env",
        };

    const url = `https://api-inference.huggingface.co/models/${model}`;
    dbg("model:", model);
    dbg("endpoint:", url);
    dbg("timeoutMs:", timeoutMs);

    const controller = new AbortController();
    const killer = setTimeout(() => {
        dbg("aborting due to timeout");
        controller.abort();
    }, timeoutMs);

    try {
        dbg("sending request…");
        const res = await fetch(url, {
            method: "POST",
            signal: controller.signal,
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
                Accept: "image/png",
                "x-wait-for-model": "true", // wait for cold start instead of immediate 503
            },
            body: JSON.stringify({
                inputs: prompt,
                parameters: {
                    num_inference_steps: steps,
                    guidance_scale: guidanceScale,
                    ...(width ? { width } : {}),
                    ...(height ? { height } : {}),
                },
            }),
        });
        clearTimeout(killer);
        dbg("response status:", res.status, res.statusText);

        if (!res.ok) {
            const text = await res.text().catch(() => "");
            dbg("error body:", text.slice(0, 200));
            return {
                data: null,
                error: `HF error ${res.status}: ${text.slice(0, 200)}`,
            };
        }

        const buf = Buffer.from(await res.arrayBuffer());
        const b64 = buf.toString("base64");
        dbg("received bytes:", buf.length);
        return {
            data: { dataUrl: `data:image/png;base64,${b64}` },
            error: null,
        };
    } catch (err: unknown) {
        clearTimeout(killer);

        if (err instanceof DOMException && err.name === "AbortError") {
            return { data: null, error: `HF timeout after ${timeoutMs}ms` };
        }

        if (err instanceof Error) {
            return {
                data: null,
                error: `HF fetch error: ${err.message}`,
            };
        }

        return {
            data: null,
            error: "HF fetch error: unknown",
        };
    }
}
