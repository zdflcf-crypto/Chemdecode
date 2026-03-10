import { FlaskConical } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border/50 px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-2">
            <FlaskConical className="h-5 w-5 text-accent" />
            <span className="font-semibold">ChemDecode</span>
          </div>
          
          <nav className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <a href="#" className="transition-colors hover:text-foreground">Privacy</a>
            <a href="#" className="transition-colors hover:text-foreground">Terms</a>
            <a href="#" className="transition-colors hover:text-foreground">FAQ</a>
            <a href="#" className="transition-colors hover:text-foreground">Contact</a>
          </nav>
          
          <p className="text-sm text-muted-foreground">
            © 2026 ChemDecode. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
