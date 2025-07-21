
# 🛡️ Phishing URL Detector

![Next.js](https://img.shields.io/badge/Framework-Next.js-000000?logo=nextdotjs)
![TailwindCSS](https://img.shields.io/badge/Styling-TailwindCSS-06B6D4?logo=tailwindcss&logoColor=white)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?logo=mongodb&logoColor=white)
![Clerk](https://img.shields.io/badge/Auth-Clerk-3B49DF?logo=clerk&logoColor=white)
![WorkersAI](https://img.shields.io/badge/AI-WorkersAI-F6821F?logo=cloudflare&logoColor=white)
![Pinecone](https://img.shields.io/badge/VectorDB-Pinecone-42f2f7?logo=pinecone&logoColor=black)

A real-time phishing URL detection system powered by AI and vector embeddings, built with **Next.js 14**, **Clerk**, **MongoDB**, and **Pinecone** for robust, secure, and personalized threat analysis.

---

## 🚀 Features

- 🔍 **Check Suspicious URLs** – Instantly check whether a given URL is a phishing link.
- 🧠 **AI-Powered Detection** – Uses vector similarity (via Workers AI) to match against a known set of phishing URLs.
- 📦 **Vector Search with Pinecone** – Store and retrieve phishing patterns efficiently.
- 👤 **Authentication with Clerk** – Sign up and log in with Clerk for a secure and personalized experience.
- 🕵️ **User History Tracking** – Authenticated users can view their past phishing checks.
- 🌗 **Dark Mode Toggle** – Seamless UI experience with dark/light mode support.
- ☁️ **Vercel Deployment** – Fully deployed using Vercel for blazing-fast performance.

---

## 🖼️ Screenshots

- Homepage / URL Checker
- Login/Signup via Clerk
- Phishing Result UI
- User Dashboard (with history)
- Dark mode UI

---

## 🧠 How It Works

1. When a user submits a URL, the frontend sends it to the Next.js API route.
2. The API vectorizes it using **Workers AI** (hosted model) into an embedding.
3. It compares the embedding to a **Pinecone** vector DB with known phishing patterns.
4. If similarity is high, it's flagged as phishing.

---

## 🏗️ Tech Stack

| Category | Technology |
|---------|------------|
| Frontend | Next.js 14 (App Router), Tailwind CSS |
| Backend  | Next.js API Routes |
| Auth     | Clerk.dev |
| Database | MongoDB |
| Vector DB| Pinecone |
| AI Model | Workers AI (sentence embedding model) |
| Deployment | Vercel |

---

## 📂 Folder Structure (Important Paths)

```
/src
  ├── app/
  │   ├── api/
  │   │   └── phishing/
  │   │       ├── check/route.ts         # API to check if URL is phishing
  │   │       └── history/route.ts       # Save/view history
  │   ├── dashboard/page.tsx             # Dashboard for user history
  │   ├── layout.tsx                     # Root layout with theme support
  │   └── page.tsx                       # Home/URL input
  ├── components/
  │   └── UrlCheckerForm.tsx             # Input form component
  └── utils/
      ├── embedder.ts                    # Handles embedding logic via Workers AI
      └── db.ts                          # MongoDB connection util
```

---

## 🔐 Clerk Integration

- Middleware to protect `/dashboard`
- Access current user's ID and use it to store/check history in MongoDB
- Auth UI: sign in, sign up, sign out

---

## 🧪 Testing Phishing

> Test with dummy URLs like:
- `http://login-facebook.com.verify-password-reset.ru`
- `http://microsfot.support-login.info`
- `http://secure-update.paypai.com`
- `http://accounts.g00gle.co/signin`

---

## 🧾 Seed Data

- Phishing examples from public threat intel sources (CSV: `phishing.csv`)
- Seeder script: `pinecodeseeder.js`
- Run once to populate the Pinecone DB with vectors

---

## 📦 .env.local Setup

```
CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
MONGODB_URI=
PINECONE_API_KEY=
PINECONE_ENVIRONMENT=
PINECONE_INDEX_NAME=
WORKERS_AI_API_KEY=
```

---

## 🌐 Deployment

- Hosted on **Vercel**
- Auto-deployed via GitHub push
- Environment secrets managed via Vercel dashboard

---

## 📄 License

This project is licensed under the MIT License.

---

> Made with ❤️ by Apoorv Singh  
> [Portfolio](https://apoorv-my-portfolio.netlify.app/) · [GitHub](https://github.com/Apoorv3826) · [LinkedIn](https://linkedin.com/in/apoorv-singh-a7b79b224)
