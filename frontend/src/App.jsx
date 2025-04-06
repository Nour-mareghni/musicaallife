

import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthForm from './components/AuthForm';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Discover from './pages/Discover';
import './App.css';
import Messages from './Pages/Messages';


function App() {
  
  const [authState, setAuthState] = useState(() => {
    const savedAuth = localStorage.getItem('musicalLifeAuth');
    return savedAuth 
      ? JSON.parse(savedAuth)
      : { isAuthenticated: false, user: null };
  });

  // Destructure for easier access
  const { isAuthenticated, user } = authState;

  const handleAuthSuccess = (userData) => {
    const newAuthState = {
      isAuthenticated: true,
      user: {
        id: userData.id,
        name: userData.name,
        email: userData.email
      }
    };
    localStorage.setItem('musicalLifeAuth', JSON.stringify(newAuthState));
    setAuthState(newAuthState);
  };

  const handleLogout = () => {
    localStorage.removeItem('musicalLifeAuth');
    setAuthState({ isAuthenticated: false, user: null });
  };

  return (
    <Router>
      <Routes>
        {/* Auth route */}
        <Route 
          path="/auth" 
          element={
            isAuthenticated ? 
              <Navigate to="/" /> : 
              <AuthForm onAuthSuccess={handleAuthSuccess} />
          } 
        />
        
        {/* Protected routes */}
        <Route 
          path="/" 
          element={
            isAuthenticated ? 
              <Home user={user} onLogout={handleLogout} /> : 
              <Navigate to="/auth" />
          } 
        />
        
        <Route 
          path="/profile" 
          element={
            isAuthenticated ? 
              <Profile user={user} onLogout={handleLogout} /> : 
              <Navigate to="/auth" />
          } 
        />
        
        <Route 
          path="/discover" 
          element={
            isAuthenticated ? 
              <Discover user={user} /> : 
              <Navigate to="/auth" />
          } 
        />

<Route 
          path="/messages/:userId" 
          element={
            authState.isAuthenticated ? 
              <Messages currentUser={authState.user} /> : 
              <Navigate to="/auth" />
          } 
        />
        
        
        <Route path="/login" element={<Navigate to="/auth" />} />
        <Route path="/register" element={<Navigate to="/auth?mode=register" />} />
        
        
        <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/auth"} />} />
      </Routes>
    </Router>
  );
}

export default App;