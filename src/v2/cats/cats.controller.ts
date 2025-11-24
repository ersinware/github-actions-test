import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';
import { CatsService } from './cats.service';
import { CreateCatDto } from './dto/create-cat.dto';
import { GetCatsQueryDto } from './dto/get-cats-query.dto';
import { Cat } from './interface/cat.interface';

@ApiTags('cats')
@Controller({
  path: 'cats',
  version: '2',
})
export class CatsControllerV2 {
  constructor(private readonly catsService: CatsService) { }

  @Post()
  @ApiOperation({
    operationId: 'createCat',
    summary: 'Creates a new cat',
    description:
      'Creates a new cat entry in the system with the provided details.',
  })
  @ApiBody({
    description: 'Details of the cat to be created',
    type: CreateCatDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Successfully created a cat.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request. Invalid input data.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden.',
  })
  create(@Body() dto: CreateCatDto): string {
    this.catsService.create(dto);

    return 'This action adds a new cat';
  }

  @Get()
  @ApiOperation({
    operationId: 'findAllCats',
    summary: 'Retrieve all cats',
    description: 'Fetches and returns a list of all cats stored in the system.',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved list of cats.',
    type: [CreateCatDto],
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request. Invalid query parameters (e.g. non-numeric limit).',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden.',
  })
  findAll(@Query() query: GetCatsQueryDto): Cat[] {
    return this.catsService.findAll(query.limit);
  }

  @Get(':name')
  @ApiOperation({
    operationId: 'findOneCat',
    summary: 'Get a specific cat',
    description: 'Retrieves details of a specific cat by its name.',
  })
  @ApiParam({
    required: true,
    name: 'name',
    description: 'The name of the cat to retrieve',
    example: 'Garfield',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved cat.',
    type: CreateCatDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden.',
  })
  @ApiResponse({
    status: 404,
    description: 'Cat not found.',
  })
  findOne(@Param('name') name: string): CreateCatDto {
    return this.catsService.findOne(name);
  }
}
