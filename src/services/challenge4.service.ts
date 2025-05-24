import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ChallengeFourService {
  constructor(private readonly httpService: HttpService) {}

  /* 
    Implement challenge 4

    - Find a company
    - Search for Teachers
    - Search for students

    - List the company's interests and sort the teachers based on them 
    - Sort those who are employees with priority AND those who have more talents of interest
    - Top 10 teachers from this list
    - Get the mentorships and sessions
    - Search for students involved in the sessions
    - Filters the talents and collects the feedback via API, as we have a bug in the feedback already stored (plot the use of AI here to solve our problem)
    - Expected response:
     {
      "aluno": "id",
      "talentos": [
        {
          "assunto": "typescript",
          "feedbacks": [
            "aaaaaaa",
            "bbbbbb"
          ]
        },
        {
          "assunto": "java",
          "feedbacks": [
            "aaaaaaa",
            "bbbbbb"
          ]
        }
      ]
    }
  */
  async execute(companyName: string): Promise<any> {
    let tokenCompany = await this.authCompany()
    let tokenCandidates = await this.authCandidates()

    let company = await this.getCompany(companyName, tokenCompany)
    let teachers = await this.getTeachers(tokenCandidates['nextgen-auth-token'])
    let mentorships = await this.getMentorships(tokenCandidates['nextgen-auth-token'])
    let sessions = await this.getSessions(tokenCandidates['nextgen-auth-token'])
    let students = await this.getStudents(tokenCandidates['nextgen-auth-token'])
    
    let selectedTeachers = this.filterAndSortProfessoresByInteresses(company, teachers)
    let filteredMentorships = mentorships.filter(mentoria => selectedTeachers.some(x => x.id == mentoria.professor_id) && company.interesses.includes(mentoria.titulo))
    let filteredSessions = sessions.filter(sessao => filteredMentorships.some(x => x.id == sessao.mentoria_id))

    let selectedStudents = students.filter(aluno => filteredSessions.some(x=> x.aluno_id == aluno.id))

    return await this.feedbackReport(selectedStudents, filteredMentorships, filteredSessions)
  }

  filterAndSortProfessoresByInteresses(company: Company, teachers: Teacher[]): Teacher[] {
    return teachers
      .filter(teacher => teacher.talentos.filter(talent => company.interesses.includes(talent)).length > 0) //filter out those who do not have talents in common with the company's interests
      .sort((a, b) => {

        if (a.empresa == company.nome && b.empresa != company.nome) {
          return -1; // a comes before b
        }

        if (a.empresa != company.nome && b.empresa == company.nome) {
            return 1; // b comes before a
        }

        const countA = a.talentos.filter(items => company.interesses.includes(items)).length;
        const countB = b.talentos.filter(items => company.interesses.includes(items)).length;

        return countB - countA; // Desc
      })
      .slice(0, 11); //top 10
  }

  async feedbackReport(students: Student[], mentorships: Mentorship[], sessions: Session[]) {
    const report: any[] = [];

    // Group feedback by student and talent
    const feedbackMap: { [key: number]: { [key: string]: string[] } } = {};

    for (const session of sessions) {
        const { aluno_id: student_id, mentoria_id: mentorship_id } = session;
        const mentorship = mentorships.find(m => m.id === mentorship_id);

        if (!feedbackMap[student_id]) {
            feedbackMap[student_id] = {};
        }

        // Procura o aluno correspondente
        const student = students.find(a => a.id === student_id);
        if (student && mentorship) {
            // Check if the mentoring is linked to any of the student's talents
            for (const talent of student.talentos) {
                if (mentorship.titulo.toLowerCase().includes(talent.nome.toLowerCase())) {
                    if (!feedbackMap[student_id][talent.nome]) {
                        feedbackMap[student_id][talent.nome] = [];
                    }

                    const feedback = await this.postCollectFeedback(student.id, talent);
                    feedbackMap[student_id][talent.nome].push(feedback);
                }
            }
        }
    }

    // Assemble the return object
    students.forEach(aluno => {
        const feedbacksPerStudent = feedbackMap[aluno.id];
        if (feedbacksPerStudent) {
            const talentos = Object.keys(feedbacksPerStudent).map(talent => ({
                assunto: talent,
                feedbacks: feedbacksPerStudent[talent],
            }));

            report.push({
                aluno_id: aluno.id,
                aluno_nome: aluno.nome,
                talentos,
            });
        }
    });

    return report;
  }

  async authCompany(): Promise<string> {
    return await this.getData('http://localhost:3000/auth-empresa')
  }

  async authCandidates(): Promise<string> {
    let body = {
      usuario: 'any-user',
      senha: 'any-password'
    }

    return await this.postData('http://localhost:3000/login', body = body)
  }

  async getCompany(companyName: string, token: string): Promise<Company> {
    let header = {
      'nextgen-auth-token': token
    }

    return await this.getData(`http://localhost:3000/empresa/${companyName}`, header)
  }

  async getTeachers(token: string): Promise<Teacher[]> {
    let header = {
      'nextgen-auth-token': token
    }
    return await this.getData(`http://localhost:3000/professor`, header)
  }

  async getStudents(token: string): Promise<Student[]> {
    let header = {
      'nextgen-auth-token': token
    }
    return await this.getData(`http://localhost:3000/aluno`, header)
  }

  async getMentorships(token: string): Promise<Mentorship[]> {
    let header = {
      'nextgen-auth-token': token
    }
    return await this.getData(`http://localhost:3000/mentoria`, header)
  }

  async getSessions(token: string): Promise<Session[]> {
    let header = {
      'nextgen-auth-token': token
    }
    return await this.getData(`http://localhost:3000/sessao`, header)
  }

  async getData(endpoint: string, headers: any = null): Promise<any> {
    let response = await firstValueFrom(
      this.httpService.get(endpoint, { headers: headers })
    );
    return response.data
  }

  async postCollectFeedback(studentId: number, talent: TalentStudent): Promise<string> {
    let body = {
      nome: talent.nome,
      avaliacao: talent.avaliacao
    }

    return await this.postData(`http://localhost:3000/prompt/coletar-feedback/${studentId}`, body = body)
  }

  async postData(endpoint: string, body: any = null, headers: any = null): Promise<any> {
    let response = await firstValueFrom(
      this.httpService.post(endpoint, body, { headers: headers })
    );
    return response.data
  }
}

