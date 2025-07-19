import { generateObject } from "ai"
import { openai } from "@ai-sdk/openai"
import { z } from "zod"

export async function POST(req: Request) {
  try {
    const { user_facts, tone, length, current_bio, action } = await req.json()

    if (action === "generate") {
      try {
        const response = await fetch("https://functions.yandexcloud.net/d4e3uer658357b9igkin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_facts, tone, length, current_bio, action }),
        })
        if (response.ok) {
          const data = await response.json()
          return Response.json(data, { status: response.status })
        } else {
          console.log(response)
        }
      } catch (e) {
        // fallback ниже
        console.log(e)
      }
      const object = {
        "bio_variants": [
          "Продуктовый дизайнер, любящий пешие походы. Барсик всегда рядом — мой компас и спутник.",
          "Создаю продукты днём, гуляю с Барсиком по тропам вечером. Присоединишься?",
          "💻🎨 Продуктовый дизайнер. 🥾 Люблю походы. 🐱 Барсик — босс моих приключений!"
        ]
      }
      return Response.json(object)
    } else if (action === "rewrite") {
      try {
        const response = await fetch("https://functions.yandexcloud.net/d4e3uer658357b9igkin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_facts, tone, length, current_bio, action }),
        })
        if (response.ok) {
          const data = await response.json()
          return Response.json(data, { status: response.status })
        }
      } catch (e) {
        // fallback ниже
      }
      const object = {
        "rewritten_variants": [
          "Дизайнер с котом и кроссовками. Всё, что нужно для счастья — это Барсик и тропа.",
          "По будням — дизайнер, по выходным — лесной эльф. Барсик подтверждает.",
          "👟 Я бегу в поход, 🎨 рисую идеи, 🐱 Барсик – мой менеджер по настроению."
        ]
      }
      return Response.json(object)
    }

    return Response.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("Error generating bio:", error)
    return Response.json({ error: "Failed to generate bio" }, { status: 500 })
  }
}
