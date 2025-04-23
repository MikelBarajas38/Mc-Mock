import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'mcdonalds-secret-key-change-in-production',
    });
  }

  async validate(payload: any) {
    if (!payload.clientId) {
      throw new UnauthorizedException();
    }
    return { merchantId: payload.clientId };
  }
}
