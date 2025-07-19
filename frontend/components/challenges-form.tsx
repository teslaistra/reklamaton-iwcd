"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Loader2, Target, Plus, X } from "lucide-react"

interface JournalEntry {
  date: string
  date_title: string
  journal_text: string
  emotions: string[]
  feedback_to_match?: {
    liked: string[]
    not_liked: string[]
    feedback_style: string
  }
}

interface ChallengesResponse {
  challenges: Array<{
    title: string
    description: string
    goal: string
    difficulty: "easy" | "medium" | "hard"
  }>
}

export function ChallengesForm() {
  const [entries, setEntries] = useState<JournalEntry[]>([
    {
      date: "",
      date_title: "",
      journal_text: "",
      emotions: [""],
      feedback_to_match: {
        liked: [""],
        not_liked: [""],
        feedback_style: "",
      },
    },
  ])
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<ChallengesResponse | null>(null)

  const addEntry = () => {
    setEntries((prev) => [
      ...prev,
      {
        date: "",
        date_title: "",
        journal_text: "",
        emotions: [""],
        feedback_to_match: {
          liked: [""],
          not_liked: [""],
          feedback_style: "",
        },
      },
    ])
  }

  const removeEntry = (index: number) => {
    setEntries((prev) => prev.filter((_, i) => i !== index))
  }

  const updateEntry = (index: number, field: keyof JournalEntry, value: any) => {
    setEntries((prev) => prev.map((entry, i) => (i === index ? { ...entry, [field]: value } : entry)))
  }

  const addEmotion = (entryIndex: number) => {
    setEntries((prev) =>
      prev.map((entry, i) => (i === entryIndex ? { ...entry, emotions: [...entry.emotions, ""] } : entry)),
    )
  }

  const removeEmotion = (entryIndex: number, emotionIndex: number) => {
    setEntries((prev) =>
      prev.map((entry, i) =>
        i === entryIndex
          ? {
              ...entry,
              emotions: entry.emotions.filter((_, ei) => ei !== emotionIndex),
            }
          : entry,
      ),
    )
  }

  const updateEmotion = (entryIndex: number, emotionIndex: number, value: string) => {
    setEntries((prev) =>
      prev.map((entry, i) =>
        i === entryIndex
          ? {
              ...entry,
              emotions: entry.emotions.map((emotion, ei) => (ei === emotionIndex ? value : emotion)),
            }
          : entry,
      ),
    )
  }

  const generateChallenges = async () => {
    const validEntries = entries.filter(
      (entry) => entry.date && entry.date_title && entry.journal_text && entry.emotions.some((e) => e.trim()),
    )

    if (validEntries.length === 0) return

    setIsLoading(true)
    try {
      const response = await fetch("/api/challenges", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entries: validEntries.map((entry) => ({
            ...entry,
            emotions: entry.emotions.filter((e) => e.trim()),
            feedback_to_match: entry.feedback_to_match?.feedback_style ? entry.feedback_to_match : undefined,
          })),
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

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "hard":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "Легко"
      case "medium":
        return "Средне"
      case "hard":
        return "Сложно"
      default:
        return difficulty
    }
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <Target className="w-5 h-5" />
            <button onClick={() => {
              setEntries([
                {
                  date: "2024-06-01",
                  date_title: "Неловкий ужин",
                  journal_text: "Свидание прошло немного неловко в начале, но потом мы разговорились. Было весело, но чувствовалась некоторая неуверенность. В конце вечера мы оба смеялись над глупыми шутками.",
                  emotions: ["тревога", "радость", "неуверенность"],
                  feedback_to_match: {
                    liked: ["открытость, юмор"],
                    not_liked: ["неловкое начало"],
                    feedback_style: "kind_honest"
                  }
                }
              ]);
            }}>Генератор челленджей</button>
          </CardTitle>
          <p className="text-sm text-blue-600">
            Добавьте записи из вашего дневника свиданий для получения персональных челленджей
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {entries.map((entry, entryIndex) => (
            <Card key={entryIndex} className="bg-white border border-blue-100">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-gray-800">Запись #{entryIndex + 1}</h3>
                  {entries.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeEntry(entryIndex)}
                      className="text-red-500 hover:bg-red-50"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Date and Title */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Дата *</Label>
                    <Input
                      type="date"
                      value={entry.date}
                      onChange={(e) => updateEntry(entryIndex, "date", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Название свидания *</Label>
                    <Input
                      value={entry.date_title}
                      onChange={(e) => updateEntry(entryIndex, "date_title", e.target.value)}
                      placeholder="Например: Неловкий ужин"
                    />
                  </div>
                </div>

                {/* Journal Text */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Описание свидания *</Label>
                  <Textarea
                    value={entry.journal_text}
                    onChange={(e) => updateEntry(entryIndex, "journal_text", e.target.value)}
                    placeholder="Опишите, как прошло свидание, что чувствовали, что происходило..."
                    className="min-h-[100px] resize-none"
                  />
                </div>

                {/* Emotions */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium text-gray-700">Эмоции *</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addEmotion(entryIndex)}
                      className="text-blue-600 border-blue-200 hover:bg-blue-50"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Добавить
                    </Button>
                  </div>
                  {entry.emotions.map((emotion, emotionIndex) => (
                    <div key={emotionIndex} className="flex gap-2">
                      <Input
                        value={emotion}
                        onChange={(e) => updateEmotion(entryIndex, emotionIndex, e.target.value)}
                        placeholder="Например: тревога, радость, неуверенность"
                        className="flex-1"
                      />
                      {entry.emotions.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeEmotion(entryIndex, emotionIndex)}
                          className="text-red-500 hover:bg-red-50"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Optional Feedback */}
                <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                  <Label className="text-sm font-medium text-gray-700">
                    Обратная связь от собеседника (опционально)
                  </Label>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs text-gray-600">Что понравилось</Label>
                      <Input
                        value={entry.feedback_to_match?.liked[0] || ""}
                        onChange={(e) =>
                          updateEntry(entryIndex, "feedback_to_match", {
                            ...entry.feedback_to_match,
                            liked: [e.target.value],
                          })
                        }
                        placeholder="Например: открытость, юмор"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs text-gray-600">Что не понравилось</Label>
                      <Input
                        value={entry.feedback_to_match?.not_liked[0] || ""}
                        onChange={(e) =>
                          updateEntry(entryIndex, "feedback_to_match", {
                            ...entry.feedback_to_match,
                            not_liked: [e.target.value],
                          })
                        }
                        placeholder="Например: неловкое начало"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs text-gray-600">Стиль обратной связи</Label>
                    <Select
                      value={entry.feedback_to_match?.feedback_style || ""}
                      onValueChange={(value) =>
                        updateEntry(entryIndex, "feedback_to_match", {
                          ...entry.feedback_to_match,
                          feedback_style: value,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите стиль" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kind_honest">Добрый и честный</SelectItem>
                        <SelectItem value="direct">Прямой</SelectItem>
                        <SelectItem value="supportive">Поддерживающий</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={addEntry}
            className="w-full text-blue-600 border-blue-200 hover:bg-blue-50 bg-transparent"
          >
            <Plus className="w-4 h-4 mr-2" />
            Добавить запись
          </Button>

          <Button
            onClick={generateChallenges}
            disabled={
              !entries.some((e) => e.date && e.date_title && e.journal_text && e.emotions.some((em) => em.trim())) ||
              isLoading
            }
            className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:opacity-90 text-white font-medium py-3"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Анализирую и создаю челленджи...
              </>
            ) : (
              <>
                <Target className="w-4 h-4 mr-2" />
                Создать челленджи
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Results */}
      {result && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Ваши персональные челленджи:</h3>
          {result.challenges.map((challenge, index) => (
            <Card key={index} className="border-green-200 bg-green-50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg text-green-800">{challenge.title}</CardTitle>
                  <Badge className={getDifficultyColor(challenge.difficulty)}>
                    {getDifficultyText(challenge.difficulty)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-gray-700 leading-relaxed">{challenge.description}</p>
                <div className="p-3 bg-white rounded-lg border border-green-100">
                  <p className="text-sm font-medium text-green-800 mb-1">Цель:</p>
                  <p className="text-sm text-green-700">{challenge.goal}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
