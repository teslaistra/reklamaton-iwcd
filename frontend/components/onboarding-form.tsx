"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Loader2, Sparkles, Copy, ArrowRight, RotateCcw } from "lucide-react"

interface OnboardingResponse {
  questions?: string[]
  question?: string
  facts?: string[]
  bio?: {
    bioA: string
    bioB: string
  }
  openers?: string[]
}

export function OnboardingForm() {
  const [answers, setAnswers] = useState<string[]>([])
  const [currentAnswer, setCurrentAnswer] = useState("")
  const [currentQuestion, setCurrentQuestion] = useState("")
  const [questions, setQuestions] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<OnboardingResponse | null>(null)
  const [isFinalized, setIsFinalized] = useState(false)

  const startOnboarding = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: [] }),
      })

      const data = await response.json()
      if (data.questions && Array.isArray(data.questions) && data.questions.length > 0) {
        setQuestions(data.questions)
        setCurrentQuestion(data.questions[0])
        setResult(data)
      }
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const submitAnswer = async () => {
    if (!currentAnswer.trim()) return

    const newAnswers = [...answers, currentAnswer]
    setAnswers(newAnswers)
    setCurrentAnswer("")

    if (newAnswers.length < 5) {
      // Get next question
      setIsLoading(true)
      setCurrentQuestion("");
      try {
        const response = await fetch("/api/onboarding", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ answers: newAnswers }),
        })

        const data = await response.json()
        if (data.question) {
          setCurrentQuestion(data.question)
        }
      } catch (error) {
        console.error("Error:", error)
      } finally {
        setIsLoading(false)
      }
    } else if (newAnswers.length >= 5) {
      // Show finalize option
      setCurrentQuestion("")
    }
  }

  const finalizeProfile = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers, finalize: true }),
      })

      const data = await response.json()
      setResult(data)
      setIsFinalized(true)
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const restart = () => {
    setAnswers([])
    setCurrentAnswer("")
    setCurrentQuestion("")
    setQuestions([])
    setResult(null)
    setIsFinalized(false)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const progress = Math.min(((answers?.length || 0) / 5) * 100, 100)

  return (
    <div className="space-y-6">
      {!isFinalized && (
        <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-emerald-800">
            <Sparkles className="w-5 h-5" />
            Q&A Онбординг
          </CardTitle>
          <p className="text-sm text-emerald-600">Пройдите умное интервью для создания идеального профиля знакомств</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {(!questions || questions.length === 0) ? (
            <div className="text-center py-8">
              <div className="mb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Готовы создать идеальный профиль?</h3>
                <p className="text-gray-600 mb-6">
                  Ответьте на несколько вопросов, и мы создадим для вас персональную биографию и открывашки
                </p>
              </div>
              <Button
                onClick={startOnboarding}
                disabled={isLoading}
                className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-90 text-white font-medium px-8 py-3"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Загружаю вопросы...
                  </>
                ) : (
                  "Начать интервью"
                )}
              </Button>
            </div>
          ) : null}

          {questions && questions.length > 0 && !isFinalized && (
            <>
              {/* Progress */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Прогресс</span>
                  <span>{answers?.length || 0}/5+ вопросов</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              {/* Previous Answers */}
              {answers && answers.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-800">Ваши ответы:</h4>
                  <div className="space-y-2">
                    {answers.map((answer, index) => (
                      <div key={index} className="p-3 bg-white rounded-lg border border-emerald-100">
                        <div className="text-xs text-emerald-600 font-medium mb-1">Вопрос {index + 1}</div>
                        <p className="text-gray-700">{answer}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Current Question */}
              {currentQuestion && (
                <div className="space-y-4">
                  <div className="p-4 bg-white rounded-lg border border-emerald-200">
                    <div className="text-sm text-emerald-600 font-medium mb-2">Вопрос {(answers?.length || 0) + 1}</div>
                    <p className="text-gray-800 font-medium">{currentQuestion}</p>
                  </div>

                  <div className="space-y-3">
                    <Textarea
                      value={currentAnswer}
                      onChange={(e) => setCurrentAnswer(e.target.value)}
                      placeholder="Введите ваш ответ..."
                      className="min-h-[100px] resize-none"
                    />
                    <Button
                      onClick={submitAnswer}
                      disabled={!currentAnswer.trim() || isLoading}
                      className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-90"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Обрабатываю ответ...
                        </>
                      ) : (
                        <>
                          Ответить
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}

              {/* Finalize Option */}
              {(answers?.length || 0) >= 5 && !currentQuestion && (
                <div className="text-center space-y-4 p-6 bg-white rounded-lg border border-emerald-200">
                  <div className="text-lg font-semibold text-gray-800">Отлично! У нас достаточно информации</div>
                  <p className="text-gray-600">
                    Теперь мы можем создать ваш персональный профиль с биографией и открывашками
                  </p>
                  <div className="flex gap-3 justify-center">
                    <Button
                      onClick={finalizeProfile}
                      disabled={isLoading}
                      className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-90 px-6"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Создаю профиль...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 mr-2" />
                          Создать профиль
                        </>
                      )}
                    </Button>
                    <Button variant="outline" onClick={() => setCurrentQuestion("Дополнительный вопрос")}>
                      Ответить ещё
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
      )}

      {/* Results */}
      {isFinalized && result && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-800">Ваш персональный профиль готов! 🎉</h3>
            <Button variant="outline" onClick={restart} className="text-gray-600 bg-transparent">
              <RotateCcw className="w-4 h-4 mr-2" />
              Начать заново
            </Button>
          </div>

          {/* Facts */}
          {result.facts && Array.isArray(result.facts) && result.facts.length > 0 && (
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="text-lg text-blue-800">📝 Ключевые факты о вас</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {result.facts.map((fact, index) => (
                    <Badge key={index} variant="outline" className="bg-white text-blue-700 border-blue-200">
                      {fact}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Bio Variants */}
          {result.bio && (
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-800">✨ Варианты биографии</h4>

              {result.bio.bioA && (
                <Card className="border-purple-200 bg-purple-50">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg text-purple-800">Вариант A - Классический</CardTitle>
                      <Button size="sm" variant="outline" onClick={() => copyToClipboard(result.bio!.bioA)}>
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed">{result.bio.bioA}</p>
                  </CardContent>
                </Card>
              )}

              {result.bio.bioB && (
                <Card className="border-pink-200 bg-pink-50">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg text-pink-800">Вариант B - Креативный</CardTitle>
                      <Button size="sm" variant="outline" onClick={() => copyToClipboard(result.bio!.bioB)}>
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed">{result.bio.bioB}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Openers */}
          {result.openers && Array.isArray(result.openers) && result.openers.length > 0 && (
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="text-lg text-green-800">💬 Ice-breaker фразы</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {result.openers.map((opener, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between gap-4 p-3 bg-white rounded-lg border border-green-100"
                  >
                    <p className="text-gray-700 flex-1">{opener}</p>
                    <Button size="sm" variant="outline" onClick={() => copyToClipboard(opener)}>
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
