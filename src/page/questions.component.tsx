import type { QuestionDto } from '../services/quiz-service.ts'
import { useEffect, useState } from 'react'
import QuestionItemComponent from './components/question-item.component.tsx'
import { useAppContext } from '../context/useAppContext.ts'
import { CirclePlus } from 'lucide-react'
import { Button } from '../components/ui/button.tsx'
import AddQuestionDialog from '../dialogs/add-question-dialog.tsx'

const QuestionsComponent = () => {
  const [questions, setQuestions] = useState<QuestionDto[]>([])
  const [questionDialogOpen, setQuestionDialogOpen] = useState<boolean>(false)
  const { quizService } = useAppContext()

  useEffect(() => {
    quizService.listQuestions().then((questions: QuestionDto[]) => {
      setQuestions(questions)
    })
  }, [quizService])

  function onAddQuestionDialogClosed(value: QuestionDto | undefined) {
    setQuestionDialogOpen(false)
    if (value) {
      setQuestions([...questions, value])
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between">
        <span className="text-3xl font-bold mb-6 xtext-center">
          Fragenverwaltung
        </span>
        <Button variant="default" onClick={() => setQuestionDialogOpen(true)}>
          <CirclePlus /> Frage hinzufügen
        </Button>

        <AddQuestionDialog
          open={questionDialogOpen}
          onClosed={(value) => onAddQuestionDialogClosed(value)}
          currentQuestions={questions}
        />
      </div>
      <ul className="space-y-6">
        {questions.map((question) => (
          <li key={question.id}>
            <QuestionItemComponent question={question} />
          </li>
        ))}
      </ul>
    </div>
  )
}

export default QuestionsComponent
