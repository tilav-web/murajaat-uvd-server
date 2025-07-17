import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CheckedUrlService } from './checkedurl.service';
import { CheckedUrlController } from './checkedurl.controller';
import { CheckedUrl, CheckedUrlSchema } from './schemas/checkedurl.schema';
import { UserRequestModule } from '../user-request/user-request.module';
import { BotModule } from '../bot/bot.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: CheckedUrl.name, schema: CheckedUrlSchema }]),
    UserRequestModule,
    forwardRef(() => BotModule), // Use forwardRef to resolve circular dependency
  ],
  controllers: [CheckedUrlController],
  providers: [CheckedUrlService],
  exports: [CheckedUrlService], // Export CheckedUrlService for use in other modules
})
export class CheckedUrlModule {}

