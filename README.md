# 🌿 Automated Workflows – Research Digest

A **personal research paper digest system** powered by **n8n workflows** and a custom frontend.  
Organize, search, and read research papers in a **minimalist, sage-green aesthetic** inspired by Notion templates.

---

## ✨ Features

- 📰 **Automated Fetching** – Collect papers from arXiv or custom sources.  
- 🗂 **Card-style Display** – Clean, readable layout for each paper.  
- 🔍 **Search & Filters** – Quickly find papers by title, author, or category.  
- 🌿 **Aesthetic UI/UX** – Soft sage-green tones, rounded cards, and calm typography.  
- ⚡ **Flexible Webhooks** – Switch between test (`webhook-test`) and production (`webhook`) easily.

---

## 📦 Setup

1. **Clone the repository**
```bash
git clone https://github.com/BigHero76/Automated-workflows.git
cd Automated-workflows


Install n8n (if not installed):
npm install -g n8n


Run n8n locally:
n8n


🔗 Webhook Configuration
Your frontend or automation workflow communicates with n8n via a Webhook node.

Steps to configure:

Open your workflow in n8n.
Click the Webhook node.
Change Path from webhook-test → webhook (or a production path).
Choose HTTP Method: POST.
Activate the workflow to make it live.
Update your frontend or external service to call:
https://<your-n8n-domain>/webhook/webhook


🖥 Frontend
index.html – Main layout
style.css – Sage-green aesthetic styling
script.js – Fetches data from the webhook and renders it
Run locally
Open index.html using Live Server or any local web server.
The page auto-fetches papers from your active webhook.

