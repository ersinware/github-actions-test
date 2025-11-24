import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class GetCatsQueryDto {
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(100)
    @ApiProperty({
        required: false,
        type: 'integer',
        description: 'Maximum number of cats to return',
        minimum: 1,
        maximum: 100,
        example: 5
    })
    readonly limit?: number;
}