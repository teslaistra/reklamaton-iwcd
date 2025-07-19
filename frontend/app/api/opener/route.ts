import { generateObject } from "ai"
import { openai } from "@ai-sdk/openai"
import { z } from "zod"

export async function POST(req: Request) {
  try {
    const { match_profile_description, match_gender, saved_greetings = [], past_messages = [] } = await req.json()
    try {
      const response = await fetch("https://functions.yandexcloud.net/d4ekvkrc5sl885id7g3i", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ match_profile_description, match_gender, saved_greetings, past_messages }),
      })
      if (response.ok) {
        const data = await response.json()
        return Response.json(data, { status: response.status })
      }
    } catch (e) {
      console.log(e)
    }
    const object = {
      "top_saved_greetings": [
        "Привет! Чем увлекаешься?",
        "Хей! Расскажи, как прошёл день :)"
      ],
      "generated_formal": "Привет! Увидел, что ты любишь кататься на велосипеде. Это здорово! Какое место в центре твоё любимое для кофе?",
      "generated_informal": "Эй! Велосипеды и кофе — классная комбо. Когда поедем кататься вместе? 😄"
    }
    return Response.json(object)
  } catch (error) {
    console.error("Error generating opener:", error)
    return Response.json({ error: "Failed to generate opener" }, { status: 500 })
  }
}
