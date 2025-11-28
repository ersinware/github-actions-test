import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class FindOneCatDto {
  /**
   * The name of the cat to retrieve
   * @example Garfield
   */
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(20)
  readonly name!: string;
}
