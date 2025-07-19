import { NextRequest } from "next/server"

const descriptions = [
  "Ваша улыбка способна растопить лёд!",
  "Очень обаятельная внешность!",
  "Вам легко удаётся производить хорошее впечатление.",
  "Ваша харизма ощущается даже на фото!",
  "Вы выглядите очень дружелюбно и открыто.",
  "Ваша уверенность заметна с первого взгляда.",
  "Очень привлекательная фотография!",
  "Ваша индивидуальность сразу бросается в глаза.",
  "Вы точно не останетесь незамеченным!",
  "Ваша энергетика заряжает позитивом!"
]

export async function POST(req: NextRequest) {
  // Просто ждём файл, но не анализируем его
  // Можно добавить задержку для эффекта "ИИ думает"
  await new Promise((r) => setTimeout(r, 1200))
  const score = Math.round(Math.random() * 100)
  const description = descriptions[Math.floor(Math.random() * descriptions.length)]
  return Response.json({ score, description })
} 