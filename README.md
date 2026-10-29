# Hub Hours

A GitHub App for the Sydney startup scene. Open a pull request after 4:45pm, before 9am, or on a weekend, and it gets roasted and closed.

Sydney does not innovate after hours.

## Deploy (Vercel Hobby, free)

1. Push this repo to GitHub.
2. In Vercel, switch to your **Hobby** scope with the team switcher, then import the repo. Keep the defaults and deploy.
3. Register a GitHub App at https://github.com/settings/apps/new
   - Webhook URL: `https://<your-project>.vercel.app/api/webhooks` (the production domain, not a preview URL)
   - Webhook secret: `openssl rand -hex 32`
   - Repository permissions: **Pull requests** read and write, **Issues** read and write
   - Subscribe to events: **Pull request**
   - Create it, note the App ID, and generate a private key.
4. In Vercel project settings, add these environment variables, then redeploy:

   | Name | Value |
   | --- | --- |
   | `APP_ID` | The App ID |
   | `WEBHOOK_SECRET` | The secret from step 3 |
   | `PRIVATE_KEY` | `base64 -i key.pem \| pbcopy` |

5. Install the app on a repo and open a PR after 4:45pm Sydney time.

Visit `https://<your-project>.vercel.app/api/webhooks` in a browser to check whether the hub is open.

## Troubleshooting

GitHub shows every webhook delivery and its response under your app's settings, in the **Advanced** tab. Leave Vercel's Attack Challenge Mode and bot-blocking firewall rules off, or GitHub's webhooks get blocked.

## Develop

```
pnpm install
pnpm check && pnpm typecheck && pnpm test
```
