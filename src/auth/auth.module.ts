import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthGuard } from './auth.guard';
import { UserRepository } from '../repositories/mocks/user.repository';

@Module({
  imports: [],
  providers: [AuthService, AuthGuard, UserRepository],
  controllers: [AuthController],
  exports: [AuthService, AuthGuard],
})
export class AuthModule {}