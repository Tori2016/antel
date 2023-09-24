import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';

const configService = new ConfigService();

async function generateHash(dataPlain: string): Promise<string> {
  const hash = await bcrypt.hash(dataPlain, +configService.get('HASH_SALT'));
  return hash;
}

async function compareHash(plain: string, hash: string): Promise<any> {
  return await bcrypt.compare(plain, hash);
}

export { generateHash, compareHash };
