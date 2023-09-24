import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User } from '../../users/entities/user.schema';
import { Device } from '../../devices/entities/device.schema';

import { getSeedUsers, initialDataAdmin } from './factories';

@Injectable()
export class SeedersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    @InjectModel(Device.name)
    private readonly deviceModel: Model<Device>,
  ) {}

  // Seed Admin
  async runSeedAdmin() {
    const seedAdmin = initialDataAdmin.users;
    await this.userModel.deleteMany({});
    await this.userModel.create(seedAdmin);
    return '¡Seed Admin Execute!';
  }

  // Seed Users
  async runSeedUsers() {
    const users: User[] = getSeedUsers(300);
    await this.userModel.insertMany(users);
    return '¡Seed Users Execute!';
  }
}
