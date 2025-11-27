import { useState } from 'react';
import { generateRoadmap } from '../services/geminiService';
import './StudyRoadmap.css';

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

        const result = await generateRoadmap(topic, level);

        if (result.success) {
            setRoadmap(result.roadmap);
        } else {
            setError(result.error || 'Failed to generate roadmap');
        }

        setLoading(false);
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
                                <label
                                    key={l.value}
                                    className={`level-option ${level === l.value ? 'active' : ''}`}
                                >
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

                {roadmap && !loading && (
                    <div className="roadmap-result card">
                        <div className="result-header">
                            <h2>Your {topic} Roadmap</h2>
                            <span className="badge">{level}</span>
                        </div>
                        <div className="roadmap-content">
                            {roadmap.split('\n').map((line, index) => {
                                if (line.startsWith('##')) {
                                    return <h3 key={index}>{line.replace('##', '').trim()}</h3>;
                                } else if (line.startsWith('#')) {
                                    return <h2 key={index}>{line.replace('#', '').trim()}</h2>;
                                } else if (line.startsWith('-') || line.startsWith('*')) {
                                    return <li key={index}>{line.replace(/^[-*]\s*/, '')}</li>;
                                } else if (line.trim()) {
                                    return <p key={index}>{line}</p>;
                                }
                                return null;
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudyRoadmap;
