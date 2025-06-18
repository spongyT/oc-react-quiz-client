import type { QuestionDto } from '../../services/quiz-service.ts'

export interface QuestionItemComponentProps {
  question: QuestionDto
}

const QuestionItemComponent = ({ question }: QuestionItemComponentProps) => {
  return (
    <section
      title={question.text}
      className="bg-white p-4 rounded-2xl shadow-md border border-gray-200"
    >
      <div className="flex justify-between items-center">
        <span id={question.text} className="text-xl font-semibold mb-2">
          {question.text}
        </span>
        <span className="text-xs text-stone-700 mb-2">{question.id}</span>
      </div>
      <div>
        <ul className="space-y-1">
          {question.options.map((option) => (
            <li
              key={option.id}
              className={`p-2 rounded-md ${
                option.correct ? 'bg-green-100 text-green-800' : 'bg-gray-100'
              }`}
            >
              {option.text}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default QuestionItemComponent
