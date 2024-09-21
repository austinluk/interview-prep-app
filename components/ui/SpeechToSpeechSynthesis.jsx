"use client"
import React, { useState, useEffect } from 'react';

const SpeechSynthesisComponent = () => {
  const [text, setText] = useState('');
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [isListening, setIsListening] = useState(false);

  // Check if the browser supports SpeechRecognition
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  let recognition;

  if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.continuous = false; // Continuous listening or single phrase
    recognition.lang = 'en-US'; // Set the language
    recognition.interimResults = false; // Show partial results
  } else {
    console.error("SpeechRecognition is not supported in this browser.");
  }

  useEffect(() => {
    const synth = window.speechSynthesis;

    const populateVoices = () => {
      const voices = synth.getVoices();
      setVoices(voices);
      setSelectedVoice(voices[0] || null);
    };

    synth.onvoiceschanged = populateVoices;
    populateVoices();
  }, []);

  const handleSpeech = () => {
    if (text && selectedVoice) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = selectedVoice;
      utterance.pitch = pitch;
      utterance.rate = rate;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleMicClick = () => {
    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);
    }
  };

  // Handling the result from the speech recognition
  if (recognition) {
    recognition.onresult = (event) => {
      const spokenText = event.results[0][0].transcript;
      setText(spokenText);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>React Speech Synthesis with Mic Input</h1>
      <textarea
        rows="4"
        cols="50"
        placeholder="Type something to speak..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <br />
      <label htmlFor="voiceSelect">Choose Voice: </label>
      <select
        id="voiceSelect"
        onChange={(e) =>
          setSelectedVoice(voices.find((voice) => voice.name === e.target.value))
        }
      >
        {voices.map((voice, index) => (
          <option key={index} value={voice.name}>
            {voice.name} ({voice.lang})
          </option>
        ))}
      </select>
      <br />
     

      <br />
      <button onClick={handleSpeech}>Speak</button>
      <button onClick={handleMicClick}>
        {isListening ? 'Stop Listening' : 'Start Listening'}
      </button>
    </div>
  );
};

export default SpeechSynthesisComponent;
