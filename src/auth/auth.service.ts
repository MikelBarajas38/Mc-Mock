import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  // mock validation methods
  validateApiKey(apiKey: string): boolean {
    const validKeys = ['test_mcd_api_key_123', 'prod_mcd_api_key_456'];
    return validKeys.includes(apiKey);
  }

  generateMockToken(clientId: string) {
    const payload = { clientId, sub: clientId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
