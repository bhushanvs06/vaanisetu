import React, { useState, useEffect } from 'react';
import './flashcard.css'; // You'll need to move all your styles here from <style> tag

const words = [
  { english: 'Hello', translations: { hindi: 'नमस्ते', bengali: 'হ্যালো', tamil: 'வணக்கம்', telugu: 'హలో', marathi: 'नमस्कार', gujarati: 'નમસ્તે', kannada: 'ನಮಸ್ಕಾರ', malayalam: 'ഹലോ' } },
  { english: 'Water', translations: { hindi: 'पानी', bengali: 'জল', tamil: 'தண்ணீர்', telugu: 'నీరు', marathi: 'पाणी', gujarati: 'પાણી', kannada: 'ನೀರು', malayalam: 'വെള്ളം' } },
  { english: 'Food', translations: { hindi: 'खाना', bengali: 'খাবার', tamil: 'உணவு', telugu: 'ఆహారం', marathi: 'अन्न', gujarati: 'ખોરાક', kannada: 'ಆಹಾರ', malayalam: 'ഭക്ഷണം' }},
  { english: 'Love', translations: { hindi: 'प्रेम', bengali: 'ভালোবাসা', tamil: 'காதல்', telugu: 'ప్రేమ', marathi: 'प्रेम', gujarati: 'પ્રેમ', kannada: 'ಪ್ರೀತಿ', malayalam: 'സ്നേഹം' }},
  { english: 'Friend', translations: { hindi: 'दोस्त', bengali: 'বন্ধু', tamil: 'நண்பன்', telugu: 'సనేహితుడు', marathi: 'मित्र', gujarati: 'મિત્ર', kannada: 'ಸ್ನೇಹಿತ', malayalam: 'സുഹൃത്ത്' }},
  { english: 'Mother', translations: { hindi: 'माँ', bengali: 'মা', tamil: 'அம்மா', telugu: 'అమ్మ', marathi: 'आई', gujarati: 'માતા', kannada: 'ತಾಯಿ', malayalam: 'അമ്മ' }},
  { english: 'Father', translations: { hindi: 'पिता', bengali: 'বাবা', tamil: 'அப்பா', telugu: 'నాన్న', marathi: 'वडील', gujarati: 'પિતા', kannada: 'ತಂದೆ', malayalam: 'അച്ഛൻ' }},
  { english: 'House', translations: { hindi: 'घर', bengali: 'ঘর', tamil: 'வீடு', telugu: 'ఇల్లు', marathi:'घर', gujarati: 'ઘર', kannada: 'ಮನೆ', malayalam: 'വീട്' }},
  { english: 'Book', translations: { hindi: 'किताब', bengali: 'বই', tamil: 'புத்தகம்', telugu: 'పుస్తకం', marathi: 'पुस्तक', gujarati: 'પુસ્તક', kannada: 'ಪುಸ್ತಕ', malayalam: 'പുസ്തകം' }},
  { english: 'Sun', translations: { hindi: 'सूर्य', bengali: 'সূর্য', tamil: 'சூரியன்', telugu: 'సూర్యుడు', marathi: 'सूर्य', gujarati: 'સૂર્ય', kannada: 'ಸೂರ್ಯ', malayalam: 'സൂര്യൻ' }},
  { english: 'Moon', translations: { hindi: 'चाँद', bengali: 'চাঁদ', tamil: 'நிலவு', telugu: 'చంద్రుడు', marathi: 'चंद्र', gujarati: 'ચાંદ', kannada: 'ಚಂದ್ರ', malayalam: 'ചന്ദ്രൻ' }},
  { english: 'Tree', translations: { hindi: 'पेड़', bengali: 'গাছ', tamil: 'மரம்', telugu: 'చెట్టు', marathi: 'झाड', gujarati: 'વૃક્ષ', kannada: 'ಮರ', malayalam: 'മരം' }},
  { english: 'Flower', translations: { hindi: 'फूल', bengali: 'ফুল', tamil: 'பூ', telugu: 'పువ్వు', marathi: 'फूल', gujarati: 'ફૂલ', kannada: 'ಹೂವು', malayalam: 'പൂവ്' }},
  { english: 'School', translations: { hindi: 'स्कूल', bengali: 'স্কুল', tamil: 'பள்ளி', telugu: 'పాఠశాల', marathi: 'शाळा', gujarati: 'શાળા', kannada: 'ಶಾಲೆ', malayalam: 'സ്കൂൾ' }},
  { english: 'Happy', translations: { hindi: 'खुश', bengali: 'খুশি', tamil: 'மகிழ்ச்சி', telugu: 'సంతోషం', marathi: 'आनंदी', gujarati: 'ખુશ', kannada: 'ಸಂತೋಷ', malayalam: 'സന്തോഷം' }},
  { english: 'Beautiful', translations: { hindi: 'सुंदर', bengali: 'সুন্দর', tamil: 'அழகான', telugu: 'అందమైన', marathi: 'सुंदर', gujarati: 'સુંદર', kannada: 'ಸುಂದರ', malayalam: 'സുന്ദരം' }},
  { english: 'Time', translations: { hindi: 'समय', bengali: 'সময়', tamil: 'நேரம்', telugu: 'సమయం', marathi: 'वेळ', gujarati: 'સમય', kannada: 'ಸಮಯ', malayalam: 'സമയം' }},
  { english: 'Money', translations: { hindi: 'पैसा', bengali: 'টাকা', tamil: 'பணம்', telugu: 'డబ్బు', marathi: 'पैसा', gujarati: 'પૈસા', kannada: 'ಹಣ', malayalam: 'പണം' }},
  { english: 'Work', translations: { hindi: 'काम', bengali: 'কাজ', tamil: 'வேலை', telugu: 'పని', marathi: 'काम', gujarati: 'કામ', kannada: 'ಕೆಲಸ', malayalam: 'ജോലി' }},
  { english: 'Peace', translations: { hindi: 'शांति', bengali: 'শান্তি', tamil: 'அமைதி', telugu: 'శాంతి', marathi: 'शांती', gujarati: 'શાંતિ', kannada: 'ಶಾಂತಿ', malayalam: 'സമാധാനം' }}
              ];
  // Add remaining words as above

