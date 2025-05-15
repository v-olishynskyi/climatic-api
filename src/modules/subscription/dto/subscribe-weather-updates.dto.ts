import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { FrequencyUpdatesEnum } from '../enum';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';

export class SubscribeWeatherUpdatesDto {
  @IsEmail()
  @IsNotEmpty({ message: 'Property "email" should be passed' })
  @ApiProperty({
    name: 'email',
    example: 'email@email.com',
    description: 'Email address to subscribe',
  })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Property "city" should be passed' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @ApiProperty({
    name: 'city',
    example: 'New-York',
    description: 'City for weather updates',
  })
  city: string;

  @IsEnum(FrequencyUpdatesEnum, {
    message: 'Invalid value for frequency. Available values: hourly, daily',
  })
  @IsNotEmpty({ message: 'Property "frequency" should be passed' })
  @ApiProperty({
    name: 'frequency',
    example: 'hourly',
    description:
      'Frequency of updates (hourly or daily). Available values : hourly, daily',
    enum: FrequencyUpdatesEnum,
  })
  frequency: FrequencyUpdatesEnum;
}
