# Quick Setup Guide for StudyApp

## ⚡ Quick Start (5 minutes)

### Step 1: Install Dependencies ✅
Already done! Dependencies are installed.

### Step 2: Configure Firebase & Gemini AI

The app is currently running in **demo mode** with placeholder credentials. To enable full functionality:

#### Get Firebase Credentials:
1. Visit: https://console.firebase.google.com/
2. Create a new project (or use existing)
3. Enable these services:
   - **Authentication** → Email/Password provider
   - **Firestore Database** → Start in test mode
   - **Storage** → Start in test mode
4. Go to Project Settings → General → Your apps
5. Copy the config values

#### Get Gemini AI API Key:
1. Visit: https://makersuite.google.com/app/apikey
2. Click "Create API Key"
3. Copy the key

### Step 3: Update .env File

Open the `.env` file and replace the placeholder values:

```env
# Replace these with your actual Firebase credentials
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123

# Replace with your Gemini AI key
VITE_GEMINI_API_KEY=AIzaSy...
```

### Step 4: Restart the Dev Server

After updating `.env`:
1. Stop the current server (Ctrl+C in terminal)
2. Run: `npm run dev`
3. Open: http://localhost:5173

## 🎯 What Works Now (Demo Mode)

Even without credentials, you can:
- ✅ View the homepage
- ✅ See the UI/UX design
- ✅ Navigate between pages
- ❌ Sign up/Login (requires Firebase)
- ❌ Upload/Download notes (requires Firebase)
- ❌ Generate AI roadmaps (requires Gemini AI)

## 🔧 Current Status

Your app is running at: **http://localhost:5173**

**Demo Mode Active** - Add credentials to enable full functionality.

## 📋 Firestore Database Structure

Once Firebase is configured, the app will create these collections automatically:

### users/
```javascript
{
  email: "user@example.com",
  displayName: "John Doe",
  role: "student" | "teacher",
  createdAt: "2024-01-01T00:00:00.000Z"
}
```

### notes/
```javascript
{
  title: "Introduction to React",
  description: "Learn React basics...",
  category: "Web Development",
  fileUrl: "https://...",
  fileName: "react-intro.pdf",
  fileSize: 1024000,
  uploadedBy: "teacher-uid",
  uploaderEmail: "teacher@example.com",
  uploadedAt: "2024-01-01T00:00:00.000Z"
}
```

### progress/
```javascript
{
  userId: "student-uid",
  completedTopics: ["HTML", "CSS"],
  currentTopic: "JavaScript",
  lastUpdated: "2024-01-01T00:00:00.000Z"
}
```

## 🚨 Troubleshooting

### "Blank page" issue?
- ✅ **Fixed!** The app now handles missing credentials gracefully
- Check browser console (F12) for any errors
- Make sure dev server is running

### Can't sign up/login?
- Add Firebase credentials to `.env`
- Enable Email/Password authentication in Firebase Console
- Restart the dev server

### AI Roadmap not generating?
- Add Gemini AI API key to `.env`
- Check API key is valid
- Restart the dev server

## 🎨 Features to Try

1. **Homepage** - Beautiful landing page with animations
2. **Sign Up** - Role selection (Student/Teacher)
3. **Student Dashboard** - View notes and roadmaps
4. **Teacher Dashboard** - Upload and manage notes
5. **Study Roadmap** - AI-generated learning paths

## 📞 Need Help?

Check the main README.md for detailed documentation!

---

**Happy Learning! 🚀**
