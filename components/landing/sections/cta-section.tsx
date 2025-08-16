import { Button } from "@/components/shadcn/button";
import { COLORS } from "@/lib/constants/COLORS";
import { Rocket, Phone, Shield } from "lucide-react";

export function CtaSection() {
  const colorClass = COLORS.indigo;
  
  return (
    <div className="text-center space-y-8 sm:space-y-12">
      <div className="bg-card border border-border rounded-3xl shadow-xl overflow-hidden">
        <div className={`${colorClass.light_variant.class} px-6 sm:px-8 py-6 sm:py-8`}>
          <h2 className="text-3xl sm:text-5xl lg:text-7xl text-foreground mb-4 font-serif">
            Rea<em>d</em>y <em>t</em>o Transf<em>o</em>rm Y<em>o</em>ur Operat<em>i</em>ons?
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Start using Finvase to automate operations and deliver superior results to your clients.
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
                  <IconComponent className="w-8 h-8 mx-auto mb-3" />
                  <div className="text-sm sm:text-base text-foreground mb-1 font-serif">{item.title}</div>
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
  );
}