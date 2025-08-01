import React, { useState } from 'react';
import './quiz.css';

const quizData = {
  Hindi: {
    mcq: [
      { 
        question: { hi: 'सूरज को हिंदी में क्या कहते हैं?', en: 'What is the Hindi word for "Sun"?' }, 
        options: [
          { hi: 'सूर्य', en: 'Surya' }, 
          { hi: 'चंद्र', en: 'Chandra' }, 
          { hi: 'तारा', en: 'Tara' }, 
          { hi: 'नक्षत्र', en: 'Nakshatra' }
        ], 
        answer: { hi: 'सूर्य', en: 'Surya' } 
      },
      { 
        question: { hi: 'प्रकाश का त्योहार कौन सा है?', en: 'Which festival is known as the festival of lights?' }, 
        options: [
          { hi: 'होली', en: 'Holi' }, 
          { hi: 'दिवाली', en: 'Diwali' }, 
          { hi: 'राखी', en: 'Rakhi' }, 
          { hi: 'नवरात्रि', en: 'Navratri' }
        ], 
        answer: { hi: 'दिवाली', en: 'Diwali' } 
      },
      { 
        question: { hi: 'पानी को हिंदी में क्या कहते हैं?', en: 'What is "Water" called in Hindi?' }, 
        options: [
          { hi: 'आग', en: 'Aag' }, 
          { hi: 'पानी', en: 'Pani' }, 
          { hi: 'हवा', en: 'Hawa' }, 
          { hi: 'मिट्टी', en: 'Mitti' }
        ], 
        answer: { hi: 'पानी', en: 'Pani' } 
      },
      { 
        question: { hi: '"रामचरितमानस" के रचयिता कौन हैं?', en: 'Who is the author of "Ramcharitmanas"?' }, 
        options: [
          { hi: 'कालिदास', en: 'Kalidas' }, 
          { hi: 'तुलसीदास', en: 'Tulsidas' }, 
          { hi: 'सूरदास', en: 'Surdas' }, 
          { hi: 'कबीर', en: 'Kabir' }
        ], 
        answer: { hi: 'तुलसीदास', en: 'Tulsidas' } 
      },
      { 
        question: { hi: 'माँ को हिंदी में क्या कहते हैं?', en: 'What is the Hindi term for "Mother"?' }, 
        options: [
          { hi: 'पिता', en: 'Pita' }, 
          { hi: 'माता', en: 'Mata' }, 
          { hi: 'भाई', en: 'Bhai' }, 
          { hi: 'बहन', en: 'Behen' }
        ], 
        answer: { hi: 'माता', en: 'Mata' } 
      },
    ],
    fill: [
      { question: { hi: 'भारत का राष्ट्रगान "जन गण _____" है।', en: 'The national anthem of India is "Jana Gana _____".' }, answer: { hi: 'मन', en: 'Mana' } },
      { question: { hi: 'भारत की राजधानी को हिंदी में "नया _____" कहते हैं।', en: 'The capital city of India in Hindi is called "Naya _____".' }, answer: { hi: 'दिल्ली', en: 'Dilli' } },
      { question: { hi: 'पुस्तक को हिंदी में "_____" कहते हैं।', en: 'The Hindi word for book is "_____".' }, answer: { hi: 'पुस्तक', en: 'Pustak' } },
      { question: { hi: 'महात्मा गांधी को राष्ट्र का _____ कहा जाता है।', en: 'Mahatma Gandhi is known as the father of the _____.' }, answer: { hi: 'राष्ट्र', en: 'Nation' } },
      { question: { hi: 'प्रसिद्ध नदी को हिंदी में "_____" कहते हैं।', en: 'The famous river in Hindi is called "_____".' }, answer: { hi: 'गंगा', en: 'Ganga' } },
    ],
  },
  Kannada: {
    mcq: [
      { 
        question: { kn: 'ಮರವನ್ನು ಕನ್ನಡದಲ್ಲಿ ಏನೆಂದು ಕರೆಯುತ್ತಾರೆ?', en: 'What is the Kannada word for "Tree"?' }, 
        options: [
          { kn: 'ಮರ', en: 'Mara' }, 
          { kn: 'ಹೂವು', en: 'Hoovu' }, 
          { kn: 'ಕಲ್ಲು', en: 'Kallu' }, 
          { kn: 'ನೀರು', en: 'Neeru' }
        ], 
        answer: { kn: 'ಮರ', en: 'Mara' } 
      },
      { 
        question: { kn: 'ಪ್ರಸಿದ್ಧ ಕನ್ನಡ ಜಾನಪದ ನೃತ್ಯ ಯಾವುದು?', en: 'Which is a famous Kannada folk dance?' }, 
        options: [
          { kn: 'ಭರತನಾಟ್ಯ', en: 'Bharatanatyam' }, 
          { kn: 'ಯಕ್ಷಗಾನ', en: 'Yakshagana' }, 
          { kn: 'ಕಥಕ್', en: 'Kathak' }, 
          { kn: 'ಒಡಿಸ್ಸಿ', en: 'Odissi' }
        ], 
        answer: { kn: 'ಯಕ್ಷಗಾನ', en: 'Yakshagana' } 
      },
      { 
        question: { kn: 'ಚಂದ್ರನನ್ನು ಕನ್ನಡದಲ್ಲಿ ಏನೆಂದು ಕರೆಯುತ್ತಾರೆ?', en: 'What is "Moon" in Kannada?' }, 
        options: [
          { kn: 'ಸೂರ್ಯ', en: 'Surya' }, 
          { kn: 'ಚಂದ್ರ', en: 'Chandra' }, 
          { kn: 'ನಕ್ಷತ್ರ', en: 'Nakshtra' }, 
          { kn: 'ತಾರೆ', en: 'Tare' }
        ], 
        answer: { kn: 'ಚಂದ್ರ', en: 'Chandra' } 
      },
      { 
        question: { kn: 'ಪ್ರಸಿದ್ಧ ಕನ್ನಡ ಕವಿ ಯಾರು?', en: 'Who is a famous Kannada poet?' }, 
        options: [
          { kn: 'ಪಂಪ', en: 'Pampa' }, 
          { kn: 'ಕಾಳಿದಾಸ', en: 'Kalidas' }, 
          { kn: 'ತುಳಸೀದಾಸ', en: 'Tulsidas' }, 
          { kn: 'ಕಬೀರ', en: 'Kabir' }
        ], 
        answer: { kn: 'ಪಂಪ', en: 'Pampa' } 
      },
      { 
        question: { kn: 'ಮನೆಯನ್ನು ಕನ್ನಡದಲ್ಲಿ ಏನೆಂದು ಕರೆಯುತ್ತಾರೆ?', en: 'What is the Kannada word for "House"?' }, 
        options: [
          { kn: 'ಮನೆ', en: 'Mane' }, 
          { kn: 'ಬಾಗಿಲು', en: 'Baagilu' }, 
          { kn: 'ಕೆರೆ', en: 'Kere' }, 
          { kn: 'ಗುಡ್ಡ', en: 'Gudda' }
        ], 
        answer: { kn: 'ಮನೆ', en: 'Mane' } 
      },
    ],
    fill: [
      { question: { kn: 'ಕರ್ನಾಟಕದ ರಾಜ್ಯ ಪುಷ್ಪ "_____" ಆಗಿದೆ।', en: 'The state flower of Karnataka is "_____".' }, answer: { kn: 'ಕಮಲ', en: 'Lotus' } },
      { question: { kn: 'ಮಳೆಗೆ ಕನ್ನಡದಲ್ಲಿ "_____" ಎನ್ನುತ್ತಾರೆ।', en: 'The Kannada word for rain is "_____".' }, answer: { kn: 'ಮಳೆ', en: 'Male' } },
      { question: { kn: 'ಪ್ರಸಿದ್ಧ ಕನ್ನಡ ಕಾವ್ಯ "ಜಯ _____" ಆಗಿದೆ।', en: 'The famous Kannada epic is "Jaya _____".' }, answer: { kn: 'ಭಾರತ', en: 'Bharata' } },
      { question: { kn: 'ಕರ್ನಾಟಕದ ರಾಜಧಾನಿ "_____" ಆಗಿದೆ।', en: 'The capital of Karnataka is "_____".' }, answer: { kn: 'ಬೆಂಗಳೂರು', en: 'Bengaluru' } },
      { question: { kn: 'ನದಿಗೆ ಕನ್ನಡದಲ್ಲಿ "_____" ಎನ್ನುತ್ತಾರೆ।', en: 'The Kannada word for river is "_____".' }, answer: { kn: 'ನದಿ', en: 'Nadi' } },
    ],
  },
  Telugu: {
    mcq: [
      { 
        question: { te: 'ఆకాశాన్ని తెలుగులో ఏమని పిలుస్తారు?', en: 'What is the Telugu word for "Sky"?' }, 
        options: [
          { te: 'ఆకాశం', en: 'Aakasha' }, 
          { te: 'నీరు', en: 'Neeru' }, 
          { te: 'భూమి', en: 'Bhoomi' }, 
          { te: 'గాలి', en: 'Gali' }
        ], 
        answer: { te: 'ఆకాశం', en: 'Aakasha' } 
      },
      { 
        question: { te: 'సాంప్రదాయ తెలుగు నృత్యం ఏది?', en: 'Which is a traditional Telugu dance?' }, 
        options: [
          { te: 'కూచిపూడి', en: 'Kuchipudi' }, 
          { te: 'కథక్', en: 'Kathak' }, 
          { te: 'భరతనాట్యం', en: 'Bharatanatyam' }, 
          { te: 'మణిపూరి', en: 'Manipuri' }
        ], 
        answer: { te: 'కూచిపూడి', en: 'Kuchipudi' } 
      },
      { 
        question: { te: 'నిప్పును తెలుగులో ఏమని పిలుస్తారు?', en: 'What is "Fire" in Telugu?' }, 
        options: [
          { te: 'నీరు', en: 'Neeru' }, 
          { te: 'మట్టి', en: 'Matti' }, 
          { te: 'అగ్ని', en: 'Agni' }, 
          { te: 'వాయు', en: 'Vayu' }
        ], 
        answer: { te: 'అగ్ని', en: 'Agni' } 
      },
      { 
        question: { te: 'ప్రసిద్ధ తెలుగు కవి ఎవరు?', en: 'Who is a famous Telugu poet?' }, 
        options: [
          { te: 'నన్నయ', en: 'Nannaya' }, 
          { te: 'కాళిదాసు', en: 'Kalidas' }, 
          { te: 'తులసీదాసు', en: 'Tulsidas' }, 
          { te: 'సూరదాసు', en: 'Surdas' }
        ], 
        answer: { te: 'నన్నయ', en: 'Nannaya' } 
      },
      { 
        question: { te: 'తండ్రిని తెలుగులో ఏమని పిలుస్తారు?', en: 'What is the Telugu word for "Father"?' }, 
        options: [
          { te: 'అమ్మ', en: 'Amma' }, 
          { te: 'నాన్న', en: 'Nanna' }, 
          { te: 'అన్న', en: 'Anna' }, 
          { te: 'అక్క', en: 'Akka' }
        ], 
        answer: { te: 'నాన్న', en: 'Nanna' } 
      },
    ],
    fill: [
      { question: { te: 'ఆంధ్రప్రదేశ్ రాజధాని "_____" ఆగిదె।', en: 'The capital of Andhra Pradesh is "_____".' }, answer: { te: 'అమరావతి', en: 'Amaravati' } },
      { question: { te: 'నక్షత్రానికి తెలుగు పదం "_____" ఆగిదె।', en: 'The Telugu word for star is "_____".' }, answer: { te: 'చుక్కలు', en: 'Chukkalu' } },
      { question: { te: 'ప్రసిద్ధ తెలుగు పండుగ "_____" ఆగిదె।', en: 'The famous Telugu festival is "_____".' }, answer: { te: 'ఉగాది', en: 'Ugadi' } },
      { question: { te: 'పుష్పానికి తెలుగు పదం "_____" ఆగిదె।', en: 'The Telugu word for flower is "_____".' }, answer: { te: 'పువ్వు', en: 'Puvvu' } },
      { question: { te: 'ప్రసిద్ధ నది "_____" ఆగిదె।', en: 'The famous river is "_____".' }, answer: { te: 'గోదావరి', en: 'Godavari' } },
    ],
  },
  Tamil: {
    mcq: [
      { 
        question: { ta: 'கடலை தமிழில் எவ்வாறு அழைப்பார்கள்?', en: 'What is the Tamil word for "Sea"?' }, 
        options: [
          { ta: 'கடல்', en: 'Kadal' }, 
          { ta: 'மலை', en: 'Malai' }, 
          { ta: 'ஆறு', en: 'Aaru' }, 
          { ta: 'வானம்', en: 'Vaanam' }
        ], 
        answer: { ta: 'கடல்', en: 'Kadal' } 
      },
      { 
        question: { ta: 'பாரம்பரிய தமிழ் நடனம் எது?', en: 'Which is a classical Tamil dance?' }, 
        options: [
          { ta: 'பரதநாட்டியம்', en: 'Bharatanatyam' }, 
          { ta: 'கதக்', en: 'Kathak' }, 
          { ta: 'ஒடிசி', en: 'Odissi' }, 
          { ta: 'மணிப்பூரி', en: 'Manipuri' }
        ], 
        answer: { ta: 'பரதநாட்டியம்', en: 'Bharatanatyam' } 
      },
      { 
        question: { ta: 'சூரியனை தமிழில் எவ்வாறு அழைப்பார்கள்?', en: 'What is "Sun" in Tamil?' }, 
        options: [
          { ta: 'சந்திரன்', en: 'Chandran' }, 
          { ta: 'சூரியன்', en: 'Sooriyan' }, 
          { ta: 'நட்சத்திரம்', en: 'Natchathiram' }, 
          { ta: 'வெள்ளி', en: 'Velli' }
        ], 
        answer: { ta: 'சூரியன்', en: 'Sooriyan' } 
      },
      { 
        question: { ta: 'பிரபல தமிழ் கவிஞர் யார்?', en: 'Who is a famous Tamil poet?' }, 
        options: [
          { ta: 'திருவள்ளுவர்', en: 'Thiruvalluvar' }, 
          { ta: 'காளிதாஸ்', en: 'Kalidas' }, 
          { ta: 'துளசிதாஸ்', en: 'Tulsidas' }, 
          { ta: 'கபீர்', en: 'Kabir' }
        ], 
        answer: { ta: 'திருவள்ளுவர்', en: 'Thiruvalluvar' } 
      },
      { 
        question: { ta: 'தாயை தமிழில் எவ்வாறு அழைப்பார்கள்?', en: 'What is the Tamil word for "Mother"?' }, 
        options: [
          { ta: 'அப்பா', en: 'Appa' }, 
          { ta: 'அம்மா', en: 'Amma' }, 
          { ta: 'அண்ணா', en: 'Anna' }, 
          { ta: 'அக்கா', en: 'Akka' }
        ], 
        answer: { ta: 'அம்மா', en: 'Amma' } 
      },
    ],
    fill: [
      { question: { ta: 'தமிழ்நாட்டின் தலைநகரம் "_____" ஆகும்।', en: 'The capital of Tamil Nadu is "_____".' }, answer: { ta: 'சென்னை', en: 'Chennai' } },
      { question: { ta: 'பறவைக்கு தமிழ் வார்த்தை "_____" ஆகும்।', en: 'The Tamil word for bird is "_____".' }, answer: { ta: 'பறவை', en: 'Paravai' } },
      { question: { ta: 'பிரபல தமிழ் காவியம் "_____" ஆகும்।', en: 'The famous Tamil epic is "_____".' }, answer: { ta: 'சிலப்பதிகாரம்', en: 'Silappathikaram' } },
      { question: { ta: 'மழைக்கு தமிழ் வார்த்தை "_____" ஆகும்।', en: 'The Tamil word for rain is "_____".' }, answer: { ta: 'மழை', en: 'Mazhai' } },
      { question: { ta: 'பிரபல நதி "_____" ஆகும்।', en: 'The famous river is "_____".' }, answer: { ta: 'காவிரி', en: 'Kaveri' } },
    ],
  },
  Malayalam: {
    mcq: [
      { 
        question: { ml: 'നദിയെ മലയാളത്തിൽ എന്താണ് വിളിക്കുന്നത്?', en: 'What is the Malayalam word for "River"?' }, 
        options: [
          { ml: 'നദി', en: 'Nadi' }, 
          { ml: 'വീട്', en: 'Veedu' }, 
          { ml: 'പൂക്കൾ', en: 'Pookkal' }, 
          { ml: 'ആകാശം', en: 'Aakaasham' }
        ], 
        answer: { ml: 'നദി', en: 'Nadi' } 
      },
      { 
        question: { ml: 'പരമ്പരാഗത മലയാള നൃത്തം ഏതാണ്?', en: 'Which is a traditional Malayalam dance?' }, 
        options: [
          { ml: 'കഥകളി', en: 'Kathakali' }, 
          { ml: 'ഭരതനാട്യം', en: 'Bharatanatyam' }, 
          { ml: 'ഒഡിസ്സി', en: 'Odissi' }, 
          { ml: 'മണിപ്പൂരി', en: 'Manipuri' }
        ], 
        answer: { ml: 'കഥകളി', en: 'Kathakali' } 
      },
      { 
        question: { ml: 'ചന്ദ്രനെ മലയാളത്തിൽ എന്താണ് വിളിക്കുന്നത്?', en: 'What is "Moon" in Malayalam?' }, 
        options: [
          { ml: 'സൂര്യൻ', en: 'Sooryan' }, 
          { ml: 'ചന്ദ്രൻ', en: 'Chandran' }, 
          { ml: 'നക്ഷത്രം', en: 'Nakshatram' }, 
          { ml: 'വെള്ളി', en: 'Velli' }
        ], 
        answer: { ml: 'ചന്ദ്രൻ', en: 'Chandran' } 
      },
      { 
        question: { ml: 'പ്രശസ്ത മലയാള കവി ആര്?', en: 'Who is a famous Malayalam poet?' }, 
        options: [
          { ml: 'കുമാരനാശാൻ', en: 'Kumaran Asan' }, 
          { ml: 'കാളിദാസ്', en: 'Kalidas' }, 
          { ml: 'തുളസീദാസ്', en: 'Tulsidas' }, 
          { ml: 'കബീർ', en: 'Kabir' }
        ], 
        answer: { ml: 'കുമാരനാശാൻ', en: 'Kumaran Asan' } 
      },
      { 
        question: { ml: 'വീടിനെ മലയാളത്തിൽ എന്താണ് വിളിക്കുന്നത്?', en: 'What is the Malayalam word for "House"?' }, 
        options: [
          { ml: 'വീട്', en: 'Veedu' }, 
          { ml: 'പൂക്കൾ', en: 'Pookkal' }, 
          { ml: 'മരം', en: 'Maram' }, 
          { ml: 'കടൽ', en: 'Kadal' }
        ], 
        answer: { ml: 'വീട്', en: 'Veedu' } 
      },
    ],
    fill: [
      { question: { ml: 'കേരളത്തിന്റെ തലസ്ഥാനം "_____" ആണ്।', en: 'The capital of Kerala is "_____".' }, answer: { ml: 'തിരുവനന്തപുരം', en: 'Thiruvananthapuram' } },
      { question: { ml: 'നക്ഷത്രത്തിന് മലയാള വാക്ക് "_____" ആണ്।', en: 'The Malayalam word for star is "_____".' }, answer: { ml: 'നക്ഷത്രം', en: 'Nakshatram' } },
      { question: { ml: 'പ്രശസ്ത മലയാള ഉത്സവം "_____" ആണ്।', en: 'The famous Malayalam festival is "_____".' }, answer: { ml: 'ഓണം', en: 'Onam' } },
      { question: { ml: 'പുഷ്പത്തിന് മലയാള വാക്ക് "_____" ആണ്।', en: 'The Malayalam word for flower is "_____".' }, answer: { ml: 'പൂ', en: 'Poo' } },
      { question: { ml: 'പ്രശസ്ത നദി "_____" ആണ്।', en: 'The famous river is "_____".' }, answer: { ml: 'പെരിയാർ', en: 'Periyar' } },
    ],
  },
  Gujarati: {
    mcq: [
      { 
        question: { gu: 'આકાશને ગુજરાતીમાં શું કહેવાય છે?', en: 'What is the Gujarati word for "Sky"?' }, 
        options: [
          { gu: 'આસમાન', en: 'Aasmaan' }, 
          { gu: 'પાણી', en: 'Paani' }, 
          { gu: 'ધરતી', en: 'Dharti' }, 
          { gu: 'વાયુ', en: 'Vaayu' }
        ], 
        answer: { gu: 'આસમાન', en: 'Aasmaan' } 
      },
      { 
        question: { gu: 'પરંપરાગત ગુજરાતી નૃત્ય કયું છે?', en: 'Which is a traditional Gujarati dance?' }, 
        options: [
          { gu: 'ગરબા', en: 'Garba' }, 
          { gu: 'કથક', en: 'Kathak' }, 
          { gu: 'ભરતનાટ્યમ', en: 'Bharatanatyam' }, 
          { gu: 'ઓડિસી', en: 'Odissi' }
        ], 
        answer: { gu: 'ગરબા', en: 'Garba' } 
      },
      { 
        question: { gu: 'અગ્નિને ગુજરાતીમાં શું કહેવાય છે?', en: 'What is "Fire" in Gujarati?' }, 
        options: [
          { gu: 'પાણી', en: 'Paani' }, 
          { gu: 'આગ', en: 'Aag' }, 
          { gu: 'હવા', en: 'Hava' }, 
          { gu: 'માટી', en: 'Mati' }
        ], 
        answer: { gu: 'આગ', en: 'Aag' } 
      },
      { 
        question: { gu: 'પ્રખ્યાત ગુજરાતી કવિ કોણ છે?', en: 'Who is a famous Gujarati poet?' }, 
        options: [
          { gu: 'નર્મદ', en: 'Narmad' }, 
          { gu: 'કાળિદાસ', en: 'Kalidas' }, 
          { gu: 'તુલસીદાસ', en: 'Tulsidas' }, 
          { gu: 'કબીર', en: 'Kabir' }
        ], 
        answer: { gu: 'નર્મદ', en: 'Narmad' } 
      },
      { 
        question: { gu: 'માતાને ગુજરાતીમાં શું કહેવાય છે?', en: 'What is the Gujarati word for "Mother"?' }, 
        options: [
          { gu: 'પિતા', en: 'Pita' }, 
          { gu: 'મા', en: 'Maa' }, 
          { gu: 'ભાઈ', en: 'Bhai' }, 
          { gu: 'બહેન', en: 'Behen' }
        ], 
        answer: { gu: 'મા', en: 'Maa' } 
      },
    ],
    fill: [
      { question: { gu: 'ગુજરાતની રાજધાની "_____" છે।', en: 'The capital of Gujarat is "_____".' }, answer: { gu: 'ગાંધીનગર', en: 'Gandhinagar' } },
      { question: { gu: 'તારાને ગુજરાતીમાં "_____" કહેવાય છે।', en: 'The Gujarati word for star is "_____".' }, answer: { gu: 'તારો', en: 'Taro' } },
      { question: { gu: 'પ્રખ્યાત ગુજરાતી તહેવાર "_____" છે।', en: 'The famous Gujarati festival is "_____".' }, answer: { gu: 'નવરાત્રિ', en: 'Navratri' } },
      { question: { gu: 'ફૂલને ગુજરાતીમાં "_____" કહેવાય છે।', en: 'The Gujarati word for flower is "_____".' }, answer: { gu: 'ફૂલ', en: 'Phool' } },
      { question: { gu: 'પ્રખ્યાત નદી "_____" છે।', en: 'The famous river is "_____".' }, answer: { gu: 'સાબરમતી', en: 'Sabarmati' } },
    ],
  },
  Marathi: {
    mcq: [
      { 
        question: { mr: 'झाडाला मराठीत काय म्हणतात?', en: 'What is the Marathi word for "Tree"?' }, 
        options: [
          { mr: 'झाड', en: 'Zhaad' }, 
          { mr: 'फूल', en: 'Phool' }, 
          { mr: 'पाणी', en: 'Paani' }, 
          { mr: 'धूर', en: 'Dhoor' }
        ], 
        answer: { mr: 'झाड', en: 'Zhaad' } 
      },
      { 
        question: { mr: 'पारंपारिक मराठी नृत्य कोणते आहे?', en: 'Which is a traditional Marathi dance?' }, 
        options: [
          { mr: 'लावणी', en: 'Lavani' }, 
          { mr: 'कथक', en: 'Kathak' }, 
          { mr: 'भरतनाट्यम', en: 'Bharatanatyam' }, 
          { mr: 'ओडिसी', en: 'Odissi' }
        ], 
        answer: { mr: 'लावणी', en: 'Lavani' } 
      },
      { 
        question: { mr: 'सूर्याला मराठीत काय म्हणतात?', en: 'What is "Sun" in Marathi?' }, 
        options: [
          { mr: 'चंद्र', en: 'Chandra' }, 
          { mr: 'सूर्य', en: 'Surya' }, 
          { mr: 'तारा', en: 'Tara' }, 
          { mr: 'नक्षत्र', en: 'Nakshatra' }
        ], 
        answer: { mr: 'सूर्य', en: 'Surya' } 
      },
      { 
        question: { mr: 'प्रसिद्ध मराठी कवी कोण आहे?', en: 'Who is a famous Marathi poet?' }, 
        options: [
          { mr: 'तुकाराम', en: 'Tukaram' }, 
          { mr: 'कालिदास', en: 'Kalidas' }, 
          { mr: 'तुलसीदास', en: 'Tulsidas' }, 
          { mr: 'कबीर', en: 'Kabir' }
        ], 
        answer: { mr: 'तुकाराम', en: 'Tukaram' } 
      },
      { 
        question: { mr: 'वडिलांना मराठीत काय म्हणतात?', en: 'What is the Marathi word for "Father"?' }, 
        options: [
          { mr: 'आई', en: 'Aai' }, 
          { mr: 'वडील', en: 'Vadeel' }, 
          { mr: 'भाऊ', en: 'Bhau' }, 
          { mr: 'बहीण', en: 'Bahin' }
        ], 
        answer: { mr: 'वडील', en: 'Vadeel' } 
      },
    ],
    fill: [
      { question: { mr: 'महाराष्ट्राची राजधानी "_____" आहे।', en: 'The capital of Maharashtra is "_____".' }, answer: { mr: 'मुंबई', en: 'Mumbai' } },
      { question: { mr: 'पक्ष्याला मराठीत "_____" म्हणतात।', en: 'The Marathi word for bird is "_____".' }, answer: { mr: 'पक्षी', en: 'Pakshi' } },
      { question: { mr: 'प्रसिद्ध मराठी सण "_____" आहे।', en: 'The famous Marathi festival is "_____".' }, answer: { mr: 'गणेशोत्सव', en: 'Ganeshotsav' } },
      { question: { mr: 'पावसाला मराठीत "_____" म्हणतात।', en: 'The Marathi word for rain is "_____".' }, answer: { mr: 'पाऊस', en: 'Paaoos' } },
      { question: { mr: 'प्रसिद्ध नदी "_____" आहे।', en: 'The famous river is "_____".' }, answer: { mr: 'कृष्णा', en: 'Krishna' } },
    ],
  },
  Bengali: {
    mcq: [
      { 
        question: { bn: 'সূর্যকে বাংলায় কী বলা হয়?', en: 'What is the Bengali word for "Sun"?' }, 
        options: [
          { bn: 'সূর্য', en: 'Surya' }, 
          { bn: 'চাঁদ', en: 'Chand' }, 
          { bn: 'তারা', en: 'Tara' }, 
          { bn: 'নক্ষত্র', en: 'Nakshatra' }
        ], 
        answer: { bn: 'সূর্য', en: 'Surya' } 
      },
      { 
        question: { bn: 'বাংলার বিখ্যাত উৎসব কোনটি?', en: 'Which is a famous Bengali festival?' }, 
        options: [
          { bn: 'দুর্গা পূজা', en: 'Durga Puja' }, 
          { bn: 'হোলি', en: 'Holi' }, 
          { bn: 'দীপাবলি', en: 'Diwali' }, 
          { bn: 'রাখি', en: 'Rakhi' }
        ], 
        answer: { bn: 'দুর্গা পূজা', en: 'Durga Puja' } 
      },
      { 
        question: { bn: 'জলকে বাংলায় কী বলা হয়?', en: 'What is "Water" in Bengali?' }, 
        options: [
          { bn: 'আগুন', en: 'Agun' }, 
          { bn: 'জল', en: 'Jol' }, 
          { bn: 'বাতাস', en: 'Batas' }, 
          { bn: 'মাটি', en: 'Mati' }
        ], 
        answer: { bn: 'জল', en: 'Jol' } 
      },
      { 
        question: { bn: 'বিখ্যাত বাঙালি কবি কে?', en: 'Who is a famous Bengali poet?' }, 
        options: [
          { bn: 'রবীন্দ্রনাথ ঠাকুর', en: 'Rabindranath Tagore' }, 
          { bn: 'কালিদাস', en: 'Kalidas' }, 
          { bn: 'তুলসীদাস', en: 'Tulsidas' }, 
          { bn: 'কবীর', en: 'Kabir' }
        ], 
        answer: { bn: 'রবীন্দ্রনাথ ঠাকুর', en: 'Rabindranath Tagore' } 
      },
      { 
        question: { bn: 'মাকে বাংলায় কী বলা হয়?', en: 'What is the Bengali word for "Mother"?' }, 
        options: [
          { bn: 'বাবা', en: 'Baba' }, 
          { bn: 'মা', en: 'Ma' }, 
          { bn: 'ভাই', en: 'Bhai' }, 
          { bn: 'বোন', en: 'Bon' }
        ], 
        answer: { bn: 'মা', en: 'Ma' } 
      },
    ],
    fill: [
      { question: { bn: 'পশ্চিমবঙ্গের রাজধানী "_____"।', en: 'The capital of West Bengal is "_____".' }, answer: { bn: 'কলকাতা', en: 'Kolkata' } },
      { question: { bn: 'পাখির জন্য বাংলা শব্দ "_____"।', en: 'The Bengali word for bird is "_____".' }, answer: { bn: 'পাখি', en: 'Pakhi' } },
      { question: { bn: 'বিখ্যাত বাংলা মহাকাব্য "_____"।', en: 'The famous Bengali epic is "_____".' }, answer: { bn: 'মেঘনাদবধ কাব্য', en: 'Meghnad Badh Kavya' } },
      { question: { bn: 'বৃষ্টির জন্য বাংলা শব্দ "_____"।', en: 'The Bengali word for rain is "_____".' }, answer: { bn: 'বৃষ্টি', en: 'Brishti' } },
      { question: { bn: 'বিখ্যাত নদী "_____"।', en: 'The famous river is "_____".' }, answer: { bn: 'গঙ্গা', en: 'Ganga' } },
    ],
  },
};

