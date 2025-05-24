import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ChallengeOneService } from 'src/services/challenge1.service';
import { ChallengeTwoService } from 'src/services/challenge2.service';
import { ChallengeThreeService } from 'src/services/challenge3.service';
import { ChallengeFourService } from 'src/services/challenge4.service';
import { ChallengeFiveService } from 'src/services/challenge5.service';
import { AlunoFeedbacksDto } from './aluno-feedbacks.dto';

@ApiTags('challenges')
@Controller()
export class AppController {
  constructor(
    private readonly challenge1Service: ChallengeOneService,
    private readonly challenge2Service: ChallengeTwoService,
    private readonly challenge3Service: ChallengeThreeService,
    private readonly challenge4Service: ChallengeFourService,
    private readonly challenge5Service: ChallengeFiveService,
  ) {}

  @Get('challenge-one')
  @ApiOperation({ description: "The TechTaco team started to do the authentication functionality, but couldn't finish. Finalizing this point would be the first step in the project's scope." })
  async getChallengeOne(): Promise<any> {
    return await this.challenge1Service.execute();
  }

  @Get('challenge-two/:cnpj')
  @ApiOperation({ description: "TalentTAP must provide credentials for company representatives who are interested in accessing the talent pool. This authentication is based on the company's CNPJ and we then need to ensure that we have received a valid CNPJ and that it has an active registration. To check the registration, use /validate-company for the service provided." })
  async getChallengeTwo(@Param('cnpj') cnpj: string): Promise<any> {
    return await this.challenge2Service.execute(cnpj);
  }

  @Get('challenge-three')
  @ApiOperation({ description: 'TalentTAP replaces a legacy MentorMunch system that already had a list of companies that was migrated to TalentTAP. There is no guarantee that the data on these companies will be consistent, so it will be necessary to validate the CNPJs on this list and correct any inconsistencies.' })
  async getChallengeThree(): Promise<any> {
    return await this.challenge3Service.execute();
  }

  @Get('challenge-four/:companyName')
  @ApiOperation({ description: "One of the project's PO's greatest desires is a feature that can speed up the filtering of candidates for possible opportunities and hiring. This filter should work on the following premises/business rules: \n1. I as a company need this list to contain only mentors who have the skills that my company is currently interested in.\n2. I want to include in this list only those talents who are mentored by the 10 best Mentors in my company.\n\n\t- If my company has fewer than 10 mentors in those skills, consider mentors from other companies as well.\n3. For this list, I want to see the list of talents, with feedback on those skills that my company is interested in.\n\n\t- There is a service that returns, from a student, a skill and the current evaluation of that student, a rationale for why that evaluation." })
  async getChallengeFour(@Param('companyName') companyName: string): Promise<any> {
    return await this.challenge4Service.execute(companyName);
  }

  @Post('challenge-five')
  @ApiOperation({ description: "From the returned by the service above, we would like to use AI to return to us, for that candidate:\n1.A classification of the candidate's result among the following categories:\n\n\t- Can improve\n\n\t- Meets Expectations\n\n\t- Good result\n\n\t- Excellent result\n2.Verdict for hiring\n\n\t- This result should say whether the candidate should be hired or not, and why." })
  @ApiBody({ type: AlunoFeedbacksDto })
  async getChallengeFive(
    @Body() body: AlunoFeedbacksDto
  ): Promise<any> {
    return await this.challenge5Service.execute(body);
  }
}
