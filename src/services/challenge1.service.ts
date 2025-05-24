import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ChallengeOneService {
  constructor(private readonly httpService: HttpService) {}

  async execute(): Promise<any> {
    try {
      let token = await this.realizarLogin()
      return token;
    } catch (error) {
      throw error
    }
  }

  async realizarLogin(): Promise<string> {
    /*
      In this method we are performing a POST to the /login API
      in search of the token to access the other teacher APIs,
      student, mentoring and sessions APIs
    */

    let body = {
      usuario: 'any-user',
      senha: 'any-password'
    }

    let response = await firstValueFrom(
      this.httpService.post(
        'http://localhost:3000/login',
        body
      )
    );

    return response.data['nextgen-auth-token']
  }
}
