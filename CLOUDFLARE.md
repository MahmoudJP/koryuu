# Cloudflare deployment — one-time setup

This is the one-time setup so that I (Claude) can deploy and update
`koryuu.com` from this folder anytime you ask, without ever needing to
authenticate again.

**Do this once.** After that, every future deploy is just:

```bash
npm run deploy
```

---

## Step 1 — Create a Cloudflare API token

1. Open <https://dash.cloudflare.com/profile/api-tokens>
2. Click **Create Token**
3. Scroll down to **Custom token** → **Get started**
4. Configure it:
   - **Token name**: `koryuu-deploy`
   - **Permissions** (add three rows):
     | Section | Permission | Access |
     |---|---|---|
     | Account | Cloudflare Pages | Edit |
     | Account | Workers Scripts | Edit |
     | Zone | Zone | Read |
   - **Account Resources**: Include → your account
   - **Zone Resources**: Include → Specific zone → `koryuu.com`
   - **TTL**: leave blank (no expiry) — or set a long expiry if you prefer
5. Click **Continue to summary** → **Create Token**
6. **Copy the token immediately** — Cloudflare only shows it once.

## Step 2 — Find your Account ID

1. Open <https://dash.cloudflare.com>
2. Pick any site (or just the home page).
3. On the right sidebar, copy the **Account ID**.

## Step 3 — Save them locally

```bash
cd ~/Projects/koryuu
cp .env.local.example .env.local
```

Open `.env.local` and paste both values:

```
CLOUDFLARE_ACCOUNT_ID=your_account_id_here
CLOUDFLARE_API_TOKEN=your_token_here
```

`.env.local` is in `.gitignore`, so it will never be committed.

## Step 4 — Create the Pages project (one time)

Cloudflare Pages needs a project to deploy into. Create it once:

```bash
cd ~/Projects/koryuu
npm run build
npx wrangler pages project create koryuu --production-branch=main
```

(If asked, accept the default settings. You can also create the project
in the dashboard — Workers & Pages → Create → Pages → "Direct Upload" —
naming it `koryuu`.)

## Step 5 — First deploy

```bash
npm run deploy
```

The URL will be printed at the end — something like
`https://koryuu.pages.dev`.

## Step 6 — Hook up the custom domain `koryuu.com`

1. In the Cloudflare dashboard: **Workers & Pages → koryuu → Custom domains**.
2. Click **Set up a custom domain**.
3. Enter `koryuu.com` (and optionally `www.koryuu.com`).
4. Cloudflare handles the DNS automatically since you bought the domain
   through Cloudflare. Wait ~1 minute for SSL to provision.

That's it — `koryuu.com` is live.

---

## How deploys work from here on

Whenever you ask me to update the site, I will:

1. Make the changes you want.
2. Run `npm run deploy`.
3. The token in `.env.local` is picked up automatically by `wrangler`.
4. The new version is live in seconds.

For a preview deploy (separate URL, doesn't touch production):

```bash
npm run deploy:preview
```

---

## If the token leaks

Revoke it immediately:
<https://dash.cloudflare.com/profile/api-tokens> → find `koryuu-deploy`
→ **Roll** (re-issues a new token) or **Delete**. Then update
`.env.local`.
