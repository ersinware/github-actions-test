import { IsEnum, IsInt, IsNotEmpty, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';
import { Gender } from '../enums/gender.enum';

export class CatDto {
  /**
   * The name of the cat
   * @example Mittens
   */
  @IsNotEmpty({ message: 'Name should not be empty' })
  @IsString({ message: 'Name must be a string' })
  @MinLength(2, { message: 'Name must be at least 2 characters long' })
  @MaxLength(20, { message: 'Name must be at most 20 characters long' })
  readonly name!: string;

  /**
   * The age of the cat
   * @example 3
   */
  @IsNotEmpty({ message: 'Age should not be empty' })
  @IsInt({ message: 'Age must be an integer' })
  @Min(0, { message: 'Age must be at least 0' })
  @Max(30, { message: 'Age must be at most 30' })
  readonly age!: number;

  /**
   * The breed of the cat
   * @example Siamese
   */
  @IsNotEmpty({ message: 'Breed should not be empty' })
  @IsString({ message: 'Breed must be a string' })
  @MinLength(2, { message: 'Breed must be at least 2 characters long' })
  @MaxLength(50, { message: 'Breed must be at most 50 characters long' })
  readonly breed!: string;

  /**
   * The gender of the cat
   * @example Male
   */
  @IsNotEmpty({ message: 'Gender should not be empty' })
  @IsEnum(Gender, { message: 'Gender must be either Male or Female' })
  readonly gender!: Gender;
}
