import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class GetCatsQueryDto {
  /**
   * Maximum number of cats to return
   * @example 5
   */
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Limit must be an integer' })
  @Min(1, { message: 'Limit must be at least 1' })
  @Max(100, { message: 'Limit must be at most 100' })
  readonly limit?: number;
}
