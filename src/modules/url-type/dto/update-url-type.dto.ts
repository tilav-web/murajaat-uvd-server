import { PartialType } from '@nestjs/mapped-types';
import { CreateUrlTypeDto } from './create-url-type.dto';

export class UpdateUrlTypeDto extends PartialType(CreateUrlTypeDto) {}
