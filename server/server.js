const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');

dotenv.config();

const app = express();

// Configure CORS to allow requests from frontend
app.use(cors({
  origin: ['http://localhost:5173'],
  methods: ['GET', 'POST'],
  credentials: true
}));
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('✅ MongoDB connected');
}).catch(err => {
  console.error('❌ MongoDB connection error:', err);
});

// User Schema (matches provided MongoDB sample)
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  pass: { type: String, required: true },
  level: { type: String },
  lang: { type: String },
  duration: { type: String },
  myrank: { type: String, default: 'Beginner' },
  quiz: {
    score: { type: Number, default: 0 },
    questions: [{ options: [String], _id: mongoose.Schema.Types.ObjectId }]
  },
  flashcards: [{
    orgWord: String,
    engTranslation: String,
    _id: mongoose.Schema.Types.ObjectId
  }],
  aiteacher: {
    usertrans: { type: [[String]], default: [[]] },
    aitrans: { type: [[String]], default: [[]] },
    ai: {
      feedbackScore: { type: Number, default: 0 },
      sessionsCompleted: { type: Number, default: 0 },
      preferredTone: { type: String, default: '' }
    }
  }
}, { versionKey: '__v' });

const User = mongoose.model('User', userSchema);

// Progress Schema
const progressSchema = new mongoose.Schema({
  email: { type: String, required: true },
  level: { type: String, required: true },
  score: { type: Number, required: true },
  sessions: { type: Number, required: true },
  accuracy: { type: Number, required: true }
});
const Progress = mongoose.model('Progress', progressSchema);

// Ranking Schema
const rankingSchema = new mongoose.Schema({
  email: { type: String, required: true },
  score: { type: Number, required: true },
  level: { type: String, required: true },
  streak: { type: Number, required: true }
});
const Ranking = mongoose.model('Ranking', rankingSchema);

// Conversation Schema
const conversationSchema = new mongoose.Schema({
  email: { type: String, required: true },
  user: { type: String, required: true },
  ai: { type: String, required: true },
  timestamp: { type: String, required: true },
  score: { type: Number, required: true }
});
const Conversation = mongoose.model('Conversation', conversationSchema);

// PieData Schema (for skill breakdown)
const pieDataSchema = new mongoose.Schema({
  email: { type: String, required: true },
  name: { type: String, required: true },
  value: { type: Number, required: true },
  color: { type: String, required: true }
});
const PieData = mongoose.model('PieData', pieDataSchema);

// Create a New User
app.post('/api/users/create', async (req, res) => {
  try {
    const { email, pass, lang, level, duration, myrank, aiteacher } = req.body;

    // Validate required fields
    if (!email || !pass || !lang || !level || !duration) {
      return res.status(400).json({ 
        message: 'Missing required fields', 
        error: 'Email, password, language, level, and duration are required' 
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        message: 'Invalid email format', 
        error: 'Please provide a valid email address' 
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        message: 'Email already registered', 
        error: 'This email is already in use' 
      });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(pass, saltRounds);

    const user = new User({
      email,
      pass: hashedPassword,
      lang,
      level,
      duration,
      myrank: myrank || 'Beginner',
      quiz: { score: 0, questions: [{ options: [], _id: new mongoose.Types.ObjectId() }] },
      flashcards: [{ _id: new mongoose.Types.ObjectId() }],
      aiteacher: {
        usertrans: aiteacher?.usertrans || [[]],
        aitrans: aiteacher?.aitrans || [[]],
        ai: {
          feedbackScore: aiteacher?.ai?.feedbackScore || 0,
          sessionsCompleted: aiteacher?.ai?.sessionsCompleted || 0,
          preferredTone: aiteacher?.ai?.preferredTone || ''
        }
      }
    });

    const savedUser = await user.save();
    res.status(201).json({ 
      message: 'User created successfully', 
      data: { 
        email: savedUser.email, 
        id: savedUser._id,
        username: savedUser.email.split('@')[0]
      } 
    });
  } catch (err) {
    res.status(500).json({ 
      message: 'Error creating user', 
      error: err.message 
    });
  }
});

// Login User
app.post('/api/users/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Missing required fields', 
        error: 'Email and password are required' 
      });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ 
        message: 'Invalid email or password', 
        error: 'No account found with this email' 
      });
    }

    // Compare password with hashed password
    const isMatch = await bcrypt.compare(password, user.pass);
    if (!isMatch) {
      return res.status(401).json({ 
        message: 'Invalid email or password', 
        error: 'Incorrect password' 
      });
    }

    res.status(200).json({ 
      message: 'Login successful', 
      data: { 
        email: user.email, 
        id: user._id,
        username: user.email.split('@')[0]
      } 
    });
  } catch (err) {
    res.status(500).json({ 
      message: 'Error logging in', 
      error: err.message 
    });
  }
});

// Get User by Email
app.get('/api/user/:email', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email }).select('-pass');
    if (!user) {
      return res.status(404).json({ 
        message: 'User not found', 
        error: 'No user exists with this email' 
      });
    }
    res.status(200).json({ 
      message: 'User retrieved successfully', 
      data: {
        ...user._doc,
        username: user.email.split('@')[0],
        aiteacher: {
          usertrans: user.aiteacher?.usertrans || [[]],
          aitrans: user.aiteacher?.aitrans || [[]],
          ai: {
            feedbackScore: user.aiteacher?.ai?.feedbackScore || 0,
            sessionsCompleted: user.aiteacher?.ai?.sessionsCompleted || 0,
            preferredTone: user.aiteacher?.ai?.preferredTone || ''
          }
        }
      }
    });
  } catch (err) {
    res.status(500).json({ 
      message: 'Error fetching user', 
      error: err.message 
    });
  }
});

