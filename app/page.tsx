"use client";

import HeroSection from "@/components/home/HeroSection";
import ProblemSection from "@/components/home/ProblemSection";
import SolutionSection from "@/components/home/SolutionSection";
import ManagerSection from "@/components/home/ManagerSection";
import BuyerSection from "@/components/home/BuyerSection";
import JoinCTASection from "@/components/home/JointCTASection";

export default function HomePage() {
  return (
    <main className="bg-[#F7FBF8] w-full overflow-hidden">
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <ManagerSection />
      <BuyerSection />
      <JoinCTASection />
    </main>
  );
}
