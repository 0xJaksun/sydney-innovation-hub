# Sydney Innovation Hub

<img src="assets/logo.png" alt="Three black Zs rising on yellow" width="280">

**Sydney does not innovate after 4:45pm.**

The startup hubs lock their doors at 4:45. Now your repos do too.

Sydney Innovation Hub is a GitHub App that enforces Sydney startup hub opening hours on your pull requests. Open a PR outside business hours and it gets roasted and closed on the spot.

## Opening hours

| Day | Innovation permitted |
| --- | --- |
| Monday to Friday | 9:00am to 4:45pm |
| Saturday and Sunday | Closed. Everyone's at the beach. |

All times are Sydney time, daylight saving included. Reopening a PR after hours gets it closed again.

## What you'll hear

Open a PR at 4:46pm and you get one of these:

> **PR closed. Sydney does not innovate after 4:45pm.**
>
> The hub's shut, the lights are off, and everyone's gone home. Apparently that's how you build a world-class startup ecosystem.

> **Fuck off, it's after hours.**
>
> This is Sydney. Innovation clocks off at 4:45 sharp. Your idea can wait until 9am like everyone else's.

> **After-hours innovation is not permitted in Sydney.**
>
> Want a 24/7 startup hub? Wrong city. Your PR has been closed.

## Disclaimer

This entire thing is vibe coded. Not one line was written by hand. If it closes a PR you actually needed, that's on you for installing it.

Don't install it on repos where you ship real work after 4:45pm. Which, if you're a founder, is all of them.

## Run your own

It's a single Vercel function, so it runs free on the Hobby plan.

1. Fork or clone this repo.
2. In Vercel, switch to your **Hobby** scope with the team switcher at the top left, then import the repo. Keep the defaults and deploy.
3. Register a GitHub App at https://github.com/settings/apps/new
   - **Webhook URL:** `https://<your-project>.vercel.app/api/webhooks`. Use the production domain, not a preview URL.
   - **Webhook secret:** generate one with `openssl rand -hex 32`.
   - **Repository permissions:** Pull requests read and write, Issues read and write.
   - **Subscribe to events:** Pull request.
   - Create the app, note the App ID, and generate a private key.
4. In your Vercel project settings, add these environment variables, then redeploy:
   - `APP_ID` is the App ID from step 3.
   - `WEBHOOK_SECRET` is the secret from step 3.
   - `PRIVATE_KEY` is your private key, base64 encoded. On a Mac, run the command below to copy it.
     ```
     base64 -i your-key.pem | pbcopy
     ```
5. Install the app on a repo and open a PR after 4:45pm.

To check whether the hub is open right now, visit `https://<your-project>.vercel.app/api/webhooks` in a browser.

## When it doesn't work

GitHub logs every webhook delivery and its response. Find them in your app's settings under the **Advanced** tab.

Keep Vercel's Attack Challenge Mode and bot-blocking firewall rules off. They block GitHub's webhooks.

## Develop

```
pnpm install
pnpm check && pnpm typecheck && pnpm test
```

The opening hours and roasts live in `src/hours.ts`. The webhook handler is `api/webhooks.ts`.
