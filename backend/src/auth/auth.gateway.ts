import { WebSocketGateway } from '@nestjs/websockets';
import { AuthService } from './auth.service';

@WebSocketGateway()
export class AuthGateway {
  constructor(private readonly authService: AuthService) {}
}
