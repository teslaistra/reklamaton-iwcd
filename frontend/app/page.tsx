"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, MessageCircle, User, Target, Sparkles, ArrowRight, Star } from "lucide-react"
import { OpenerForm } from "@/components/opener-form"
import { BioForm } from "@/components/bio-form"
import { ChallengesForm } from "@/components/challenges-form"
import { OnboardingForm } from "@/components/onboarding-form"
import { FaceRatingForm } from "@/components/face-rating-form"

const features = [
  {
    id: "opener",
    title: "Открывашка",
    description: "Генерация персональных приветствий на основе профиля собеседника",
    icon: MessageCircle,
    color: "from-pink-500 to-rose-500",
    badge: "ИИ Помощник",
  },
  {
    id: "bio",
    title: "Bio Generator",
    description: "Создание и улучшение биографий для профиля знакомств",
    icon: User,
    color: "from-purple-500 to-indigo-500",
    badge: "Персонализация",
  },
  {
    id: "challenges",
    title: "Challenge Generator",
    description: "Персональные челленджи для развития навыков общения",
    icon: Target,
    color: "from-blue-500 to-cyan-500",
    badge: "Развитие",
  },
  {
    id: "onboarding",
    title: "Q&A Онбординг",
    description: "Умное интервью для создания идеального профиля",
    icon: Sparkles,
    color: "from-emerald-500 to-teal-500",
    badge: "Профиль",
  },
  {
    id: "face-rating",
    title: "Оценка внешности",
    description: "ИИ анализирует вашу фотографию и даёт честную оценку привлекательности",
    icon: Star,
    color: "from-yellow-400 to-pink-400",
    badge: "AI Beauty Score",
  },
]

export default function HomePage() {
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white">
              <Heart className="w-8 h-8" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Dating AI Assistant
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Ваш персональный ИИ-помощник для успешных знакомств. Генерируйте приветствия, создавайте био и развивайтесь
            с умными челленджами.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <Card
                key={feature.id}
                className="group flex flex-col hover:shadow-xl transition-all duration-300 cursor-pointer border-0 bg-white/70 backdrop-blur-sm hover:bg-white/90"
                onClick={() => setSelectedFeature(feature.id)}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className={`p-3 rounded-xl bg-gradient-to-r ${feature.color} text-white group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {feature.badge}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl font-semibold text-gray-800">{feature.title}</CardTitle>
                  <CardDescription className="text-gray-600">{feature.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0 mt-auto">
                  <Button
                    className={`w-full bg-gradient-to-r ${feature.color} hover:opacity-90 transition-opacity`}
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedFeature(feature.id)
                    }}
                  >
                    Попробовать
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Feature Demo */}
        {selectedFeature && (
          <div className="mt-12 max-w-4xl mx-auto">
            {selectedFeature === "opener" && <OpenerForm />}
            {selectedFeature === "bio" && <BioForm />}
            {selectedFeature === "challenges" && <ChallengesForm />}
            {selectedFeature === "onboarding" && <OnboardingForm />}
            {selectedFeature === "face-rating" && <FaceRatingForm />}
          </div>
        )}
      </div>
    </div>
  )
}
