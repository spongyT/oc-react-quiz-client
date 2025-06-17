import type {QuestionDto} from "../services/quiz-service.ts";
import {useEffect, useState} from "react";
import QuestionItemComponent from "./components/question-item.component.tsx";
import {useAppContext} from "../context/useAppContext.ts";

const QuestionsComponent = () => {
  const [questions, setQuestions] = useState<QuestionDto[]>([]);
  const {quizService} = useAppContext();

  useEffect(() => {
    quizService.listQuestions().then((questions: QuestionDto[]) => {
      setQuestions(questions);
    });
  }, [quizService]);

  return (<div className="max-w-4xl mx-auto p-6">
    <h1 className="text-3xl font-bold mb-6 xtext-center">Fragenverwaltung</h1>
    <ul className="space-y-6">
      {questions.map(question => <li key={question.id}><QuestionItemComponent question={question}/>
      </li>)}
    </ul>
  </div>)
}

export default QuestionsComponent;