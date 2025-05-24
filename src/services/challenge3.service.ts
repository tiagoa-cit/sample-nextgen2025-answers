import { Injectable } from '@nestjs/common';

@Injectable()
export class ChallengeThreeService {
  constructor() {}

  async execute(): Promise<any> {
    /* 
      Implement challenge 3 

      Validate the existing cnpjs in our database with the list from the API of companies in “SeFaz”, 
      and correct the wrong ones when necessary

      - Search the base of companies
      - Iterate the base by calling challenge 2 and saving the invalid ones
      - For cases of invalid CNPJ, search for the correct value in SeFaz (GetAll)
      - Make a post to adjust the Company registration
    */
  }
}
