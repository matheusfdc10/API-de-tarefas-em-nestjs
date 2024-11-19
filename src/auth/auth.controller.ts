import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { SignInDocument } from './decorators/documentation/sign-in.document';

@Controller('auth')
export class AuthController {
  constructor(private readonly authServece: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @SignInDocument()
  async signIn(@Body() signIn: SignInDto): Promise<AuthResponseDto> {
    return await this.authServece.signIn(signIn);
  }
}
