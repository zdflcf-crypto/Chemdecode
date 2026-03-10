import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { UploadZone } from "@/components/upload-zone"
import { FeatureCards } from "@/components/feature-cards"
import { SampleReport } from "@/components/sample-report"
import { Footer } from "@/components/footer"
import { AnalysisProvider } from "@/components/analysis-context"

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Header />
      <HeroSection />
      <AnalysisProvider>
        <UploadZone />
        <SampleReport />
      </AnalysisProvider>
      <FeatureCards />
      <Footer />
    </main>
  )
}
