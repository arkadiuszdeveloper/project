import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Credentials } from './dto/credentials-user.dto';
import { MailService } from 'src/mail/mail.service';
import { JwtService } from '@nestjs/jwt';
import { RsaService } from 'src/shared/rsa/rsa.service';
import { UpdateUserPassword } from './dto/update-user-password.dto copy';

const getRandom = (): number =>
  Math.floor(Math.random() * Math.random() * 1000);

function generateRandomString(length: number) {
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly mailService: MailService,
    private readonly jwtService: JwtService,
    private readonly rsaService: RsaService,
  ) {}

  getVerificationKey = () => generateRandomString(5);

  async setVerificationKey() {
    const verificationKey = this.getVerificationKey();

    const topic = 'Account verification!';
    const text = `Key: ${verificationKey}`;

    // await this.mailService.sendEmail(
    //   newUser.username,
    //   newUser.email,
    //   topic,
    //   text,
    // );
    return verificationKey;
  }

  async create(createUserDto: CreateUserDto) {
    const user = await this.findOneByUsername(createUserDto.username);

    if (user) {
      return { ok: false, status: 409, statusText: 'Conflict' };
    }

    const { password, ...newUser } = createUserDto;
    const passwordHash = await bcrypt.hash(password, 10);

    const { privateKey, publicKey } = this.rsaService.generateRSAKeyPair(
      createUserDto.password,
    );

    const verificationKey = await this.setVerificationKey();

    const { id, username, email, ...restUserData } =
      await this.userRepository.save({
        passwordHash,
        publicKey: publicKey,
        verificationKey: verificationKey,
        ...newUser,
      });

    const accessToken = await this.createLoginToken(username, id);
    return {
      ok: true,
      status: 201,
      statusText: 'Ok',
      accessToken,
      email,
      userId: id,
    };
  }

  async signIn(credentials: Credentials) {
    const { username, password } = credentials;

    const user = await this.userRepository.findOneBy({ username });
    if (!user) {
      return { ok: false, status: 404, statusText: 'Not Found' };
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return { ok: false, status: 403, statusText: 'Forbidden' };
    }

    if (!user.emailVerified || user.emailVerification) {
      const verificationKey = await this.setVerificationKey();
      await this.userRepository.update(user.id, { verificationKey });

      return {
        ok: false,
        status: 403,
        statusText: 'Forbidden',
        email: user.email,
      };
    }

    if (user.accessToken) {
      let payload;
      try {
        payload = this.jwtService.verify(user.accessToken, {
          secret: process.env.JWT_SECRET,
        });

        if (payload.sub !== user.id) {
          return {
            ok: false,
            status: 403,
            statusText: 'Forbidden1',
          };
        } else {
          const verificationKey = await this.setVerificationKey();
          await this.userRepository.update(user.id, { verificationKey });

          return {
            ok: false,
            status: 201,
            statusText: 'Ok',
            email: user.email,
          };
        }
      } catch (error) {
        if (error.message === 'jwt expired') {
          const verificationKey = await this.setVerificationKey();
          await this.userRepository.update(user.id, { verificationKey });

          return {
            ok: false,
            status: 201,
            statusText: 'Forbidden (expired)',
            email: user.email,
          };
        }

        if (error.message === 'jwt invalid') {
          return {
            ok: false,
            status: 403,
            statusText: 'Forbidden (invalid)',
          };
        }

        return {
          ok: false,
          status: 403,
          statusText: 'Forbidden',
        };
      }
    }

    const accessToken = await this.createLoginToken(user.username, user.id);
    return {
      ok: true,
      status: 201,
      statusText: 'Ok',
      accessToken,
      userId: user.id,
    };
  }

  async recovery(username: string) {
    const user = await this.userRepository.findOneBy({ username });
    if (!user) {
      return { ok: false, status: 404, statusText: 'Not Found' };
    }

    if (!user.emailVerified) {
      return {
        ok: false,
        status: 403,
        statusText: 'Forbidden',
        email: user.email,
        emailVerified: user.emailVerified,
      };
    }

    const verificationKey = await this.setVerificationKey();
    await this.userRepository.update(user.id, {
      verificationKey: verificationKey,
    });

    return {
      ok: true,
      status: 200,
      statusText: 'Ok',
      email: user.email,
    };
  }

  async updatePassword({ id, newPassword }: UpdateUserPassword) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      return { ok: false, status: 404, statusText: 'Not Found' };
    }

    const newPasswordHash = await bcrypt.hash(newPassword, 10);
    this.userRepository.update(id, { passwordHash: newPasswordHash });

    return;
  }

  // async updatePassword({ id, newPassword, oldPassword }: UpdateUserPassword) {
  //   const user = await this.userRepository.findOneBy({ id });
  //   if (!user) {
  //     return { ok: false, status: 404, statusText: 'Not Found' };
  //   }

  //   const match = await bcrypt.compare(oldPassword, user.passwordHash);
  //   if (!match) {
  //     return { ok: false, status: 403, statusText: 'Forbidden' };
  //   }

  //   const newPasswordHash = await bcrypt.hash(newPassword, 10);
  //   this.userRepository.update(id, { passwordHash: newPasswordHash });

  //   return;
  // }

  async createLoginToken(username: string, id: number) {
    const currentTime = new Date();
    const payload = { username, sub: id };
    const accessToken = await this.jwtService.signAsync(payload);

    await this.userRepository.update(id, {
      lastLoginDateTime: currentTime,
      lastActiveDateTime: currentTime,
      accessToken,
    });

    return accessToken;
  }

  async verifyUser(id: number) {
    const currentTime = new Date();

    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      return null;
    }

    await this.userRepository.update(id, {
      lastActiveDateTime: currentTime,
    });

    return user;
  }

  async verification(email: string, key: string) {
    const user = await this.userRepository.findOneBy({ email });

    if (!user) {
      return { ok: false, status: 404, statusText: 'Not Found' };
    }

    // if (user.emailVerified) {
    //   return {
    //     ok: false,
    //     status: 403,
    //     statusText: 'Forbidden',
    //     emailVerified: true,
    //   };
    // }

    const match = user.verificationKey === key;
    if (!match) {
      return { ok: false, status: 403, statusText: 'Forbidden' };
    }

    await this.userRepository.update(user.id, {
      emailVerified: true,
      verificationKey: '',
    });

    const accessToken = await this.createLoginToken(user.username, user.id);
    return {
      ok: true,
      status: 201,
      statusText: 'Ok',
      accessToken,
      userId: user.id,
    };
  }

  async sendVerificationCodeByEmail(email: string) {
    const user = await this.userRepository.findOneBy({ email });

    if (!user) {
      return { ok: false, status: 404, statusText: 'Not Found' };
    }

    if (user.emailVerified) {
      return { ok: false, status: 403, statusText: 'Forbidden' };
    }

    const verificationKey = this.getVerificationKey();
    const topic = 'Account verification!';
    const text = `Key: ${verificationKey}`;

    await this.mailService.sendEmail(user.username, user.email, topic, text);

    return { ok: true, status: 201, statusText: 'Ok' };
  }

  async sendVerificationCodeByName(username: string) {
    const user = await this.userRepository.findOneBy({ username });

    if (!user) {
      return { ok: false, status: 404, statusText: 'Not Found' };
    }

    if (user.emailVerified) {
      return { ok: false, status: 403, statusText: 'Forbidden' };
    }

    const verificationKey = this.getVerificationKey();
    const topic = 'Account verification!';
    const text = `Key: ${verificationKey}`;

    await this.mailService.sendEmail(user.username, user.email, topic, text);

    return { ok: true, status: 201, statusText: 'Ok' };
  }

  async findOne(id: number): Promise<User> {
    return await this.userRepository.findOneBy({ id });
  }

  async findOneByUsername(username: string): Promise<Omit<User, 'password'>> {
    return await this.userRepository.findOneBy({ username });
  }

  async findUsersByName(searchTerm: string): Promise<User[]> {
    const searchTermLower = searchTerm.toLowerCase();
    return await this.userRepository
      .createQueryBuilder('user')
      .where('LOWER(user.firstName) LIKE :searchTermLower', { searchTermLower })
      .orWhere('LOWER(user.lastName) LIKE :searchTermLower', {
        searchTermLower,
      })
      .getMany();
  }

  async logout(id: number) {
    const currentTime = new Date();

    return await this.userRepository.update(
      { id },
      { accessToken: '', lastActiveDateTime: currentTime },
    );
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return await this.userRepository.update({ id }, updateUserDto);
  }

  async remove(id: number) {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      return;
    }

    return this.userRepository.remove(user);
  }
}
