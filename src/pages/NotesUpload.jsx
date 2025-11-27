import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { uploadNote } from '../services/firebaseService';
import { useNavigate } from 'react-router-dom';
import './NotesUpload.css';

const NotesUpload = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'Web Development'
    });
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const categories = [
        'Web Development',
        'Mobile Development',
        'Data Science',
        'Machine Learning',
        'Cloud Computing',
        'Cybersecurity',
        'Database',
        'DevOps',
        'Other'
    ];

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            // Validate file size (max 10MB)
            if (selectedFile.size > 10 * 1024 * 1024) {
                setError('File size must be less than 10MB');
                return;
            }
            setFile(selectedFile);
            setError('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log('Submit clicked');

        if (!user) {
            console.error('No user found');
            setError('You must be logged in to upload notes.');
            return;
        }

        if (!file) {
            console.warn('No file selected');
            setError('Please select a file to upload');
            return;
        }

        setUploading(true);
        setError('');
        console.log('Starting upload for:', file.name);

        try {
            const noteData = {
                ...formData,
                uploadedBy: user.uid,
                uploaderEmail: user.email
            };

            console.log('Note data prepared:', noteData);
            const result = await uploadNote(noteData, file);
            console.log('Upload result:', result);

            if (result.success) {
                setSuccess(true);
                setTimeout(() => {
                    navigate('/teacher/dashboard');
                }, 2000);
            } else {
                console.error('Upload failed:', result.error);
                setError(result.error || 'Failed to upload note');
                // Show alert for immediate visibility
                alert(`Upload Failed: ${result.error || 'Unknown error'}`);
            }
        } catch (err) {
            console.error('Unexpected error in handleSubmit:', err);
            setError('An unexpected error occurred: ' + err.message);
            alert('An unexpected error occurred: ' + err.message);
        } finally {
            setUploading(false);
        }
    };

    if (success) {
        return (
            <div className="upload-success">
                <div className="container">
                    <div className="success-card card-glass">
                        <div className="success-icon">✅</div>
                        <h2>Upload Successful!</h2>
                        <p>Your notes have been uploaded and are now available to students.</p>
                        <p className="redirect-text">Redirecting to dashboard...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="notes-upload-page">
            <div className="container container-narrow">
                <div className="upload-header">
                    <h1>Upload Study Notes</h1>
                    <p>Share your knowledge with students</p>
                </div>

                <div className="upload-card card">
                    {error && (
                        <div className="error-message" style={{
                            backgroundColor: '#fee2e2',
                            color: '#991b1b',
                            padding: '1rem',
                            borderRadius: '0.5rem',
                            marginBottom: '1.5rem',
                            border: '1px solid #f87171',
                            fontWeight: 'bold',
                            textAlign: 'center'
                        }}>
                            ⚠️ {error}
                        </div>
                    )}

                    <div className="upload-form">
                        <div className="form-group">
                            <label htmlFor="title" className="form-label">Note Title *</label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                className="input"
                                placeholder="e.g., Introduction to React Hooks"
                                value={formData.title}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="description" className="form-label">Description *</label>
                            <textarea
                                id="description"
                                name="description"
                                className="input textarea"
                                placeholder="Provide a brief description of the content..."
                                value={formData.description}
                                onChange={handleChange}
                                rows="4"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="category" className="form-label">Category *</label>
                            <select
                                id="category"
                                name="category"
                                className="input"
                                value={formData.category}
                                onChange={handleChange}
                                required
                            >
                                {categories.map((cat) => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="file" className="form-label">Upload File *</label>
                            <div className="file-upload-area">
                                <input
                                    type="file"
                                    id="file"
                                    onChange={handleFileChange}
                                    accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"
                                    className="file-input"
                                />
                                <label htmlFor="file" className="file-upload-label">
                                    <div className="upload-icon">📁</div>
                                    <div className="upload-text">
                                        {file ? (
                                            <>
                                                <strong>{file.name}</strong>
                                                <span>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                                            </>
                                        ) : (
                                            <>
                                                <strong>Click to upload or drag and drop</strong>
                                                <span>PDF, DOC, DOCX, PPT, PPTX, TXT (max 10MB)</span>
                                            </>
                                        )}
                                    </div>
                                </label>
                            </div>
                        </div>

                        <div className="form-actions">
                            <button
                                type="button"
                                onClick={() => navigate('/teacher/dashboard')}
                                className="btn btn-secondary"
                                disabled={uploading}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleSubmit}
                                className="btn btn-primary"
                                disabled={uploading}
                            >
                                {uploading ? 'Uploading...' : 'Upload Notes'}
                            </button>
                        </div>
                    </div>

                    {/* Diagnostic Tool */}
                    <div style={{ marginTop: '2rem', padding: '1rem', borderTop: '1px solid #eee' }}>
                        <button
                            type="button"
                            onClick={async () => {
                                const status = [];
                                const addStatus = (msg) => {
                                    status.push(msg);
                                    alert(status.join('\n'));
                                };

                                addStatus('Starting Diagnostic Check...');

                                // 1. Check Auth
                                if (user) addStatus('✅ Auth: Logged in as ' + user.email);
                                else addStatus('❌ Auth: Not logged in');

                                // 2. Check Firestore
                                try {
                                    const { collection, getDocs, limit, query } = await import('firebase/firestore');
                                    const { db } = await import('../config/firebase.config');
                                    if (!db) throw new Error('DB not initialized');
                                    await getDocs(query(collection(db, 'users'), limit(1)));
                                    addStatus('✅ Firestore: Connection Successful');
                                } catch (e) {
                                    addStatus('❌ Firestore Error: ' + e.message);
                                }

                                // 3. Check Storage
                                try {
                                    const { ref, listAll } = await import('firebase/storage');
                                    const { storage } = await import('../config/firebase.config');
                                    if (!storage) throw new Error('Storage not initialized');
                                    const listRef = ref(storage, 'notes/');
                                    await listAll(listRef);
                                    addStatus('✅ Storage: Connection Successful');
                                } catch (e) {
                                    addStatus('❌ Storage Error: ' + e.message);
                                    if (e.message.includes('403')) addStatus('   -> Tip: Check Storage Rules in Firebase Console');
                                    if (e.message.includes('404')) addStatus('   -> Tip: Create "notes" folder or check bucket');
                                }
                            }}
                            style={{ background: 'none', border: 'none', color: '#666', textDecoration: 'underline', cursor: 'pointer', fontSize: '0.8rem' }}
                        >
                            Troubleshoot Connection
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotesUpload;
