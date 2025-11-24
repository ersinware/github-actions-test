import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

export class GetCatsQueryDto {
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @ApiProperty({
        required: false,
        type: 'integer',
        description: 'Maximum number of cats to return',
        minimum: 1,
        example: 5
    })
    readonly limit?: number;
}