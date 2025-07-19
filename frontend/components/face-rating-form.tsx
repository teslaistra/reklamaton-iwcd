"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Star, Image as ImageIcon, Sparkles } from "lucide-react"
import { Progress } from "@/components/ui/progress"

export function FaceRatingForm() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{ score: number; description: string } | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (f) {
      setFile(f)
      setPreview(URL.createObjectURL(f))
      setResult(null)
    }
  }

  const handleUpload = async () => {
    if (!file) return
    setIsLoading(true)
    setResult(null)
    const formData = new FormData()
    formData.append("photo", file)
    try {
      const res = await fetch("/api/face-rating", {
        method: "POST",
        body: formData,
      })
      const data = await res.json()
      setResult(data)
    } catch (e) {
      setResult({ score: 0, description: "Ошибка при анализе фото. Попробуйте другое изображение." })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-yellow-50 to-pink-50 border-yellow-200 shadow-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-yellow-800 animate-pulse">
            <Star className="w-5 h-5 text-yellow-500 animate-spin-slow" />
            Оценка внешности
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center gap-4">
            <Label className="text-md font-medium text-gray-700">Загрузите свою фотографию</Label>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <Button
              variant="outline"
              className="flex items-center gap-2 border-yellow-300 bg-white/80 hover:bg-yellow-50 text-yellow-700"
              onClick={() => inputRef.current?.click()}
              disabled={isLoading}
            >
              <ImageIcon className="w-5 h-5" />
              {file ? "Сменить фото" : "Выбрать фото"}
            </Button>
            {preview && (
              <div className="relative mt-4">
                <img
                  src={preview}
                  alt="preview"
                  className="rounded-2xl shadow-lg border-4 border-yellow-200 w-48 h-48 object-cover animate-fade-in"
                />
              </div>
            )}
          </div>
          <Button
            onClick={handleUpload}
            disabled={!file || isLoading}
            className="w-full bg-gradient-to-r from-yellow-400 to-pink-400 hover:opacity-90 text-white font-medium py-3 text-lg shadow-lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Анализируем фото...
              </>
            ) : (
              "Оценить внешность"
            )}
          </Button>
          {result && (
            <div className="flex flex-col items-center gap-4 mt-6 animate-fade-in">
              <div className="relative flex items-center justify-center">
                <Progress value={result.score} className="h-6 w-48 bg-white" indicatorClassName="bg-gradient-to-r from-yellow-400 to-pink-400" />
                <span className="absolute left-1/2 -translate-x-1/2 text-xl font-bold text-primary-foreground drop-shadow-lg backdrop:invert-0 drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]
">
                  {result.score}
                </span>
              </div>
              <div className="text-xl text-pink-700 font-semibold flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-pink-400 animate-pulse" />
                {result.description}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 