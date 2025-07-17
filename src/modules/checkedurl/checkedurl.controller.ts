import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UsePipes,
  ValidationPipe,
  Query,
} from '@nestjs/common';
import { CheckedUrlService } from './checkedurl.service';
import { CreateCheckedUrlDto } from './dto/create-checkedurl.dto';
import { UpdateCheckedUrlDto } from './dto/update-checkedurl.dto';
import { CheckedUrlStatus } from './schemas/checkedurl.schema';

@Controller('checkedurl')
export class CheckedUrlController {
  constructor(private readonly checkedUrlService: CheckedUrlService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ transform: true }))
  create(@Body() createCheckedUrlDto: CreateCheckedUrlDto) {
    return this.checkedUrlService.create(createCheckedUrlDto);
  }

  @Get()
  findAll(@Query('status') status?: CheckedUrlStatus) {
    return this.checkedUrlService.findAll(status);
  }

  @Get('pending-count')
  getPendingCount() {
    return this.checkedUrlService.getPendingCount();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.checkedUrlService.findOne(id);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  update(@Param('id') id: string, @Body() updateCheckedUrlDto: UpdateCheckedUrlDto) {
    return this.checkedUrlService.update(id, updateCheckedUrlDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.checkedUrlService.remove(id);
  }
}
