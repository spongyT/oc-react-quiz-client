import type { CreateQuestionDto, QuestionDto } from '@/services/quiz-service.ts'
import { zodTextFormat } from 'openai/helpers/zod'
import { z } from 'zod'
import OpenAI from 'openai'
import OC_HISTORY_FACTS from "@/assets/oc_history_facts.txt?raw";
import OC_HARD_FACTS from "@/assets/oc_hard_facts.txt?raw";

export const QuestionItemInputZod = z.object({
  text: z.string().min(1),
  options: z
    .array(
      z.object({
        text: z.string(),
        correct: z.boolean(),
      }),
    )
    .min(2)
    .max(4)
    .refine(
      (e) => e.filter((f) => f.correct).length === 1,
      'only one item can be marked as correct',
    ),
})


export class AiQuestionService {
  lastGenerations: CreateQuestionDto[] = []

  constructor() {
    console.log('Env' + import.meta.env.VITE_OPENAI_API_KEY)
  }

  generateNewQuestion(
    currentQuestions: QuestionDto[],
  ): Promise<CreateQuestionDto> {
    const client = new OpenAI({
      apiKey: import.meta.env.VITE_OPENAI_API_KEY,
      dangerouslyAllowBrowser: true,
    })
    const correctAnswerPosition = Math.trunc(Math.random() * 3) + 1
    const existingQuestions = [
      ...currentQuestions,
      ...this.lastGenerations,
    ].map((question) => question.text)

    return client.responses
      .parse({
        model: 'gpt-4.1',
        instructions: 'Die Antwort darf nur JSON beinhalten.',
        input: `
      Ich mache ein Quiz über die Firma Optiz Consulting.
      
      Bitte formuliere mir ein neue Quizfrage. 
      
      Als Input kannst du folgende Fakten nutzen:
      
      Zahlen und Daten: ${OC_HARD_FACTS}
      
      Historie: ${OC_HISTORY_FACTS}
      
      Folgende Fragen haben wir bereits: ${existingQuestions}. Die Fragen sollen sich nicht wiederholen.
      
      Gib mir 3 unterschiedliche Antwortmöglichkeiten und markiere die richtige Antwort. 
      Die richtige Antwort soll an der Position ${correctAnswerPosition} stehen.
      Ich möchte als Antwort nur ein JSON von dir erhalten. Dieses soll wie folgt aussehen:
      - ein Attribut "text" vom Typ string, welches die Frage enthält
      - ein Attribut "options" vom Typ Option, welches die Antwortmöglichkeiten enthält
      - der Typ Option enthält folgende Attribute:
      - ein Attribut "text" vom Typ string, welches die Antwortmöglichkeit enthält 
      - ein Attribut "correct" vom Typ boolean, welches true ist wenn es die korrekte Antwort hat 
      `,
        text: {
          format: zodTextFormat(QuestionItemInputZod, 'question_response'),
        },
      })
      .then((response) => {
        console.log(response.output_parsed)
        if (response.output_parsed) {
          this.lastGenerations.push(response.output_parsed)
          return response.output_parsed
        } else {
          return Promise.reject(
            `Answer from AI contained no valid JSON ${response.output_text}`,
          )
        }
      })
  }
}
