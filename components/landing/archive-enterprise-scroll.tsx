"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Button } from "@/components/shadcn/button";
import { Badge } from "@/components/shadcn/badge";
import { COLORS } from "@/lib/constants/COLORS";
import { 
  Zap, 
  DollarSign, 
  Target, 
  Building2, 
  Users, 
  TrendingUp, 
  BarChart3, 
  Search, 
  FileText, 
  Rocket, 
  Phone, 
  Shield 
} from "lucide-react";

const sections = [
  {
    id: "hero",
    title: "AI-Native Investment Banking Platform",
    subtitle: "Replace traditional analysts with autonomous AI agents. Deliver results in weeks, not months.",
    type: "hero",
    color: "blue"
  },
  {
    id: "overview",
    title: "Three Dashboards, One Agentic Workflow",
    subtitle: "Finvase serves banks, clients, and investors with specialized interfaces tailored for specific workflows while powered by the same intelligent automation engine.",
    type: "overview",
    color: "purple"
  },
  {
    id: "comparison",
    title: "Traditional vs AI-Powered Banking",
    subtitle: "See how AI transforms investment banking operations",
    type: "comparison",
    color: "teal"
  },
  {
    id: "impact",
    title: "The Future of Investment Banking",
    subtitle: "Traditional banking requires armies of analysts working months on deals. Finvase's agents complete the same work in weeks with higher accuracy.",
    type: "impact",
    color: "orange"
  },
  {
    id: "features",
    title: "Everything You Need In One Platform",
    subtitle: "From deal sourcing to closure, Finvase provides all the tools investment banks need to operate efficiently in the AI era.",
    type: "features",
    color: "pink"
  },
  {
    id: "cta",
    title: "Ready to Transform Your Operations?",
    subtitle: "Start using Finvase to automate operations and deliver superior results to your clients.",
    type: "cta",
    color: "indigo"
  }
];

