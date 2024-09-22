"use client";

import React, { useState, useEffect } from "react";
import { Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import OpenAI from "openai";

export default function TextToSpeech() {
  const [text, setText] = useState("");
  const [voices, setVoices] = useState([]);
  const [response, setResponse] = useState("");
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [isListening, setIsListening] = useState(false);

  // Check if the browser supports SpeechRecognition
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  let recognition;

  //send to ChatGPT
  const sendTextToChatGPT = async (inputText) => {
    try {
      const openai = new OpenAI({apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY, dangerouslyAllowBrowser: true});
      const completion = await openai.chat.completions.create({
        messages: [{role: "system", content: inputText}],
        model: "gpt-4o-mini"
      })
      console.log("RESPONSE: ",completion.choices[0]);
    } catch (error) {
      console.error("Error sending text to ChatGPT:", error);
      setResponse("Error occurred while contacting ChatGPT.");
    }
  };

  if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.continuous = false; // Continuous listening or single phrase
    recognition.lang = "en-US"; // Set the language
    recognition.interimResults = false; // Show partial results
  } else {
    console.error("SpeechRecognition is not supported in this browser.");
  }

  useEffect(() => {
    const synth = window.speechSynthesis;

    const populateVoices = () => {
      const availableVoices = synth.getVoices();
      setVoices(availableVoices);
      setSelectedVoice(availableVoices[0] || null);
    };

    synth.onvoiceschanged = populateVoices;
    populateVoices();
  }, []);

  const handleMicClick = async (event) => {
    event.preventDefault(); // Prevent the default form submission
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

      console.log("SpokenText: ",spokenText)
      sendTextToChatGPT(spokenText);
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
    <form className="relative h-full w-full overflow-hidden rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring">
      <Label htmlFor="message" className="sr-only">
        Message
      </Label>
      <Textarea
        id="message"
        placeholder="Start speaking to start..."
        className="min-h-12 resize-none border-0 p-3 shadow-none focus-visible:ring-0"
        value={text}
        readOnly
      />
      <div className="flex items-center p-3 pt-0">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button onClick={handleMicClick} variant="ghost" size="icon">
              <Mic className="size-4" />
              <span className="sr-only">Use Microphone</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">
            {isListening ? "Stop Listening" : "Use Microphone"}
          </TooltipContent>
        </Tooltip>
      </div>
      {/* Display the response from ChatGPT */}
      <div className="mt-4 p-3 border rounded-lg">
        <h3 className="font-bold">ChatGPT Response:</h3>
        <p>{response}</p>
      </div>
    </form>
  );
}
