import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
} from '@nestjs/websockets';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Credentials } from './dto/credentials-user.dto';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { UseGuards } from '@nestjs/common';
import { RsaService } from 'src/shared/rsa/rsa.service';
import { Server, Socket } from 'socket.io';
import { UpdateUserPassword } from './dto/update-user-password.dto copy';

@WebSocketGateway({ namespace: 'users', cors: '*' })
export class UsersGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly usersService: UsersService,
    private readonly rsaService: RsaService,
  ) {}

  @SubscribeMessage('createUser')
  create(@MessageBody() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @SubscribeMessage('loginUser')
  loginUser(@MessageBody() credentials: Credentials) {
    try {
      const res = this.usersService.signIn(credentials);
      return res;
    } catch (error) {
      return { ok: false, status: 403, statusText: 'Ok' };
    }
  }

  @SubscribeMessage('recoveryUser')
  recoveryUser(@MessageBody() username: string) {
    try {
      const res = this.usersService.recovery(username);
      return res;
    } catch (error) {
      return { ok: false, status: 403, statusText: 'Ok' };
    }
  }

  @UseGuards(JwtAuthGuard)
  @SubscribeMessage('resetUserPassword')
  resetUserPassword(
    @ConnectedSocket() client: Socket,
    @MessageBody() passwords: Omit<UpdateUserPassword, 'id'>,
  ) {
    const userId = client.data.userId;

    try {
      const res = this.usersService.updatePassword({
        id: userId,
        ...passwords,
      });
      return res;
    } catch (error) {
      return { ok: false, status: 403, statusText: 'Ok' };
    }
  }

  @SubscribeMessage('verifyUserEmail')
  verifyUserEmail(
    @MessageBody() { email, key }: { email: string; key: string },
  ) {
    return this.usersService.verification(email, key);
  }

  @UseGuards(JwtAuthGuard)
  @SubscribeMessage('verifyUser')
  async verifyUser(@ConnectedSocket() client: Socket) {
    const userId = client.data.userId;

    const user = await this.usersService.verifyUser(userId);

    user.friendIds.map((id) => {
      this.server.emit(`user:${id}`, user);
    });

    return user;
  }

  @UseGuards(JwtAuthGuard)
  @SubscribeMessage('logout')
  logoutUser(@ConnectedSocket() client: Socket) {
    this.usersService.logout(client.data.userId);
    return 'Ok';
  }

  @SubscribeMessage('findMoreUser')
  async findUsersByIds(@MessageBody() ids: number[]) {
    const users = ids.map((id) => this.usersService.findOne(id));

    return Promise.all(users);
  }

  @SubscribeMessage('findUsersByName')
  async findUsersByName(@MessageBody() searchTerm: string) {
    return this.usersService.findUsersByName(searchTerm);
  }

  @SubscribeMessage('findOneUser')
  findUserById(@MessageBody() id: number) {
    return this.usersService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @SubscribeMessage('updateUser')
  update(
    @ConnectedSocket() client: Socket,
    @MessageBody() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(client.data.userId, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @SubscribeMessage('removeUser')
  remove(@ConnectedSocket() client: Socket) {
    return this.usersService.remove(client.data.userId);
  }
}
