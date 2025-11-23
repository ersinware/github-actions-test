import { Body, Controller, Get, Post } from '@nestjs/common';
import { CatsService } from './cats.service';
import { CreateCatDto } from './dto/create-cat.dto';
import { Cat } from './interface/cat.interface';

@Controller('cats')
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @Post()
  create(@Body() dto: CreateCatDto): string {
    this.catsService.create(dto);

    return 'This action adds a new cat';
  }

  @Get()
  findAll(): Cat[] {
    return this.catsService.findAll();
  }
}
