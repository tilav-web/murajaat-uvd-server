import { Module, OnApplicationShutdown, OnModuleInit } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BotModule } from './modules/bot/bot.module';
import { EmergencyModule } from './modules/emergency/emergency.module';
import { AuthModule } from './modules/auth/auth.module';
import { UrlTypeModule } from './modules/url-type/url-type.module';
import { CheckedUrlModule } from './modules/checkedurl/checkedurl.module';
import { UserRequestModule } from './modules/user-request/user-request.module';
import { BotService } from './modules/bot/bot.service';
import { StatisticsModule } from './modules/statistics/statistics.module';
import { GroupModule } from './modules/group/group.module';
import { MailingModule } from './modules/mailing/mailing.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/102'),
    BotModule,
    EmergencyModule,
    AuthModule,
    UrlTypeModule,
    CheckedUrlModule,
    UserRequestModule,
    StatisticsModule,
    GroupModule,
    MailingModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements OnModuleInit, OnApplicationShutdown {
  constructor(private readonly botService: BotService) {}

  async onModuleInit() {
    // await this.botService.launch(); // Botni alohida ishga tushiramiz
  }

  async onApplicationShutdown() {
    await this.botService.stop(); // Ilova yopilganda botni to‘xtatish
  }
}
