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
} from '@nestjs/common';
import { UrlTypeService } from './url-type.service';
import { CreateUrlTypeDto } from './dto/create-url-type.dto';
import { UpdateUrlTypeDto } from './dto/update-url-type.dto';

@Controller('url-type')
export class UrlTypeController {
  constructor(private readonly urlTypeService: UrlTypeService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ transform: true }))
  create(@Body() createUrlTypeDto: CreateUrlTypeDto) {
    return this.urlTypeService.create(createUrlTypeDto);
  }

  @Get()
  findAll() {
    return this.urlTypeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.urlTypeService.findOne(id);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  update(@Param('id') id: string, @Body() updateUrlTypeDto: UpdateUrlTypeDto) {
    return this.urlTypeService.update(id, updateUrlTypeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.urlTypeService.remove(id);
  }
}
