import Header from "@/components/Header/page";
import Image from "next/image";
import Hero from "./_home/Hero";
import Benefit from "./_home/Benefit";
import About from "./_home/About";
import Work from "./_home/Work";
import Bottom from "./_home/Bottom";
import Footer from "@/components/Footer/page";
import Chatbot from "@/components/ChatBot/page";

export default function Home() {
  return (
    <div className="bg-[#FFFFFF]">
      <Header />
      <div>
        <Hero />
      </div>
      <div className="mt-20">
        <Benefit />
      </div>
      <div className="mt-20">
        <About />
      </div>
      <div className="mt-20">
        <Work />
      </div>
      <div className="mt-20">
        <Bottom />
      </div>
      <div className="mt-10">
        <Footer />
      </div>

      
      <Chatbot />
    </div>
  );
}
