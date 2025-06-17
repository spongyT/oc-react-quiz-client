import {createContext} from "react";
import {QuizService} from "../services/quiz-service.ts";

export const APP_CONTEXT: AppContextProps = {quizService: new QuizService()}
export interface AppContextProps {quizService: QuizService}
export const AppContext = createContext<AppContextProps>(APP_CONTEXT)
export default AppContext;