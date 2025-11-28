import OpenAI from "openai";

const getGrokClient = () => {
    const apiKey = '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';
    if (!apiKey) {
        throw new Error("Missing XAI_API_KEY environment variable");
    }
    return new OpenAI({
        apiKey,
        baseURL: "https://api.x.ai/v1",   // Grok base URL per xAI docs :contentReference[oaicite:3]{index=3}
    });
};

export const generateRoadmap = async (topic, level = "beginner") => {
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
            model: "mistral-7b-instruct", // example free model on OpenRouter
            messages: [
                { role: "system", content: "You are a helpful study assistant." },
                { role: "user", content: prompt },
            ],
            temperature: 0.7,
        });


        const text = response.choices[0].message.content;
        return { success: true, roadmap: text };
    } catch (err) {
        console.error("Error generating roadmap:", err);
        return { success: false, error: err.message || "Failed to generate roadmap." };
    }
};

export const getStudyTips = async (topic) => {
    try {
        const client = getGrokClient();

        const prompt = `Provide 6 effective study tips for learning ${topic}.

Include:
- Best learning practices
- Common mistakes to avoid
- Practical exercises
- Time management tips

Make tips specific, actionable, and beginner-friendly.`;

        const response = await client.chat.completions.create({
            model: "grok-4-fast",
            messages: [
                { role: "system", content: "You are an educational assistant." },
                { role: "user", content: prompt },
            ],
            temperature: 0.7,
        });

        const tips = response.choices[0].message.content;
        return { success: true, tips };
    } catch (err) {
        console.error("Error getting study tips:", err);
        return { success: false, error: err.message || "Failed to get study tips." };
    }
};

export const answerQuestion = async (question, context = "") => {
    try {
        const client = getGrokClient();

        const prompt = `You are a helpful study assistant. Answer this student's question clearly and concisely:

Question: ${question}
${context ? `Context: ${context}` : ""}

Provide:
1. A clear, direct answer
2. An explanation if needed
3. An example if applicable
4. Related concepts they might want to explore

Keep the response educational and encouraging.`;

        const response = await client.chat.completions.create({
            model: "grok-4-fast",
            messages: [
                { role: "system", content: "You are a helpful study assistant." },
                { role: "user", content: prompt },
            ],
            temperature: 0.7,
        });

        const answer = response.choices[0].message.content;
        return { success: true, answer };
    } catch (err) {
        console.error("Error answering question:", err);
        return { success: false, error: err.message || "Failed to answer question." };
    }
};

export const generateQuiz = async (topic, difficulty = "medium", numQuestions = 5) => {
    try {
        const client = getGrokClient();

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
]`;

        const response = await client.chat.completions.create({
            model: "grok-4-fast",
            messages: [
                { role: "system", content: "You are a helpful quiz generator assistant." },
                { role: "user", content: prompt },
            ],
            temperature: 0.7,
        });

        const text = response.choices[0].message.content;
        let quiz;
        try {
            quiz = JSON.parse(text);
        } catch (parseErr) {
            // If parsing fails, return raw text
            quiz = text;
        }
        return { success: true, quiz };
    } catch (err) {
        console.error("Error generating quiz:", err);
        return { success: false, error: err.message || "Failed to generate quiz." };
    }
};

export const analyzeProgress = async (userData) => {
    try {
        const client = getGrokClient();

        const prompt = `Analyze this student's learning progress:

Completed: ${userData.completedTopics?.join(", ") || "None yet"}
Current Topic: ${userData.currentTopic || "Not started"}
Study Time: ${userData.timeSpent || 0} hours

Provide a brief analysis with:
1. Progress Summary (2-3 sentences)
2. Strengths
3. Areas to Improve
4. 3 Specific Recommendations
5. Motivational Message

Keep it encouraging and actionable.`;

        const response = await client.chat.completions.create({
            model: "grok-4-fast",
            messages: [
                { role: "system", content: "You are a helpful study progress analyst." },
                { role: "user", content: prompt },
            ],
            temperature: 0.7,
        });

        const analysis = response.choices[0].message.content;
        return { success: true, analysis };
    } catch (err) {
        console.error("Error analyzing progress:", err);
        return { success: false, error: err.message || "Failed to analyze progress." };
    }
};
