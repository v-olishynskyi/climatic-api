import {
  Body,
  Controller,
  Post,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { SubscriptionService } from '../services/subscription.service';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { SubscribeWeatherUpdatesDto } from '../dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@Controller('')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @ApiOperation({
    summary: 'Subscribe to weather updates',
    description:
      'Subscribe an email to receive weather updates for a specific city with chosen frequency.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: SubscribeWeatherUpdatesDto,
    required: true,
  })
  @ApiOkResponse({
    type: String,
    example: 'Subscription successful. Confirmation email sent.',
  })
  @ApiBadRequestResponse({ type: String, example: 'Invalid input' })
  @ApiConflictResponse({ type: String, example: 'Email already subscribed' })
  @Post('/subscribe')
  @UseInterceptors(FileFieldsInterceptor([]))
  @UsePipes(new ValidationPipe({ transform: true }))
  subscribeToWeatherUpdates(
    @Body() subscribeWeatherUpdatesDto: SubscribeWeatherUpdatesDto,
  ): Promise<string> {
    return this.subscriptionService.subscribeToWeatherUpdates(
      subscribeWeatherUpdatesDto,
    );
  }
}
