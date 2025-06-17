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
    const url = 'https://oc-workshop.waldemarlehner.de/questions';
    const options = {
      method: 'POST',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify(create)
    };

    try {
      return fetch(url, options).then(res => res.json());
    } catch (error) {
      return Promise.reject(error);
    }
  }


  listQuestions(): Promise<QuestionDto[]> {
    const url = 'https://oc-workshop.waldemarlehner.de/questions';
    const options = {method: 'GET'};

    try {
      return fetch(url, options).then(res => res.json());
    } catch (error) {
      return Promise.reject(error);
    }
  }
}