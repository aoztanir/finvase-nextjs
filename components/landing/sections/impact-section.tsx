import { COLORS } from "@/lib/constants/COLORS";
import { Zap, DollarSign, Target } from "lucide-react";

export function ImpactSection() {
  const colorClass = COLORS.orange;
  
  return (
    <div className="space-y-8 sm:space-y-12">
      <div className="bg-card border border-border rounded-3xl shadow-xl overflow-hidden">
        <div className={`${colorClass.light_variant.class} px-6 sm:px-8 py-6 sm:py-8`}>
          <h2 className="text-3xl sm:text-5xl lg:text-7xl text-foreground mb-4 text-center font-serif">
            T<em>h</em>e Fu<em>t</em>ure <em>o</em>f Invest<em>m</em>ent Bank<em>i</em>ng
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground text-center max-w-4xl mx-auto leading-relaxed">
            Traditional banking requires armies of analysts working months on deals. Finvase's agents complete the same work in weeks with higher accuracy.
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
                <div 
                  key={i} 
                  className={`${itemColor.light_variant_with_border.class} rounded-2xl p-6 sm:p-8 text-center relative overflow-hidden`}
                >
                  <IconComponent className="w-8 h-8 mx-auto mb-4" />
                  <div className="text-5xl sm:text-6xl text-foreground mb-3 font-serif">{item.metric}</div>
                  <div className="text-sm sm:text-lg text-foreground mb-2 font-serif">{item.label}</div>
                  <div className="text-muted-foreground leading-relaxed">{item.desc}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}