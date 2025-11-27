import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import TeacherDashboard from './pages/TeacherDashboard';
import NotesUpload from './pages/NotesUpload';
import StudentDashboard from './pages/StudentDashboard';
import StudyRoadmap from './pages/StudyRoadmap';

import './index.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="app">
          <Navbar />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Teacher Routes */}
            <Route
              path="/teacher/dashboard"
              element={
                <ProtectedRoute requireRole="teacher">
                  <TeacherDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher/upload"
              element={
                <ProtectedRoute requireRole="teacher">
                  <NotesUpload />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher/students"
              element={
                <ProtectedRoute requireRole="teacher">
                  <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
                    <h1>Students Management</h1>
                    <p>Coming soon: View and manage student progress</p>
                  </div>
                </ProtectedRoute>
              }
            />

            {/* Student Routes */}
            <Route
              path="/student/dashboard"
              element={
                <ProtectedRoute requireRole="student">
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/notes"
              element={
                <ProtectedRoute requireRole="student">
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/roadmap"
              element={
                <ProtectedRoute requireRole="student">
                  <StudyRoadmap />
                </ProtectedRoute>
              }
            />

            {/* 404 Route */}
            <Route
              path="*"
              element={
                <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
                  <h1>404 - Page Not Found</h1>
                  <p>The page you're looking for doesn't exist.</p>
                  <a href="/" className="btn btn-primary" style={{ marginTop: '2rem' }}>
                    Go Home
                  </a>
                </div>
              }
            />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
