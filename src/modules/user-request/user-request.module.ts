import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserRequestService } from './user-request.service';
import { UserRequest, UserRequestSchema } from './schemas/user-request.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: UserRequest.name, schema: UserRequestSchema }]),
  ],
  providers: [UserRequestService],
  exports: [UserRequestService],
})
export class UserRequestModule {}
