import { REQUEST_TOKEN_PAYLOAD_KEY } from '../constants';

export class AuthRequestDto extends Request {
  [REQUEST_TOKEN_PAYLOAD_KEY]: {
    username: string;
    sub: string;
    iat: number;
    exp: number;
  };
}
