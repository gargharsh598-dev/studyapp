import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getNotes, getStudents, deleteNote } from '../services/firebaseService';
import { Link } from 'react-router-dom';
import './TeacherDashboard.css';

const TeacherDashboard = () => {
    const { user } = useAuth();
    const [notes, setNotes] = useState([]);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalNotes: 0,
        totalStudents: 0,
        recentUploads: 0,
        totalDownloads: 0
    });

    useEffect(() => {
        loadDashboardData();
    }, [user]);

    const loadDashboardData = async () => {
        setLoading(true);

        // Load notes uploaded by this teacher
        const notesResult = await getNotes({ uploadedBy: user.uid });
        if (notesResult.success) {
            setNotes(notesResult.notes);

            // Calculate recent uploads (last 7 days)
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
            const recentCount = notesResult.notes.filter(note =>
                new Date(note.uploadedAt) > sevenDaysAgo
            ).length;

            setStats(prev => ({
                ...prev,
                totalNotes: notesResult.notes.length,
                recentUploads: recentCount
            }));
        }

        // Load students
        const studentsResult = await getStudents();
        if (studentsResult.success) {
            setStudents(studentsResult.students);
            setStats(prev => ({
                ...prev,
                totalStudents: studentsResult.students.length
            }));
        }

        setLoading(false);
    };

    const handleDeleteNote = async (noteId, fileUrl) => {
        if (!window.confirm('Are you sure you want to delete this note?')) {
            return;
        }

        const result = await deleteNote(noteId, fileUrl);
        if (result.success) {
            alert('Note deleted successfully!');
            loadDashboardData(); // Reload data
        } else {
            alert('Failed to delete note: ' + result.error);
        }
    };

    if (loading) {
        return (
            <div className="dashboard-loading">
                <div className="loading-spinner"></div>
                <p>Loading dashboard...</p>
            </div>
        );
    }

    return (
        <div className="teacher-dashboard">
            <div className="container">
                <div className="dashboard-header">
                    <div>
                        <h1>Teacher Dashboard 👨‍🏫</h1>
                        <p>Manage your study materials and track student progress.</p>
                    </div>
                    <Link to="/teacher/upload" className="btn btn-primary">
                        📤 Upload New Notes
                    </Link>
                </div>

                {/* Stats Cards */}
                <div className="stats-grid">
                    <div className="stat-card card">
                        <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                            📚
                        </div>
                        <div className="stat-content">
                            <h3>{stats.totalNotes}</h3>
                            <p>Total Notes</p>
                        </div>
                    </div>

                    <div className="stat-card card">
                        <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
                            👥
                        </div>
                        <div className="stat-content">
                            <h3>{stats.totalStudents}</h3>
                            <p>Total Students</p>
                        </div>
                    </div>

                    <div className="stat-card card">
                        <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
                            📈
                        </div>
                        <div className="stat-content">
                            <h3>{stats.recentUploads}</h3>
                            <p>Recent Uploads (7 days)</p>
                        </div>
                    </div>

                    <div className="stat-card card">
                        <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' }}>
                            ⭐
                        </div>
                        <div className="stat-content">
                            <h3>{notes.length > 0 ? 'Active' : 'Inactive'}</h3>
                            <p>Status</p>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="dashboard-section">
                    <h2>Quick Actions</h2>
                    <div className="quick-actions-grid">
                        <Link to="/teacher/upload" className="action-card card">
                            <div className="action-icon">📤</div>
                            <h3>Upload Notes</h3>
                            <p>Share new study materials with your students</p>
                        </Link>

                        <div className="action-card card" onClick={() => loadDashboardData()}>
                            <div className="action-icon">🔄</div>
                            <h3>Refresh Data</h3>
                            <p>Update dashboard with latest information</p>
                        </div>

                        <div className="action-card card" style={{ opacity: 0.7, cursor: 'not-allowed' }}>
                            <div className="action-icon">📊</div>
                            <h3>Analytics</h3>
                            <p>Coming soon: Detailed analytics dashboard</p>
                        </div>
                    </div>
                </div>

                {/* My Uploads */}
                <div className="dashboard-section">
                    <div className="section-header">
                        <h2>My Uploads ({notes.length})</h2>
                        <Link to="/teacher/upload" className="btn btn-secondary btn-sm">
                            + Add New
                        </Link>
                    </div>

                    {notes.length === 0 ? (
                        <div className="empty-state card">
                            <div className="empty-icon">📝</div>
                            <h3>No notes uploaded yet</h3>
                            <p>Start by uploading your first study material to share with students</p>
                            <Link to="/teacher/upload" className="btn btn-primary">
                                📤 Upload Notes
                            </Link>
                        </div>
                    ) : (
                        <div className="notes-table-container">
                            <table className="notes-table">
                                <thead>
                                    <tr>
                                        <th>Title</th>
                                        <th>Category</th>
                                        <th>Size</th>
                                        <th>Uploaded</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {notes.map((note) => (
                                        <tr key={note.id}>
                                            <td>
                                                <div className="note-title-cell">
                                                    <strong>{note.title}</strong>
                                                    <span className="note-desc">{note.description}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <span className="badge">{note.category}</span>
                                            </td>
                                            <td>{(note.fileSize / 1024 / 1024).toFixed(2)} MB</td>
                                            <td>{new Date(note.uploadedAt).toLocaleDateString()}</td>
                                            <td>
                                                <div className="action-buttons">
                                                    <a
                                                        href={note.fileUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="btn btn-secondary btn-sm"
                                                        title="View"
                                                    >
                                                        👁️
                                                    </a>
                                                    <button
                                                        onClick={() => handleDeleteNote(note.id, note.fileUrl)}
                                                        className="btn btn-sm"
                                                        style={{ background: '#ff4757', color: 'white' }}
                                                        title="Delete"
                                                    >
                                                        🗑️
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Students List */}
                <div className="dashboard-section">
                    <div className="section-header">
                        <h2>Registered Students ({students.length})</h2>
                    </div>

                    {students.length === 0 ? (
                        <div className="empty-state card">
                            <div className="empty-icon">👥</div>
                            <h3>No students registered yet</h3>
                            <p>Students will appear here once they sign up</p>
                        </div>
                    ) : (
                        <div className="students-grid">
                            {students.map((student) => (
                                <div key={student.id} className="student-card card">
                                    <div className="student-avatar">
                                        {student.displayName?.[0]?.toUpperCase() || student.email[0].toUpperCase()}
                                    </div>
                                    <div className="student-info">
                                        <h4>{student.displayName || 'Student'}</h4>
                                        <p>{student.email}</p>
                                        <span className="student-date">
                                            Joined: {new Date(student.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Tips for Teachers */}
                <div className="dashboard-section">
                    <h2>Tips for Effective Teaching 💡</h2>
                    <div className="tips-grid">
                        <div className="tip-card card">
                            <div className="tip-icon">📋</div>
                            <h4>Organize Content</h4>
                            <p>Use clear titles and categories for easy navigation</p>
                        </div>
                        <div className="tip-card card">
                            <div className="tip-icon">🎯</div>
                            <h4>Set Clear Goals</h4>
                            <p>Define learning objectives for each material</p>
                        </div>
                        <div className="tip-card card">
                            <div className="tip-icon">💬</div>
                            <h4>Engage Students</h4>
                            <p>Encourage questions and provide feedback</p>
                        </div>
                        <div className="tip-card card">
                            <div className="tip-icon">📊</div>
                            <h4>Track Progress</h4>
                            <p>Monitor student engagement and performance</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeacherDashboard;
