"use client"

import { useState, useCallback } from "react"
import { Upload, ImageIcon, X, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAnalysis } from "@/components/analysis-context"

export function UploadZone() {
  const [isDragging, setIsDragging] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const { setResult, isLoading, setIsLoading, setError } = useAnalysis()

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const droppedFiles = Array.from(e.dataTransfer.files).filter((file) => file.type.startsWith("image/"))
    setFiles((prev) => [...prev, ...droppedFiles].slice(0, 10))
  }, [])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files).filter((file) => file.type.startsWith("image/"))
      setFiles((prev) => [...prev, ...selectedFiles].slice(0, 10))
    }
  }, [])

  const removeFile = useCallback((index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }, [])

  const handleAnalyze = useCallback(async () => {
    if (files.length === 0 || isLoading) return

    const fileToAnalyze = files[0]

    const formData = new FormData()
    formData.append("file", fileToAnalyze)

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        let message = "Failed to analyze your screenshots."
        try {
          const errorBody = await response.json()
          if (errorBody?.error) {
            message = errorBody.error
          }
        } catch {
          // ignore JSON parse errors
        }
        throw new Error(message)
      }

      const data = await response.json()

      setResult({
        score: typeof data.score === "number" ? data.score : 0,
        scoreText: typeof data.scoreText === "string" ? data.scoreText : "",
        verdict: typeof data.verdict === "string" ? data.verdict : "",
        likeLikelihood: typeof data.likeLikelihood === "number" ? data.likeLikelihood : 0,
        likeStatus: typeof data.likeStatus === "string" ? data.likeStatus : "",
        whoCaresMore: typeof data.whoCaresMore === "string" ? data.whoCaresMore : "Unknown",
        redFlagIndex:
          data.redFlagIndex === "High" || data.redFlagIndex === "Medium" || data.redFlagIndex === "Low"
            ? data.redFlagIndex
            : "Low",
        flagSignals: Array.isArray(data.flagSignals) ? data.flagSignals.map(String) : [],
        signals: Array.isArray(data.signals) ? data.signals.map(String) : [],
        insights: Array.isArray(data.insights) ? data.insights.map(String) : [],
      })
    } catch (error) {
      console.error(error)
      setError(error instanceof Error ? error.message : "Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }, [files, isLoading, setError, setIsLoading, setResult])

  return (
    <section id="how-it-works" className="relative px-4 py-8 sm:px-6 sm:py-16 md:py-24">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 text-center sm:mb-12">
          <h2 className="mb-2 text-xl font-bold tracking-tight sm:mb-4 sm:text-3xl md:text-4xl">
            Upload Your Screenshots
          </h2>
          <p className="text-sm text-muted-foreground sm:text-base">
            Drag and drop your chat screenshots below. We support WhatsApp, iMessage, Telegram, and more.
          </p>
        </div>

        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative rounded-xl border-2 border-dashed transition-all duration-300 ${
            isDragging
              ? "border-accent bg-accent/5 scale-[1.02]"
              : "border-border/50 bg-card/50 hover:border-border hover:bg-card"
          }`}
        >
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="absolute inset-0 z-10 cursor-pointer opacity-0"
            aria-label="Upload chat screenshots"
          />

          <div className="flex flex-col items-center justify-center px-4 py-10 sm:px-6 sm:py-16 md:py-24">
            <div
              className={`mb-4 rounded-full p-3 transition-colors sm:mb-6 sm:p-4 ${
                isDragging ? "bg-accent/20" : "bg-secondary"
              }`}
            >
              <Upload
                className={`h-6 w-6 transition-colors sm:h-8 sm:w-8 ${
                  isDragging ? "text-accent" : "text-muted-foreground"
                }`}
              />
            </div>

            <h3 className="mb-2 text-base font-semibold sm:text-xl">
              {isDragging ? "Drop your screenshots here" : "Drag & drop screenshots"}
            </h3>
            <p className="mb-4 text-sm text-muted-foreground sm:mb-6 sm:text-base">
              or tap to browse from your device
            </p>

            <div className="flex flex-wrap justify-center gap-2 text-xs text-muted-foreground sm:gap-3">
              <span className="rounded-full bg-secondary px-2 py-1 sm:px-3">PNG</span>
              <span className="rounded-full bg-secondary px-2 py-1 sm:px-3">JPG</span>
              <span className="rounded-full bg-secondary px-2 py-1 sm:px-3">WEBP</span>
              <span className="rounded-full bg-secondary px-2 py-1 sm:px-3">Up to 10 images</span>
            </div>
          </div>
        </div>

        {files.length > 0 && (
          <div className="mt-6">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {files.length} screenshot{files.length !== 1 ? "s" : ""} selected
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFiles([])}
                className="min-h-[44px] text-muted-foreground hover:text-foreground"
              >
                Clear all
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="group relative aspect-square overflow-hidden rounded-lg border border-border/50 bg-secondary"
                >
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Screenshot ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                  <button
                    onClick={() => removeFile(index)}
                    className="absolute top-2 right-2 rounded-full bg-background/80 p-1 opacity-0 transition-opacity group-hover:opacity-100"
                    aria-label={`Remove ${file.name}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                  <div className="absolute bottom-2 left-2">
                    <CheckCircle2 className="h-4 w-4 text-accent" />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-center">
              <Button
                size="lg"
                onClick={handleAnalyze}
                disabled={isLoading || files.length === 0}
                className="min-h-[48px] w-full bg-accent px-8 text-accent-foreground hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
              >
                <ImageIcon className="mr-2 h-4 w-4" />
                {isLoading
                  ? "Decoding your relationship chemistry..."
                  : `Analyze ${files.length} Screenshot${files.length !== 1 ? "s" : ""}`}
              </Button>
            </div>
          </div>
        )}

        <p className="mt-8 text-center text-sm text-muted-foreground">
          Your chats are processed securely and never stored or shared.
        </p>
      </div>
    </section>
  )
}

