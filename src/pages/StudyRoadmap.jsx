import { useState } from 'react';
import './StudyRoadmap.css';
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const StudyRoadmap = () => {
    const [topic, setTopic] = useState('Web Development');
    const [level, setLevel] = useState('beginner');
    const [roadmap, setRoadmap] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const topics = [
        'Web Development',
        'Mobile Development',
        'Data Science',
        'Machine Learning',
        'Cloud Computing',
        'Cybersecurity',
        'Database Management',
        'DevOps'
    ];

    const levels = [
        { value: 'beginner', label: 'Beginner', icon: '🌱' },
        { value: 'intermediate', label: 'Intermediate', icon: '🌿' },
        { value: 'advanced', label: 'Advanced', icon: '🌳' }
    ];

    const handleGenerate = async () => {
        setLoading(true);
        setError('');
        setRoadmap('');

        try {
            const res = await fetch("http://localhost:5000/api/roadmap", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ topic, level })
            });

            const result = await res.json();

            if (result.success) {
                setRoadmap(result.roadmap);
            } else {
                setError(result.error || "Failed to generate roadmap");
            }
        } catch (err) {
            console.error(err);
            setError("Failed to generate roadmap");
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="study-roadmap-page">
            <div className="container">
                <div className="roadmap-header">
                    <h1>AI-Powered Study Roadmap</h1>
                    <p>Get a personalized learning path tailored to your goals</p>
                </div>

                <div className="roadmap-controls card">
                    <div className="control-group">
                        <label className="form-label">Select Topic</label>
                        <select
                            className="input"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                        >
                            {topics.map((t) => (
                                <option key={t} value={t}>{t}</option>
                            ))}
                        </select>
                    </div>

                    <div className="control-group">
                        <label className="form-label">Your Level</label>
                        <div className="level-selector">
                            {levels.map((l) => (
                                <label key={l.value} className={`level-option ${level === l.value ? 'active' : ''}`}>
                                    <input
                                        type="radio"
                                        name="level"
                                        value={l.value}
                                        checked={level === l.value}
                                        onChange={(e) => setLevel(e.target.value)}
                                    />
                                    <div className="level-content">
                                        <span className="level-icon">{l.icon}</span>
                                        <span className="level-label">{l.label}</span>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={handleGenerate}
                        className="btn btn-primary btn-lg"
                        disabled={loading}
                        style={{ width: '100%' }}
                    >
                        {loading ? 'Generating Roadmap...' : 'Generate Roadmap'}
                    </button>
                </div>

                {error && (
                    <div className="error-message card">
                        {error}
                    </div>
                )}

                {loading && (
                    <div className="roadmap-loading card">
                        <div className="loading-spinner"></div>
                        <p>AI is creating your personalized roadmap...</p>
                    </div>
                )}

                <div className="roadmap-container">

                    {!loading && roadmap && (
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {roadmap}
                        </ReactMarkdown>
                    )}
                </div>

            </div>
        </div>
    );
};

export default StudyRoadmap;
