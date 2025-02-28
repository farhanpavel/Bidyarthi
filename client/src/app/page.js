import Header from "@/components/Header/page";
import Image from "next/image";
import Hero from "./_home/Hero";

export default function Home() {
  return (
    <div>
      <Header />
      <div>
        <Hero />
      </div>
    </div>
  );
}
