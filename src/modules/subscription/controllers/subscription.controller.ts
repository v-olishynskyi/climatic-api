import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Res,
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
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';
import { SubscribeWeatherUpdatesDto } from '../dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
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
    description: 'Subscription successful. Confirmation email sent.',
  })
  @ApiBadRequestResponse({ type: String, description: 'Invalid input' })
  @ApiConflictResponse({
    type: String,
    description: 'Email already subscribed',
  })
  @UseInterceptors(FileFieldsInterceptor([]))
  @UsePipes(new ValidationPipe({ transform: true }))
  @Post('/subscribe')
  async subscribeToWeatherUpdates(
    @Body() subscribeWeatherUpdatesDto: SubscribeWeatherUpdatesDto,
  ): Promise<string> {
    await this.subscriptionService.subscribeToWeatherUpdates(
      subscribeWeatherUpdatesDto,
    );

    return 'Subscription successful. Confirmation email sent.';
  }

  @ApiOperation({
    summary: 'Confirm email subscription',
    description:
      'Confirms a subscription using the token sent in the confirmation email.',
  })
  @ApiOkResponse({
    type: String,
    description: 'Subscription confirmed successfully',
  })
  @ApiBadRequestResponse({ type: String, description: 'Invalid token' })
  @ApiNotFoundResponse({
    type: String,
    description: 'Token not found',
  })
  @ApiParam({
    name: 'token',
    description: 'Confirmation token',
    required: true,
    type: String,
  })
  @Get('/confirm/:token')
  async confirmSubscription(
    @Param('token') token: string,
    @Res() res: Response,
  ): Promise<void> {
    const subsciption =
      await this.subscriptionService.confirmSubscription(token);
    return res.render('confirm-subscription', {
      city: subsciption.city,
      frequency: subsciption.frequency,
    });
  }

  @ApiOperation({
    summary: 'Unsubscribe from weather updates',
    description:
      'Unsubscribes an email from weather updates using the token sent in emails.',
  })
  @ApiOkResponse({
    type: String,
    description: 'Unsubscribed successfully',
  })
  @ApiBadRequestResponse({ type: String, description: 'Invalid token' })
  @ApiNotFoundResponse({
    type: String,
    description: 'Token not found',
  })
  @Get('/unsubscribe/:token')
  async unsubscribeFromWeatherUpdates(
    @Param('token') token: string,
    @Res() res: Response,
  ): Promise<void> {
    const subsciption =
      await this.subscriptionService.unsubscribeFromWeatherUpdates(token);

    return res.render('unsubscribe-confirmation', {
      city: subsciption.city,
      frequency: subsciption.frequency,
    });
  }
}
