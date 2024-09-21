"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import CodeEditor from "@/components/ui/CodeEditor";
import SpeechToText from "@/components/ui/SpeechToTextSynthesis";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

import { Timer } from "@/components/ui/timer";
import Image from "next/image";

export default function Home() {

  const [progress, setProgress] = useState(0); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const getLetterGrade = () => {
    if (progress >= 90) return "A";
    if (progress >= 80) return "B";
    if (progress >= 70) return "C";
    if (progress >= 60) return "D";
    return "F";
  };

  return (
    <div className="">
      <ResizablePanelGroup direction="horizontal" className="w-full">
        <ResizablePanel defaultSize={50}>
          <div className="flex h-full items-center justify-center p-6">
            <CodeEditor />
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={50}>
          <Timer />
          <div className="flex h-full items-center justify-center p-6">
            <TooltipProvider>
              <SpeechToText />
            </TooltipProvider>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>


      <div className="fixed bottom-4 right-4">
        <Button onClick={() => setIsModalOpen(true)}>Open Progress Tracker</Button>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-xl font-bold">Your Progress</h2>
            <div className="h-2 bg-gray-200 rounded">
              <div
                className="h-full bg-blue-500 rounded"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="mt-2 text-lg">Progress: {progress}%</p>
            <p className="text-lg font-semibold">Grade: {getLetterGrade()}</p>
            <div className="mt-2">
              {/* instead of having them as buttons have the ai auto increment it as you are solving the question */}
              <Button onClick={() => setProgress(progress < 100 ? progress + 10 : 100)}>Increase Progress</Button>
              <Button onClick={() => setProgress(progress > 0 ? progress - 10 : 0)}>Decrease Progress</Button>
            </div><br></br>
            <div> 
              <p>report: asdasd</p>
            </div>
            <div className="mt-4">
              <Button onClick={() => setIsModalOpen(false)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
