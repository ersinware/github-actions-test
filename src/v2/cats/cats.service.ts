import { Injectable } from '@nestjs/common';
import { Cat } from './interface/cat.interface';
import { CreateCatDto } from './dto/create-cat.dto';

@Injectable()
export class CatsService {
  private readonly cats: Cat[] = [];

  create(createCatDto: CreateCatDto): void {
    this.cats.push(createCatDto);
  }

  findAll(): Cat[] {
    return this.cats;
  }

  findOne(name: string): Cat {
    return this.cats.filter((cat) => cat.name === name)[0];
  }
}
