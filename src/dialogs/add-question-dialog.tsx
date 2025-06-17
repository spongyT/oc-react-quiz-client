import {
  Dialog, DialogClose,
  DialogContent,
  DialogDescription, DialogFooter,
  DialogHeader,
  DialogTitle
} from "../components/ui/dialog"
import {Button} from "../components/ui/button.tsx";
import {Label} from "../components/ui/label.tsx";
import {Input} from "../components/ui/input.tsx";
import CustomInput from "../components/ui/CustomInput.tsx";
import {useInput} from "../hooks/UseInput.ts";

export function validateText(value: string): string[] {
  const errors: string[] = []
  if (!value) errors.push('Bitte eine Frage ausfüllen.')
  if (value && value.length < 3) errors.push('Bitte einen Frage mit mindestens 3 Zeichen angeben.')
  return errors
}

const AddQuestionDialog = (props: { open: boolean, onOpenChange: (open: boolean) => void }) => {
  const textInput = useInput('', validateText);
  // const options =


  return (<Dialog open={props.open} onOpenChange={props.onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Frage hinzufügen</DialogTitle>
            <DialogDescription>
              Für die Frage hinzu und erstelle mindestens 2 Antwortmöglichkeiten.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <CustomInput id="text" name="text" label="Frage" placeholder="Was ist 1+1"
                         touched={textInput.touched}
                         errors={textInput.errors}
                         value={textInput.value}
                         onChange={textInput.onChange}
                         onBlur={textInput.onBlur}
            />
            {/*{options.map(option => )}*/}
            <div className="grid gap-3">
              <Label htmlFor="username-1">Username</Label>
              <Input id="username-1" name="username" defaultValue="@peduarte"/>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Abbrechen</Button>
            </DialogClose>
            <Button type="submit">Speichern</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
  )
}

export default AddQuestionDialog;