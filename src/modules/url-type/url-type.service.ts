import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UrlType, UrlTypeDocument } from './schemas/url-type.schema';
import { CreateUrlTypeDto } from './dto/create-url-type.dto';
import { UpdateUrlTypeDto } from './dto/update-url-type.dto';

@Injectable()
export class UrlTypeService {
  constructor(
    @InjectModel(UrlType.name)
    private urlTypeModel: Model<UrlTypeDocument>,
  ) {}

  async create(createUrlTypeDto: CreateUrlTypeDto): Promise<UrlTypeDocument> {
    const createdUrlType = new this.urlTypeModel(createUrlTypeDto);
    return createdUrlType.save();
  }

  async findAll(): Promise<UrlTypeDocument[]> {
    return this.urlTypeModel.find().exec();
  }

  async findOne(id: string): Promise<UrlType | null> {
    return this.urlTypeModel.findById(id).exec();
  }

  async update(id: string, updateUrlTypeDto: UpdateUrlTypeDto): Promise<UrlType | null> {
    return this.urlTypeModel.findByIdAndUpdate(id, updateUrlTypeDto, { new: true }).exec();
  }

  async remove(id: string): Promise<any> {
    return this.urlTypeModel.findByIdAndDelete(id).exec();
  }
}
