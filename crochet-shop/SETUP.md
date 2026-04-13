# Knotted — Crochet Shop Setup Guide

## Project Structure

```
crochet-shop/
├── app/
│   ├── page.tsx                        ← Public: Product list
│   ├── product/[id]/page.tsx           ← Public: Product detail + Buy popup
│   ├── admin/
│   │   ├── layout.tsx                  ← Admin sidebar layout
│   │   ├── login/page.tsx              ← Master login (only you)
│   │   ├── dashboard/page.tsx          ← All products + live toggle
│   │   ├── product/new/page.tsx        ← Add product
│   │   └── product/[id]/edit/page.tsx  ← Edit product
├── components/
│   ├── Navbar.tsx       ← Public nav
│   ├── ProductCard.tsx  ← Product card for list page
│   ├── ProductForm.tsx  ← Shared add/edit form with image upload
│   └── BuyPopup.tsx     ← Order popup → WhatsApp redirect
├── lib/
│   ├── supabase/client.ts  ← Browser Supabase client
│   ├── supabase/server.ts  ← Server Supabase client
│   └── types.ts            ← Product TypeScript type
├── middleware.ts            ← Protects all /admin/* routes
└── supabase-schema.sql     ← Run this once in Supabase SQL editor
```

---

## Step 1 — Create Supabase Project (Free)

1. Go to https://supabase.com and sign up (free)
2. Click **New Project**, give it a name (e.g. "knotted-shop")
3. Choose a strong database password and save it somewhere
4. Wait ~2 minutes for it to provision

---

## Step 2 — Run the Database Schema

1. In your Supabase dashboard, click **SQL Editor** (left sidebar)
2. Click **New Query**
3. Paste the entire contents of `supabase-schema.sql`
4. Click **Run**

This creates:
- `products` table with all fields
- Row-level security (only live products visible publicly)
- Storage bucket for product images

---

## Step 3 — Create Your Admin Account

1. In Supabase dashboard → **Authentication** → **Users**
2. Click **Add User** → **Create New User**
3. Enter YOUR email and a strong password
4. This is the ONLY login that will work — nobody else can sign up
5. ⚠️ In **Authentication → Settings**, turn OFF "Enable email confirmations" so you can log in immediately

---

## Step 4 — Get Your Supabase Keys

1. In Supabase dashboard → **Project Settings** → **API**
2. Copy:
   - **Project URL** (looks like `https://xxxx.supabase.co`)
   - **anon / public key** (long string starting with `eyJ...`)

---

## Step 5 — Configure Environment Variables

1. Copy `.env.local.example` to `.env.local`
2. Fill in your values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_WHATSAPP_NUMBER=919876543210
```

For WhatsApp number: use country code + number with no spaces or +
- Example for India: `919876543210` (91 = India country code)

---

## Step 6 — Run Locally

```bash
npm install
npm run dev
```

Open http://localhost:3000

- **Shop**: http://localhost:3000
- **Admin login**: http://localhost:3000/admin/login
- **Dashboard**: http://localhost:3000/admin/dashboard

---

## Step 7 — Deploy to Vercel (Free, Live Website)

1. Push your code to GitHub:
```bash
git init
git add .
git commit -m "initial commit"
# Create a repo on github.com, then:
git remote add origin https://github.com/yourusername/crochet-shop.git
git push -u origin main
```

2. Go to https://vercel.com → Sign up with GitHub → **New Project**
3. Select your `crochet-shop` repo → Click **Deploy**
4. Before deploying, go to **Environment Variables** and add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_WHATSAPP_NUMBER`
5. Click **Deploy** → Your site goes live in ~2 minutes!

Your live URL will be: `https://crochet-shop.vercel.app` (or similar)

---

## Step 8 — Custom Domain (Optional, ~₹600/year)

1. Buy a domain from GoDaddy / Namecheap (search for `.in` domains, cheapest)
2. In Vercel → your project → **Settings** → **Domains**
3. Add your domain and follow the DNS instructions

---

## How to Use the Admin Panel

### Adding a product:
1. Go to `/admin/login` and sign in
2. Click **+ Add Product**
3. Fill in name, price, description, category
4. Upload photos (you can upload from your phone!)
5. Toggle **Live** if you want it visible immediately
6. Click **Create Product**

### Managing products:
- The **Live/Draft toggle** on the dashboard instantly shows/hides a product
- Click **Edit** to update any details or swap photos
- Click **Delete** to permanently remove (with confirmation)

### How customers order:
1. Customer browses your shop
2. Clicks a product → sees detail page
3. Clicks **Buy Now** → popup opens
4. Fills name, phone, address → clicks **Continue on WhatsApp**
5. WhatsApp opens on their phone with a pre-filled message to YOU
6. You confirm, discuss delivery, and collect payment via UPI/GPay/PhonePe

---

## Cost Summary

| Item | Cost |
|------|------|
| Next.js (code) | Free |
| Vercel (hosting) | Free |
| Supabase (database + images) | Free |
| Domain name | ~₹600/year (optional) |
| WhatsApp Business | Free |
| **Total** | **₹0 to start** |

---

## Future Phase 2 (when ready)

When orders are high enough, you can add:
- **Razorpay** (India's best payment gateway) — 2% per transaction, no monthly fee
- Order management / inventory tracking
- Customer email notifications

But for now — start selling! 🧶
