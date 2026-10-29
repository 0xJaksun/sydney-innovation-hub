import { createHmac } from "node:crypto";
import { beforeAll, describe, expect, it } from "vitest";

const SECRET = "test-secret";
let handler: typeof import("./webhooks");

beforeAll(async () => {
  process.env.APP_ID = "1";
  process.env.WEBHOOK_SECRET = SECRET;
  process.env.PRIVATE_KEY = "-----BEGIN RSA PRIVATE KEY-----\nunused\n-----END RSA PRIVATE KEY-----";
  handler = await import("./webhooks");
});

function webhook(body: string, signature: string) {
  return new Request("https://example.com/api/webhooks", {
    method: "POST",
    body,
    headers: {
      "x-github-delivery": "abc",
      "x-github-event": "ping",
      "x-hub-signature-256": signature,
    },
  });
}

describe("webhook handler", () => {
  it("accepts a correctly signed delivery", async () => {
    const body = JSON.stringify({ zen: "Keep it logically awesome." });
    const sig = `sha256=${createHmac("sha256", SECRET).update(body).digest("hex")}`;
    const res = await handler.POST(webhook(body, sig));
    expect(res.status).toBe(200);
  });

  it("rejects a forged delivery", async () => {
    const res = await handler.POST(webhook("{}", "sha256=deadbeef"));
    expect(res.status).toBe(500);
  });

  it("rejects requests without GitHub headers", async () => {
    const res = await handler.POST(new Request("https://example.com", { method: "POST", body: "{}" }));
    expect(res.status).toBe(400);
  });

  it("GET reports hub status", async () => {
    const text = await handler.GET().text();
    expect(text).toMatch(/hub is (open|closed)/);
  });
});
