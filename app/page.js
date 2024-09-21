import { Button } from "@/components/ui/button";
import CodeEditor from "@/components/ui/CodeEditor";

import Image from "next/image";

export default function Home() {
  return (
    <div className="bg-background">
      <CodeEditor width="60vw" /> 
    </div>
  );
}
