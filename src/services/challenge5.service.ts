import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { AlunoFeedbacksDto } from 'src/controllers/aluno-feedbacks.dto';

@Injectable()
export class ChallengeFiveService {
  constructor(private readonly httpService: HttpService) {}

  async execute(studentFeedbacks: AlunoFeedbacksDto): Promise<any> {
    /* 
      Implement challenge 5

      - Use AI to analyze this feedback
      - Return the analysis of these feedbacks and the conclusion whether the student is approved or not for the vacancy
    */

    return await this.postConclusion(studentFeedbacks)
  }

  async postConclusion(studentFeedbacks: AlunoFeedbacksDto): Promise<string> {
    let body = {
      temperature: 1,
      stream: false,
      model: "string",
      messages: [
        {
          role: "system",
          content: "Você é um analista de RH especialista e muito criterioso que está analisando um perfil para contratar para sua empresa se baseando em um relatório contendo os feedbacks com o desempenho do candidato. Os feedbacks são prolixos e confusos, mantenha-se atento apenas para os pontos importantes e seja direto com as sua conclusão. Me responda no formato\n\n### Desempenho = as opções são: ruim, médio, satisfatório e excelente\n\n### Devo contratar? = responser entre sim e não e justificar o porque."
        },
        {
          role: "user",
          content: `Seguem os feedbacks de todos os temas estudados:\n\n${JSON.stringify(studentFeedbacks.talentos)}`
        }
      ]
    }

    let response = await firstValueFrom(
      this.httpService.post('http://localhost:3000/prompt', body)
    );

    return response.data
  }
}
