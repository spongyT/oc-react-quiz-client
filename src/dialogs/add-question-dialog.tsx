import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "../components/ui/dialog"
import {Button} from "../components/ui/button.tsx";
import {Label} from "../components/ui/label.tsx";
import {Input} from "../components/ui/input.tsx";
import CustomInput from "../components/ui/CustomInput.tsx";
import {useInput} from "../hooks/UseInput.ts";
import {useState} from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select.tsx";
import {Check} from "lucide-react";
import {useAppContext} from "@/context/useAppContext.ts";
import type {CreateQuestionDto, QuestionDto} from "@/services/quiz-service.ts";

export function validateText(value: string): string[] {
  const errors: string[] = []
  if (!value) errors.push('Bitte eine Frage ausfüllen.')
  if (value && value.length < 3) errors.push('Bitte einen Frage mit mindestens 3 Zeichen angeben.')
  return errors
}

export function validateOption(value: string): string[] {
  const errors: string[] = []
  if (!value) errors.push('Bitte eine Antwortmöglichkeit formulieren.')
  if (value && value.length < 3) errors.push('Bitte Antwortmöglichkeit Frage mit mindestens 3 Zeichen angeben.')
  return errors
}

interface Option {
  text: string,
  correct: boolean,
  valid: boolean
}

function createInitialOption(): Option {
  return {text: '', correct: false, valid: false}
}

const AddQuestionDialog = (props: {
  open: boolean,
  onClosed: (createdQuestion?: QuestionDto) => void
}) => {
  const textInput = useInput('', validateText);
  const [options, setOptions] = useState<Option[]>([createInitialOption()]);
  const {quizService} = useAppContext();

  const addOption = () => {
    setOptions([...options, createInitialOption()])
  };

  const updateOption = (optionToUpdate: Option, uodate: Partial<Option>) => {
    const updatedOptions = options.map(option => option === optionToUpdate ? {...option, ...uodate} : option);
    setOptions(updatedOptions)
  };


  const updateSelectedCorrectedOption = (indexOfCorrectAnswer: number) => {
    const updatedOptions = options.map(((option, index) => {
      const isOptionSelected = index === indexOfCorrectAnswer;
      if (option.correct !== isOptionSelected) {
        return {...option, correct: isOptionSelected};
      }

      return option;
    }));
    setOptions(updatedOptions)
  }

  const validateFormDataAndCreateQuestion = () => {
    const dto: CreateQuestionDto = {
      text: textInput.value,
      options: options.map(option => ({text: option.text, correct: option.correct}))
    }
    quizService.createQuestion(dto).then(result => props.onClosed(result)).catch(error => console.error(error))
  }

  return (<Dialog open={props.open} onOpenChange={() => props.onClosed(undefined)}>
        <DialogContent>
          <form onSubmit={(event) => {
            event.preventDefault();
            validateFormDataAndCreateQuestion();
          }}>
            <DialogHeader>
              <DialogTitle>Frage hinzufügen</DialogTitle>
              <DialogDescription>
                Für die Frage hinzu und erstelle mindestens 2 Antwortmöglichkeiten.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 mt-5">
              <CustomInput id="text" name="text" label="Frage" placeholder="Was ist 1+1"
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
                      <Label htmlFor={"option-text-" + index}>{"Antwort " + (index + 1)}</Label>
                      {option.correct && <Check className="text-green-500"/>}
                    </div>
                    <Input
                        id={"option-text-" + index}
                        name={"option-text-" + index}
                        value={option.text}
                        onChange={(event) => updateOption(option, {text: event.target.value})}
                    />
                  </div>
                  // FIXME Antwort löschen
                  // FIXME Antwort validieren
              ))}

              <div className="grid gap-3">
                <Label>Richtige Antwort</Label>
                <Select
                    onValueChange={(event) => updateSelectedCorrectedOption(Number.parseInt(event))}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Wähle die korrekte Antwort"/>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Richtige Antwort</SelectLabel>
                      {options.map(((_option, index) => (
                          <SelectItem key={index} value={String(index)}>Antwort {index + 1}</SelectItem>)))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <Button type="button" onClick={addOption}>
                Weitere Antwort hinzufügen
              </Button>
            </div>

            <DialogFooter className="mt-5">
              <DialogClose asChild>
                <Button variant="outline">Abbrechen</Button>
              </DialogClose>
              <Button type="submit">Speichern</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
  )
}

export default AddQuestionDialog;