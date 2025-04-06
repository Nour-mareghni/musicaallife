import { useNavigate } from 'react-router-dom';
import '../styles/Home.css';









export default function Home({ user, onLogout }) {
  const navigate = useNavigate();

  const testNavigation = () => {
    console.log('Test button clicked');
    navigate('/discover');
    console.log('Navigate function called');
  };

  return (
    <div className="home-container">
      {/* Top Navigation Bar */}
      <header className="home-header">
        <div className="header-content">
          <span className="welcome-text">Welcome, {user?.name || 'Artist'}!</span>
          
          <div className="user-controls">
            <button onClick={onLogout} className="logout-button">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              <span>Logout</span>
            </button>
            
            <button 
              onClick={() => navigate('/profile')} 
              className="profile-button"
            >
              <div className="avatar-circle">
                {user?.name?.charAt(0).toUpperCase() || 'A'}
              </div>
            </button>
          </div>
        </div>
      </header>

      
      <main className="home-main">
        <div className="hero-section">
          <div className="hero-text">
            <h1>Connect with <span>Musicians</span></h1>
            <p>Find collaborators, share your music, and grow together in the musical community</p>
          </div>
          
          <div className="cta-section">
            <div className="cta-content">
              <p className="cta-text">Ready to explore?</p>
              <button 
                onClick={testNavigation} 
                className="cta-button"
              >
                <span>Get Started</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}