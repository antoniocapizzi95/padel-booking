import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import * as jwt from 'jsonwebtoken';
import { User } from '../models/user.model';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const authorizationHeader = request.headers['authorization'];

    if (!authorizationHeader) {
      return false;
    }

    const token = authorizationHeader.replace('Bearer ', '');
    try {
      const user = jwt.verify(token, process.env.SECRET_KEY) as User;
      request.user = user;
      return true;
    } catch {
      return false;
    }
  }
}