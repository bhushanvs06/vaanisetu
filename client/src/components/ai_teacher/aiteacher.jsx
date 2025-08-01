import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Mic, MicOff, FileText, Volume2 } from 'lucide-react';
import './SarvamAIInterface.css';

const SarvamAIInterface = () => {
  const [isListening, setIsListening] = useState(false);
  const [showCaptions, setShowCaptions] = useState(true);
  const [currentCaption, setCurrentCaption] = useState('');
  const [aiTranscript, setAiTranscript] = useState([]);
  const [userTranscript, setUserTranscript] = useState([]);
  const [wordMeanings, setWordMeanings] = useState([]);
  const [isAISpeaking, setIsAISpeaking] = useState(false);
  const recognition = useRef(null);
  const aiTranscriptRef = useRef(null);
  const wordMeaningsRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognition.current = new SpeechRecognition();
      recognition.current.continuous = true;
      recognition.current.interimResults = false;
      recognition.current.lang = 'hi-IN';
      recognition.current.onresult = (event) => {
        const transcript = event.results[event.results.length - 1][0].transcript;
        console.log('User speech:', transcript);
        handleUserSpeech(transcript);
      };
      recognition.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
    } else {
      console.error('SpeechRecognition API not supported');
    }
  }, []);

  // Handle user speech input
  const handleUserSpeech = async (transcript) => {
    setUserTranscript((prev) => [...prev, transcript]);
    generateAIResponse(transcript);
  };

  // Extract Hindi words for mock translation
  const extractHindiWords = (text) => {
    const mockWords = ['नमस्ते', 'आप', 'कैसे', 'हैं', 'अच्छा'];
    return text.split(' ').filter((word) => mockWords.includes(word)).slice(0, 3);
  };

  // Mock word translations
  const translateWords = (words) => {
    return words.map((word) => ({
      orgWord: word,
      engTranslation: {
        'नमस्ते': 'Hello',
        'आप': 'You',
        'कैसे': 'How',
        'हैं': 'Are',
        'अच्छा': 'Good',
      }[word] || 'Translation not found',
    }));
  };

  // Simple Hindi to Latin transliteration
  const transliterateHindi = (text) => {
    const transliterationMap = {
      'नमस्ते': 'Namaste',
      'आप': 'Aap',
      'कैसे': 'Kaise',
      'हैं': 'Hain',
      'अच्छा': 'Accha',
    };
    let result = text;
    Object.keys(transliterationMap).forEach((hindi) => {
      result = result.replace(new RegExp(hindi, 'g'), transliterationMap[hindi]);
    });
    return result;
  };

  // Generate AI response
  const generateAIResponse = async (userInput) => {
    setIsAISpeaking(true);
    setCurrentCaption('प्रोसेसिंग...');
    const maxRetries = 3;
    let attempts = 0;
    while (attempts < maxRetries) {
      try {
        const response = await axios.post('http://localhost:5000/api/sarvam/chat', {
          model: 'sarvam-m',
          messages: [
            {
              role: 'system',
              content: 'आप एक दोस्ताना हिंदी मूल वक्ता हैं जो सामान्य बातचीत में शामिल हैं। पहले व्यक्ति में बोलें। केवल हिंदी में जवाब दें, दोस्ताना और गर्मजोशी भरे लहजे में।',
            },
            { role: 'user', content: userInput },
          ],
          temperature: 0.7,
          max_completion_tokens: 100,
        });
        const aiResponse = response.data.choices[0].message.content;
        let index = 0;
        const interval = setInterval(() => {
          setCurrentCaption(aiResponse.substring(0, index));
          index++;
          if (index > aiResponse.length) {
            clearInterval(interval);
            setAiTranscript((prev) => [...prev, aiResponse]);
            const words = extractHindiWords(aiResponse);
            if (words.length > 0) {
              const meanings = translateWords(words);
              setWordMeanings((prev) => [...prev, ...meanings]);
            }
            speakText(aiResponse, 'hi-IN', 'ai');
            setTimeout(() => {
              setCurrentCaption('');
              setIsAISpeaking(false);
            }, 2000);
          }
        }, 50);
        return;
      } catch (error) {
        attempts++;
        console.error(`Chat API error (attempt ${attempts}):`, error.response?.data || error.message);
        if (attempts === maxRetries) {
          setCurrentCaption('त्रुटि: जवाब उत्पन्न करने में विफल। कृपया पुनः प्रयास करें।');
          setTimeout(() => {
            setCurrentCaption('');
            setIsAISpeaking(false);
          }, 2000);
        }
      }
    }
  };

  // Speak text using Web Speech API
  const speakText = (text, lang, speaker) => {
    if ('speechSynthesis' in window) {
      synthRef.current.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = 0.8;
      utterance.volume = 1.0;
      const voices = synthRef.current.getVoices();
      console.log('Available voices:', voices.map((v) => ({ name: v.name, lang: v.lang })));
      let selectedVoice = voices.find((voice) => voice.lang === 'hi-IN' && voice.name.includes('Google')) || 
                         voices.find((voice) => voice.lang === 'hi-IN');
      let fallbackText = text;
      if (!selectedVoice && lang === 'hi-IN') {
        selectedVoice = voices.find((voice) => voice.lang === 'en-IN');
        if (!selectedVoice) {
          selectedVoice = voices.find((voice) => voice.lang.includes('en'));
        }
        fallbackText = transliterateHindi(text);
        console.log(`Hindi fallback text: ${fallbackText}`);
      }
      if (!selectedVoice) {
        selectedVoice = voices[0];
      }
      if (selectedVoice) {
        utterance.voice = selectedVoice;
        console.log(`Selected voice for ${lang}: ${selectedVoice.name}`);
      } else {
        console.warn(`No voice found for ${lang}, using default`);
      }
      utterance.text = fallbackText;
      utterance.onstart = () => {
        console.log(`${speaker} TTS started with voice: ${selectedVoice?.name || 'default'}`);
        if (speaker === 'ai') setIsAISpeaking(true);
      };
      utterance.onend = () => {
        console.log(`${speaker} TTS ended`);
        if (speaker === 'ai') setIsAISpeaking(false);
      };
      utterance.onerror = (e) => {
        console.error(`${speaker} TTS error:`, e);
        if (speaker === 'ai') setIsAISpeaking(false);
      };
      if (synthRef.current.paused) {
        synthRef.current.resume();
      }
      synthRef.current.speak(utterance);
    } else {
      console.error('Browser TTS not supported');
    }
  };

  // Load voices
  useEffect(() => {
    const loadVoices = () => {
      const voices = synthRef.current.getVoices();
      console.log('Voices loaded:', voices.map((v) => ({ name: v.name, lang: v.lang })));
    };
    synthRef.current.onvoiceschanged = loadVoices;
    loadVoices();
    return () => {
      synthRef.current.onvoiceschanged = null;
    };
  }, []);

  // Toggle microphone
  const toggleMicrophone = () => {
    if (isListening) {
      recognition.current?.stop();
      synthRef.current.cancel();
      setIsListening(false);
    } else {
      recognition.current?.start();
      setIsListening(true);
    }
  };

  // Toggle captions
  const toggleCaptions = () => setShowCaptions(!showCaptions);

  // Auto-scroll transcript areas
  useEffect(() => {
    if (aiTranscriptRef.current) {
      aiTranscriptRef.current.scrollTop = aiTranscriptRef.current.scrollHeight;
    }
    if (wordMeaningsRef.current) {
      wordMeaningsRef.current.scrollTop = wordMeaningsRef.current.scrollHeight;
    }
  }, [aiTranscript, wordMeanings]);

  return (
    <div className="sarvam-ai-container">
      <div className="main-container">
        <div className="transcript-section">
          <h3 className="section-title">बातचीत</h3>
          <div ref={aiTranscriptRef} className="transcript-box">
            {userTranscript.map((text, index) => (
              <div key={`user-${index}`} className="transcript-item user-item">
                <span className="user-label">आप:</span> {text}
              </div>
            ))}
            {aiTranscript.map((text, index) => (
              <div key={`ai-${index}`} className="transcript-item ai-item">
                <span className="ai-label">एआई:</span> {text}
              </div>
            ))}
            {userTranscript.length === 0 && aiTranscript.length === 0 && (
              <div className="placeholder-text">बातचीत यहाँ दिखाई देगी...</div>
            )}
          </div>
        </div>

        <div className="center-section">
          <div className="avatar-container">
            <div className={`avatar ${isAISpeaking ? 'avatar-speaking' : ''}`}>
              <span className="avatar-text">एआई</span>
              {isAISpeaking && <Volume2 className="speaking-icon" />}
            </div>
            <span className="avatar-label">सर्वम एआई</span>
          </div>
          <div className="caption-container">
            <div className="caption-bar">
              {showCaptions && currentCaption && (
                <span className="caption-text">{currentCaption}</span>
              )}
              {showCaptions && !currentCaption && (
                <span className="caption-placeholder">लाइव कैप्शन यहाँ दिखाई देंगे...</span>
              )}
            </div>
          </div>
          <div className="controls-container">
            <button
              className={`control-button ${isListening ? 'active' : ''}`}
              onClick={toggleMicrophone}
              title={isListening ? 'सुनना बंद करें' : 'सुनना शुरू करें'}
            >
              {isListening ? <MicOff size={24} /> : <Mic size={24} />}
            </button>
            <button
              className={`control-button ${showCaptions ? 'active' : ''}`}
              onClick={toggleCaptions}
              title="कैप्शन टॉगल करें"
            >
              <FileText size={24} />
            </button>
          </div>
        </div>

        <div className="word-meanings-section">
          <h3 className="section-title">शब्द अर्थ</h3>
          <div ref={wordMeaningsRef} className="meaning-box">
            {wordMeanings.map((word, index) => (
              <div key={index} className="meaning-item">
                <div className="hindi-word">{word.orgWord}</div>
                <div className="english-meaning">{word.engTranslation}</div>
              </div>
            ))}
            {wordMeanings.length === 0 && (
              <div className="placeholder-text">शब्द अनुवाद यहाँ दिखाई देंगे...</div>
            )}
          </div>
        </div>
      </div>

      <div className="status-bar">
        <div className="status-item">
          स्थिति: {isListening ? 'सुन रहा है...' : isAISpeaking ? 'एआई बोल रहा है...' : 'तैयार'}
        </div>
        <div className="status-item">भाषा: हिंदी</div>
      </div>
    </div>
  );
};

export default SarvamAIInterface;