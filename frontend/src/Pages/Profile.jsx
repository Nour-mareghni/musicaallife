import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Profile.css';





export default function Profile({ user, onLogout }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      console.warn('No user data - redirecting to home');
      navigate('/');
    }
  }, [user, navigate]);

  if (!user) {
    return (
      <div className="profile-loading">
        <div className="spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>Your Profile</h1>
        <Link to="/" className="back-button">← Back to Home</Link>
      </div>
      
      <div className="profile-content">
        <div className="avatar-large">
          {user.name?.charAt(0).toUpperCase() || 'A'}
        </div>
        
        <div className="profile-details">
          <h2 className="profile-name">{user.name || 'User'}</h2>
          
          <div className="profile-meta">
            <p className="profile-age">
              {user.age ? `${user.age} years old` : 'Age not specified'}
            </p>
            <p className="profile-email">{user.email || 'No email provided'}</p>
          </div>
          
          {user.bio ? (
            <div className="profile-bio-section">
              <h3>About Me</h3>
              <p className="profile-bio">{user.bio}</p>
            </div>
          ) : (
            <div className="profile-bio-section">
              <h3>About Me</h3>
              <p className="profile-bio-empty">No bio yet</p>
            </div>
          )}
        </div>
        
        <button onClick={onLogout} className="logout-button">
          Logout
        </button>
      </div>
    </div>
  );
}