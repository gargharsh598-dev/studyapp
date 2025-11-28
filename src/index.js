// index.js
import express from "express";
import multer from "multer";
import cors from "cors";
import 'dotenv/config'; // Load .env variables
import { initializeApp } from "firebase/app";
import OpenAI from "openai";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const app = express();
const upload = multer({ storage: multer.memoryStorage() }); // store files in memory

// Enable CORS for your frontend
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// Initialize Firebase
const firebaseConfig = {
    apiKey: 'AIzaSyC_PIJn4Qf9pvabl7v8pinLFSkFOyzYuk4',
    authDomain: 'form-5e612.firebaseapp.com',
    projectId: 'form-5e612',
    storageBucket: 'form-5e612.appspot.com',
    messagingSenderId: '544149536894',
    appId: '1:544149536894:web:bfc4784b29abfe0a6a982f',
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);

const client = new OpenAI({
    apiKey: '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',
    baseURL: "https://openrouter.ai/api/v1",
});
// RoadMap
app.post("/api/roadmap", async (req, res) => {
    const { topic, level } = req.body;
    try {
        const prompt = `Create a comprehensive study roadmap for learning ${topic} at ${level} level.

Structure the roadmap with these sections:

1. OVERVIEW
Brief introduction to ${topic} and what you'll learn

2. PREREQUISITES
What you should know before starting

3. LEARNING PATH (6-8 milestones)
For each milestone include:
- Topic name
- Key concepts to learn
- Estimated time to complete
- Practical exercises

4. RECOMMENDED RESOURCES
- Free online courses
- Documentation
- Practice platforms
- YouTube channels

5. HANDS-ON PROJECTS (3-4 projects)
Real-world projects to build your skills

6. NEXT STEPS
What to learn after completing this roadmap

Keep it practical, actionable, and encouraging. Focus on free resources.`

        const response = await client.chat.completions.create({
            model: "tngtech/tng-r1t-chimera:free",
            messages: [
                { role: "system", content: "You are a helpful study assistant." },
                { role: "user", content: prompt }
            ],
            stream: false,
            temperature: 0.7
        });

        const text = response.choices[0].message.content;
        res.json({ success: true, roadmap: text });
    } catch (err) {
        console.error(err);
        res.json({ success: false, error: err.message });
    }
})

// Quiz
app.post("/api/quiz", async (req, res) => {
    const { topic, numQuestions, difficulty } = req.body;
    try {
        const prompt = `Generate ${numQuestions} multiple-choice quiz questions about ${topic} at ${difficulty} difficulty level.

For each question, provide:
- The question text
- 4 answer options (A, B, C, D)
- The correct answer
- A brief explanation of why it's correct

Format as a JSON array with this structure:
[
  {
    "question": "Question text",
    "options": ["A) ...", "B) ...", "C) ...", "D) ..."],
    "correct": "A",
    "explanation": "...",
  }
]`
        const response = await client.chat.completions.create({
            model: "tngtech/tng-r1t-chimera:free",
            messages: [
                { role: "system", content: "You are a helpful study assistant." },
                { role: "user", content: prompt }
            ],
            stream: false,
            temperature: 0.7
        });

        const text = response.choices[0].message.content;
        res.json({ success: true, roadmap: text });
    } catch (err) {
        console.error(err);
        res.json({ success: false, error: err.message });
    }
})

// Upload endpoint
app.post("/upload", upload.single("file"), async (req, res) => {
    try {
        const file = req.file;
        const { title, description, category, uploadedBy } = req.body;
        if (!file) return res.status(400).json({ error: "No file uploaded" });
        const fileRef = ref(storage, `notes/${Date.now()}_${file.originalname}`);
        await uploadBytes(fileRef, file.buffer);
        const fileUrl = await getDownloadURL(fileRef);
        const noteDoc = await addDoc(collection(db, "notes"), {
            title,
            description,
            category,
            uploadedBy,
            fileUrl,
            fileName: file.originalname,
            uploadedAt: new Date().toISOString(),
        });

        res.json({ success: true, fileUrl, noteId: noteDoc.id });
    } catch (err) {
        console.error("Upload Error:", err);
        res.status(500).json({ error: err.message });
    }
});

// Start server
app.listen(5000, () => console.log("Server running on port 5000"));
