import { Module } from '@nestjs/common';
import { AppConfigService } from './shared-config.service';

@Module({
  providers: [AppConfigService],
  exports: [AppConfigService],
})
export class AppConfigModule {}
