import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNotEmpty, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';
import { Gender } from '../enums/gender.enum';

export class CreateCatDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(20)
  @ApiProperty({
    description: 'The name of the cat',
    example: 'Mittens',
  })
  readonly name!: string;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  @Max(30)
  @ApiProperty({
    description: 'The age of the cat',
    example: 3,
  })
  readonly age!: number;

  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  @ApiProperty({
    description: 'The breed of the cat',
    example: 'Siamese',
  })
  readonly breed!: string;

  @IsNotEmpty()
  @IsEnum(Gender)
  @ApiProperty({
    description: 'The gender of the cat',
    example: 'Male',
  })
  readonly gender!: Gender;
}
