// POST JSON and always resolve to { ok, status, data, networkError }. Never throws.
export async function postJson(url, body, { timeoutMs = 15000 } = {}) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json", Accept: "application/json" },
            body: JSON.stringify(body),
            signal: controller.signal,
        });
        let data = null;
        try {
            data = await response.json();
        } catch {
            // empty or non-JSON body
        }
        return { ok: response.ok, status: response.status, data, networkError: false };
    } catch {
        return { ok: false, status: 0, data: null, networkError: true };
    } finally {
        clearTimeout(timer);
    }
}
