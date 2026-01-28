"use client";

import HeroSection from "@/src/components/home/HeroSection";
import ProblemSection from "@/src/components/home/ProblemSection";
import SolutionSection from "@/src/components/home/SolutionSection";
import ManagerSection from "@/src/components/home/ManagerSection";
import BuyerSection from "@/src/components/home/BuyerSection";
import JoinCTASection from "@/src/components/home/JointCTASection";

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