// Get Progress Data by Email
app.get('/api/progress/:email', async (req, res) => {
  try {
    const progress = await Progress.find({ email: req.params.email });
    res.status(200).json({ 
      message: 'Progress data retrieved successfully', 
      data: progress 
    });
  } catch (err) {
    res.status(500).json({ 
      message: 'Error fetching progress data', 
      error: err.message 
    });
  }
});

// Get Ranking Data
app.get('/api/rankings/:email', async (req, res) => {
  try {
    const rankings = await Ranking.find().sort({ score: -1 });
    const formattedRankings = rankings.map((r, index) => ({
      rank: index + 1,
      name: r.email.split('@')[0],
      score: r.score,
      level: r.level,
      streak: r.streak,
      isCurrentUser: r.email === req.params.email
    }));
    res.status(200).json({ 
      message: 'Rankings retrieved successfully', 
      data: formattedRankings 
    });
  } catch (err) {
    res.status(500).json({ 
      message: 'Error fetching rankings', 
      error: err.message 
    });
  }
});

// Get Conversation History by Email
app.get('/api/conversations/:email', async (req, res) => {
  try {
    const conversations = await Conversation.find({ email: req.params.email });
    const formattedConversations = conversations.map((c, index) => ({
      id: index + 1,
      user: c.user,
      ai: c.ai,
      timestamp: c.timestamp,
      score: c.score
    }));
    res.status(200).json({ 
      message: 'Conversation history retrieved successfully', 
      data: formattedConversations 
    });
  } catch (err) {
    res.status(500).json({ 
      message: 'Error fetching conversation history', 
      error: err.message 
    });
  }
});

// Get Pie Chart Data by Email
app.get('/api/pie-data/:email', async (req, res) => {
  try {
    const pieData = await PieData.find({ email: req.params.email });
    if (pieData.length === 0) {
      // Fallback to default pie data if none exists
      const defaultPieData = [
        { name: 'Vocabulary', value: 35, color: '#FF5733' },
        { name: 'Grammar', value: 25, color: '#FFC107' },
        { name: 'Pronunciation', value: 20, color: '#28A745' },
        { name: 'Conversation', value: 20, color: '#007BFF' }
      ];
      return res.status(200).json({ 
        message: 'Default pie data retrieved', 
        data: defaultPieData 
      });
    }
    res.status(200).json({ 
      message: 'Pie data retrieved successfully', 
      data: pieData 
    });
  } catch (err) {
    res.status(500).json({ 
      message: 'Error fetching pie data', 
      error: err.message 
    });
  }
});

//ai teacher

const axios = require('axios');
const SARVAM_API_KEY = 'sk_xxhi7er4_Dl7QdC6st7TpL3MqDIurEDoq'

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date().toISOString() });
});

// Sarvam AI Chat endpoint
const SARVAM_API_URL = 'https://api.sarvam.ai/v1/chat/completions';
// Sarvam AI Chat endpoint
app.post('/api/sarvam/chat', async (req, res) => {
  try {
    const { model, messages, temperature, max_completion_tokens } = req.body;

    const response = await axios.post(
      SARVAM_API_URL,
      {
        model: model || 'sarvam-m',
        messages,
        temperature: temperature || 0.7,
        max_completion_tokens: max_completion_tokens || 100,
      },
      {
        headers: {
          'Authorization': `Bearer ${SARVAM_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error('Sarvam API error:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: 'Failed to process request',
      details: error.response?.data || error.message,
    });
  }
});

// Sarvam AI Speech-to-Text endpoint (Kannada)
app.post('/api/sarvam/speech-to-text', async (req, res) => {
  try {
    const audioBuffer = req.body.audio; // Expecting base64 audio data
    console.log('STT request received, audio size:', audioBuffer.length);

    const response = await axios.post(
      'https://api.sarvam.ai/speech-to-text',
      { audio: audioBuffer, model: 'saarika:v2', language_code: 'kn-IN' },
      {
        headers: {
          'Content-Type': 'application/json',
          'API-Subscription-Key': process.env.SARVAM_API_KEY,
        },
      }
    );

    console.log('STT response:', response.data);
    res.json(response.data);
  } catch (error) {
    console.error('STT error:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: 'Failed to process speech-to-text',
      details: error.response?.data || error.message,
    });
  }
});

// Sarvam AI Text-to-Speech endpoint
app.post('/api/sarvam/text-to-speech', async (req, res) => {
  try {
    const { text } = req.body;
    console.log('TTS request:', text);

    const response = await axios.post(
      'https://api.sarvam.ai/text-to-speech',
      {
        inputs: [text],
        target_language_code: 'kn-IN',
        speaker: 'meera',
        pitch: 0,
        pace: 1.0,
        loudness: 1.0,
        speech_sample_rate: 22050,
        enable_preprocessing: true,
        model: 'bulbul:v2',
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'API-Subscription-Key': process.env.SARVAM_API_KEY,
        },
      }
    );

    console.log('TTS response received, audio length:', response.data.audio?.length);
    res.json(response.data);
  } catch (error) {
    console.error('TTS error:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: 'Failed to process text-to-speech',
      details: error.response?.data || error.message,
    });
  }
});

// Server Listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});