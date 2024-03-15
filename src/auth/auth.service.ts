import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { UserRepository } from '../repositories/mocks/user.repository';
import { User } from 'src/models/user.model';

@Injectable()
export class AuthService {
  constructor(private readonly userRepository: UserRepository) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user: User = await this.userRepository.findByUsername(username);
    if (user) {
      return user;
    }
    return null;
  }

  async generateToken(user: User): Promise<string> {
    const token = jwt.sign(user, process.env.SECRET_KEY, { expiresIn: '1h' });
    return token;
  }
}