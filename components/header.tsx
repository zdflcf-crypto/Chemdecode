import { FlaskConical } from "lucide-react"

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center px-6">
        <div className="flex items-center gap-2">
          <FlaskConical className="h-6 w-6 text-accent" />
          <span className="text-lg font-semibold tracking-tight">ChemDecode</span>
        </div>
      </div>
    </header>
  )
}
