import { Button } from "@/components/ui/button";
import CodeEditor from "@/components/ui/CodeEditor";
import TextToSpeech from "@/components/ui/text_to_speech";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

import Image from "next/image";
import { Timer } from "@/components/ui/timer";
import SpeechSynthesisComponent from "@/components/ui/SpeechToSpeechSynthesis";

export default function Home() {
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
          {/* <p></p> */}
          <p>Hello there</p>
          <div className="bg-blue-300">
            <SpeechSynthesisComponent />
          </div>
          <div className="flex h-full items-center justify-center p-6">
            <TooltipProvider>
              <TextToSpeech />
            </TooltipProvider>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