export function EnterpriseScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  return (
    <div 
      ref={containerRef} 
      className="relative bg-background"
      style={{ height: `${sections.length * 120}vh` }}
    >


      {/* Progress Navigation - Hidden on mobile */}
      <div className="hidden lg:fixed lg:left-6 lg:top-1/2 lg:transform lg:-translate-y-1/2 lg:z-50">
        <div className="bg-card/80 backdrop-blur-lg border border-border rounded-xl shadow-lg">
          <div className={`${COLORS.slate.light_variant_with_border.class} rounded-t-xl px-4 py-3`}>
            <span className="text-sm font-medium text-foreground">Navigation</span>
          </div>
          <div className="p-4 space-y-3">
            {sections.map((section, index) => {
              const start = index / sections.length;
              const end = (index + 1) / sections.length;
              const colorClass = COLORS[section.color as keyof typeof COLORS];
              
              return (
                <div key={index} className="flex items-center space-x-3">
                  <motion.div
                    className={`w-3 h-3 rounded-full ${colorClass.light_variant.class.includes('bg-') ? '' : 'bg-current'}`}
                    style={{
                      opacity: useTransform(
                        scrollYProgress,
                        [start - 0.05, start + 0.05, end - 0.05, end + 0.05],
                        [0.3, 1, 1, 0.3]
                      )
                    }}
                  />
                  <span className="text-xs text-muted-foreground font-medium">
                    {section.type === "hero" && "Introduction"}
                    {section.type === "overview" && "Platform"}
                    {section.type === "comparison" && "Comparison"}
                    {section.type === "impact" && "Impact"}
                    {section.type === "features" && "Features"}
                    {section.type === "cta" && "Get Started"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-0">
        {sections.map((section, index) => {
          const start = index / sections.length;
          const end = (index + 1) / sections.length;
          const mid = start + (end - start) / 2;
          const colorClass = COLORS[section.color as keyof typeof COLORS];
          
          // Make all sections visible for debugging
          const opacity = 1;

          const scale = 1;
          const y = 0;

          return (
            <div
              key={section.id}
              className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20"
            >
              
              <div className="w-full max-w-6xl mx-auto">
                
                {section.type === "hero" && (
                  <div className="text-center space-y-8 sm:space-y-12">
                    <div className={`${colorClass.light_variant_with_border.class} rounded-3xl p-8 sm:p-12 shadow-xl`}>
                      <div className="space-y-6 sm:space-y-8">
                        <div className="flex justify-center">
                          <Badge className={`${colorClass.light_variant.class} px-6 py-2 text-base flex items-center space-x-2`}>
                            <Rocket className="w-4 h-4" />
                            <span>AI-Native Platform</span>
                          </Badge>
                        </div>
                        <h1 className="text-4xl sm:text-6xl lg:text-8xl text-foreground leading-tight font-serif">
                          {section.title}
                        </h1>
                        <p className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                          {section.subtitle}
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12">
                          {[
                            { icon: Zap, stat: "10x Faster", desc: "Deal completion time" },
                            { icon: DollarSign, stat: "90% Savings", desc: "Operational costs" },
                            { icon: Target, stat: "99% Accuracy", desc: "AI-powered analysis" }
                          ].map((item, i) => {
                            const IconComponent = item.icon;
                            return (
                              <div key={i} className="text-center p-6 bg-background/50 rounded-xl">
                                <IconComponent className="w-8 h-8 mx-auto mb-3 text-primary" />
                                <div className="text-2xl text-foreground mb-1">{item.stat}</div>
                                <div className="text-sm text-muted-foreground">{item.desc}</div>
                              </div>
                            );
                          })}
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                          <Button size="lg" className="px-10 py-6 text-lg">
                            Get Started Free
                          </Button>
                          <Button variant="outline" size="lg" className="px-10 py-6 text-lg">
                            Watch Demo
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {section.type === "overview" && (
                  <div className="space-y-8 sm:space-y-12">
                    <div className={`${colorClass.light_variant_with_border.class} rounded-3xl shadow-xl overflow-hidden`}>
                      <div className={`${colorClass.light_variant.class} px-6 sm:px-8 py-6 sm:py-8`}>
                        <h2 className="text-3xl sm:text-5xl lg:text-7xl text-foreground mb-4 text-center font-serif">
                          {section.title}
                        </h2>
                        <p className="text-lg sm:text-xl text-muted-foreground text-center max-w-4xl mx-auto leading-relaxed">
                          {section.subtitle}
                        </p>
                      </div>
                      
                      <div className="p-6 sm:p-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                          {[
                            { 
                              name: "Bank Dashboard", 
                              desc: "Complete deal lifecycle management with AI-powered analytics and automated reporting", 
                              icon: Building2,
                              features: ["Deal Pipeline", "Analytics", "Reports", "Team Management"]
                            },
                            { 
                              name: "Client Dashboard", 
                              desc: "Real-time progress tracking with document access and seamless communication", 
                              icon: Users,
                              features: ["Progress Tracking", "Documents", "Updates", "Communication"]
                            },
                            { 
                              name: "Investor Dashboard", 
                              desc: "Investment opportunities discovery with portfolio management and insights", 
                              icon: TrendingUp,
                              features: ["Opportunities", "Portfolio", "Insights", "Performance"]
                            }
                          ].map((dashboard, i) => {
                            const IconComponent = dashboard.icon;
                            return (
                              <motion.div
                                key={dashboard.name}
                                className="bg-background border border-border rounded-2xl p-6 sm:p-8 hover:shadow-lg transition-all duration-300"
                                whileHover={{ scale: 1.02, y: -5 }}
                              >
                                <IconComponent className="w-12 h-12 mb-4 text-primary" />
                                <h3 className="text-xl sm:text-2xl text-foreground mb-3">{dashboard.name}</h3>
                                <p className="text-muted-foreground mb-6 leading-relaxed">{dashboard.desc}</p>
                                <div className="space-y-2">
                                  {dashboard.features.map((feature, idx) => (
                                    <div key={idx} className="flex items-center space-x-2">
                                      <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                                      <span className="text-sm text-muted-foreground">{feature}</span>
                                    </div>
                                  ))}
                                </div>
                              </motion.div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {section.type === "comparison" && (
                  <div className="space-y-8 sm:space-y-12">
                    <div className={`${colorClass.light_variant_with_border.class} rounded-3xl shadow-xl overflow-hidden`}>
                      <div className={`${colorClass.light_variant.class} px-6 sm:px-8 py-6 sm:py-8`}>
                        <h2 className="text-3xl sm:text-5xl lg:text-7xl text-foreground mb-4 text-center font-serif">
                          {section.title}
                        </h2>
                        <p className="text-lg sm:text-xl text-muted-foreground text-center max-w-4xl mx-auto">
                          {section.subtitle}
                        </p>
                      </div>
                      
                      <div className="p-6 sm:p-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                          <motion.div 
                            className={`${COLORS.red.light_variant_with_border.class} rounded-2xl p-8 relative overflow-hidden`}
                            whileHover={{ scale: 1.02 }}
                          >
                            <div className={`${COLORS.red.light_variant.class} rounded-xl p-4 mb-6 inline-block`}>
                              <span className="text-lg">Traditional Banking</span>
                            </div>
                            <div className="space-y-6">
                              {[
                                { label: "Timeline", value: "3-6 months", icon: "📅" },
                                { label: "Team Size", value: "10-20 analysts", icon: "👥" },
                                { label: "Cost Range", value: "$500K - $2M", icon: "💸" },
                                { label: "Accuracy", value: "85% typical", icon: "🎯" }
                              ].map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                                  <div className="flex items-center space-x-3">
                                    <span className="text-xl">{item.icon}</span>
                                    <span className="text-muted-foreground">{item.label}</span>
                                  </div>
                                  <span className="text-foreground">{item.value}</span>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                          
                          <motion.div 
                            className={`${COLORS.teal.light_variant_with_border.class} rounded-2xl p-8 relative overflow-hidden`}
                            whileHover={{ scale: 1.02 }}
                          >
                            <div className={`${COLORS.teal.light_variant.class} rounded-xl p-4 mb-6 inline-block`}>
                              <span className="text-lg">AI-Powered Finvase</span>
                            </div>
                            <div className="space-y-6">
                              {[
                                { label: "Timeline", value: "3-6 weeks", icon: "⚡" },
                                { label: "Team Size", value: "1 AI agent", icon: "🤖" },
                                { label: "Cost Range", value: "$50K - $200K", icon: "💰" },
                                { label: "Accuracy", value: "99% AI-powered", icon: "🎯" }
                              ].map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                                  <div className="flex items-center space-x-3">
                                    <span className="text-xl">{item.icon}</span>
                                    <span className="text-muted-foreground">{item.label}</span>
                                  </div>
                                  <span className="text-foreground">{item.value}</span>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {section.type === "impact" && (
                  <div className="space-y-8 sm:space-y-12">
                    <div className={`${colorClass.light_variant_with_border.class} rounded-3xl shadow-xl overflow-hidden`}>
                      <div className={`${colorClass.light_variant.class} px-6 sm:px-8 py-6 sm:py-8`}>
                        <h2 className="text-3xl sm:text-5xl lg:text-7xl text-foreground mb-4 text-center font-serif">
                          {section.title}
                        </h2>
                        <p className="text-lg sm:text-xl text-muted-foreground text-center max-w-4xl mx-auto leading-relaxed">
                          {section.subtitle}
                        </p>
                      </div>
                      
                      <div className="p-6 sm:p-8">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
                          {[
                            { metric: "10x", label: "Faster Delivery", desc: "Complete deals in weeks instead of months", icon: Zap, color: "orange" },
                            { metric: "90%", label: "Cost Reduction", desc: "Significantly lower operational costs", icon: DollarSign, color: "teal" },
                            { metric: "99%", label: "Accuracy Rate", desc: "AI-powered precision in analysis", icon: Target, color: "blue" }
                          ].map((item, i) => {
                            const itemColor = COLORS[item.color as keyof typeof COLORS];
                            const IconComponent = item.icon;
                            return (
                              <motion.div 
                                key={i} 
                                className={`${itemColor.light_variant_with_border.class} rounded-2xl p-6 sm:p-8 text-center relative overflow-hidden`}
                                whileHover={{ scale: 1.05, y: -10 }}
                              >
                                <IconComponent className="w-8 h-8 mx-auto mb-4 text-primary" />
                                <div className="text-5xl sm:text-6xl text-foreground mb-3">{item.metric}</div>
                                <div className="text-xl text-foreground mb-2">{item.label}</div>
                                <div className="text-muted-foreground leading-relaxed">{item.desc}</div>
                              </motion.div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {section.type === "features" && (
                  <div className="space-y-8 sm:space-y-12">
                    <div className={`${colorClass.light_variant_with_border.class} rounded-3xl shadow-xl overflow-hidden`}>
                      <div className={`${colorClass.light_variant.class} px-6 sm:px-8 py-6 sm:py-8`}>
                        <h2 className="text-3xl sm:text-5xl lg:text-7xl text-foreground mb-4 text-center font-serif">
                          {section.title}
                        </h2>
                        <p className="text-lg sm:text-xl text-muted-foreground text-center max-w-4xl mx-auto leading-relaxed">
                          {section.subtitle}
                        </p>
                      </div>
                      
                      <div className="p-6 sm:p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {[
                            { title: "AI-powered pitch deck creation", desc: "Generate professional presentations with intelligent content suggestions", icon: BarChart3 },
                            { title: "Automated financial modeling", desc: "Build complex financial models with automated data integration", icon: TrendingUp },
                            { title: "Market research integration", desc: "Access real-time market data and competitive intelligence", icon: Search },
                            { title: "Professional document formatting", desc: "Ensure consistent, professional formatting across all documents", icon: FileText }
                          ].map((feature, i) => {
                            const IconComponent = feature.icon;
                            return (
                              <motion.div
                                key={i}
                                className="bg-background border border-border rounded-2xl p-6 hover:shadow-lg transition-all duration-300"
                                whileHover={{ scale: 1.02, x: 5 }}
                              >
                                <div className="flex items-start space-x-4">
                                  <IconComponent className="w-8 h-8 text-primary mt-1" />
                                  <div>
                                    <h3 className="text-lg text-foreground mb-2">{feature.title}</h3>
                                    <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
                                  </div>
                                </div>
                              </motion.div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {section.type === "cta" && (
                  <div className="text-center space-y-8 sm:space-y-12">
                    <div className={`${colorClass.light_variant_with_border.class} rounded-3xl shadow-xl overflow-hidden`}>
                      <div className={`${colorClass.light_variant.class} px-6 sm:px-8 py-6 sm:py-8`}>
                        <h2 className="text-3xl sm:text-5xl lg:text-7xl text-foreground mb-4 font-serif">
                          {section.title}
                        </h2>
                        <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                          {section.subtitle}
                        </p>
                      </div>
                      <div className="p-8 sm:p-12">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
                          {[
                            { icon: Rocket, title: "Quick Setup", desc: "Get started in minutes" },
                            { icon: Phone, title: "Expert Support", desc: "Dedicated customer success" },
                            { icon: Shield, title: "Enterprise Security", desc: "Bank-grade security standards" }
                          ].map((item, i) => {
                            const IconComponent = item.icon;
                            return (
                              <div key={i} className="text-center p-4">
                                <IconComponent className="w-8 h-8 mx-auto mb-3 text-primary" />
                                <div className="text-foreground mb-1">{item.title}</div>
                                <div className="text-sm text-muted-foreground">{item.desc}</div>
                              </div>
                            );
                          })}
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                          <Button size="lg" className="px-12 py-6 text-lg">
                            Schedule Demo
                          </Button>
                          <Button variant="outline" size="lg" className="px-12 py-6 text-lg">
                            Start Free Trial
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}