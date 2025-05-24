import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ChallengeTwoService {
  constructor(private readonly httpService: HttpService) {}

  async execute(cnpj: string): Promise<any> {
    const valido = this.validateCnpj(cnpj);

    if (valido) {
      const token = await this.generateCompanyToken();
      return await this.validateCompany(cnpj, token);
    } else {
      return 'The CPNJ sent is invalid!';
    }
  }

  validateCnpj(cnpj: string): boolean {
    // Remove non-numeric characters
    cnpj = cnpj.replace(/\D/g, '');

    // Check if the CNPJ has 14 digits
    if (cnpj.length !== 14) {
      return false;
    }

    // Calculation of the first check digit
    const firstDigit = this.calculateDigit(cnpj, 12);
    if (Number(cnpj[12]) !== firstDigit) {
      return false;
    }

      // Calculation of the second check digit
    const secondDigit = this.calculateDigit(cnpj, 13);
    if (Number(cnpj[13]) !== secondDigit) {
      return false;
    }

    return true;
  }

  calculateDigit(cnpj: string, length: number): number {
    let sum = 0;
    let weight = length === 12 ? 5 : 6;

    for (let i = 0; i < length; i++) {
      sum += Number(cnpj[i]) * weight;
      weight = weight === 2 ? 9 : weight - 1;
    }

    const remainder = sum % 11;
    return remainder < 2 ? 0 : 11 - remainder;
  }

  async generateCompanyToken(): Promise<string> {
    const response = await firstValueFrom(
      this.httpService.get('http://localhost:3000/auth-empresa'),
    );

    return response.data;
  }

  async validateCompany(cnpj: string, token: string): Promise<any> {
    const header = {
      'nextgen-auth-token': token,
    };

    const body = {
      cnpj: cnpj,
    };

    const response = await firstValueFrom(
      this.httpService.post('http://localhost:3000/valida-empresa', body, {
        headers: header,
      }),
    );

    return response.data;
  }
}
