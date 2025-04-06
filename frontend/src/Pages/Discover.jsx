import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Discover.css';

export default function Discover({ user }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleMessage = (userId) => {
    // Navigate to messaging page with the user's ID
    navigate(`/messages/${userId}`);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(
          `http://localhost/musicaalLife/api/users.php?currentUserId=${user.id}`,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
          }
        );
        
        if (!response.ok) throw new Error('Network response was not ok');
        
        const data = await response.json();
        if (!data.success) throw new Error(data.error || 'Failed to load users');
        
        setUsers(data.users);
      } catch (error) {
        console.error('Error:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [user, navigate]);

  if (loading) return <div className="loading-spinner"></div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="discover-page">
      <h1 className="discover-title">Discover Musicians</h1>
      
      <div className="users-grid">
        {users.length > 0 ? (
          users.map(user => (
            <div key={user.id} className="user-card">
              <div className="user-avatar">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <h3>{user.name}</h3>
              <p className="user-bio">{user.bio || 'No bio available'}</p>
              {user.age && <p className="user-age">Age: {user.age}</p>}
              
              <button 
                className="message-button"
                onClick={() => handleMessage(user.id)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                Message
              </button>
            </div>
          ))
        ) : (
          <p className="no-users">No musicians found</p>
        )}
      </div>
    </div>
  );
}