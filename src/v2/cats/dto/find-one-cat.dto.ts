import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength, MaxLength } from 'class-validator';

export class FindOneCatDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(20)
  @ApiProperty({
    required: true,
    type: 'string',
    name: 'name',
    description: 'The name of the cat to retrieve',
    minLength: 2,
    maxLength: 20,
    example: 'Garfield',
  })
  readonly name!: string;
}
