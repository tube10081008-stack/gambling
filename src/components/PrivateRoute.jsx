import { Navigate } from 'react-router-dom';
import { useStore } from '../lib/store';

export default function PrivateRoute({ children }) {
    const { user, loading } = useStore();

    if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Loading...</div>;

    return user ? children : <Navigate to="/login" replace />;
}
