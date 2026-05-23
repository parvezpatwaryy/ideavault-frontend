# 💡 IdeaVault – Startup Idea Sharing Platform

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=nextdotjs)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)

IdeaVault is a full-stack startup idea sharing platform where users can publish, discover, validate, and discuss startup ideas with the community. It includes authentication, private dashboards, idea management, comments, profile tools, responsive UI, dark mode, and a complete backend API powered by Express.js and MongoDB.

## 🌐 Live Site

**Live URL:** [https://your-live-url.vercel.app](https://your-live-url.vercel.app)

## 📸 Screenshot

> Add your project screenshot here.

```md
![IdeaVault Screenshot](./public/screenshot.png)
```

## ✨ Features

- 🔐 Email/password authentication and Google login using better-auth
- 📝 Share startup ideas with title, description, category, budget, target audience, problem statement, and proposed solution
- 🔎 Browse, search, and filter ideas by title and category
- 📄 Private idea details page with complete idea information
- 💬 Full comment system with add, edit, and delete-own-comment actions
- 🧑‍💼 Private My Ideas page to update and delete submitted ideas
- 📌 Private My Interactions page to view and delete personal comments
- 👤 Profile management page with user stats
- 🔥 Trending Ideas section on the homepage
- 🌙 Dark/light theme toggle
- 📱 Fully responsive layout for mobile, tablet, and desktop
- 🚫 Custom 404 page
- ⏳ Loading spinners and toast notifications for user actions

## 🛠️ Tech Stack

### Frontend

- Next.js 15
- React 19
- Tailwind CSS
- better-auth
- React Toastify
- SweetAlert2
- HeroUI

### Backend

- Node.js
- Express.js
- MongoDB
- MongoDB Node.js Driver
- CORS
- dotenv

## 🚀 Run Locally

### 1. Clone the repository

```bash
git clone https://github.com/your-username/ideavault.git
cd ideavault
```

### 2. Install frontend dependencies

```bash
cd assingment-frontend_2026-05-21_16-38-55
npm install
```

### 3. Install backend dependencies

```bash
cd ../assignment-backend_2026-05-21_16-38-49
npm install
```

### 4. Configure project settings

Add the required local configuration values for the frontend and backend before running the app.

### 5. Start the backend server

```bash
cd assignment-backend_2026-05-21_16-38-49
npm run dev
```

### 6. Start the frontend development server

```bash
cd assingment-frontend_2026-05-21_16-38-55
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔑 Configuration

This project requires API, database, authentication, and Google OAuth configuration values for local development and deployment. Keep all private credentials secure and do not commit them to a public repository.

## 📁 Folder Structure

```text
IdeaVault/
+-- assignment-backend_2026-05-21_16-38-49/
|   +-- index.js
|   +-- package.json
|   +-- package-lock.json
|   +-- vercel.json
|
+-- assingment-frontend_2026-05-21_16-38-55/
    +-- public/
    +-- src/
    |   +-- app/
    |   |   +-- add-idea/
    |   |   +-- ideas/
    |   |   +-- login/
    |   |   +-- my-ideas/
    |   |   +-- my-interactions/
    |   |   +-- profile/
    |   |   +-- signup/
    |   |   +-- lib/
    |   |   +-- layout.js
    |   |   +-- page.js
    |   |   +-- not-found.jsx
    |   +-- components/
    +-- package.json
    +-- next.config.mjs
    +-- README.md
```

## 👨‍💻 Author

**Name:** Your Name  
**Email:** your.email@example.com  
**GitHub:** [https://github.com/your-username](https://github.com/your-username)  
**LinkedIn:** [https://linkedin.com/in/your-profile](https://linkedin.com/in/your-profile)

## 📄 License

This project is open for educational and portfolio use. Add your preferred license before production release.
