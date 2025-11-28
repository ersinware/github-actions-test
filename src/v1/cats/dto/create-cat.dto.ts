import { IsEnum, IsInt, IsNotEmpty, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';
import { Gender } from '../enums/gender.enum';

export class CreateCatDto {
  /**
   * The name of the cat
   * @example Mittens
   */
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(20)
  readonly name!: string;

  /**
   * The age of the cat
   * @example 3
   */
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  @Max(30)
  readonly age!: number;

  /**
   * The breed of the cat
   * @example Siamese
   */
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  readonly breed!: string;

  /**
   * The gender of the cat
   * @example Male
   */
  @IsNotEmpty()
  @IsEnum(Gender)
  readonly gender!: Gender;
}
