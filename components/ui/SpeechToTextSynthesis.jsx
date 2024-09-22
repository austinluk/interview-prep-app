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
import { useStore } from "./wrapper";

export default function TextToSpeech() {
  const score = useStore((state) => state.judge_score);
  const [text, setText] = useState("");
  const [voices, setVoices] = useState([]);
  const [response, setResponse] = useState("");
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const systemPrompt = `You are a interviewer for a software company, about to ask leetcode-style questions. Make a very short and concise introduction in first-person.`
  const [conversationHistory, setConversationHistory] = useState([]);
  const [code, setCode] = useState(""); // Add state to store code content
  
  // Check if the browser supports SpeechRecognition
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  let recognition;

  //send to ChatGPT
  const sendTextToChatGPT = async (inputText, isInit) => {
    try {
      const openai = new OpenAI({apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY, dangerouslyAllowBrowser: true});
      
      const messages = [
        { role: "system", content: systemPrompt },
        ...conversationHistory,
        { role: "user", content: inputText }
      ];
      
      const completion = await openai.chat.completions.create({
        messages: messages,
        model: "gpt-4o-mini" 
      });
    

      const newMessage = { role: "assistant", content: completion.choices[0].message.content };
      setConversationHistory([...conversationHistory, { role: "user", content: inputText }, newMessage]);
      setResponse(completion.choices[0].message.content);
      console.log("RESPONSE: ", completion.choices[0]);
      console.log(completion.choices[0].message.content);

      console.log("RESPONSE: ",completion.choices[0]);
      console.log(completion.choices[0].message.content);
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
    sendTextToChatGPT("", true);

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
      sendTextToChatGPT(spokenText, false);
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
      <Label>{score+"%"}</Label>
      <Textarea
        id="message"
        placeholder="Start speaking when you're ready..."
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
        <h3 className="font-bold">Your virtual interviewer:</h3>
        <p> {response} </p>
      </div>
    </form>
  );
}
