import { COLORS } from "@/lib/constants/COLORS";
import { Building2, Users, TrendingUp } from "lucide-react";

export function OverviewSection() {
  const colorClass = COLORS.purple;
  
  return (
    <div className="space-y-8 sm:space-y-12">
      <div className="bg-card border border-border rounded-3xl shadow-xl overflow-hidden">
        <div className={`${colorClass.light_variant.class} px-6 sm:px-8 py-6 sm:py-8`}>
          <h2 className="text-3xl sm:text-5xl lg:text-7xl text-foreground mb-4 text-center font-serif">
            Th<em>r</em>ee Dashboa<em>r</em>ds, O<em>n</em>e Age<em>n</em>tic Workf<em>l</em>ow
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground text-center max-w-4xl mx-auto leading-relaxed">
            Finvase serves banks, clients, and investors with specialized interfaces tailored for specific workflows while powered by the same intelligent automation engine.
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
                <div
                  key={dashboard.name}
                  className="bg-background border border-border rounded-2xl p-6 sm:p-8 hover:shadow-lg transition-all duration-300"
                >
                  <IconComponent className="w-12 h-12 mb-4" />
                  <h3 className="text-sm sm:text-lg text-foreground mb-3 font-serif">{dashboard.name}</h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">{dashboard.desc}</p>
                  <div className="space-y-2">
                    {dashboard.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}