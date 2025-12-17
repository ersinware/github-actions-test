import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class FindOneCatDto {
  /**
   * The name of the cat to retrieve
   * @example Garfield
   */
  @IsNotEmpty({ message: 'Name should not be empty' })
  @IsString({ message: 'Name must be a string' })
  @MinLength(2, { message: 'Name must be at least 2 characters long' })
  @MaxLength(20, { message: 'Name must be at most 20 characters long' })
  readonly name!: string;
}
