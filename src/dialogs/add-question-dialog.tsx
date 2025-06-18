import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog'
import { Button } from '../components/ui/button.tsx'
import { Label } from '../components/ui/label.tsx'
import { Input } from '../components/ui/input.tsx'
import CustomInput from '../components/ui/CustomInput.tsx'
import { useInput } from '../hooks/UseInput.ts'
import { useState } from 'react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select.tsx'
import { Check } from 'lucide-react'
import { useAppContext } from '@/context/useAppContext.ts'
import type { CreateQuestionDto, QuestionDto } from '@/services/quiz-service.ts'
import { toast } from 'sonner'

export function validateText(value: string): string[] {
  const errors: string[] = []
  if (!value) errors.push('Bitte eine Frage ausfüllen.')
  if (value && value.length < 3)
    errors.push('Bitte einen Frage mit mindestens 3 Zeichen angeben.')
  return errors
}

export function validateOption(value: string): string[] {
  const errors: string[] = []
  if (!value) errors.push('Bitte eine Antwortmöglichkeit formulieren.')
  if (value && value.length < 3)
    errors.push(
      'Bitte Antwortmöglichkeit Frage mit mindestens 3 Zeichen angeben.',
    )
  return errors
}

interface Option {
  text: string
  correct: boolean
}

function createInitialOption(): Option {
  return { text: '', correct: false }
}

const AddQuestionDialog = (props: {
  open: boolean
  onClosed: (createdQuestion?: QuestionDto) => void
  currentQuestions: QuestionDto[]
}) => {
  const textInput = useInput('', validateText)
  const [options, setOptions] = useState<Option[]>([
    createInitialOption(),
    createInitialOption(),
  ])
  const [isQuestionGenerationInProgress, setIsQuestionGenerationInProgress] =
    useState(false)
  const [isSaveInProgress, setIsSaveInProgress] = useState(false)
  const [saveError, setSaveError] = useState<string | undefined>(undefined)
  const { quizService, aiQuestionService } = useAppContext()

  const addOption = () => {
    setOptions([...options, createInitialOption()])
  }

  const updateOption = (optionToUpdate: Option, uodate: Partial<Option>) => {
    const updatedOptions = options.map((option) =>
      option === optionToUpdate ? { ...option, ...uodate } : option,
    )
    setOptions(updatedOptions)
  }

  const updateSelectedCorrectedOption = (indexOfCorrectAnswer: number) => {
    const updatedOptions = options.map((option, index) => {
      const isOptionSelected = index === indexOfCorrectAnswer
      if (option.correct !== isOptionSelected) {
        return { ...option, correct: isOptionSelected }
      }

      return option
    })
    setOptions(updatedOptions)
  }

  function resetInputs() {
    setOptions([])
    textInput.reset()
  }

  function resetAndCloseDialog() {
    resetInputs()
    props.onClosed()
  }

  const validateFormDataAndCreateQuestion = () => {
    const dto: CreateQuestionDto = {
      text: textInput.value,
      options: options.map((option) => ({
        text: option.text,
        correct: option.correct,
      })),
    }
    setIsSaveInProgress(true)
    setSaveError(undefined)
    quizService
      .createQuestion(dto)
      .then((result) => {
        console.log(`Response ${result}`)
        toast.success('Frage erfolgreich gespeichert', {
          action: {
            label: 'Ansehen',
            onClick: () => resetAndCloseDialog(),
          },
        })
        setIsSaveInProgress(false)
        resetInputs()
        // props.onClosed(result)
      })
      .catch((error) => {
        console.error(error)
        setIsSaveInProgress(false)
        toast.error('Fehler beim Speichern der Frage im Backend')
        setSaveError(JSON.stringify(error.response.data))
      })
  }

  function generateQuestionWithAi() {
    setIsQuestionGenerationInProgress(true)
    aiQuestionService
      .generateNewQuestion(props.currentQuestions)
      .then((question) => {
        setIsQuestionGenerationInProgress(false)
        setOptions(
          question.options.map((optionDto) => ({
            text: optionDto.text,
            correct: optionDto.correct,
          })),
        )
        textInput.setValue(question.text)
      })
  }

  return (
    <Dialog open={props.open} onOpenChange={() => props.onClosed(undefined)}>
      <DialogContent className="min-w-5/6 max-w-6xl">
        <form
          onSubmit={(event) => {
            event.preventDefault()
            validateFormDataAndCreateQuestion()
          }}
        >
          <DialogHeader>
            <DialogTitle>Frage hinzufügen</DialogTitle>
            <DialogDescription>
              Für die Frage hinzu und erstelle mindestens 2
              Antwortmöglichkeiten.
            </DialogDescription>
          </DialogHeader>

          <div className="flex justify-end mt-3">
            <Button
              type="button"
              onClick={generateQuestionWithAi}
              isLoading={isQuestionGenerationInProgress}
            >
              {!isQuestionGenerationInProgress && (
                <img
                  src="src/assets/openai_white.png"
                  height="25px"
                  width="25px"
                />
              )}
              Generate with AI
            </Button>
          </div>

          <div className="grid gap-4 mt-5">
            <CustomInput
              id="text"
              name="text"
              label="Frage"
              touched={textInput.touched}
              errors={textInput.errors}
              value={textInput.value}
              onChange={textInput.onChange}
              onBlur={textInput.onBlur}
            />

            {/*Options*/}
            {options.map((option, index) => (
              <div key={index} className="grid gap-3">
                <div className="flex justify-between">
                  <Label htmlFor={'option-text-' + index}>
                    {'Antwort ' + (index + 1)}
                  </Label>
                  {option.correct && <Check className="text-green-500" />}
                </div>
                <Input
                  id={'option-text-' + index}
                  name={'option-text-' + index}
                  value={option.text}
                  onChange={(event) =>
                    updateOption(option, { text: event.target.value })
                  }
                />
              </div>
              // FIXME Antwort löschen
              // FIXME Antwort validieren
            ))}

            <Button type="button" variant="link" onClick={addOption}>
              Weitere Antwort hinzufügen
            </Button>

            <div className="grid gap-3">
              <Label>Richtige Antwort</Label>
              <Select
                onValueChange={(event) =>
                  updateSelectedCorrectedOption(Number.parseInt(event))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Wähle die korrekte Antwort" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Richtige Antwort</SelectLabel>
                    {options.map((_option, index) => (
                      <SelectItem key={index} value={String(index)}>
                        Antwort {index + 1}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          {saveError && (
            <div className="text-red-500 mt-3">Fehlermeldung: {saveError}</div>
          )}
          <DialogFooter className="mt-5">
            <DialogClose asChild>
              <Button variant="outline">Abbrechen</Button>
            </DialogClose>
            <Button isLoading={isSaveInProgress} type="submit">
              Speichern
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default AddQuestionDialog
