import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNotEmpty, IsString, Min, MinLength } from 'class-validator';
import { Gender } from '../enums/gender.enum';

export class CreateCatDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @ApiProperty({
    required: true,
    description: 'The name of the cat',
    example: 'Mittens',
    minLength: 2,
  })
  readonly name!: string;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  @ApiProperty({
    required: true,
    description: 'The age of the cat',
    example: 3,
    minimum: 0
  })
  readonly age!: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    required: true,
    description: 'The breed of the cat',
    example: 'Siamese',
    minLength: 2
  })
  readonly breed!: string;

  @IsNotEmpty()
  @IsEnum(Gender)
  @ApiProperty({
    required: true,
    description: 'The gender of the cat', 
    example: 'Male',
    enum: Gender
  })
  readonly gender!: Gender; 
}
