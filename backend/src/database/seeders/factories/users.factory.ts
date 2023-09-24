import { faker } from '@faker-js/faker/locale/es';
import * as bcrypt from 'bcryptjs';

import { ValidRoles } from '../../../common/interfaces';
import { User } from '../../../users/entities/user.schema';

function seedUsers() {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const avatar = '';
  const email = faker.internet.email();
  const phone = faker.phone.number('+5731########');
  const role = ValidRoles.USER;
  const password = bcrypt.hashSync('Jesus.123', 10);

  return {
    firstName,
    lastName,
    avatar,
    email,
    phone,
    role,
    password,
  };
}

export function getSeedUsers(numUsers: number): User[] {
  const users = [];
  for (let i = 0; i < numUsers; i++) {
    const user = seedUsers();
    users.push(user);
  }
  return users;
}
