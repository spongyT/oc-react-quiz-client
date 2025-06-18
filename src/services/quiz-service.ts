import axios from 'axios'

export interface QuestionDto {
  id: string
  text: string
  options: OptionDto[]
}

export interface OptionDto {
  text: string
  id: string
  correct: boolean
}

export interface CreateQuestionDto {
  text: string
  options: CreateOptionDto[]
}

export interface CreateOptionDto {
  text: string
  correct: boolean
}

export class QuizService {
  createQuestion(create: CreateQuestionDto): Promise<QuestionDto> {
    const url = 'https://oc-workshop.waldemarlehner.de/questions'
    return axios.post(url, create).then((res) => res.data)
  }

  listQuestions(): Promise<QuestionDto[]> {
    const url = 'https://oc-workshop.waldemarlehner.de/questions'
    return axios.get(url).then((res) => res.data)
  }
}
