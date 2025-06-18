import {createContext} from "react";
import {QuizService} from "../services/quiz-service.ts";
import {AiQuestionService} from "@/services/ai-question-service.ts";

export const APP_CONTEXT: AppContextProps = {quizService: new QuizService(), aiQuestionService: new AiQuestionService()}
export interface AppContextProps {quizService: QuizService, aiQuestionService: AiQuestionService}
export const AppContext = createContext<AppContextProps>(APP_CONTEXT)
export default AppContext;