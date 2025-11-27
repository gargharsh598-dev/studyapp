import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requireRole }) => {
    const { user, userRole } = useAuth();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (requireRole && userRole !== requireRole) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
