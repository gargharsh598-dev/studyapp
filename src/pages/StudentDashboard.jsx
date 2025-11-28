import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getNotes } from '../services/firebaseService';
import { Link } from 'react-router-dom';
import './StudentDashboard.css';

const StudentDashboard = () => {
    const { user } = useAuth();
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    const categories = ['All', 'Web Development', 'Mobile Development', 'Data Science', 'Machine Learning', 'Cloud Computing', 'Cybersecurity', 'Database', 'DevOps', 'Other'];

    useEffect(() => {
        loadNotes();
    }, []);

    const loadNotes = async () => {
        setLoading(true);
        const result = await getNotes();
        if (result.success) {
            setNotes(result.notes);
        }
        setLoading(false);
    };

    const filteredNotes = notes.filter(note => {
        const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            note.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || note.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const downloadNote = (url, fileName) => {
        window.open(url, '_blank');
    };

    if (loading) {
        return (
            <div className="dashboard-loading">
                <div className="loading-spinner"></div>
                <p>Loading your dashboard...</p>
            </div>
        );
    }

    return (
        <div className="student-dashboard">
            <div className="container">
                {/* Welcome Header */}
                <div className="dashboard-header">
                    <div>
                        <h1>Welcome Back, Student! 👋</h1>
                        <p>Continue your learning journey with AI-powered tools and resources.</p>
                    </div>
                    <Link to="/student/roadmap" className="btn btn-primary">
                        🗺️ Generate Study Roadmap
                    </Link>
                </div>

                {/* Quick Stats */}
                <div className="stats-grid">
                    <div className="stat-card card">
                        <div className="stat-icon">📚</div>
                        <div className="stat-content">
                            <h3>{notes.length}</h3>
                            <p>Available Notes</p>
                        </div>
                    </div>

                    <div className="stat-card card">
                        <div className="stat-icon">📥</div>
                        <div className="stat-content">
                            <h3>{filteredNotes.length}</h3>
                            <p>Filtered Results</p>
                        </div>
                    </div>

                    <div className="stat-card card">
                        <div className="stat-icon">🎯</div>
                        <div className="stat-content">
                            <h3>{categories.length - 1}</h3>
                            <p>Categories</p>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="dashboard-section">
                    <h2>Quick Actions</h2>
                    <div className="quick-actions-grid">
                        <Link to="/student/roadmap" className="action-card card">
                            <div className="action-icon">🗺️</div>
                            <h3>AI Study Roadmap</h3>
                            <p>Get your personalized learning path powered by Gemini AI</p>
                        </Link>

                        <div className="action-card card" onClick={() => document.getElementById('search-input').focus()}>
                            <div className="action-icon">🔍</div>
                            <h3>Search Notes</h3>
                            <p>Find study materials quickly with search and filters</p>
                        </div>

                        <div className="action-card card" style={{ opacity: 0.7 }}>
                            <div className="action-icon">📊</div>
                            <h3>Progress Report</h3>
                            <p>Coming soon: Track your learning progress</p>
                        </div>
                    </div>
                </div>

                {/* Search and Filter */}
                <div className="dashboard-section">
                    <div className="section-header">
                        <h2>Study Materials</h2>
                        <button onClick={loadNotes} className="btn btn-secondary btn-sm">
                            🔄 Refresh
                        </button>
                    </div>

                    <div className="search-filter-bar">
                        <div className="search-box">
                            <input
                                id="search-input"
                                type="text"
                                className="input"
                                placeholder="🔍 Search notes by title or description..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="category-filters">
                            {categories.map((category) => (
                                <button
                                    key={category}
                                    className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                                    onClick={() => setSelectedCategory(category)}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Notes Grid */}
                    {filteredNotes.length === 0 ? (
                        <div className="empty-state card">
                            <div className="empty-icon">
                                {searchTerm || selectedCategory !== 'All' ? '🔍' : '📚'}
                            </div>
                            <h3>
                                {searchTerm || selectedCategory !== 'All'
                                    ? 'No notes found'
                                    : 'No notes available yet'}
                            </h3>
                            <p>
                                {searchTerm || selectedCategory !== 'All'
                                    ? 'Try adjusting your search or filters'
                                    : 'Check back later for new study materials from your teachers'}
                            </p>
                            {(searchTerm || selectedCategory !== 'All') && (
                                <button
                                    onClick={() => {
                                        setSearchTerm('');
                                        setSelectedCategory('All');
                                    }}
                                    className="btn btn-secondary"
                                >
                                    Clear Filters
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="notes-grid">
                            {filteredNotes.map((note) => (
                                <div key={note.id} className="note-card card">
                                    <div className="note-header">
                                        <span className="badge">{note.category}</span>
                                        <span className="note-date">
                                            {new Date(note.uploadedAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <h3>{note.title}</h3>
                                    <p>{note.description}</p>
                                    <div className="note-meta">
                                        <span className="note-size">
                                            📄 {(note.fileSize / 1024 / 1024).toFixed(2)} MB
                                        </span>
                                        <span className="note-teacher">
                                            👨‍🏫 {note.uploaderEmail?.split('@')[0]}
                                        </span>
                                    </div>
                                    <div className="note-footer">
                                        <button
                                            onClick={() => downloadNote(note.fileUrl, note.fileName)}
                                            className="btn btn-primary btn-sm"
                                        >
                                            📥 Download
                                        </button>
                                        <a
                                            href={note.fileUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn btn-secondary btn-sm"
                                        >
                                            👁️ Preview
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Study Tips */}
                <div className="dashboard-section">
                    <h2>Study Tips 💡</h2>
                    <div className="tips-grid">
                        <div className="tip-card card">
                            <div className="tip-icon">⏰</div>
                            <h4>Set a Schedule</h4>
                            <p>Dedicate specific time slots for studying each day</p>
                        </div>
                        <div className="tip-card card">
                            <div className="tip-icon">🎯</div>
                            <h4>Set Goals</h4>
                            <p>Break down your learning into achievable milestones</p>
                        </div>
                        <div className="tip-card card">
                            <div className="tip-icon">📝</div>
                            <h4>Take Notes</h4>
                            <p>Active note-taking helps retain information better</p>
                        </div>
                        <div className="tip-card card">
                            <div className="tip-icon">🤝</div>
                            <h4>Practice Regularly</h4>
                            <p>Apply what you learn through hands-on projects</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
