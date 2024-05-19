import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async checkUserToken(userId: number, token: string): Promise<boolean> {
    const user = await this.userService.findOne(userId);

    if (!user) {
      return false;
    }

    return user.accessToken === token;
  }

  extractTokenFromHeader(context: any): string | undefined {
    const [type, token] =
      context.handshake.headers['authorization']?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  verify(token: string): any {
    return this.jwtService.verify(token, {
      secret: process.env.JWT_SECRET,
    });
  }
}
