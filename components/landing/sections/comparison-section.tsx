import { COLORS } from "@/lib/constants/COLORS";
import { Calendar, Users, DollarSign, Target, Zap, Bot } from "lucide-react";

export function ComparisonSection() {
  const colorClass = COLORS.teal;

  return (
    <div className="space-y-8 sm:space-y-12">
      <div className="bg-card border border-border rounded-3xl shadow-xl overflow-hidden">
        <div
          className={`${colorClass.light_variant.class} px-6 sm:px-8 py-6 sm:py-8`}
        >
          <h2 className="text-3xl sm:text-5xl lg:text-7xl text-foreground mb-4 text-center font-serif">
            Tradit<em>i</em>onal <em>v</em>s A<em>I</em>-Powe<em>r</em>ed Bank
            <em>i</em>ng
          </h2>
          <p className="text-lg text-muted-foreground text-center max-w-4xl mx-auto">
            See how AI transforms investment banking operations
          </p>
        </div>

        <div className="p-6 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div
              className={`${COLORS.red.light_variant_with_border.class} rounded-2xl p-8 relative overflow-hidden`}
            >
              <div
                className={`${COLORS.red.light_variant.class} rounded-xl p-4 mb-6 inline-block`}
              >
                <span className="text-lg font-serif">Traditional Banking</span>
              </div>
              <div className="space-y-3">
                {[
                  { label: "Timeline", value: "3-6 months", icon: Calendar },
                  { label: "Team Size", value: "10-20 analysts", icon: Users },
                  {
                    label: "Cost Range",
                    value: "$500K - $2M",
                    icon: DollarSign,
                  },
                  { label: "Accuracy", value: "85% typical", icon: Target },
                ].map((item, idx) => {
                  const IconComponent = item.icon;
                  return (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-6 bg-background/50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <IconComponent className="w-5 h-5" />
                        <span className="text-muted-foreground">
                          {item.label}
                        </span>
                      </div>
                      <span className="text-foreground font-serif">
                        {item.value}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div
              className={`${COLORS.teal.light_variant_with_border.class} rounded-2xl p-8 relative overflow-hidden`}
            >
              <div
                className={`${COLORS.teal.light_variant.class} rounded-xl p-4 mb-6 inline-block`}
              >
                <span className="text-lg font-serif">AI-Powered Finvase</span>
              </div>
              <div className="space-y-3">
                {[
                  { label: "Timeline", value: "3-6 weeks", icon: Zap },
                  { label: "Team Size", value: "1 AI agent", icon: Bot },
                  {
                    label: "Cost Range",
                    value: "$50K - $200K",
                    icon: DollarSign,
                  },
                  { label: "Accuracy", value: "99% AI-powered", icon: Target },
                ].map((item, idx) => {
                  const IconComponent = item.icon;
                  return (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-6 bg-background/50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <IconComponent className="w-5 h-5" />
                        <span className="text-muted-foreground">
                          {item.label}
                        </span>
                      </div>
                      <span className="text-foreground font-serif">
                        {item.value}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
