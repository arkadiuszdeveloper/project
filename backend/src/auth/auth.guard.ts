import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';
import { AuthService } from './auth.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const client: Socket = context.switchToWs().getClient();

    try {
      const token = this.authService.extractTokenFromHeader(request);
      const payload = this.authService.verify(token);

      if (!payload) {
        client.emit('authFailed', {
          ok: false,
          status: 401,
          statusText: 'Unauthorized',
        });
        return false;
      }

      const authed = await this.authService.checkUserToken(payload.sub, token);
      if (!authed) {
        client.emit('authFailed', {
          ok: false,
          status: 401,
          statusText: 'Unauthorized',
        });
        return false;
      }

      client.data.userId = payload.sub;

      return true;
    } catch {
      client.emit('authFailed', {
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
      });
      return false;
    }
  }
}
