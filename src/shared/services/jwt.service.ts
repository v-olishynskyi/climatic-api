import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtSignOptions, JwtVerifyOptions } from '@nestjs/jwt';
import { SigningOptions } from 'crypto';

@Injectable()
export class JwtTokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  private getSecret(): string {
    const secret = this.configService.get<string>('JWT_SECRET');
    if (!secret) {
      throw new Error('JWT secret is not defined in configuration');
    }
    return secret;
  }

  signAsync(
    payload: Record<string, unknown>,
    options?: Omit<JwtSignOptions, keyof SigningOptions>,
  ): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret: this.getSecret(),
      ...options,
    });
  }

  sign(
    payload: Record<string, unknown>,
    options?: Omit<JwtSignOptions, keyof SigningOptions>,
  ): string {
    return this.jwtService.sign(payload, {
      secret: this.getSecret(),
      ...options,
    });
  }

  verifyAsync<T extends object>(
    token: string,
    options?: JwtVerifyOptions,
  ): Promise<T> {
    return this.jwtService.verifyAsync<T>(token, {
      secret: this.getSecret(),
      ...options,
    });
  }

  verify<T extends object>(token: string, options?: JwtVerifyOptions): T {
    return this.jwtService.verify<T>(token, {
      secret: this.getSecret(),
      ...options,
    });
  }
}
