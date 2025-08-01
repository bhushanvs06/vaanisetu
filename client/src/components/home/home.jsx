import React, { useState, useEffect, Component } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import FlashcardsApp from '../flash/flashcards'
import Leaderboard from '../leaderboard/leader'
import Quiz from '../quiz/quiz'
import SarvamAIInterface from '../ai_teacher/aiteacher'
import Reel from '../reels/reel'
import { useNavigate } from 'react-router-dom';
// Error Boundary Component
const url = 'https://vaanisetu-scsr.onrender.com'
class ErrorBoundary extends Component {
  state = { hasError: false, errorMessage: '' };

  static getDerivedStateFromError(error) {
    return { hasError: true, errorMessage: error.message };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error">
          <h3>Oops, something went wrong!</h3>
          <p>{this.state.errorMessage}</p>
          <p>Please try refreshing the page or contact support.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

const Dashboard = () => {
  const navigate = useNavigate()
  const [activeSection, setActiveSection] = useState('Home');
  const [user, setUser] = useState(null);
  const [progressData, setProgressData] = useState([]);
  const [rankingData, setRankingData] = useState([]);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Assume email is available (e.g., from auth context). Replace with dynamic email if needed.
  const userEmail = 'test123@gmail.com';

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch user data
        const userResponse = await axios.get(url,`/api/user/${userEmail}`);
        setUser(userResponse.data.data);

        // Fetch progress data
        const progressResponse = await axios.get(url,`/api/progress/${userEmail}`);
        setProgressData(progressResponse.data.data);

        // Fetch ranking data
        const rankingResponse = await axios.get(url,`/api/rankings/${userEmail}`);
        setRankingData(rankingResponse.data.data);

        // Fetch conversation history
        const conversationResponse = await axios.get(url,`/api/conversations/${userEmail}`);
        setConversationHistory(conversationResponse.data.data);

        // Fetch pie chart data
        const pieResponse = await axios.get(url,`/api/pie-data/${userEmail}`);
        setPieData(pieResponse.data.data);

        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch data from server');
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleNavigation = (section) => {
    setActiveSection(section);
  };

  const handleLogout = () => {
    navigate('/')
    alert('Logging out...');
  };

  const handleStartLearning = () => {
    alert('Starting learning session...');
  };

  const renderMainContent = () => {
    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">{error}</div>;

    switch (activeSection) {
      case 'Rank':
        return <Leaderboard/>;
      case 'Ai Teacher':
        return <SarvamAIInterface/>;
      case 'Flashcards':
        return <FlashcardsApp/>;
      case 'Quiz':
        return <Quiz/>;
      case 'Reels':
        return <Reel/>
      default:
        return (
          <div className="content-grid">
            <ErrorBoundary>
              <HomeSection user={user} progressData={progressData} pieData={pieData} />
            </ErrorBoundary>
          </div>
        );
    }
  };

  return (
    <div className="dashboard-container">
      <style>{`
        * {
          margin: 0;
          padding: 0;
        //   box-sizing: border-box;
        }

        body {
          font-family: 'Poppins', sans-serif;
          background: linear-gradient(135deg, #F8F9FA 0%, #D6E9FA 100%);
          min-height: 100vh;
        }

        .dashboard-container {
          display: flex;
          min-height: 100vh;
        }

        .loading, .error {
          text-align: center;
          padding: 50px;
          font-size: 18px;
          color: #007BFF;
          margin-left: 220px;
          width: calc(100% - 220px);
        }

        .error h3 {
          color: #FF5733;
          margin-bottom: 10px;
        }

        /* LEFT SIDEBAR */
        .sidebar {
          width: 220px;
          background: linear-gradient(180deg, #0F2027 0%, #2C5364 50%, #00BF8F 100%);

          color: white;
          padding: 20px 0;
          position: fixed;
          height: 100vh;
          left: 0;
          top: 0;
          z-index: 1000;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          box-shadow: 4px 0 20px rgba(0, 0, 0, 0.15);
          transition: all 0.3s ease;
        }

        .sidebar-title {
          font-size: 28px;
          font-weight: 900;
          text-align: center;
          margin-bottom: 30px;
          padding: 0 20px;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
          letter-spacing: 2px;
          background: linear-gradient(45deg, #FFC107, #FF5733);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .nav-buttons {
          flex: 1;
          padding: 0 20px;
        }

        .nav-button {
          display: block;
          width: 100%;
          padding: 14px 18px;
          margin-bottom: 12px;
          background: rgba(255, 255, 255, 0.15);
          color: white;
          border: 2px solid #007BFF;
          border-radius: 25px;
          cursor: pointer;
          font-size: 16px;
          font-weight: 600;
          transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
          text-align: left;
          backdrop-filter: blur(10px);
        }

        .nav-button:hover,
        .nav-button.active {
          background: linear-gradient(45deg, #007BFF, #28A745);
          transform: translateX(10px) rotate(2deg);
          box-shadow: 0 10px 25px rgba(0, 123, 255, 0.4);
          border-color: #28A745;
        }

        .logout-button {
          margin: 20px;
          padding: 14px 18px;
          background: rgba(255, 255, 255, 0.15);
          color: white;
          border: 2px solid #FF5733;
          border-radius: 25px;
          cursor: pointer;
          font-size: 16px;
          font-weight: 600;
          transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
          backdrop-filter: blur(10px);
        }

        .logout-button:hover {
          background: linear-gradient(45deg, #FF5733, #FFC107);
          transform: scale(1.08) rotate(-2deg);
          box-shadow: 0 10px 25px rgba(255, 87, 51, 0.4);
        }

        /* MAIN CONTENT */
        .main-content {
          margin-left: 220px;
          width: calc(100% - 220px);
          padding: 0;
        }

        /* TOP BAR */
        .top-bar {
          background: linear-gradient(180deg, #0F2027 0%, #2C5364 50%, #00BF8F 100%);

          color: white;
          padding: 25px 35px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
          backdrop-filter: blur(20px);
        }

        .profile-section {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .profile-image {
          width: 70px;
          height: 70px;
          border-radius: 50%;
          background: linear-gradient(180deg, #0F2027 0%, #2C5364 50%, #00BF8F 100%);

          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          font-weight: bold;
          color: white;
          border: 4px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
          transition: transform 0.3s ease;
        }

        .profile-image:hover {
          transform: scale(1.1) rotate(5deg);
        }

        .greeting-section h2 {
          font-size: 28px;
          margin-bottom: 5px;
        }

        .level-badge {
          background: linear-gradient(45deg, #28A745, #007BFF);
          color: white;
          padding: 6px 16px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: bold;
          box-shadow: 0 4px 15px rgba(40, 167, 69, 0.3);
        }

        .top-right {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .rank-info {
          text-align: right;
        }

        .rank-info h3 {
          font-size: 18px;
          margin-bottom: 5px;
        }

        .rank-info p {
          font-size: 14px;
          opacity: 0.9;
        }

        .start-learning-btn {
          background: linear-gradient(45deg, #FFC107, #FF5733);
          color: #fff;
          border: none;
          padding: 14px 28px;
          border-radius: 25px;
          font-size: 16px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
          box-shadow: 0 6px 20px rgba(255, 193, 7, 0.4);
        }

        .start-learning-btn:hover {
          transform: translateY(-3px) scale(1.1);
          box-shadow: 0 12px 35px rgba(255, 193, 7, 0.6);
          background: linear-gradient(45deg, #FF5733, #FFC107);
        }

        /* CONTENT GRID */
        .content-grid {
          padding: 35px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          grid-template-rows: auto auto;
          gap: 30px;
          max-width: 1400px;
          margin: 0 auto;
          background: linear-gradient(0deg, #0F2027 0%, #2C5364 50%, #00BF8F 100%);

        }

        .card {
          background: rgba(255, 255, 255, 0.95);
          border-radius: 20px;
          padding: 30px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(20px);
          transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }

        .card:hover {
          transform: translateY(-8px) rotate(1deg);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
          background: rgba(255, 255, 255, 1);
        }

        .card-title {
          font-size: 22px;
          font-weight: 800;
          background: linear-gradient(45deg, #007BFF, #28A745);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 25px;
          padding-bottom: 15px;
          border-bottom: 3px solid transparent;
          border-image: linear-gradient(45deg, #007BFF, #28A745) 1;
        }

        /* PROGRESS CHART */
        .chart-container {
          height: 300px;
          width: 100%;
        }

        /* AI FEEDBACK CARD */
        .feedback-stats {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 20px;
        }

        .stat-item {
          text-align: center;
          padding: 20px;
          background: linear-gradient(135deg, #007BFF, #28A745);
          color: white;
          border-radius: 15px;
          box-shadow: 0 8px 25px rgba(0, 123, 255, 0.3);
          transition: transform 0.3s ease;
        }

        .stat-item:hover {
          transform: scale(1.1) rotate(3deg);
        }

        .stat-value {
          font-size: 28px;
          font-weight: bold;
          margin-bottom: 5px;
        }

        .stat-label {
          font-size: 14px;
          opacity: 0.9;
        }

        .feedback-details {
          background: linear-gradient(135deg, #F8F9FA, #E9ECEF);
          padding: 25px;
          border-radius: 15px;
          border-left: 5px solid #FFC107;
          box-shadow: inset 0 2px 10px rgba(0, 0, 0, 0.05);
        }

        .feedback-details h4 {
          color: #333;
          margin-bottom: 10px;
        }

        .feedback-details p {
          color: #666;
          line-height: 1.6;
        }

        /* ADDITIONAL CARDS */
        .feature-card {
          text-align: center;
          padding: 50px 25px;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
          border: 2px dashed #28A745;
          border-radius: 20px;
          color: #007BFF;
          backdrop-filter: blur(10px);
        }

        /* RANK SECTION STYLES */
        .rank-section {
          padding: 35px;
        }

        .leaderboard {
          background: rgba(255, 255, 255, 0.95);
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
        }

        .leaderboard-header {
          background: linear-gradient(135deg, #007BFF, #28A745);
          color: white;
          padding: 25px;
          text-align: center;
        }

        .leaderboard-header h2 {
          font-size: 28px;
          margin-bottom: 10px;
        }

        .rank-item {
          display: flex;
          align-items: center;
          padding: 20px 25px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
        }

        .rank-item:hover {
          background: rgba(0, 123, 255, 0.05);
          transform: translateX(5px);
        }

        .rank-item.current-user {
          background: linear-gradient(135deg, rgba(40, 167, 69, 0.1), rgba(0, 123, 255, 0.1));
          border-left: 5px solid #FFC107;
        }

        .rank-number {
          font-size: 24px;
          font-weight: bold;
          color: #007BFF;
          width: 60px;
        }

        .rank-avatar {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: linear-gradient(45deg, #FF5733, #FFC107);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          margin: 0 20px;
          transition: transform 0.3s ease;
        }

        .rank-avatar:hover {
          transform: scale(1.1) rotate(5deg);
        }

        .rank-info {
          flex: 1;
        }

        .rank-name {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 5px;
        }

        .rank-level {
          font-size: 14px;
          color: #666;
        }

        .rank-score {
          font-size: 20px;
          font-weight: bold;
          color: #28A745;
        }

        /* AI TEACHER SECTION STYLES */
        .ai-teacher-section {
          padding: 35px;
        }

        .conversation-container {
          background: rgba(255, 255, 255, 0.95);
          border-radius: 20px;
          height: 600px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
        }

        .chat-header {
          background: linear-gradient(135deg, #28A745, #007BFF);
          color: white;
          padding: 20px;
          text-align: center;
        }

        .chat-messages {
          flex: 1;
          padding: 20px;
          overflow-y: auto;
          background: linear-gradient(135deg, #F8F9FA, #E9ECEF);
        }

        .message {
          margin-bottom: 20px;
          padding: 15px 20px;
          border-radius: 20px;
          max-width: 80%;
          animation: slideIn 0.5s ease;
        }

        .message.user {
          background: linear-gradient(45deg, #007BFF, #28A745);
          color: white;
          margin-left: auto;
          border-bottom-right-radius: 5px;
        }

        .message.ai {
          background: linear-gradient(45deg, #FFC107, #FF5733);
          color: white;
          margin-right: auto;
          border-bottom-left-radius: 5px;
        }

        .message-text {
          font-size: 16px;
          margin-bottom: 8px;
        }

        .message-meta {
          font-size: 12px;
          opacity: 0.8;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .score-badge {
          background: rgba(255, 255, 255, 0.2);
          padding: 2px 8px;
          border-radius: 10px;
          font-weight: bold;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .feature-card h3 {
          margin-bottom: 10px;
          color: #007BFF;
        }

        /* RESPONSIVE DESIGN */
        @media (max-width: 768px) {
          .sidebar {
            width: 100%;
            height: auto;
            position: relative;
            flex-direction: row;
            justify-content: space-around;
            padding: 10px;
          }

          .sidebar-title {
            display: none;
          }

          .nav-buttons {
            display: flex;
            gap: 10px;
            padding: 0;
            flex: 1;
          }

          .nav-button {
            margin-bottom: 0;
            padding: 8px 12px;
            font-size: 14px;
          }

          .logout-button {
            margin: 0;
            padding: 8px 12px;
          }

          .main-content {
            margin-left: 0;
            width: 100%;
          }

          .top-bar {
            flex-direction: column;
            gap: 15px;
            text-align: center;
          }

          .top-right {
            flex-direction: column;
            gap: 10px;
          }

          .content-grid {
            grid-template-columns: 1fr;
            padding: 20px;
            gap: 20px;
          }

          .feedback-stats {
            grid-template-columns: 1fr;
            gap: 15px;
          }

          .rank-section, .ai-teacher-section {
            padding: 20px;
          }

          .loading, .error {
            margin-left: 0;
            width: 100%;
          }
        }

        @media (max-width: 480px) {
          .nav-buttons {
            flex-wrap: wrap;
          }

          .nav-button {
            font-size: 12px;
            padding: 6px 8px;
          }

          .card {
            padding: 20px;
          }

          .chart-container {
            height: 250px;
          }
        }
      `}</style>

      {/* LEFT SIDEBAR */}
      <div className="sidebar">
        <div>
          <div className="sidebar-title">vaanisetu</div>
          <div className="nav-buttons">
            {['Home', 'Rank', 'Ai Teacher', 'Quiz', 'Flashcards', 'Reels'].map((item) => (
              <button
                key={item}
                className={`nav-button ${activeSection === item ? 'active' : ''}`}
                onClick={() => handleNavigation(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
        <button className="logout-button" onClick={handleLogout}>
          Log Out
        </button>
      </div>

      {/* MAIN CONTENT */}
      <div className="main-content">
        {/* TOP BAR */}
        {user && (
          <div className="top-bar">
            <div className="profile-section">
              <div className="profile-image">
                {user.username ? user.username.charAt(0) : ''}
              </div>
              <div className="greeting-section">
                <h2>Hi, {user.username || 'User'}</h2>
                <span className="level-badge">{user.level || 'N/A'}</span>
              </div>
            </div>
            <div className="top-right">
              <div className="rank-info">
                <h3>Rank</h3>
                <p>{user.lang || 'N/A'} - #{user.myrank || 'N/A'}</p>
              </div>
              <button className="start-learning-btn" onClick={handleStartLearning}>
                Start Learning
              </button>
            </div>
          </div>
        )}

        {/* CONTENT */}
        {renderMainContent()}
      </div>
    </div>
  );
};

// Home Section Component
const HomeSection = ({ user, progressData, pieData }) => {
  // Fallback values for user data
  const safeUser = user || {};
  const safeAiteacher = safeUser.aiteacher || {};
  const safeAi = safeAiteacher.ai || { feedbackScore: 0, sessionsCompleted: 0, preferredTone: '' };
  const safeLang = safeUser.lang || 'N/A';
  const safeDuration = safeUser.duration || '0 days';
  const safeQuizScore = safeUser.quiz?.score || 0;
  const safeFlashcards = safeUser.flashcards || [];

  console.log(safeQuizScore)
  return (
    <>
      {/* PROGRESS CHART CARD */}
      <div className="card">
        <div className="card-title">Progress Score Graph</div>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={progressData.length ? progressData : [{ level: 'No Data', score: safeAiteacher.ai.feedbackScore, sessions: safeAiteacher.ai.sessionsCompleted, accuracy: 6 }]}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 123, 255, 0.1)" />
              <XAxis dataKey="level" tick={{ fill: '#007BFF' }} />
              <YAxis tick={{ fill: '#007BFF' }} />
              <Tooltip
                contentStyle={{
                  background: 'linear-gradient(45deg, #007BFF, #28A745)',
                  border: 'none',
                  borderRadius: '10px',
                  color: 'white'
                }}
              />
              <Legend />
              <Bar dataKey="score" fill="#007BFF" name="Score" radius={[4, 4, 0, 0]} />
              <Bar dataKey="accuracy" fill="#28A745" name="Accuracy" radius={[4, 4, 0, 0]} />
              <Bar dataKey="sessions" fill="#FF5733" name="Sessions" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI FEEDBACK CARD */}
      <div className="card">
        <div className="card-title">AI Feedback</div>
        <div className="feedback-stats">
          <div className="stat-item">
            <div className="stat-value">{safeAi.feedbackScore}</div>
            <div className="stat-label">Feedback Score</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{safeAi.sessionsCompleted}</div>
            <div className="stat-label">Sessions Completed</div>
          </div>
        </div>
        <div className="feedback-details">
          <h4>Learning Insights</h4>
          <p><strong>Preferred Tone:</strong> {safeAi.preferredTone || 'N/A'}</p>
          <p>Your AI teacher is providing personalized feedback to help you improve your {safeLang} skills. Keep up the great work with consistent practice!</p>
        </div>
      </div>

      {/* SKILL BREAKDOWN CHART */}
      <div className="card">
        <div className="card-title">Skill Breakdown</div>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                dataKey="value"
                data={pieData.length ? pieData : [{ name: 'No Data', value: 100, color: '#ccc' }]}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {(pieData.length ? pieData : [{ name: 'No Data', value: 100, color: '#ccc' }]).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color || '#ccc'} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* RECENT ACTIVITY CARD */}
      <div className="card feature-card">
        <h3>Recent Activity</h3>
        <p>Learning Duration: {safeDuration}</p>
        <p>Last Quiz Score: {safeQuizScore}%</p>
        <p>Flashcards: {safeFlashcards.length} words mastered</p>
      </div>
    </>
  );
};

// Rank Section Component
const RankSection = ({ rankingData, currentUser }) => {
  const safeUser = currentUser || {};
  const safeLang = safeUser.lang || 'N/A';

  return (
    <div className="rank-section">
      <div className="leaderboard">
        <div className="leaderboard-header">
          <h2>🏆 Global Leaderboard</h2>
          <p>Compete with learners worldwide in {safeLang}</p>
        </div>
        {rankingData.length ? (
          rankingData.map((player) => (
            <div
              key={player.rank}
              className={`rank-item ${player.isCurrentUser ? 'current-user' : ''}`}
            >
              <div className="rank-number">#{player.rank}</div>
              <div className="rank-avatar">{player.name?.charAt(0) || '?'}</div>
              <div className="rank-info">
                <div className="rank-name">
                  {player.name} {player.isCurrentUser && '(You)'}
                </div>
                <div className="rank-level">{player.level || 'N/A'} • {player.streak || 0} day streak</div>
              </div>
              <div className="rank-score">{player.score?.toLocaleString() || 0}</div>
            </div>
          ))
        ) : (
          <div className="rank-item">No ranking data available</div>
        )}
      </div>
    </div>
  );
};

// AI Teacher Section Component
const AITeacherSection = ({ conversationHistory, user }) => {
  const safeUser = user || {};
  const safeLang = safeUser.lang || 'N/A';

  return (
    <div className="ai-teacher-section">
      <div className="conversation-container">
        <div className="chat-header">
          <h2>🤖 AI Language Teacher</h2>
          <p>Practice {safeLang} with your personal AI tutor</p>
        </div>
        <div className="chat-messages">
          {conversationHistory.length ? (
            conversationHistory.map((message) => (
              <div key={message.id}>
                <div className="message user">
                  <div className="message-text">{message.user || 'N/A'}</div>
                  <div className="message-meta">
                    <span>{message.timestamp || 'N/A'}</span>
                  </div>
                </div>
                <div className="message ai">
                  <div className="message-text">{message.ai || 'N/A'}</div>
                  <div className="message-meta">
                    <span>AI Teacher</span>
                    <span className="score-badge">Score: {message.score || 0}/10</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="message">No conversation history available</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
