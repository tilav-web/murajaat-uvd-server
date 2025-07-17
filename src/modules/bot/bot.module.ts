import { Module, forwardRef } from '@nestjs/common';
import { BotService } from './bot.service';
import { UserModule } from '../user/user.module';
import { EmergencyModule } from '../emergency/emergency.module';
import { CheckedUrlModule } from '../checkedurl/checkedurl.module';
import { UserRequestModule } from '../user-request/user-request.module';
import { UrlTypeModule } from '../url-type/url-type.module';
import { GroupModule } from '../group/group.module';

@Module({
  imports: [UserModule, EmergencyModule, forwardRef(() => CheckedUrlModule), UserRequestModule, UrlTypeModule, GroupModule],
  providers: [BotService],
  exports: [BotService],
})
export class BotModule {}
