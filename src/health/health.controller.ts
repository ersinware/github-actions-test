import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ACTIVE_VERSIONS } from 'src/common/configs/api-versions.config';

@ApiTags('health')
@Controller({
  path: 'healthcheck',
  version: ACTIVE_VERSIONS,
})
export class HealthController {
  @Get()
  @ApiOperation({
    summary: 'Health check endpoint.',
    description: 'Returns the health status of the API service.',
  })
  @ApiOkResponse({ description: 'Service is healthy and running.' })
  healthCheck(): void {}
}
