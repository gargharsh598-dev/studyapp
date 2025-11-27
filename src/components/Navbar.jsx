import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import './Navbar.css';

const Navbar = () => {
    const { user, userRole, logout } = useAuth();
    const navigate = useNavigate();
    const [showDropdown, setShowDropdown] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    return (
        <nav className="navbar">
            <div className="container">
                <div className="navbar-content">
                    <Link to="/" className="navbar-brand">
                        <span className="brand-icon">📚</span>
                        <span className="brand-text">StudyApp</span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="navbar-menu">
                        {user ? (
                            <>
                                <Link to={userRole === 'teacher' ? '/teacher/dashboard' : '/student/dashboard'} className="nav-link">
                                    Dashboard
                                </Link>

                                {userRole === 'student' && (
                                    <>
                                        <Link to="/student/notes" className="nav-link">
                                            Notes
                                        </Link>
                                        <Link to="/student/roadmap" className="nav-link">
                                            Roadmap
                                        </Link>
                                    </>
                                )}

                                {userRole === 'teacher' && (
                                    <>
                                        <Link to="/teacher/upload" className="nav-link">
                                            Upload Notes
                                        </Link>
                                        <Link to="/teacher/students" className="nav-link">
                                            Students
                                        </Link>
                                    </>
                                )}

                                <div className="user-menu">
                                    <button
                                        className="user-button"
                                        onClick={() => setShowDropdown(!showDropdown)}
                                    >
                                        <span className="user-avatar">
                                            {user.email?.[0].toUpperCase()}
                                        </span>
                                        <span className="user-email">{user.email}</span>
                                        <svg className="dropdown-icon" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                            <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="2" fill="none" />
                                        </svg>
                                    </button>

                                    {showDropdown && (
                                        <div className="dropdown-menu">
                                            <div className="dropdown-item">
                                                <span className="role-badge">{userRole}</span>
                                            </div>
                                            <button onClick={handleLogout} className="dropdown-item logout-btn">
                                                Logout
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="nav-link">
                                    Login
                                </Link>
                                <Link to="/signup" className="btn btn-primary btn-sm">
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="mobile-menu-btn"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            {mobileMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="mobile-menu">
                        {user ? (
                            <>
                                <Link to={userRole === 'teacher' ? '/teacher/dashboard' : '/student/dashboard'} className="mobile-nav-link">
                                    Dashboard
                                </Link>

                                {userRole === 'student' && (
                                    <>
                                        <Link to="/student/notes" className="mobile-nav-link">
                                            Notes
                                        </Link>
                                        <Link to="/student/roadmap" className="mobile-nav-link">
                                            Roadmap
                                        </Link>
                                    </>
                                )}

                                {userRole === 'teacher' && (
                                    <>
                                        <Link to="/teacher/upload" className="mobile-nav-link">
                                            Upload Notes
                                        </Link>
                                        <Link to="/teacher/students" className="mobile-nav-link">
                                            Students
                                        </Link>
                                    </>
                                )}

                                <div className="mobile-user-info">
                                    <span>{user.email}</span>
                                    <span className="role-badge">{userRole}</span>
                                </div>

                                <button onClick={handleLogout} className="btn btn-secondary">
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="mobile-nav-link">
                                    Login
                                </Link>
                                <Link to="/signup" className="btn btn-primary">
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
