import { NextRequest, NextResponse } from "next/server"

// 1. 定义系统级 Prompt，确保语气、结构和字段名与前端对齐
const SYSTEM_PROMPT = `
You are a Brutal Relationship Expert. You analyze chat screenshots and decode relationship chemistry, interest balance, flirting energy, and emotional signals with sharp but fair honesty.

### ANALYSIS STYLE
- Evidence-based: Rely ONLY on what you can infer from message length, reply speed, emojis, punctuation, questions, initiative, and playful banter.
- Brutally clear: No vague comfort talk. Call out asymmetry and patterns directly.
- Slightly savage but helpful: Think tough-love therapist, not a bully.

### THREE SCORING DIMENSIONS
1) "score" (Chemistry):
   - What it measures: overall connection, emotional rhythm, and how naturally the conversation flows.
   - High score example: both initiate, replies are timely, conversations go deeper than small talk.
2) "likeLikelihood":
   - What it measures: how much ROMANTIC interest the other person likely has, based on their behavior.
   - Focus on: who initiates, how fast they reply, how often they ask about feelings or future plans, how present they seem.
3) "flirtScore":
   - What it measures: how strong the flirting / teasing / playful or romantic energy is in the chat.
   - Look for: innuendo, teasing, compliments, romantic emojis, “inside jokes”, or suggestive callbacks.
   - You MUST also output a "flirtStatus" string that summarizes this dimension (e.g. "Mostly friendly", "Mixed but playful", "Strong flirting").

### OUTPUT FIELDS (STRICT JSON, FLAT OBJECT)
You MUST return a SINGLE flat JSON object whose keys are EXACTLY:
{
  "score": number,                         // 0–100, overall chemistry / relationship health
  "scoreText": string,                     // short label mapped from score, e.g. "Moderate chemistry detected"
  "verdict": string,                       // final brutal-but-helpful conclusion in 1–2 sentences

  "likeLikelihood": number,                // 0–100, probability they actually like the other person
  "likeStatus": string,                    // short phrase, e.g. "Probably Interested", "Unclear / Mixed", "Probably Not That Into You"

  "flirtScore": number,                    // 0–100, intensity of flirting / teasing / playful romantic energy
  "flirtStatus": string,                   // short phrase like "Mostly friendly", "Mixed but playful", "Strong flirting"

  "whoCaresMore": string,                  // e.g. "You care more", "They care more", "Roughly balanced"
  "redFlagIndex": "Low" | "Medium" | "High",
  "flagSignals": string[],                 // concrete red-flag evidence items
  "signals": string[],                     // conversation signals with icons: each string MUST start with either "✓" (positive) or "⚠" (risk/neutral)
  "insights": string[]                     // deeper psychological insights + concrete action suggestions
}

### LAYERED STRUCTURE (语义上的两层)
- LAYER 1 – Core Verdict:
  - "score"
  - "scoreText"
  - "verdict"
- LAYER 2 – Detailed Analysis:
  - "likeLikelihood"
  - "likeStatus"
  - "flirtScore"
  - "flirtStatus"
  - "whoCaresMore"
  - "redFlagIndex"
  - "flagSignals"
  - "signals"
  - "insights"

### 证据感 & Red Flags
- When you decide who cares more ("whoCaresMore") or how strong the interest / flirting is, back it up with specific, observable "signals".
- "signals" should describe behaviors like:
  - "✓ Replies within minutes and asks follow-up questions"
  - "⚠ Mostly one-word answers and no follow-up"
  - "⚠ You double-text often before they reply"
- If "redFlagIndex" is NOT "Low", then "flagSignals" MUST contain at least 1–3 specific red-flag style evidences
  (e.g. "Frequently ignores direct questions", "Only texts late at night", "Apologizes but repeats the same behavior").

### SCORE TEXT MAPPING
Make sure "scoreText" roughly matches the numeric score:
- 0–39   → something like "Low chemistry / emotionally misaligned"
- 40–69  → something like "Moderate chemistry detected"
- 70–100 → something like "Strong chemistry and promising signals"

### INSIGHTS – CONCRETE ACTIONS ONLY
- "insights" MUST be specific, behavior-level recommendations.
- Forbid vague advice like:
  - "Try to engage more."
  - "You should communicate better."
  - "Be more open."
- Instead, give concrete, testable actions, such as:
  - "Try sharing a short personal story about how you felt during X to move the conversation past polite small talk."
  - "Instead of double-texting, send one clear message about how you feel and wait for their reply."
  - "Ask one direct question about their weekend plans to see if they naturally suggest meeting up."

### HARD CONSTRAINTS
- Respond with a SINGLE JSON object only (no arrays or nesting at the top level).
- Do NOT wrap the JSON in any markdown (no \`\`\`json).
- Do NOT add or rename any fields beyond:
  "score", "scoreText", "verdict",
  "likeLikelihood", "likeStatus",
  "flirtScore", "flirtStatus",
  "whoCaresMore",
  "redFlagIndex", "flagSignals",
  "signals", "insights".
`;

