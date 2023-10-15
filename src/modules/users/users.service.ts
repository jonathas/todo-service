import { Injectable } from '@nestjs/common';
import { Users } from './users.entity';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';
import { promisify } from 'util';
import { InjectRepository } from '@nestjs/typeorm';
const cryptoRandomFill = promisify(crypto.randomFill);

@Injectable()
export class UsersService {
  public constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>
  ) {}

  public findOne(id: number): Promise<Users> {
    return this.usersRepository.findOne({ where: { id } });
  }

  public findOneByEmail(email: string): Promise<Users> {
    return this.usersRepository.findOne({ where: { email } });
  }

  public async create(email: string): Promise<Users> {
    const password = await this.createSimplePassword();
    return this.usersRepository.save(this.usersRepository.create({ email, password }));
  }

  private async createSimplePassword(length = 8): Promise<string> {
    const allChars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz@%.?';
    const buf = await cryptoRandomFill(new Uint32Array(length));
    return Array.from(buf as Uint32Array)
      .map((x) => allChars[x % allChars.length])
      .join('');
  }
}
