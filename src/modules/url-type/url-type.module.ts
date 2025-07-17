import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UrlTypeService } from './url-type.service';
import { UrlTypeController } from './url-type.controller';
import { UrlType, UrlTypeSchema } from './schemas/url-type.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: UrlType.name, schema: UrlTypeSchema }]),
  ],
  controllers: [UrlTypeController],
  providers: [UrlTypeService],
  exports: [UrlTypeService], // Export UrlTypeService for use in other modules
})
export class UrlTypeModule {}
