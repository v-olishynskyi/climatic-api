import { Injectable } from '@nestjs/common';
import { TypedConfigGetter } from './config.utils';
import { AppConfig } from './config.type';
import { ConfigService } from '@nestjs/config';

// This service is used to provide the typed configuration for the application based on the AppConfig type.
// It is injected into other modules to access the configuration values.
@Injectable()
export class AppConfigService extends TypedConfigGetter<AppConfig> {
  constructor(config: ConfigService<AppConfig>) {
    super(config);
  }
}