const MCQQuestion = ({ question, options, index, handleAnswer, selectedAnswer, lang }) => (
  <div className="question-container">
    <p className="question-text">{index + 1}. {question[lang]} <span className="translation-text">({question.en})</span></p>
    <div className="options-container">
      {options.map((option, i) => (
        <label key={i} className="option-label">
          <input
            type="radio"
            name={`mcq-${index}`}
            value={option.en}
            checked={selectedAnswer === option.en}
            onChange={() => handleAnswer(index, option.en)}
            className="radio-input"
            aria-label={`${option[lang]} (${option.en})`}
          />
          <span>{option[lang]} ({option.en})</span>
        </label>
      ))}
    </div>
  </div>
);

const FillInBlankQuestion = ({ question, index, handleAnswer, userAnswer, lang }) => (
  <div className="question-container">
    <p className="question-text">{index + 1}. {question[lang]} <span className="translation-text">({question.en})</span></p>
    <input
      type="text"
      value={userAnswer || ''}
      onChange={(e) => handleAnswer(index, e.target.value)}
      className="text-input"
      placeholder="Type your answer here"
      aria-label="Fill in the blank answer"
    />
  </div>
);

const Quiz = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('Hindi');
  const [selectedQuizType, setSelectedQuizType] = useState('Quiz');
  const [mcqAnswers, setMcqAnswers] = useState({});
  const [fillAnswers, setFillAnswers] = useState({});
  const [score, setScore] = useState(null);

  const langCode = {
    Hindi: 'hi',
    Kannada: 'kn',
    Telugu: 'te',
    Tamil: 'ta',
    Malayalam: 'ml',
    Gujarati: 'gu',
    Marathi: 'mr',
    Bengali: 'bn',
  }[selectedLanguage];

  const handleMcqAnswer = (index, answer) => {
    setMcqAnswers((prev) => ({ ...prev, [index]: answer }));
  };

  const handleFillAnswer = (index, answer) => {
    setFillAnswers((prev) => ({ ...prev, [index]: answer }));
  };

  const calculateScore = () => {
    let totalScore = 0;
    const mcqQuestions = quizData[selectedLanguage].mcq;
    const fillQuestions = quizData[selectedLanguage].fill;

    if (selectedQuizType === 'Quiz' || selectedQuizType === 'MCQ') {
      mcqQuestions.forEach((q, i) => {
        if (mcqAnswers[i] === q.answer.en) totalScore += 1;
      });
    }

    if (selectedQuizType === 'Quiz' || selectedQuizType === 'Fill in the Blanks') {
      fillQuestions.forEach((q, i) => {
        const userAnswer = fillAnswers[i]?.trim().toLowerCase();
        const correctEn = q.answer.en.toLowerCase();
        const correctLang = q.answer[langCode].toLowerCase();
        if (userAnswer === correctEn || userAnswer === correctLang) totalScore += 1;
      });
    }

    setScore(totalScore);
  };

  const resetQuiz = () => {
    setMcqAnswers({});
    setFillAnswers({});
    setScore(null);
  };

  return (
    <div className="app-container">
      <div className="quiz-container">
        <h1 className="title">Language Quiz</h1>
        <div className="selector-container">
          <label htmlFor="language" className="label">Select Language:</label>
          <select
            id="language"
            value={selectedLanguage}
            onChange={(e) => {
              setSelectedLanguage(e.target.value);
              resetQuiz();
            }}
            className="select"
            aria-label="Select language"
          >
            {Object.keys(quizData).map((lang) => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>
        </div>
        <div className="selector-container">
          <label htmlFor="quiz-type" className="label">Select Quiz Type:</label>
          <select
            id="quiz-type"
            value={selectedQuizType}
            onChange={(e) => {
              setSelectedQuizType(e.target.value);
              resetQuiz();
            }}
            className="select"
            aria-label="Select quiz type"
          >
            <option value="Quiz">Quiz (MCQ + Fill)</option>
            <option value="MCQ">MCQ</option>
            <option value="Fill in the Blanks">Fill in the Blanks</option>
          </select>
        </div>
        {(selectedQuizType === 'Quiz' || selectedQuizType === 'MCQ') && (
          <>
            <h2 className="section-title">Multiple Choice Questions</h2>
            {quizData[selectedLanguage].mcq.map((q, i) => (
              <MCQQuestion
                key={`mcq-${i}`}
                question={q.question}
                options={q.options}
                index={i}
                handleAnswer={handleMcqAnswer}
                selectedAnswer={mcqAnswers[i]}
                lang={langCode}
              />
            ))}
          </>
        )}
        {(selectedQuizType === 'Quiz' || selectedQuizType === 'Fill in the Blanks') && (
          <>
            <h2 className="section-title">Fill in the Blank Questions</h2>
            {quizData[selectedLanguage].fill.map((q, i) => (
              <FillInBlankQuestion
                key={`fill-${i}`}
                question={q.question}
                index={i}
                handleAnswer={handleFillAnswer}
                userAnswer={fillAnswers[i]}
                lang={langCode}
              />
            ))}
          </>
        )}
        <div className="button-container">
          <button
            onClick={calculateScore}
            className="submit-button"
            aria-label="Submit quiz"
          >
            Submit
          </button>
          <button
            onClick={resetQuiz}
            className="reset-button"
            aria-label="Reset quiz"
          >
            Reset
          </button>
        </div>
        {score !== null && (
          <p className="score-text">
            Your Score: {score} / {selectedQuizType === 'Quiz' ? 10 : 5}
          </p>
        )}
      </div>
    </div>
  );
};

export default Quiz;