export class Company {
  constructor(
      public readonly nome: string,
      public readonly cnpj: string,
      public readonly setor: string,
      public readonly interesses: string[],
      public readonly endereco: string,
      public readonly email: string,
      public readonly linkedin: string,
  ) {}
}

export class Teacher {
  constructor(
      public readonly id: number,
      public readonly nome: string,
      public readonly cpf: string,
      public readonly empresa: string,
      public readonly talentos: string[],
      public readonly idade: number,
      public readonly email: string,
      public readonly linkedin: string,
      public readonly pronomes: string,
      public readonly endereco: string,
  ) {}
}

export class Student {
  constructor(
      public readonly id: number,
      public readonly nome: string,
      public readonly cpf: string,
      public readonly talentos: TalentStudent[],
      public readonly idade: number,
      public readonly email: string,
      public readonly linkedin: string,
      public readonly pronomes: string,
      public readonly endereco: string,
  ) {}
}

class TalentStudent {
  constructor(
      public readonly nome: string,
      public readonly avaliacao: number
  ) {}
}

export class Mentorship {
  constructor(
      public readonly id: string,
      public readonly titulo: string,
      public readonly professor_id: number,
      public readonly data_inicio: string,
      public readonly data_fim: string,
      public readonly descricao: string
  ) {}
}

export class Session {
  constructor(
      public readonly id: string,
      public readonly mentoria_id: string,
      public readonly data: string,
      public readonly aluno_id: number,
      public readonly feedback: string
  ) {}
}