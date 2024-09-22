"use client";

import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "./resizable";
import { Timer } from "./timer";
import { TooltipProvider } from "./tooltip";
import SpeechToText from "./SpeechToTextSynthesis";
import CodeEditor from "./CodeEditor";
import { create } from "zustand";

export const useStore = create((set) => ({
  text: "",
  response: "",
  isListening: false,
  judge_score: 0,
  question: "",
  code: "",
  conversationHistory: [],
  micClicks: 0,
  setText: (newText) => set({ text: newText }),
  setResponse: (newResponse) => set({ response: newResponse }),
  setIsListening: (value) => set({ isListening: value }),
  setJudgeScore: (score) => set({ judge_score: score }),
  setQuestion: (newQ) => set({ question: newQ }),
  setCode: (newCode) => set({ code: newCode }),
  setConversationHistory: (newHistory) => set({ history: newHistory }),
  setMicClicks: (clicks) => set({ micClicks: clicks }),
  incrementMicClicks: () =>
    set((state) => ({ micClicks: state.micClicks + 1 })),
}));

export default function MainContent() {
  return (
    <ResizablePanelGroup direction="horizontal" className="w-full h-full">
      <ResizablePanel defaultSize={70}>
        <div className="h-full p-6 overflow-scroll">
          <CodeEditor />
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={30}>
        <Timer />
        <div className="h-full p-6">
          <TooltipProvider>
            <SpeechToText />
          </TooltipProvider>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
