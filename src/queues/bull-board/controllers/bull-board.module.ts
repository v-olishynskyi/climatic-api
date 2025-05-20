// src/infrastructure/bull-board/bull-board.module.ts

import { Module } from '@nestjs/common';
import { BullBoardController } from './bull-board.controller';
import { AppConfigModule } from '../../../config/config.module';

@Module({
  imports: [AppConfigModule],
  controllers: [BullBoardController],
})
export class BullBoardModule {}
