import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  Min,
  MinLength,
} from 'class-validator';
import { Gender } from '../enums/gender.enum';

export class CreateCatDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @ApiProperty({
    required: true,
    type: 'string',
    description: 'The name of the cat',
    minLength: 2,
    example: 'Mittens'
  })
  readonly name!: string;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  @ApiProperty({
    required: true,
    type: 'integer',
    description: 'The age of the cat',
    minimum: 0,
    example: 3
  })
  readonly age!: number;

  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @ApiProperty({
    required: true,
    type: 'string',
    description: 'The breed of the cat',
    minLength: 2,
    example: 'Siamese'
  })
  readonly breed!: string;

  @IsNotEmpty()
  @IsEnum(Gender)
  @ApiProperty({
    required: true,
    enum: Gender,
    description: 'The gender of the cat',
    example: 'Male'
  })
  readonly gender!: Gender;
}
