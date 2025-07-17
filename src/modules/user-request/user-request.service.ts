import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  UserRequest,
  UserRequestDocument,
} from './schemas/user-request.schema';
import { CreateUserRequestDto } from './dto/create-user-request.dto';

@Injectable()
export class UserRequestService {
  constructor(
    @InjectModel(UserRequest.name)
    private userRequestModel: Model<UserRequestDocument>,
  ) {}

  async create(
    createUserRequestDto: CreateUserRequestDto,
  ): Promise<UserRequest> {
    const createdUserRequest = new this.userRequestModel(createUserRequestDto);
    return createdUserRequest.save();
  }

  async findPendingRequestsByCheckedUrl(
    checkedUrlId: string,
  ): Promise<UserRequest[]> {
    return this.userRequestModel
      .find({ checkedUrl: checkedUrlId })
      .populate('user')
      .exec();
  }
}
