import { App } from "@octokit/app";
import { isHubOpen, pickRoast } from "../src/hours.js";

// Vercel env vars can't hold multi-line values cleanly, so accept a base64-encoded key too.
const rawKey = process.env.PRIVATE_KEY ?? "";
const privateKey = rawKey.startsWith("-----BEGIN") ? rawKey : Buffer.from(rawKey, "base64").toString("utf8");

const app = new App({
  appId: process.env.APP_ID ?? "",
  privateKey,
  webhooks: { secret: process.env.WEBHOOK_SECRET ?? "" },
});

app.webhooks.on(["pull_request.opened", "pull_request.reopened"], async ({ octokit, payload }) => {
  const pr = payload.pull_request;
  // Reopens are judged by when they happened, not when the PR was first created.
  const when = payload.action === "reopened" ? new Date() : new Date(pr.created_at);
  if (isHubOpen(when)) return;

  const owner = payload.repository.owner.login;
  const repo = payload.repository.name;
  await octokit.request("POST /repos/{owner}/{repo}/issues/{issue_number}/comments", {
    owner,
    repo,
    issue_number: pr.number,
    body: pickRoast(),
  });
  await octokit.request("PATCH /repos/{owner}/{repo}/pulls/{pull_number}", {
    owner,
    repo,
    pull_number: pr.number,
    state: "closed",
  });
});

export async function POST(request: Request): Promise<Response> {
  const id = request.headers.get("x-github-delivery");
  const name = request.headers.get("x-github-event");
  const signature = request.headers.get("x-hub-signature-256");
  if (!id || !name || !signature) return new Response("missing GitHub headers", { status: 400 });

  try {
    await app.webhooks.verifyAndReceive({
      id,
      // biome-ignore lint/suspicious/noExplicitAny: event name comes straight from GitHub
      name: name as any,
      signature,
      payload: await request.text(),
    });
    return new Response("ok");
  } catch (err) {
    console.error(err);
    return new Response("webhook failed", { status: 500 });
  }
}

export function GET(): Response {
  return new Response(
    isHubOpen(new Date()) ? "The hub is open." : "The hub is closed. Sydney is not innovating right now.",
  );
}
