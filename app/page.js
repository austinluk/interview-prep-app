import { Button } from "@/components/ui/button";
import { Timer } from "@/components/ui/timer";
import Image from "next/image";

export default function Home() {
  return (
    <div className="bg-background">
      <div>Hello</div>
      <Button>Click me</Button>
      <Timer />

    </div>
  );
}
