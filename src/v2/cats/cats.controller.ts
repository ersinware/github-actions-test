import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CatsService } from './cats.service';
import { CreateCatDto } from './dto/create-cat.dto';
import { Cat } from './interface/cat.interface';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('cats')
@Controller({
  path: 'cats',
  version: '2',
})
export class CatsControllerV2 {
  constructor(private readonly catsService: CatsService) { }

  @Post()
  @ApiOperation({
    summary: 'Creates a new cat',
    description: 'Creates a new cat entry in the system with the provided details.'
  })
  @ApiBody({
    description: 'Details of the cat to be created',
    type: CreateCatDto
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully created a cat.'
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request. Invalid input data.'
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden.'
  })
  create(@Body() dto: CreateCatDto): string {
    this.catsService.create(dto);

    return 'This action adds a new cat';
  }

  @Get()
  @ApiOperation({
    summary: 'Retrieve all cats',
    description: 'Fetches and returns a list of all cats stored in the system.'
  })
  @ApiQuery({
    name: 'limit',
    description: 'Maximum number of cats to return',
    required: false,
    type: Number
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved list of cats.',
    type: [CreateCatDto]
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden.'
  })
  findAll(): Cat[] {
    return this.catsService.findAll();
  }

  @Get(':name')
  @ApiOperation({
    summary: 'Get a specific cat',
    description: 'Retrieves details of a specific cat by its name.'
  })
  @ApiParam({
    required: true,
    name: 'name',
    description: 'The name of the cat to retrieve',
    example: 'Garfield'
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved cat.',
    type: CreateCatDto
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden.'
  })
  @ApiResponse({
    status: 404,
    description: 'Cat not found.'
  })
  findOne(@Param('name') name: string): CreateCatDto {
    return this.catsService.findOne(name);
  }
}
