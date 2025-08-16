import { Button } from "@/components/shadcn/button";
import { Badge } from "@/components/shadcn/badge";
import { COLORS } from "@/lib/constants/COLORS";
import { Zap, DollarSign, Target } from "lucide-react";
import { cn } from "@/lib/utils";

export function HeroSection() {
  return (
    <div className="text-center space-y-8 sm:space-y-12">
      <div className="bg-card border border-border rounded-3xl p-8 sm:p-12 shadow-xl">
        <div className="space-y-6 sm:space-y-8">
          <div className="flex justify-center">
            <Badge variant="light" color="orange" className="text-sm">
              <span>Finvase</span>
            </Badge>
          </div>
          <h1 className="text-4xl sm:text-6xl lg:text-8xl text-foreground leading-tight font-serif">
            A<em>I</em>-Nat<em>i</em>ve Investme<em>n</em>t Bank<em>i</em>ng Platfo<em>r</em>m
          </h1>
          <p className="text-lg  text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Replace traditional analysts with autonomous AI agents. Deliver
            results in weeks, not months.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center ">
            <Button>Get Started Free</Button>
            <Button variant="outline">Watch Demo</Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12">
            {[
              { icon: Zap, stat: "10x Faster", desc: "Deal completion time" },
              {
                icon: DollarSign,
                stat: "90% Savings",
                desc: "Operational costs",
              },
              {
                icon: Target,
                stat: "99% Accuracy",
                desc: "AI-powered analysis",
              },
            ].map((item, i) => {
              const IconComponent = item.icon;
              return (
                <div
                  key={i}
                  className={cn(
                    "text-center p-6  border shadow-xl rounded-xl",
                    COLORS.blue.light_variant_with_border.class
                  )}
                >
                  <IconComponent className="w-8 h-8 mx-auto mb-3" />
                  <div className="text-sm sm:text-lg mb-1 font-serif">{item.stat}</div>
                  <div className="text-sm text-muted-foreground">
                    {item.desc}
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
