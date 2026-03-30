# Human Setup Guide

This covers the two manual steps that must be done before development can fully proceed:

1. [Supabase project + Google OAuth](#1-supabase-project--google-oauth)
2. [Vercel project + repo link](#2-vercel-project--repo-link)

---

## 1. Supabase project + Google OAuth

### 1.1 Create a Supabase project

1. Go to [https://supabase.com](https://supabase.com) and sign in
2. Click **New project**
3. Choose your organisation, give the project a name (e.g. `fastbreak-event-dashboard`), set a strong database password, and pick a region close to you
4. Wait ~2 minutes for the project to provision

### 1.2 Copy your API keys

1. In your project, go to **Project Settings → API**
2. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon / public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Create `.env.local` in the project root (copy from `.env.example`):

```bash
cp .env.example .env.local
```

Then fill in the values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

> ⚠️ Never commit `.env.local`. It is already in `.gitignore`.

### 1.3 Enable Google OAuth

You'll need a Google OAuth client. If you don't have one yet:

#### Create a Google OAuth client

1. Go to [https://console.cloud.google.com](https://console.cloud.google.com)
2. Create a new project (or select an existing one)
3. Navigate to **APIs & Services → Credentials**
4. Click **Create Credentials → OAuth client ID**
5. Set application type to **Web application**
6. Under **Authorised redirect URIs**, add:
   ```
   https://your-project-ref.supabase.co/auth/v1/callback
   ```
   (Replace `your-project-ref` with your actual Supabase project reference — visible in your project URL)
7. Click **Create** and copy the **Client ID** and **Client Secret**

#### Wire Google OAuth into Supabase

1. In Supabase, go to **Authentication → Providers → Google**
2. Toggle **Enable Google provider**
3. Paste in the **Client ID** and **Client Secret** from Google
4. Save

### 1.4 Configure local redirect URI

1. In Supabase, go to **Authentication → URL Configuration**
2. Under **Redirect URLs**, add:
   ```
   http://localhost:3000/auth/callback
   ```
3. Save

> You'll add the Vercel production URL here later too — see [step 2.4](#24-add-vercel-url-to-supabase-redirect-urls).

---

## 2. Vercel project + repo link

### 2.1 Push the repo to GitHub

If you haven't already:

```bash
git init          # if not already a git repo
git add .
git commit -m "Initial commit"
gh repo create fastbreak-event-dashboard --private --source=. --push
# or push manually to a repo you create at github.com
```

### 2.2 Create a Vercel project

1. Go to [https://vercel.com](https://vercel.com) and sign in
2. Click **Add New → Project**
3. Select **Import Git Repository** and find your GitHub repo
4. Vercel will auto-detect Next.js — leave framework settings as-is
5. Click **Deploy** (it will fail on first deploy because env vars aren't set yet — that's fine)

### 2.3 Add environment variables to Vercel

1. In your Vercel project, go to **Settings → Environment Variables**
2. Add the following for **Production**, **Preview**, and **Development** environments:

| Name                            | Value                     |
| ------------------------------- | ------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | your Supabase anon key    |

3. Save, then trigger a new deploy: **Deployments → Redeploy**

### 2.4 Add Vercel URL to Supabase redirect URLs

Once your Vercel project is created, you'll have a URL like `https://fastbreak-event-dashboard.vercel.app`.

1. In Supabase, go to **Authentication → URL Configuration**
2. Under **Redirect URLs**, add your Vercel production URL:
   ```
   https://your-project.vercel.app/auth/callback
   ```
3. If you want OAuth to work on Vercel preview deployments too, add a wildcard:
   ```
   https://*-your-org.vercel.app/auth/callback
   ```
4. Also update **Site URL** to your production Vercel URL
5. Save

### 2.5 Add Vercel URL to Google OAuth

1. Go back to [Google Cloud Console → Credentials](https://console.cloud.google.com/apis/credentials)
2. Edit your OAuth client
3. Under **Authorised redirect URIs**, the Supabase callback URI you already added handles this — no extra Google config needed for Vercel, since the OAuth flow goes through Supabase's own callback endpoint

---

## Checklist

Use this to track progress:

- [ ] Supabase project created
- [ ] `.env.local` populated with URL + anon key
- [ ] Google Cloud OAuth client created
- [ ] Google OAuth enabled in Supabase with client ID + secret
- [ ] `http://localhost:3000/auth/callback` added to Supabase redirect URLs
- [ ] Repo pushed to GitHub
- [ ] Vercel project created + linked to repo
- [ ] Env vars added to Vercel
- [ ] Vercel URL added to Supabase redirect URLs + Site URL
- [ ] Vercel redeployed successfully

---

## Troubleshooting

**OAuth redirect mismatch error**
The redirect URI in Google Cloud Console must exactly match what Supabase uses (`https://your-ref.supabase.co/auth/v1/callback`). Double-check the URL has no trailing slash.

**`Invalid API key` from Supabase**
Your `.env.local` value is probably the `service_role` key instead of the `anon` key. Use the **anon / public** key for `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

**Vercel deploy fails with missing env vars**
Env vars added in Vercel only take effect on the _next_ deploy. Trigger a fresh deploy after adding them.

**Google OAuth works locally but not on Vercel**
Check that your Vercel URL is in Supabase's Redirect URLs list and that the Site URL is set correctly.
