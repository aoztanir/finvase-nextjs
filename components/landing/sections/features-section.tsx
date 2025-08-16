import { COLORS } from "@/lib/constants/COLORS";
import { BarChart3, TrendingUp, Search, FileText } from "lucide-react";

export function FeaturesSection() {
  const colorClass = COLORS.pink;
  
  return (
    <div className="space-y-8 sm:space-y-12">
      <div className="bg-card border border-border rounded-3xl shadow-xl overflow-hidden">
        <div className={`${colorClass.light_variant.class} px-6 sm:px-8 py-6 sm:py-8`}>
          <h2 className="text-3xl sm:text-5xl lg:text-7xl text-foreground mb-4 text-center font-serif">
            Every<em>t</em>hing Y<em>o</em>u Ne<em>e</em>d I<em>n</em> O<em>n</em>e Platf<em>o</em>rm
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground text-center max-w-4xl mx-auto leading-relaxed">
            From deal sourcing to closure, Finvase provides all the tools investment banks need to operate efficiently in the AI era.
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
                <div
                  key={i}
                  className="bg-background border border-border rounded-2xl p-6 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-start space-x-4">
                    <IconComponent className="w-8 h-8 mt-1" />
                    <div>
                      <h3 className="text-sm sm:text-lg text-foreground mb-2 font-serif">{feature.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
                    </div>
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