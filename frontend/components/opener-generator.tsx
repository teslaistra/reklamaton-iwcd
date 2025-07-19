"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Copy, Heart } from "lucide-react"

interface OpenerResponse {
  top_saved_greetings: string[]
  generated_formal: string
  generated_informal: string
}

export function OpenerGenerator() {
  const [profileDescription, setProfileDescription] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<OpenerResponse | null>(null)

  const generateOpeners = async () => {
    if (!profileDescription.trim()) return

    setIsLoading(true)
    try {
      const response = await fetch("/api/opener", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          match_profile_description: profileDescription,
          match_gender: "female",
          saved_greetings: ["Привет! Чем увлекаешься?", "Хей! Расскажи, как прошёл день :)"],
          past_messages: [],
        }),
      })

      const data = await response.json()
      setResult(data)
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-pink-500" />
            Генератор приветствий
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Описание профиля собеседника</label>
            <Textarea
              value={profileDescription}
              onChange={(e) => setProfileDescription(e.target.value)}
              placeholder="Например: Обожаю кататься на велосипеде и пить кофе в центре"
              className="min-h-[100px]"
            />
          </div>

          <Button
            onClick={generateOpeners}
            disabled={!profileDescription.trim() || isLoading}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:opacity-90"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Генерирую...
              </>
            ) : (
              "Создать приветствия"
            )}
          </Button>
        </CardContent>
      </Card>

      {result && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Формальное приветствие</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start justify-between gap-4">
                <p className="text-gray-700 flex-1">{result.generated_formal}</p>
                <Button size="sm" variant="outline" onClick={() => copyToClipboard(result.generated_formal)}>
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Неформальное приветствие</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start justify-between gap-4">
                <p className="text-gray-700 flex-1">{result.generated_informal}</p>
                <Button size="sm" variant="outline" onClick={() => copyToClipboard(result.generated_informal)}>
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {result.top_saved_greetings.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Рекомендованные из сохранённых</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {result.top_saved_greetings.map((greeting, index) => (
                  <div key={index} className="flex items-start justify-between gap-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-gray-700 flex-1">{greeting}</p>
                    <Button size="sm" variant="outline" onClick={() => copyToClipboard(greeting)}>
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
