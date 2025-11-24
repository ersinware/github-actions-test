import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('health')
@Controller('healthcheck')
export class HealthController {
  @Get()
  @ApiOperation({
    operationId: 'healthCheck',
    summary: 'Health check endpoint',
    description: 'Returns the health status of the API service.',
  })
  @ApiResponse({
    status: 200,
    description: 'Service is healthy and running.',
  })
  check(): void {
  }
}