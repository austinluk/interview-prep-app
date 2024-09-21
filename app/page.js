import { Button } from "@/components/ui/button";
import CodeEditor from "@/components/ui/CodeEditor";
import SpeechToText from "@/components/ui/SpeechToTextSynthesis";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

import Image from "next/image";
import { Timer } from "@/components/ui/timer";

export default function Home() {
  return (
    <div className="h-screen flex flex-col p-2">
      <header className="mx-8 my-3 font-bold bg-muted p-5 rounded-2xl">
        <p className="text-2xl">Leet Me In</p>
      </header>
      <div className="flex-grow overflow-scroll">
        <ResizablePanelGroup direction="horizontal" className="w-full h-full">
          <ResizablePanel defaultSize={50}>
            <div className="h-full p-6 overflow-scroll">
              <CodeEditor />
            </div>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={50}>
            <Timer />
            <div className="h-full p-6">
              <TooltipProvider>
                <SpeechToText />
              </TooltipProvider>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
