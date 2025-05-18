import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from './components/ui/toaster';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import PropertyForm from './components/PropertyForm';
import RevenueReport from './components/RevenueReport';
import { useEffect, useState } from 'react';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/login" />} />
        
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/property/new" element={
          <ProtectedRoute>
            <PropertyForm />
          </ProtectedRoute>
        } />
        
        <Route path="/report/:id" element={
          <ProtectedRoute>
            <RevenueReport />
          </ProtectedRoute>
        } />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;
