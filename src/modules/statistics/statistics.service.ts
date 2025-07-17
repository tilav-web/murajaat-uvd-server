import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument, UserStatus } from '../user/schemas/user.schema';
import { UserRequest, UserRequestDocument } from '../user-request/schemas/user-request.schema';
import { CheckedUrl, CheckedUrlDocument } from '../checkedurl/schemas/checkedurl.schema';
import { Emergency, EmergencyDocument } from '../emergency/schemas/emergency.schema';
import { Group, GroupDocument, GroupStatus } from '../group/schemas/group.schema';

@Injectable()
export class StatisticsService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(UserRequest.name) private userRequestModel: Model<UserRequestDocument>,
    @InjectModel(CheckedUrl.name) private checkedUrlModel: Model<CheckedUrlDocument>,
    @InjectModel(Emergency.name) private emergencyModel: Model<EmergencyDocument>,
    @InjectModel(Group.name) private groupModel: Model<GroupDocument>,
  ) {}

  async getStatistics(startDate?: string, endDate?: string) {
    const totalUsers = await this.userModel.countDocuments().exec();
    const activeUsers = await this.userModel.countDocuments({ status: UserStatus.ACTIVE }).exec();
    const notActiveUsers = await this.userModel.countDocuments({ status: UserStatus.NOT_ACTIVE }).exec();
    const blockedUsers = await this.userModel.countDocuments({ status: UserStatus.BLOCK }).exec();

    const totalRequests = await this.userRequestModel.countDocuments().exec();
    const totalEmergencies = await this.emergencyModel.countDocuments().exec();

    const totalGroups = await this.groupModel.countDocuments().exec();
    const activeGroups = await this.groupModel.countDocuments({ status: GroupStatus.ACTIVE }).exec();
    const notActiveGroups = await this.groupModel.countDocuments({ status: GroupStatus.NOT_ACTIVE }).exec();
    const blockedGroups = await this.groupModel.countDocuments({ status: GroupStatus.BLOCKED }).exec();

    const emergenciesByDatePipeline: any[] = [];
    const matchStage: any = { createdAt: {} };

    if (startDate) {
      matchStage.createdAt.$gte = new Date(startDate);
    } else {
      // Default to the beginning of the current month if no start date is provided
      const now = new Date();
      matchStage.createdAt.$gte = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    if (endDate) {
      matchStage.createdAt.$lte = new Date(endDate);
    } else {
      // Default to the end of the current month if no end date is provided
      const now = new Date();
      matchStage.createdAt.$lte = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    }

    emergenciesByDatePipeline.push({
      $match: matchStage,
    });

    emergenciesByDatePipeline.push(
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    );

    const emergenciesByDate = await this.emergencyModel.aggregate(emergenciesByDatePipeline);

    const checkedUrlsByType = await this.checkedUrlModel.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
          },
        },
      ]);

    return {
      totalUsers,
      activeUsers,
      notActiveUsers,
      blockedUsers,
      totalRequests,
      totalEmergencies,
      totalGroups,
      activeGroups,
      notActiveGroups,
      blockedGroups,
      emergenciesByDate,
      checkedUrlsByType,
    };
  }
}