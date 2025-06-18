import type { CreateQuestionDto, QuestionDto } from '@/services/quiz-service.ts'
import { zodTextFormat } from 'openai/helpers/zod'
import { z } from 'zod'

import OpenAI from 'openai'

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

const OC_HARD_FACTS = `
Kennzahlen (Zahlenwerk)
Umsatzentwicklung (in Mio. €)

2021: 56,2

2022: 62,9

2023: 65,4

2024: 60,4

Mitarbeitende: 469 an 9 Standorten

Aktive Kundenfirmen: über 600

Kundenprojekte mit agilen Methoden: über 90%

Aktive Managed-Services-Kunden: über 130

Systeme im Support: über 4.000

SLA-Erfüllung: über 99,5%

📌 Branchenverteilung der Kunden
Public: 34%

Handel & Logistik: 21%

Industrie & Automotive: 22%

Technologie & Kommunikation: 12%

Finance & Insurance: 7%

💬 Kundenzufriedenheit
Net Promoter Score (NPS): 40,26

Weiterempfehlungsrate: 91%
`

const OC_HISTORY_FACTS = `
1990
Gründung
Gründung unter dem Namen „TRIGON Gesellschaft für Organisation und Projektabwicklung mbh“ durch Bernhard Opitz, Rolf Scheuch und Peter Dix

1995
Umzug
Umzug nach Gummersbach-Nochen in ein historisches Fachwerkanwesen und Umbenennung in OPITZ & Partner GmbH


1999
Standorte
OPITZ CONSULTING wächst weiter, mit München und Hamburg entstehen die ersten beiden neuen Standorte.

10. Geburtstag
Jubiläum! Die erste erfolgreiche Dekade nach der Firmengründung ist rum und OPITZ CONSULTING feiert den 10. Geburtstag, natürlich mit großer Party!

2000
Neue Standorte
Die Reise geht weiter, die Mitarbeiterzahl steigt auf über 100 und mit der Eröffnung der Standorte Gummersbach und Bad Homburg gibt es inzwischen 5 Niederlassungen.

2006
Mitarbeitende
Über 200 Mitarbeitende an 5 Standorten - Mehr spannende Projekte brauchen mehr Expertise!

2007
Schulungscenter
Das OPITZ CONSULTING Schulungscenter wird eröffnet und erhält den Status „Oracle Approved Education Center“

2008
Berlin & Essen
Das Wachstum geht weiter, die Standorte Berlin und Essen werden eröffnet. Zu den 7 deutschen Standorten wird zusätzlich die Niederlassung in Krakau gegründet.

2010
20. Geburtstag
Das nächste Jubiläum, OPITZ CONSULTING feiert 20 erfolgreiche Jahre. Passend zum Jubiläum steigt auch die Mitarbeiterzahl auf inzwischen mehr als 300 IT-Experten.

2011
Nürnberg
Eröffnung des OPITZ CONSULTING Standorts in Nürnberg. Nach München der zweite Standort in Bayern.

2012
Zusammenführung
Die erste große Transformation - Zusammenführung aller deutschen Niederlassungen in die OPITZ CONSULTING Deutschland GmbH mit sieben Standorten in Deutschland. Die polnische Tochter bleibt unabhängig.

2015
25. Geburtstag
Geburtstag! Es wird gefeiert, 25 erfolgreiche Jahre OPITZ CONSULTING und inzwischen mehr als 400 Mitarbeiter in Deutschland und Polen.

2015
Stuttgart
Ein neuer Standort in süddeutschen Raum: Eröffnung unserer Büros in Stuttgart.

2019
Neue Geschäftsführung
Übergabe der Geschäftsführung an die nächste Generation bestehend aus Dr. Sarah Opitz, Tom Gansor, Peter Menne und Torsten Schlautmann - In der zweiten Generation gestalten die neuen Geschäftsführer die kontinuierliche Weiterentwicklung und den Fortschritt von OPITZ CONSULTING – im Team und mit großer Begeisterung und Verbundenheit für das Unternehmen.

2020
30. Geburtstag
30 Jahre OPITZ CONSULTING mit vielen spannenden Projekten und Kunden und inzwischen mehr als 500 Mitarbeiter an 8 Standorten in Deutschland und zwei in Polen. Trotz außergewöhnlichen Umständen durch die Corona-Krise, blickt OPITZ CONSULTING einer erfolgreichen Zukunft entgegen.

2022
Nachhaltigkeit gestärkt
Mit unserer Roadmap 2 Net Zero und mithilfe eines KI-gestützten ESG-Berichtstools haben wir uns bis 2030 konsequente Ziele und Maßnahmen für ökologische und soziale Nachhaltigkeit vorgenommen.

2024
Fachliche Expertise gebündelt
Wir bündeln unsere Fähigkeiten noch stärker als bisher, um die aktuellen Themen unserer Kunden mit höchster fachlicher Expertise zu bedienen. Für diese Expertise stehen unsere Teams von OPITZ CONSULTING Software, OPITZ CONSULTING Analytics, OPITZ CONSULTING Systems und OPITZ CONSULTING Public. #zukunftswirksam
`

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
