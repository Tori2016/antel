import { Controller, Get } from '@nestjs/common';

import { SeedersService } from './seeders.service';

import { Auth, GetUser } from '../../auth/decorators';
import { ParseMongoIdPipe } from '../../common/pipes';

@Controller('seeders')
export class SeedersController {
  constructor(private readonly seedersService: SeedersService) {}

  @Get('admin')
  executeSeedAdmin() {
    return this.seedersService.runSeedAdmin();
  }

  @Get('users')
  executeSeedUsers() {
    return this.seedersService.runSeedUsers();
  }
}
