import { HeroSection } from "./sections/hero-section";
import { OverviewSection } from "./sections/overview-section";
import { ComparisonSection } from "./sections/comparison-section";
import { ImpactSection } from "./sections/impact-section";
import { FeaturesSection } from "./sections/features-section";
import { CtaSection } from "./sections/cta-section";

export function SimpleScroll() {
  return (
    <div className="space-y-0">
      <div id="hero" className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20">
        <div className="w-full max-w-6xl mx-auto">
          <HeroSection />
        </div>
      </div>
      
      <div id="platform" className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20">
        <div className="w-full max-w-6xl mx-auto">
          <OverviewSection />
        </div>
      </div>
      
      <div id="comparison" className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20">
        <div className="w-full max-w-6xl mx-auto">
          <ComparisonSection />
        </div>
      </div>
      
      <div id="impact" className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20">
        <div className="w-full max-w-6xl mx-auto">
          <ImpactSection />
        </div>
      </div>
      
      <div id="features" className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20">
        <div className="w-full max-w-6xl mx-auto">
          <FeaturesSection />
        </div>
      </div>
      
      <div id="pricing" className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20">
        <div className="w-full max-w-6xl mx-auto">
          <CtaSection />
        </div>
      </div>
    </div>
  );
}