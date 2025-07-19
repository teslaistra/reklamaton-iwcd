"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Loader2, Copy, Heart, Plus, X } from "lucide-react"

interface OpenerResponse {
  top_saved_greetings: string[]
  generated_formal: string
  generated_informal: string
}

export function OpenerForm() {
  const [formData, setFormData] = useState({
    profileDescription: "",
    gender: "",
    savedGreetings: [""],
    pastMessages: [""],
  })
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<OpenerResponse | null>(null)

  const addField = (field: "savedGreetings" | "pastMessages") => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }))
  }

  const removeField = (field: "savedGreetings" | "pastMessages", index: number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field]?.filter((_, i) => i !== index) || [""],
    }))
  }

  const updateField = (field: "savedGreetings" | "pastMessages", index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field]?.map((item, i) => (i === index ? value : item)) || [""],
    }))
  }

  const generateOpeners = async () => {
    if (!formData.profileDescription.trim()) return

    setIsLoading(true)
    try {
      const response = await fetch("/api/opener", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          match_profile_description: formData.profileDescription,
          match_gender: formData.gender,
          saved_greetings: formData.savedGreetings.filter((g) => g.trim()),
          past_messages: formData.pastMessages.filter((m) => m.trim()),
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
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-pink-50 to-rose-50 border-pink-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-pink-800">
            <Heart className="w-5 h-5" />
            Генератор приветствий
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Profile Description */}
          <div className="space-y-2">
            <Label htmlFor="profile" className="text-sm font-medium text-gray-700">
              Описание профиля собеседника *
            </Label>
            <Textarea
              id="profile"
              value={formData.profileDescription}
              onChange={(e) => setFormData((prev) => ({ ...prev, profileDescription: e.target.value }))}
              placeholder="Например: Обожаю кататься на велосипеде и пить кофе в центре города. Работаю дизайнером, люблю путешествия..."
              className="min-h-[120px] resize-none"
            />
          </div>

          {/* Gender Selection */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">Пол собеседника</Label>
            <Select
              value={formData.gender}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, gender: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Выберите пол" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="female">Женский</SelectItem>
                <SelectItem value="male">Мужской</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Saved Greetings */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-gray-700">Сохранённые приветствия</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addField("savedGreetings")}
                className="text-pink-600 border-pink-200 hover:bg-pink-50"
              >
                <Plus className="w-4 h-4 mr-1" />
                Добавить
              </Button>
            </div>
            {(formData.savedGreetings || [""]).map((greeting, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={greeting}
                  onChange={(e) => updateField("savedGreetings", index, e.target.value)}
                  placeholder="Введите сохранённое приветствие"
                  className="flex-1"
                />
                {(formData.savedGreetings?.length || 0) > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeField("savedGreetings", index)}
                    className="text-red-500 hover:bg-red-50"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          {/* Past Messages */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-gray-700">Прошлые сообщения (опционально)</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addField("pastMessages")}
                className="text-pink-600 border-pink-200 hover:bg-pink-50"
              >
                <Plus className="w-4 h-4 mr-1" />
                Добавить
              </Button>
            </div>
            {(formData.pastMessages || [""]).map((message, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={message}
                  onChange={(e) => updateField("pastMessages", index, e.target.value)}
                  placeholder="Введите прошлое сообщение"
                  className="flex-1"
                />
                {(formData.pastMessages?.length || 0) > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeField("pastMessages", index)}
                    className="text-red-500 hover:bg-red-50"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          <Button
            onClick={generateOpeners}
            disabled={!formData.profileDescription.trim() || isLoading}
            className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:opacity-90 text-white font-medium py-3"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Генерирую приветствия...
              </>
            ) : (
              "✨ Создать приветствия"
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Results */}
      {result && (
        <div className="space-y-4">
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="text-lg text-green-800 flex items-center gap-2">
                <Badge className="bg-green-100 text-green-800">Формальный стиль</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start justify-between gap-4">
                <p className="text-gray-700 flex-1 leading-relaxed">{result.generated_formal}</p>
                <Button size="sm" variant="outline" onClick={() => copyToClipboard(result.generated_formal)}>
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-purple-50">
            <CardHeader>
              <CardTitle className="text-lg text-purple-800 flex items-center gap-2">
                <Badge className="bg-purple-100 text-purple-800">Неформальный стиль</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start justify-between gap-4">
                <p className="text-gray-700 flex-1 leading-relaxed">{result.generated_informal}</p>
                <Button size="sm" variant="outline" onClick={() => copyToClipboard(result.generated_informal)}>
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {result.top_saved_greetings.length > 0 && (
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="text-lg text-blue-800">Рекомендованные из сохранённых</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {result.top_saved_greetings.map((greeting, index) => (
                  <div
                    key={index}
                    className="flex items-start justify-between gap-4 p-3 bg-white rounded-lg border border-blue-100"
                  >
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
