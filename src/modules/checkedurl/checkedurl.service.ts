import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CheckedUrl, CheckedUrlDocument, CheckedUrlStatus } from './schemas/checkedurl.schema';
import { CreateCheckedUrlDto } from './dto/create-checkedurl.dto';
import { UpdateCheckedUrlDto } from './dto/update-checkedurl.dto';
import { UserRequestService } from 'src/modules/user-request/user-request.service';
import { BotService } from 'src/modules/bot/bot.service';

@Injectable()
export class CheckedUrlService {
  constructor(
    @InjectModel(CheckedUrl.name)
    private checkedUrlModel: Model<CheckedUrlDocument>,
    private userRequestService: UserRequestService,
    @Inject(forwardRef(() => BotService))
    private botService: BotService,
  ) {}

  async create(createCheckedUrlDto: CreateCheckedUrlDto): Promise<CheckedUrlDocument> {
    const createdCheckedUrl = new this.checkedUrlModel(createCheckedUrlDto);
    return createdCheckedUrl.save();
  }

  async findOneByUrl(url: string): Promise<CheckedUrlDocument | null> {
    return this.checkedUrlModel.findOne({ url }).exec();
  }

  async findAll(status?: CheckedUrlStatus): Promise<CheckedUrl[]> {
    const query: any = {};
    if (status) {
      query.status = status;
    }
    return this.checkedUrlModel.find(query).populate('type').exec();
  }

  async findOne(id: string): Promise<CheckedUrl | null> {
    return this.checkedUrlModel.findById(id).populate('type').exec();
  }

  async update(id: string, updateCheckedUrlDto: UpdateCheckedUrlDto): Promise<CheckedUrl | null> {
    const oldCheckedUrl = await this.checkedUrlModel.findById(id).exec();
    if (!oldCheckedUrl) {
      return null;
    }

    const updatedCheckedUrl = await this.checkedUrlModel.findByIdAndUpdate(id, updateCheckedUrlDto, { new: true }).populate('type').exec();

    // If status has changed, notify users
    if (oldCheckedUrl.status !== updatedCheckedUrl.status) {
      const pendingRequests = await this.userRequestService.findPendingRequestsByCheckedUrl(updatedCheckedUrl._id.toString());

      let message = '';
      switch (updatedCheckedUrl.status) {
        case CheckedUrlStatus.ALLOWED:
          message = 'Siz soʻragan URL ruxsat etilgan.';
          break;
        case CheckedUrlStatus.BLOCKED:
          message = 'Siz soʻragan URL taqiqlangan.';
          if (updatedCheckedUrl.category) {
            message += ` Sababi: ${updatedCheckedUrl.category}.`;
          }
          break;
        case CheckedUrlStatus.UNKNOWN:
          message = 'Siz soʻragan URL holati nomaʼlum deb belgilandi.';
          break;
        case CheckedUrlStatus.PENDING:
          // Should not happen if status is changed from PENDING to something else
          break;
      }

      for (const request of pendingRequests) {
        console.log('Attempting to send message to user with telegram_id:', request.user.telegram_id, 'for request ID:', request._id);
        // Assuming request.user is populated and has a chatId field
        await this.botService.sendMessage(request.user.telegram_id, message);
      }
    }

    return updatedCheckedUrl;
  }

  async remove(id: string): Promise<any> {
    return this.checkedUrlModel.findByIdAndDelete(id).exec();
  }

  async getPendingCount(): Promise<number> {
    return this.checkedUrlModel.countDocuments({ status: CheckedUrlStatus.PENDING }).exec();
  }
}
