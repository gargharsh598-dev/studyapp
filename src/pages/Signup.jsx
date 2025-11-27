import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Signup = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        displayName: '',
        role: 'student'
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        console.log('Attempting signup with:', { email: formData.email, role: formData.role });

        const result = await signup(
            formData.email,
            formData.password,
            formData.displayName,
            formData.role
        );

        console.log('Signup result:', result);

        if (result.success) {
            console.log('Signup successful! Redirecting to:', formData.role === 'teacher' ? '/teacher/dashboard' : '/student/dashboard');
            // Redirect to role-specific dashboard
            setTimeout(() => {
                if (formData.role === 'teacher') {
                    navigate('/teacher/dashboard');
                } else {
                    navigate('/student/dashboard');
                }
            }, 500);
        } else {
            console.error('Signup failed:', result.error);
            setError(result.error || 'Failed to create account');
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-background">
                <div className="gradient-orb orb-1"></div>
                <div className="gradient-orb orb-2"></div>
            </div>

            <div className="auth-container">
                <div className="auth-card card-glass">
                    <div className="auth-header">
                        <h1>Create Account</h1>
                        <p>Start your learning journey today</p>
                    </div>

                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="form-group">
                            <label htmlFor="displayName" className="form-label">Full Name</label>
                            <input
                                type="text"
                                id="displayName"
                                name="displayName"
                                className="input"
                                placeholder="John Doe"
                                value={formData.displayName}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email" className="form-label">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                className="input"
                                placeholder="you@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                className="input"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                className="input"
                                placeholder="••••••••"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">I am a...</label>
                            <div className="role-selector">
                                <label className={`role-option ${formData.role === 'student' ? 'active' : ''}`}>
                                    <input
                                        type="radio"
                                        name="role"
                                        value="student"
                                        checked={formData.role === 'student'}
                                        onChange={handleChange}
                                    />
                                    <div className="role-content">
                                        <span className="role-icon">🎓</span>
                                        <span className="role-name">Student</span>
                                    </div>
                                </label>

                                <label className={`role-option ${formData.role === 'teacher' ? 'active' : ''}`}>
                                    <input
                                        type="radio"
                                        name="role"
                                        value="teacher"
                                        checked={formData.role === 'teacher'}
                                        onChange={handleChange}
                                    />
                                    <div className="role-content">
                                        <span className="role-icon">👨‍🏫</span>
                                        <span className="role-name">Teacher</span>
                                    </div>
                                </label>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary btn-lg"
                            disabled={loading}
                            style={{ width: '100%' }}
                        >
                            {loading ? 'Creating Account...' : 'Create Account'}
                        </button>
                    </form>

                    <div className="auth-footer">
                        <p>
                            Already have an account?{' '}
                            <Link to="/login" className="auth-link">Sign in</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
