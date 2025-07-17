import { PartialType } from '@nestjs/mapped-types';
import { CreateCheckedUrlDto } from './create-checkedurl.dto';

export class UpdateCheckedUrlDto extends PartialType(CreateCheckedUrlDto) {}
