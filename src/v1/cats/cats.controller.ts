import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CatsService } from './cats.service';
import { CatDto } from './dto/cat.dto';
import { FindOneCatDto } from './dto/find-one-cat.dto';
import { GetCatsQueryDto } from './dto/get-cats-query.dto';

@ApiTags('cats')
@Controller('cats')
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @Post()
  @ApiOperation({
    summary: 'Creates a new cat',
    description: 'Creates a new cat entry in the system with the provided details.',
  })
  @ApiBody({
    description: 'Details of the cat to be created',
    type: CatDto,
  })
  @ApiCreatedResponse({ description: 'Successfully created a cat.' })
  @ApiBadRequestResponse({ description: 'Invalid input data.' })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  create(@Body() dto: CatDto): string {
    this.catsService.create(dto);

    return 'This action adds a new cat';
  }

  @Get()
  @ApiOperation({
    summary: 'Retrieve all cats',
    description: 'Fetches and returns a list of all cats stored in the system.',
  })
  @ApiOkResponse({ description: 'Successfully retrieved list of cats.', type: [CatDto] })
  @ApiBadRequestResponse({ description: `Invalid query parameter (e.g. non-numeric 'limit').` })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  findAll(@Query() query: GetCatsQueryDto): CatDto[] {
    return this.catsService.findAll(query.limit);
  }

  @Get(':name')
  @ApiOperation({
    summary: 'Get a specific cat',
    description: 'Retrieves details of a specific cat by its name.',
  })
  @ApiOkResponse({ description: 'Successfully retrieved cat.', type: CatDto })
  @ApiBadRequestResponse({ description: `'name' must be longer than or equal to 2 characters.` })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  @ApiNotFoundResponse({ description: 'Cat not found.' })
  findOne(@Param() params: FindOneCatDto): CatDto {
    return this.catsService.findOne(params.name);
  }
}
