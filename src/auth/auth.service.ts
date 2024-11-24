import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { SignInDto } from './dto/sign-in.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { HashingService } from 'src/common/hashing/hashing.service';

@Injectable()
export class AuthService {
  private jwtExpirationTimeInSeconds: number;

  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly hashingService: HashingService,
  ) {
    this.jwtExpirationTimeInSeconds = +this.configService.get<number>(
      'JWT_EXPIRATION_TIME',
    );
  }

  async signIn(signIn: SignInDto): Promise<AuthResponseDto> {
    const { userName, password } = signIn;

    const foundUser = await this.userService.findByUserName(userName);

    if (!foundUser) {
      throw new HttpException(
        'UserName or Password invalid',
        HttpStatus.FORBIDDEN,
      );
    }

    const passwordIsValid = await this.hashingService.compare(
      password,
      foundUser?.passwordHash,
    );

    if (!passwordIsValid) {
      throw new HttpException(
        'UserName or Password invalid',
        HttpStatus.FORBIDDEN,
      );
    }

    const payload = { userName: foundUser.userName, sub: foundUser.id };
    const token = this.jwtService.sign(payload);

    return { accessToken: token, expiresIn: this.jwtExpirationTimeInSeconds };
  }
}
