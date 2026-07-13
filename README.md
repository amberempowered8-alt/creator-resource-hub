# 🚀 Automated Headless Storefront Template

Welcome to your new Automated Headless Storefront! This system is designed to give you 100% data ownership, ultra-fast loading speeds, and zero monthly subscription fees. You can manage your entire digital storefront in real-time right from a free spreadsheet on your phone or laptop.

---

## 📁 What's Included in Your Package
* `index.html` - Your high-converting, interactive storefront & virtual tour landing page.
* `style.css` - Clean, responsive grid layout styles with easy customization options.
* `app.js` - The real-time logic engine that syncs your webpage directly to Airtable.
* `SETUP_GUIDE.pdf` - A complete, step-by-step launch guide for non-technical users.

---

## ⚡ Quick Start Checklist (15 Minutes to Launch)

### Step 1: Clone the Database Blueprint
1. Log into your free [Airtable](https://airtable.com) account.
2. Click your unique blueprint share link (provided in your purchase delivery).
3. Click **"Duplicate Base"** in the top-right corner to copy the database into your account.

### Step 2: Set Up Your Secure Keys
1. Open your `app.js` file.
2. Replace `'YOUR_ACTUAL_BASE_ID_HERE'` with your Airtable Base ID (found in your browser's URL bar after `airtable.com/` starting with `app`).
3. Go to the [Airtable Developer Hub](https://airtable.com/create/tokens) and create a personal access token with `data.records:read` scopes.
4. Replace `'PASTE_YOUR_SECRET_TOKEN_HERE'` in `app.js` with your new token.

### Step 3: Deploy to the Web (100% Free)
* **Drag & Drop (Easiest):** Upload your folder directly to a free hobby account on [Vercel](https://vercel.com) or [Netlify](https://netlify.com).
* **GitHub Pages:** Create a public repository on [GitHub](https://github.com), upload your files, and enable GitHub Pages under **Settings > Pages**.

---

## 🎨 Changing Your Brand Colors
You don't need to write any complex code. To change your colors globally, open `index.html` (or `style.css`) and edit the variables at the very top:

```css
:root {
    --primary: #FF007A;      /* Change to your main brand color hex */
    --bg: #FAFAFA;           /* Change to your background canvas color */
}
