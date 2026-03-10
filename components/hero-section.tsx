import { Sparkles } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative flex flex-col items-center justify-center overflow-hidden px-4 pt-20 pb-4 sm:px-6 sm:pt-28 sm:pb-8">
      {/* Subtle grid background */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
      
      {/* Glow effect */}
      <div className="pointer-events-none absolute top-1/4 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-accent/10 blur-[128px]" />
      
      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border/50 bg-secondary/50 px-3 py-1 text-xs sm:mb-6 sm:px-4 sm:py-1.5 sm:text-sm text-muted-foreground">
          <Sparkles className="h-3 w-3 text-accent sm:h-4 sm:w-4" />
          <span>AI-Powered Relationship Analysis</span>
        </div>
        
        <h1 className="mb-4 text-balance text-2xl font-bold tracking-tight sm:mb-6 sm:text-4xl md:text-5xl lg:text-6xl">
          Stop Guessing.
          <br />
          <span className="text-accent">Decode the Chemistry in Your Chats.</span>
        </h1>
        
        <p className="mx-auto max-w-2xl text-balance text-sm text-muted-foreground sm:text-lg md:text-xl">
          Upload your chat screenshots and let our AI analyze the hidden patterns, 
          emotional dynamics, and chemistry between you and anyone you&apos;re talking to.
        </p>
      </div>
    </section>
  )
}
