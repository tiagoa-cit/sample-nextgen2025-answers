export class AlunoFeedbacksDto {
    aluno_id: number;
    talentos: TalentoDto[];
}

export class TalentoDto {
    assunto: string;
    feedbacks: string[];
}