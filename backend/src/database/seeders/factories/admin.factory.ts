import * as bcrypt from 'bcryptjs';

import { ValidRoles } from '../../../common/interfaces';

export const initialDataAdmin = {
  users: [
    {
      firstName: 'Andres',
      lastName: 'Nieto',
      avatar: '',
      email: 'andres@antel.com.co',
      phone: '+573166852866',
      role: ValidRoles.ADMIN,
      password: bcrypt.hashSync('Antel.123', 10),
      isVerified: true,
      isActive: true,
      token: '',
    },
    {
      firstName: 'Usuario',
      lastName: 'Demo',
      avatar: '',
      email: 'usuario@antel.com.co',
      phone: '+573166852800',
      role: ValidRoles.USER,
      password: bcrypt.hashSync('Antel.123', 10),
      isVerified: true,
      isActive: true,
      token: '',
    },
  ],
};
