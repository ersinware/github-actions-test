import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { Gender } from '../enums/gender.enum';

export class CreateCatDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(20)
  @ApiProperty({
    required: true,
    type: 'string',
    description: 'The name of the cat',
    minLength: 2,
    maxLength: 20,
    example: 'Mittens',
  })
  readonly name!: string;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  @Max(30)
  @ApiProperty({
    required: true,
    type: 'integer',
    description: 'The age of the cat',
    minimum: 0,
    maximum: 30,
    example: 3,
  })
  readonly age!: number;

  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  @ApiProperty({
    required: true,
    type: 'string',
    description: 'The breed of the cat',
    minLength: 2,
    maxLength: 50,
    example: 'Siamese',
  })
  readonly breed!: string;

  @IsNotEmpty()
  @IsEnum(Gender)
  @ApiProperty({
    required: true,
    enum: Gender,
    description: 'The gender of the cat',
    example: 'Male',
  })
  readonly gender!: Gender;
}
