import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { EventEmitter2 } from '@nestjs/event-emitter';
import * as generator from 'generate-password';

import { InactivateDto } from '../common/dto/inactivate.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { FindAllDto } from '../common/dto';

import { User } from './entities/user.schema';
import { HandleError, generateHash, makeId } from '../utils';
import { ModelExt } from '../common/interfaces';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    @InjectModel(User.name)
    private readonly userModel: ModelExt<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    // const genPassword = 'Jesus.123';

    // TODO: Activar en producción
    const genPassword = generator.generate({
      length: 15,
      numbers: true,
      uppercase: true,
      lowercase: true,
      symbols: true,
    });

    try {
      const user = await this.userModel.create({
        ...createUserDto,
        password: await generateHash(genPassword),
        token: await makeId(40),
      });

      const newUser = user.toObject();
      newUser.password = genPassword;

      // TODO: Activar en producción
      this.eventEmitter.emit('user-create', newUser);

      return { message: 'USER_CREATED' };
    } catch (error) {
      if (error.code === 11000) {
        throw HandleError.createSignatureError(
          `${error.code}-${JSON.stringify(error.keyValue)}`,
        );
      }
      throw HandleError.createSignatureError('INTERNAL_SERVER_ERROR');
    }
  }

  async findAll(findAllDto: FindAllDto): Promise<User[]> {
    const { limit = 0, offset = 0 } = findAllDto;

    try {
      const users: User[] = await this.userModel
        .find()
        .limit(limit)
        .skip(offset);

      if (users.length === 0) {
        throw new HandleError({
          type: 'NOT_FOUND',
          message: 'USERS_NOT_FOUND',
        });
      }
      return users;
    } catch (error) {
      throw HandleError.createSignatureError(error.message);
    }
  }

  async findOne(id: string): Promise<User> {
    try {
      const user: User = await this.userModel.findById(id);
      if (!user) {
        throw new HandleError({
          type: 'NOT_FOUND',
          message: 'USER_NOT_FOUND',
        });
      }
      return user;
    } catch (error) {
      throw HandleError.createSignatureError(error.message);
    }
  }

  async inactivateUser(inactivateDto: InactivateDto) {
    const { userId, status } = inactivateDto;

    try {
      const inactivatedUser = await this.userModel.findOneAndUpdate(
        { _id: userId },
        { isActive: status },
      );

      if (!inactivatedUser) {
        throw new HandleError({
          type: 'BAD_REQUEST',
          message: 'USER_NOT_STATUS_CHANGE',
        });
      }

      return { message: 'USER_STATUS_CHANGE' };
    } catch (error) {
      throw HandleError.createSignatureError(error.message);
    }
  }

  async updateAvatar(id: string, updateUserDto: UpdateUserDto) {
    try {
      const { avatar } = updateUserDto;

      const updatedUser = await this.userModel.updateOne(
        { _id: id },
        { avatar },
      );

      if (updatedUser.modifiedCount == 0 && updatedUser.matchedCount == 0) {
        throw new HandleError({
          type: 'BAD_REQUEST',
          message: 'USER_NOT_UPDATED',
        });
      }

      return { message: 'USER_UPDATED' };
    } catch (error) {
      throw HandleError.createSignatureError(error.message);
    }
  }

  async removeUser(id: string) {
    try {
      const userDeleted = await this.userModel.delete({ _id: id });
      if (userDeleted.modifiedCount === 0) {
        throw new HandleError({
          type: 'BAD_REQUEST',
          message: 'USER_NOT_DELETED',
        });
      }
      return { message: 'USER_DELETED' };
    } catch (error) {
      throw HandleError.createSignatureError(error.message);
    }
  }

  async restoreUser(id: string) {
    try {
      const userRestored = await this.userModel.restore({ _id: id });
      if (userRestored.modifiedCount === 0) {
        throw new HandleError({
          type: 'BAD_REQUEST',
          message: 'USER_NOT_RESTORED',
        });
      }
      return { message: 'USER_RESTORED' };
    } catch (error) {
      throw HandleError.createSignatureError(error.message);
    }
  }
}
