import { Module } from '@nestjs/common';
import { AppController } from './controllers/app.controller';
import { HttpModule } from '@nestjs/axios';
import { ChallengeOneService } from './services/challenge1.service';
import { ChallengeTwoService } from './services/challenge2.service';
import { ChallengeThreeService } from './services/challenge3.service';
import { ChallengeFourService } from './services/challenge4.service';
import { ChallengeFiveService } from './services/challenge5.service';

@Module({
  imports: [HttpModule],
  controllers: [AppController],
  providers: [
    ChallengeOneService,
    ChallengeTwoService,
    ChallengeThreeService,
    ChallengeFourService,
    ChallengeFiveService,
  ],
})
export class AppModule {}
