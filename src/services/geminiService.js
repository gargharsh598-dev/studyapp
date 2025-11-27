import { getGeminiModel } from '../config/gemini.config';

// Generate study roadmap based on topic and level
export const generateRoadmap = async (topic, level = 'beginner') => {
    try {
        const model = getGeminiModel();

        if (!model) {
            return {
                success: false,
                error: 'Gemini AI is not configured. Please add your API key to the .env file.'
            };
        }

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

Keep it practical, actionable, and encouraging. Focus on free resources.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        return { success: true, roadmap: text };
    } catch (error) {
        console.error('Error generating roadmap:', error);

        // Handle specific error cases
        if (error.message?.includes('quota')) {
            return {
                success: false,
                error: 'API quota exceeded. Please try again later or check your Gemini API quota.'
            };
        }

        if (error.message?.includes('API key')) {
            return {
                success: false,
                error: 'Invalid API key. Please check your Gemini API key in the .env file.'
            };
        }

        return {
            success: false,
            error: error.message || 'Failed to generate roadmap. Please try again.'
        };
    }
};

// Analyze student progress and provide insights
export const analyzeProgress = async (userData) => {
    try {
        const model = getGeminiModel();

        if (!model) {
            return {
                success: false,
                error: 'Gemini AI is not configured.'
            };
        }

        const prompt = `Analyze this student's learning progress:

Completed: ${userData.completedTopics?.join(', ') || 'None yet'}
Current Topic: ${userData.currentTopic || 'Not started'}
Study Time: ${userData.timeSpent || 0} hours

Provide a brief analysis with:
1. Progress Summary (2-3 sentences)
2. Strengths
3. Areas to Improve
4. 3 Specific Recommendations
5. Motivational Message

Keep it encouraging and actionable.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        return { success: true, analysis: text };
    } catch (error) {
        console.error('Error analyzing progress:', error);
        return {
            success: false,
            error: error.message || 'Failed to analyze progress.'
        };
    }
};

// Get study tips for a specific topic
export const getStudyTips = async (topic) => {
    try {
        const model = getGeminiModel();

        if (!model) {
            return { success: false, error: 'Gemini AI is not configured.' };
        }

        const prompt = `Provide 6 effective study tips for learning ${topic}.

Include:
- Best learning practices
- Common mistakes to avoid
- Practical exercises
- Time management tips

Make tips specific, actionable, and beginner-friendly.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        return { success: true, tips: text };
    } catch (error) {
        console.error('Error getting study tips:', error);
        return {
            success: false,
            error: error.message || 'Failed to get study tips.'
        };
    }
};

// Answer student questions
export const answerQuestion = async (question, context = '') => {
    try {
        const model = getGeminiModel();

        if (!model) {
            return { success: false, error: 'Gemini AI is not configured.' };
        }

        const prompt = `You are a helpful study assistant. Answer this student's question clearly and concisely:
    
Question: ${question}
${context ? `Context: ${context}` : ''}
    
Provide:
1. A clear, direct answer
2. An explanation if needed
3. An example if applicable
4. Related concepts they might want to explore
    
Keep the response educational and encouraging.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        return { success: true, answer: text };
    } catch (error) {
        console.error('Error answering question:', error);
        return { success: false, error: error.message };
    }
};

// Generate quiz questions for a topic
export const generateQuiz = async (topic, difficulty = 'medium', numQuestions = 5) => {
    try {
        const model = getGeminiModel();

        if (!model) {
            return { success: false, error: 'Gemini AI is not configured.' };
        }

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
    "explanation": "..."
  }
]`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Try to parse JSON from the response
        try {
            const jsonMatch = text.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
                const quiz = JSON.parse(jsonMatch[0]);
                return { success: true, quiz };
            }
        } catch (parseError) {
            // If JSON parsing fails, return the raw text
            return { success: true, quiz: text };
        }

        return { success: true, quiz: text };
    } catch (error) {
        console.error('Error generating quiz:', error);
        return { success: false, error: error.message };
    }
};

// Suggest learning resources
export const suggestResources = async (topic, resourceType = 'all') => {
    try {
        const model = getGeminiModel();

        if (!model) {
            return { success: false, error: 'Gemini AI is not configured.' };
        }

        const prompt = `Suggest high-quality learning resources for ${topic}.
    
${resourceType === 'all' ? 'Include various types of resources:' : `Focus on ${resourceType}:`}
- Online courses and tutorials
- Books and documentation
- Video channels and playlists
- Practice platforms and tools
- Communities and forums
    
For each resource, provide:
- Name
- Type
- Brief description
- Why it's recommended
    
Focus on free or affordable options when possible.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        return { success: true, resources: text };
    } catch (error) {
        console.error('Error suggesting resources:', error);
        return { success: false, error: error.message };
    }
};
