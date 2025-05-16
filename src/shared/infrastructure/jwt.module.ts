import { Module } from '@nestjs/common';
import { JwtTokenService } from '../services/jwt.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        global: true,
        secret: configService.get('JWT_SECRET'),
      }),
    }),
  ],
  providers: [JwtTokenService],
  exports: [JwtTokenService, JwtModule],
})
export class JwtTokenModule {}
