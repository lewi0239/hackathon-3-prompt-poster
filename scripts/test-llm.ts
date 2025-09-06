// scripts/test-llm.ts
import { config } from "dotenv";
config({ path: ".env.local" });

// Force IPv4 for Node fetch (undici)
import dns from "node:dns";
dns.setDefaultResultOrder?.("ipv4first");
import { Agent, setGlobalDispatcher } from "undici";
setGlobalDispatcher(new Agent({ connect: { family: 4 } }));

// Small timeout helper
async function withTimeout<T>(
  p: Promise<T>,
  ms: number,
  label = "op",
): Promise<T> {
  const c = new AbortController();
  const killer = setTimeout(() => c.abort(), ms);
  try {
    // @ts-expect-error: we pass signal only to fetch calls
    return await p;
  } finally {
    clearTimeout(killer);
  }
}

async function whoami() {
  const token = process.env.HF_TOKEN || process.env.HUGGING_FACE_TOKEN;
  if (!token) return { ok: false, why: "No HF_TOKEN set" };
  try {
    const res = await withTimeout(
      fetch("https://huggingface.co/api/whoami-v2", {
        headers: { Authorization: `Bearer ${token}` },
      }),
      10000,
      "whoami",
    );
    if (!res.ok) return { ok: false, why: `${res.status} ${res.statusText}` };
    const j = await res.json();
    return { ok: true, user: j.name || j.auth?.user || "unknown" };
  } catch (e: any) {
    return { ok: false, why: `network: ${e.message}` };
  }
}

async function modelMeta(model: string) {
  try {
    const res = await withTimeout(
      fetch(`https://huggingface.co/api/models/${encodeURIComponent(model)}`),
      10000,
      "modelMeta",
    );
    if (!res.ok) return { ok: false, why: `${res.status} ${res.statusText}` };
    const j = await res.json();
    return {
      ok: true,
      card: { id: j.modelId || j.id, downloads: j.downloads },
    };
  } catch (e: any) {
    return { ok: false, why: `network: ${e.message}` };
  }
}

process.env.DEBUG_HF = "1";
process.env.HF_TIMEOUT_MS = process.env.HF_TIMEOUT_MS || "30000"; // 30s cap

import { writeFileSync } from "node:fs";
import { generatePosterDataUrl } from "../src/lib/llm";

async function main() {
  const prompt =
    process.argv.slice(2).join(" ") || "retro sci-fi cityscape in neon dusk";
  const model = process.env.HF_MODEL || "black-forest-labs/FLUX.1-schnell";

  console.log("Prompt:", prompt);
  console.log(
    "HF token present:",
    Boolean(process.env.HF_TOKEN || process.env.HUGGING_FACE_TOKEN),
  );
  console.log("Model:", model);

  const w = await whoami();
  console.log("HF whoami:", w);

  const m = await modelMeta(model);
  console.log("HF model meta:", m);

  const started = Date.now();
  const { data, error } = await generatePosterDataUrl(prompt);
  const elapsed = ((Date.now() - started) / 1000).toFixed(1);

  if (error || !data) {
    console.error("LLM error:", error, `(took ${elapsed}s)`);
    // 👉 TEMP UNBLOCK (optional): fall back to a placeholder so UI work continues
    // console.log("Using placeholder...");
    // const url = `https://picsum.photos/seed/${encodeURIComponent(prompt)}/1024/1024`;
    // const img = await fetch(url).then(r => r.arrayBuffer());
    // writeFileSync("hf-test.png", Buffer.from(img));
    // console.log(`Saved hf-test.png (placeholder)`);
    process.exit(1);
  }

  const b64 = data.dataUrl.split(",")[1]!;
  writeFileSync("hf-test.png", Buffer.from(b64, "base64"));
  console.log(`Saved hf-test.png (took ${elapsed}s)`);
}

main();
