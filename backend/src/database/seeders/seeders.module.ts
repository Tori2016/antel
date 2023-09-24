import { Module } from '@nestjs/common';

import { SeedersService } from './seeders.service';
import { SeedersController } from './seeders.controller';
import { UsersModule } from '../../users/users.module';
import { DevicesModule } from '../../devices/devices.module';

@Module({
  imports: [UsersModule, DevicesModule],
  controllers: [SeedersController],
  providers: [SeedersService],
})
export class SeedersModule {}
