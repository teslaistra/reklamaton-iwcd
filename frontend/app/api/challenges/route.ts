import { generateObject } from "ai"
import { openai } from "@ai-sdk/openai"
import { z } from "zod"

export async function POST(req: Request) {
  try {
    const { entries } = await req.json()
    try {
      const response = await fetch("https://functions.yandexcloud.net/d4enjsb4p211q7r6tv1n", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entries }),
      })
      if (response.ok) {
        const data = await response.json()
        return Response.json(data, { status: response.status })
      } else {
        console.log(response)
      }
    } catch (e) {
      console.log(e)
    }
    const object = {
      "challenges": [
        {
          "title": "Минутная пауза",
          "description": "На следующем свидании выдержи молчание 60 секунд после её ответа и улыбнись, прежде чем продолжить.",
          "goal": "снизить тревогу перед тишиной",
          "difficulty": "medium"
        },
        {
          "title": "Честный радар",
          "description": "В течение недели после каждой встречи записывай, что ты действительно почувствовал, не фильтруя эмоции.",
          "goal": "повысить осознанность и честность с собой",
          "difficulty": "easy"
        },
        {
          "title": "Вопрос дня",
          "description": "Перед свиданием подготовь 3 открытых вопроса, касающихся ценностей партнёра, и задай минимум один.",
          "goal": "улучшить глубину диалога",
          "difficulty": "medium"
        }
      ]
    }
    return Response.json(object)
  } catch (error) {
    console.error("Error generating challenges:", error)
    return Response.json({ error: "Failed to generate challenges" }, { status: 500 })
  }
}