const languageNames = {
  hindi: 'Hindi', bengali: 'Bengali', tamil: 'Tamil', telugu: 'Telugu',
  marathi: 'Marathi', gujarati: 'Gujarati', kannada: 'Kannada', malayalam: 'Malayalam'
};

const languageCodes = {
  hindi: 'hi-IN', bengali: 'bn-IN', tamil: 'ta-IN', telugu: 'te-IN',
  marathi: 'mr-IN', gujarati: 'gu-IN', kannada: 'kn-IN', malayalam: 'ml-IN'
};

export default function FlashcardsApp() {
  const [selectedLanguage, setSelectedLanguage] = useState('hindi');
  const [flippedCards, setFlippedCards] = useState(new Set());
  const [modalData, setModalData] = useState(null);

  const updateStats = (index, isFlipped) => {
    const newSet = new Set(flippedCards);
    isFlipped ? newSet.add(index) : newSet.delete(index);
    setFlippedCards(newSet);
  };

  const speakText = (text, lang = 'en-US') => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  };

  const speakBoth = () => {
    if (modalData) {
      speakText(modalData.english, 'en-US');
      setTimeout(() => speakText(modalData.translation, modalData.code), 2000);
    }
  };

  useEffect(() => {
  if (modalData) {
    const speakBoth = () => {
      speakText(modalData.english, 'en-US');
      setTimeout(() => speakText(modalData.translation, modalData.code), 2000);
    };
    speakBoth();
  }
}, [modalData]);

  const closeModal = () => {
    setModalData(null);
    window.speechSynthesis.cancel();
  };

  const resetAll = () => {
    setFlippedCards(new Set());
  };

  return (
    <div className="app">
      <div className="header">
        <h1> English to Indian Languages Flashcards</h1>
        <p>Click on any card to see the translation in your selected language</p>
      </div>

      <div className="language-selector">
        <select value={selectedLanguage} onChange={e => { setSelectedLanguage(e.target.value); resetAll(); }}>
          {Object.keys(languageNames).map(lang => (
            <option value={lang} key={lang}>{languageNames[lang]}</option>
          ))}
        </select>
      </div>

      <div className="stats">{flippedCards.size} / {words.length} cards explored</div>

      <div className="flashcard-container">
        {words.map((word, index) => (
          <div
            key={index}
            className={`flashcard ${flippedCards.has(index) ? 'flipped' : ''}`}
            onClick={() => {
              const isFlipped = !flippedCards.has(index);
              updateStats(index, isFlipped);
              setModalData({
                english: word.english,
                translation: word.translations[selectedLanguage],
                language: languageNames[selectedLanguage],
                code: languageCodes[selectedLanguage]
              });
            }}
          >
            <div className="flashcard-inner">
              <div className="flashcard-front"><div className="word">{word.english}</div></div>
              <div className="flashcard-back">
                <div className="translation">
                  <div className="lang-name">{languageNames[selectedLanguage]}</div>
                  <div className="translated-word">{word.translations[selectedLanguage]}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className="reset-btn" onClick={resetAll}>Reset All</button>

      {modalData && (
        <div className="fullscreen-modal active" onClick={closeModal}>
          <div className="fullscreen-content" onClick={e => e.stopPropagation()}>
            <button className="close-btn" onClick={closeModal}>&times;</button>
            <div className="fullscreen-english">{modalData.english}</div>
            <div className="fullscreen-translation">{modalData.translation}</div>
            <div className="fullscreen-language">{modalData.language}</div>
            <div className="fullscreen-instructions">Click anywhere or press ESC to close</div>
            <div className="voice-controls">
              <button className="voice-btn" onClick={speakBoth}>🔊</button>
              <button className="voice-btn" onClick={() => speakText(modalData.english)}>🇺🇸</button>
              <button className="voice-btn" onClick={() => speakText(modalData.translation, modalData.code)}>🌍</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}