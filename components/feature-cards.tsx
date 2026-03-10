import { Heart, Scale, Sparkles } from "lucide-react"

const features = [
  {
    icon: Heart,
    title: "Interest Analysis",
    description:
      "Our AI detects subtle cues in message patterns, response times, and language to measure genuine interest levels on both sides.",
    metrics: ["Response enthusiasm", "Conversation initiation", "Emotional investment"],
  },
  {
    icon: Scale,
    title: "Who Cares More",
    description:
      "Understand who holds the emotional leverage in your conversations. See the balance of investment and effort between both parties.",
    metrics: ["Message length ratios", "Question frequency", "Effort balance"],
  },
  {
    icon: Sparkles,
    title: "Future Predictions",
    description:
      "Based on conversation patterns and relationship science, get insights into where this connection might be heading.",
    metrics: ["Compatibility score", "Red flag detection", "Growth potential"],
  },
]

export function FeatureCards() {
  return (
    <section id="features" className="relative px-4 py-12 sm:px-6 sm:py-24">
      {/* Background accent */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/5 blur-[100px]" />
      
      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="mb-8 text-center sm:mb-16">
          <p className="mb-2 text-xs font-medium tracking-wider text-accent uppercase sm:mb-3 sm:text-sm">
            Features
          </p>
          <h2 className="mb-3 text-2xl font-bold tracking-tight sm:mb-4 sm:text-3xl md:text-4xl">
            Decode Every Conversation
          </h2>
          <p className="mx-auto max-w-2xl text-sm text-muted-foreground sm:text-base">
            Our AI analyzes thousands of data points to give you a complete picture of your relationship dynamics.
          </p>
        </div>

        <div className="grid gap-4 sm:gap-6 md:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-lg border border-border/50 bg-card/50 p-5 transition-all duration-300 hover:border-border hover:bg-card sm:rounded-xl sm:p-8"
            >
              {/* Hover glow */}
              <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div className="absolute top-0 left-1/2 h-px w-1/2 -translate-x-1/2 bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
              </div>

              <div className="relative z-10">
                <div className="mb-4 inline-flex rounded-lg bg-secondary p-2.5 sm:mb-6 sm:p-3">
                  <feature.icon className="h-5 w-5 text-accent sm:h-6 sm:w-6" />
                </div>

                <h3 className="mb-2 text-lg font-semibold sm:mb-3 sm:text-xl">{feature.title}</h3>
                <p className="mb-4 text-sm leading-relaxed text-muted-foreground sm:mb-6">
                  {feature.description}
                </p>

                <div className="space-y-1.5 sm:space-y-2">
                  {feature.metrics.map((metric, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <div className="h-1 w-1 rounded-full bg-accent" />
                      {metric}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