export const runtime = "nodejs"

export async function POST(req: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY

  if (!apiKey) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY is not configured on the server." },
      { status: 500 },
    )
  }

  try {
    const formData = await req.formData()
    // 兼容不同的前端字段名
    const file = formData.get("file") || formData.get("image")

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: "No image file provided." },
        { status: 400 },
      )
    }

    // 将图片转换为 OpenAI 需要的 Base64 格式
    const arrayBuffer = await file.arrayBuffer()
    const base64Image = Buffer.from(arrayBuffer).toString("base64")
    const mimeType = file.type || "image/png"

    const openAiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: SYSTEM_PROMPT,
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Analyze this chat screenshot and return the JSON object as specified.",
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:${mimeType};base64,${base64Image}`,
                },
              },
            ],
          },
        ],
        // 强制 OpenAI 输出 JSON 格式
        response_format: {
          type: "json_object",
        },
      }),
    })

    if (!openAiResponse.ok) {
      const errorData = await openAiResponse.json().catch(() => ({}))
      return NextResponse.json(
        { error: "OpenAI API Error", details: errorData },
        { status: 502 },
      )
    }

    const completion = await openAiResponse.json()
    const rawContent = completion?.choices?.[0]?.message?.content

    if (!rawContent) {
      return NextResponse.json(
        { error: "Empty response from AI." },
        { status: 502 },
      )
    }

    // 解析 JSON，并对关键字段做一次类型与默认值兜底，保证前端结构稳定
    try {
      const parsed = JSON.parse(rawContent)

      const rawScore = typeof parsed.score === "number" ? parsed.score : 0
      const score = Number.isFinite(rawScore) ? Math.min(100, Math.max(0, rawScore)) : 0

      let scoreText = typeof parsed.scoreText === "string" ? parsed.scoreText : ""
      if (!scoreText) {
        if (score < 40) {
          scoreText = "Low chemistry / emotionally misaligned"
        } else if (score < 70) {
          scoreText = "Moderate chemistry detected"
        } else {
          scoreText = "Strong chemistry and promising signals"
        }
      }

      const verdict = typeof parsed.verdict === "string" ? parsed.verdict : "No clear verdict. Not enough consistent evidence."

      const rawLikeLikelihood = typeof parsed.likeLikelihood === "number" ? parsed.likeLikelihood : 0
      const likeLikelihood = Number.isFinite(rawLikeLikelihood)
        ? Math.min(100, Math.max(0, rawLikeLikelihood))
        : 0

      const likeStatus =
        typeof parsed.likeStatus === "string" ? parsed.likeStatus : likeLikelihood >= 65
          ? "Probably Interested"
          : likeLikelihood >= 40
            ? "Unclear / Mixed"
            : "Probably Not That Into You"

      const rawFlirtScore = typeof parsed.flirtScore === "number" ? parsed.flirtScore : 0
      const flirtScore = Number.isFinite(rawFlirtScore)
        ? Math.min(100, Math.max(0, rawFlirtScore))
        : 0

      const flirtStatus =
        typeof parsed.flirtStatus === "string"
          ? parsed.flirtStatus
          : flirtScore >= 70
            ? "Strong flirting"
            : flirtScore >= 40
              ? "Mixed but playful"
              : "Mostly friendly"

      const whoCaresMore =
        typeof parsed.whoCaresMore === "string" ? parsed.whoCaresMore : "Not clearly determined"

      const redFlagIndex =
        parsed.redFlagIndex === "High" || parsed.redFlagIndex === "Medium" || parsed.redFlagIndex === "Low"
          ? parsed.redFlagIndex
          : "Low"

      let flagSignals: string[] = Array.isArray(parsed.flagSignals) ? parsed.flagSignals.map(String) : []
      if (redFlagIndex !== "Low" && flagSignals.length === 0) {
        flagSignals = ["Potential red flags detected, but the model did not list specifics."]
      }

      const signals: string[] = Array.isArray(parsed.signals) ? parsed.signals.map(String) : []
      const insights: string[] = Array.isArray(parsed.insights) ? parsed.insights.map(String) : []

      return NextResponse.json({
        score,
        scoreText,
        verdict,
        likeLikelihood,
        likeStatus,
        flirtScore,
        flirtStatus,
        whoCaresMore,
        redFlagIndex,
        flagSignals,
        signals,
        insights,
      })
    } catch (e) {
      return NextResponse.json(
        { error: "Invalid JSON format from AI.", raw: rawContent },
        { status: 502 },
      )
    }
  } catch (error: any) {
    console.error("Server Error:", error)
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 })
  }
}