import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Put,
} from '@nestjs/common';

import { DevicesService } from './devices.service';
import { UpdateSaveruleDto, CreateDeviceDto } from './dto';
import { DeleteDto, FindAllDto } from '../common/dto';

import { Auth, GetUser } from '../auth/decorators';
import { ParseMongoIdPipe } from '../common/pipes';
import { ValidRoles } from '../common/interfaces';

@Controller('devices')
export class DevicesController {
  constructor(private readonly devicesService: DevicesService) {}

  @Post(':id')
  @Auth(ValidRoles.ADMIN)
  create(
    @Param('id', ParseMongoIdPipe) userId: string,
    @Body() createDeviceDto: CreateDeviceDto,
  ) {
    return this.devicesService.create(userId, createDeviceDto);
  }

  @Get()
  @Auth()
  findAll(@Query() findAllDto: FindAllDto) {
    return this.devicesService.findAll(findAllDto);
  }

  @Get('select-device/:dId')
  @Auth()
  selectedDevice(
    @Param('dId') dId: string,
    @GetUser('id', ParseMongoIdPipe) userId: string,
  ) {
    return this.devicesService.selectedDevice(userId, dId);
  }

  @Delete()
  @Auth()
  remove(@Query() deleteDto: DeleteDto) {
    return this.devicesService.remove(deleteDto);
  }

  @Put('save-rule')
  @Auth()
  updateSaveruleStatus(@Body() updateSaveruleDto: UpdateSaveruleDto) {
    return this.devicesService.updateSaveruleStatus(updateSaveruleDto);
  }
}
