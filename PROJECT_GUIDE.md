# TRIVENTA PROJECT GUIDE

## 🚨 MASTER APP STATUS
**TRIVENTA - The Operating System of Ambition** is the ONLY app we build.

## 📂 CORRECT PROJECT STRUCTURE
```
C:\Users\sujal singh\Desktop\vercel\    # ← USE THIS FOLDER ONLY
├── src/
│   ├── components/
│   │   ├── Login.tsx ✅
│   │   ├── RoleSelection.tsx ✅
│   │   └── Home.tsx ✅
│   ├── App.tsx ✅
│   └── main.tsx ✅
├── public/
│   └── images/
│       └── triventa-logo.png ✅
├── package.json ✅
├── vercel.json ✅
└── .gitignore ✅
```

## 🚫 DUPLICATE PROJECTS
```
C:\Users\sujal singh\Desktop\triventa\    # ← DUPLICATE - IGNORE THIS
```

## 🔄 WORKFLOW INSTRUCTIONS

### 1. DEVELOPMENT
```bash
cd "C:\Users\sujal singh\Desktop\vercel"
npm run dev
```
- Opens: http://localhost:3000
- Use this folder for ALL development

### 2. DEPLOYMENT
```bash
cd "C:\Users\sujal singh\Desktop\vercel"
git add .
git commit -m "Your changes"
git push origin main
```
- Auto-deploys to: https://triventa.vercel.app

### 3. BRANCHES
- ONLY use `main` branch
- NEVER create other branches
- ALL deployments from main only

## 🛡️ SAFEGUARDS

### NEVER DO:
- ❌ Work in any folder except `vercel/`
- ❌ Create duplicate projects
- ❌ Delete any files from master app
- ❌ Change universe theme
- ❌ Remove golden TRIVENTA branding
- ❌ Modify core login/role system

### ALWAYS DO:
- ✅ Work in `C:\Users\sujal singh\Desktop\vercel\`
- ✅ Test changes locally first
- ✅ Commit and push to main branch
- ✅ Verify deployment on https://triventa.vercel.app
- ✅ Backup important changes

## 📞 EMERGENCY
If anything goes wrong:
1. Check you're in `vercel/` folder
2. Run `git status` to see changes
3. Run `npm run build` to test
4. Push to main and check Vercel

---
**TRIVENTA - The Operating System of Ambition**
*Build • Signal • Scale*
