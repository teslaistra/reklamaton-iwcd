import { generateObject } from "ai"
import { openai } from "@ai-sdk/openai"
import { z } from "zod"

export async function POST(req: Request) {
  try {
    const { answers, finalize } = await req.json()

    if (answers.length === 0) {
      try {
        const response = await fetch("https://functions.yandexcloud.net/d4enmnrrjc4cllph4250", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ answers, finalize }),
        })
        if (response.ok) {
          const data = await response.json()
          return Response.json(data, { status: response.status })
        }
      } catch (e) {}
      const object = {
        "questions": [
          "Какое занятие делает тебя по-настоящему счастливым?",
          "Какое последнее приключение подарило тебе яркие эмоции?",
          "Есть ли песня/фильм, отражающие твою личность? Почему?",
          "Какая привычка помогает тебе проживать день лучше?",
          "Если бы у тебя было 24 свободных часа, как бы ты их потратил?"
        ]
      }
      return Response.json(object)
    } else if (finalize && answers.length >= 5) {
      try {
        const response = await fetch("https://functions.yandexcloud.net/d4enmnrrjc4cllph4250", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ answers, finalize }),
        })
        if (response.ok) {
          const data = await response.json()
          return Response.json(data, { status: response.status })
        }
      } catch (e) {}
      const object = {
        "facts": [
          "Обожает горные походы",
          "Бегает по утрам 5 км",
          "Собирает автостоп-истории",
          "Ловит рассветы с книгой у озера",
          "Учится ценить паузы в беседе"
        ],
        "bio": {
          "bioA": "Любитель гор, утренних пробежек и рассветов у озера. Всегда в поиске нового приключения и честного диалога.",
          "bioB": "🥾⛰️ Бегу к солнцу, ловлю автостоп-истории и читаю на берегу озера. Напишешь, пока не наступил рассвет? 🌅📚"
        },
        "openers": [
          "Где бы ты встретил свой идеальный рассвет — в горах или у воды? 🌄",
          "Какой саундтрек включаешь, когда начинается приключение?",
          "Твоя самая длинная пауза в разговоре — вызов или комфорт?"
        ]
      }
      return Response.json(object)
    } else {
      try {
        const response = await fetch("https://functions.yandexcloud.net/d4enmnrrjc4cllph4250", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ answers, finalize }),
        })
        if (response.ok) {
          const data = await response.json()
          return Response.json(data, { status: response.status })
        }
      } catch (e) {
        console.log(e)
      }
      const object = {
        "question": "Есть ли традиция, к которой ты возвращаешься каждое лето?"
      }
      return Response.json(object)
    }
  } catch (error) {
    console.error("Error in onboarding:", error)
    return Response.json({ error: "Failed to process onboarding" }, { status: 500 })
  }
}
