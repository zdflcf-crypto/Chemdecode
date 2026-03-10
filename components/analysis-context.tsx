"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

export type AnalysisResult = {
  score: number
  scoreText: string
  verdict: string
  likeLikelihood: number
  likeStatus: string
  flirtScore: number
  flirtStatus: string
  whoCaresMore: string
  redFlagIndex: "Low" | "Medium" | "High"
  flagSignals: string[]
  signals: string[]
  insights: string[]
} | null

type AnalysisContextValue = {
  result: AnalysisResult
  setResult: (result: AnalysisResult) => void
  isLoading: boolean
  setIsLoading: (value: boolean) => void
  error: string | null
  setError: (value: string | null) => void

  // --------- UI Enhancements for Analysis Results ----------
  // Layer 1: High-level summary
  getChemistryLevelText?: (score: number) => string // e.g., "Low chemistry detected"
  // Simple verdict card display (Final Verdict)
  finalVerdict?: string // e.g. "You’re emotionally over-invested in someone who’s half-scrolling you."
  // Layer 2: Detailed evidence
  signalsWithIcons?: { text: string; type: "good" | "warning" }[] // e.g. [{text: "...", type: "warning"}]
  // --------------------------------------------------------
}

const AnalysisContext = createContext<AnalysisContextValue | undefined>(undefined)

export function AnalysisProvider({ children }: { children: ReactNode }) {
  const [result, setResult] = useState<AnalysisResult>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  return (
    <AnalysisContext.Provider
      value={{
        result,
        setResult,
        isLoading,
        setIsLoading,
        error,
        setError,
      }}
    >
      {children}
    </AnalysisContext.Provider>
  )
}

export function useAnalysis() {
  const context = useContext(AnalysisContext)
  if (!context) {
    throw new Error("useAnalysis must be used within an AnalysisProvider")
  }
  return context
}

