// Ephemeral in-memory store (great for demos)
// NOTE: cleared on server restart/redeploy
const store = new Map<string, { buf: Buffer; type: string; exp: number }>();

export function saveDataUrl(dataUrl: string, ttlMs = 5 * 60_000) {
  const [meta, b64] = dataUrl.split(",");
  const type = meta.match(/data:(.*?);base64/)?.[1] || "image/png";
  const buf = Buffer.from(b64 || "", "base64");
  const id = Math.random().toString(36).slice(2);
  store.set(id, { buf, type, exp: Date.now() + ttlMs });
  return id;
}

export function readPreview(id: string) {
  const rec = store.get(id);
  if (!rec) return null;
  if (Date.now() > rec.exp) {
    store.delete(id);
    return null;
  }
  return rec;
}
