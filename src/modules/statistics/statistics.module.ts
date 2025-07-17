import { Module } from '@nestjs/common';
import { StatisticsController } from './statistics.controller';
import { StatisticsService } from './statistics.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../user/schemas/user.schema';
import { UserRequest, UserRequestSchema } from '../user-request/schemas/user-request.schema';
import { CheckedUrl, CheckedUrlSchema } from '../checkedurl/schemas/checkedurl.schema';
import { Emergency, EmergencySchema } from '../emergency/schemas/emergency.schema';
import { Group, GroupSchema } from '../group/schemas/group.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: UserRequest.name, schema: UserRequestSchema },
      { name: CheckedUrl.name, schema: CheckedUrlSchema },
      { name: Emergency.name, schema: EmergencySchema },
      { name: Group.name, schema: GroupSchema },
    ]),
  ],
  controllers: [StatisticsController],
  providers: [StatisticsService],
})
export class StatisticsModule {}