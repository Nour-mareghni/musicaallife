

import { useState, useEffect } from 'react'; 
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import '../styles/AuthForm.css';



export default function AuthForm({ onAuthSuccess, defaultMode = 'login' }) {
  const [isLogin, setIsLogin] = useState(defaultMode === 'login');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    bio: '',
    age: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const endpoint = isLogin ? 'login' : 'register';
      const payload = isLogin 
        ? { email: formData.email, password: formData.password }
        : formData;
      
      const response = await axios.post(
        `http://localhost/musicaalLife/api/auth.php`,
        { ...payload, action: endpoint },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      onAuthSuccess(response.data.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 
              (isLogin ? 'Login failed' : 'Registration failed'));
    }
  };

  return (
    <div className="auth-container">
      <h1 className="auth-title">{isLogin ? 'Login' : 'Register'}</h1>
      {error && <p className="auth-error">{error}</p>}
      
      <form className="auth-form" onSubmit={handleSubmit}>
        
        <input
          className="auth-input"
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        
        <input
          className="auth-input"
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        
        {!isLogin && (
          <>
            <input
              className="auth-input"
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            
            <input
              className="auth-input"
              type="number"
              name="age"
              placeholder="Age"
              value={formData.age}
              onChange={handleChange}
              min="13"
              max="120"
              required
            />
            
            <textarea
              className="auth-input"
              name="bio"
              placeholder="Short Bio (max 200 characters)"
              value={formData.bio}
              onChange={handleChange}
              maxLength="200"
              rows="3"
            />
          </>
        )}

        <button className="auth-button" type="submit">
          {isLogin ? 'Login' : 'Register'}
        </button>
      </form>

      <p className="auth-toggle">
        {isLogin ? "Don't have an account? " : "Already have an account? "}
        <button 
          type="button"
          className="auth-toggle-button"
          onClick={() => {
            setIsLogin(!isLogin);
            navigate(`/auth?mode=${isLogin ? 'register' : 'login'}`);
          }}
        >
          {isLogin ? 'Register' : 'Login'}
        </button>
      </p>
    </div>
  );
}