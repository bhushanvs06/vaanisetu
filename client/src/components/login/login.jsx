import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Define the backend base URL (remove if using Vite proxy)
const API_BASE_URL = 'https://vaanisetu-scsr.onrender.com';

const LoginSignupPage = () => {
  const navigate = useNavigate();

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      color: 'black'
    },
    formContainer: {
      background: 'rgba(255, 255, 255, 0.95)',
      padding: '40px',
      borderRadius: '20px',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
      width: '100%',
      maxWidth: '450px',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      color: 'black'
    },
    header: {
      textAlign: 'center',
      marginBottom: '30px'
    },
    title: {
      fontSize: '2.5em',
      margin: '0 0 10px 0',
      background: 'linear-gradient(135deg, #667eea, #764ba2)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text'
    },
    subtitle: {
      color: '#666',
      fontSize: '1.1em',
      margin: 0
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      color: 'black'
    },
    inputGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      color: 'black'
    },
    label: {
      fontSize: '1.1em',
      fontWeight: '600',
      color: 'black'
    },
    input: {
      padding: '15px',
      border: '2px solid #e1e5e9',
      borderRadius: '12px',
      fontSize: '1em',
      transition: 'all 0.3s ease',
      outline: 'none',
      background: '#f8f9fa',
      color: 'black'
    },
    select: {
      padding: '15px',
      border: '2px solid #e1e5e9',
      borderRadius: '12px',
      fontSize: '1em',
      transition: 'all 0.3s ease',
      outline: 'none',
      background: '#f8f9fa',
      cursor: 'pointer',
      color: 'black'
    },
    submitButton: {
      padding: '18px',
      background: 'linear-gradient(135deg, #667eea, #764ba2)',
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      fontSize: '1.2em',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      marginTop: '10px',
      transform: 'translateY(0)',
      boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
    },
    submitButtonLoading: {
      opacity: '0.7',
      cursor: 'not-allowed',
      transform: 'translateY(1px)'
    },
    message: {
      padding: '15px',
      borderRadius: '12px',
      textAlign: 'center',
      fontSize: '1.1em',
      fontWeight: '500',
      marginTop: '20px'
    },
    successMessage: {
      background: 'linear-gradient(135deg, #4facfe, #00f2fe)',
      color: 'white'
    },
    errorMessage: {
      background: 'linear-gradient(135deg, #ff6b6b, #feca57)',
      color: 'white'
    },
    toggle: {
      textAlign: 'center',
      marginTop: '25px',
      fontSize: '1.1em',
      color: '#666'
    },
    toggleButton: {
      background: 'none',
      border: 'none',
      color: '#667eea',
      fontSize: '1.1em',
      fontWeight: '600',
      cursor: 'pointer',
      textDecoration: 'underline',
      transition: 'color 0.3s ease'
    }
  };

  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      input:focus, select:focus {
        border-color: #667eea !important;
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1) !important;
        transform: translateY(-1px) !important;
      }
      
      button[type="submit"]:hover:not(:disabled) {
        transform: translateY(-2px) !important;
        box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6) !important;
      }
      
      button[type="button"]:hover {
        color: #764ba2 !important;
      }
      
      select:invalid {
        color: #999 !important;
      }
    `;
    document.head.appendChild(styleElement);
    return () => document.head.removeChild(styleElement);
  }, []);

  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    language: '',
    level: '',
    duration: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setMessage('Email and password are required. 😕');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setMessage('Please provide a valid email address. 📧');
      return false;
    }
    if (!isLogin && (!formData.language || !formData.level || !formData.duration)) {
      setMessage('Please fill all fields for signup. 😕');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      if (isLogin) {
        const response = await axios.post(`${API_BASE_URL}/api/users/login`, {
          email: formData.email,
          password: formData.password
        });

        setMessage(response.data.message || 'Login successful! 🎉');
        localStorage.setItem('user', JSON.stringify(response.data.data));
        setTimeout(() => {
          navigate('/home');
        }, 1500);
      } else {
        const userData = {
          email: formData.email,
          pass: formData.password,
          lang: formData.language,
          level: formData.level,
          duration: formData.duration,
          myrank: 'Beginner',
          quiz: {
            score: 0,
            questions: [{ options: [] }]
          },
          flashcards: [{}],
          aiteacher: {
            usertrans: [[]],
            aitrans: [[]],
            ai: {
              feedbackScore: 0,
              sessionsCompleted: 0,
              preferredTone: ''
            }
          }
        };

        const response = await axios.post(`${API_BASE_URL}/api/users/create`, userData);

        setMessage(response.data.message || 'Account created successfully! 🎉');
        localStorage.setItem('user', JSON.stringify(response.data.data));
        setTimeout(() => {
          navigate('/home');
        }, 1500);
      }
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
        error.response?.data?.error ||
        'Could not connect to the server. Please check if the server is running. 🔄'
      );
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setMessage('');
    setFormData({
      email: '',
      password: '',
      language: '',
      level: '',
      duration: ''
    });
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <div style={styles.header}>
          <h1 style={styles.title}>
            {isLogin ? '👋 Welcome Back!' : '🚀 Join Us!'}
          </h1>
          <p style={styles.subtitle}>
            {isLogin ? 'Sign in to continue your learning journey' : 'Create your account and start learning'}
          </p>
        </div>

        <form style={styles.form} onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>📧 Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              style={styles.input}
              placeholder="your@email.com"
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>🔒 Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              style={styles.input}
              placeholder="Enter your password"
            />
          </div>

          {!isLogin && (
            <>
              <div style={styles.inputGroup}>
                <label style={styles.label}>🌍 Language</label>
                <select
                  name="language"
                  value={formData.language}
                  onChange={handleInputChange}
                  required
                  style={styles.select}
                >
                  <option value="" disabled>Select a language</option>
                  <option value="english">English</option>
                  <option value="hindi">Hindi</option>
                  <option value="bengali">Bengali</option>
                  <option value="tamil">Tamil</option>
                  <option value="telugu">Telugu</option>
                  <option value="marathi">Marathi</option>
                  <option value="gujarati">Gujarati</option>
                  <option value="kannada">Kannada</option>
                  <option value="malayalam">Malayalam</option>
                </select>
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>📊 Level</label>
                <select
                  name="level"
                  value={formData.level}
                  onChange={handleInputChange}
                  required
                  style={styles.select}
                >
                  <option value="" disabled>Select your level</option>
                  <option value="beginner">🌱 Beginner</option>
                  <option value="intermediate">🌿 Intermediate</option>
                  <option value="advanced">🌳 Advanced</option>
                  <option value="expert">🏆 Expert</option>
                </select>
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>📅 Learning Timeline</label>
                <select
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  required
                  style={styles.select}
                >
                  <option value="" disabled>In how many days do you want to finish learning?</option>
                  <option value="7days">⚡ 7 days (Intensive)</option>
                  <option value="15days">🔥 15 days (Fast Track)</option>
                  <option value="30days">💪 30 days (Standard)</option>
                  <option value="60days">🎯 60 days (Comfortable)</option>
                  <option value="90days">🌱 90 days (Relaxed)</option>
                  <option value="6months">📚 6 months (Comprehensive)</option>
                </select>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.submitButton,
              ...(loading ? styles.submitButtonLoading : {})
            }}
          >
            {loading ? '⏳ Processing...' : (isLogin ? '🎯 Sign In' : '✨ Create Account')}
          </button>
        </form>

        {message && (
          <div style={{
            ...styles.message,
            ...(message.includes('successful') ? styles.successMessage : styles.errorMessage)
          }}>
            {message}
          </div>
        )}

        <div style={styles.toggle}>
          <p>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              type="button"
              onClick={toggleMode}
              style={styles.toggleButton}
            >
              {isLogin ? '🌟 Sign Up' : '🏠 Sign In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginSignupPage;
