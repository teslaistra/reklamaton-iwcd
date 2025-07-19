"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Loader2, Copy, User, Sparkles } from "lucide-react"

interface BioResponse {
  bio_variants?: string[]
  rewritten_variants?: string[]
}

export function BioForm() {
  const [activeTab, setActiveTab] = useState("generate")
  const [generateForm, setGenerateForm] = useState({
    facts: { профессия: "", хобби: "", питомец: "", другое: "" },
    tone: "",
    length: "",
  })
  const [rewriteForm, setRewriteForm] = useState({
    currentBio: "",
    tone: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<BioResponse | null>(null)

  const updateFact = (key: string, value: string) => {
    setGenerateForm((prev) => ({
      ...prev,
      facts: { ...prev.facts, [key]: value },
    }))
  }

  const generateBio = async () => {
    const filledFacts = Object.entries(generateForm.facts)
      .filter(([_, value]) => value.trim())
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {})

    if (Object.keys(filledFacts).length === 0 || !generateForm.tone || !generateForm.length) return

    setIsLoading(true)
    try {
      const response = await fetch("/api/bio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "generate",
          user_facts: filledFacts,
          tone: generateForm.tone,
          length: generateForm.length,
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

  const rewriteBio = async () => {
    if (!rewriteForm.currentBio.trim() || !rewriteForm.tone) return

    setIsLoading(true)
    try {
      const response = await fetch("/api/bio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "rewrite",
          current_bio: rewriteForm.currentBio,
          tone: rewriteForm.tone,
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
      <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-800">
            <User className="w-5 h-5" />
            <button onClick={() => {
              setGenerateForm({
                facts: {
                  профессия: "Продуктовый дизайнер",
                  хобби: "Пешие походы, Йога и медитация, Настольные игры с друзьями",
                  питомец: "Кот Барсик, очень ленивый философ",
                  другое: "Мечтаю объехать всю Японию, Иногда пишу стихи, но никому не показываю, Участвую в волонтёрских проектах"
                },
                tone: "дружелюбный",
                length: "среднее"
              });
              setRewriteForm({
                currentBio: "Обожаю читать нон-фикшн книги. Люблю утро и кофе с видом на город. Легко завожу разговор с незнакомцами.",
                tone: "юмористический"
              });
            }}>Генератор биографий</button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="generate">Создать новое био</TabsTrigger>
              <TabsTrigger value="rewrite">Переписать существующее</TabsTrigger>
            </TabsList>

            <TabsContent value="generate" className="space-y-6 mt-6">
              {/* Facts Section */}
              <div className="space-y-4">
                <Label className="text-sm font-medium text-gray-700">Факты о вас</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="profession" className="text-xs text-gray-600">
                      Профессия
                    </Label>
                    <Input
                      id="profession"
                      value={generateForm.facts.профессия}
                      onChange={(e) => updateFact("профессия", e.target.value)}
                      placeholder="Например: продуктовый дизайнер"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hobby" className="text-xs text-gray-600">
                      Хобби
                    </Label>
                    <Input
                      id="hobby"
                      value={generateForm.facts.хобби}
                      onChange={(e) => updateFact("хобби", e.target.value)}
                      placeholder="Например: пешие походы"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pet" className="text-xs text-gray-600">
                      Питомец
                    </Label>
                    <Input
                      id="pet"
                      value={generateForm.facts.питомец}
                      onChange={(e) => updateFact("питомец", e.target.value)}
                      placeholder="Например: кот Барсик"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="other" className="text-xs text-gray-600">
                      Другое
                    </Label>
                    <Input
                      id="other"
                      value={generateForm.facts.другое}
                      onChange={(e) => updateFact("другое", e.target.value)}
                      placeholder="Любой другой факт"
                    />
                  </div>
                </div>
              </div>

              {/* Tone Selection */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Тон биографии *</Label>
                <Select
                  value={generateForm.tone}
                  onValueChange={(value) => setGenerateForm((prev) => ({ ...prev, tone: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите тон" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="дружелюбный">🤗 Дружелюбный</SelectItem>
                    <SelectItem value="юмористический">😄 Юмористический</SelectItem>
                    <SelectItem value="романтический">💕 Романтический</SelectItem>
                    <SelectItem value="профессиональный">💼 Профессиональный</SelectItem>
                    <SelectItem value="креативный">🎨 Креативный</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Length Selection */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Длина биографии *</Label>
                <Select
                  value={generateForm.length}
                  onValueChange={(value) => setGenerateForm((prev) => ({ ...prev, length: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите длину" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="короткое">📝 Короткое (1-2 предложения)</SelectItem>
                    <SelectItem value="среднее">📄 Среднее (3-4 предложения)</SelectItem>
                    <SelectItem value="длинное">📋 Длинное (5+ предложений)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={generateBio}
                disabled={
                  Object.values(generateForm.facts).every((v) => !v.trim()) ||
                  !generateForm.tone ||
                  !generateForm.length ||
                  isLoading
                }
                className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:opacity-90 text-white font-medium py-3"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Создаю биографию...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Создать биографию
                  </>
                )}
              </Button>
            </TabsContent>

            <TabsContent value="rewrite" className="space-y-6 mt-6">
              {/* Current Bio */}
              <div className="space-y-2">
                <Label htmlFor="currentBio" className="text-sm font-medium text-gray-700">
                  Текущая биография *
                </Label>
                <Textarea
                  id="currentBio"
                  value={rewriteForm.currentBio}
                  onChange={(e) => setRewriteForm((prev) => ({ ...prev, currentBio: e.target.value }))}
                  placeholder="Вставьте вашу текущую биографию для переписывания..."
                  className="min-h-[120px] resize-none"
                />
              </div>

              {/* New Tone */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Новый тон *</Label>
                <Select
                  value={rewriteForm.tone}
                  onValueChange={(value) => setRewriteForm((prev) => ({ ...prev, tone: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите новый тон" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="дружелюбный">🤗 Дружелюбный</SelectItem>
                    <SelectItem value="юмористический">😄 Юмористический</SelectItem>
                    <SelectItem value="романтический">💕 Романтический</SelectItem>
                    <SelectItem value="профессиональный">💼 Профессиональный</SelectItem>
                    <SelectItem value="креативный">🎨 Креативный</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={rewriteBio}
                disabled={!rewriteForm.currentBio.trim() || !rewriteForm.tone || isLoading}
                className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:opacity-90 text-white font-medium py-3"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Переписываю биографию...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Переписать биографию
                  </>
                )}
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Results */}
      {result && (
        <div className="space-y-4">
          {(result.bio_variants || result.rewritten_variants)?.map((bio, index) => (
            <Card key={index} className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="text-lg text-green-800 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Badge className="bg-green-100 text-green-800">Вариант {index + 1}</Badge>
                  </span>
                  <Button size="sm" variant="outline" onClick={() => copyToClipboard(bio)}>
                    <Copy className="w-4 h-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{bio}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
