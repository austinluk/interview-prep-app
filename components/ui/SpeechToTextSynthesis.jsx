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
  // Global states
  const judgeScore = useStore((state) => state.judge_score);
  const question = useStore((state) => state.question);
  const code = useStore((state) => state.code);
  const conversationHistory_GLOBAL = useStore((state) => state.history);
  const setConversationHistory_GLOBAL = useStore(
    (state) => state.setConversationHistory
  );
  const response_GLOBAL = useStore((state) => state.response);
  const setResponse_GLOBAL = useStore((state) => state.setResponse);
  const micClicks = useStore((state) => state.micClicks);
  const setMicClicks = useStore((state) => state.setMicClicks);
  const incrementMicClicks = useStore((state) => state.incrementMicClicks);

  // const micClicks_GLOBAL = useStore((state) => state.micClicks);
  // const setMicClicks_GLOBAL = useStore((state) => state.setMicClicks);

  // console.log("HHISTORY:", conversationHistory);
  // Local states
  const [text, setText] = useState("");
  const [voices, setVoices] = useState([]);
  // const [micClicks, setMicClicks] = useState(0);
  // const [response, setResponse] = useState("");
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const systemPrompt =
    `You're name is John. You are a interviewer for a software company, about to ask leetcode-style questions. Make a very short and concise introduction in first-person. Here is the question: ` +
    question +
    "\n The candidate already knows the question, so you can start the interview directly. So don't state any parts of the question, including the function name. DON'T GIVE SOLUTIONS UNDER ANY CIRCUMSTANCES!";
  const [conversationHistory, setConversationHistory] = useState([]);

  console.log("INITIAL QUESTION FROM EDITOR: ", question);
  console.log("CODE: ", code);
  console.log("HHISTORY:", conversationHistory);
  setConversationHistory_GLOBAL(conversationHistory);
  console.log("GLOBAL HISTORY:", conversationHistory_GLOBAL);

  // Check if the browser supports SpeechRecognition
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  let recognition;

  // Send user speech to ChatGPT
  const sendSpeechToGPT = async (inputText) => {
    try {
      const openai = new OpenAI({
        apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
        dangerouslyAllowBrowser: true,
      });

      console.log("sending CONVERSATION HISTORY:", conversationHistory);

      const messages = [
        { role: "system", content: systemPrompt },
        ...conversationHistory,

        { role: "user", content: inputText },
      ];

      const completion = await openai.chat.completions.create({
        messages: messages,
        model: "gpt-4o-mini",
      });

      const newMessage = {
        role: "assistant",
        content: completion.choices[0].message.content,
      };
      setConversationHistory([
        { role: "system", content: systemPrompt },
        ...(conversationHistory_GLOBAL || conversationHistory),
        { role: "user", content: inputText },
        newMessage,
      ]);
      setConversationHistory_GLOBAL(conversationHistory);

      setResponse_GLOBAL(completion.choices[0].message.content);
      console.log("VOICE RESPONSE: ", completion.choices[0]);
      console.log("CCCCCONVERSATION HISTORY SPEECH:", conversationHistory);
      console.log(
        "GLOBAL CONVERSATION HISTORY SPEECH:",
        conversationHistory_GLOBAL
      );
      console.log(completion.choices[0].message.content);
    } catch (error) {
      console.error("Error sending text to ChatGPT:", error);
      setResponse_GLOBAL("Error occurred while contacting ChatGPT.");
    }
  };

  // Process speech
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
    sendSpeechToGPT("");
  }, []);

  const handleMicClick = (event) => {
    event.preventDefault(); // Prevent the default form submission
    incrementMicClicks();
    console.log("CLICKS:", micClicks);

    if (isListening) {
      recognition.stop();
      setIsListening(false);
      // setMicClicks((prevClicks) => prevClicks + 1);
      // console.log();
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

      console.log("SpokenText: ", spokenText);
      sendSpeechToGPT(spokenText, false);
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
    <form className="flex flex-col h-full w-full overflow-hidden rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring">
      <div className="h-1/2">
        {/* <Label>{judgeScore + "%" + " " + micClicks}</Label> */}
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
              <Button onClick={handleMicClick} variant="outline" size="icon">
                <Mic className="size-4" />
                <span className="sr-only">Use Microphone</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">
              {isListening ? "Stop Listening" : "Use Microphone"}
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
      {/* Display the response from ChatGPT */}
      <div className="flex flex-col p-3 border rounded-lg h-1/2 overflow-scroll text-wrap">
        <h3 className="font-bold">Your virtual interviewer:</h3>
        <p className=" break-words">{response_GLOBAL}</p>
      </div>
    </form>
  );
}
